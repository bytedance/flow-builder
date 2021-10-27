import Builder from './Builder';
import React from 'react';

export interface IDisplayComponent {
  node: INode;
  remove?: () => void;
  batchRemove?: (ids: string[]) => void;
}

export interface IConfigComponent {
  node: INode;
  cancel?: () => void;
  save?: (values: any, validateStatusError?: boolean) => void;
}

export interface IAddableComponent {
  node: INode;
  add: (type: string) => void;
}

export type LayoutType = 'vertical' | 'horizontal';

export type AbstractNodeType =
  | 'start'
  | 'end'
  | 'branch'
  | 'condition'
  | 'common';

export interface IRegisterNode {
  type: string;
  name: string;
  conditionNodeType?: string;
  addIcon?: React.ReactNode;
  extraData?: any;
  displayComponent?: React.FC<IDisplayComponent>;
  configComponent?: React.FC<IConfigComponent>;
  removeConfirmTitle?: string;
  addableNodeTypes?: string[];
  addableComponent?: React.FC<IAddableComponent>;
  customRemove?: boolean;
}

export interface INode {
  id: string;
  type: string;
  name: string;
  data?: any;
  children?: INode[];
  path?: string[];
  extraData?: any;
  configuring?: boolean;
  validateStatusError?: boolean;
  [key: string]: any;
}

export interface IZoomToolConfig {
  hidden?: boolean;
  initialValue?: number;
  min?: number;
  max?: number;
  step?: number;
}

export interface IHistoryToolConfig {
  hidden?: boolean;
  max?: number;
}

export interface IFlowBuilderProps {
  className?: string;
  backgroundColor?: string;
  lineColor?: string;
  spaceX?: number;
  spaceY?: number;
  layout?: LayoutType;
  zoomTool?: boolean | IZoomToolConfig;
  historyTool?: boolean | IHistoryToolConfig;
  drawerProps?: any;
  readonly?: boolean;
  registerNodes: IRegisterNode[];
  nodes: INode[];
  onChange: (nodes: INode[], changeEvent?: string) => void;
  onHistoryChange?: (undoDisabled: boolean, redoDisabled: boolean) => void;
  onZoomChange?: (
    smallerDisabled: boolean,
    value: number,
    biggerDisabled: boolean,
  ) => void;
}

export type ZoomType = 'smaller' | 'bigger';

export type HistoryType = 'undo' | 'redo';

export interface IFlowBuilderMethod {
  history: (type: HistoryType) => void;
  zoom: (type: ZoomType | number) => void;
}

export interface IRender {
  nodes: INode[];
  parentNode?: INode;
}

export interface IRenderNode {
  node: INode;
  nodeIndex: number;
  parentNode?: INode;
}

export { createUuid, buildFlatNodes, buildTreeNodes } from '@/utils';

export default Builder;
