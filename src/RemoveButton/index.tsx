import React, { useContext } from 'react';
import { Popconfirm } from 'antd';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import { getRegisterNode } from '../utils';

import RemoveIcon from '../icons/close-one.svg';
import './index.less';

const RemoveButton: React.FC = () => {
  const { registerNodes, readonly } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { removeNode } = useAction();

  const registerNode = getRegisterNode(registerNodes, node.type);

  return !readonly && !registerNode?.customRemove ? (
    <Popconfirm
      title={
        registerNode?.removeConfirmTitle || 'Are you sure to remove this node?'
      }
      onCancel={(e) => e?.stopPropagation()}
      onConfirm={(e) => {
        e?.stopPropagation();
        removeNode();
      }}
      getPopupContainer={(triggerNode) => triggerNode.parentNode as HTMLElement}
    >
      <img
        className="flow-builder-node__remove"
        onClick={(e) => e.stopPropagation()}
        src={RemoveIcon}
      />
    </Popconfirm>
  ) : null;
};

export default RemoveButton;
