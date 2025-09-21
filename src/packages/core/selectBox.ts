/* eslint-disable no-case-declarations */
import type { IPoint } from '@/types/common';

import type YEditor from './editor';
import { rectToVertices } from '../geo/rect';
import type { ITransformRect } from '../geo/type';

class SelectedBox {
  private editor: YEditor;
  private box: ITransformRect | null = null;

  constructor(editor: YEditor) {
    this.editor = editor;
  }

  updateBox() {
    const { selectedElements } = this.editor;

    const size = selectedElements.size();

    if (size > 0) {
      switch (size) {
        case 1:

          const item = selectedElements.getItems()[0];
          this.box = {
            width: item.attrs.width,
            height: item.attrs.height,
            transform: item.getWorldTransform(),
          };
          break;
        default:
          break;
      }
    } else {
      this.box = null;
    }
    return this.box;
  }

  draw() {
    if (this.box) {
      const polygon = rectToVertices(
        {
          x: 0,
          y: 0,
          width: this.box.width,
          height: this.box.height,
        },
        this.box.transform,
      ).map(point => this.editor.toViewportPt(point.x, point.y));
      // 渲染到相对视口的位置
      const { ctx } = this.editor;
      this.drawBox(ctx, polygon);
    }
  }

  private drawBox(ctx: CanvasRenderingContext2D, polygon: IPoint[]) {
    const stroke = this.editor.setting.getSettingValue('selectBoxStroke');
    const strokeWidth = this.editor.setting.getSettingValue('selectBoxStrokeWidth');
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.translate(0.5, 0.5);
    ctx.beginPath();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.moveTo(polygon[0].x, polygon[0].y);
    polygon.forEach((point, index) => {
      if (index > 0) {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.closePath();
    ctx.stroke();
    ctx.restore();
  }

  hitTest(_point: IPoint) {
    if (!this.box) {
      return false;
    }
  }
}
export default SelectedBox;
