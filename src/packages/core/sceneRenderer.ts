import type YEditor from './editor';
import type Graphics from './graphics';
import { Grid } from './grid';
import { rafThrottle } from './utils';
import { getDevicePixelRatio } from '../common';
import { Matrix } from '../geo/geoMatrixClass';
import type { IRect } from '../geo/type';

class SceneRenderer {
  selection: IRect | null = null;
  showSelectedGraphsOutline = true;
  private editor: YEditor;
  private grid: Grid;
  private highlightLayersOnHover = true;

  constructor(editor: YEditor) {
    this.editor = editor;
    this.grid = new Grid(editor);
  }

  addItems(graphicsArr: Graphics[]) {
    for (const graphics of graphicsArr) {
      this.editor.doc.addGraphics(graphics);
    }
  }

  /** 设置空框 */
  setSelection(selection: Partial<IRect>) {
    this.selection = Object.assign({}, this.selection, selection);
  }

  // 全量重渲染
  render = rafThrottle(() => {
    const { setting, canvasElement: canvas, ctx } = this.editor;
    const zoom = this.editor.viewportManager.getZoom();
    const { selectedElements } = this.editor;
    // const { _selectElements } = this.editor;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = setting.getSettingValue('canvasBgColor');
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();

    // 绘制拖拽选中框
    if (this.selection) {
      const { width, height } = this.selection;
      ctx.save();
      // ctx.translate(0.5, 0.5);
      ctx.strokeStyle = setting.getSettingValue('selectionStroke');
      ctx.fillStyle = setting.getSettingValue('selectionFill');
      const { x: xInViewport, y: yInViewport } = this.editor.toViewportPt(this.selection.x, this.selection.y);
      const widthInViewport = width * zoom;
      const heightInViewport = height * zoom;

      ctx.fillRect(xInViewport, yInViewport, widthInViewport, heightInViewport);
      ctx.strokeRect(xInViewport, yInViewport, widthInViewport, heightInViewport);
      ctx.restore();
    }

    // 先绘制所有图形元素
    const canvasGraphics = this.editor.doc.getCurrentCanvas();
    if (canvasGraphics) {
      ctx.save();
      canvasGraphics.draw({ ctx, smooth: false, viewportArea: undefined });
      ctx.restore();
    }

    if (
      setting.getSettingValue('enablePixelGrid')
      && zoom >= this.editor.setting.getSettingValue('minPixelGridZoom')
    ) {
      this.grid.draw();
    }

    if (this.highlightLayersOnHover && setting.getSettingValue('highlightLayersOnHover')) {
      const hlItem = selectedElements.getHighlightedItem();
      if (hlItem && !selectedElements.hasItem(hlItem)) {
        this.drawGraphsOutline(
          [hlItem],
          setting.getSettingValue('hoverOutlineStrokeWidth'),
          this.editor.setting.getSettingValue('hoverOutlineStroke'),
        );
      }
    }

    // 最后绘制选中框，确保不被图形元素覆盖
    this.editor.selectedBox.updateBox();
    if (this.showSelectedGraphsOutline) {
      this.editor.selectedBox.draw();
    }
  });

  private drawGraphsOutline(
    graphicsArr: Graphics[],
    strokeWidth: number,
    stroke: string,
  ) {
    const { ctx } = this.editor;
    const dpr = getDevicePixelRatio();
    const zoom = this.editor.viewportManager.getZoom();

    ctx.save();
    const viewMatrix = new Matrix()
      .scale(dpr, dpr)
      .append(this.editor.viewportManager.getViewMatrix());

    ctx.setTransform(...viewMatrix.getArray());

    strokeWidth /= zoom;
    for (const graphics of graphicsArr) {
      ctx.save();
      graphics.drawOutline(ctx, stroke, strokeWidth);
      ctx.restore();
    }
    ctx.restore();
  }
}

export default SceneRenderer;
