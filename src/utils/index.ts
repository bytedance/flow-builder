import { v4 as uuid } from 'uuid';
import { IRegisterNode, AbstractNodeType } from '@/index';

export const createUuidWithPrefix = (prefix?: string) => {
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
        branchs: [
          createNewNode(registerNodes, registerNode.conditionNodeType),
          createNewNode(registerNodes, registerNode.conditionNodeType),
        ],
        ...extraData,
      }
    : isConditionNode
    ? {
        next: [],
        ...extraData,
      }
    : extraData;

  return {
    id: createUuidWithPrefix(),
    type: registerNode.type,
    name: registerNode.name,
    ...extraProps,
  };
};
