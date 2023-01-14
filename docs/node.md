---
order: 2
---

# 节点注册

不同的使用场景对节点的数量、类型、样式等都有不用的诉求，react-flow-builder 提供了 `registerNodes` 属性，通过节点注册的机制满足个性化场景。

分为 6 种节点类型：

- 开始节点
- 结束节点
- 分支节点
- 条件节点
- 普通节点
- 循环节点

## 节点数量

### RegisterNode

| 参数              | 说明                                           | 类型    | 必须 | 默认值 |
| :---------------- | :--------------------------------------------- | :------ | :--- | :----- |
| conditionNodeType | 对应的条件节点类型（若有效则此节点为分支节点） | string  |      | -      |
| name              | 节点名称                                       | string  | ✓    | -      |
| type              | 节点类型                                       | string  | ✓    | -      |
| isStart           | 是否为开始节点                                 | boolean |      | false  |
| isEnd             | 是否为结束节点                                 | boolean |      | false  |
| isLoop            | 是否为循环节点                                 | boolean |      | false  |

<br>

<code src="./demo/node/register/index.tsx" />

## 节点样式

通过 `displayComponent` 属性注册节点对应的展示组件，实现不同风格的交互设计

### RegisterNode

| 参数             | 说明           | 类型                                              | 必须 | 默认值 |
| :--------------- | :------------- | :------------------------------------------------ | :--- | :----- |
| displayComponent | 节点的展示组件 | React.FC\<[DisplayComponent](#displaycomponent)\> |      | -      |

### DisplayComponent

| 参数     | 说明                                                                                       | 类型                                 |
| :------- | :----------------------------------------------------------------------------------------- | :----------------------------------- |
| node     | 节点信息（V1 版本开始推荐使用 NodeContext 获取）                                           | [Node](#node)                        |
| nodes    | （V1 版本开始推荐使用 BuilderContext 获取）                                                | [Node](#node)[]                      |
| readonly | 继承 FlowBuilder 的 readonly（V1 版本开始推荐使用 BuilderContext 获取）                    | `boolean`                            |
| remove   | 删除一个或多个节点，默认删除当前节点（V1 版本开始推荐使用 useAction 中的 removeNode 方法） | `(nodes?: INode \| INode[]) => void` |

<br>

<code src="./demo/node/display/index.tsx" />

## 节点表单

通过 `configComponent` 属性注册节点对应的表单组件，作为点击节点展开抽屉的内容（由于 antd3 和 antd4 的抽屉组件 api 差异较大，需要自行实现抽屉底部的关闭、确认按钮）

### RegisterNode

| 参数            | 说明           | 类型                                            | 必须 | 默认值 |
| :-------------- | :------------- | :---------------------------------------------- | :--- | :----- |
| configComponent | 节点的表单组件 | React.FC\<[ConfigComponent](#configcomponent)\> |      | -      |

### ConfigComponent

| 参数   | 说明                                                                                                                                                                               | 类型                                                   |
| :----- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------- |
| cancel | 取消时调用，用来关闭抽屉（V1 版本开始推荐使用 useDrawer 中的 closeDrawer 方法）                                                                                                    | `() => void`                                           |
| node   | 节点信息（V1 版本开始推荐使用 BuilderContext 获取 selectedNode ）                                                                                                                  | [Node](#node)                                          |
| nodes  | （V1 版本开始推荐使用 BuilderContext 获取）                                                                                                                                        | [Node](#node)[]                                        |
| save   | 保存节点数据时调用（自动关闭抽屉，无需再执行 cancel），流程引擎会根据第二个参数的布尔值设置节点的 `validateStatusError` 属性（V1 版本开始推荐使用 useDrawer 中的 saveDrawer 方法） | `(values: any, validateStatusError?: boolean) => void` |

<br>

<code src="./demo/node/form/index.tsx" />

## 节点的可添加节点列表

默认情况下，所有节点（除结束节点外，结束节点之后不可再添加节点）的可添加节点列表（分支节点、普通节点）都是一样的。通过 `addableNodeTypes` 属性注册节点的可添加节点列表，若此属性为有效数组，则将数组中的所有节点类型作为该节点的可添加节点列表，实现不同节点之间的差异化。

以下例子就实现了：

- 开始节点设置了 addableNodeTypes 为普通节点 --> 只能添加普通节点
- 普通节点和条件节点没有设置 addableNodeTypes --> 所有可添加节点（普通节点和分支节点）
- 分支节点设置了 addableNodeTypes 为空数组 --> 不能再添加节点

<code src="./demo/node/addableNodeTypes/index.tsx" />

## 点击加号之后的展示内容

通过 `addableComponent` 属性注册节点下方点击加号之后展示内容的组件，替换默认的 Popover 组件 content 属性。向自定义组件提供了 `add` 方法在执行添加节点动作时调用。

以下例子就实现了：

- 开始节点点击加号之后的内容自定义
- 其他的节点使用默认内容

<code src="./demo/node/addableComponent/index.tsx" />
