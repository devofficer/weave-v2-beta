import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { CanvasAddItem } from './Canvas';
interface IAddEntryNodeProps extends NodeProps {
  data: any,
  isConnectable: boolean
}

export default memo<IAddEntryNodeProps>(({
  data,
  isConnectable
}) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <CanvasAddItem
        onStrategyEntryDrop={data.onStrategyEntryDrop}
        onStrategyEntryClick={data.onStrategyEntryClick}
      ></CanvasAddItem>
    </>
  );
});