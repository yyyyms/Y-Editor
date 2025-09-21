import type { ISize } from '@/types/common';

import type YEditor from './editor';
import { Matrix } from '../geo/geoMatrixClass';
import type { IBox } from '../geo/type';

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

  getZoom() {
    return this.zoom;
  }
}

export default ViewportManager;
