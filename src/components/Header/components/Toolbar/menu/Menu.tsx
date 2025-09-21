// import './menu.scss';

// import { Dropdown, type IDropdownProps } from '@components';
// import { MenuOutlined } from '@icons';
// import { type SettingValue, exportService, importService } from '@packages/core';
// import { type FC, useContext, useEffect, useState } from 'react';

// import { EditorContext } from '../../../../../context';

// export const Menu: FC = () => {
//   const editor = useContext(EditorContext);

//   const [editorSetting, setEditorSetting] = useState<SettingValue>(
//     {} as SettingValue,
//   );

//   useEffect(() => {
//     if (!editor) {
//       return;
//     }
//     setEditorSetting(editor.setting.getAttrs());
//     const handler = (keys: SettingValue) => {
//       setEditorSetting(keys);
//     };
//     editor.setting.on('update', handler);
//     return () => {
//       editor.setting.off('update', handler);
//     };
//   }, [editor]);

//   const items: IDropdownProps['items'] = [
//     {
//       key: 'import',
//       label: '导入',
//     },
//     {
//       key: 'export',
//       label: '导出',
//     },
//     {
//       type: 'divider',
//     },
//     {
//       key: 'preference',
//       label: '偏好设置',
//       children: [
//         {
//           key: 'snapToObjects',
//           check: editorSetting.snapToObjects,
//           label: '吸附到对象',
//         },
//         {
//           key: 'keepToolSelectedAfterUse',
//           check: editorSetting.keepToolSelectedAfterUse,
//           label: '保持工具选中后使用',
//         },
//         {
//           key: 'invertZoomDirection',
//           check: editorSetting.invertZoomDirection,
//           label: '反转缩放方向',
//         },
//         {
//           key: 'highlightLayersOnHover',
//           check: editorSetting.highlightLayersOnHover,
//           label: '悬停高亮图层',
//         },
//         {
//           key: 'flipObjectsWhileResizing',
//           check: editorSetting.flipObjectsWhileResizing,
//           label: '缩放时翻转对象',
//         },
//       ],
//     },
//   ];

//   const handleClick = ({ key }: { key: string }) => {
//     if (!editor) {
//       return;
//     }

//     let preventClose = false;

//     switch (key) {
//       case 'import':
//         importService.importOriginFile(editor);
//         break;
//       case 'export':
//         exportService.exportOriginFile(editor);
//         break;
//       case 'keepToolSelectedAfterUse':
//       case 'invertZoomDirection':
//       case 'highlightLayersOnHover':
//       case 'flipObjectsWhileResizing':
//       case 'snapToObjects':
//         editor.setting.toggle(key);
//         preventClose = true;
//         break;
//       default:
//         break;
//     }

//     return preventClose;
//   };

//   return (
//     <Dropdown items={items} onClick={handleClick}>
//       <div className="sk-ed-menu-btn">
//         <MenuOutlined />
//       </div>
//     </Dropdown>
//   );
// };
