import dynamic from 'next/dynamic';
import {
  Flex,
  Stack,
  useDisclosure,
  Text,
  VStack,
  useToast
} from '@chakra-ui/react'
import { useCallback, useState } from 'react';
import { useWeb3React } from 'hooks/useWeb3React';
import { ethers } from 'ethers';
import { WEAVE_TOKEN } from 'config/tokens';
import { trpc } from 'utils/trpc';
import { TOAST_OPTOPNS } from 'config';
import { useBalance } from 'wagmi';
const Button = dynamic(() => import('components/common/Button'))
const Modal = dynamic(() => import('components/common/Modal'));
const Image = dynamic(() => import('components/common/Image'));

const PublishModal = ({ id, onUpdate, status }: { id: string, onUpdate: (id: number, status: number) => void, status: number }) => {
  const { signer, account, chainId } = useWeb3React()
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [isApproved, setIsApproved] = useState(false)
  const [isApproveLoading, setIsApproveLoading] = useState(false)
  const toast = useToast()

  const { data: weaveBalance } = useBalance({
    addressOrName: account,
    token: WEAVE_TOKEN,
    chainId: chainId
  })

  const updateStrategyMutation = trpc.useMutation(['strategies.update'], {
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Strategy is shared correctly.',
        status: 'success',
        ...TOAST_OPTOPNS,
      })
    },
  })


  const approveWeave = async () => {
    if (!signer) {
      return
    }
    try {
      if (parseInt(weaveBalance?.formatted) > 10) {
        toast({
          title: 'Low Balance',
          description: 'You should be have 10 WEAVE for share your strategy at least.',
          status: 'warning',
          ...TOAST_OPTOPNS,
        })
        return
      }
      setIsApproveLoading(true)
      const contract = new ethers.Contract(
        WEAVE_TOKEN,
        [
          "function approve(address _spender, uint256 _value) public returns (bool success)",
        ],
        signer
      );
      const transaction = await contract.approve(
        "0x83c301065a767Eb6bcc7B5DbA54955e909662682",
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
      const result = await transaction.wait();
      if (result) {
        setIsApproved(true);
        setIsApproveLoading(false)
      }
    } catch (error) {
      setIsApproved(false);
      setIsApproveLoading(false)
    }
  };

  const publish = useCallback(() => {
    const saveData: any = {
      id: id,
      status: 3,
      updatedAt: new Date()
    }
    updateStrategyMutation.mutate(
      saveData
    )
    onClose()
  }, [updateStrategyMutation]) // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <>
      {status === 1 ? <Button label={'Publish'} onClick={() => onOpen()} w="full" /> : null}
      <Button label={'Update'} onClick={() => onUpdate(parseInt(id), status)} w="full" />
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'md'}
      >
        <Flex flexDirection={'column'} gap={6}>
          <VStack
            spacing={8}
            gap={3}
            align={'center'}>
            <Image
              width={64}
              height={64}
              src={'/weave_icon.svg'}
              alt={'swap'}
            />
            <Stack align={'center'} textAlign="center" spacing={4}>
              <Text fontSize={'lg'} >
                Publishing a strategy will allow Weavers to copy it and will
                earn you platform rewards.
              </Text>
              <Text fontSize={'lg'} >
                Publishing a strategy costs 10$ worth of WEAVE initially and 10$
                worth of WEAVE per month.
              </Text>
              <Text fontSize={'lg'} >
                Users publishing a Strategy before the 8th of July will get 3
                Months without any charges!
              </Text>
            </Stack>
          </VStack>
          {isApproved ? (
            <Button label={'Publish'} onClick={() => publish()} w="full" />
          ) : (
            <Button label={'Approve Weave'} onClick={() => approveWeave()} isLoading={isApproveLoading} w="full" />
          )}
        </Flex>
      </Modal>
    </>
  )
}

export default PublishModal;