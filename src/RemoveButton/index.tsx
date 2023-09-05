import React, { useContext } from 'react';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import { getRegisterNode } from '../utils';

import RemoveIcon from '../icons/close-one.svg';
import './index.less';

const RemoveButton: React.FC = () => {
  const { registerNodes, readonly, PopconfirmComponent, onRemoveNodeSuccess } =
    useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { removeNode } = useAction();

  const registerNode = getRegisterNode(registerNodes, node.type);

  return !readonly && !registerNode?.customRemove && PopconfirmComponent ? (
    <PopconfirmComponent
      title={
        registerNode?.removeConfirmTitle || 'Are you sure to remove this node?'
      }
      onConfirm={() => {
        removeNode();
        onRemoveNodeSuccess?.(node);
      }}
      getPopupContainer={(triggerNode: any) =>
        triggerNode.parentNode as HTMLElement
      }
    >
      <img className="flow-builder-node__remove" src={RemoveIcon} />
    </PopconfirmComponent>
  ) : null;
};

export default RemoveButton;
