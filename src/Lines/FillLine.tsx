import React from 'react';

import { ILineProps } from './index';

const FillLine: React.FC<ILineProps> = (props) => {
  const { color, layout } = props;

  return (
    <div
      className="flow-builder-line__fill"
      style={{
        backgroundColor: color,
        width: layout === 'vertical' ? '2px' : '100%',
        height: layout === 'vertical' ? '100%' : '2px',
      }}
    />
  );
};

export default FillLine;
