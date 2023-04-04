import React, { useContext } from 'react';
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

  const undoDisabled = activeHistoryRecordIndex <= 0;

  const redoDisabled = activeHistoryRecordIndex === historyRecords.length - 1;

  return showHistory ? (
    <div className="flow-builder-undo-redo-tool">
      <button
        className={`flow-builder-tool-btn ${
          undoDisabled ? 'flow-builder-tool-btn-disabled' : ''
        }`}
        disabled={undoDisabled}
        onClick={() => history('undo')}
      >
        {'<'}
      </button>
      <button
        className={`flow-builder-tool-btn ${
          redoDisabled ? 'flow-builder-tool-btn-disabled' : ''
        }`}
        disabled={redoDisabled}
        onClick={() => history('redo')}
      >
        {'>'}
      </button>
    </div>
  ) : null;
};

export default HistoryTool;
