import { createContext } from 'react';
import { INodeContext } from '../index';

// @ts-ignore
const NodeContext = createContext<INodeContext>(null);

export default NodeContext;
