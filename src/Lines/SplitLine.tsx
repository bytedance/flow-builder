import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import type { ILineProps } from '../index';

interface IProps extends ILineProps {
  style?: any;
}

const SplitLine: React.FC<IProps> = (props) => {
  const { className = '', style } = props;

  const { lineColor, spaceX, spaceY, layout } = useContext(BuilderContext);

  return (
    <div
      className={`flow-builder-line__split ${className}`}
      style={{
        backgroundColor: lineColor,
        width: `${layout === 'vertical' ? 2 : spaceX}px`,
        height: `${layout === 'vertical' ? spaceY : 2}px`,
        ...style,
      }}
    />
  );
};

export default SplitLine;
