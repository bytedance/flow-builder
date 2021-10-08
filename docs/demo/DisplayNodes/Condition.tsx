import React from 'react';
import { INode } from 'react-flow-builder';

import styles from './index.less';

interface IProps {
  node: INode;
}

const Condition: React.FC<IProps> = ({ node }) => {
  return (
    <div
      className={`${styles['display-node-condition']} ${
        node.configuring ? styles['node-active'] : ''
      } ${node.validateStatusError ? styles['node-has-error'] : ''}`}
    >
      <div className={styles['node-title']}>
        {node?.data ? node?.data?.name : node?.name}

        {node?.data?.rule ? ': ' + node?.data?.rule : ''}
      </div>
    </div>
  );
};

export default Condition;
