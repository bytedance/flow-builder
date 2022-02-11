import React from 'react';
import { ConnectLine, SplitLine } from '@/Lines';
import { getRegisterNode } from '@/utils';
import { LayoutType, INode, IRegisterNode, IRenderNode } from '@/index';
import ActionButton from '@/ActionButton';
import AddConditionIcon from '../icons/add-condition.svg';

interface IProps {
  readonly?: boolean;
  lineColor: string;
  layout: LayoutType;
  node: INode;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderConditionNodes: (params: IRenderNode) => React.ReactNode;
  onAddCondition: (node: INode, newNodeType: string) => void;
  beforeAddConditionNode?: (node: INode) => Promise<any>;
}

const BranchNode: React.FC<IProps> = (props) => {
  const {
    readonly,
    lineColor,
    layout,
    node,
    registerNodes,
    renderAddNodeButton,
    renderConditionNodes,
    onAddCondition,
    beforeAddConditionNode,
  } = props;

  const { children } = node;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const conditionCount = Array.isArray(children) ? children.length : 0;

  const disabled =
    typeof registerNode?.conditionMaxNum === 'number'
      ? conditionCount === registerNode?.conditionMaxNum
      : false;

  const handleAddCondition = async (e: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await beforeAddConditionNode?.(node);
      registerNode?.conditionNodeType &&
        onAddCondition(node, registerNode.conditionNodeType);
    } catch (error) {}
  };

  return (
    <div className="flow-builder-node flow-builder-branch-node">
      <div className="flow-builder-node__content">
        {conditionCount > 1 ? (
          <>
            <ConnectLine
              color={lineColor}
              layout={layout}
              className="branch-start"
            />
            <ConnectLine
              color={lineColor}
              layout={layout}
              className="branch-end"
            />
          </>
        ) : null}

        {!readonly && !disabled ? (
          <div
            className="flow-builder-branch-node__add-button"
            onClick={handleAddCondition}
          >
            <ActionButton size={20} icon={AddConditionIcon} />
          </div>
        ) : (
          <SplitLine
            color={lineColor}
            layout={layout}
            className="branch-add-disabled"
            spaceX={10}
            spaceY={10}
          />
        )}
        <div className="flow-builder-branch-node__conditions">
          {conditionCount === 1 ? (
            <div
              className="flow-builder-branch-node__dashed"
              style={{ border: `2px dashed ${lineColor}` }}
            />
          ) : null}
          {children?.map((branch, index) => {
            return renderConditionNodes({
              node: branch,
              nodeIndex: index,
              parentNode: node,
            });
          })}
        </div>
      </div>

      {renderAddNodeButton}
    </div>
  );
};

export default BranchNode;
