import React, { useState, useContext, Fragment } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import type { DropResult } from 'react-beautiful-dnd';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { SplitLine } from '../Lines';
import ActionButton from '../ActionButton';
import DropButton from '../DropButton';
import { getRegisterNode, exchangeNodes } from '../utils';
import type { IRenderNode } from '../index';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import AddConditionIcon from '../icons/add-condition.svg';
import Arrow from '../Arrow';

interface IProps {
  renderConditionNode: (params: IRenderNode) => React.ReactNode;
}

const ConditionsDashed = () => {
  const { lineColor } = useContext(BuilderContext);

  return (
    <div
      className="flow-builder-branch-node__dashed"
      style={{ border: `2px dashed ${lineColor}` }}
    />
  );
};

const SortingDashed = () => {
  const { lineColor } = useContext(BuilderContext);

  return (
    <div
      className="flow-builder-branch-node__sorting__dashed"
      style={{ border: `2px dashed ${lineColor}` }}
    />
  );
};

const BranchNode: React.FC<IProps> = (props) => {
  const { renderConditionNode } = props;

  const [dragging, setDragging] = useState(false);

  const {
    nodes,
    layout,
    spaceX,
    spaceY,
    readonly,
    registerNodes,
    beforeNodeClick,
    beforeAddConditionNode,
    dragType,
    DropComponent = DropButton,
    showPracticalBranchNode,
    showPracticalBranchRemove,
    sortable,
    onDropNodeSuccess,
    onAddNodeSuccess,
    onChange,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { addNode, removeNode, clickNode } = useAction();

  const { children } = node;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const conditionCount = Array.isArray(children) ? children.length : 0;

  const disabled =
    typeof registerNode?.conditionMaxNum === 'number'
      ? conditionCount >= registerNode?.conditionMaxNum
      : false;

  const droppable = dragType && registerNode?.conditionNodeType === dragType;

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleDragStart = () => {
    setDragging(true);
  };

  const handleDragEnd = (result: DropResult) => {
    setDragging(false);

    const { source, destination } = result;
    if (
      !destination ||
      destination?.index === source?.index ||
      !node.children
    ) {
      return;
    }

    exchangeNodes(node.children, source.index, destination.index);

    onChange?.([...nodes], 'branch-sort');
  };

  const handleAddCondition = async () => {
    try {
      await beforeAddConditionNode?.(node);
      if (registerNode?.conditionNodeType) {
        const newNode = addNode(registerNode.conditionNodeType);
        onAddNodeSuccess?.(registerNode.conditionNodeType, newNode);
      }
    } catch (error) {}
  };

  const handleDrop = async () => {
    try {
      await beforeAddConditionNode?.(node);
      if (registerNode?.conditionNodeType) {
        const newNode = addNode(registerNode.conditionNodeType);
        onDropNodeSuccess?.(registerNode.conditionNodeType, newNode);
      }
    } catch (error) {}
  };

  const handleNodeClick = async () => {
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div
      className={`flow-builder-node flow-builder-branch-node ${
        registerNode?.className || ''
      } ${dragging ? 'flow-builder-branch-node-dragging' : ''}`}
    >
      <Arrow />
      {registerNode?.showPracticalBranchNode ?? showPracticalBranchNode ? (
        <>
          <div className="flow-builder-node__content-wrap">
            <div
              className="flow-builder-node__content"
              onClick={handleNodeClick}
            >
              <Component
                readonly={readonly}
                node={node}
                nodes={nodes}
                remove={removeNode}
              />
            </div>
            {registerNode?.showPracticalBranchRemove ??
            showPracticalBranchRemove ? (
              <RemoveButton />
            ) : null}
          </div>
          <SplitLine />
        </>
      ) : null}
      <div className="flow-builder-branch-node__content">
        {!readonly && !disabled ? (
          <div
            className="flow-builder-branch-node__add-button"
            onClick={() => {
              handleAddCondition();
            }}
          >
            {droppable ? (
              <DropComponent onDrop={handleDrop} />
            ) : (
              registerNode?.addConditionIcon || (
                <ActionButton size={20} icon={AddConditionIcon} />
              )
            )}
          </div>
        ) : (
          <SplitLine
            className="branch-add-disabled"
            style={{
              [layout === 'vertical' ? 'top' : 'left']:
                layout === 'vertical'
                  ? `${-(spaceY as number)}px`
                  : `${-(spaceX as number)}px`,
            }}
          />
        )}

        {sortable ? (
          <>
            <DragDropContext
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
            >
              <Droppable
                droppableId={`droppable-branch-${node.id}`}
                direction={layout === 'vertical' ? 'horizontal' : 'vertical'}
              >
                {(provided) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      className="flow-builder-branch-node__conditions"
                      {...provided.droppableProps}
                    >
                      {conditionCount === 1 ? <ConditionsDashed /> : null}
                      {children?.map((branch, index) => (
                        <Draggable
                          key={branch.id}
                          draggableId={String(branch.id)}
                          index={index}
                        >
                          {(provided) => (
                            <>
                              {renderConditionNode({
                                node: branch,
                                nodeIndex: index,
                                parentNode: node,
                                sortProps: { provided },
                              })}
                            </>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </DragDropContext>
            {sortable ? <SortingDashed /> : null}
          </>
        ) : (
          <div className="flow-builder-branch-node__conditions">
            {conditionCount === 1 ? <ConditionsDashed /> : null}
            {children?.map((branch, index) => (
              <Fragment key={branch.id}>
                {renderConditionNode({
                  node: branch,
                  nodeIndex: index,
                  parentNode: node,
                })}
              </Fragment>
            ))}
          </div>
        )}
      </div>
      <AddButton />
    </div>
  );
};

export default BranchNode;
