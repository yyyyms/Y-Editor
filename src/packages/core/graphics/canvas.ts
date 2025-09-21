import type { Matrix } from '@/packages/geo/geoMatrixClass';
import type { IPoint } from '@/types/common';

import { GraphicsType, type Optional } from '../type';
import type { GraphicsAttrs, IGraphicsOpts } from './graphicsAttrs';

import Graphics from '.';

type CanvasAttrs = GraphicsAttrs;

export class CanvasGraphics extends Graphics<CanvasAttrs> {
  override type = GraphicsType.Canvas;
  protected override isContainer = true;

  lastSelectedIds = new Set<string>();
  lastMatrix: Matrix | null = null;

  constructor(
    attrs: Optional<
      Omit<CanvasAttrs, 'width' | 'height'>,
      'id' | 'transform'
    >,
    opts: IGraphicsOpts,
  ) {
    super({ ...attrs, width: 0, height: 0, type: GraphicsType.Canvas }, opts);
  }

  override getHitGraphics(point: IPoint): Graphics | null {
    const children = this.getChildren();
    for (const child of children) {
      const hitGraphics = child.getHitGraphics(point);
      if (hitGraphics) {
        return hitGraphics;
      }
    }
    return null;
  }
}

export function isCanvasGraphics(graphics: Graphics): graphics is CanvasGraphics {
  return graphics instanceof CanvasGraphics;
}
