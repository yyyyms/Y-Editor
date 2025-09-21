import { normalizeRect } from '@/packages/geo/rect';
import type { IRect } from '@/packages/geo/type';
import type { IPoint } from '@/types/common';

import type { ICursor } from '../cursorManager';
import type YEditor from '../editor';
import type { IKey } from '../keyBindingManager';
import type { ITool } from './type';
import type Graphics from '../graphics';
import { SnapHelper } from '../snap';

/**
 * 抽象一个图形绘制的基类
 */
export abstract class AbstractDrawGraphicsTool implements ITool {
  hotkey: string | IKey;
  type: string;
  cursor: ICursor;
  protected editor: YEditor;
  private startPoint!: IPoint;
  private lastDragPoint!: IPoint;
  private lastDragPointInViewport!: IPoint;
  protected drawingGraphics: Graphics | null = null;
  private isDragging = false;
  private lastMousePoint!: IPoint;

  protected abstract createGraphics(rect: IRect, parent: Graphics): Graphics;
  constructor(editor: YEditor) {
    this.type = '';
    this.hotkey = '';
    this.cursor = 'crosshair' as ICursor;
    this.editor = editor;
  }

  onMoveExcludeDrag: (event: PointerEvent, isOutsideCanvas: boolean) => void = () => {};
  onActive: () => void = () => {};

  onInactive: () => void = () => {};
  onStart(event: PointerEvent) {
    this.startPoint = SnapHelper.getSnapPtBySetting(
      this.editor.getSceneCursorXY(event),
      this.editor.setting,
    );
    // this.startPoint = this.editor.getSceneCursorXY(event);
    this.drawingGraphics = null;
    this.isDragging = false;
  };

  onDrag(event: PointerEvent) {
    this.lastDragPointInViewport = this.editor.getCursorXY(event);
    this.lastDragPoint = this.lastMousePoint = SnapHelper.getSnapPtBySetting(
      this.editor.getSceneCursorXY(event),
      this.editor.setting,
    );
    this.isDragging = true;
    this.updateRect();
  };

  private updateRect() {
    const { x, y } = this.lastDragPoint;
    const { x: xS, y: yS } = this.startPoint;
    const width = x - xS;
    const height = y - yS;
    const rect = { x: xS, y: yS, width, height };
    const { sceneRenderer } = this.editor;

    if (this.drawingGraphics) {
      this.updateGraphics(rect);
    } else {
      const currentCanvas = this.editor.doc.getCurrentCanvas();
      const parent = currentCanvas;

      const graphics = this.createGraphics(rect, parent);

      sceneRenderer.addItems([graphics]);
      parent.insertChild(graphics);
      this.drawingGraphics = graphics;
      this.editor.selectedElements.setItems([graphics]);
    }
    this.editor.render();
  }

  updateGraphics(rect: IRect) {
    rect = normalizeRect(rect);
    const drawingShape = this.drawingGraphics!;

    const { x } = rect;
    const { y } = rect;

    drawingShape.updateAttrs({
      x,
      y,
      width: rect.width,
      height: rect.height,
    });
  }

  onEnd(_event: PointerEvent) {

  };

  afterEnd() {
    this.isDragging = false;
    if (
      this.drawingGraphics
      && !this.editor.setting.getSettingValue('keepToolSelectedAfterUse')
    ) {
      this.editor.toolManager.setActiveTool('select');
    }
  };
}
