import classNames from 'classnames';
import { type JSX, useContext, useEffect, useState } from 'react';

import { EditorContext } from '@/components/Context';
import { isWindows } from '@/packages/utils';

import { ToolBtn } from './components/ToolBtn';
import style from './index.module.less';
import {
  EllipseOutlined,
  FrameOutlined,
  HandOutlined,
  ImageOutlined,
  LineOutlined,
  PenOutlined,
  PencilOutlined,
  PolygonOutlined,
  RectOutlined,
  SelectOutlined,
  StarOutlined,
  TextFilled,
} from '../../../icons';

export function ToolBar() {
  const editor = useContext(EditorContext);
  const [currTool, setCurrTool] = useState('');
  const [enableTools, setEnableTools] = useState<string[]>([]);
  // const [isPathEditorActive, setIsPathEditorActive] = useState(false);

  useEffect(() => {
    if (editor) {
      setCurrTool(editor.toolManager.getActiveToolName() || '');
      setEnableTools(editor.toolManager.getEnableTools());
      // setIsPathEditorActive(editor.pathEditor.isActive());

      // const onTogglePathEditor = (active: boolean) => {
      //   setIsPathEditorActive(active);
      // };
      const onSwitchTool = (toolName: string) => {
        setCurrTool(toolName);
      };
      const onChangeEnableTools = (tools: string[]) => {
        setEnableTools(tools);
      };

      editor.toolManager.on('switchTool', onSwitchTool);
      editor.toolManager.on('changeEnableTools', onChangeEnableTools);
      // editor.pathEditor.on('toggle', onTogglePathEditor);
      return () => {
        editor.toolManager.off('switchTool', onSwitchTool);
        editor.toolManager.off('changeEnableTools', onChangeEnableTools);
        // editor.pathEditor.off('toggle', onTogglePathEditor);
      };
    }
  }, [editor]);

  const keyMap: Record<
    string,
    { name: string; hotkey: string; intlId: string; icon: JSX.Element }
  > = {
    select: {
      name: 'select',
      hotkey: 'V',
      intlId: '选择',
      icon: <SelectOutlined />,
    },
    drawFrame: {
      name: 'drawFrame',
      hotkey: 'F',
      intlId: '画板',
      icon: <FrameOutlined />,
    },
    drawRect: {
      name: 'drawRect',
      hotkey: 'R',
      intlId: '矩形',
      icon: <RectOutlined />,
    },
    drawEllipse: {
      name: 'drawEllipse',
      hotkey: 'O',
      intlId: '椭圆',
      icon: <EllipseOutlined />,
    },
    drawImg: {
      name: 'drawImg',
      hotkey: '',
      intlId: '图片',
      icon: <ImageOutlined />,
    },
    pathSelect: {
      name: 'pathSelect',
      hotkey: 'V',
      intlId: '选择',
      icon: <SelectOutlined />,
    },
    pen: {
      name: 'pen',
      hotkey: 'P',
      intlId: '钢笔',
      icon: <PenOutlined />,
    },
    pencil: {
      name: 'pencil',
      hotkey: `${isWindows() ? 'Shift+' : '⇧'}P`,
      intlId: '铅笔',
      icon: <PencilOutlined />,
    },
    drawLine: {
      name: 'drawLine',
      hotkey: 'L',
      intlId: '直线',
      icon: <LineOutlined />,
    },
    drawRegularPolygon: {
      name: 'drawRegularPolygon',
      hotkey: '',
      intlId: '多边形',
      icon: <PolygonOutlined />,
    },
    drawStar: {
      name: 'drawStar',
      hotkey: '',
      intlId: '星星',
      icon: <StarOutlined />,
    },
    drawText: {
      name: 'drawText',
      hotkey: 'T',
      intlId: '文本',
      icon: <TextFilled />,
    },
    dragCanvas: {
      name: 'dragCanvas',
      hotkey: 'H',
      intlId: '拖拽画布',
      icon: <HandOutlined />,
    },
  };

  return (
    <div className={classNames(style['y-editor-tool-bar'])}>
      {/* <Menu /> */}
      {enableTools.map((toolType) => {
        const tool = keyMap[toolType];

        return (
          <ToolBtn
            key={tool.name}
            tooltipContent={tool.intlId}
            active={currTool === tool.name}
            hotkey={tool.hotkey}
            onMouseDown={() => {
              editor?.toolManager.setActiveTool(tool.name);
            }}
          >
            {tool.icon}
          </ToolBtn>
        );
      })}

      {/* {isPathEditorActive && (
        <Button
          style={{
            marginLeft: '16px',
            userSelect: 'none',
          }}
          onClick={() => {
            if (editor) {
              editor.pathEditor.inactive();
            }
          }}
        >
          {intl.formatMessage({ id: 'done' })}
        </Button>
      )} */}
    </div>
  );
}
