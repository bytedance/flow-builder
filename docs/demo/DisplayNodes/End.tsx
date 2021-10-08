import React from 'react';
import { INode } from 'react-flow-builder';

import styles from './index.less';

interface IProps {
  node: INode;
}

const End: React.FC<IProps> = ({ node }) => {
  return (
    <div className={styles['display-node-end']}>
      <div className={styles['node-title']}>
        {node.name || node?.data?.name}
      </div>
    </div>
  );
};

export default End;
