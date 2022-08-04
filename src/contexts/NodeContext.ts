import { createContext } from 'react';
import type { INodeContext } from '../index';

// @ts-ignore
const NodeContext = createContext<INodeContext>(null);

export default NodeContext;
