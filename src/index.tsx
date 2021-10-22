import Builder from './Builder';
import React from 'react';

export interface IDisplayComponent {
  node: INode;
}

export interface IConfigComponent {
  node: INode;
  onCancel?: () => void;
  onSave?: (values: any, validateStatusError?: boolean) => void;
}

export interface IAddableComponent {
  onAddNode: (type: string) => void;
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
  deleteConfirmTitle?: string;
  addableNodeTypes?: string[];
  addableComponent?: React.FC<IAddableComponent>;
}

export interface INode {
  id: string;
  type: string;
  name: string;
  data?: any;
  branchs?: INode[];
  next?: INode[];
  extraData?: any;
  path?: any[];
  configuring?: boolean;
  validateStatusError?: boolean;
}

export interface IFlowBuilderProps {
  className?: string;
  backgroundColor?: string;
  lineColor?: string;
  spaceX?: number;
  spaceY?: number;
  layout?: LayoutType;
  zoomTool?:
    | boolean
    | { hidden?: boolean; min?: number; max?: number; step?: number };
  undoRedoTool?: boolean | { hidden?: boolean; max?: number };
  drawerProps?: any;
  readonly?: boolean;
  registerNodes: IRegisterNode[];
  nodes: INode[];
  onChange: (nodes: INode[], changeEvent?: string) => void;
}

export type ZoomType = 'smaller' | 'bigger';

export interface IFlowBuilderMethod {
  zoom: (type: ZoomType) => number | undefined;
  undo: () => number | undefined;
  redo: () => number | undefined;
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

export interface IHistoryRecordsData {
  records: INode[][];
  maxNum: number;
  currentIndex: number;
}

export default Builder;
