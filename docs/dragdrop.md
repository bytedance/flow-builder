---
order: 6
---

# 拖拽

## 启用

设置 `draggable` 属性为 `true` 即可启用

### FlowBuilder

| 参数      | 说明             | 类型      | 必须 | 默认值 | 版本  |
| :-------- | :--------------- | :-------- | :--- | :----- | :---- |
| draggable | 是否启用拖拽能力 | `boolean` |      | false  | 1.0.0 |

<code src="./demo/dragdrop/index.tsx" />

## 自定义拖拽面板

`DragComponent` 属性支持自定义左侧的拖拽面板，在自定义组件中实现**拖拽**能力，开始拖拽和结束拖拽时额外调用相应的方法。

### FlowBuilder

| 参数          | 说明           | 类型                                          | 必须 | 默认值 | 版本  |
| :------------ | :------------- | :-------------------------------------------- | :--- | :----- | :---- |
| DragComponent | 自定义拖拽组件 | `React.FC`\<[DragComponent](#dragcomponent)\> |      | -      | 1.0.0 |

### DragComponent

| 参数        | 说明                                                                                                    | 类型                         | 版本  |
| :---------- | :------------------------------------------------------------------------------------------------------ | :--------------------------- | :---- |
| onDragStart | 自定义拖拽组件的 dragStart 事件需要调用此方法，设置正在拖拽的节点类型（ BuilderContext 中的 dragType ） | `(nodeType: string) => void` | 1.0.0 |
| onDragEnd   | 自定义拖拽组件的 dragEnd 事件需要调用此方法，清空正在拖拽的节点类型（ BuilderContext 中的 dragType ）   | `() => void`                 | 1.0.0 |

<code src="./demo/dragdrop/drag.tsx" />

## 自定义放置节点

`DropComponent` 属性支持自定义放置节点，在自定义组件中实现**放置**能力，完成放置动作时额外调用相应的方法。

### FlowBuilder

| 参数          | 说明           | 类型                                          | 必须 | 默认值 | 版本  |
| :------------ | :------------- | :-------------------------------------------- | :--- | :----- | :---- |
| DropComponent | 自定义放置组件 | `React.FC`\<[DropComponent](#dropcomponent)\> |      | -      | 1.0.0 |

### DropComponent

| 参数   | 说明                                                                 | 类型         | 版本  |
| :----- | :------------------------------------------------------------------- | :----------- | :---- |
| onDrop | 自定义放置组件的 drop 事件需要调用此方法，完成放置动作增加对应的节点 | `() => void` | 1.0.0 |

<code src="./demo/dragdrop/drop.tsx" />