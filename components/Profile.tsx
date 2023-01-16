import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import {
  Flex,
  Button as ChakraButton,
  IconButton,
  Tooltip,
  useColorModeValue,
  Image,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Text
} from '@chakra-ui/react'
import { ChevronDownIcon, CopyIcon } from '@chakra-ui/icons';
import useClipboard from "react-use-clipboard";
import { useWallet } from 'hooks/useWallet';
import { Chain, useAccount, useNetwork, useSwitchNetwork } from 'wagmi';
import { useProfileInfoManager } from 'state/user/hooks';
import { FiLogOut, FiUser } from 'react-icons/fi';
const WalletModal = dynamic(() => import('components/WalletModal'));

const Profile = () => {
  const { user, setUpdateChainPreference } = useProfileInfoManager()
  const { address: activeAddress, connector } = useAccount()
  const { chain, chains } = useNetwork()
  const { error, switchNetwork } = useSwitchNetwork()
  const [activeChainName, setActiveChainName] = useState<string | undefined>('')
  const [activeChainId, setActiveChainId] = useState<number | undefined>(undefined)
  const copyStr: any = activeAddress
  const [isCopied, setCopied] = useClipboard(copyStr, {
    successDuration: 2000
  });
  const { disconnectWallet, getIconOfConnector, getIconOfChain } = useWallet()

  const handleChangeChain = (chain: Chain) => {
    setActiveChainName(chain?.name)
    setActiveChainId(chain?.id)
    switchNetwork?.(chain?.id)
    setUpdateChainPreference(chain)
  }

  useEffect(() => {
    setActiveChainName(chain?.name)
    setActiveChainId(chain?.id)
  }, [activeAddress, chain, chains, connector])

  return (
    <Flex>
      <Flex
        w={'100%'}
        flexDirection={'column'}
      >
        <Flex
          width="100%"
          justifyContent={'space-between'}
          alignItems="center"
          pl={3}
          rounded={8}
          bg={useColorModeValue('gray.100', 'gray.700')}
        >
          <Flex fontSize={'sm'} fontWeight={600} width="100%" overflow={'hidden'}>{activeAddress}</Flex>
          <Flex>
            <Tooltip
              label="Copied"
              isOpen={isCopied}
              aria-label="Copy to clipboard"
              placement="right"
              closeDelay={2000}
            >
              <IconButton
                aria-label="Copy to clipboard"
                size={'sm'}
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
        <Flex
          justifyContent={'space-between'}
          alignItems="center"
          rounded={4}
        >
          <Flex w={'full'} mr={5} flexDirection={'column'}>
            <Menu isLazy>
              <MenuButton
                as={ChakraButton}
                w={'full'}
                size={'sm'}
                leftIcon={<Image
                  boxSize='24px'
                  src={getIconOfChain(activeChainId)}
                  alt='Chains'
                />}
                rightIcon={<ChevronDownIcon />}
                fontSize="sm"
                fontWeight={500}
              >
                {activeChainName}
              </MenuButton>
              <MenuList>
                {chains?.map((chain, index: any) => (
                  <MenuItem minH='30px' fontSize={'sm'} key={index} onClick={() => handleChangeChain(chain)}>
                    <Image
                      boxSize='1.5rem'
                      borderRadius='full'
                      src={getIconOfChain(chain?.id)}
                      alt={chain?.name}
                      mr='12px'
                    />
                    <span>{chain?.name}</span>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
            <Flex fontSize={'xs'}>{error && error.message}</Flex>
          </Flex>
          <Flex>
            <Image
              boxSize='40px'
              src={getIconOfConnector(user?.connectorId)}
              alt='Wallet'
            />
          </Flex>
        </Flex>
        <Flex flexDirection={'column'}>
          <WalletModal />
          <Flex py={2} mx={-3} px={3} fontSize="md" cursor={'pointer'} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }} alignItems="center">
            <FiUser />
            <Text ml={2}>Profile</Text>
          </Flex>
          <Flex py={2} mx={-3} px={3} fontSize="md" cursor={'pointer'} _hover={{ bg: useColorModeValue('gray.50', 'whiteAlpha.100') }} alignItems="center" onClick={disconnectWallet}>
            <FiLogOut />
            <Text ml={2}>Disconnect Wallet</Text>
          </Flex>
        </Flex>
      </Flex >
    </Flex >
  )
}

export default Profile;