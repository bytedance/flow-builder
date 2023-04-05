import React from 'react';
import { Drawer, Popconfirm, Popover } from '@arco-design/web-react';

import '@arco-design/web-react/dist/css/arco.css';

export const DrawerComponent = (props) => {
  const { destroyOnClose, onClose, children, ...restProps } = props;
  return (
    <Drawer onCancel={onClose} footer={null} {...restProps}>
      {children}
    </Drawer>
  );
};

export const PopoverComponent = (props) => {
  const {
    visible,
    children,
    overlayClassName,
    placement,
    getPopupContainer,
    ...restProps
  } = props;
  return (
    <Popover
      popupVisible={visible}
      position="rt"
      className={overlayClassName}
      {...restProps}
    >
      {children}
    </Popover>
  );
};

export const PopconfirmComponent = (props) => {
  const { onConfirm, children, ...restProps } = props;
  return (
    <Popconfirm onOk={onConfirm} {...restProps}>
      {children}
    </Popconfirm>
  );
};
