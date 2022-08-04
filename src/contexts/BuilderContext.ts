import { createContext } from 'react';
import type { IFlowBuilderContext } from '../index';

// @ts-ignore
const BuilderContext = createContext<IFlowBuilderContext>(null);

export default BuilderContext;
