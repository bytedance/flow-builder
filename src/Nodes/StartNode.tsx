import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';

const StartNode: React.FC = () => {
  const { registerNodes, nodes } = useContext(BuilderContext);

  const node = useContext(NodeContext);

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  return (
    <div className="flow-builder-node flow-builder-start-node">
      <div className="flow-builder-node__content">
        <Component node={node} nodes={nodes} />
      </div>

      <AddButton />
    </div>
  );
};

export default StartNode;
