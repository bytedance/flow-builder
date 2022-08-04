import React, { useContext } from 'react';
import { Button } from 'antd';
import { BuilderContext } from '../contexts';
import { useZoom } from '../hooks';
import type { IZoomToolConfig } from '../index';

const ZoomTool = () => {
  const { zoomTool, zoomValue } = useContext(BuilderContext);
  const { minZoom, maxZoom, zoom } = useZoom();

  const showZoom =
    Object.prototype.toString.call(zoomTool) === '[object Object]'
      ? !(zoomTool as IZoomToolConfig).hidden
      : !!zoomTool;

  return showZoom ? (
    <div className="flow-builder-zoom-tool">
      <Button disabled={zoomValue === minZoom} onClick={() => zoom('out')}>
        -
      </Button>
      <span className="flow-builder-zoom-tool__number">{zoomValue + '%'}</span>
      <Button disabled={zoomValue === maxZoom} onClick={() => zoom('in')}>
        +
      </Button>
    </div>
  ) : null;
};

export default ZoomTool;
