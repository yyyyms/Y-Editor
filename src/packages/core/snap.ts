import type { IPoint } from '@/types/common';

import type Setting from './setting';
import { getClosestTimesVal } from '../common';

export const SnapHelper = {
  /**
   * support grid snap
   *
   * TODO:
   * objects snap
   * polar tracking snap
   * ortho
   * ruler ref line snap
   */
  getSnapPtBySetting(point: IPoint, setting: Setting) {
    point = { x: point.x, y: point.y };
    const snapGrid = setting.getSettingValue('snapToGrid');
    if (snapGrid) {
      const gridSnapSpacing = {
        x: setting.getSettingValue('gridSnapX'),
        y: setting.getSettingValue('gridSnapY'),
      };
      return this.getGridSnapPt(point, gridSnapSpacing);
    }
    return point;
  },

  getGridSnapPt(point: IPoint, snapSpacing: IPoint) {
    return {
      x: getClosestTimesVal(point.x, snapSpacing.x),
      y: getClosestTimesVal(point.y, snapSpacing.y),
    };
  },
};
