---
order: 4
---

# 缩放

通过 css zoom 属性实现画布的缩放

## 启用

设置 `zoomTool` 属性为 `true` 即可启用缩放功能。

### FlowBuilder

| 参数     | 说明 | 类型                                           | 必须 | 默认值 |
| :------- | :--- | :--------------------------------------------- | :--- | :----- |
| zoomTool | 缩放 | `boolean` \| [ZoomToolConfig](#zoomtoolconfig) |      | false  |

#### ZoomToolConfig

| 参数         | 说明                     | 类型      | 默认值 |
| :----------- | :----------------------- | :-------- | :----- |
| hidden       | 是否隐藏默认的缩放工具栏 | `boolean` | false  |
| initialValue | 初始值                   | `number`  | 100    |
| min          | 最小值                   | `number`  | 10     |
| max          | 最大值                   | `number`  | 200    |
| step         | 每次缩放变化大小         | `number`  | 10     |

<br>

<code src="./demo/zoom/index.tsx" />

## 自定义缩放参数

将 `zoomTool` 设置为具体的配置对象。

<code src="./demo/zoom/config.tsx" />

## 自定义缩放工具栏

调用 react-flow-builder 实例中的 `zoom` 方法也可以进行缩放，同时监听 `onZoomChange` 事件。

### FlowBuilder

| 参数         | 说明                                                                                 | 类型                                                                 | 必须 | 默认值 |
| :----------- | :----------------------------------------------------------------------------------- | :------------------------------------------------------------------- | :--- | :----- |
| onZoomChange | 缩放变化之后的回调，三个参数分别代表是否需要禁用缩小、当前的缩放值、是否需要禁用放大 | `(outDisabled: boolean, value: number, inDisabled: boolean) => void` |      | -      |

### FlowBuilderInstance

| 名称 | 说明 | 类型                                      |
| :--- | :--- | :---------------------------------------- |
| zoom | 缩放 | `(type: 'out' \| 'in' \| number) => void` |

<br>

<code src="./demo/zoom/custom.tsx" />
