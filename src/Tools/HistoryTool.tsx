import React, { useContext } from 'react';
import { Button } from 'antd';
import { BuilderContext } from '../contexts';
import { useHistory } from '../hooks';
import type { IHistoryToolConfig } from '../index';

const HistoryTool = () => {
  const { historyTool, historyRecords, activeHistoryRecordIndex } =
    useContext(BuilderContext);
  const { history } = useHistory();

  const showHistory =
    Object.prototype.toString.call(historyTool) === '[object Object]'
      ? !(historyTool as IHistoryToolConfig).hidden
      : !!historyTool;

  return showHistory ? (
    <div className="flow-builder-undo-redo-tool">
      <Button
        disabled={activeHistoryRecordIndex <= 0}
        onClick={() => history('undo')}
      >
        {'<'}
      </Button>
      <Button
        disabled={activeHistoryRecordIndex === historyRecords.length - 1}
        onClick={() => history('redo')}
      >
        {'>'}
      </Button>
    </div>
  ) : null;
};

export default HistoryTool;
