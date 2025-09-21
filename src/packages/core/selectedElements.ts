import { EventEmitter, isEqual, isSameArray } from '../common';
import type YEditor from './editor';
import type Graphics from './graphics';

interface Events {
  itemsChange: (items: Graphics[]) => void;
  hoverItemChange: (
    item: Graphics | null,
    prevItem: Graphics | null,
  ) => void;
  highlightedItemChange: (
    item: Graphics | null,
    prevItem: Graphics | null,
  ) => void;
}
class SelectedElements {
  private editor: YEditor;
  private items: Graphics[] = [];
  private prevItems: Graphics[] = [];
  private eventEmitter = new EventEmitter<Events>();
  private hoverItem: Graphics | null = null;
  private prevHoverItem: Graphics | null = null;
  private highlightedItem: Graphics | null = null;
  private prevHighlightedItem: Graphics | null = null;

  constructor(editor: YEditor) {
    this.editor = editor;
  }

  setItems(items: Graphics[]) {
    const prevItems = this.items;
    this.items = items;
    this.prevItems = prevItems;
    this.emitItemsChangeIfChanged(prevItems, items);
  }

  getItems() {
    return this.items;
  }

  size() {
    return this.items.length;
  }

  clear() {
    this.setItems([]);
  }

  setHoverItem(graphics: Graphics | null) {
    const prevHoverItem = this.hoverItem;
    this.hoverItem = graphics;
    this.setHighlightedItem(graphics);
    if (prevHoverItem !== graphics) {
      // 后续还需要通知UI层
      this.eventEmitter.emit('hoverItemChange', graphics, this.hoverItem);
    }
  }

  setHighlightedItem(graphics: Graphics | null) {
    // const prevHighlightedItem = this.highlightedItem;
    this.highlightedItem = graphics;
  }

  getHighlightedItem() {
    return this.highlightedItem;
  }

  hasItem(graphics: Graphics) {
    return this.items.includes(graphics);
  }

  private emitItemsChangeIfChanged(pre: Graphics[], cur: Graphics[]) {
    if (!isSameArray(pre, cur)) {
      this.eventEmitter.emit('itemsChange', cur);// 通知UI层
    }
  }

  on<K extends keyof Events>(eventName: K, listener: Events[K]) {
    this.eventEmitter.on(eventName, listener);
  }

  off<K extends keyof Events>(eventName: K, listener: Events[K]) {
    this.eventEmitter.off(eventName, listener);
  }
}

export default SelectedElements;
