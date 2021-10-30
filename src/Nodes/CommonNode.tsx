import React from 'react';
import DefaultNode from '@/DefaultNode';
import { getRegisterNode } from '@/utils';
import { INode, IRegisterNode } from '@/index';

interface IProps {
  node: INode;
  nodes: INode[];
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderRemoveButton: React.ReactNode;
  onNodeClick: (node: INode) => void;
  remove: (nodes?: INode | INode[]) => void;
  readonly?: boolean;
}

const CommonNode: React.FC<IProps> = (props) => {
  const {
    node,
    nodes,
    registerNodes,
    renderAddNodeButton,
    renderRemoveButton,
    onNodeClick,
    remove,
    readonly,
  } = props;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

  return (
    <div className="flow-builder-node">
      <div className="flow-builder-node__content" onClick={handleNodeClick}>
        <Component
          readonly={readonly}
          node={node}
          nodes={nodes}
          remove={remove}
        />

        {renderRemoveButton}
      </div>

      {renderAddNodeButton}
    </div>
  );
};

export default CommonNode;
