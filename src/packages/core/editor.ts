import { CursorManger } from './cursorManager';
import { CanvasGraphics } from './graphics/canvas';
import { GlobalDocument } from './graphics/document';
import HostEventManager from './hostEventManager/hostEventManager';
import SceneRenderer from './sceneRenderer';
import SelectedBox from './selectBox';
import SelectedElements from './selectedElements';
import Setting, { type SettingValue } from './setting';
import ToolManager from './tools/toolManager';
import ViewportManager from './viewportManager';

interface IEditorOptions {
  editorContainer: HTMLElement;
  userPreference?: Partial<SettingValue>;
  offsetY: number;
  offsetX: number;
}
export class YEditor {
  editorContainer: HTMLElement;
  canvasElement: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  viewportManager: ViewportManager;
  sceneRenderer: SceneRenderer;
  setting: Setting;
  selectedElements: SelectedElements;
  cursorManager: CursorManger;
  toolManager: ToolManager;
  doc: GlobalDocument;
  selectedBox: SelectedBox;
  hostEventManager: HostEventManager;

  constructor(options: IEditorOptions) {
    this.editorContainer = options.editorContainer;
    this.canvasElement = document.createElement('canvas');
    this.editorContainer.appendChild(this.canvasElement);
    this.ctx = this.canvasElement.getContext('2d')!;
    this.setting = new Setting(options.userPreference || {});
    this.setting.setSettingValue('offsetY', options.offsetY);
    this.setting.setSettingValue('offsetX', options.offsetX);
    this.cursorManager = new CursorManger(this);
    this.selectedElements = new SelectedElements(this);
    this.toolManager = new ToolManager(this);
    this.viewportManager = new ViewportManager(this);
    this.sceneRenderer = new SceneRenderer(this);

    this.selectedBox = new SelectedBox(this);
    this.hostEventManager = new HostEventManager(this);

    this.doc = new GlobalDocument({
      id: '0-0',
      objectName: 'Document',
      width: 0,
      height: 0,
    });
    const canvas = new CanvasGraphics(
      {
        objectName: 'Page 1',
      },
      {
        doc: this.doc,
      },
    );
    this.sceneRenderer.addItems([this.doc, canvas]);

    this.doc.setCurrentCanvas(canvas.attrs.id);

    Promise.resolve().then(() => {
      this.render();
    });
  }

  toScenePt(x: number, y: number, round = false) {
    return this.viewportManager.toScenePt(x, y, round);
  }

  toViewportPt(x: number, y: number) {
    return this.viewportManager.toViewportPt(x, y);
  }

  /** get cursor viewport xy */
  getCursorXY(event: { clientX: number; clientY: number }) {
    return {
      x: event.clientX - this.setting.getSettingValue('offsetX'),
      y: event.clientY - this.setting.getSettingValue('offsetY'),
    };
  }

  getSceneCursorXY(event: { clientX: number; clientY: number }, round = false) {
    const { x, y } = this.getCursorXY(event);
    return this.toScenePt(x, y, round);
  }

  render() {
    this.sceneRenderer.render();
  }

  destroy() {
    this.editorContainer.removeChild(this.canvasElement);
  }
}

export default YEditor;
