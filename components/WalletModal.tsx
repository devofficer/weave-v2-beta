import {
  Flex,
  IconButton,
  Tooltip,
  useColorModeValue,
  Text,
  useDisclosure,
  Skeleton
} from '@chakra-ui/react'
import { CopyIcon } from '@chakra-ui/icons';
import useClipboard from "react-use-clipboard";
import { useWallet } from 'hooks/useWallet';
import { useBalance } from 'wagmi';
import dynamic from 'next/dynamic';
import { formatDisplayBalance } from 'utils/formatBalance';
import { useWeb3React } from 'hooks/useWeb3React';
import { WEAVE_TOKEN } from 'config/tokens';
const Modal = dynamic(() => import('./common/Modal'));
const Button = dynamic(() => import('components/common/Button'));

const WalletModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { account, chain, chainId } = useWeb3React()
  const { disconnectWallet } = useWallet()

  const copyStr: any = account
  const [isCopied, setCopied] = useClipboard(copyStr, {
    successDuration: 2000
  });
  const { data, isLoading } = useBalance({
    addressOrName: account,
    chainId: chainId
  })

  const { data: weaveBalance, isLoading: isWeaveLoading } = useBalance({
    addressOrName: account,
    token: WEAVE_TOKEN,
    chainId: chainId
  })

  return (
    <>
      <Flex py={2} mx={-3} px={3} fontSize="md" cursor={'pointer'} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }} onClick={onOpen}>Wallet</Flex>
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        title="Your Wallet"
        size={'sm'}
      >
        <Flex w={'100%'} flexDirection={'column'} gap={6}>
          <Flex flexDirection={'column'}>
            <Text>Your Address</Text>
            <Flex
              width="100%"
              justifyContent={'space-between'}
              alignItems="center"
              pl={3}
              rounded={8}
              bg={useColorModeValue('gray.100', 'gray.700')}
            >
              <Flex fontSize={'lg'} fontWeight={600} width="100%" overflow={'hidden'}>{account}</Flex>
              <Flex>
                <Tooltip
                  label="Copied"
                  isOpen={isCopied}
                  aria-label="Copy to clipboard"
                  placement="top"
                  closeDelay={2000}
                >
                  <IconButton
                    aria-label="Copy to clipboard"
                    size={'md'}
                    fontSize={'md'}
                    ml={1}
                    icon={<CopyIcon />}
                    onClick={() => {
                      setCopied();
                    }}
                  />
                </Tooltip>
              </Flex>
            </Flex>
          </Flex>

          <Flex flexDirection={'column'} gap={1}>
            <Flex justifyContent={'space-between'}>
              <Text>{chain?.nativeCurrency?.symbol} Balance</Text>
              {isLoading ? (
                <Skeleton width={12} height={6} rounded="md" />
              ) : (
                <Text fontWeight={600}>{formatDisplayBalance(data?.formatted, 4)}</Text>
              )}
            </Flex>
            <Flex justifyContent={'space-between'}>
              <Text>Weave Balance</Text>
              {isWeaveLoading ? (
                <Skeleton width={12} height={6} rounded="md" />
              ) : (
                <Text fontWeight={600}>{formatDisplayBalance(weaveBalance?.formatted, 4)}</Text>
              )}
            </Flex>
          </Flex>
          <Button size={'sm'} width={"100%"} label={'Disconnect Wallet'} colorType={"danger"} colorScheme="red" onClick={disconnectWallet} />
        </Flex>
      </Modal>
    </>
  )
}

export default WalletModal;