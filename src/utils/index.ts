import { v4 as uuid } from 'uuid';
import { IRegisterNode, AbstractNodeType, INode } from '@/index';

export const createUuid = (prefix?: string) => {
  return `${prefix || 'node'}-${uuid()}`;
};

export const getRegisterNode = (
  registerNodes: IRegisterNode[],
  type?: string,
) => registerNodes.find((node) => type && node.type === type);

export const getIsConditionNode = (
  registerNodes: IRegisterNode[],
  type?: string,
) => {
  const conditionNode = getRegisterNode(registerNodes, type);
  const branchNode = registerNodes.find(
    (item) => type && item.conditionNodeType === type,
  );

  return (
    conditionNode &&
    branchNode &&
    branchNode?.type !== branchNode?.conditionNodeType
  );
};

export const getIsBranchNode = (
  registerNodes: IRegisterNode[],
  type?: string,
) => {
  const branchNode = getRegisterNode(registerNodes, type);
  const conditionNode = getRegisterNode(
    registerNodes,
    branchNode?.conditionNodeType,
  );

  return (
    branchNode &&
    conditionNode &&
    branchNode?.type !== branchNode?.conditionNodeType
  );
};

export const getAbstractNodeType: (
  registerNodes: IRegisterNode[],
  type?: string,
) => AbstractNodeType = (registerNodes: IRegisterNode[], type?: string) => {
  if (type && ['start', 'end'].includes(type)) {
    return type as AbstractNodeType;
  } else if (getIsBranchNode(registerNodes, type)) {
    return 'branch';
  } else if (getIsConditionNode(registerNodes, type)) {
    return 'condition';
  } else {
    return 'common';
  }
};

export const createNewNode = (
  registerNodes: IRegisterNode[],
  type?: string,
) => {
  const registerNode = getRegisterNode(registerNodes, type);

  if (!registerNode) return;

  const isBranchNode = getIsBranchNode(registerNodes, type);
  const isConditionNode = getIsConditionNode(registerNodes, type);

  const extraData = registerNode?.hasOwnProperty('extraData')
    ? { extraData: registerNode?.extraData }
    : {};

  const extraProps: any = isBranchNode
    ? {
        children: [
          createNewNode(registerNodes, registerNode.conditionNodeType),
          createNewNode(registerNodes, registerNode.conditionNodeType),
        ],
        ...extraData,
      }
    : isConditionNode
    ? {
        children: [],
        ...extraData,
      }
    : extraData;

  return {
    id: createUuid(),
    type: registerNode.type,
    name: registerNode.name,
    ...extraProps,
  };
};

const DFS = (nodes: INode[], allNodes: INode[] = []) => {
  for (const node of nodes) {
    allNodes.push(node);
    if (Array.isArray(node.children)) {
      DFS(node.children, allNodes);
    }
  }
  return allNodes;
};

const getNextNode = (node: INode, allNodes: INode[]) => {
  const path = node.path || [];

  const nextPath = [
    ...path.slice(0, path.length - 1),
    String(Number(path[path.length - 1]) + 1),
  ];

  return allNodes.find(
    (item) => (item.path || []).join('-') === nextPath.join('-'),
  );
};

const getNextIdsByBranchNode: (
  node: INode,
  allNodes: INode[],
  registerNodes: IRegisterNode[],
) => string[] = (node, allNodes, registerNodes) => {
  const path = node.path || [];
  let branchPath: string[];

  if (getIsConditionNode(registerNodes, node.type)) {
    branchPath = path.slice(0, path.length - 2);
  } else {
    branchPath = path.slice(0, path.length - 4);
  }

  const branchNode = allNodes.find(
    (item) => (item.path || []).join('-') === branchPath.join('-'),
  );

  if (!branchNode) {
    return [];
  }

  const nextNode = getNextNode(branchNode, allNodes);

  if (!nextNode) {
    return getNextIdsByBranchNode(branchNode, allNodes, registerNodes);
  }

  return [nextNode.id];
};

const getNextIds = (
  node: INode,
  allNodes: INode[],
  registerNodes: IRegisterNode[],
) => {
  if (getIsBranchNode(registerNodes, node.type)) {
    return (node.children || []).map((item) => item.id);
  } else if (getIsConditionNode(registerNodes, node.type)) {
    const nextNode = node.children?.[0];
    if (!nextNode) {
      return getNextIdsByBranchNode(node, allNodes, registerNodes);
    }
    return [nextNode.id];
  } else if (node.type === 'end') {
    return [];
  } else {
    const nextNode = getNextNode(node, allNodes);
    if (!nextNode) {
      return getNextIdsByBranchNode(node, allNodes, registerNodes);
    }
    return [nextNode.id];
  }
};

export const buildFlatNodes = (params: {
  registerNodes: IRegisterNode[];
  nodes: INode[];
  fieldName?: string;
}) => {
  const { registerNodes, nodes, fieldName = 'next' } = params;

  const cloneNodes = JSON.parse(JSON.stringify(nodes));

  const allNodes = DFS(cloneNodes);

  for (const node of allNodes) {
    node[fieldName] = node[fieldName] || [];

    const nextIds = getNextIds(node, allNodes, registerNodes);

    node[fieldName].push(
      ...nextIds.filter((item) => !node[fieldName].includes(item)),
    );
  }

  return allNodes.map(
    ({ children, configuring, validateStatusError, ...node }) => node,
  );
};

const getParentByPath = (path: string[], treeNodes: INode[]) => {
  let parent: any = treeNodes;

  for (let index = 0; index < path.length; index++) {
    const item = path[index];
    if (!parent[item]) {
      if (index % 2 === 0) {
        parent[item] = {};
      } else {
        parent[item] = [];
      }
    }
    parent = parent[item];
  }

  return parent;
};

export const buildTreeNodes = (params: {
  nodes: INode[];
  fieldName?: string;
}) => {
  const { nodes, fieldName = 'next' } = params;
  const treeNodes: INode[] = [];

  const cloneNodes = JSON.parse(
    JSON.stringify(nodes.map(({ [fieldName]: next, ...node }) => node)),
  );

  for (const node of cloneNodes) {
    const path = node.path.slice();
    const index = path.pop();
    const parent = getParentByPath(path, treeNodes);
    if (!parent[index]) {
      parent[index] = node;
    } else {
      parent[index] = {
        ...parent[index],
        ...node,
      };
    }
  }
  return treeNodes;
};
