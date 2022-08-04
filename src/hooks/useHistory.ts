import { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { defaultMaxLength } from './index';
import type { INode, HistoryType, IHistoryToolConfig } from '../index';

const useHistory = () => {
  const {
    selectedNode,
    nodes,
    onChange,
    historyTool,
    historyRecords,
    setHistoryRecords,
    activeHistoryRecordIndex,
    setActiveHistoryRecordIndex,
  } = useContext(BuilderContext);

  const maxLength =
    (historyTool as IHistoryToolConfig)?.max || defaultMaxLength;

  const pushHistory = (record: INode[] = nodes) => {
    if (selectedNode && selectedNode.configuring === true) {
      selectedNode.configuring = false;
    }

    historyRecords.splice(
      activeHistoryRecordIndex + 1,
      historyRecords.length - activeHistoryRecordIndex - 1,
    );

    if (historyRecords.length === maxLength) {
      historyRecords.shift();
    }

    historyRecords.push(JSON.parse(JSON.stringify(record)));

    setHistoryRecords([...historyRecords]);
    setActiveHistoryRecordIndex(historyRecords.length - 1);
  };

  const history = (type: HistoryType) => {
    const latestIndex =
      type === 'undo'
        ? activeHistoryRecordIndex > 0
          ? activeHistoryRecordIndex - 1
          : 0
        : activeHistoryRecordIndex < historyRecords.length - 1
        ? activeHistoryRecordIndex + 1
        : historyRecords.length - 1;

    onChange(JSON.parse(JSON.stringify(historyRecords[latestIndex])), type);

    setActiveHistoryRecordIndex(latestIndex);
  };

  return {
    maxLength,
    pushHistory,
    history,
  };
};

export default useHistory;
