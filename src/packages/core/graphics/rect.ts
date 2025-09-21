/* eslint-disable unused-imports/no-unused-vars */
import { parseHexToRGBA, parseRGBAStr } from '@/packages/common';
import type { IMatrixArr } from '@/packages/geo/type';

import { GraphicsType, type Optional } from '../type';
import type { GraphicsAttrs, IGraphicsOpts } from './graphicsAttrs';
import type { IDrawInfo } from './type';
import { type IPaint, PaintType } from '../paint';

import Graphics from '.';

export interface RectAttrs extends GraphicsAttrs {
  cornerRadius?: number;
}
class RectGraphics extends Graphics {
  override type = GraphicsType.Rect;

  constructor(
    attrs: Optional<RectAttrs, 'transform' | 'id'>,
    opts: IGraphicsOpts,
  ) {
    super(
      {
        ...attrs,
        type: GraphicsType.Rect,
      },
      opts,
    );
  }

  private _realDraw(
    drawInfo: IDrawInfo,
    overrideStyle?: {
      fill?: IPaint[];
      stroke?: IPaint[];
      strokeWidth?: number;
      transform: IMatrixArr;
    },
  ) {
    const { ctx, smooth } = drawInfo;
    const { attrs } = this;
    const { fill, strokeWidth, stroke, transform }
      = overrideStyle || this.attrs;

    ctx.save();// 先存一下

    ctx.transform(...transform); // 处理变换

    const draw = (layerCtx: CanvasRenderingContext2D) => {
      layerCtx.beginPath();
      if (attrs.cornerRadius) {
        layerCtx.roundRect(0, 0, attrs.width, attrs.height, attrs.cornerRadius);
      } else {
        layerCtx.rect(0, 0, attrs.width, attrs.height);
      }

      for (const paint of fill ?? []) {
        if (paint.visible === false) {
          continue;
        }
        switch (paint.type) {
          case PaintType.Solid: {
            layerCtx.fillStyle = parseRGBAStr(paint.attrs);
            layerCtx.fill();
            break;
          }
          case PaintType.Image: {
            // TODO: stroke image
          }
        }
      }

      if (strokeWidth) {
        layerCtx.lineWidth = strokeWidth;
        for (const paint of stroke ?? []) {
          if (paint.visible === false) {
            continue;
          }
          switch (paint.type) {
            case PaintType.Solid: {
              layerCtx.strokeStyle = parseRGBAStr(paint.attrs);
              layerCtx.stroke();
              break;
            }
            case PaintType.Image: {
              // TODO: stroke image
            }
          }
        }
      }

      layerCtx.closePath();
    };

    const opacity = drawInfo.opacity ?? 1;
    if (opacity < 1) {
      ctx.globalAlpha = opacity;
    }

    draw(ctx); // 绘制

    ctx.restore(); // 重置
  }

  override draw(drawInfo: IDrawInfo) {
    this._realDraw({ ...drawInfo, opacity: 1 });
  }

  override drawOutline(
    ctx: CanvasRenderingContext2D,
    stroke: string,
    strokeWidth: number,
  ) {
    this._realDraw(
      { ctx },
      {
        stroke: [{ type: PaintType.Solid, attrs: parseHexToRGBA(stroke)! }],
        strokeWidth,
        transform: this.getWorldTransform(),
      },
    );
  }
}
export default RectGraphics;
