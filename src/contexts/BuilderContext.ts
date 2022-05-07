import { createContext } from 'react';
import { IFlowBuilderContext } from '../index';

// @ts-ignore
const BuilderContext = createContext<IFlowBuilderContext>(null);

export default BuilderContext;
