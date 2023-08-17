import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';

const StartNode: React.FC = () => {
  const { registerNodes, nodes, beforeNodeClick, allowStartConfig } =
    useContext(BuilderContext);

  const node = useContext(NodeContext);

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const { clickNode } = useAction();

  const handleNodeClick = async () => {
    try {
      if (!allowStartConfig) {
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
      className={`flow-builder-node flow-builder-start-node ${
        registerNode?.className || ''
      }`}
    >
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component node={node} nodes={nodes} />
      </div>

      <AddButton />
    </div>
  );
};

export default StartNode;
