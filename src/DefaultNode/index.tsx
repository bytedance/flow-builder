import React from 'react';
import type { INode } from '../index';

import './index.less';

interface IProps {
  node: INode;
}

const DefaultDisplayComponent: React.FC<IProps> = ({ node }) => {
  const { id, name, path, configuring, data } = node;

  const borderColor = configuring ? 'blue' : 'transparent';

  return (
    <div
      className="flow-builder-default-node"
      style={{ border: `1px solid ${borderColor}` }}
    >
      <div>name: {data?.name || name}</div>
      <div>id: {id}</div>
      <div>path: {path?.join(' - ')}</div>
    </div>
  );
};

export default DefaultDisplayComponent;
