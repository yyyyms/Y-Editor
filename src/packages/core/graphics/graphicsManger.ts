import { CanvasGraphics } from './canvas';

import type Graphics from '.';

/**
 * Graphics Manager
 *
 * 1. record "id -> graphics"
 * 2. TODO: search graphics by box (with R-Tree)
 */
export class GraphicsStoreManager {
  private graphicsStore = new Map<string, Graphics>();
  private canvasStore = new Map<string, CanvasGraphics>();

  add(graphics: Graphics) {
    const { id } = graphics.attrs;
    const { graphicsStore } = this;
    if (graphicsStore.has(id)) {
      console.warn(`graphics ${id} has added`);
    }
    if (graphics instanceof CanvasGraphics) {
      this.canvasStore.set(id, graphics);
    }
    graphicsStore.set(id, graphics);
  }

  get(id: string) {
    return this.graphicsStore.get(id);
  }

  getAll() {
    const graphicsArr: Graphics[] = [];
    for (const [, graphics] of this.graphicsStore) {
      if (!graphics.isDeleted()) {
        graphicsArr.push(graphics);
      }
    }
    return graphicsArr;
  }

  getCanvasItems() {
    return Array.from(this.canvasStore.values());
  }

  getCanvasItemsData() {
    const canvasItems = Array.from(this.canvasStore.values()).filter(
      canvas => !canvas.isDeleted(),
    );

    canvasItems.sort((a, b) => {
      const aIndex = a.attrs.parentIndex?.position ?? '';
      const bIndex = b.attrs.parentIndex?.position ?? '';
      return aIndex < bIndex ? -1 : 1;
    });

    return canvasItems.map(canvas => ({
      id: canvas.attrs.id,
      name: canvas.attrs.objectName,
    }));
  }

  clear() {
    this.graphicsStore.clear();
    this.canvasStore.clear();
  }
}
