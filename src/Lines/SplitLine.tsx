import React from 'react';

import { ILineProps } from './index';

const SplitLine: React.FC<ILineProps> = (props) => {
  const { color, layout, spaceX, spaceY } = props;

  return (
    <div
      className="flow-builder-line__split"
      style={{
        backgroundColor: color,
        width: `${layout === 'vertical' ? 2 : spaceX}px`,
        height: `${layout === 'vertical' ? spaceY : 2}px`,
      }}
    />
  );
};

export default SplitLine;
