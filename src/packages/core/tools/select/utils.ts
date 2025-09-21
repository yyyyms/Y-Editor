import type { IPoint } from '@/types/common';

import type YEditor from '../../editor';
import type Graphics from '../../graphics';

export function getTopHitElement(editor: YEditor, point: IPoint): Graphics | null {
  const canvasGraphics = editor.doc.getCurrentCanvas();
  if (canvasGraphics) {
    return canvasGraphics.getHitGraphics(point);
  }
  return null;
}
