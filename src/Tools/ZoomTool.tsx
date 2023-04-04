import React, { useContext } from 'react';
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

  const minDisabled = zoomValue === minZoom;

  const maxDisabled = zoomValue === maxZoom;

  return showZoom ? (
    <div className="flow-builder-zoom-tool">
      <button
        className={`flow-builder-tool-btn ${
          minDisabled ? 'flow-builder-tool-btn-disabled' : ''
        }`}
        disabled={minDisabled}
        onClick={() => zoom('out')}
      >
        -
      </button>
      <span className="flow-builder-zoom-tool__number">{zoomValue + '%'}</span>
      <button
        className={`flow-builder-tool-btn ${
          maxDisabled ? 'flow-builder-tool-btn-disabled' : ''
        }`}
        disabled={maxDisabled}
        onClick={() => zoom('in')}
      >
        +
      </button>
    </div>
  ) : null;
};

export default ZoomTool;
