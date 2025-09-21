import { getClosestTimesVal, nearestPixelVal } from '../common';
import type { YEditor } from './editor';

export class Grid {
  constructor(private editor: YEditor) {}
  draw() {
    const { ctx } = this.editor;
    ctx.save();

    const { setting } = this.editor;
    const stepX = this.editor.setting.getSettingValue('gridViewX');
    const stepY = this.editor.setting.getSettingValue('gridViewY');

    const bbox = this.editor.viewportManager.getSceneBbox();
    const pageSize = this.editor.viewportManager.getPageSize();

    const startXInScene = getClosestTimesVal(bbox.minX, stepX);
    const endXInScene = getClosestTimesVal(bbox.maxX, stepX);

    let x = startXInScene;
    while (x <= endXInScene) {
      ctx.strokeStyle = setting.getSettingValue('pixelGridLineColor');
      const pixelX = nearestPixelVal(this.editor.toViewportPt(x, 0).x);
      ctx.beginPath();
      ctx.moveTo(pixelX, 0);
      ctx.lineTo(pixelX, pageSize.height);
      ctx.stroke();
      ctx.closePath();
      x += stepX;
    }

    /** * draw horizontal lines */
    let startYInScene = getClosestTimesVal(bbox.minY, stepY);
    const endYInScene = getClosestTimesVal(bbox.maxY, stepY);

    while (startYInScene <= endYInScene) {
      ctx.strokeStyle = setting.getSettingValue('pixelGridLineColor');
      const y = nearestPixelVal(this.editor.toViewportPt(0, startYInScene).y);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(pageSize.width, y);
      ctx.stroke();
      ctx.closePath();
      startYInScene += stepY;
    }

    ctx.restore();
  }
}
