/* eslint-disable unused-imports/no-unused-vars */
import { genUuid } from '@/packages/common';
import { multiplyMatrix } from '@/packages/geo';
import { identityMatrix } from '@/packages/geo/geoMatrixClass';
import { isPointInTransformedRect } from '@/packages/geo/rect';
import type { IMatrixArr } from '@/packages/geo/type';
import type { IPoint } from '@/types/common';

import { GraphicsType, type Optional } from '../type';
import type { GlobalDocument } from './document';
import type { GraphicsAttrs, IAdvancedAttrs, IGraphicsOpts } from './graphicsAttrs';
import type { IDrawInfo } from './type';

class Graphics< T extends GraphicsAttrs = GraphicsAttrs > {
  attrs: T;
  type = GraphicsType.Graph;
  doc: GlobalDocument;
  private _deleted = false;
  protected children: Graphics[] = [];
  protected isContainer = false;

  constructor(attrs: Omit<Optional<T, 'transform'>, 'id'>, opts: IGraphicsOpts) {
    this.attrs = { ...attrs } as T;
    this.attrs.id ??= genUuid();
    this.attrs.strokeWidth ??= 1;
    this.doc = opts.doc;
    // 处理高级属性转换为transform矩阵
    let transform = attrs.transform ?? identityMatrix();
    if (opts.advancedAttrs) {
      const { x = 0, y = 0, rotate = 0 } = opts.advancedAttrs;
      // 创建包含位置和旋转的变换矩阵
      if (rotate !== 0) {
        // 如果有旋转，需要更复杂的矩阵计算
        const cos = Math.cos(rotate);
        const sin = Math.sin(rotate);
        transform = [cos, sin, -sin, cos, x, y] as IMatrixArr;
      } else {
        transform = [1, 0, 0, 1, x, y] as IMatrixArr;
      }
    }

    this.attrs.transform = transform;
  }

  insertChild(graphics: Graphics, sortIdx?: string) {
    if (!this.isContainer) {
      console.warn(`graphics "${this.type}" is not container`);
      return;
    }

    this.children.push(graphics);
  }

  getChildren() {
    return this.children;
  }

  updateAttrs(attrs: Partial<GraphicsAttrs> & IAdvancedAttrs) {
    this.attrs = { ...this.attrs, ...attrs } as T;

    // 如果更新了高级属性，需要重新计算transform矩阵
    if ('x' in attrs || 'y' in attrs || 'rotate' in attrs) {
      const { x = 0, y = 0, rotate = 0 } = attrs;
      // 创建包含位置和旋转的变换矩阵
      if (rotate !== 0) {
        // 如果有旋转，需要更复杂的矩阵计算
        const cos = Math.cos(rotate);
        const sin = Math.sin(rotate);
        this.attrs.transform = [cos, sin, -sin, cos, x, y] as IMatrixArr;
      } else {
        this.attrs.transform = [1, 0, 0, 1, x, y] as IMatrixArr;
      }
    }
  }

  isDeleted() {
    return this._deleted;
  }

  getSize() {
    return {
      width: this.attrs.width,
      height: this.attrs.height,
    };
  }

  getStrokeWidth() {
    return this.attrs.strokeWidth ?? 0;
  }

  getWorldTransform(): IMatrixArr {
    const parent = this.getParent();
    if (!parent) {
      return [...this.attrs.transform];
    }
    return multiplyMatrix(parent.getWorldTransform(), this.attrs.transform);
  }

  getParentId() {
    return this.attrs.parentIndex?.guid;
  }

  getParent() {
    const parentId = this.getParentId();
    if (!parentId) {
      return undefined;
    }
    return this.doc.getGraphicsById(parentId);
  }

  hitTest(point: IPoint, tol = 0) {
    return isPointInTransformedRect(
      point,
      {
        ...this.getSize(),
        transform: this.getWorldTransform(),
      },
      tol + this.getStrokeWidth() / 2,
    );
  }

  getHitGraphics(point: IPoint): Graphics | null {
    if (this.hitTest(point)) {
      return this;
    }
    return null;
  }

  isVisible() {
    return this.attrs.visible ?? true;
  }

  draw(drawInfo: IDrawInfo) {
    const { ctx } = drawInfo;
    ctx.save();
    for (const child of this.children) {
      child.draw(drawInfo);
    }
    ctx.restore();
  }

  drawOutline(
    ctx: CanvasRenderingContext2D,
    stroke: string,
    strokeWidth: number,
  ) {
    // const { width, height } = this.attrs;
    // ctx.transform(...this.getWorldTransform());
    // ctx.strokeStyle = stroke;
    // ctx.lineWidth = strokeWidth;
    // ctx.beginPath();
    // ctx.rect(0, 0, width, height);
    // ctx.stroke();
    // ctx.closePath();
  }
}
export default Graphics;
