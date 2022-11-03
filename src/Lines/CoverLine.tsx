import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import type { ILineProps } from '../index';

interface IProps extends ILineProps {
  full?: boolean;
}

const CoverLine: React.FC<IProps> = (props) => {
  const { className, full } = props;

  const { lineColor, layout } = useContext(BuilderContext);

  const percent = full ? '100%' : '50%';

  return (
    <div
      className={`flow-builder-line__cover ${className}`}
      style={{
        backgroundColor: lineColor,
        width: layout === 'vertical' ? percent : '2px',
        height: layout === 'vertical' ? '2px' : percent,
      }}
    />
  );
};

export default CoverLine;
