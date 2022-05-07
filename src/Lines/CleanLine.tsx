import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { ILineProps } from '../index';

const CleanLine: React.FC<ILineProps> = (props) => {
  const { className } = props;

  const { backgroundColor, layout } = useContext(BuilderContext);

  return (
    <div
      className={`flow-builder-line__clean ${className}`}
      style={{
        backgroundColor,
        width: layout === 'vertical' ? '50%' : '4px',
        height: layout === 'vertical' ? '4px' : '50%',
      }}
    />
  );
};

export default CleanLine;
