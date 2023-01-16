import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

import { CanvasSwapItem } from './Canvas';

interface IStrategySwapNodeProps extends NodeProps {
  data: any,
  isConnectable: boolean
}

export default memo<IStrategySwapNodeProps>(({
  data,
  isConnectable
}: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        onConnect={(params) => console.log('handle onConnect', params)}
        isConnectable={isConnectable}
      />
      <CanvasSwapItem data={data} />
    </>
  );
});