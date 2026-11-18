import { v4 as uuid } from 'uuid';
import 'systemjs/dist/system.js';
import cloneDeep from 'lodash.clonedeep';
import type {
  IRegisterNode,
  IRegisterRemoteNode,
  AbstractNodeType,
  INode,
} from '../index';

export const createUuid = (prefix?: string) => {
  return `${prefix || 'node'}-${uuid()}`;
};

export const getRegisterNode = (
  registerNodes: IRegisterNode[],
  type?: string,
) => registerNodes.find((node) => type && node.type === type);

export const getIsStartNode = (registerNodes: IRegisterNode[], type?: string) =>
  registerNodes.find((item) => item.type === type)?.isStart;

export const getIsEndNode = (registerNodes: IRegisterNode[], type?: string) =>
  registerNodes.find((item) => item.type === type)?.isEnd;

export const getIsLoopNode = (registerNodes: IRegisterNode[], type?: string) =>
  registerNodes.find((item) => item.type === type)?.isLoop;

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
  if (getIsStartNode(registerNodes, type)) {
    return 'start';
  } else if (getIsEndNode(registerNodes, type)) {
    return 'end';
  } else if (getIsLoopNode(registerNodes, type)) {
    return 'loop';
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
  customCreateUuid = createUuid,
) => {
  const registerNode = getRegisterNode(registerNodes, type);

  if (!registerNode) return;

  const isBranchNode = getIsBranchNode(registerNodes, type);
  const isConditionNode = getIsConditionNode(registerNodes, type);
  const isLoopNode = getIsLoopNode(registerNodes, type);

  const initialNodeData = cloneDeep(registerNode?.initialNodeData || {});

  const extraProps: any = isBranchNode
    ? ((): any => {
        const count =
          typeof registerNode?.initialConditionNum === 'number'
            ? registerNode.initialConditionNum
            : 2;

        const children = [] as any[];
        for (let i = 0; i < count; i++) {
          children.push(
            createNewNode(
              registerNodes,
              registerNode.conditionNodeType,
              customCreateUuid,
            ),
          );
        }

        return {
          children,
          ...initialNodeData,
        };
      })()
    : isConditionNode || isLoopNode
    ? {
        children: [],
        ...initialNodeData,
      }
    : initialNodeData;

  return {
    id: customCreateUuid(type),
    type: registerNode.type,
    name: registerNode.name,
    ...extraProps,
  };
};

export const DFS = (nodes: INode[], allNodes: INode[] = []) => {
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

const getNextIdsAfterNode: (
  node: INode,
  allNodes: INode[],
  registerNodes: IRegisterNode[],
) => string[] = (node, allNodes, registerNodes) => {
  // Conditions are alternative branches, not sequential siblings.
  if (!getIsConditionNode(registerNodes, node.type)) {
    const nextNode = getNextNode(node, allNodes);
    if (nextNode) {
      return [nextNode.id];
    }
  }

  const path = node.path || [];
  if (path.length < 3) {
    return [];
  }

  const parentPath = path.slice(0, -2);
  const parentNode = allNodes.find(
    (item) => (item.path || []).join('-') === parentPath.join('-'),
  );

  if (!parentNode) {
    return [];
  }

  // Loop-body tails return to the loop node or continue after the loop.
  if (getIsLoopNode(registerNodes, parentNode.type)) {
    return [
      parentNode.id,
      ...getNextIdsAfterNode(parentNode, allNodes, registerNodes),
    ];
  }

  return getNextIdsAfterNode(parentNode, allNodes, registerNodes);
};

const getNextIds = (
  node: INode,
  allNodes: INode[],
  registerNodes: IRegisterNode[],
) => {
  if (getIsEndNode(registerNodes, node.type)) {
    return [];
  } else if (getIsLoopNode(registerNodes, node.type)) {
    const firstNode = node.children?.[0];
    return firstNode
      ? [firstNode.id]
      : getNextIdsAfterNode(node, allNodes, registerNodes);
  } else if (getIsBranchNode(registerNodes, node.type)) {
    return node.children?.length
      ? node.children.map((item) => item.id)
      : getNextIdsAfterNode(node, allNodes, registerNodes);
  } else if (getIsConditionNode(registerNodes, node.type)) {
    const nextNode = node.children?.[0];
    if (!nextNode) {
      return getNextIdsAfterNode(node, allNodes, registerNodes);
    }
    return [nextNode.id];
  } else {
    return getNextIdsAfterNode(node, allNodes, registerNodes);
  }
};

export const buildFlatNodes = (params: {
  registerNodes: IRegisterNode[];
  nodes: INode[];
}) => {
  const { registerNodes, nodes } = params;

  const cloneNodes = JSON.parse(JSON.stringify(nodes));

  // Derive paths from the current tree, including fresh or reordered nodes.
  computeNodesPath(cloneNodes);
  const allNodes = DFS(cloneNodes);

  for (const node of allNodes) {
    node.next = getNextIds(node, allNodes, registerNodes);
  }

  return allNodes.map(({ children, ...node }) => node);
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

export const buildTreeNodes = (params: { nodes: INode[] }) => {
  const { nodes } = params;
  const treeNodes: INode[] = [];

  const cloneNodes = JSON.parse(
    JSON.stringify(nodes.map(({ next, ...node }) => node)),
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

const computeChildrenPath = (children: INode[], parentPath: string[]) => {
  for (let index = 0; index < children.length; index++) {
    const node = children[index];

    node.path = [...parentPath, 'children', String(index)];

    if (Array.isArray(node.children) && node.children.length > 0) {
      computeChildrenPath(node.children, node.path);
    }
  }
};

export const computeNodesPath = (nodes: INode[]) => {
  for (let index = 0; index < nodes.length; index++) {
    const node = nodes[index];

    node.path = [String(index)];

    if (Array.isArray(node.children) && node.children.length > 0) {
      computeChildrenPath(node.children, node.path);
    }
  }
  return nodes;
};

declare global {
  interface Window {
    System: {
      import: (url: string) => any;
    };
  }
  interface Document {
    adoptedStyleSheets: any;
  }
}

export const loadRemoteNode = async (params: IRegisterRemoteNode) => {
  const { url, cssUrl } = params;

  const tasks = [url, cssUrl]
    .filter((item) => !!item)
    .map((item) => window.System.import(item as string));

  return new Promise<IRegisterNode>((resolve, reject) => {
    Promise.all(tasks)
      .then((res) => {
        if (res.length === 2) {
          document.adoptedStyleSheets = [
            ...document.adoptedStyleSheets,
            res[1].default,
          ];
        }
        resolve(res[0].default);
      })
      .catch((err) => reject(err));
  });
};

export const exchangeNodes = (
  nodes: any[],
  startIndex: number,
  endIndex: number,
) => {
  if (nodes?.[startIndex] && nodes?.[endIndex]) {
    const temp = nodes[startIndex];
    nodes[startIndex] = nodes[endIndex];
    nodes[endIndex] = temp;
  }
};
