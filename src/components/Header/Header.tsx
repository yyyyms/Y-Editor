import classNames from 'classnames';

import { ToolBar } from './components/Toolbar';
import style from './index.module.less';

export function Header() {
  return (
    <div className={classNames(style['y-editor-header'])}>
      <ToolBar />
    </div>
  );
}
