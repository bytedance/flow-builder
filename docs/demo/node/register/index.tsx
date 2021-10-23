import React, { useState } from 'react';
import FlowBuilder, { INode, IRegisterNode } from 'react-flow-builder';

const registerNodes: IRegisterNode[] = [
  {
    type: 'node1',
    name: '普通节点 1',
  },
  {
    type: 'node2',
    name: '普通节点 2',
  },
  {
    type: 'condition',
    name: '条件节点',
  },
  {
    type: 'branch',
    name: '分支节点',
    conditionNodeType: 'condition',
  },
];

const Index = () => {
  const [nodes, setNodes] = useState<INode[]>([]);

  const handleChange = (nodes: INode[]) => {
    console.log('nodes change', nodes);
    setNodes(nodes);
  };

  return (
    <FlowBuilder
      nodes={nodes}
      onChange={handleChange}
      registerNodes={registerNodes}
    />
  );
};

export default Index;
