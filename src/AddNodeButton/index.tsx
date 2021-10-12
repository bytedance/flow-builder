import React, { useState } from 'react';
import { Popover } from 'antd';
import ActionButton from '@/ActionButton';
import AddIcon from '../icons/add-button.svg';
import AddNormalIcon from '../icons/add-normal.svg';
import AddBranchIcon from '../icons/add-branch.svg';
import { getRegisterNode, getIsBranchNode, getIsConditionNode } from '@/utils';

import { INode, IRegisterNode } from '@/index';

interface IProps {
  registerNodes: IRegisterNode[];
  node: INode;
  onAddNode: (node: INode, newNodeType: string) => void;
}

const AddNodeButton: React.FC<IProps> = (props) => {
  const { registerNodes, node, onAddNode } = props;

  const [visible, setVisible] = useState(false);

  const addableNodeTypes = getRegisterNode(
    registerNodes,
    node.type,
  )?.addableNodeTypes;

  const options = registerNodes.filter(
    (item) =>
      item.type !== 'start' &&
      item.type !== 'end' &&
      !getIsConditionNode(registerNodes, item.type) &&
      (Array.isArray(addableNodeTypes)
        ? addableNodeTypes.includes(item.type)
        : true),
  );

  const handleAddNode = (newNodeType: string) => {
    onAddNode(node, newNodeType);
    setVisible(false);
  };

  const addableOptions = (
    <>
      {options.map((item) => {
        const registerNode = getRegisterNode(registerNodes, item.type);
        const defaultIcon = getIsBranchNode(registerNodes, item.type)
          ? AddBranchIcon
          : AddNormalIcon;
        return (
          <div
            className="flow-builder-addable-node-item"
            key={item.type}
            onClick={() => handleAddNode(item.type)}
          >
            <img
              className="flow-builder-addable-node-icon"
              src={registerNode?.addIcon || defaultIcon}
            />
            <span>{item.name}</span>
          </div>
        );
      })}
    </>
  );

  return options.length > 0 ? (
    <Popover
      visible={visible}
      onVisibleChange={setVisible}
      overlayClassName="flow-builder-addable-nodes"
      placement="rightTop"
      trigger={['click']}
      content={addableOptions}
      getPopupContainer={(triggerNode) => triggerNode as HTMLElement}
    >
      <div onClick={(e) => e.stopPropagation()}>
        <ActionButton icon={AddIcon} />
      </div>
    </Popover>
  ) : null;
};

export default AddNodeButton;
