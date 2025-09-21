import type { IPoint } from '@/types/common';

import { Matrix } from './geoMatrixClass';
import type { IMatrixArr, IRect } from './type';

export function getRectByTwoPoint(point1: IPoint, point2: IPoint) {
  const { x: x1, y: y1 } = point1;
  const { x: x2, y: y2 } = point2;
  const width = Math.abs(x1 - x2);
  const height = Math.abs(y1 - y2);
  return { x: Math.min(x1, x2), y: Math.min(y1, y2), width, height };
}

export function normalizeRect({ x, y, width, height }: IRect): IRect {
  const x2 = x + width;
  const y2 = y + height;
  return getRectByTwoPoint({ x, y }, { x: x2, y: y2 });
}

export function rectToVertices(rect: IRect, tf?: IMatrixArr): IPoint[] {
  const { x, y, width, height } = rect;
  let pts = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height },
  ];
  if (tf) {
    const matrix = new Matrix(...tf);
    pts = pts.map((point) => {
      const pt = matrix.apply(point);
      return { x: pt.x, y: pt.y };
    });
  }
  return pts;
}
export function isPointInTransformedRect(point: IPoint, rect: {
  width: number;
  height: number;
  transform?: IMatrixArr;
}, tol = 0) {
  if (rect.transform) {
    const matrix = new Matrix(...rect.transform);
    point = matrix.applyInverse(point);
  }

  return (
    point.x >= -tol
    && point.y >= -tol
    && point.x <= rect.width + tol
    && point.y <= rect.height + tol
  );
}
