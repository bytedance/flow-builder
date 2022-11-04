import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { SplitLine, CoverLine } from '../Lines';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import type { IRender } from '../index';

interface Iprops {
  renderNext: (params: IRender) => React.ReactNode;
}

const LoopNode: React.FC<Iprops> = (props) => {
  const { renderNext } = props;

  const {
    readonly,
    registerNodes,
    nodes,
    beforeNodeClick,
    layout,
    spaceX,
    spaceY,
    lineColor,
  } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode } = useAction();

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div
      className={`flow-builder-node flow-builder-loop-node ${
        registerNode?.className || ''
      }`}
    >
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component
          readonly={readonly}
          node={node}
          nodes={nodes}
          remove={removeNode}
        />

        <RemoveButton />
      </div>

      <SplitLine />

      <div
        className="flow-builder-loop-node__content"
        style={{
          padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
          [layout === 'vertical'
            ? 'borderLeft'
            : 'borderBottom']: `2px solid ${lineColor}`,
        }}
      >
        <CoverLine className="cover-loop-start" />
        <CoverLine className="cover-loop-end" />

        <AddButton />

        {Array.isArray(node.children)
          ? renderNext({
              nodes: node.children,
              parentNode: node,
            })
          : null}
      </div>

      <AddButton />
    </div>
  );
};

export default LoopNode;
