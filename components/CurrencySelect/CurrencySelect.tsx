import dynamic from 'next/dynamic';
import { KeyboardEvent, useCallback, useState, useMemo } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button,
  useColorModeValue,
  Flex,
  Heading,
  useDisclosure,
  List,
  ListItem,
  Box,
  Text,
  Skeleton,
} from '@chakra-ui/react'
import { Token } from 'types';
import { useAccount, useBalance, useNetwork } from 'wagmi';
import { formatDisplayBalance } from 'utils/formatBalance';
import { FiSearch } from 'react-icons/fi';
import { isAddress } from 'utils';
import useDebounce from 'hooks/useDebounce';
import { createFilterToken, useSortedTokensByQuery } from './filtering';
import { useTokenStateManager } from 'state/tokens/hooks';
const Image = dynamic(() => import('components/common/Image'));
const Modal = dynamic(() => import('components/common/Modal'));
const Input = dynamic(() => import('components/common/Input'));

const CurrencySelect = ({ token, onTokenUpdate }: { token: Token, onTokenUpdate: (token: Token) => void }) => {
  const listItemHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100')
  const listItemTextColor = useColorModeValue('gray.400', 'whiteAlpha.200')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedToken, setSelectedToken] = useState<Token>(token)
  const [searchQuery, setSearchQuery] = useState<string>('')
  const debouncedQuery = useDebounce(searchQuery, 200)

  const { chain } = useNetwork()
  const { address } = useAccount()
  const { data, isFetched } = useBalance({
    addressOrName: address,
    chainId: chain?.id,
    token: selectedToken.address
  })

  const { allTokens } = useTokenStateManager()

  const handleSelectToken = (token: Token) => {
    setSelectedToken(token)
    onTokenUpdate(token)
    onClose()
  }

  const filteredTokens: Token[] = useMemo(() => {
    const filterToken = createFilterToken(debouncedQuery)
    return allTokens.filter(filterToken)
  }, [allTokens, debouncedQuery])

  const filteredQueryTokens = useSortedTokensByQuery(filteredTokens, debouncedQuery)

  const filteredSortedTokens: Token[] = useMemo(() => filteredQueryTokens, [filteredQueryTokens])

  const handleInput = useCallback((event: any) => {
    const input = event.target.value
    const checksummedInput = isAddress(input)
    setSearchQuery(checksummedInput || input)
  }, [])

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        if (filteredSortedTokens.length > 0) {
          if (
            filteredSortedTokens[0].symbol?.toLowerCase() === debouncedQuery.trim().toLowerCase() ||
            filteredSortedTokens.length === 1
          ) {
            setSelectedToken(filteredSortedTokens[0])
            onClose()
          }
        }
      }
    },
    [debouncedQuery, filteredSortedTokens, onClose],
  )

  return (
    <>
      <Flex alignItems={'center'} justifyContent='space-between' w="full">
        <Button
          onClick={onOpen}
          px={2}
          rightIcon={<ChevronDownIcon />}
          bg={useColorModeValue('gray.100', 'whiteAlpha.200')}
          borderRadius="full"
          _hover={{
            bg: useColorModeValue('gray.200', 'whiteAlpha.300')
          }}
        >
          <Flex gap={2} alignItems="center">
            <Image
              width={24}
              height={24}
              src={selectedToken.logoURI}
              alt={'token'}
            />
            <Heading as="h5" size={'sm'}>{selectedToken.symbol}</Heading>
          </Flex>
        </Button>
        <Flex flexDirection={'column'} alignItems={"end"}>
          {isFetched &&
            <Text>{formatDisplayBalance(data?.formatted, 3)}</Text>
          }
          {!isFetched &&
            <Skeleton width={12} height={6} rounded="md" />
          }
          <Text color={useColorModeValue('gray.400', 'whiteAlpha.500')}>Balance</Text>
        </Flex>
      </Flex >
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'md'}
        title="Select a token"
      >
        <Flex flexDirection={'column'} gap={3}>
          <Input
            mb={5}
            placeholder='Search name or paste address'
            leftIcon={<FiSearch />}
            value={searchQuery}
            onKeyDown={handleEnter}
            handleChange={handleInput} />
          <Box borderWidth={1} borderRadius={'xl'} height={'400px'} overflow={'auto'}>
            <List spacing={3}>
              {filteredTokens.length > 0 ? filteredTokens?.map((token, i) => (
                <ListItem
                  onClick={() => handleSelectToken(token)}
                  className={selectedToken.symbol === token.symbol ? 'disabled' : ''}
                  key={i}
                  display={'flex'}
                  justifyContent="space-between"
                  py={'0.5rem'}
                  px={'1rem'}
                  alignItems={'center'}
                  cursor="pointer"
                  _hover={{
                    bg: listItemHoverBg
                  }}
                >
                  <Flex gap={2} alignItems={'center'}>
                    <Image
                      width={32}
                      height={32}
                      src={token.logoURI}
                      alt={'token'}
                    />
                    <Flex flexDirection={'column'}>
                      <Text fontSize={'xs'} color={listItemTextColor}>{token.name}</Text>
                      <Heading as="h5" size={'sm'}>{token.symbol}</Heading>
                    </Flex>
                  </Flex>
                </ListItem>
              )) : (
                <ListItem py={'0.5rem'}>
                  <Flex justifyContent={'center'}>
                    <Text>No results</Text>
                  </Flex>
                </ListItem>
              )}
            </List>
          </Box>
        </Flex>
      </Modal>
    </>
  )
}

export default CurrencySelect;