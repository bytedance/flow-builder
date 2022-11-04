import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';

import './index.less';

const Arrow = () => {
  const { lineColor, backgroundColor, showArrow, arrowIcon } =
    useContext(BuilderContext);

  return showArrow ? (
    <div
      className="flow-builder-arrow"
      style={{
        backgroundColor,
      }}
    >
      {arrowIcon || (
        <svg
          viewBox="0 0 1024 1024"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
        >
          <path
            d="M482.133333 738.133333L136.533333 392.533333c-17.066667-17.066667-17.066667-42.666667 0-59.733333 8.533333-8.533333 19.2-12.8 29.866667-12.8h689.066667c23.466667 0 42.666667 19.2 42.666666 42.666667 0 10.666667-4.266667 21.333333-12.8 29.866666L541.866667 738.133333c-17.066667 17.066667-42.666667 17.066667-59.733334 0z"
            fill={lineColor}
          ></path>
        </svg>
      )}
    </div>
  ) : null;
};

export default Arrow;
