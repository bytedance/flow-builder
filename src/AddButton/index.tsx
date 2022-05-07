import React, { useState, useContext } from 'react';
import { Popover } from 'antd';
import ActionButton from '../ActionButton';
import { SplitLine } from '../Lines';
import DropButton from '../DropButton';
import {
  getRegisterNode,
  getIsStartNode,
  getIsEndNode,
  getIsBranchNode,
  getIsConditionNode,
} from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';

import AddIcon from '../icons/add-button.svg';
import AddNormalIcon from '../icons/add-normal.svg';
import AddBranchIcon from '../icons/add-branch.svg';
import './index.less';

const AddNodeButton: React.FC = () => {
  const {
    registerNodes,
    nodes,
    readonly,
    dragType,
    DropComponent = DropButton,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { addNode } = useAction();

  const [visible, setVisible] = useState(false);

  const registerNode = getRegisterNode(registerNodes, node.type);
  const AddableComponent = registerNode?.addableComponent;
  const addableNodeTypes = registerNode?.addableNodeTypes;

  const droppable =
    dragType &&
    !getIsConditionNode(registerNodes, dragType) &&
    (Array.isArray(addableNodeTypes)
      ? addableNodeTypes.includes(dragType)
      : true);

  const options = registerNodes.filter(
    (item) =>
      !getIsStartNode(registerNodes, item.type) &&
      !getIsEndNode(registerNodes, item.type) &&
      !getIsConditionNode(registerNodes, item.type) &&
      (Array.isArray(addableNodeTypes)
        ? addableNodeTypes.includes(item.type)
        : true),
  );

  const handleAddNode = (newNodeType: string) => {
    addNode(newNodeType);
    setVisible(false);
  };

  const handleDrop = () => {
    addNode(dragType);
  };

  const addableOptions = AddableComponent ? (
    <AddableComponent node={node} nodes={nodes} add={handleAddNode} />
  ) : (
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
            <span className="flow-builder-addable-node-icon">
              {registerNode?.addIcon || <img src={defaultIcon} />}
            </span>

            <span>{item.name}</span>
          </div>
        );
      })}
    </>
  );

  return (
    <>
      <SplitLine />
      {!readonly && options.length > 0 ? (
        droppable ? (
          <DropComponent onDrop={handleDrop} />
        ) : (
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
        )
      ) : null}

      <SplitLine />
    </>
  );
};

export default AddNodeButton;
