import React, { useState, useMemo, useEffect } from 'react';
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
import { IFlowBuilderProps, INode, IRender, IRenderNode } from '@/index';

import DeleteIcon from '../icons/close-one.svg';

import './index.less';

const Builder: React.FC<IFlowBuilderProps> = (props) => {
  const {
    className = '',
    backgroundColor = '#F7F7F7',
    lineColor = '#999999',
    layout = 'vertical',
    allowZoom = false,
    spaceX = 16,
    spaceY = 16,
    drawerProps = {},
    registerNodes = [],
    nodes = [],
    onChange,
  } = props;

  const [activeNode, setActiveNode] = useState<INode>();
  const [zoom, setZoom] = useState<number>(100);

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
  };

  const handleDelete = (node: INode, e?: React.MouseEvent) => {
    e?.stopPropagation();
    const events = `delete-${node.type}`;
    const index = node.path?.pop();
    const parentPath = node.path;
    const parentNodes = get(nodes, parentPath);
    // @ts-ignore
    (parentNodes || nodes)?.splice(index, 1);
    onChange([...nodes], events);

    // Delete the last condition --> Also Delete the branch
    if (
      getIsConditionNode(registerNodes, node.type) &&
      // @ts-ignore
      parentNodes?.length === 0
    ) {
      parentPath?.pop();
      const branchNode = get(nodes, parentPath);
      handleDelete(branchNode);
    }
  };

  const handleNodeClick = (node: INode) => {
    if (getRegisterNode(registerNodes, node.type)?.configComponent) {
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
    }
    handleDrawerClose();
  };

  const ZoomTool = () => (
    <div className="flow-builder-zoom-tool">
      <Button disabled={zoom === 10} onClick={() => setZoom(zoom - 10)}>
        -
      </Button>
      <span className="flow-builder-zoom-tool__number">{zoom + '%'}</span>
      <Button disabled={zoom === 200} onClick={() => setZoom(zoom + 10)}>
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

    const renderDeleteButton = (
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
    );

    const renderAddNodeButton = (
      <>
        <SplitLine
          color={lineColor}
          layout={layout}
          spaceX={spaceX}
          spaceY={spaceY}
        />

        <AddNodeButton
          registerNodes={registerNodes}
          node={node}
          onAddNode={handleAddNode}
        />

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

  useEffect(() => {
    if (nodes.length === 0) {
      const defaultNodes = [
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
  }, []);

  return (
    <div className={`flow-builder-wrap ${className}`}>
      {allowZoom ? <ZoomTool /> : null}
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
};

export default Builder;
