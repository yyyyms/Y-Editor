import type YEditor from '../editor';

class HostEventManager {
  private editor: YEditor;

  constructor(editor: YEditor) {
    this.editor = editor;
    this.bindHostKey();
  }

  bindHostKey() {
    this.bindWheelEvent();
  }

  private bindWheelEvent() {
    const handleWheel = (event: WheelEvent) => {
      this.editor.viewportManager.translate(-event.deltaX, -event.deltaY);
      this.editor.render();
    };

    this.editor.canvasElement.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }
}
export default HostEventManager;
