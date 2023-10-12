import { useContext } from 'react';
import get from 'lodash.get';
import { BuilderContext, NodeContext } from '../contexts';
import {
  getRegisterNode,
  DFS,
  createNewNode,
  getIsConditionNode,
  getIsBranchNode,
} from '../utils';
import { useHistory, useDrawer } from './index';
import type { INode } from '../index';

const useAction = () => {
  const {
    registerNodes,
    nodes,
    readonly,
    drawerVisibleWhenAddNode,
    onChange,
    setSelectedNode,
    setDrawerTitle,
    createUuid,
  } = useContext(BuilderContext);

  const currentNode = useContext(NodeContext);

  const { pushHistory } = useHistory();

  const { closeDrawer } = useDrawer();

  const clickNode = (node: INode = currentNode) => {
    const registerNode = getRegisterNode(registerNodes, node.type);
    if (!readonly && registerNode?.configComponent) {
      const allNodes = DFS(nodes);
      for (const item of allNodes) {
        if (item.configuring === true) {
          item.configuring = false;
        }
      }
      node.configuring = true;
      setSelectedNode(node);
      if (typeof registerNode.configTitle === 'string') {
        setDrawerTitle(registerNode.configTitle || '');
      } else if (typeof registerNode.configTitle === 'function') {
        setDrawerTitle(registerNode.configTitle(node, nodes) || '');
      }
      onChange([...nodes], 'click-node', node);
    }
  };

  const addNode = (_node: INode | string, _newNodeType?: string) => {
    // one param: new type
    // two params: node, new type
    const node = (!!_newNodeType ? _node : currentNode) as INode;
    const newNodeType = (!!_newNodeType ? _newNodeType : _node) as string;

    const registerNode = getRegisterNode(registerNodes, newNodeType);

    const newNode = createNewNode(registerNodes, newNodeType, createUuid);
    if (!newNode) {
      return;
    }

    if (getIsConditionNode(registerNodes, newNodeType)) {
      node.children = node.children || [];
      node.children.push(newNode);
    } else if (getIsConditionNode(registerNodes, node.type)) {
      node.children = node.children || [];
      node.children.unshift(newNode);
    } else {
      const path = node.path?.slice();
      const nodeIndex = Number(path?.pop());
      const parentPath = path;
      const parentNodes = get(nodes, parentPath || []);
      (parentNodes || nodes)?.splice(nodeIndex + 1, 0, newNode);
    }

    onChange([...nodes], `add-node__${newNodeType}`, newNode);

    pushHistory();

    if (drawerVisibleWhenAddNode) {
      if (
        getIsBranchNode(registerNodes, newNodeType) &&
        (!registerNode?.showPracticalBranchNode ||
          !registerNode?.configComponent)
      ) {
        clickNode(newNode.children[0]);
      } else {
        clickNode(newNode);
      }
    }

    return newNode;
  };

  const addNodeInLoop = (newNodeType: string) => {
    const node = currentNode;

    const registerNode = getRegisterNode(registerNodes, newNodeType);

    const newNode = createNewNode(registerNodes, newNodeType, createUuid);
    if (!newNode) {
      return;
    }

    node.children = node.children || [];
    node.children.unshift(newNode);

    onChange([...nodes], `add-node-in-loop__${newNodeType}`, newNode);

    pushHistory();

    if (drawerVisibleWhenAddNode) {
      if (
        getIsBranchNode(registerNodes, newNodeType) &&
        (!registerNode?.showPracticalBranchNode ||
          !registerNode?.configComponent)
      ) {
        clickNode(newNode.children[0]);
      } else {
        clickNode(newNode);
      }
    }

    return newNode;
  };

  const removeNodeIds = (targetNodeIds: string[], allNodes: INode[]) => {
    const restNodes = allNodes.filter(
      (item) => !targetNodeIds.includes(item.id),
    );
    for (const restNode of restNodes) {
      if (Array.isArray(restNode.children)) {
        restNode.children = removeNodeIds(targetNodeIds, restNode.children);
      }
    }
    return restNodes;
  };

  const filterEmptyBranch = (allNodes: INode[]) => {
    const restNodes = allNodes.filter(
      (item) =>
        !(
          getIsBranchNode(registerNodes, item.type) &&
          Array.isArray(item.children) &&
          item.children.length === 0
        ),
    );
    for (const restNode of restNodes) {
      if (Array.isArray(restNode.children)) {
        restNode.children = filterEmptyBranch(restNode.children);
      }
    }
    return restNodes;
  };

  const removeNode = (
    targetNode: INode | INode[] | string | string[] = currentNode,
  ) => {
    if (!targetNode) {
      return;
    }
    const targetNodes = Array.isArray(targetNode) ? targetNode : [targetNode];
    const targetNodeIds = targetNodes.map((item) =>
      typeof item === 'string' ? item : item.id,
    );

    DFS(nodes).some(
      (item) => item.configuring && targetNodeIds.includes(item.id),
    ) && closeDrawer();

    const restNodes = filterEmptyBranch(removeNodeIds(targetNodeIds, nodes));

    onChange(restNodes, `remove-node`, targetNode as INode);

    pushHistory(restNodes);
  };

  return {
    clickNode,
    addNode,
    addNodeInLoop,
    removeNode,
  };
};

export default useAction;
