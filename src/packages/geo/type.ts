export type IMatrixArr = [
    a: number,
    b: number,
    c: number,
    d: number,
    tx: number,
    ty: number,
];

export interface IRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface IBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export interface ITransformRect {
  width: number;
  height: number;
  transform: IMatrixArr;
}
