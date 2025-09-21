import { PaintType } from './paint';

/**
 * 一些绘制的配置
 * 如：偏移、填充颜色、描边颜色、描边宽度等
 */
class Setting {
  private settingValue: {
    canvasBgColor: '#f4f4f4';

    offsetX: number; // mouse offset
    offsetY: number;
    selectBoxStroke: string;
    selectBoxStrokeWidth: number;

    selectionStroke: string;
    selectionFill: string;
    firstFill: {
      type: PaintType.Solid;
      attrs: { r: 217; g: 217; b: 217; a: 1 };
    };
    minPixelGridZoom: number;
    enablePixelGrid: boolean;
    snapToGrid: boolean;
    gridSnapX: number;
    gridSnapY: number;
    gridViewX: number;
    gridViewY: number;

    pixelGridLineColor: '#cccccc55';

    keepToolSelectedAfterUse: boolean;

    highlightLayersOnHover: boolean;
    hoverOutlineStrokeWidth: number;
    hoverOutlineStroke: string;
  };

  constructor(partialVal: Partial<SettingValue>) {
    this.settingValue = {
      canvasBgColor: '#f4f4f4',
      offsetX: 0,
      offsetY: 0,
      selectionStroke: '#0f8eff',
      selectionFill: '#0f8eff33',

      // 选中盒框
      selectBoxStroke: '#1592fe',
      selectBoxStrokeWidth: 1,

      firstFill: {
        type: PaintType.Solid,
        attrs: { r: 217, g: 217, b: 217, a: 1 },
      },
      minPixelGridZoom: 8,
      gridViewX: 1,
      gridViewY: 1,
      gridSnapX: 1,
      gridSnapY: 1,
      pixelGridLineColor: '#cccccc55',

      keepToolSelectedAfterUse: false,
      enablePixelGrid: true,
      snapToGrid: true,
      highlightLayersOnHover: true,
      hoverOutlineStrokeWidth: 2,
      hoverOutlineStroke: '#1592fe',
      ...partialVal,
    };
  }

  getSettingValue<K extends keyof SettingValue >(key: K) {
    return this.settingValue[key];
  }

  setSettingValue<K extends keyof SettingValue>(key: K, value: SettingValue[K]) {
    this.settingValue[key] = value;
  }
}
export type SettingValue = Setting['settingValue'];
export default Setting;
