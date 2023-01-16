import { Box, Flex, Heading, Image, SimpleGrid, Tag, TagLabel, Tooltip, useColorModeValue } from "@chakra-ui/react";
import { IFarm } from "types";

const FarmsBoxItem = ({ data }: { data: IFarm[] }) => {
  const borderColor = useColorModeValue('gray.400', 'whiteAlpha.300')
  const bgColor = useColorModeValue('secGray.300', 'dark.900')
  const hoverBgColor = useColorModeValue('secGray.400', 'dark.700')
  const headingColor = useColorModeValue('gray.600', 'gray.100')

  const onDragStart = (e: any, params: any) => {
    console.log("Farm Node drag Started! poolID: ", params.poolID)
    e.dataTransfer.setData("poolID", params.poolID);
    e.dataTransfer.setData("protocol", params.protocol);
  }

  return (
    <Box>
      <SimpleGrid columns={{ base: 1, md: 1, xl: 2 }} spacing={3}>
        {data.map((item, i) => (
          <Flex
            key={i}
            p={2}
            // borderWidth={1}
            borderRadius={'xl'}
            borderColor={borderColor}
            bg={bgColor}
            gap={2}
            alignItems="center"
            flexDirection={'column'}
            cursor="grab"
            _hover={{
              bg: hoverBgColor
            }}
            draggable
            onDragStart={(e) => {
              onDragStart(e, {
                poolID: item.poolID,
                protocol: item.protocol
              })
            }}
          >
            <Flex justifyContent={'center'} gap={1}>
              <Image
                boxSize={8}
                src={item.icons[0]}
                alt={'swap'}
              />
              <Image
                boxSize={8}
                src={item.icons[1]}
                alt={'swap'}
              />
            </Flex>
            <Heading as='h6' size={'sm'} whiteSpace="nowrap">{item.name}</Heading>
            <Flex width={'full'} px={2} justifyContent={'space-between'} gap={4}>
              <Heading as='h6' size={'sm'} color={headingColor} whiteSpace="nowrap">TVL</Heading>
              <Tooltip label={item.tvl ? '$' + item.tvl : '-'}>
                <Heading as='h6' size={'sm'} color={headingColor} whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{item.tvl ? '$' + item.tvl : '-'}</Heading>
              </Tooltip>
            </Flex>
            <Flex width={'full'} px={2} justifyContent={'space-between'} gap={4}>
              <Heading as='h6' size={'sm'} color={headingColor} whiteSpace="nowrap">APR</Heading>
              <Tooltip label={item.apr ? item.apr + '%' : '-'}>
                <Heading as='h6' size={'sm'} color={headingColor} whiteSpace="nowrap">{item.apr ? item.apr + '%' : '-'}</Heading>
              </Tooltip>
            </Flex>
            <Flex>
              <Tag size='lg' colorScheme='gray' borderRadius='full'>
                <Image
                  boxSize={4}
                  src={item.protocolInfo?.logoURI}
                  alt={'swap'}
                  ml={-1}
                  mr={2}
                />
                <TagLabel fontSize={'xs'}>{item.protocolInfo?.name}</TagLabel>
              </Tag>
            </Flex>
          </Flex>
        ))}
      </SimpleGrid>
    </Box>
  )
}
export default FarmsBoxItem;