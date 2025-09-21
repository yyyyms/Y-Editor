import type { IPoint } from '@/types/common';

import type YEditor from '../../editor';
import type { IBaseTool } from '../type';

class GraphicsMoveTool implements IBaseTool {
  private editor: YEditor;
  private dragPoint: IPoint;
  private startPoint: IPoint;
  private lastPoint: IPoint | null;

  constructor(editor: YEditor) {
    this.editor = editor;
    this.dragPoint = { x: -1, y: -1 };
    this.startPoint = { x: -1, y: -1 };
    this.lastPoint = null;
  }

  onInactive() {

  }

  onActive() {

  }

  onStart(event: MouseEvent) {
    this.startPoint = this.editor.getSceneCursorXY(event);
  }

  onDrag(event: PointerEvent) {
    this.dragPoint = this.editor.getCursorXY(event);
    this.move();
  }

  move() {
    const currScenePoint = this.editor.toScenePt(
      this.dragPoint!.x,
      this.dragPoint!.y,
    );
    const lastPox = this.lastPoint ?? this.startPoint;
    const dx = currScenePoint.x - lastPox.x;
    const dy = currScenePoint.y - lastPox.y;
    // console.log(dx, dy);

    const selectedItems = this.editor.selectedElements.getItems();

    for (const graphics of selectedItems) {
      const { attrs } = graphics;
      graphics.updateAttrs({
        x: attrs.transform[4] + dx,
        y: attrs.transform[5] + dy,
      });
    }
    this.editor.render();
    this.lastPoint = currScenePoint;
  }

  onEnd() {

  }

  afterEnd() {
    this.lastPoint = null;
  }
}
export default GraphicsMoveTool;
