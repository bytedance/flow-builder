import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';

const FillLine: React.FC = () => {
  const { lineColor, layout } = useContext(BuilderContext);

  return (
    <div
      className="flow-builder-line__fill"
      style={{
        backgroundColor: lineColor,
        width: layout === 'vertical' ? '2px' : '100%',
        height: layout === 'vertical' ? '100%' : '2px',
      }}
    />
  );
};

export default FillLine;
