import React from 'react';

import './index.less';

interface IProps {
  size?: number;
  icon: string;
}

const ActionButton: React.FC<IProps> = (props) => {
  const { size = 28, icon } = props;

  return (
    <div
      className="flow-builder-action-button"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: `${size / 2}px`,
      }}
    >
      <img src={icon} />
    </div>
  );
};

export default ActionButton;
