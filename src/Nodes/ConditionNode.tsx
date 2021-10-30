import React from 'react';
import { SplitLine, FillLine, CleanLine } from '@/Lines';
import DefaultNode from '@/DefaultNode';
import { getRegisterNode } from '@/utils';
import { LayoutType, INode, IRegisterNode, IRender } from '@/index';

interface IProps {
  backgroundColor?: string;
  lineColor?: string;
  layout: LayoutType;
  spaceX?: number;
  spaceY?: number;
  node: INode;
  nodes: INode[];
  parentNode?: INode;
  conditionIndex: number;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderRemoveButton: React.ReactNode;
  renderNext: (params: IRender) => React.ReactNode;
  onNodeClick: (node: INode) => void;
  remove: (nodes?: INode | INode[]) => void;
  readonly?: boolean;
}

const ConditionNode: React.FC<IProps> = (props) => {
  const {
    backgroundColor,
    lineColor,
    layout,
    spaceX,
    spaceY,
    node,
    nodes,
    parentNode,
    conditionIndex,
    registerNodes,
    renderRemoveButton,
    renderAddNodeButton,
    renderNext,
    onNodeClick,
    remove,
    readonly,
  } = props;

  const { children } = node;

  const conditionCount = Array.isArray(parentNode?.children)
    ? parentNode?.children.length || 0
    : 0;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

  return (
    <div
      className="flow-builder-node flow-builder-condition-node"
      style={{
        padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
      }}
    >
      <SplitLine
        color={lineColor}
        layout={layout}
        spaceX={spaceX}
        spaceY={spaceY}
      />

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

      {Array.isArray(children)
        ? renderNext({
            nodes: children,
            parentNode: node,
          })
        : null}

      <FillLine color={lineColor} layout={layout} />

      {conditionCount > 1 && conditionIndex === 0 ? (
        <>
          <CleanLine
            color={backgroundColor}
            layout={layout}
            className="clean-left clean-top"
          />
          <CleanLine
            color={backgroundColor}
            layout={layout}
            className="clean-left clean-bottom"
          />
        </>
      ) : null}

      {conditionCount > 1 && conditionIndex === conditionCount - 1 ? (
        <>
          <CleanLine
            color={backgroundColor}
            layout={layout}
            className="clean-right clean-top"
          />
          <CleanLine
            color={backgroundColor}
            layout={layout}
            className="clean-right clean-bottom"
          />
        </>
      ) : null}
    </div>
  );
};

export default ConditionNode;
