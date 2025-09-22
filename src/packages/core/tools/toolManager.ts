/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable new-cap */
import { EventEmitter } from '@/packages/common';
import type { IPoint } from '@/types/common';

import type YEditor from '../editor';
import DrawRectTool from './drawRect';
import SelectTool from './select';
import type { ITool, IToolClassConstructor } from './type';

interface Events {
  switchTool: (type: string) => void;
  changeEnableTools: (toolTypes: string[]) => void;
}
class ToolManager {
  private toolCtorMap = new Map<string, IToolClassConstructor>();
  private editor: YEditor;
  private currentTool: ITool | null = null;
  private _isDragging = false;
  private eventEmitter = new EventEmitter<Events>();
  private enableToolTypes: string[] = ['select', 'drawRect'];
  private enableSwitchTool = true;
  private currViewportPoint: IPoint = { x: Infinity, y: Infinity };

  constructor(editor: YEditor) {
    this.editor = editor;
    this.registerToolCtor(SelectTool);
    this.registerToolCtor(DrawRectTool);
    this.setActiveTool(SelectTool.type);
    this.bindEvent();
  }

  private bindEvent() {
    // (1) drag block strategy
    let isPressing = false;
    let startPos: IPoint = { x: 0, y: 0 };
    let startWithLeftMouse = false;

    const handleDown = (e: PointerEvent) => {
      setTimeout(() => {
        isPressing = false;
        this._isDragging = false;
        startWithLeftMouse = false;
        if (
          e.button !== 0 // is not left mouse
        //   || this.editor.textEditor.isActive() // is editing text mode
        //   || this.editor.hostEventManager.isSpacePressing // is dragging canvas mode
        ) {
          return;
        }

        isPressing = true;
        startWithLeftMouse = true;
        if (!this.currentTool) {
          throw new Error('there is no active tool');
        }
        startPos = { x: e.clientX, y: e.clientY };
        this.currentTool.onStart(e);
      });
    };
    const handleMove = (e: PointerEvent) => {
      this.currViewportPoint = this.editor.getCursorXY(e);
      if (!this.currentTool) {
        throw new Error('未设置当前使用工具');
      }
      if (isPressing) {
        if (!startWithLeftMouse) {
          return;
        }
        // const dx = e.clientX - startPos.x;
        // const dy = e.clientY - startPos.y;

        if (!this._isDragging) {
          this._isDragging = true;
        }

        if (this._isDragging) {
          this.enableSwitchTool = false;
          this.currentTool.onDrag(e);
        }
      } else {
        const isOutsideCanvas = this.editor.canvasElement !== e.target;
        this.currentTool.onMoveExcludeDrag(e, isOutsideCanvas);
      }
    };
    const handleUp = (e: PointerEvent) => {
      this.enableSwitchTool = true;

      if (!startWithLeftMouse) {
        return;
      }
      if (!this.currentTool) {
        throw new Error('未设置当前使用工具');
      }

      if (isPressing) {
        // this.editor.canvasDragger.enableDragBySpace();
        isPressing = false;
        this.currentTool.onEnd(e, this._isDragging);
        this.currentTool.afterEnd(e, this._isDragging);
      }

      this._isDragging = false;
    };

    const canvas = this.editor.canvasElement;
    canvas.addEventListener('pointerdown', handleDown);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);

    return () => {
      canvas.removeEventListener('pointerdown', handleDown);
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }

  private registerToolCtor(toolCtor: IToolClassConstructor) {
    const { type } = toolCtor;
    if (this.toolCtorMap.has(type)) {
      console.warn(`tool "${type}" had exit, replace it!`);
    }

    this.toolCtorMap.set(type, toolCtor);

    // select and pathSelect tool has same hotkey
    // const { hotkey } = toolCtor;
    // let keyCode = '';
    // let hotkeyObj: IKey;

    // if (!hotkey) {
    //   console.log(`${type} has no hotkey`);
    //   return;
    // }

    // if (typeof hotkey === 'string') {
    //   keyCode = `Key${hotkey.toUpperCase()}`;
    //   hotkeyObj = { keyCode };
    // } else {
    //   // support complex hotkey
    //   keyCode = `${hotkey.altKey ? 'alt+' : ''}${
    //     hotkey.ctrlKey ? 'ctrl+' : ''
    //   }${hotkey.shiftKey ? 'shift+' : ''}${hotkey.metaKey ? 'meta+' : ''}${
    //     hotkey.keyCode
    //   }`;
    //   hotkeyObj = hotkey;
    // }

    // if (this.hotkeySet.has(keyCode)) {
    //   console.log(`register same hotkey: "${keyCode}"`);
    // }
    // this.hotkeySet.add(keyCode);
    // const token = this.editor.keybindingManager.register({
    //   key: hotkeyObj,
    //   actionName: type,
    //   when: () => this.enableToolTypes.includes(type),
    //   action: () => {
    //     this.setActiveTool(type);
    //   },
    // });
    // this.keyBindingToken.push(token);
  }

  async setActiveTool(toolName: string) {
    // if (!this.enableSwitchTool || this.getActiveToolName() === toolName) {
    //   return;
    // }

    if (!this.enableToolTypes.includes(toolName)) {
      console.warn(`target tool "${toolName}" is not enable`);
      return;
    }

    const currentToolCtor = this.toolCtorMap.get(toolName) || null;
    if (!currentToolCtor) {
      throw new Error(`tool "${toolName}" is not registered`);
    }
    const currentTool = new currentToolCtor(this.editor);

    if (currentTool.enableActive) {
      const canActive = await currentTool.enableActive();
      if (!canActive) {
        return;
      }
    }
    const prevTool = this.currentTool;
    this.currentTool = currentTool;

    prevTool?.onInactive();
    this.setCursorWhenActive();
    currentTool.onActive();
    this.eventEmitter.emit('switchTool', currentTool.type);
  }

  setCursorWhenActive() {
    this.editor.cursorManager.setCursor(this.currentTool?.cursor ?? 'default');
  }

  public getEnableTools() {
    return [...this.enableToolTypes];
  }

  getActiveToolName() {
    return this.currentTool?.type;
  }

  getCurrPoint() {
    return this.editor.toScenePt(
      this.currViewportPoint.x,
      this.currViewportPoint.y,
    );
  }

  isDragging() {
    return this._isDragging;
  }

  on<K extends keyof Events>(eventName: K, listener: Events[K]) {
    this.eventEmitter.on(eventName, listener);
  }

  off<K extends keyof Events>(eventName: K, listener: Events[K]) {
    this.eventEmitter.off(eventName, listener);
  }
}
export default ToolManager;
