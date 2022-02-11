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
  beforeNodeClick?: (node: INode) => Promise<any>;
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
    beforeNodeClick,
  } = props;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await beforeNodeClick?.(node);
      onNodeClick(node);
    } catch (error) {}
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
