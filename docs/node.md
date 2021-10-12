---
order: 2
---

# 节点注册

不同的使用场景对节点的数量、类型、样式等都有不用的诉求，react-flow-builder 提供了 `registerNodes` 属性，通过节点注册的机制满足个性化场景。

分为 5 种节点类型：

- 开始节点
- 结束节点
- 分支节点
- 条件节点
- 其他

## 自定义节点

### RegisterNode

| 参数              | 说明                                                        | 类型            | 必须 | 默认值 |
| :---------------- | :---------------------------------------------------------- | :-------------- | :--- | :----- |
| addIcon           | 在可添加节点列表中的图标，有一些内置图标                    | React.ReactNode |      | -      |
| conditionNodeType | 对应的条件节点类型（若有效则此节点为分支节点）              | string          |      | -      |
| name              | 节点名称                                                    | string          | ✓    | -      |
| type              | 节点类型，约定 `start` 为开始节点类型，`end` 为结束节点类型 | string          | ✓    | -      |

<br>

<code src="./demo/node/register/index.tsx" />

## 自定义节点样式

### RegisterNode

| 参数             | 说明           | 类型                                              | 必须 | 默认值 |
| :--------------- | :------------- | :------------------------------------------------ | :--- | :----- |
| displayComponent | 节点的展示组件 | React.FC\<[DisplayComponent](#displaycomponent)\> |      | -      |

### DisplayComponent

| 参数 | 说明     | 类型 | 默认值 |
| :--- | :------- | :--- | :----- |
| node | 节点信息 | Node | -      |

<br>

<code src="./demo/node/display/index.tsx" />

## 自定义节点表单

### RegisterNode

| 参数            | 说明           | 类型                                            | 必须 | 默认值 |
| :-------------- | :------------- | :---------------------------------------------- | :--- | :----- |
| configComponent | 节点的表单组件 | React.FC\<[ConfigComponent](#configcomponent)\> |      | -      |

### ConfigComponent

| 参数     | 说明                                                                                                                                    | 类型                                                 | 默认值 |
| :------- | :-------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------- | :----- |
| node     | 节点信息                                                                                                                                | Node                                                 | -      |
| onCancel | 取消时调用，用来关闭抽屉                                                                                                                | () => void                                           | -      |
| onSave   | 保存节点数据时调用（自动关闭抽屉，不需要开发者执行 onCancel 方法），react-flow-builder 会根据第二个参数设置节点的 `validateStatusError` | (values: any, validateStatusError?: boolean) => void | -      |

<br>

<code src="./demo/node/form/index.tsx" />
