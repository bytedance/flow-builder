import Builder from './Builder';
import React from 'react';

export interface IDisplayComponent {
  node: INode;
}

export interface IConfigComponent {
  node: INode;
  onCancel?: () => void;
  onSave?: (values: any, validateErrors?: any) => void;
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
  allowZoom?: boolean;
  drawerProps?: any;
  registerNodes: IRegisterNode[];
  nodes: INode[];
  onChange: (nodes: INode[], changeEvent?: string) => void;
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

export default Builder;
