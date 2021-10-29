# 简介

[English](https://github.com/bytedance/flow-builder/blob/main/README.md) | 简体中文

高度可定制的流式流程引擎。注册能力可以灵活定制你的节点类型以及不同类型的节点展示和节点表单等。

| ![demo1](https://camo.githubusercontent.com/eb256eb3d1ea49164b5d70be43be26212e8355666ccbf6b5f8279abf02ae15e4/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f62663632396530666c7931677663736f3033717a6e6a323161693167637464652e6a7067) | ![demo2](https://camo.githubusercontent.com/dd06c1e7c2762899ffb84da7c32de5992dfc57ab2b15e4c768953622cd0fcdc0/68747470733a2f2f747661312e73696e61696d672e636e2f6c617267652f30303376694548356c7931677663736f36797764316a36317238313767776c3630322e6a7067) |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |

## 试一试

https://react-flow-builder.web.cloudendpoint.cn/

## 安装

```
yarn add react-flow-builder

或

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
    name: '开始节点',
    displayComponent: StartNodeDisplay,
  },
  {
    type: 'end',
    name: '结束节点',
    displayComponent: EndNodeDisplay,
  },
  {
    type: 'node',
    name: '普通节点',
    displayComponent: OtherNodeDisplay,
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

| 参数            | 说明                                                                                                                                                                                                                 | 类型                                                                         | 必须 | 默认值     |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- | :--- | :--------- |
| backgroundColor | 背景颜色                                                                                                                                                                                                             | `string`                                                                     |      | #F7F7F7    |
| className       | 外层容器的类名                                                                                                                                                                                                       | `string`                                                                     |      | -          |
| drawerProps     | 配置节点时 Drawer 组件额外的 [props](https://ant.design/components/drawer/#API)。流程引擎内置了 `visible` 和 `onClose，以及` {`title`: "Configuration", `width`: 480, `destroyOnClose`: true, `maskClosable`: false} | `DrawerProps`                                                                |      | -          |
| historyTool     | 撤销，重做                                                                                                                                                                                                           | `boolean` \| [HistoryToolConfig](#historytoolconfig)                         |      | false      |
| layout          | 垂直/水平布局                                                                                                                                                                                                        | `vertical` \| `horizontal`                                                   |      | `vertical` |
| lineColor       | 连线的颜色                                                                                                                                                                                                           | `string`                                                                     |      | #999999    |
| nodes           | 流程引擎的节点                                                                                                                                                                                                       | [Node](#node)[]                                                              | ✓    | -          |
| readonly        | 只读模式，不能进行节点的增加、删除、配置                                                                                                                                                                             | `boolean`                                                                    |      | false      |
| registerNodes   | 注册节点                                                                                                                                                                                                             | [RegisterNode](#registernode)[]                                              | ✓    | -          |
| spaceX          | 节点之间水平方向的间距                                                                                                                                                                                               | `number`                                                                     |      | 16         |
| spaceY          | 节点之间垂直方向的间距                                                                                                                                                                                               | `number`                                                                     |      | 16         |
| zoomTool        | 缩放                                                                                                                                                                                                                 | `boolean` \| [ZoomToolConfig](#zoomtoolconfig)                               |      | false      |
| onChange        | 节点数据改变时的回调函数                                                                                                                                                                                             | (nodes: [Node](#node)[], changeEvent?: string) => void                       | ✓    | -          |
| onHistoryChange | 画布的历史状态变化之后的回调，两个参数分别代表是否需要禁用撤销和重做                                                                                                                                                 | `(undoDisabled: boolean, redoDisabled: boolean) => void`                     |      | -          |
| onZoomChange    | 缩放变化之后的回调，三个参数分别代表是否需要禁用缩小、当前的缩放值、是否需要禁用放大                                                                                                                                 | `(smallerDisabled: boolean, value: number, biggerDisabled: boolean) => void` |      | -          |

#### HistoryToolConfig

| 参数   | 说明                     | 类型      | 默认值 |
| :----- | :----------------------- | :-------- | :----- |
| hidden | 是否隐藏默认的历史工具栏 | `boolean` | false  |
| max    | 保留的最多数量           | `number`  | 10     |

#### ZoomToolConfig

| 参数         | 说明                     | 类型      | 默认值 |
| :----------- | :----------------------- | :-------- | :----- |
| hidden       | 是否隐藏默认的缩放工具栏 | `boolean` | false  |
| initialValue | 初始值                   | `number`  | 100    |
| min          | 最小值                   | `number`  | 10     |
| max          | 最大值                   | `number`  | 200    |
| step         | 每次缩放变化大小         | `number`  | 10     |

### FlowBuilderInstance

| 名称    | 说明       | 类型                                              |
| :------ | :--------- | :------------------------------------------------ |
| history | 撤销、重做 | `(type: 'undo' \| 'redo') => void`                |
| zoom    | 缩放       | `(type: 'smaller' \| 'bigger' \| number) => void` |

### Formatter

| 名称           | 说明           | 类型                                                                                        |
| :------------- | :------------- | :------------------------------------------------------------------------------------------ |
| buildFlatNodes | 转换成扁平结构 | `(params: {registerNodes: IRegisterNode[], nodes: INode[], fieldName?: string}) => INode[]` |
| buildTreeNodes | 转换成树形结构 | `(params: {nodes: INode[], fieldName?: string}) => INode[]`                                 |
| createUuid     | 创建 uuid      | `(prefix?: string) => string`                                                               |

### RegisterNode

| 参数               | 说明                                                                                                | 类型                                                | 必须 | 默认值                            |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :-------------------------------------------------- | :--- | :-------------------------------- |
| addableComponent   | 节点下方点击加号展开的内容                                                                          | `React.FC`\<[AddableComponent](#addablecomponent)\> |      | -                                 |
| addableNodeTypes   | 指定节点下方的可添加节点列表                                                                        | `string[]`                                          |      | -                                 |
| addIcon            | 在可添加节点列表中的图标（已经内置了一些图标）                                                      | `ReactNode`                                         |      | -                                 |
| conditionNodeType  | 对应的条件节点类型                                                                                  | `string`                                            |      | -                                 |
| configComponent    | 节点的配置表单组件                                                                                  | `React.FC`\<[ConfigComponent](#configcomponent)\>   |      | -                                 |
| customRemove       | 自定义删除按钮                                                                                      | `boolean`                                           |      | false                             |
| removeConfirmTitle | 删除节点前的提示信息。Popconfirm 组件的 [title](https://ant.design/components/popconfirm/#API) 属性 | `string` \| `ReactNode`                             |      | Are you sure to remove this node? |
| displayComponent   | 节点的展示组件                                                                                      | `React.FC`\<[DisplayComponent](#displaycomponent)\> |      | -                                 |
| extraData          | 节点的额外数据                                                                                      | `any`                                               |      | -                                 |
| name               | 节点名称                                                                                            | `string`                                            | ✓    | -                                 |
| type               | 节点类型，约定 `start` 为开始节点类型，`end` 为结束节点类型                                         | `string`                                            | ✓    | -                                 |

#### DisplayComponent

| 参数        | 说明                 | 类型                      |
| :---------- | :------------------- | :------------------------ |
| node        | 节点信息             | [Node](#node)             |
| remove      | 自定义删除按钮时调用 | `() => void`              |
| batchRemove | 批量删除节点         | `(ids: string[]) => void` |

#### ConfigComponent

| 参数   | 说明                                                                                                                         | 类型                                                   |
| :----- | :--------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| node   | 节点信息                                                                                                                     | [Node](#node)                                          |
| cancel | 取消时调用，用来关闭抽屉                                                                                                     | `() => void`                                           |
| save   | 保存节点数据时调用（自动关闭抽屉，无需再执行 cancel），流程引擎会根据第二个参数的布尔值设置节点的 `validateStatusError` 属性 | `(values: any, validateStatusError?: boolean) => void` |

#### AddableComponent

| 参数 | 说明                               | 类型                     |
| :--- | :--------------------------------- | :----------------------- |
| node | 节点信息                           | [Node](#node)            |
| add  | 增加节点时调用，会自动关闭 popover | `(type: string) => void` |

### Node

| 参数                | 说明                                                     | 类型            |
| :------------------ | :------------------------------------------------------- | :-------------- |
| children            | 分支节点对应的条件节点数组 或 条件节点对应的子流程       | [Node](#node)[] |
| configuring         | 节点是否正在配置，节点的展示组件可根据此属性高亮节点     | `boolean`       |
| data                | 节点的数据                                               | `any`           |
| extraData           | 节点的额外数据，也就是节点注册时的 extraData，不是深拷贝 | `any`           |
| id                  | 节点的唯一 id                                            | `string`        |
| name                | 节点名称，同节点注册时的 name                            | `string`        |
| path                | 节点在流程引擎中的路径                                   | `string[]`      |
| type                | 节点类型，同节点注册时的 `type`                          | `string`        |
| validateStatusError | 节点的表单校验失败，节点的展示组件可根据此属性高亮节点   | `boolean`       |
