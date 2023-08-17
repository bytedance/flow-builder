import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import Arrow from '../Arrow';
import { useAction } from '../hooks';

const EndNode: React.FC = () => {
  const { registerNodes, nodes, beforeNodeClick, allowEndConfig } =
    useContext(BuilderContext);

  const node = useContext(NodeContext);

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const { clickNode } = useAction();

  const handleNodeClick = async () => {
    try {
      if (!allowEndConfig) {
        return;
      }
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div
      className={`flow-builder-node flow-builder-end-node ${
        registerNode?.className || ''
      }`}
    >
      <Arrow />
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component node={node} nodes={nodes} />
      </div>
    </div>
  );
};

export default EndNode;
