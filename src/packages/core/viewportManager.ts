/* eslint-disable prefer-const */
import type { IPoint, ISize } from '@/types/common';

import type YEditor from './editor';
import { Matrix } from '../geo/geoMatrixClass';
import type { IBox } from '../geo/type';

/**
 * 可视区管理
 * 画板移动 缩放等走这里
 * 下游绘制方法实现时兼容矩阵的变换
 */
class ViewportManager {
  private viewMatrix = new Matrix();
  private editor: YEditor;
  private zoom: number;

  constructor(editor: YEditor) {
    this.editor = editor;
    this.zoom = 1; // 先写死，后面引入矩阵缩放
  }

  toScenePt(x: number, y: number, round = false) {
    const scenePt = this.viewMatrix.applyInverse({ x, y });
    if (round) {
      scenePt.x = Math.round(scenePt.x);
      scenePt.y = Math.round(scenePt.y);
    }
    return scenePt;
  }

  getViewMatrix() {
    return this.viewMatrix.clone();
  }

  toViewportPt(x: number, y: number) {
    return this.viewMatrix.apply({ x, y });
  }

  getSceneBbox(): IBox {
    const { width, height } = this.getPageSize();
    const { x: minX, y: minY } = this.viewMatrix.applyInverse({ x: 0, y: 0 });
    const { x: maxX, y: maxY } = this.viewMatrix.applyInverse({
      x: width,
      y: height,
    });
    return { minX, minY, maxX, maxY };
  }

  getPageSize() {
    return {
      width: Number.parseFloat(this.editor.canvasElement.style.width),
      height: Number.parseFloat(this.editor.canvasElement.style.height),
    };
  }

  // 调整视口大小
  setViewportSize({ width, height }: ISize) {
    this.editor.canvasElement.width = width;
    this.editor.canvasElement.style.width = `${width}px`;
    this.editor.canvasElement.height = height;
    this.editor.canvasElement.style.height = `${height}px`;
  }

  // 画板平移调整
  translate(dx: number, dy: number) {
    const newViewMatrix = this.viewMatrix.clone().translate(dx, dy);
    this.setViewMatrix(newViewMatrix);
  }

  setViewMatrix(viewMatrix: Matrix) {
    this.viewMatrix = viewMatrix;
  }

  getZoom() {
    return this.viewMatrix.a;
  }

  zoomOut(opts: { center: IPoint; deltaY: number }) {
    const prevZoom = this.getZoom();
    let zoom: number;
    const zoomStep = opts?.deltaY
      ? deltaYToZoomStep(opts.deltaY)
      : this.editor.setting.getSettingValue('zoomStep');
    zoom = Math.max(
      prevZoom / (1 + zoomStep),
      this.editor.setting.getSettingValue('zoomMin'),
    );

    this.setZoom(zoom, opts.center);
  }

  setZoom(zoom: number, center: IPoint) {
    const deltaZoom = zoom / this.getZoom();
    const newViewMatrix = this.viewMatrix
      .clone()
      .translate(-center.x, -center.y)
      .scale(deltaZoom, deltaZoom)
      .translate(center.x, center.y);
    this.setViewMatrix(newViewMatrix);
  }

  zoomIn(opts: { center: IPoint; deltaY: number }) {
    const prevZoom = this.getZoom();

    let zoom: number;
    const zoomStep = opts?.deltaY
      ? deltaYToZoomStep(opts.deltaY)
      : this.editor.setting.getSettingValue('zoomStep');
    zoom = Math.min(
      prevZoom * (1 + zoomStep),
      this.editor.setting.getSettingValue('zoomMax'),
    );
    this.setZoom(zoom, opts.center);
  }
}

function deltaYToZoomStep(deltaY: number) {
  return Math.max(0.05, 0.12937973 * Math.log(Math.abs(deltaY)) - 0.33227472);
}

export default ViewportManager;
