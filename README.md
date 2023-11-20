# Introduction

English | [简体中文](https://github.com/bytedance/flow-builder/blob/main/README.zh-CN.md)

A highly customizable streaming flow builder. The registration ability can flexibly customize your nodes, different types of node display and form, etc.

| ![demo1](https://camo.githubusercontent.com/eb256eb3d1ea49164b5d70be43be26212e8355666ccbf6b5f8279abf02ae15e4/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f62663632396530666c7931677663736f3033717a6e6a323161693167637464652e6a7067) | ![demo2](https://camo.githubusercontent.com/dd06c1e7c2762899ffb84da7c32de5992dfc57ab2b15e4c768953622cd0fcdc0/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f30303376694548356c7931677663736f36797764316a36317238313767776c3630322e6a7067) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## Try it out

http://react-flow-builder.site

## Github

https://github.com/bytedance/flow-builder

## Installation

```
yarn add react-flow-builder

or

npm install react-flow-builder
```

## Usage

```tsx
// index.tsx
import React, { useState, useContext } from 'react';
import FlowBuilder, {
  NodeContext,
  INode,
  IRegisterNode,
} from 'react-flow-builder';

import './index.css';

const StartNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="start-node">{node.name}</div>;
};

const EndNodeDisplay: React.FC = () => {
  const node = useContext(NodeContext);
  return <div className="end-node">{node.name}</div>;
};

const OtherNodeDisplay: React.FC = () => {
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
    name: 'start node',
    displayComponent: StartNodeDisplay,
    isStart: true,
  },
  {
    type: 'end',
    name: 'end node',
    displayComponent: EndNodeDisplay,
    isEnd: true,
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

| Property                  | Description                                         | Type                                                                         | Required | Default    | Version |
| :------------------------ | :-------------------------------------------------- | :--------------------------------------------------------------------------- | :------- | :--------- | :------ |
| backgroundColor           | The color of background                             | `string`                                                                     |          | #F7F7F7    |         |
| className                 | The class name of the container                     | `string`                                                                     |          | -          |
| draggable                 | drag and drop                                       | `boolean`                                                                    |          | false      | 1.0.0   |
| DragComponent             | custom drag component                               | `React.FC`\<[DragComponent](#dragcomponent)\>                                |          | -          | 1.0.0   |
| DropComponent             | custom drop component                               | `React.FC`\<[DropComponent](#dropcomponent)\>                                |          | -          | 1.0.0   |
| createUuid                | custom node uuid                                    | `(type?: string) => string`                                                  |          | -          | 2.0.0   |
| DrawerComponent           | Drawer component                                    | `React.FC`\<[DrawerComponent](#drawercomponent)\>                            |          | -          | 2.0.0   |
| PopoverComponent          | Popover component                                   | `React.FC`\<[PopoverComponent](#popovercomponent)\>                          |          | -          | 2.0.0   |
| PopconfirmComponent       | Popconfirm component                                | `React.FC`\<[PopconfirmComponent](#popconfirmcomponent)\>                    |          | -          | 2.0.0   |
| drawerProps               | Extra props of DrawerComponent                      | `any`                                                                        |          | -          |         |
| drawerVisibleWhenAddNode  | Drawer visible when add node                        | `boolean`                                                                    |          | false      |         |
| historyTool               | undo and redo                                       | `boolean` \| [HistoryToolConfig](#historytoolconfig)                         |          | false      |
| layout                    | Use vertical or horizontal layout                   | `vertical` \| `horizontal`                                                   |          | `vertical` |         |
| lineColor                 | The color of line                                   | `string`                                                                     |          | #999999    |         |
| nodes                     | The nodes of FlowBuilder                            | [Node](#node)[]                                                              | ✓        | -          |         |
| readonly                  | Readonly mode, cannot add, remove, configure.       | `boolean`                                                                    |          | false      |         |
| registerNodes             | The registered nodes                                | [RegisterNode](#registernode)[]                                              | ✓        | -          |         |
| registerRemoteNodes       | The registered remote nodes                         | [RegisterRemoteNode](#registerremotenode)[]                                  |          | -          | 1.3.0   |
| showPracticalBranchNode   | -                                                   | `boolean`                                                                    |          | false      | 1.1.0   |
| showPracticalBranchRemove | -                                                   | `boolean`                                                                    |          | false      | 1.1.0   |
| sortable                  | Condition nodes can be dragged and sorted in branch | `boolean`                                                                    |          | false      | 1.4.0   |
| sortableAnchor            | Anchor for start dragging 序                        | `ReactNode`                                                                  |          | -          | 1.4.0   |
| spaceX                    | Horizontal spacing between nodes                    | `number`                                                                     |          | `16`       |         |
| spaceY                    | Vertical spacing between nodes                      | `number`                                                                     |          | `16`       |
| zoomTool                  | zoom                                                | `boolean` \| [ZoomToolConfig](#zoomtoolconfig)                               |          | false      |         |
| onChange                  | Callback function for when the data change          | (nodes: [Node](#node)[], changeEvent: `string`, nodeChanged?: INode) => void | ✓        | -          |         |
| onHistoryChange           |                                                     | `(undoDisabled: boolean, redoDisabled: boolean) => void`                     |          | -          |         |
| onZoomChange              |                                                     | `(outDisabled: boolean, value: number, inDisabled: boolean) => void`         |          | -          |         |
| showArrow                 | Show arrow                                          | `boolean`                                                                    |          | false      | 1.4.5   |
| arrowIcon                 | The icon of the arrow                               | `ReactNode`                                                                  |          | -          | 1.4.5   |
| onAddNodeSuccess          | Called when add node success                        | `(type: string, node: INode) => void`                                        |          | -          | 1.4.9   |
| onDropNodeSuccess         | Called when drop node success                       | `(type: string, node: INode) => void`                                        |          | -          | 1.4.9   |
| onRemoveNodeSuccess       | Called when remove node success                     | `(node: INode) => void`                                                      |          | -          | 2.2.0   |
| allowStartConfig          | Allow start node config                             | `boolean`                                                                    |          | -          | 2.1.0   |
| allowEndConfig            | Allow end node config                               | `boolean`                                                                    |          | -          | 2.1.0   |

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

#### DragComponent

| Property    | Description                                                                                                                        | Type                         | Version |
| :---------- | :--------------------------------------------------------------------------------------------------------------------------------- | :--------------------------- | :------ |
| onDragStart | The dragStart event of the custom drag component needs to call this method to set the dragged type（ dragType in BuilderContext ） | `(nodeType: string) => void` | 1.0.0   |
| onDragEnd   | The dragEnd event of the custom drag component needs to call this method to clear the dragged type（ dragType in BuilderContext ） | `() => void`                 | 1.0.0   |

#### DropComponent

| Property | Description                                                                                    | Type         | Version |
| :------- | :--------------------------------------------------------------------------------------------- | :----------- | :------ |
| onDrop   | The drop event of the custom drop component needs to call this method to add the new node type | `() => void` | 1.0.0   |

#### DrawerComponent

| Property           | Description                                                      | Type                            | Version |
| :----------------- | :--------------------------------------------------------------- | :------------------------------ | :------ |
| visible            | You can judge the boolean value of **selectedNode** by yourself. | `any`                           | 2.0.0   |
| onClose            | You can also call **closeDrawer** by yourself.                   | `any`                           | 2.0.0   |
| children           |                                                                  | `any`                           | 2.0.0   |
| title              |                                                                  | `any`                           | 2.0.0   |
| width              |                                                                  | `any`                           | 2.0.0   |
| destroyOnClose     |                                                                  | `any`                           | 2.0.0   |
| maskClosable       |                                                                  | `any`                           | 2.0.0   |
| configComponentRef |                                                                  | `React.MutableRefObject`\<any\> | 2.5.0   |

#### PopoverComponent

| Property          | Description | Type  | Version |
| :---------------- | :---------- | :---- | :------ |
| visible           |             | `any` | 2.0.0   |
| onVisibleChange   |             | `any` | 2.0.0   |
| children          |             | `any` | 2.0.0   |
| overlayClassName  |             | `any` | 2.0.0   |
| placement         |             | `any` | 2.0.0   |
| trigger           |             | `any` | 2.0.0   |
| content           |             | `any` | 2.0.0   |
| getPopupContainer |             | `any` | 2.0.0   |

#### PopconfirmComponent

| Property          | Description                                | Type  | Version |
| :---------------- | :----------------------------------------- | :---- | :------ |
| title             |                                            | `any` | 2.0.0   |
| onConfirm         | You can also call **removeNode** yourself. | `any` | 2.0.0   |
| children          |                                            | `any` | 2.0.0   |
| getPopupContainer |                                            | `any` | 2.0.0   |

### FlowBuilderInstance

| Name        | Description    | Type                                                                            | Version |
| :---------- | :------------- | :------------------------------------------------------------------------------ | :------ |
| add         | add node       | `(node: INode, newNodeType: string) => void` \| `(newNodeType: string) => void` |
| history     | undo, redo     | `(type: 'undo' \| 'redo') => void`                                              |
| remove      | remove noded   | `(nodes: INode \| INode[] = useContext(NodeContext)) => void`                   |
| zoom        | zoom           | `(type: 'out' \| 'in' \| number) => void`                                       |
| closeDrawer | close drawer   | `() => void`                                                                    |
| context     | BuilderContext | [BuilderContext](#buildercontext)                                               | 1.3.5   |

### Formatter

| Name           | Description             | Type                                                                    |
| :------------- | :---------------------- | :---------------------------------------------------------------------- |
| buildFlatNodes | Translate to flat nodes | `(params: {registerNodes: IRegisterNode[], nodes: INode[]}) => INode[]` |
| buildTreeNodes | Translate to tree nodes | `(params: {nodes: INode[]}) => INode[]`                                 |
| createUuid     | Create uuid             | `(prefix?: string) => string`                                           |

### RegisterNode

| Property                  | Description                                                                                                                     | Type                                                                                                                                                         | Required | Default                           | Version |
| :------------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :------- | :-------------------------------- | :------ |
| addableComponent          |                                                                                                                                 | `React.FC`\<[AddableComponent](#addablecomponent)\>                                                                                                          |          | -                                 |
| addableNodeTypes          | The list of nodes that can be added below the node                                                                              | `string[]`                                                                                                                                                   |          | -                                 |
| addIcon                   | The icon in addable node list (There are already some default icons)                                                            | `ReactNode`                                                                                                                                                  |          | -                                 |
| addConditionIcon          | The icon of the branch node when adding a condition (The default icon already exists)                                           | `ReactNode`                                                                                                                                                  |          | -                                 | 1.3.3   |
| className                 | The class name of node                                                                                                          | `string`                                                                                                                                                     |          | -                                 | 1.3.4   |
| conditionMaxNum           | The max number of condition node                                                                                                | `number`                                                                                                                                                     |          | -                                 |
| conditionNodeType         | The type of condition node                                                                                                      | `string`                                                                                                                                                     |          | -                                 |
| configComponent           | The Component of configuring node form                                                                                          | `React.FC`\<[ConfigComponent](#configcomponent)\> \| `React.ForwardRefExoticComponent`\<[ConfigComponent](#configcomponent) & `React.RefAttributes`\<any\>\> |          | -                                 |
| configTitle               | The drawer title of configuring node                                                                                            | `string \| ((node: INode, nodes: INode[]) => string)`                                                                                                        |          | -                                 |
| customRemove              | Custom remove button                                                                                                            | `boolean`                                                                                                                                                    |          | false                             |
| displayComponent          | The Component of displaying node                                                                                                | `React.FC`\<[DisplayComponent](#displaycomponent)\>                                                                                                          |          | -                                 |
| initialNodeData           | the initial data when add new node                                                                                              | `Record<string, any>`                                                                                                                                        |          | -                                 |
| isStart                   | Is start node                                                                                                                   | `boolean`                                                                                                                                                    |          | false                             |
| isEnd                     | Is end node                                                                                                                     | `boolean`                                                                                                                                                    |          | false                             |
| isLoop                    | Is loop node                                                                                                                    | `boolean`                                                                                                                                                    |          | false                             | 1.4.6   |
| name                      | The name of node                                                                                                                | `string`                                                                                                                                                     | ✓        | -                                 |
| removeConfirmTitle        | The confirmation information before deleting the node. The [title](https://ant.design/components/popconfirm/#API) of Popconfirm | `string` \| `ReactNode`                                                                                                                                      |          | Are you sure to remove this node? |
| showPracticalBranchNode   | -                                                                                                                               | `boolean`                                                                                                                                                    |          | false                             | 1.1.0   |
| showPracticalBranchRemove | -                                                                                                                               | `boolean`                                                                                                                                                    |          | false                             | 1.1.0   |
| type                      | The type of node, promise `start` is start node type and `end` is end node type                                                 | `string`                                                                                                                                                     | ✓        | -                                 |

### RegisterRemoteNode

| Property | Description    | Type     | Required | Default | Version |
| :------- | :------------- | :------- | :------- | :------ | :------ |
| url      | remote url     | `string` | ✓        | -       | 1.3.0   |
| cssUrl   | remote css url | `string` |          | -       | 1.3.0   |

#### DisplayComponent

| Property | Description                                                       | Type                                 |
| :------- | :---------------------------------------------------------------- | :----------------------------------- |
| node     | The all information of node (NodeContext is recommended since V1) | [Node](#node)                        |
| nodes    | (BuilderContext is recommended since V1)                          | [Node](#node)[]                      |
| readonly | (BuilderContext is recommended since V1)                          | `boolean`                            |
| remove   | Remove node (useAction is recommended since V1)                   | `(nodes?: INode \| INode[]) => void` |

#### ConfigComponent

| Property | Description                                                                                                                                                                                                  | Type                                                   |
| :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| cancel   | Called on cancel, used to close the drawer (useDrawer is recommended since V1)                                                                                                                               | `() => void`                                           |
| node     | The all information of node (NodeContext is recommended since V1)                                                                                                                                            | [Node](#node)                                          |
| nodes    | (BuilderContext is recommended since V1)                                                                                                                                                                     | [Node](#node)[]                                        |
| save     | Called on save node data (automatically close the drawer, no need to call cancel). FlowBuilder will set the `validateStatusError` property according to the second param (useDrawer is recommended since V1) | `(values: any, validateStatusError?: boolean) => void` |

#### AddableComponent

| Property | Description                                                       | Type                     |
| :------- | :---------------------------------------------------------------- | :----------------------- |
| add      |                                                                   | `(type: string) => void` |
| node     | The all information of node (NodeContext is recommended since V1) | [Node](#node)            |
| nodes    | (BuilderContext is recommended since V1)                          | [Node](#node)[]          |

### Node

| Property            | Description                                                                                                                     | Type            |
| :------------------ | :------------------------------------------------------------------------------------------------------------------------------ | :-------------- |
| children            | The condition nodes array of branch node, or the next flow of condition node                                                    | [Node](#node)[] |
| configuring         | Whether configuring of node. The display Component can highlight the node according to this property                            | `boolean`       |
| data                | The data of node                                                                                                                | `any`           |
| id                  | The unique id of node                                                                                                           | `string`        |
| name                | The name of node. Same as the `name` of the registered node                                                                     | `string`        |
| path                | The full path in FlowBuilder                                                                                                    | `string[]`      |
| type                | The type of node. Same as the `type` of the registered node                                                                     | `string`        |
| validateStatusError | The Component of configuring node form validate failed. The display Component can highlight the node according to this property | `boolean`       |

### Context

**Added since V1**

In the context of FlowBuilder the following contexts can be used

#### BuilderContext

Contains [props](#flowbuilder) and state. The following is the state:

| Property                    | Description                            | Type                                 |
| :-------------------------- | :------------------------------------- | :----------------------------------- |
| zoomValue                   | current zoom value                     | `number`                             |
| setZoomValue                | set zoomValue                          | `(zoomValue: number) => void`        |
| historyRecords              | history nodes records                  | `INode[][]`                          |
| setHistoryRecords           | set historyRecords                     | `(records: INode[][]) => void`       |
| activeHistoryRecordIndex    | current index in history nodes records | `number`                             |
| setActiveHistoryRecordIndex | set activeHistoryRecordIndex           | `(index: number) => void`            |
| selectedNode                | current selecred node                  | `INode \| undefined`                 |
| setSelectedNode             | set selectedNode                       | `(node: INode \| undefined) => void` |
| drawerTitle                 | the title of Drawer                    | `string`                             |
| setDrawerTitle              | set drawerTitle                        | `(title: string) => void`            |
| dragType                    | dragged node type                      | `string`                             |
| setDragType                 | set dragType                           | `(type: string) => void`             |

#### NodeContext

Get the data of the node where it is used. For details [Node](#node)

### Hooks

**Added since V1**

In the context of FlowBuilder the following hooks can be used

#### useAction

| Property      | Description                                                                             | Type                                                                            | Version |
| :------------ | :-------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------ | :------ |
| clickNode     | click node                                                                              | `(node: INode = useContext(NodeContext)) => void`                               |
| addNode       | add one node. (Get the current node through NodeContext when there is no node property) | `(node: INode, newNodeType: string) => void` \| `(newNodeType: string) => void` |
| addNodeInLoop | add one node in loop node.                                                              | `(newNodeType: string) => void`                                                 | 1.4.6   |
| removeNode    | remove one node or more nodes.                                                          | `(targetNode: INode \| INode[] = useContext(NodeContext)) => void`              |

#### useDrawer

| Property    | Description                                                                                 | Type                                                   |
| :---------- | :------------------------------------------------------------------------------------------ | :----------------------------------------------------- |
| closeDrawer | close Drawer and clear selectedNode                                                         | `() => void`                                           |
| saveDrawer  | save the content in Drawer (same as the save method in [ConfigComponent](#configcomponent)) | `(values: any, validateStatusError?: boolean) => void` |

#### useZoom

| Property | Description                                                                                | Type                                      |
| :------- | :----------------------------------------------------------------------------------------- | :---------------------------------------- |
| minZoom  | minimum zoom value                                                                         | `number`                                  |
| maxZoom  | maximum zoom value                                                                         | `number`                                  |
| zoom     | change zoom value (same as the zoom method in [FlowBuilderInstance](#flowbuilderinstance)) | `(type: 'out' \| 'in' \| number) => void` |

#### useHistory

| Property    | Description                                                                            | Type                                                            |
| :---------- | :------------------------------------------------------------------------------------- | :-------------------------------------------------------------- |
| maxLength   | Maximum length of history nodes records                                                | `number`                                                        |
| pushHistory | add history nodes record                                                               | `(record?: INode[] = useContext(BuilderContext).nodes) => void` |
| history     | undo, redo (same as the history method in [FlowBuilderInstance](#flowbuilderinstance)) | `(type: 'undo' \| 'redo') => void`                              |

#### useSort

| Property | Description      | Type                                              | Version |
| :------- | :--------------- | :------------------------------------------------ | :------ |
| backward | sort to backward | `(node: INode = useContext(NodeContext)) => void` | 1.4.3   |
| forward  | sort to forward  | `(node: INode = useContext(NodeContext)) => void` | 1.4.3   |
| end      | sort to end      | `(node: INode = useContext(NodeContext)) => void` | 1.4.3   |
| start    | sort to start    | `(node: INode = useContext(NodeContext)) => void` | 1.4.3   |
