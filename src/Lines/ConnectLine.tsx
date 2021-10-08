import React from 'react';

import { ILineProps } from './index';

const ConnectLine: React.FC<ILineProps> = (props) => {
  const { color, layout, className } = props;

  return (
    <div
      className={`flow-builder-line__branch ${className}`}
      style={{
        backgroundColor: color,
        width: layout === 'vertical' ? '100%' : '2px',
        height: layout === 'vertical' ? '2px' : '100%',
      }}
    />
  );
};

export default ConnectLine;
