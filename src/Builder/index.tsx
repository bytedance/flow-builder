import React, {
  useState,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { Popconfirm, Drawer, Button } from 'antd';
import get from 'lodash.get';
import AddNodeButton from '@/AddNodeButton';
import { SplitLine } from '@/Lines';
import {
  StartNode,
  EndNode,
  CommonNode,
  BranchNode,
  ConditionNode,
} from '@/Nodes';
import {
  createUuidWithPrefix,
  getRegisterNode,
  getIsBranchNode,
  getIsConditionNode,
  createNewNode,
  getAbstractNodeType,
} from '@/utils';
import {
  IFlowBuilderProps,
  IFlowBuilderMethod,
  INode,
  IRender,
  IRenderNode,
  IHistoryRecordsData,
  ZoomType,
} from '@/index';

import DeleteIcon from '../icons/close-one.svg';

import './index.less';

const defaultZoomMin = 10;
const defaultZoomMax = 200;
const defaultZoomStep = 10;
const defaultUndoRedoMaxNum = 10;

const setHistoryRecords = (
  historyRecordsData: IHistoryRecordsData,
  record: INode[],
) => {
  const { records, currentIndex, maxNum } = historyRecordsData;
  const newRecord = JSON.parse(JSON.stringify(record));

  records.splice(currentIndex + 1, records.length - currentIndex - 1);

  if (records.length === maxNum) {
    records.shift();
  }

  records.push(newRecord);
  historyRecordsData.currentIndex = records.length - 1;
};

const Builder = forwardRef<IFlowBuilderMethod, IFlowBuilderProps>(
  (props, ref) => {
    const {
      className = '',
      backgroundColor = '#F7F7F7',
      lineColor = '#999999',
      layout = 'vertical',
      zoomTool = false,
      undoRedoTool = false,
      spaceX = 16,
      spaceY = 16,
      drawerProps = {},
      readonly = false,
      registerNodes = [],
      nodes = [],
      onChange,
    } = props;

    const zoomShow =
      typeof zoomTool === 'boolean' ? zoomTool : !zoomTool.hidden;
    const zoomMin =
      typeof zoomTool === 'boolean'
        ? defaultZoomMin
        : zoomTool?.min || defaultZoomMin;
    const zoomMax =
      typeof zoomTool === 'boolean'
        ? defaultZoomMax
        : zoomTool?.max || defaultZoomMax;
    const zoomStep =
      typeof zoomTool === 'boolean'
        ? defaultZoomStep
        : zoomTool?.step || defaultZoomStep;

    const undoRedoShow =
      typeof undoRedoTool === 'boolean' ? undoRedoTool : !undoRedoTool.hidden;
    const undoRedoMaxNum =
      typeof undoRedoTool === 'boolean'
        ? defaultUndoRedoMaxNum
        : undoRedoTool?.max || defaultUndoRedoMaxNum;

    const [activeNode, setActiveNode] = useState<INode>();
    const [zoom, setZoom] = useState<number>(100);

    const historyRecordsRef = useRef<IHistoryRecordsData>({
      records: [],
      currentIndex: -1,
      maxNum: undoRedoMaxNum,
    });

    const ConfigComponent = useMemo(
      () => getRegisterNode(registerNodes, activeNode?.type)?.configComponent,
      [registerNodes, activeNode],
    );

    const handleAddNode = (node: INode, newNodeType: string) => {
      const newNode = createNewNode(registerNodes, newNodeType);
      if (!newNode) {
        return;
      }
      if (
        getIsBranchNode(registerNodes, node.type) &&
        getIsConditionNode(registerNodes, newNodeType)
      ) {
        node.branchs = node.branchs || [];
        node.branchs.push(newNode);
      } else if (getIsConditionNode(registerNodes, node.type)) {
        node.next = node.next || [];
        node.next.unshift(newNode);
      } else {
        const nodeIndex = node.path?.pop();
        const parentPath = node.path;
        const parentNodes = get(nodes, parentPath);
        // @ts-ignore
        (parentNodes || nodes)?.splice(nodeIndex + 1, 0, newNode);
      }
      onChange([...nodes], `add-${newNodeType}`);

      setHistoryRecords(historyRecordsRef.current, nodes);
    };

    const handleDelete = (node: INode, e?: React.MouseEvent) => {
      e?.stopPropagation();
      const events = `delete-${node.type}`;
      let removeIndex = node.path?.pop();
      let parentNodes = get(nodes, node.path) || nodes;

      // Delete the last condition --> Delete the branch
      if (
        getIsConditionNode(registerNodes, node.type) &&
        Array.isArray(parentNodes) &&
        parentNodes.length === 1
      ) {
        node.path?.pop();
        removeIndex = node.path?.pop();
        parentNodes = get(nodes, node.path) || nodes;
      }
      // @ts-ignore
      parentNodes.splice(removeIndex, 1);

      onChange([...nodes], events);

      setHistoryRecords(historyRecordsRef.current, nodes);
    };

    const handleNodeClick = (node: INode) => {
      if (
        !readonly &&
        getRegisterNode(registerNodes, node.type)?.configComponent
      ) {
        node.configuring = true;
        setActiveNode(node);
        onChange([...nodes], 'click-node');
      }
    };

    const handleDrawerClose = () => {
      if (activeNode) {
        activeNode.configuring = false;
      }
      setActiveNode(undefined);
      onChange([...nodes], 'close-drawer');
    };

    const handleDrawerOk = (values: any, validateStatusError?: boolean) => {
      if (activeNode) {
        activeNode.data = values;
        if (validateStatusError) {
          activeNode.validateStatusError = true;
        } else {
          activeNode.validateStatusError = false;
        }

        setHistoryRecords(historyRecordsRef.current, nodes);
      }
      handleDrawerClose();
    };

    const handleUndo = () => {
      if (!undoRedoTool) return;

      const { records, currentIndex } = historyRecordsRef.current;
      if (currentIndex === 0) return;

      const latestIndex = currentIndex - 1;
      historyRecordsRef.current.currentIndex = latestIndex;

      onChange([...records[latestIndex]], 'undo');
      return latestIndex;
    };

    const handleRedo = () => {
      if (!undoRedoTool) return;

      const { records, currentIndex } = historyRecordsRef.current;

      if (currentIndex === records.length - 1) return;

      const latestIndex = currentIndex + 1;
      historyRecordsRef.current.currentIndex = latestIndex;

      onChange([...records[latestIndex]], 'redo');
      return latestIndex;
    };

    const handleZoom = (type: ZoomType) => {
      if (!zoomTool) return;

      const latestZoom = type === 'smaller' ? zoom - zoomStep : zoom + zoomStep;
      setZoom(latestZoom);
      return latestZoom;
    };

    const UndoRedoTool = () => (
      <div className="flow-builder-undo-redo-tool">
        <button onClick={handleUndo}>undo</button>
        <button onClick={handleRedo}>redo</button>
      </div>
    );

    const ZoomTool = () => (
      <div className="flow-builder-zoom-tool">
        <Button
          disabled={zoom === zoomMin}
          onClick={() => handleZoom('smaller')}
        >
          -
        </Button>
        <span className="flow-builder-zoom-tool__number">{zoom + '%'}</span>
        <Button
          disabled={zoom === zoomMax}
          onClick={() => handleZoom('bigger')}
        >
          +
        </Button>
      </div>
    );

    const renderNode = ({ node, nodeIndex, parentNode }: IRenderNode) => {
      const { id, type } = node;

      const parentPath = parentNode?.path || [];

      const registerNode = getRegisterNode(registerNodes, type);

      const isConditionNode = getIsConditionNode(registerNodes, type);
      const isConditionParentNode = getIsConditionNode(
        registerNodes,
        parentNode?.type,
      );

      node.path = [];
      node.path.push(...parentPath);
      if (isConditionNode) {
        node.path.push('branchs');
      } else if (isConditionParentNode) {
        node.path.push('next');
      }
      node.path.push(nodeIndex);

      const renderDeleteButton = !readonly ? (
        <Popconfirm
          title={
            registerNode?.deleteConfirmTitle ||
            'Are you sure to delete this node?'
          }
          onCancel={(e) => e?.stopPropagation()}
          onConfirm={(e) => handleDelete(node, e)}
          getPopupContainer={(triggerNode) =>
            triggerNode.parentNode as HTMLElement
          }
        >
          <img
            className="flow-builder-node__delete"
            onClick={(e) => e.stopPropagation()}
            src={DeleteIcon}
          />
        </Popconfirm>
      ) : null;

      const renderAddNodeButton = (
        <>
          <SplitLine
            color={lineColor}
            layout={layout}
            spaceX={spaceX}
            spaceY={spaceY}
          />

          {!readonly ? (
            <AddNodeButton
              registerNodes={registerNodes}
              node={node}
              onAddNode={handleAddNode}
            />
          ) : null}

          <SplitLine
            color={lineColor}
            layout={layout}
            spaceX={spaceX}
            spaceY={spaceY}
          />
        </>
      );

      const abstractNodeType = getAbstractNodeType(registerNodes, type);

      switch (abstractNodeType) {
        case 'start':
          return (
            <StartNode
              key={id}
              node={node}
              registerNodes={registerNodes}
              renderAddNodeButton={renderAddNodeButton}
            />
          );
        case 'end':
          return <EndNode key={id} node={node} registerNodes={registerNodes} />;
        case 'branch':
          return (
            <BranchNode
              key={id}
              readonly={readonly}
              lineColor={lineColor}
              layout={layout}
              node={node}
              registerNodes={registerNodes}
              renderAddNodeButton={renderAddNodeButton}
              renderConditionNodes={renderNode}
              onAddCondition={handleAddNode}
            />
          );
        case 'condition':
          return (
            <ConditionNode
              key={id}
              backgroundColor={backgroundColor}
              lineColor={lineColor}
              layout={layout}
              spaceX={spaceX}
              spaceY={spaceY}
              node={node}
              parentNode={parentNode}
              conditionIndex={nodeIndex}
              registerNodes={registerNodes}
              renderAddNodeButton={renderAddNodeButton}
              renderDeleteButton={renderDeleteButton}
              renderNext={render}
              onNodeClick={handleNodeClick}
            />
          );
        default:
          return (
            <CommonNode
              key={id}
              node={node}
              registerNodes={registerNodes}
              renderAddNodeButton={renderAddNodeButton}
              renderDeleteButton={renderDeleteButton}
              onNodeClick={handleNodeClick}
            />
          );
      }
    };

    const render = ({ nodes, parentNode }: IRender) =>
      nodes.map((node, index) => {
        return renderNode({
          node,
          nodeIndex: index,
          parentNode,
        });
      });

    useImperativeHandle(ref, () => ({
      zoom: handleZoom,
      undo: handleUndo,
      redo: handleRedo,
    }));

    useEffect(() => {
      let defaultNodes = [...nodes];

      if (defaultNodes.length === 0) {
        defaultNodes = [
          {
            id: createUuidWithPrefix(),
            type: 'start',
            name: 'start',
          },
          {
            id: createUuidWithPrefix(),
            type: 'end',
            name: 'end',
          },
        ];
        onChange(defaultNodes, 'init-builder');
      }

      setHistoryRecords(historyRecordsRef.current, defaultNodes);
    }, []);

    return (
      <div
        className={`flow-builder-wrap ${className} ${
          readonly ? 'flow-builder-readonly' : ''
        }`}
      >
        {undoRedoShow ? <UndoRedoTool /> : null}
        {zoomShow ? <ZoomTool /> : null}
        <div className="flow-builder-content" style={{ backgroundColor }}>
          <div
            className={`flow-builder flow-builder-${layout}`}
            style={{ zoom: `${zoom}%` }}
          >
            {render({ nodes })}
          </div>
          <Drawer
            title="Configuration"
            width={480}
            destroyOnClose
            maskClosable={false}
            visible={!!activeNode}
            onClose={handleDrawerClose}
            {...drawerProps}
          >
            {ConfigComponent && activeNode ? (
              <ConfigComponent
                node={activeNode}
                onCancel={handleDrawerClose}
                onSave={handleDrawerOk}
              />
            ) : null}
          </Drawer>
        </div>
      </div>
    );
  },
);

export default Builder;
