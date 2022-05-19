import React from 'react';

export interface IDisplayComponent {
  nodes: INode[];
  node: INode;
  readonly?: boolean;
  remove?: (nodes?: INode | INode[]) => void;
}

export interface IConfigComponent {
  node: INode;
  nodes: INode[];
  cancel?: () => void;
  save?: (values: any, validateStatusError?: boolean) => void;
}

export interface IAddableComponent {
  nodes: INode[];
  node: INode;
  add: (type: string) => void;
}

export interface IDragComponent {
  onDragStart: (type: string) => void;
  onDragEnd: () => void;
}

export interface IDropComponent {
  onDrop: () => void;
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
  conditionMinNum?: number;
  conditionMaxNum?: number;
  addIcon?: React.ReactNode;
  displayComponent?: React.FC<IDisplayComponent>;
  configComponent?: React.FC<IConfigComponent>;
  removeConfirmTitle?: string;
  addableNodeTypes?: string[];
  addableComponent?: React.FC<IAddableComponent>;
  customRemove?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  configTitle?: string | ((node: INode, nodes: INode[]) => string);
  initialNodeData?: Record<string, any>;
  showPracticalBranchNode?: boolean;
  showPracticalBranchRemove?: boolean;
}

export interface INode {
  id: string;
  type: string;
  name: string;
  data?: any;
  children?: INode[];
  path?: string[];
  configuring?: boolean;
  validateStatusError?: boolean;
  next?: string[];
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
  drawerVisibleWhenAddNode?: boolean;
  readonly?: boolean;
  registerNodes: IRegisterNode[];
  nodes: INode[];
  onChange: (nodes: INode[], changeEvent?: string) => void;
  onHistoryChange?: (undoDisabled: boolean, redoDisabled: boolean) => void;
  onZoomChange?: (
    outDisabled: boolean,
    value: number,
    inDisabled: boolean,
  ) => void;
  beforeAddConditionNode?: (node: INode) => Promise<any>;
  beforeNodeClick?: (node: INode) => Promise<any>;
  draggable?: boolean;
  DragComponent?: React.FC<IDragComponent>;
  DropComponent?: React.FC<IDropComponent>;
  showPracticalBranchNode?: boolean;
  showPracticalBranchRemove?: boolean;
}

export type ZoomType = 'out' | 'in';

export type HistoryType = 'undo' | 'redo';

export interface IFlowBuilderMethod {
  history: (type: HistoryType) => void;
  zoom: (type: ZoomType | number) => void;
  add: (node: INode, newNodeType: string) => void;
  remove: (nodes: INode | INode[]) => void;
  closeDrawer: () => void;
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

export interface ILineProps {
  className?: string;
}

export interface IFlowBuilderContext extends IFlowBuilderProps {
  zoomValue: number;
  setZoomValue: (zoom: number) => void;
  historyRecords: INode[][];
  setHistoryRecords: (records: INode[][]) => void;
  activeHistoryRecordIndex: number;
  setActiveHistoryRecordIndex: (index: number) => void;
  selectedNode: INode | undefined;
  setSelectedNode: (node: INode | undefined) => void;
  drawerTitle: string;
  setDrawerTitle: (title: string) => void;
  dragType: string;
  setDragType: (type: string) => void;
}

export interface INodeContext extends INode {}

export { createUuid, buildFlatNodes, buildTreeNodes } from './utils';

export * from './contexts';

export * from './hooks';

export { default } from './FlowBuilder';
