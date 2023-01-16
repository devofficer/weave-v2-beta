import React, { memo } from 'react';
import { useColorModeValue } from "@chakra-ui/react";

import { EdgeProps, getSmoothStepPath } from 'reactflow';

export default memo<EdgeProps>(({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  label,
}) => {
  const color = useColorModeValue('#1A202C', 'white')
  const bg = useColorModeValue('#E9EDF7', '#2D3748')

  const [edgePath, labelX] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path
        id={id}
        style={style}
        className="react-flow__edge-path"
        d={edgePath}
      />
      <defs>
        <filter x="0" y="0" width="1" height="1" id="solid">
          <feFlood floodColor={bg} result="bg" />
          <feMerge>
            <feMergeNode in="bg" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <foreignObject
        width={36}
        height={16}
        x={labelX + 16}
        y={targetY - 8}
        className="edgebutton-foreignobject"
        requiredExtensions="http://www.w3.org/1999/xhtml"
      >
        <div>
          <span
            className='edgeText'
            style={{
              fontSize: '11px',
              color: color,
              backgroundColor: bg,
              width: '100%'
            }}
          >{label}</span>
        </div>
      </foreignObject>
    </>
  );
});