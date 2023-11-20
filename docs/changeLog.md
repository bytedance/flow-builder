---
order: 9
---

# Change Log

## 2.5.0

`2023-11-20`

- `DrawerComponent` 组件增加 `configComponentRef`，通过 `ConfigComponent` 组件的 `ref` 进行方法调用

## 2.4.0

`2023-10-12`

- `onChange` 属性增加第三个参数：`nodeChanged`

## 2.3.0

`2023-09-24`

- `onAddNodeSuccess` 和 `onDropNodeSuccess` 属性增加第二个参数：当前新增的节点

## 2.2.0

`2023-09-05`

- 增加 `onRemoveNodeSuccess` 属性，删除节点之后的回调

## 2.1.0

`2023-08-17`

- 增加 `allowStartConfig` 和 `allowEndConfig` 属性，允许配置开始和结束节点

## 2.0.0

`2023-04-05`

- 不再强依赖 antd 组件库
- 增加 `DrawerComponent` 属性，代替 v1 版本 sdk 内部使用 antd `Drawer` 的地方
- 增加 `PopoverComponent` 属性，代替 v1 版本 sdk 内部使用 antd `Popover` 的地方
- 增加 `PopconfirmComponent` 属性，代替 v1 版本 sdk 内部使用 antd `Popconfirm` 的地方
- 增加 `createUuid` 属性，自定义节点的 uuid
- `div.flow-builder-node__content` 元素外层增加 `div.flow-builder-node__content-wrap` 元素，修复 `Popconfirm` 内容区域的 click 误触发节点的点击事件

## 1.4.9

`2023-04-04`

- 增加 `onAddNodeSuccess` 方法
- 增加 `onDropNodeSuccess` 方法

## 1.4.8

`2023-04-02`

- 修复 `initialNodeData` 浅拷贝 bug
- 移除 `conditionMinNum` 定义（之前没有实现这个逻辑）

## 1.4.7

`2023-02-22`

- 修复 `removeNode` 不能关闭抽屉的 bug

## 1.4.6

`2023-01-14`

- 增加 `isLoop`，循环节点

## 1.4.5

`2022-11-04`

- 增加 `showArrow`，显示箭头
- 增加 `arrowIcon`，在 `showArrow: true` 的前提下可以自定义箭头

## 1.4.3

`2022-08-23`

- 增加 `useSort` 方法，灵活对节点进行排序

## 1.4.4

`2022-11-03`

- 重构分支节点和条件节点的线

## 1.4.2

`2022-08-11`

- 设置 drawerVisibleWhenAddNode 为 true：增加分支节点时，若分支节点注册的 showPracticalBranchNode 为 true 且配置了 configComponent，选中分支节点；否则选中分支节点的第一个条件节点

## 1.4.1

`2022-08-04`

- 优化拖拽排序过程中的虚拟边框

## 1.4.0

`2022-08-04`

- 增加 `sortable` 属性，支持条件节点之间进行拖拽排序

## 1.3.0

`2022-06-09`

- 增加 `registerRemoteNodes` 属性，支持远程节点注册，通过 System.js 加载对应的 js / css 资源

## 1.2.0

`2022-05-24`

- 节点的默认 id 从 `node-` 开头修改为 `节点类型-` 开头

## 1.1.0

`2022-05-19`

- 增加 `showPracticalBranchNode` 和 `showPracticalBranchRemove` 属性，支持显示实际的分支节点
