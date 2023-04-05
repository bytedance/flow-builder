import React from 'react';
import { Drawer, Popconfirm, Popover } from 'antd';

import './index.less';

export const DrawerComponent = (props) => {
  const { visible, children, ...restProps } = props;
  return (
    <Drawer open={visible} {...restProps}>
      {children}
    </Drawer>
  );
};

export const PopoverComponent = (props) => {
  const { visible, onVisibleChange, children, ...restProps } = props;
  return (
    <Popover open={visible} onOpenChange={onVisibleChange} {...restProps}>
      {children}
    </Popover>
  );
};

export const PopconfirmComponent = (props) => {
  const { children, ...restProps } = props;
  return <Popconfirm {...restProps}>{children}</Popconfirm>;
};
