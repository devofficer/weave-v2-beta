import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

import { CanvasFarmItem } from './Canvas';

interface IStrategyFarmNodeProps extends NodeProps {
  data: any,
  isConnectable: boolean
}

export default memo<IStrategyFarmNodeProps>(({
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
      <CanvasFarmItem data={data} />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});