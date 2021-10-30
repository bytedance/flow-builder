import React from 'react';
import DefaultNode from '@/DefaultNode';
import { getRegisterNode } from '@/utils';
import { INode, IRegisterNode } from '@/index';

interface IProps {
  node: INode;
  nodes: INode[];
  registerNodes: IRegisterNode[];
}

const EndNode: React.FC<IProps> = (props) => {
  const { node, nodes, registerNodes } = props;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  return (
    <div className="flow-builder-node flow-builder-end-node">
      <div className="flow-builder-node__content">
        <Component node={node} nodes={nodes} />
      </div>
    </div>
  );
};

export default EndNode;
