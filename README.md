# Introduction

English | [简体中文](https://github.com/bytedance/flow-builder/blob/main/README.zh-CN.md)

A highly customizable streaming flow builder. The registration ability can flexibly customize your nodes, different types of node display and form, etc.

| ![demo1](https://camo.githubusercontent.com/eb256eb3d1ea49164b5d70be43be26212e8355666ccbf6b5f8279abf02ae15e4/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f62663632396530666c7931677663736f3033717a6e6a323161693167637464652e6a7067) | ![demo2](https://camo.githubusercontent.com/dd06c1e7c2762899ffb84da7c32de5992dfc57ab2b15e4c768953622cd0fcdc0/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f30303376694548356c7931677663736f36797764316a36317238313767776c3630322e6a7067) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## Try it out

https://react-flow-builder.web.cloudendpoint.cn/

## Installation

```
yarn add react-flow-builder

or

npm install react-flow-builder
```

## Usage

```tsx
// index.tsx
import React, { useState } from 'react';
import FlowBuilder, {
  INode,
  IRegisterNode,
  IDisplayComponent,
} from 'react-flow-builder';

import './index.css';

const StartNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="start-node">{node.name}</div>;
};

const EndNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="end-node">{node.name}</div>;
};

const OtherNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="other-node">{node.name}</div>;
};

const ConditionNodeDisplay: React.FC<IDisplayComponent> = ({ node }) => {
  return <div className="condition-node">{node.name}</div>;
};

const registerNodes: IRegisterNode[] = [
  {
    type: 'start',
    name: 'start node',
    displayComponent: StartNodeDisplay,
  },
  {
    type: 'end',
    name: 'end node',
    displayComponent: EndNodeDisplay,
  },
  {
    type: 'node',
    name: 'other node',
    displayComponent: OtherNodeDisplay,
  },
  {
    type: 'condition',
    name: 'condition node',
    displayComponent: ConditionNodeDisplay,
  },
  {
    type: 'branch',
    name: 'branch node',
    conditionNodeType: 'condition',
  },
];

const Demo = () => {
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

export default Demo;

// index.css
.start-node, .end-node {
  height: 64px;
  width: 64px;
  border-radius: 50%;
  line-height: 64px;
  color: #fff;
  text-align: center;
}

.start-node {
  background-color: #338aff;
}

.end-node {
  background-color: #666;
}

.other-node, .condition-node {
  width: 224px;
  border-radius: 4px;
  color: #666;
  background: #fff;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.08);
}

.other-node {
  height: 118px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.condition-node {
  height: 44px;
  padding: 12px 16px;
}
```

## API

### FlowBuilder

| Property        | Description                                                                                                                                                                                                                              | Type                                                                         | Required | Default    |
| :-------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :------- | :--------- |
| backgroundColor | The color of background                                                                                                                                                                                                                  | `string`                                                                     |          | #F7F7F7    |
| className       | The class name of the container                                                                                                                                                                                                          | `string`                                                                     |          | -          |
| drawerProps     | Extra [props](https://ant.design/components/drawer/#API) of Drawer Component from antd. `visible` and `onClose` have already in FlowBuilder, and {`title`: "Configuration", `width`: 480, `destroyOnClose`: true, `maskClosable`: false} | `DrawerProps`                                                                |          | -          |
| historyTool     | undo and redo                                                                                                                                                                                                                            | `boolean` \| [HistoryToolConfig](#historytoolconfig)                         |          | false      |
| layout          | Use vertical or horizontal layout                                                                                                                                                                                                        | `vertical` \| `horizontal`                                                   |          | `vertical` |
| lineColor       | The color of line                                                                                                                                                                                                                        | `string`                                                                     |          | #999999    |
| nodes           | The nodes of FlowBuilder                                                                                                                                                                                                                 | [Node](#node)[]                                                              | ✓        | -          |
| readonly        | Readonly mode, cannot add, remove, configure.                                                                                                                                                                                            | `boolean`                                                                    |          | false      |
| registerNodes   | The registered nodes                                                                                                                                                                                                                     | [RegisterNode](#registernode)[]                                              | ✓        | -          |
| spaceX          | Horizontal spacing between nodes                                                                                                                                                                                                         | `number`                                                                     |          | `16`       |
| spaceY          | Vertical spacing between nodes                                                                                                                                                                                                           | `number`                                                                     |          | `16`       |
| zoomTool        | zoom                                                                                                                                                                                                                                     | `boolean` \| [ZoomToolConfig](#zoomtoolconfig)                               |          | false      |
| onChange        | Callback function for when the data change                                                                                                                                                                                               | (nodes: [Node](#node)[], changeEvent?: `string`) => void                     | ✓        | -          |
| onHistoryChange |                                                                                                                                                                                                                                          | `(undoDisabled: boolean, redoDisabled: boolean) => void`                     |          | -          |
| onZoomChange    |                                                                                                                                                                                                                                          | `(smallerDisabled: boolean, value: number, biggerDisabled: boolean) => void` |          | -          |

#### HistoryToolConfig

| Property | Description | Type      | Default |
| :------- | :---------- | :-------- | :------ |
| hidden   |             | `boolean` | false   |
| max      |             | `number`  | 10      |

#### ZoomToolConfig

| Property     | Description | Type      | Default |
| :----------- | :---------- | :-------- | :------ |
| hidden       |             | `boolean` | false   |
| initialValue |             | `number`  | 100     |
| min          |             | `number`  | 10      |
| max          |             | `number`  | 200     |
| step         |             | `number`  | 10      |

### FlowBuilderInstance

| Name    | Description | Type                                              |
| :------ | :---------- | :------------------------------------------------ |
| history | undo, redo  | `(type: 'undo' \| 'redo') => void`                |
| zoom    | zoom        | `(type: 'smaller' \| 'bigger' \| number) => void` |

### RegisterNode

| Property           | Description                                                                                                                     | Type                                                | Required | Default                           |
| :----------------- | :------------------------------------------------------------------------------------------------------------------------------ | :-------------------------------------------------- | :------- | :-------------------------------- |
| addableComponent   |                                                                                                                                 | `React.FC`\<[AddableComponent](#addablecomponent)\> |          | -                                 |
| addableNodeTypes   | The list of nodes that can be added below the node                                                                              | `string[]`                                          |          | -                                 |
| addIcon            | The icon in addable node list (There are already some default icons)                                                            | `ReactNode`                                         |          | -                                 |
| conditionNodeType  | The type of condition node                                                                                                      | `string`                                            |          | -                                 |
| configComponent    | The Component of configuring node form                                                                                          | `React.FC`\<[ConfigComponent](#configcomponent)\>   |          | -                                 |
| customRemove       | Custom remove button                                                                                                            | `boolean`                                           |          | false                             |
| removeConfirmTitle | The confirmation information before deleting the node. The [title](https://ant.design/components/popconfirm/#API) of Popconfirm | `string` \| `ReactNode`                             |          | Are you sure to remove this node? |
| displayComponent   | The Component of displaying node                                                                                                | `React.FC`\<[DisplayComponent](#displaycomponent)\> |          | -                                 |
| extraData          | The extra data of the node                                                                                                      | `any`                                               |          | -                                 |
| name               | The name of node                                                                                                                | `string`                                            | ✓        | -                                 |
| type               | The type of node, promise `start` is start node type and `end` is end node type                                                 | `string`                                            | ✓        | -                                 |

#### DisplayComponent

| Property | Description                 | Type          |
| :------- | :-------------------------- | :------------ |
| node     | The all information of node | [Node](#node) |
| remove   | Remove node                 | `() => void`  |

#### ConfigComponent

| Property | Description                                                                                                                                                              | Type                                                   |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| node     | The all information of node                                                                                                                                              | [Node](#node)                                          |
| cancel   | Called on cancel, used to close the drawer                                                                                                                               | `() => void`                                           |
| save     | Called on save node data (automatically close the drawer, no need to call cancel). FlowBuilder will set the `validateStatusError` property according to the second param | `(values: any, validateStatusError?: boolean) => void` |

#### AddableComponent

| Property | Description | Type                     |
| :------- | :---------- | :----------------------- |
| add      |             | `(type: string) => void` |

### Node

| Property            | Description                                                                                                                     | Type            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :-------------- |
| branchs             | The condition nodes array of branch node                                                                                        | [Node](#node)[] |
| configuring         | Whether configuring of node. The display Component can highlight the node according to this property                            | `boolean`       |
| data                | The data of node                                                                                                                | `any`           |
| extraData           | The extra data of node. Same as the `extraData` of the registered node, not deep clone                                          | `any`           |
| id                  | The unique id of node                                                                                                           | `string`        |
| name                | The name of node. Same as the `name` of the registered node                                                                     | `string`        |
| next                | The next flow of condition node                                                                                                 | [Node](#node)[] |
| path                | The full path in FlowBuilder                                                                                                    | `any[]`         |
| type                | The type of node. Same as the `type` of the registered node                                                                     | `string`        |
| validateStatusError | The Component of configuring node form validate failed. The display Component can highlight the node according to this property | `boolean`       |
