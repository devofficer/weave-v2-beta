import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import {
  Flex,
  Box,
  VStack,
  Heading,
  useColorModeValue,
  Textarea,
  useDisclosure,
  Skeleton
} from '@chakra-ui/react'
import { trpc } from 'utils/trpc';
import { Comment } from 'types';
const Card = dynamic(() => import('components/common/Card'))
const Modal = dynamic(() => import('components/common/Modal'))
const Button = dynamic(() => import('components/common/Button'))
const CommentItem = dynamic(() => import('./CommentItem'))

const Description = () => {
  return (
    <Card
      title={"Description"}
      body={
        <Flex>
          Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.
        </Flex>
      }
    />
  )
}

const CommentBox = ({ sId, contractAddress }: { sId: number, contractAddress: string }) => {
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState([])
  const { data, isLoading } = trpc.useQuery(['comments.getAll', sId])
  const saveCommentMutation = trpc.useMutation(['comments.save'], {
    onSuccess(data) {
      setComments((prev: any) => [data, ...prev])
      onClose()
    },
  })

  const handleInputChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value
    setComment(inputValue)
  }

  const onSaveComment = useCallback((comment: string) => {
    const preload: any = {
      comment: comment,
      contractAddress: contractAddress,
      strategiesId: sId
    }
    saveCommentMutation.mutate(preload)
  }, [saveCommentMutation])

  useEffect(() => {
    if (data) {
      setComments(data)
    }
  }, [data])

  return (
    <Flex flexDirection={'column'} gap={4}>
      <Description />
      <VStack w="full" rounded="xl" bg={useColorModeValue('white', 'dark.800')} p={5}>
        <Flex w={'full'} pt={{ base: 1, md: 2 }} pb={{ base: 2, md: 3 }} className="card-header" justifyContent={'start'}>
          <Heading as='h5' size='md'>
            Comments
          </Heading>
        </Flex>
        <Box className="card-body" w={'full'}>
          <Flex flexDirection={'column'}>
            <Flex flexDirection={'column'} height={'calc(100vh - 546px)'} overflow="auto">
              {isLoading ? (
                <>
                  <Flex flexDirection={'column'} py={4} gap={3} maxW="100%" h={'full'}>
                    {[...Array(4)].map((x, i) =>
                      <Flex key={i} py={4} gap={4} maxW="100%">
                        <Skeleton width={'48px'} height={'48px'} rounded="md" />
                        <Flex flexDirection={'column'} gap={2} w="calc(100% - 48px - 1rem)">
                          <Skeleton width={'128px'} height={'full'} rounded="md" />
                          <Skeleton width={'full'} height={'full'} rounded="md" />
                        </Flex>
                      </Flex>
                    )}
                  </Flex>
                </>
              ) : (
                comments?.map((comment: Comment, i: any) => <CommentItem key={i} {...comment} />)
              )}
            </Flex>
            <Button label='Comment' onClick={() => onOpen()}></Button>

            <Modal
              onClose={onClose}
              isOpen={isOpen}
              size={'sm'}
              title="Comment"
            >
              <Flex flexDirection={'column'} gap={6}>
                <Textarea
                  value={comment}
                  onChange={(e) => handleInputChange(e)}
                  placeholder='Please input your comment'
                  size='md'
                  rounded={'lg'}
                  fontSize={'md'}
                />
                <Button label={'Submit'} onClick={() => onSaveComment(comment)} w="full" />
              </Flex>
            </Modal>
          </Flex>
        </Box>
      </VStack>

    </Flex>
  )
}

export default CommentBox;