import { Flex, Heading, Text, Image, useDisclosure } from '@chakra-ui/react'
import dynamic from 'next/dynamic';
import { Comment } from 'types';
const Modal = dynamic(() => import('components/common/Modal'))

const CommentItem = (props: Comment) => {
  const { comment } = props
  const { onOpen, isOpen, onClose } = useDisclosure()

  return (
    <>
      <Flex py={2} gap={4} maxW="100%" cursor={'pointer'} onClick={onOpen} _hover={{ opacity: 0.6 }}>
        <Image
          boxSize={'48px'}
          borderRadius='md'
          src={'/images/avatar.jpeg'}
          alt={'avatar'}
        />
        <Flex flexDirection={'column'} w="calc(100% - 48px - 1rem)">
          <Heading as={'h5'} size="md">@Weaver</Heading>
          <Text fontSize={'sm'} color="gray.600" whiteSpace="nowrap" textOverflow="ellipsis" overflow="hidden">{comment}</Text>
        </Flex>
      </Flex>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'xl'}
        title="Comment"
      >
        <Flex gap={4} maxW="100%">
          <Image
            boxSize={'52px'}
            borderRadius='md'
            src={'/images/avatar.jpeg'}
            alt={'avatar'}
          />
          <Flex flexDirection={'column'} w="full">
            <Heading as={'h5'} size="md">@Weaver</Heading>
            <Text fontSize={'xl'}>{comment}</Text>
          </Flex>
        </Flex>
      </Modal>
    </>
  )
}
export default CommentItem;