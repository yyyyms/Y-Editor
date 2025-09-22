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
      const { editor } = this;
      if (event.metaKey || event.altKey) {
        event.preventDefault();
        const point = this.editor.getCursorXY(event);
        const isZoomOut = event.deltaY > 0;

        if (isZoomOut) {
          editor.viewportManager.zoomOut({
            center: point,
            deltaY: event.deltaY,
          });
        } else {
          editor.viewportManager.zoomIn({
            center: point,
            deltaY: event.deltaY,
          });
        }
        this.editor.render();
      } else {
        this.editor.viewportManager.translate(-event.deltaX, -event.deltaY);
        this.editor.render();
      }
    };

    this.editor.canvasElement.addEventListener('wheel', handleWheel);
    return () => {
      window.removeEventListener('wheel', handleWheel);
    };
  }
}
export default HostEventManager;
