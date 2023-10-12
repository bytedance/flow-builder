import React, { useState, useMemo, forwardRef, useEffect } from 'react';
import { SortableContainer } from 'react-sortable-hoc';
import type { SortStart, SortEnd } from 'react-sortable-hoc';
import get from 'lodash.get';
import Builder from '../Builder';
import { BuilderContext } from '../contexts';
import { computeNodesPath, loadRemoteNode, exchangeNodes } from '../utils';
import type {
  IFlowBuilderProps,
  IFlowBuilderMethod,
  LayoutType,
  INode,
  IRegisterNode,
  IZoomToolConfig,
} from '../index';

const conditionSortingClassName = 'flow-builder-branch-node__content__sorting';

interface SortableContainerProps {
  builderRef: React.ForwardedRef<IFlowBuilderMethod>;
}

const SortableBuilder = SortableContainer<SortableContainerProps>(
  (props: SortableContainerProps) => <Builder ref={props.builderRef} />,
);

const FlowBuilder = forwardRef<IFlowBuilderMethod, IFlowBuilderProps>(
  (props, ref) => {
    const { zoomTool, nodes, onChange, sortable } = props;

    const [zoomValue, setZoomValue] = useState<number>(
      (zoomTool as IZoomToolConfig)?.initialValue || 100,
    );

    const [historyRecords, setHistoryRecords] = useState<INode[][]>([]);
    const [activeHistoryRecordIndex, setActiveHistoryRecordIndex] =
      useState(-1);

    const [selectedNode, setSelectedNode] = useState<INode>();
    const [drawerTitle, setDrawerTitle] = useState('');

    const [dragType, setDragType] = useState('');

    const [registerNodes, setRegisterNodes] = useState<IRegisterNode[]>(
      props.registerNodes || [],
    );

    const defaultProps = useMemo(
      () => ({
        backgroundColor: '#F7F7F7',
        lineColor: '#999999',
        spaceX: 16,
        spaceY: 16,
        layout: 'vertical' as LayoutType,
        registerNodes: [],
        nodes: [],
      }),
      [],
    );

    const layout = props.layout || defaultProps.layout;

    const handleChange = (
      nodes: INode[],
      changeEvent: string,
      node?: INode,
    ) => {
      computeNodesPath(nodes);
      onChange(nodes, changeEvent, node);
    };

    const handleSortStart = (params: SortStart) => {
      const { node } = params;
      (node.parentNode?.parentNode as HTMLDivElement).classList.add(
        conditionSortingClassName,
      );
    };

    const handleSortEnd = (params: SortEnd) => {
      const { collection, oldIndex, newIndex, nodes: conditionNodes } = params;

      // @ts-ignore
      conditionNodes[0].node.parentNode.parentNode.classList.remove(
        conditionSortingClassName,
      );

      if (oldIndex === newIndex) {
        return;
      }

      const children = get(nodes, (collection as string).split(','))?.children;

      exchangeNodes(children, oldIndex, newIndex);

      handleChange([...nodes], 'condition-sort');
    };

    useEffect(() => {
      if (
        Array.isArray(props.registerRemoteNodes) &&
        props.registerRemoteNodes.length > 0
      ) {
        Promise.allSettled(
          props.registerRemoteNodes.map((item) => loadRemoteNode(item)),
        )
          .then((res) =>
            res
              .filter((item) => item.status === 'fulfilled')
              .map(
                (item) => (item as PromiseFulfilledResult<IRegisterNode>).value,
              ),
          )
          .then((remoteNodes) =>
            setRegisterNodes([...props.registerNodes, ...remoteNodes]),
          )
          .catch(() => setRegisterNodes(props.registerNodes));
      } else {
        setRegisterNodes(props.registerNodes);
      }
    }, [props.registerNodes, props.registerRemoteNodes]);

    return (
      <BuilderContext.Provider
        value={{
          ...defaultProps,
          ...props,
          registerNodes,
          nodes: computeNodesPath(nodes),
          onChange: handleChange,
          zoomValue,
          setZoomValue,
          historyRecords,
          setHistoryRecords,
          activeHistoryRecordIndex,
          setActiveHistoryRecordIndex,
          selectedNode,
          setSelectedNode,
          drawerTitle,
          setDrawerTitle,
          dragType,
          setDragType,
        }}
      >
        {sortable ? (
          <SortableBuilder
            helperClass={`flow-builder-${layout} flow-builder-condition-node__sorting`}
            axis={layout === 'vertical' ? 'x' : 'y'}
            useDragHandle
            onSortStart={handleSortStart}
            onSortEnd={handleSortEnd}
            builderRef={ref}
          />
        ) : (
          <Builder ref={ref} />
        )}
      </BuilderContext.Provider>
    );
  },
);

export default FlowBuilder;
