import React from 'react';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { INode, IRegisterNode } from '../index';

interface IProps {
  node: INode;
  registerNodes: IRegisterNode[];
}

const EndNode: React.FC<IProps> = (props) => {
  const { node, registerNodes } = props;

  const Component =
    getRegisterNode(registerNodes, node.type)?.displayComponent || DefaultNode;

  return (
    <div className="flow-builder-node flow-builder-end-node">
      <div className="flow-builder-node__content">
        <Component node={node} />
      </div>
    </div>
  );
};

export default EndNode;
