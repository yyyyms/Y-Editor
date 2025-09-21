/* eslint-disable no-console */
import { EventEmitter } from '@/packages/common';

import type { GraphicsAttrs, IGraphicsOpts } from './graphicsAttrs';
import { GraphicsType, type Optional } from '../type';
import { GraphicsStoreManager } from './graphicsManger';
import type YEditor from '../editor';

import Graphics from '.';

interface Events {
  sceneChange: (
    ops: {
      added: Map<string, GraphicsAttrs>;
      deleted: Set<string>;
      update: Map<string, Partial<GraphicsAttrs>>;
    },
    source: string,
  ) => void;
  currentCanvasChange: (canvasId: string, prevCanvasId: string) => void;
}
type GlobalCanvasAttrs = GraphicsAttrs;
export class GlobalDocument extends Graphics<GlobalCanvasAttrs> {
  override type = GraphicsType.Document;
  protected override isContainer = true;
  graphicsStoreManager = new GraphicsStoreManager();
  private currentCanvasId: string = '';
  private emitter = new EventEmitter<Events>();
  private editor!: YEditor;

  constructor(attrs: Optional<GlobalCanvasAttrs, 'id' | 'transform'>) {
    super({ ...attrs, type: GraphicsType.Document }, {} as IGraphicsOpts);
  }

  setEditor(editor: YEditor) {
    this.editor = editor;
  }

  addGraphics(graphics: Graphics) {
    this.graphicsStoreManager.add(graphics);
  }

  setCurrentCanvas(canvasId: string) {
    if (canvasId === this.currentCanvasId) {
      console.log('Same canvas, switch canvas failed');
      return;
    }

    const prevCanvasId = this.currentCanvasId;

    this.currentCanvasId = canvasId;

    this.emitter.emit('currentCanvasChange', canvasId, prevCanvasId);
  }

  getCurrentCanvas() {
    const canvasItems = this.graphicsStoreManager.getCanvasItems();

    return canvasItems.find(
      canvas => canvas.attrs.id === this.currentCanvasId,
    )!;
  }

  getGraphicsById(id: string) {
    return this.graphicsStoreManager.get(id);
  }
}
