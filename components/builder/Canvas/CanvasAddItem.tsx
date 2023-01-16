import { Flex, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { DragEvent, MouseEvent } from "react";
import { useMediaQuery } from "hooks/useMediaQuery";

const CanvasAddItem = ({
  onStrategyEntryDrop,
  onStrategyEntryClick,
}: {
  onStrategyEntryDrop: (e: DragEvent<HTMLDivElement>) => void
  onStrategyEntryClick: (e: MouseEvent<HTMLDivElement, globalThis.MouseEvent>) => void
}) => {

  const { isDesktop } = useMediaQuery()
  const bgColor = useColorModeValue('gray.600', 'whiteAlpha.100');

  return (
    <>
      {isDesktop &&
        <Tooltip label={isDesktop && "Drag Drop your swap and farms"} >
          <Flex
            width="60px"
            height="60px"
            onDragOver={(e) => { e.preventDefault() }}
            onDrop={(e) => { onStrategyEntryDrop(e) }}>
            <Flex
              width="60px"
              height="60px"
              borderWidth={1}
              borderRadius='full'
              bg={bgColor}
              color="white"
              justifyContent="center"
              alignItems={'center'}>
              <AddIcon width="20px" height="20px" name="add_icon" />
            </Flex>
          </Flex>
        </Tooltip>
      }

      {!isDesktop &&
        <Flex
          width="40px"
          height="40px"
          onClick={(e) => { onStrategyEntryClick(e) }}>
          <Flex
            width="40px"
            height="40px"
            borderWidth={1}
            borderRadius='full'
            bg={bgColor}
            color="white"
            justifyContent="center"
            alignItems={'center'}>
            <AddIcon width="20px" height="20px" name="add_icon" />
          </Flex>
        </Flex>
      }
    </>
  )
}
export default CanvasAddItem;