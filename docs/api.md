---
order: 5
---

# API

## FlowBuilder

| 参数                     | 说明                                                                                                                                                                                                                 | 类型                                                                 | 必须 | 默认值     |
| :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :--- | :--------- |
| backgroundColor          | 背景颜色                                                                                                                                                                                                             | `string`                                                             |      | #F7F7F7    |
| className                | 外层容器的类名                                                                                                                                                                                                       | `string`                                                             |      | -          |
| drawerProps              | 配置节点时 Drawer 组件额外的 [props](https://ant.design/components/drawer/#API)。流程引擎内置了 `visible` 和 `onClose，以及` {`title`: "Configuration", `width`: 480, `destroyOnClose`: true, `maskClosable`: false} | `DrawerProps`                                                        |      | -          |
| drawerVisibleWhenAddNode | 增加节点时打开抽屉                                                                                                                                                                                                   | `boolean`                                                            |      | false      |
| historyTool              | 撤销，重做                                                                                                                                                                                                           | `boolean` \| [HistoryToolConfig](#historytoolconfig)                 |      | false      |
| layout                   | 垂直/水平布局                                                                                                                                                                                                        | `vertical` \| `horizontal`                                           |      | `vertical` |
| lineColor                | 连线的颜色                                                                                                                                                                                                           | `string`                                                             |      | #999999    |
| nodes                    | 流程引擎的节点                                                                                                                                                                                                       | [Node](#node)[]                                                      | ✓    | -          |
| readonly                 | 只读模式，不能进行节点的增加、删除、配置                                                                                                                                                                             | `boolean`                                                            |      | false      |
| registerNodes            | 注册节点                                                                                                                                                                                                             | [RegisterNode](#registernode)[]                                      | ✓    | -          |
| spaceX                   | 节点之间水平方向的间距                                                                                                                                                                                               | `number`                                                             |      | 16         |
| spaceY                   | 节点之间垂直方向的间距                                                                                                                                                                                               | `number`                                                             |      | 16         |
| zoomTool                 | 缩放                                                                                                                                                                                                                 | `boolean` \| [ZoomToolConfig](#zoomtoolconfig)                       |      | false      |
| onChange                 | 节点数据改变时的回调函数                                                                                                                                                                                             | (nodes: [Node](#node)[], changeEvent?: string) => void               | ✓    | -          |
| onHistoryChange          | 历史状态变化之后的回调，两个参数分别代表是否需要禁用撤销和重做                                                                                                                                                       | `(undoDisabled: boolean, redoDisabled: boolean) => void`             |      | -          |
| onZoomChange             | 缩放变化之后的回调，三个参数分别代表是否需要禁用缩小、当前的缩放值、是否需要禁用放大                                                                                                                                 | `(outDisabled: boolean, value: number, inDisabled: boolean) => void` |      | -          |

### HistoryToolConfig

| 参数   | 说明                     | 类型      | 默认值 |
| :----- | :----------------------- | :-------- | :----- |
| hidden | 是否隐藏默认的历史工具栏 | `boolean` | false  |
| max    | 保留的最多数量           | `number`  | 10     |

### ZoomToolConfig

| 参数         | 说明                     | 类型      | 默认值 |
| :----------- | :----------------------- | :-------- | :----- |
| hidden       | 是否隐藏默认的缩放工具栏 | `boolean` | false  |
| initialValue | 初始值                   | `number`  | 100    |
| min          | 最小值                   | `number`  | 10     |
| max          | 最大值                   | `number`  | 200    |
| step         | 每次缩放变化大小         | `number`  | 10     |

## FlowBuilderInstance

| 名称        | 说明               | 类型                                         |
| :---------- | :----------------- | :------------------------------------------- |
| add         | 增加节点           | `(node: INode, newNodeType: string) => void` |
| history     | 撤销、重做         | `(type: 'undo' \| 'redo') => void`           |
| remove      | 删除一个或多个节点 | `(nodes: INode \| INode[]) => void`          |
| zoom        | 缩放               | `(type: 'out' \| 'in' \| number) => void`    |
| closeDrawer | 关闭抽屉           | `() => void`                                 |

### Formatter

| 名称           | 说明           | 类型                                                                    |
| :------------- | :------------- | :---------------------------------------------------------------------- |
| buildFlatNodes | 转换成扁平结构 | `(params: {registerNodes: IRegisterNode[], nodes: INode[]}) => INode[]` |
| buildTreeNodes | 转换成树形结构 | `(params: {nodes: INode[]}) => INode[]`                                 |
| createUuid     | 创建 uuid      | `(prefix?: string) => string`                                           |

## RegisterNode

| 参数               | 说明                                                                                                | 类型                                                  | 必须 | 默认值                            |
| :----------------- | :-------------------------------------------------------------------------------------------------- | :---------------------------------------------------- | :--- | :-------------------------------- |
| addableComponent   | 节点下方点击加号展开的内容                                                                          | `React.FC`\<[AddableComponent](#addablecomponent)\>   |      | -                                 |
| addableNodeTypes   | 指定节点下方的可添加节点列表                                                                        | `string[]`                                            |      | -                                 |
| addIcon            | 在可添加节点列表中的图标（已经内置了一些图标）                                                      | `ReactNode`                                           |      | -                                 |
| conditionMinNum    | 对应的条件节点最小数量                                                                              | `number`                                              |      | 1                                 |
| conditionMaxNum    | 对应的条件节点最大数量                                                                              | `number`                                              |      | -                                 |
| conditionNodeType  | 对应的条件节点类型                                                                                  | `string`                                              |      | -                                 |
| configComponent    | 节点的配置表单组件                                                                                  | `React.FC`\<[ConfigComponent](#configcomponent)\>     |      | -                                 |
| configTitle        | 节点对应的抽屉标题                                                                                  | `string \| ((node: INode, nodes: INode[]) => string)` |      | -                                 |
| customRemove       | 自定义删除按钮                                                                                      | `boolean`                                             |      | false                             |
| displayComponent   | 节点的展示组件                                                                                      | `React.FC`\<[DisplayComponent](#displaycomponent)\>   |      | -                                 |
| initialNodeData    | 增加节点时初始化数据                                                                                | `Record<string, any>`                                 |      | -                                 |
| isStart            | 是否为开始节点                                                                                      | `boolean`                                             |      | false                             |
| isEnd              | 是否为结束节点                                                                                      | `boolean`                                             |      | false                             |
| name               | 节点名称                                                                                            | `string`                                              | ✓    | -                                 |
| removeConfirmTitle | 删除节点前的提示信息。Popconfirm 组件的 [title](https://ant.design/components/popconfirm/#API) 属性 | `string` \| `ReactNode`                               |      | Are you sure to remove this node? |
| type               | 节点类型                                                                                            | `string`                                              | ✓    | -                                 |

### DisplayComponent

| 参数     | 说明                                 | 类型                                 |
| :------- | :----------------------------------- | :----------------------------------- |
| node     | 节点信息                             | [Node](#node)                        |
| nodes    |                                      | [Node](#node)[]                      |
| readonly | 继承 FlowBuilder 的 readonly         | `boolean`                            |
| remove   | 删除一个或多个节点，默认删除当前节点 | `(nodes?: INode \| INode[]) => void` |

### ConfigComponent

| 参数   | 说明                                                                                                                         | 类型                                                   |
| :----- | :--------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| cancel | 取消时调用，用来关闭抽屉                                                                                                     | `() => void`                                           |
| node   | 节点信息                                                                                                                     | [Node](#node)                                          |
| nodes  |                                                                                                                              | [Node](#node)[]                                        |
| save   | 保存节点数据时调用（自动关闭抽屉，无需再执行 cancel），流程引擎会根据第二个参数的布尔值设置节点的 `validateStatusError` 属性 | `(values: any, validateStatusError?: boolean) => void` |

### AddableComponent

| 参数  | 说明                               | 类型                     |
| :---- | :--------------------------------- | :----------------------- |
| add   | 增加节点时调用，会自动关闭 popover | `(type: string) => void` |
| node  | 节点信息                           | [Node](#node)            |
| nodes |                                    | [Node](#node)[]          |

## Node

| 参数                | 说明                                                   | 类型            |
| :------------------ | :----------------------------------------------------- | :-------------- |
| children            | 分支节点对应的条件节点数组 或 条件节点对应的子流程     | [Node](#node)[] |
| configuring         | 节点是否正在配置，节点的展示组件可根据此属性高亮节点   | `boolean`       |
| data                | 节点的数据                                             | `any`           |
| id                  | 节点的唯一 id                                          | `string`        |
| name                | 节点名称，同节点注册时的 name                          | `string`        |
| path                | 节点在流程引擎中的路径                                 | `string[]`      |
| type                | 节点类型，同节点注册时的 `type`                        | `string`        |
| validateStatusError | 节点的表单校验失败，节点的展示组件可根据此属性高亮节点 | `boolean`       |
