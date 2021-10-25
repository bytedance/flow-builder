import React, {
  useState,
  useEffect,
  useMemo,
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
  ZoomType,
  HistoryType,
} from '@/index';

import DeleteIcon from '../icons/close-one.svg';

import './index.less';

const defaultMinZoom = 10;
const defaultMaxZoom = 200;
const defaultZoomStep = 10;
const defaultMaxHistoryLength = 10;

const Builder = forwardRef<IFlowBuilderMethod, IFlowBuilderProps>(
  (props, ref) => {
    const {
      className = '',
      backgroundColor = '#F7F7F7',
      lineColor = '#999999',
      layout = 'vertical',
      zoomTool = false,
      historyTool = false,
      spaceX = 16,
      spaceY = 16,
      drawerProps = {},
      readonly = false,
      registerNodes = [],
      nodes = [],
      onChange,
      onHistoryChange,
      onZoomChange,
    } = props;

    const showZoom =
      typeof zoomTool === 'boolean' ? zoomTool : !zoomTool.hidden;
    const initialZoom =
      typeof zoomTool === 'boolean' ? 100 : zoomTool?.initialValue || 100;
    const minZoom =
      typeof zoomTool === 'boolean'
        ? defaultMinZoom
        : zoomTool?.min || defaultMinZoom;
    const maxZoom =
      typeof zoomTool === 'boolean'
        ? defaultMaxZoom
        : zoomTool?.max || defaultMaxZoom;
    const zoomStep =
      typeof zoomTool === 'boolean'
        ? defaultZoomStep
        : zoomTool?.step || defaultZoomStep;

    const showHistory =
      typeof historyTool === 'boolean' ? historyTool : !historyTool.hidden;
    const historyMaxLength =
      typeof historyTool === 'boolean'
        ? defaultMaxHistoryLength
        : historyTool?.max || defaultMaxHistoryLength;

    const [activeNode, setActiveNode] = useState<INode>();
    const [zoom, setZoom] = useState<number>(initialZoom);
    const [historyRecords, setHistoryRecords] = useState<INode[][]>([]);
    const [activeHistoryRecordIndex, setActiveHistoryRecordIndex] =
      useState(-1);
    const [hasMounted, setHasMounted] = useState(false);

    const handleHistoryRecordsChange = (
      records: INode[][],
      index: number,
      record: INode[],
    ) => {
      records.splice(index + 1, records.length - index - 1);

      if (records.length === historyMaxLength) {
        records.shift();
      }

      records.push(JSON.parse(JSON.stringify(record)));

      setHistoryRecords([...records]);
      setActiveHistoryRecordIndex(records.length - 1);
    };

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
      onChange([...nodes], `add-node__${newNodeType}`);

      handleHistoryRecordsChange(
        historyRecords,
        activeHistoryRecordIndex,
        nodes,
      );
    };

    const handleDelete = (node: INode, e?: React.MouseEvent) => {
      e?.stopPropagation();
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

      onChange([...nodes], `delete-node__${node.type}`);

      handleHistoryRecordsChange(
        historyRecords,
        activeHistoryRecordIndex,
        nodes,
      );
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

        handleHistoryRecordsChange(
          historyRecords,
          activeHistoryRecordIndex,
          nodes,
        );
      }
      handleDrawerClose();
    };

    const handleHistory = (type: HistoryType) => {
      const latestIndex =
        type === 'undo'
          ? activeHistoryRecordIndex > 0
            ? activeHistoryRecordIndex - 1
            : 0
          : activeHistoryRecordIndex < historyRecords.length - 1
          ? activeHistoryRecordIndex + 1
          : historyRecords.length - 1;

      onChange(JSON.parse(JSON.stringify(historyRecords[latestIndex])), type);

      setActiveHistoryRecordIndex(latestIndex);
    };

    const handleZoom = (type: ZoomType | number) => {
      let latestZoom =
        typeof type === 'number'
          ? type
          : type === 'smaller'
          ? zoom - zoomStep
          : zoom + zoomStep;

      latestZoom =
        latestZoom < minZoom
          ? minZoom
          : latestZoom > maxZoom
          ? maxZoom
          : latestZoom;

      setZoom(latestZoom);
    };

    const HistoryTool = (
      <div className="flow-builder-undo-redo-tool">
        <Button
          disabled={activeHistoryRecordIndex <= 0}
          onClick={() => handleHistory('undo')}
        >
          {'<'}
        </Button>
        <Button
          disabled={activeHistoryRecordIndex === historyRecords.length - 1}
          onClick={() => handleHistory('redo')}
        >
          {'>'}
        </Button>
      </div>
    );

    const ZoomTool = (
      <div className="flow-builder-zoom-tool">
        <Button
          disabled={zoom === minZoom}
          onClick={() => handleZoom('smaller')}
        >
          -
        </Button>
        <span className="flow-builder-zoom-tool__number">{zoom + '%'}</span>
        <Button
          disabled={zoom === maxZoom}
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
      history: handleHistory,
      zoom: handleZoom,
    }));

    useEffect(() => {
      if (hasMounted && historyRecords.length > 1) {
        console.log('xxx historyRecords', historyRecords);
        onHistoryChange?.(
          activeHistoryRecordIndex <= 0,
          activeHistoryRecordIndex === historyRecords.length - 1,
        );
      }
    }, [historyRecords, activeHistoryRecordIndex]);

    useEffect(() => {
      hasMounted && onZoomChange?.(zoom === minZoom, zoom, zoom === maxZoom);
    }, [zoom, minZoom, maxZoom]);

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

      handleHistoryRecordsChange(
        historyRecords,
        activeHistoryRecordIndex,
        defaultNodes,
      );

      setHasMounted(true);
    }, []);

    return (
      <div
        className={`flow-builder-wrap ${className} ${
          readonly ? 'flow-builder-readonly' : ''
        }`}
      >
        {showHistory || showZoom ? (
          <div className="flow-builder-tool">
            {showHistory ? HistoryTool : null}
            {showZoom ? ZoomTool : null}
          </div>
        ) : null}
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
