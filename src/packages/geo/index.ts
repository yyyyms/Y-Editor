import type { IMatrixArr } from './type';

export function multiplyMatrix(m1: IMatrixArr, m2: IMatrixArr): IMatrixArr {
  const a1 = m1[0];
  const b1 = m1[1];
  const c1 = m1[2];
  const d1 = m1[3];

  return [
    m2[0] * a1 + m2[1] * c1,
    m2[0] * b1 + m2[1] * d1,
    m2[2] * a1 + m2[3] * c1,
    m2[2] * b1 + m2[3] * d1,
    m2[4] * a1 + m2[5] * c1 + m1[4],
    m2[4] * b1 + m2[5] * d1 + m1[5],
  ];
}
