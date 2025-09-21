import { throttle } from 'lodash-es';

import type { IPoint } from '@/types/common';

import type { ICursor } from '../../cursorManager';
import type YEditor from '../../editor';
import type { IBaseTool, ITool } from '../type';
import { DrawSelectionTool } from './selection';
import { getTopHitElement } from './utils';

const TYPE = 'select';
const HOTKEY = 'v';

class SelectTool implements ITool {
  static readonly type = TYPE;
  readonly type = TYPE;
  readonly hotkey = HOTKEY;
  cursor: ICursor = 'default';

  private startPoint: IPoint = { x: -1, y: -1 };
  private currStrategy: IBaseTool | null = null;
  private editor: YEditor;
  private strategyDrawSelection: DrawSelectionTool;

  constructor(editor: YEditor) {
    this.editor = editor;
    this.strategyDrawSelection = new DrawSelectionTool(editor);
  }

  handleHoverItemChange = () => {
    if (!this.editor.toolManager.isDragging()) {
      this.editor.render();
    }
  };

  onActive() {
    this.editor.selectedElements.on(
      'hoverItemChange',
      this.handleHoverItemChange,
    );
  };

  onInactive: () => void = () => {};

  onEnd(e: PointerEvent, isDragHappened: boolean) {
    const { currStrategy } = this;
    if (currStrategy) {
      currStrategy.onEnd(e, isDragHappened);
      currStrategy.onInactive();
    } else {
      throw new Error('没有根据判断选择策略，代码有问题');
    }
  }

  afterEnd(e: PointerEvent, isDragHappened: boolean) {
    this.currStrategy?.afterEnd(e, isDragHappened);
    this.currStrategy = null;
  }

  onMoveExcludeDrag(e: PointerEvent, isOutsideCanvas: boolean) {
    if (!isOutsideCanvas) {
      const point = this.editor.getSceneCursorXY(e);
      this.updateCursorAndHlHoverGraph(point);
    }
  }

  private updateCursorAndHlHoverGraph = throttle((point: IPoint) => {
    const topHitElement = getTopHitElement(this.editor, point);
    this.editor.selectedElements.setHoverItem(topHitElement);
  }, 20);

  onStart(e: PointerEvent) {
    this.currStrategy = null;
    // 1. 直接选中一个元素
    // 2. 没选中，拖拽，产生选区
    // 3. 选中缩放或旋转控制点
    // 4. 选中 选中框 内部
    // 5. 按住 shift 键，可进行连选
    this.startPoint = this.editor.getSceneCursorXY(e);
    const { selectedElements } = this.editor;

    const isInsideSelectedBox = this.editor.selectedBox.hitTest(
      this.startPoint,
    );
    const topHitElement = getTopHitElement(this.editor, this.startPoint);

    // 1. 鼠标落下时，点击到选中框内部
    if (isInsideSelectedBox) {
      // 进去拖拽移动场景
    } else {
      // debugger;
      // 2. 点中一个元素
      if (topHitElement) {
        // 单选
        selectedElements.setItems([topHitElement]);
        // 渲染出选中框
        this.editor.sceneRenderer.render();
      } else {
        // 3.点击空白区域
        this.currStrategy = this.strategyDrawSelection;
      }

      // 进入拖动移动场景
    }

    if (this.currStrategy) {
      this.currStrategy.onActive();
      this.currStrategy.onStart(e);
    } else {
      throw new Error('没有根据判断选择策略，代码有问题');
    }
  }

  onDrag(e: PointerEvent) {
    this.currStrategy?.onDrag(e);
  }
}
export default SelectTool;
