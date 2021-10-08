import React, { useState } from 'react';
import FlowBuilder, { INode, IRegisterNode } from 'react-flow-builder';
import DisplayStart from './DisplayNodes/Start';
import DisplayEnd from './DisplayNodes/End';
import DisplayCommon from './DisplayNodes/Common';
import DisplayCondition from './DisplayNodes/Condition';
// import CommonNodeForm from './NodeForms/v3/CommonNodeForm';
// import ConditionNodeForm from './NodeForms/v3/ConditionNodeForm';
import CommonNodeForm from './NodeForms/v4/CommonNodeForm';
import ConditionNodeForm from './NodeForms/v4/ConditionNodeForm';

import './index.less';

const registerNodes: IRegisterNode[] = [
  {
    type: 'start',
    name: 'start',
    displayComponent: DisplayStart,
  },
  {
    type: 'end',
    name: 'end',
    displayComponent: DisplayEnd,
  },
  {
    type: 'common',
    name: 'common',
    deleteConfirmTitle: 'Are you sure to delete this common node?',
    displayComponent: DisplayCommon,
    //@ts-ignore
    configComponent: CommonNodeForm,
  },
  {
    type: 'branch',
    name: 'branch',
    conditionNodeType: 'condition',
  },
  {
    type: 'condition',
    name: 'condition',
    deleteConfirmTitle: 'Are you sure to delete this condition node?',
    displayComponent: DisplayCondition,
    //@ts-ignore
    configComponent: ConditionNodeForm,
  },
];

export default function () {
  const [nodes, setNodes] = useState<INode[]>([]);

  const handleChange = (nodes: INode[], changeEvent?: string) => {
    console.log('nodes change', nodes);
    console.log('changeEvent', changeEvent);
    setNodes(nodes);
  };

  return (
    <div style={{ height: '600px' }}>
      <FlowBuilder
        registerNodes={registerNodes}
        nodes={nodes}
        onChange={handleChange}
        drawerProps={{
          width: 500,
          className: 'flow-builder-drawer',
        }}
      />
    </div>
  );
}
