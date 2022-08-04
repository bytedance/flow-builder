---
order: 7
---

# 排序

## 启用

设置 `sortable` 属性为 `true` 即可启用

### FlowBuilder

| 参数     | 说明                       | 类型      | 必须 | 默认值 | 版本  |
| :------- | :------------------------- | :-------- | :--- | :----- | :---- |
| sortable | 条件节点在分支内可拖拽排序 | `boolean` |      | false  | 1.4.0 |

<code src="./demo/sortable/index.tsx" />

## 自定义锚点

### FlowBuilder

| 参数           | 说明                   | 类型        | 必须 | 默认值 | 版本  |
| :------------- | :--------------------- | :---------- | :--- | :----- | :---- |
| sortableAnchor | 自定义拖拽排序的锚点序 | `ReactNode` |      | -      | 1.4.0 |

<code src="./demo/sortable/anchor.tsx" />
