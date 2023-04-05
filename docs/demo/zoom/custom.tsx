import React, { useState, useRef, useContext } from 'react';
import { Button } from 'antd';
import FlowBuilder, {
  NodeContext,
  INode,
  IRegisterNode,
  IFlowBuilderMethod,
} from 'react-flow-builder';
import {
  DrawerComponent,
  PopconfirmComponent,
  PopoverComponent,
} from '../antd';

import './index.css';

const StartNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="start-node">{node.name}</div>;
};

const EndNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="end-node">{node.name}</div>;
};

const NodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="other-node">{node.name}</div>;
};

const ConditionNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="condition-node">{node.name}</div>;
};

const registerNodes: IRegisterNode[] = [
  {
    type: 'start',
    name: '开始节点',
    displayComponent: StartNodeDisplay,
    isStart: true,
  },
  {
    type: 'end',
    name: '结束节点',
    displayComponent: EndNodeDisplay,
    isEnd: true,
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

const defaultNodes = [
  {
    id: 'node-0d9d4733-e48c-41fd-a41f-d93cc4718d97',
    type: 'start',
    name: 'start',
    path: ['0'],
  },
  {
    id: 'node-b2ffe834-c7c2-4f29-a370-305adc03c010',
    type: 'branch',
    name: '分支节点',
    children: [
      {
        id: 'node-cf9c8f7e-26dd-446c-b3fa-b2406fc7821a',
        type: 'condition',
        name: '条件节点',
        children: [
          {
            id: 'node-f227cd08-a503-48b7-babf-b4047fc9dfa5',
            type: 'node',
            name: '普通节点',
            path: ['1', 'children', '0', 'children', '0'],
          },
        ],
        path: ['1', 'children', '0'],
      },
      {
        id: 'node-9d393627-24c0-469f-818a-319d9a678707',
        type: 'condition',
        name: '条件节点',
        children: [],
        path: ['1', 'children', '1'],
      },
    ],
    path: ['1'],
  },
  {
    id: 'node-972401ca-c4db-4268-8780-5607876d8372',
    type: 'node',
    name: '普通节点',
    path: ['2'],
  },
  {
    id: 'node-b106675a-5148-4a2e-aa86-8e06abd692d1',
    type: 'end',
    name: 'end',
    path: ['3'],
  },
];

const Zoom = () => {
  const [nodes, setNodes] = useState<INode[]>(defaultNodes);
  const [zoom, setZoom] = useState(100);
  const [outDisabled, setOutDisabled] = useState(false);
  const [inDisabled, setInDisabled] = useState(false);

  const ref = useRef<IFlowBuilderMethod>(null);

  const handleChange = (nodes: INode[]) => {
    console.log('nodes change', nodes);
    setNodes(nodes);
  };

  const handleZoomChange = (outDisabled, value, inDisabled) => {
    setOutDisabled(outDisabled);
    setInDisabled(inDisabled);
    setZoom(value);
  };

  return (
    <>
      <Button disabled={outDisabled} onClick={() => ref.current.zoom('out')}>
        -
      </Button>
      {zoom}
      <Button disabled={inDisabled} onClick={() => ref.current.zoom('in')}>
        +
      </Button>
      <Button onClick={() => ref.current.zoom(60)}>60</Button>
      <FlowBuilder
        ref={ref}
        zoomTool={{
          hidden: true,
          min: 10,
          max: 150,
          step: 25,
        }}
        nodes={nodes}
        onChange={handleChange}
        registerNodes={registerNodes}
        onZoomChange={handleZoomChange}
        DrawerComponent={DrawerComponent}
        PopoverComponent={PopoverComponent}
        PopconfirmComponent={PopconfirmComponent}
      />
    </>
  );
};

export default Zoom;
