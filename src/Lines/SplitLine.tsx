import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { ILineProps } from '../index';

const SplitLine: React.FC<ILineProps> = (props) => {
  const { className = '' } = props;

  const { lineColor, spaceX, spaceY, layout } = useContext(BuilderContext);

  return (
    <div
      className={`flow-builder-line__split ${className}`}
      style={{
        backgroundColor: lineColor,
        width: `${layout === 'vertical' ? 2 : spaceX}px`,
        height: `${layout === 'vertical' ? spaceY : 2}px`,
      }}
    />
  );
};

export default SplitLine;
