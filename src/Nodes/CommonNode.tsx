import React from 'react';
import DefaultNode from '../DefaultNode';
import { getRegisterNode } from '../utils';
import { INode, IRegisterNode } from '../index';

interface IProps {
  node: INode;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderDeleteButton: React.ReactNode;
  onNodeClick: (node: INode) => void;
}

const CommonNode: React.FC<IProps> = (props) => {
  const {
    node,
    registerNodes,
    renderAddNodeButton,
    renderDeleteButton,
    onNodeClick,
  } = props;

  const Component =
    getRegisterNode(registerNodes, node.type)?.displayComponent || DefaultNode;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

  return (
    <div className="flow-builder-node">
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component node={node} />

        {renderDeleteButton}
      </div>

      {renderAddNodeButton}
    </div>
  );
};

export default CommonNode;
