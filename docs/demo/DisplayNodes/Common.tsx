import React from 'react';
import { INode } from 'react-flow-builder';

import styles from './index.less';

interface IProps {
  node: INode;
}

const Common: React.FC<IProps> = ({ node }) => {
  return (
    <div
      className={`${styles['display-node-common']} ${
        node.configuring ? styles['node-active'] : ''
      } ${node.validateStatusError ? styles['node-has-error'] : ''}`}
    >
      <div className={styles['node-title']}>
        {node?.data ? node?.data?.name : node?.name}
      </div>
      <div className={styles['node-desc']}>
        {node?.data?.desc || 'No Description...'}
      </div>
    </div>
  );
};

export default Common;
