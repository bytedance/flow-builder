---
order: 3
---

# 远程节点注册

通过 System.js 从远程加载 js / css 资源

## js 资源

需要按照 umd 规范默认导出节点注册所需要的各个属性。注意：react、antd 等组件可作为 external，不必直接打包到 umd 资源中，否则会导致远程节点资源体积过大，影响加载速度和多个实例出现的其他异常现象

## css 资源

在 css 内容不是特别多的场景下，建议将 css 样式合并 js 资源中，减少 http 请求数量

### 远程组件示例

```javascript
import React from 'react';

import './index.css';

const DisplayComponent = () => {
  return <div className="remote-node">display component</div>;
};

const RemoteDemo = {
  type: 'remote-node',
  name: 'remote-node',
  displayComponent: DisplayComponent,
};

export default RemoteDemo;
```

### umd 格式示例

```javascript
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined'
    ? (module.exports = factory(require('react')))
    : typeof define === 'function' && define.amd
    ? define(['react'], factory)
    : ((global =
        typeof globalThis !== 'undefined' ? globalThis : global || self),
      (global.reactFlowBuilderPkgDemo = factory(global.React)));
})(this, function (React) {
  'use strict';

  function _interopDefaultLegacy(e) {
    return e && typeof e === 'object' && 'default' in e ? e : { default: e };
  }

  var React__default = /*#__PURE__*/ _interopDefaultLegacy(React);

  var DisplayComponent = function DisplayComponent() {
    return /*#__PURE__*/ React__default['default'].createElement(
      'div',
      {
        className: 'remote-node',
      },
      'display component',
    );
  };

  var RemoteDemo = {
    type: 'remote-node',
    name: 'remote-node',
    displayComponent: DisplayComponent,
  };

  return RemoteDemo;
});
```

## RegisterRemoteNode

| 参数   | 说明               | 类型     | 必须 | 默认值 | 版本  |
| :----- | :----------------- | :------- | :--- | :----- | :---- |
| url    | 节点的远程地址     | `string` | ✓    | -      | 1.3.0 |
| cssUrl | 节点样式的远程地址 | `string` |      | -      | 1.3.0 |

<code src="./demo/remote/index.tsx" />
