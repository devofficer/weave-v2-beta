import { useEffect, useState } from "react";

import {
  Flex,
  Box,
  Text
} from '@chakra-ui/react'
import { IRiskProgressLineProps } from 'types';

const RiskProgressLine = ({
  label,
  bg = "#e5e5e5",
  visualParts = [
    {
      percentage: '0%',
      color: "white"
    }
  ]
}: IRiskProgressLineProps) => {

  const [widths, setWidths] = useState(
    visualParts.map(() => {
      return '0%';
    })
  );

  useEffect(() => {
    // https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame
    // You need to wrap it to trigger the animation
    requestAnimationFrame(() => {
      // Set a new array of percentage widths based on the props
      setWidths(
        visualParts.map(item => {
          return item.percentage;
        })
      );
    });
  }, [visualParts]);


  return (
    <>
      <Text className="progressLabel">{label}</Text>
      <Flex
        width={'full'}
        height={2}
        className="progressVisualFull"
        // to change the background color dynamically
        style={{
          backgroundColor: bg
        }}
      >
        {visualParts.map((item, index) => {
          // map each part into separate div and each will be animated
          // because of the "transition: width 2s;" css in class "progressVisualPart"
          // and because of the new width ("widths[index]", previous one was 0)
          return (
            <Box
              // There won't be additional changes in the array so the index can be used
              /* eslint-disable-next-line react/no-array-index-key */
              key={index}
              borderLeftRadius={index === 0 ? '10px' : 0}
              borderRightRadius={index === visualParts.length - 1 ? '10px' : 0}
              width={widths[index]}
              backgroundColor={item.color}
              className="progressVisualPart"
              transition='width 2s'
            />
          );
        })}
      </Flex>
    </>
  )
}

export default RiskProgressLine;