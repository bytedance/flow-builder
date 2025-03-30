import React, { useContext } from 'react';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { SplitLine, FillLine, CoverLine } from '../Lines';
import DefaultNode from '../DefaultNode';
import DropButton from '../DropButton';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import Arrow from '../Arrow';
import type { DraggableProvided } from 'react-beautiful-dnd';
import type { INode, IRender } from '../index';

interface IProps {
  parentNode?: INode;
  conditionIndex: number;
  renderNext: (params: IRender) => React.ReactNode;
  sortProps?: { provided?: DraggableProvided };
}

const ConditionNode: React.FC<IProps> = (props) => {
  const { parentNode, conditionIndex, renderNext, sortProps } = props;

  const {
    layout,
    spaceX,
    spaceY,
    readonly,
    registerNodes,
    nodes,
    beforeNodeClick,
    sortable,
    sortableAnchor,
    dragType,
    DropComponent = DropButton,
    beforeAddConditionNode,
    onAddNodeSuccess,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode, addNode } = useAction();

  const conditionCount = Array.isArray(parentNode?.children)
    ? parentNode?.children.length || 0
    : 0;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const registerParentNode = getRegisterNode(registerNodes, parentNode?.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const droppable =
    dragType &&
    dragType === node.type &&
    (typeof registerParentNode?.conditionMaxNum === 'number'
      ? conditionCount < registerParentNode.conditionMaxNum
      : true);

  const handleNodeClick = async () => {
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  const handleDrop = async (position: string) => {
    try {
      if (parentNode) {
        await beforeAddConditionNode?.(parentNode);
        const index = Number([...(node.path || [])].pop());
        const newNode = addNode(
          parentNode,
          node.type,
          position === 'left' ? index : index + 1,
        );
        onAddNodeSuccess?.(dragType, newNode);
      }
    } catch (error) {}
  };

  const coverIndexClassName = ((index: number, total: number) => {
    if (index === 0) {
      return 'cover-first';
    }
    if (index === total - 1) {
      return 'cover-last';
    }
    return 'cover-middle';
  })(conditionIndex, conditionCount);

  return (
    <div
      className={`flow-builder-node flow-builder-condition-node ${
        registerNode?.className || ''
      }`}
      ref={sortProps?.provided?.innerRef}
      {...sortProps?.provided?.draggableProps}
      style={{
        padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
        ...sortProps?.provided?.draggableProps?.style,
      }}
    >
      {conditionCount > 1 ? (
        <>
          <CoverLine
            full={conditionIndex !== 0 && conditionIndex !== conditionCount - 1}
            className={`cover-condition-start ${coverIndexClassName}`}
          />
          <CoverLine
            full={conditionIndex !== 0 && conditionIndex !== conditionCount - 1}
            className={`cover-condition-end ${coverIndexClassName}`}
          />
        </>
      ) : null}

      <SplitLine />

      <Arrow />

      <div
        className={`flow-builder-node__content-wrap ${
          droppable ? 'flow-builder-condition-node-droppable' : ''
        }`}
      >
        {droppable && <DropComponent onDrop={() => handleDrop('left')} />}
        <div className="flow-builder-node__content" onClick={handleNodeClick}>
          <Component
            readonly={readonly}
            node={node}
            nodes={nodes}
            remove={removeNode}
          />
        </div>
        {droppable && <DropComponent onDrop={() => handleDrop('right')} />}
        <RemoveButton />
        {sortable && (
          <span
            className="flow-builder-sortable-handle"
            {...sortProps?.provided?.dragHandleProps}
          >
            {sortableAnchor || ':::'}
          </span>
        )}
      </div>

      <AddButton />

      {Array.isArray(node.children)
        ? renderNext({
            nodes: node.children,
            parentNode: node,
          })
        : null}

      <FillLine />
    </div>
  );
};

export default ConditionNode;
