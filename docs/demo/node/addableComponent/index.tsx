import React, { useState } from 'react';
import FlowBuilder, {
  IRegisterNode,
  INode,
  IDisplayComponent,
  IAddableComponent,
} from 'react-flow-builder';

import './index.css';

const StartNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="start-node">{node.name}</div>;
};

const EndNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="end-node">{node.name}</div>;
};

const NodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="other-node">{node.name}</div>;
};

const ConditionNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="condition-node">{node.name}</div>;
};

const CustomAddableComponent: React.FC<IAddableComponent> = ({ add }) => {
  return (
    <div>
      <div
        className="flow-builder-custom-addable-node-item"
        onClick={() => add('node')}
      >
        普通节点
      </div>
    </div>
  );
};

const registerNodes: IRegisterNode[] = [
  {
    type: 'start',
    name: '开始节点',
    displayComponent: StartNodeDisplay,
    addableComponent: CustomAddableComponent,
  },
  {
    type: 'end',
    name: '结束节点',
    displayComponent: EndNodeDisplay,
  },
  {
    type: 'node',
    name: '普通节点',
    displayComponent: NodeDisplay,
  },
  {
    type: 'condition',
    name: '条件节点',
    displayComponent: ConditionNodeDisplay,
  },
  {
    type: 'branch',
    name: '分支节点',
    conditionNodeType: 'condition',
  },
];

const AddableComponent = () => {
  const [nodes, setNodes] = useState<INode[]>([]);

  const handleChange = (nodes: INode[]) => {
    console.log('nodes change', nodes);
    setNodes(nodes);
  };

  return (
    <FlowBuilder
      registerNodes={registerNodes}
      nodes={nodes}
      onChange={handleChange}
    />
  );
};

export default AddableComponent;
