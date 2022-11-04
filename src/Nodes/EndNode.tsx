import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import Arrow from '../Arrow';

const EndNode: React.FC = () => {
  const { registerNodes, nodes } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  return (
    <div
      className={`flow-builder-node flow-builder-end-node ${
        registerNode?.className || ''
      }`}
    >
      <Arrow />
      <div className="flow-builder-node__content">
        <Component node={node} nodes={nodes} />
      </div>
    </div>
  );
};

export default EndNode;
