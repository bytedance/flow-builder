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
  | 'loop'
  | 'common';

export interface IRegisterNode {
  type: string;
  name: string;
  conditionNodeType?: string;
  conditionMaxNum?: number;
  addIcon?: React.ReactNode;
  addConditionIcon?: React.ReactNode;
  displayComponent?: React.FC<IDisplayComponent>;
  configComponent?:
    | React.FC<IConfigComponent>
    | React.ForwardRefExoticComponent<
        IConfigComponent & React.RefAttributes<any>
      >;
  removeConfirmTitle?: string;
  addableNodeTypes?: string[];
  addableComponent?: React.FC<IAddableComponent>;
  customRemove?: boolean;
  isStart?: boolean;
  isEnd?: boolean;
  isLoop?: boolean;
  configTitle?: string | ((node: INode, nodes: INode[]) => string);
  initialNodeData?: Record<string, any>;
  showPracticalBranchNode?: boolean;
  showPracticalBranchRemove?: boolean;
  className?: string;
}

export interface IRegisterRemoteNode {
  url: string;
  cssUrl?: string;
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

export interface IDrawerComponent {
  visible: any;
  onClose: any;
  title: any;
  width: any;
  destroyOnClose: any;
  maskClosable: any;
  children: any;
  configComponentRef: React.MutableRefObject<any>;
}

export interface IPopoverComponent {
  visible: any;
  onVisibleChange: any;
  overlayClassName: any;
  placement: any;
  trigger: any;
  content: any;
  getPopupContainer: any;
  children: any;
}

export interface IPopconfirmComponent {
  title: any;
  onConfirm: any;
  getPopupContainer: any;
  children: any;
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
  registerRemoteNodes?: IRegisterRemoteNode[];
  nodes: INode[];
  onChange: (nodes: INode[], changeEvent: string, nodeChanged?: INode) => void;
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
  sortable?: boolean;
  sortableAnchor?: React.ReactNode;
  showArrow?: boolean;
  arrowIcon?: React.ReactNode;
  createUuid?: (type?: string) => string;
  DrawerComponent?: React.FC<IDrawerComponent>;
  PopoverComponent?: React.FC<IPopoverComponent>;
  PopconfirmComponent?: React.FC<IPopconfirmComponent>;
  onDropNodeSuccess?: (type: string, node: INode) => void;
  onAddNodeSuccess?: (type: string, node: INode) => void;
  onRemoveNodeSuccess?: (node: INode) => void;
  allowStartConfig?: boolean;
  allowEndConfig?: boolean;
  scrollByDrag?: boolean;
}

export type ZoomType = 'out' | 'in';

export type HistoryType = 'undo' | 'redo';

export interface IRender {
  nodes: INode[];
  parentNode?: INode;
}

export interface IRenderNode {
  node: INode;
  nodeIndex: number;
  parentNode?: INode;
  sortProps?: any;
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

export interface IFlowBuilderMethod {
  history: (type: HistoryType) => void;
  zoom: (type: ZoomType | number) => void;
  add: (node: INode, newNodeType: string) => void;
  remove: (nodes: INode | INode[]) => void;
  closeDrawer: () => void;
  context: IFlowBuilderContext;
}

export { createUuid, buildFlatNodes, buildTreeNodes } from './utils';

export * from './contexts';

export * from './hooks';

export { default } from './FlowBuilder';
