import React, { useState, useMemo, forwardRef } from 'react';
import Builder from '../Builder';
import { BuilderContext } from '../contexts';
import {
  IFlowBuilderProps,
  IFlowBuilderMethod,
  LayoutType,
  INode,
  IZoomToolConfig,
} from '../index';

const FlowBuilder = forwardRef<IFlowBuilderMethod, IFlowBuilderProps>(
  (props, ref) => {
    const { zoomTool } = props;

    const [zoomValue, setZoomValue] = useState<number>(
      (zoomTool as IZoomToolConfig)?.initialValue || 100,
    );

    const [historyRecords, setHistoryRecords] = useState<INode[][]>([]);
    const [activeHistoryRecordIndex, setActiveHistoryRecordIndex] =
      useState(-1);

    const [selectedNode, setSelectedNode] = useState<INode>();
    const [drawerTitle, setDrawerTitle] = useState('');

    const [dragType, setDragType] = useState('');

    const defaultProps = useMemo(
      () => ({
        backgroundColor: '#F7F7F7',
        lineColor: '#999999',
        spaceX: 16,
        spaceY: 16,
        layout: 'vertical' as LayoutType,
        registerNodes: [],
        nodes: [],
      }),
      [],
    );

    return (
      <BuilderContext.Provider
        value={{
          ...defaultProps,
          ...props,
          zoomValue,
          setZoomValue,
          historyRecords,
          setHistoryRecords,
          activeHistoryRecordIndex,
          setActiveHistoryRecordIndex,
          selectedNode,
          setSelectedNode,
          drawerTitle,
          setDrawerTitle,
          dragType,
          setDragType,
        }}
      >
        <Builder ref={ref} />
      </BuilderContext.Provider>
    );
  },
);

export default FlowBuilder;
