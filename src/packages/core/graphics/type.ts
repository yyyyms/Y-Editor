import type { IBox } from '@/packages/geo/type';

export const GraphicsObjectSuffix = {
  Rect: 'Rect',
  Ellipse: 'Ellipse',
  Line: 'Line',
  RegularPolygon: 'Polygon',
  Star: 'Star',
  Path: 'Path',
  Text: 'Text',
  Group: 'Group',
  Frame: 'Frame',
};
export interface IDrawInfo {
  ctx: CanvasRenderingContext2D;
  smooth?: boolean;
  opacity?: number;
  viewportArea?: IBox;
}
