import React from 'react';
import DefaultNode from '@/DefaultNode';
import { getRegisterNode } from '@/utils';
import { INode, IRegisterNode } from '@/index';

interface IProps {
  node: INode;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderRemoveButton: React.ReactNode;
  onNodeClick: (node: INode) => void;
  remove: () => void;
  batchRemove: (ids: string[]) => void;
}

const CommonNode: React.FC<IProps> = (props) => {
  const {
    node,
    registerNodes,
    renderAddNodeButton,
    renderRemoveButton,
    onNodeClick,
    remove,
    batchRemove,
  } = props;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

  return (
    <div
      className={`flow-builder-node ${
        !registerNode?.configComponent
          ? 'flow-builder-node__without-config'
          : ''
      }`}
    >
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component node={node} remove={remove} batchRemove={batchRemove} />

        {renderRemoveButton}
      </div>

      {renderAddNodeButton}
    </div>
  );
};

export default CommonNode;
