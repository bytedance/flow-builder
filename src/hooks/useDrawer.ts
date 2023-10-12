import { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { useHistory } from './index';

const useDrawer = () => {
  const { nodes, onChange, selectedNode, setSelectedNode } =
    useContext(BuilderContext);

  const { pushHistory } = useHistory();

  const closeDrawer = () => {
    if (selectedNode) {
      selectedNode.configuring = false;
    }
    setSelectedNode(undefined);
    onChange([...nodes], 'close-drawer', selectedNode);
  };

  const saveDrawer = (values: any, validateStatusError?: boolean) => {
    if (selectedNode) {
      selectedNode.data = values;
      if (validateStatusError) {
        selectedNode.validateStatusError = true;
      } else {
        selectedNode.validateStatusError = false;
      }

      pushHistory();
    }
    closeDrawer();
  };

  return {
    closeDrawer,
    saveDrawer,
  };
};

export default useDrawer;
