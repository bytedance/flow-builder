import React from 'react';

import { ILineProps } from './index';

const CleanLine: React.FC<ILineProps> = (props) => {
  const { color, layout, className } = props;

  return (
    <div
      className={`flow-builder-line__clean ${className}`}
      style={{
        backgroundColor: color,
        width: layout === 'vertical' ? '50%' : '4px',
        height: layout === 'vertical' ? '4px' : '50%',
      }}
    />
  );
};

export default CleanLine;
