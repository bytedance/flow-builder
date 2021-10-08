import { LayoutType } from '../index';
import SplitLine from './SplitLine';
import ConnectLine from './ConnectLine';
import FillLine from './FillLine';
import CleanLine from './CleanLine';

import './index.less';

export interface ILineProps {
  color?: string;
  layout?: LayoutType;
  spaceX?: number;
  spaceY?: number;
  className?: string;
}

export { SplitLine, ConnectLine, FillLine, CleanLine };
