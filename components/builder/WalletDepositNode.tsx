import React, { memo } from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

import { CanvasDepositItem } from './Canvas';

interface IWalletDepositNodeProps extends NodeProps {
  // data: any,
  isConnectable: boolean
}

export default memo<IWalletDepositNodeProps>(({
  // data,
  isConnectable
}: any) => {
  return (
    <>
      <CanvasDepositItem />
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
});