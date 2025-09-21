import classNames from 'classnames';
import React, { type FC } from 'react';

import style from './index.module.less';

interface IToolBtn {
  active: boolean;
  children?: React.ReactNode;
  tooltipContent: string;
  hotkey: string;
  onMouseDown: () => void;
}

export const ToolBtn: FC<IToolBtn> = ({
  children,
  onMouseDown,
  active,
  tooltipContent,
  hotkey,
}) => {
  return (
    <div
      className={classNames(style['tool-btn'], {
        [style.active]: active,
      })}
      onMouseDown={() => {
        onMouseDown();
      }}
    >
      {children}
      <div className={classNames(style.tooltip)}>
        {tooltipContent}
        {hotkey && <span className={classNames(style['tool-hotkey'])}>{hotkey}</span>}
      </div>
    </div>
  );
};
