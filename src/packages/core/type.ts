export enum GraphicsType {
  Graph = 'Graph',
  Rect = 'Rect',
  Ellipse = 'Ellipse',
  Text = 'Text',
  Line = 'Line',
  Path = 'Path',
  RegularPolygon = 'RegularPolygon',
  Star = 'Star',
  Frame = 'Frame',
  Canvas = 'Canvas',
  Document = 'Document',
}
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
