import React, { useContext } from 'react';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import Arrow from '../Arrow';

const CommonNode: React.FC = () => {
  const { readonly, registerNodes, nodes, beforeNodeClick } =
    useContext(BuilderContext);

  const node = useContext(NodeContext);

  const { clickNode, removeNode } = useAction();

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = async () => {
    try {
      await beforeNodeClick?.(node);
      clickNode();
    } catch (error) {
      console.log('node click error', error);
    }
  };

  return (
    <div className={`flow-builder-node ${registerNode?.className || ''}`}>
      <Arrow />
      <div className="flow-builder-node__content-wrap">
        <div className="flow-builder-node__content" onClick={handleNodeClick}>
          <Component
            readonly={readonly}
            node={node}
            nodes={nodes}
            remove={removeNode}
          />
        </div>
        <RemoveButton />
      </div>

      <AddButton />
    </div>
  );
};

export default CommonNode;
