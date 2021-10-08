import React from 'react';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { INode, IRegisterNode } from '../index';

interface IProps {
  node: INode;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
}

const StartNode: React.FC<IProps> = (props) => {
  const { node, registerNodes, renderAddNodeButton } = props;

  const Component =
    getRegisterNode(registerNodes, node.type)?.displayComponent || DefaultNode;

  return (
    <div className="flow-builder-node flow-builder-start-node">
      <div className="flow-builder-node__content">
        <Component node={node} />
      </div>

      {renderAddNodeButton}
    </div>
  );
};

export default StartNode;
