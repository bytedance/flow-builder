import { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { defaultMinZoom, defaultMaxZoom, defaultZoomStep } from './index';
import type { ZoomType, IZoomToolConfig } from '../index';

const useZoom = () => {
  const { zoomTool, zoomValue, setZoomValue } = useContext(BuilderContext);

  const minZoom = (zoomTool as IZoomToolConfig)?.min || defaultMinZoom;
  const maxZoom = (zoomTool as IZoomToolConfig)?.max || defaultMaxZoom;
  const zoomStep = (zoomTool as IZoomToolConfig)?.step || defaultZoomStep;

  const zoom = (type: ZoomType | number) => {
    let latestZoom =
      typeof type === 'number'
        ? type
        : type === 'out'
        ? zoomValue - zoomStep
        : zoomValue + zoomStep;

    latestZoom =
      latestZoom < minZoom
        ? minZoom
        : latestZoom > maxZoom
        ? maxZoom
        : latestZoom;

    setZoomValue(latestZoom);
  };

  return {
    minZoom,
    maxZoom,
    zoom,
  };
};

export default useZoom;
