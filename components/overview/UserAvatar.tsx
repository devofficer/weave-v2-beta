import { Avatar, Flex, Text, Tag, TagLabel, useColorModeValue } from '@chakra-ui/react';

const UserAvatar = () => {
  return (
    <Flex gap={3} mr={5} zIndex={10}>
      <Flex flexDirection={'column'} alignItems="center" gap={1}>
        <Avatar
          width="50px"
          height="50px"
          src='/images/avatar.jpeg'
        />
      </Flex>
      <Flex flexDirection={'column'} alignItems="center" gap={2}>
        <Text fontSize="md" fontWeight={600}>@Weavy</Text>
        <Tag
          w={'full'}
          justifyContent="center"
          size={'md'}
          borderRadius="full"
          color={useColorModeValue('light.500', 'white')}
          borderWidth={1}
          borderColor={useColorModeValue('light.500', 'dark.300')}
          bg={'transparent'}
          cursor="pointer"
          lineHeight={'1px'}
          _hover={{
            bg: useColorModeValue('light.500', 'dark.400'),
            color: 'white'
          }}
          _focus={{
            bg: useColorModeValue('light.500', 'dark.400'),
            color: 'white'
          }}
          onClick={() => console.log('follow')}
        >
          <TagLabel>Follow</TagLabel>
        </Tag>
      </Flex>
    </Flex>
  )
}

export default UserAvatar;