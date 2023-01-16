import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';
import { CanvasDepositItem } from './Canvas';

interface IWalletDepositEndNodeProps extends NodeProps {
  // data: any,
  isConnectable: boolean
}

export default memo<IWalletDepositEndNodeProps>(({
  // data,
  isConnectable
}: any) => {
  return (
    <>
      <Handle
        type="target"
        position={Position.Left}
        isConnectable={isConnectable}
      />
      <CanvasDepositItem />
    </>
  );
});