import { ChevronDownIcon } from '@chakra-ui/icons';
import { Button as ChakraButton, Flex, Heading, Text, Image, useColorModeValue, HStack, StackDivider, Menu, MenuButton, MenuList, MenuItem, useDisclosure, useToast } from '@chakra-ui/react'
import { ImagePair } from 'components/common/Image';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { IClaimableData, ILpData } from 'types';
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import strategyArtifactFTM from 'artifacts/contracts/StrategyFTM.sol/StrategyFTM.json'
import { ChainId } from 'utils/chains';
import { ethers } from 'ethers';
import { useWeb3React } from 'hooks/useWeb3React';
import { TOAST_OPTOPNS } from 'config';
import AmountInput from 'components/overview/AmountInput';
const Button = dynamic(() => import('components/common/Button'))
const Modal = dynamic(() => import('components/common/Modal'));

const FundsListItem = ({
  data,
  claimData,
  contractAddress
}: {
  data: ILpData,
  claimData: IClaimableData[],
  contractAddress: string
}) => {
  const { chainId, signer } = useWeb3React()
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [activeToken, setActiveToken] = useState<IClaimableData>(claimData[0])
  const [invalidInput, setInvalidInput] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState(0)
  const toast = useToast()
  const bgColor = useColorModeValue('secGray.300', 'dark.700');

  const onMaxAmount = (amount: any) => {
    setWithdrawAmount(Number(amount))
  }
  const onAmountChange = (e: number, maxAmount: any) => {
    if (e > Number(maxAmount)) {
      setInvalidInput(true);
      return;
    }
    setInvalidInput(false);
    setWithdrawAmount(e)
  }

  const withdrawToken = async () => {
    let abi: any;
    if (!signer) {
      return
    }
    if (
      chainId == ChainId.BSC || chainId == ChainId.WEAVE_TESTNET
    ) {
      abi = strategyArtifactBNB.abi;
    } else if (chainId == ChainId.FANTOM) {
      abi = strategyArtifactFTM.abi;
    }

    const contract = new ethers.Contract(contractAddress, abi, signer);
    const transaction = await contract.withdrawFunds(
      activeToken.address,
      ethers.utils.parseEther(withdrawAmount.toString())
    );
    const result = await transaction.wait();
    if (result) {
      onClose()
      toast({
        title: 'Success',
        description: `${withdrawAmount} ${activeToken.name} withdraw successfully`,
        status: 'success',
        ...TOAST_OPTOPNS
      });
    }
  };

  return (
    <Flex flexDir={'column'} py={4} px={3} gap={4} maxW="100%" bg={bgColor} borderRadius="xl">
      <Flex justifyContent={'space-between'} w="full">
        <ImagePair
          boxSize={10}
          borderRadius='md'
          src1={data.icons[0]}
          src2={data.icons[1]}
          alt={'avatar'}
        />
        <Heading as={'h5'} size="md">{data.name}</Heading>
        <Flex flexDir={'column'} gap={1}>
          <Button fontSize={'sm'} borderRadius="lg" px={2} py={1} label={'Withdraw'} isDisabled={claimData?.length == 0} onClick={onOpen} />
          <Button fontSize={'sm'} borderRadius="lg" px={2} py={1} label={'Claim Rewards'} isDisabled={claimData?.length == 0} onClick={() => console.log('click')} />
        </Flex>
      </Flex>
      <HStack
        justifyContent={'center'}
        divider={<StackDivider borderColor='gray.200' />}
        spacing={4}
        align='stretch'
      >
        <Flex w="full" flexDir={'column'} alignItems="center">
          <Heading as={'h4'} size={'sm'} pb={2} whiteSpace="nowrap">Deposited</Heading>
          <Flex w="full" justifyContent={'space-between'}>
            <Text>LP</Text>
            <Text fontWeight={600}>{data.amount?.toFixed(2)}</Text>
          </Flex>
          <Flex w="full" justifyContent={'space-between'}>
            <Text>USD</Text>
            <Text fontWeight={600}>{data.value?.toFixed(2)}</Text>
          </Flex>
        </Flex>
        <Flex w="full" flexDir={'column'} alignItems="center">
          <Heading as={'h4'} size={'sm'} pb={2} whiteSpace="nowrap">Pending Rewards</Heading>
          <Flex w="full" justifyContent={'space-between'}>
            <Text>{data.protocol}</Text>
            <Text fontWeight={600}>{data.rewardsPending?.toFixed(2)}</Text>
          </Flex>
          <Flex w="full" justifyContent={'space-between'}>
            <Text>USD</Text>
            <Text fontWeight={600}>{data.rewardPendingValue?.toFixed(2)}</Text>
          </Flex>
        </Flex>
      </HStack>

      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'xs'}
        title="Withdraw funds"
      >
        <Flex flexDirection={'column'} gap={6}>
          <Flex w={'full'} flexDirection={'column'}>
            <Menu isLazy>
              <MenuButton
                as={ChakraButton}
                w={'full'}
                size={'md'}
                leftIcon={<Image
                  boxSize='24px'
                  src={activeToken?.logoURI}
                  alt='Chains'
                />}
                rightIcon={<ChevronDownIcon />}
                fontSize="md"
                fontWeight={500}
              >
                {activeToken?.name}
              </MenuButton>
              <MenuList>
                {claimData?.map((token: any, index: any) => (
                  <MenuItem minW={'full'} minH='30px' fontSize={'sm'} key={index} onClick={() => setActiveToken(token)}>
                    <Image
                      boxSize='1.5rem'
                      borderRadius='full'
                      src={token.logoURI}
                      alt={token.name}
                      mr='12px'
                    />
                    <Text w="full">{token.name}</Text>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
          <Flex w={'full'} flexDirection={'column'}>
            <AmountInput
              balance={activeToken?.amount}
              amount={withdrawAmount}
              isError={invalidInput}
              errorText={'Input amount exceeds avaliable balance'}
              onAmountChange={(e) => onAmountChange(e, activeToken?.amount)}
              onMaxAmount={() => onMaxAmount(activeToken?.amount)} />
          </Flex>
          <Button label={'Withdraw'} onClick={() => withdrawToken()} w="full" />
        </Flex>
      </Modal>
    </Flex>
  )
}


export default FundsListItem;