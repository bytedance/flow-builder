import React, { useState } from 'react';
import FlowBuilder, { INode, IRegisterNode } from 'react-flow-builder';
import {
  DrawerComponent,
  PopconfirmComponent,
  PopoverComponent,
} from '../../antd';

const registerNodes: IRegisterNode[] = [
  {
    type: 'start',
    name: '开始节点',
    isStart: true,
  },
  {
    type: 'end',
    name: '结束节点',
    isEnd: true,
  },
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
  {
    type: 'loop',
    name: '循环节点',
    isLoop: true,
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
      DrawerComponent={DrawerComponent}
      PopoverComponent={PopoverComponent}
      PopconfirmComponent={PopconfirmComponent}
    />
  );
};

export default Index;
