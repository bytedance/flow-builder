import React, {
  useState,
  useEffect,
  useMemo,
  forwardRef,
  useImperativeHandle,
  useContext,
  useRef,
} from 'react';
import {
  StartNode,
  EndNode,
  CommonNode,
  BranchNode,
  ConditionNode,
  LoopNode,
} from '../Nodes';
import { HistoryTool, ZoomTool } from '../Tools';
import DragPanel from '../DragPanel';
import { getRegisterNode, createNewNode, getAbstractNodeType } from '../utils';
import { BuilderContext, NodeContext } from '../contexts';
import { useHistory, useZoom, useAction, useDrawer } from '../hooks';
import type { IFlowBuilderMethod, IRender, IRenderNode } from '../index';

import './index.less';

const Builder = forwardRef<IFlowBuilderMethod>((props, ref) => {
  const builderContext = useContext(BuilderContext);

  const {
    className = '',
    backgroundColor,
    layout,
    drawerProps,
    registerNodes,
    nodes,
    onChange,

    zoomValue,
    onZoomChange,

    historyRecords,
    activeHistoryRecordIndex,
    onHistoryChange,

    selectedNode,
    drawerTitle,

    draggable,
    DragComponent = DragPanel,
    setDragType,

    DrawerComponent,

    createUuid,
  } = builderContext;

  const { minZoom, maxZoom, zoom } = useZoom();

  const { pushHistory, history } = useHistory();

  const { addNode, removeNode } = useAction();

  const { closeDrawer, saveDrawer } = useDrawer();

  const [hasMounted, setHasMounted] = useState(false);

  const ConfigComponent = useMemo(
    () => getRegisterNode(registerNodes, selectedNode?.type)?.configComponent,
    [registerNodes, selectedNode],
  );

  const configComponentRef = useRef<any>();

  const renderNode = ({ node, nodeIndex, parentNode }: IRenderNode) => {
    const { id, type } = node;

    const abstractNodeType = getAbstractNodeType(registerNodes, type);

    const renderAbstractNode = () => {
      switch (abstractNodeType) {
        case 'start':
          return <StartNode />;
        case 'end':
          return <EndNode />;
        case 'branch':
          return <BranchNode renderConditionNode={renderNode} />;
        case 'condition':
          return (
            <ConditionNode
              parentNode={parentNode}
              conditionIndex={nodeIndex}
              renderNext={render}
            />
          );
        case 'loop':
          return <LoopNode renderNext={render} />;
        default:
          return <CommonNode />;
      }
    };

    return (
      <NodeContext.Provider key={id} value={node}>
        {renderAbstractNode()}
      </NodeContext.Provider>
    );
  };

  const render = ({ nodes, parentNode }: IRender) =>
    nodes.map((node, index) => {
      return renderNode({
        node,
        nodeIndex: index,
        parentNode,
      });
    });

  const renderZoomTool = <ZoomTool />;
  const renderHistoryTool = <HistoryTool />;

  useImperativeHandle(ref, () => ({
    history,
    zoom,
    add: addNode,
    remove: removeNode,
    closeDrawer: closeDrawer,
    context: builderContext,
  }));

  useEffect(() => {
    if (hasMounted && historyRecords.length > 1) {
      onHistoryChange?.(
        activeHistoryRecordIndex <= 0,
        activeHistoryRecordIndex === historyRecords.length - 1,
      );
    }
  }, [historyRecords, activeHistoryRecordIndex]);

  useEffect(() => {
    hasMounted &&
      onZoomChange?.(zoomValue === minZoom, zoomValue, zoomValue === maxZoom);
  }, [zoomValue, minZoom, maxZoom]);

  useEffect(() => {
    let defaultNodes = [...nodes];

    if (defaultNodes.length === 0) {
      const startNodeType = registerNodes.find((item) => item.isStart)?.type;
      const endNodeType = registerNodes.find((item) => item.isEnd)?.type;
      defaultNodes = [
        createNewNode(registerNodes, startNodeType, createUuid),
        createNewNode(registerNodes, endNodeType, createUuid),
      ];
      onChange(defaultNodes, 'init-builder');
    }

    pushHistory(defaultNodes);

    setHasMounted(true);
  }, []);

  return (
    <div className={`flow-builder-wrap ${className}`}>
      {renderHistoryTool || renderZoomTool ? (
        <div className="flow-builder-tool">
          {renderHistoryTool}
          {renderZoomTool}
        </div>
      ) : null}
      {draggable ? (
        <DragComponent
          onDragStart={setDragType}
          onDragEnd={() => setDragType('')}
        />
      ) : null}
      <div className="flow-builder-content" style={{ backgroundColor }}>
        <div
          className={`flow-builder flow-builder-${layout}`}
          style={{ zoom: `${zoomValue}%` }}
        >
          {render({ nodes })}
        </div>
      </div>
      {DrawerComponent ? (
        <DrawerComponent
          title={drawerTitle || 'Configuration'}
          width={480}
          destroyOnClose
          maskClosable={false}
          visible={!!selectedNode}
          onClose={closeDrawer}
          {...drawerProps}
          configComponentRef={configComponentRef}
        >
          {ConfigComponent && selectedNode ? (
            <ConfigComponent
              ref={configComponentRef}
              key={selectedNode.id}
              node={selectedNode}
              nodes={nodes}
              cancel={closeDrawer}
              save={saveDrawer}
            />
          ) : null}
        </DrawerComponent>
      ) : null}
    </div>
  );
});

export default Builder;
