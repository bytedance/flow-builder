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
  parentNode?: INode;
  conditionIndex: number;
  registerNodes: IRegisterNode[];
  renderAddNodeButton: React.ReactNode;
  renderDeleteButton: React.ReactNode;
  renderNext: (params: IRender) => React.ReactNode;
  onNodeClick: (node: INode) => void;
}

const ConditionNode: React.FC<IProps> = (props) => {
  const {
    backgroundColor,
    lineColor,
    layout,
    spaceX,
    spaceY,
    node,
    parentNode,
    conditionIndex,
    registerNodes,
    renderDeleteButton,
    renderAddNodeButton,
    renderNext,
    onNodeClick,
  } = props;

  const { next } = node;

  const conditionCount = Array.isArray(parentNode?.branchs)
    ? parentNode?.branchs.length || 0
    : 0;

  const registerNode = getRegisterNode(registerNodes, node.type);

  const Component = registerNode?.displayComponent || DefaultNode;

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onNodeClick(node);
  };

  return (
    <div
      className={`flow-builder-node flow-builder-condition-node ${
        !registerNode?.configComponent
          ? 'flow-builder-node__without-config'
          : ''
      }`}
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
        <Component node={node} />
        {renderDeleteButton}
      </div>

      {renderAddNodeButton}

      {Array.isArray(next)
        ? renderNext({
            nodes: next,
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
