import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import type { ILineProps } from '../index';

const ConnectLine: React.FC<ILineProps> = (props) => {
  const { className } = props;

  const { lineColor, layout } = useContext(BuilderContext);

  return (
    <div
      className={`flow-builder-line__branch ${className}`}
      style={{
        backgroundColor: lineColor,
        width: layout === 'vertical' ? '100%' : '2px',
        height: layout === 'vertical' ? '2px' : '100%',
      }}
    />
  );
};

export default ConnectLine;
