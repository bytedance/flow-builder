import { useContext } from 'react';
import get from 'lodash.get';
import { BuilderContext, NodeContext } from '../contexts';
import { exchangeNodes } from '../utils';
import type { INode } from '../index';

const useSort = () => {
  const { nodes, onChange } = useContext(BuilderContext);

  const currentNode = useContext(NodeContext);

  const backward = (node: INode = currentNode) => {
    if (!node) return;

    const path = node.path?.slice() || [];

    const currentIndex = Number(path.pop());

    const parentNodes = get(nodes, path);

    if (parentNodes) {
      if (currentIndex > 0) {
        exchangeNodes(parentNodes, currentIndex, currentIndex - 1);
        onChange([...nodes]);
      }
    } else {
      if (currentIndex > 1) {
        exchangeNodes(nodes, currentIndex, currentIndex - 1);
        onChange([...nodes]);
      }
    }
  };

  const forward = (node: INode = currentNode) => {
    if (!node) return;

    const path = node.path?.slice() || [];

    const currentIndex = Number(path.pop());

    const parentNodes = get(nodes, path);

    if (parentNodes) {
      if (currentIndex < parentNodes.length - 1) {
        exchangeNodes(parentNodes, currentIndex, currentIndex + 1);
        onChange([...nodes]);
      }
    } else {
      if (currentIndex < nodes.length - 2) {
        exchangeNodes(nodes, currentIndex, currentIndex + 1);
        onChange([...nodes]);
      }
    }
  };

  const start = (node: INode = currentNode) => {
    if (!node) return;

    const path = node.path?.slice() || [];

    const currentIndex = Number(path.pop());

    const parentNodes = get(nodes, path);

    if (parentNodes) {
      if (currentIndex > 0) {
        exchangeNodes(parentNodes, currentIndex, 0);
        onChange([...nodes]);
      }
    } else {
      if (currentIndex > 1) {
        exchangeNodes(nodes, currentIndex, 1);
        onChange([...nodes]);
      }
    }
  };

  const end = (node: INode = currentNode) => {
    if (!node) return;

    const path = node.path?.slice() || [];

    const currentIndex = Number(path.pop());

    const parentNodes = get(nodes, path);

    if (parentNodes) {
      if (currentIndex < parentNodes.length - 1) {
        exchangeNodes(parentNodes, currentIndex, parentNodes.length - 1);
        onChange([...nodes]);
      }
    } else {
      if (currentIndex < nodes.length - 2) {
        exchangeNodes(nodes, currentIndex, nodes.length - 2);
        onChange([...nodes]);
      }
    }
  };

  return {
    backward,
    forward,
    start,
    end,
  };
};

export default useSort;
