// import { type IPoint, getRectByTwoPoint } from '@suika/geo';

import { getRectByTwoPoint } from '@/packages/geo/rect';
import type { IPoint } from '@/types/common';

import type { YEditor } from '../../editor';
// import type { SuikaGraphics } from '../../graphics';
// import { getParentIdSet } from '../../utils';
import type { IBaseTool } from '../type';
// import { getElementsInSelection } from './utils';

/**
 * 绘制拖拽选中框
 */
export class DrawSelectionTool implements IBaseTool {
  private startPoint: IPoint = { x: -1, y: -1 };
  private isShiftPressingWhenStart = false;
  //   private startSelectedGraphs: SuikaGraphics[] = [];
  private startPointWhenSpaceDown: IPoint | null = null;
  private lastDragPointWhenSpaceDown: IPoint | null = null;
  private lastMouseScenePoint!: IPoint;
  private lastMousePoint!: IPoint;
  private editor: YEditor;

  constructor(editor: YEditor) {
    this.editor = editor;
  }

  onActive() {}

  onInactive() {}

  onStart(e: PointerEvent) {
    this.isShiftPressingWhenStart = false;

    // 需要清除所有选中元素
    this.editor.selectedElements.clear();

    this.startPoint = this.editor.getSceneCursorXY(e);

    this.editor.render();
    this.editor.sceneRenderer.setSelection(this.startPoint);
  }

  onDrag(e: PointerEvent) {
    this.lastMouseScenePoint = this.editor.getSceneCursorXY(e);
    this.lastMousePoint = this.lastMouseScenePoint;
    this.updateSelectionAndSelectSet();
  }

  private updateSelectionAndSelectSet() {
    const box = getRectByTwoPoint(this.startPoint, this.lastMouseScenePoint);
    this.editor.sceneRenderer.setSelection(box);
    this.editor.render();
  }

  onEnd() {
  }

  afterEnd() {
    this.isShiftPressingWhenStart = false;
    this.editor.sceneRenderer.selection = null;
    this.editor.render();
  }

  onSpaceToggle() {

  }
}
