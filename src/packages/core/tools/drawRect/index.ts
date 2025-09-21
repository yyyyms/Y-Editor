import { cloneDeep } from 'lodash-es';

import { normalizeRect } from '@/packages/geo/rect';
import type { IRect } from '@/packages/geo/type';
import { getNoConflictObjectName } from '@/packages/utils';

import type { ICursor } from '../../cursorManager';
import type YEditor from '../../editor';
import type Graphics from '../../graphics';
import RectGraphics from '../../graphics/rect';
import { GraphicsObjectSuffix } from '../../graphics/type';
import { AbstractDrawGraphicsTool } from '../abstractDrawGraphics';
import type { ITool } from '../type';

class DrawRectTool extends AbstractDrawGraphicsTool implements ITool {
  static readonly type = 'drawRect';
  readonly type = DrawRectTool.type;
  readonly hotkey = 'R';
  cursor: ICursor = 'crosshair';

  constructor(editor: YEditor) {
    super(editor);
  }

  protected override createGraphics(rect: IRect, parent: Graphics) {
    rect = normalizeRect(rect);

    const graphics = new RectGraphics(
      {
        objectName: getNoConflictObjectName(parent, GraphicsObjectSuffix.Rect),
        width: rect.width,
        height: rect.height,
        fill: [cloneDeep(this.editor.setting.getSettingValue('firstFill'))],
      },
      {
        advancedAttrs: {
          x: rect.x,
          y: rect.y,
        },
        doc: this.editor.doc,
      },
    );
    return graphics;
  }
}
export default DrawRectTool;
