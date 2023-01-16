import dynamic from "next/dynamic";
import { Box, Divider, Flex, Heading } from "@chakra-ui/react";
import { IFarm } from "types";
const FarmsBoxItem = dynamic(() => import('./FarmsBoxItem'));
interface FarmsBoxProps {
  lpFarms: IFarm[],
}

const FarmsBox = ({ lpFarms }: FarmsBoxProps) => {
  return (
    <>
      <Flex alignItems="center" mb={3} gap={2}>
        <Divider />
        <Heading as='h6' size={'md'} whiteSpace="nowrap" fontWeight={600}>Farms</Heading>
        <Divider />
      </Flex>
      <Box overflow={'auto'} maxH="calc(100vh - 388px)">
        <Box gap={2} mb={3} >
          {lpFarms.length == 0 ? (
            <Flex justifyContent={'center'}>No Farms</Flex>
          ) : (
            <FarmsBoxItem data={lpFarms} />
          )
          }
        </Box>
      </Box>
    </>
  )
}

export default FarmsBox;