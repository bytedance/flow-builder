import React, { useContext } from 'react';
import { BuilderContext } from '../contexts';
import { getRegisterNode, getIsBranchNode, getIsConditionNode } from '../utils';
import type { IDragComponent } from '../index';

import AddNormalIcon from '../icons/add-normal.svg';
import AddBranchIcon from '../icons/add-branch.svg';
import AddConditionIcon from '../icons/add-condition.svg';

import './index.less';

const DragPanel: React.FC<IDragComponent> = () => {
  const { lineColor, backgroundColor, registerNodes, setDragType } =
    useContext(BuilderContext);

  const handleDragStart = (type: string) => {
    setDragType(type);
  };

  const handleDragEnd = () => {
    setDragType('');
  };

  return (
    <div
      className="flow-builder-drag-panel"
      style={{ border: `1px solid ${lineColor}` }}
    >
      <ul>
        {registerNodes
          .filter((item) => !(item.isStart || item.isEnd))
          .map((item) => {
            const registerNode = getRegisterNode(registerNodes, item.type);
            const defaultIcon = getIsBranchNode(registerNodes, item.type)
              ? AddBranchIcon
              : getIsConditionNode(registerNodes, item.type)
              ? AddConditionIcon
              : AddNormalIcon;

            return (
              <li
                key={item.type}
                className="flow-builder-drag-node-item"
                style={{ backgroundColor }}
                draggable
                onDragStart={() => handleDragStart(item.type)}
                onDragEnd={handleDragEnd}
              >
                <span className="flow-builder-drag-node-icon">
                  {registerNode?.addIcon || (
                    <img src={defaultIcon} draggable={false} />
                  )}
                </span>
                <span>{item.name}</span>
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default DragPanel;
