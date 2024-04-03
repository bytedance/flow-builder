import React, { useContext, useRef, useEffect } from 'react';
import DefaultNode from '../DefaultNode';
import AddButton from '../AddButton';
import RemoveButton from '../RemoveButton';
import { SplitLine, CoverLine } from '../Lines';
import { getRegisterNode } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useAction } from '../hooks';
import Arrow from '../Arrow';
import type { IRender } from '../index';

interface Iprops {
  renderNext: (params: IRender) => React.ReactNode;
}

const LoopNode: React.FC<Iprops> = (props) => {
  const { renderNext } = props;

  const ref = useRef<HTMLDivElement>(null);

  const {
    readonly,
    registerNodes,
    nodes,
    beforeNodeClick,
    layout,
    spaceX,
    spaceY,
    lineColor,
  } = useContext(BuilderContext);

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

  useEffect(() => {
    if (!ref.current) return;

    if (layout === 'vertical') {
      const defaultSpaceX = spaceX as number;

      const loopContentWidth = ref.current.clientWidth;

      ref.current.style.marginLeft = `${loopContentWidth}px`;

      return;

      const parentDom = ref.current?.parentNode?.parentNode as HTMLElement;

      if (parentDom) {
        const parentContentWidth =
          parentDom.clientWidth -
          (parseInt(parentDom.style.paddingLeft) || 0) -
          (parseInt(parentDom.style.paddingRight) || 0);
        const offsetWidth = loopContentWidth - parentContentWidth / 2;

        if (
          parentDom.classList.contains('flow-builder-condition-node') ||
          parentDom.classList.contains('flow-builder-loop-node__content')
        ) {
          if (offsetWidth > defaultSpaceX) {
            parentDom.style.paddingRight = `${offsetWidth}px`;
          } else {
            parentDom.style.paddingRight = `${defaultSpaceX}px`;
          }

          if (parentDom.classList.contains('flow-builder-condition-node')) {
            const coverFirstLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover.cover-first',
            );
            for (const item of coverFirstLines) {
              item.style.width = `calc(100% - ${
                parentContentWidth / 2 + defaultSpaceX
              }px)`;
            }

            const coverLastLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover.cover-last',
            );
            for (const item of coverLastLines) {
              item.style.width = `${parentContentWidth / 2 + defaultSpaceX}px`;
            }
          }

          if (parentDom.classList.contains('flow-builder-loop-node__content')) {
            const coverLoopLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover',
            );
            for (const item of coverLoopLines) {
              item.style.width = `${parentContentWidth / 2 + defaultSpaceX}px`;
            }
          }
        }
      }
    } else {
      const defaultSpaceY = spaceY as number;

      const loopContentHeight = ref.current.clientHeight;

      ref.current.style.marginBottom = `${loopContentHeight}px`;

      return;

      const parentDom = ref.current?.parentNode?.parentNode as HTMLElement;

      if (parentDom) {
        const parentContentHeight =
          parentDom.clientHeight -
          (parseInt(parentDom.style.paddingTop) || 0) -
          (parseInt(parentDom.style.paddingBottom) || 0);
        const offsetHeight = loopContentHeight - parentContentHeight / 2;

        if (
          parentDom.classList.contains('flow-builder-condition-node') ||
          parentDom.classList.contains('flow-builder-loop-node__content')
        ) {
          if (offsetHeight > defaultSpaceY) {
            parentDom.style.paddingTop = `${offsetHeight}px`;
          } else {
            parentDom.style.paddingTop = `${defaultSpaceY}px`;
          }

          if (parentDom.classList.contains('flow-builder-condition-node')) {
            const coverFirstLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover.cover-first',
            );
            for (const item of coverFirstLines) {
              item.style.height = `${
                parentContentHeight / 2 + defaultSpaceY
              }px`;
            }

            const coverLastLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover.cover-last',
            );
            for (const item of coverLastLines) {
              item.style.height = `calc(100% - ${
                parentContentHeight / 2 + defaultSpaceY
              }px)`;
            }
          }

          if (parentDom.classList.contains('flow-builder-loop-node__content')) {
            const coverLoopLines = parentDom.querySelectorAll<HTMLElement>(
              ':scope > .flow-builder-line__cover',
            );
            for (const item of coverLoopLines) {
              item.style.height = `${
                parentContentHeight / 2 + defaultSpaceY
              }px`;
            }
          }
        }
      }
    }
  }, [nodes, registerNodes]);

  return (
    <div
      className={`flow-builder-node flow-builder-loop-node ${
        registerNode?.className || ''
      }`}
    >
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

      <SplitLine />

      <div
        ref={ref}
        className="flow-builder-loop-node__content"
        style={{
          padding: layout === 'vertical' ? `0 ${spaceX}px` : `${spaceY}px 0`,
          [layout === 'vertical'
            ? 'borderLeft'
            : 'borderBottom']: `2px solid ${lineColor}`,
        }}
      >
        <Arrow />

        <CoverLine className="cover-loop-start" />
        <CoverLine className="cover-loop-end" />

        <AddButton inLoop />

        {Array.isArray(node.children)
          ? renderNext({
              nodes: node.children,
              parentNode: node,
            })
          : null}
      </div>

      <AddButton />
    </div>
  );
};

export default LoopNode;
