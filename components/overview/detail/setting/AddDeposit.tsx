import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { ChevronDownIcon } from '@chakra-ui/icons';
import {
  Button as ChakraButton,
  Flex,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useDisclosure,
  Image,
  Text,
  useToast,
  Alert,
  AlertIcon
} from '@chakra-ui/react'
import { ethers } from 'ethers';
import { TOAST_OPTOPNS } from 'config';
import { Token } from 'types';
import { formatDisplayBalance, formatEther } from 'utils/formatBalance';
import { useWeb3React } from 'hooks/useWeb3React';
import strategyArtifactBNB from 'artifacts/contracts/StrategyBNB.sol/StrategyBNB.json'
import strategyArtifactFTM from 'artifacts/contracts/StrategyFTM.sol/StrategyFTM.json'
import { ChainId } from 'utils/chains';
import { useTokenStateManager } from 'state/tokens/hooks';
import { useBalance } from 'wagmi';
const AmountInput = dynamic(() => import('components/overview/AmountInput'))
const Button = dynamic(() => import('components/common/Button'))
const Modal = dynamic(() => import('components/common/Modal'));

const abi = [
  "function balanceOf(address _owner) public view returns (uint256 balance)",
  "function allowance(address owner, address spender) public view returns (uint256)"
]

const AddDeposit = ({ status, contractAddress }: { status: number, contractAddress: string }) => {
  const [depositAmount, setDepositAmount] = useState(0)
  const [invalidInput, setInvalidInput] = useState(false)
  const [activeToken, setActiveToken] = useState<Token>()
  const [isValidTokens, setIsValidTokens] = useState(false)

  const [isLoaded, setIsLoaded] = useState(false)
  const [isDeposited, setIsDeposited] = useState(false)
  const [isApproveLoading, setIsApproveLoading] = useState(false)
  const [currentDepositApproved, setCurrentDepositApproved] = useState(false)
  const { onOpen, isOpen, onClose } = useDisclosure()
  const [validTokens, setValidTokens] = useState<any>([]);
  const toast = useToast()
  const { chainId, signer, account } = useWeb3React()
  const { allTokens } = useTokenStateManager()

  const { data: balance } = useBalance({
    addressOrName: account,
    token: activeToken?.address,
    chainId: chainId
  })

  const onSelectToken = (token: Token) => {
    setActiveToken(token)
  }

  const approveToken = async () => {
    if (!signer || !activeToken) {
      return
    }
    try {
      setIsApproveLoading(true);
      const contract = new ethers.Contract(
        activeToken.address,
        [
          "function approve(address _spender, uint256 _value) public returns (bool success)",
        ],
        signer
      );

      const transaction = await contract.approve(
        contractAddress,
        "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"
      );
      const result = await transaction.wait();
      if (result) {
        setIsApproveLoading(false);
        setCurrentDepositApproved(true);
      }
      return result;
    } catch (error) {
      setIsApproveLoading(false);
    }
  }

  const depositToken = async () => {
    let abi: any;
    if (!signer || !activeToken) {
      return
    }
    try {
      setIsDeposited(true)
      if (
        chainId == ChainId.BSC || chainId == ChainId.WEAVE_TESTNET
      ) {
        abi = strategyArtifactBNB.abi;
      } else if (chainId == ChainId.FANTOM) {
        abi = strategyArtifactFTM.abi;
      }
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const transaction = await contract.depositFunds(
        activeToken.address,
        ethers.utils.parseEther(depositAmount.toString()),
        10
      );
      const result = await transaction.wait();
      if (result) {
        onClose()
        setIsDeposited(false)
        toast({
          title: 'Success',
          description: `${depositAmount} ${activeToken.symbol} deposited successfully`,
          status: 'success',
          ...TOAST_OPTOPNS
        });
      }
    } catch (error) {
      setIsDeposited(false)
    }

  };

  const onMaxAmount = () => {
    setDepositAmount(Number(formatDisplayBalance(balance?.formatted, 3)))
  }
  const onAmountChange = (e: number) => {
    if (e > Number(balance?.formatted)) {
      setInvalidInput(true);
      return;
    }
    setInvalidInput(false);
    setDepositAmount(e)
  }

  useEffect(() => {
    const checkAllowance = async () => {
      if (signer && activeToken) {
        const contract = new ethers.Contract(
          activeToken.address,
          abi,
          signer
        );
        const allowance = await contract.allowance(signer.getAddress(), contractAddress);
        if (allowance > depositAmount) {
          setCurrentDepositApproved(true);
        } else {
          setCurrentDepositApproved(false);
        }
      }
    }
    checkAllowance();
  }, [activeToken])

  useEffect(() => {
    const fetchValidTokens = async () => {
      setIsLoaded(true)
      if (!signer || status === 0) {
        setIsLoaded(false)
        setIsValidTokens(false)
        return
      }
      try {
        let tokenTemp: any = []
        allTokens.forEach(async (token: any) => {
          const contract = new ethers.Contract(
            token.address,
            abi,
            signer
          );
          const tokenBalance = await contract.balanceOf(signer.getAddress())
          if (formatEther(tokenBalance) > 0) {
            tokenTemp = tokenTemp.concat(token);
          }
          setValidTokens(tokenTemp)
          setActiveToken(tokenTemp[0])
          setIsLoaded(false)
          if (tokenTemp.length == 0) {
            setIsValidTokens(true)
          } else {
            setIsValidTokens(false)
          }
        })
      } catch (error: any) {
        if (error) {
          setIsLoaded(false)
          toast({
            title: 'Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
      }
    }
    fetchValidTokens()
  }, [signer, status]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      <Button label={'Add Funds'} onClick={() => onOpen()} w="full" mb={2} loadingText='Checking Valid Tokens...' isLoading={isLoaded} isDisabled={status === 0 || validTokens.length === 0} />
      {isValidTokens &&
        <Alert status='warning' borderRadius={'xl'} fontSize={'sm'}>
          <AlertIcon />
          You don't have any tokens to deposit in you wallet.
        </Alert>
      }
      <Modal
        onClose={onClose}
        isOpen={isOpen}
        size={'xs'}
        title="Add funds"
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
                {activeToken?.symbol}
              </MenuButton>
              <MenuList>
                {validTokens?.map((token: any, index: any) => (
                  <MenuItem minW={'full'} minH='30px' fontSize={'sm'} key={index} onClick={() => onSelectToken(token)}>
                    <Image
                      boxSize='1.5rem'
                      borderRadius='full'
                      src={token.logoURI}
                      alt={token.symbol}
                      mr='12px'
                    />
                    <Text w="full">{token.symbol}</Text>
                  </MenuItem>
                ))}
              </MenuList>
            </Menu>
          </Flex>
          {currentDepositApproved ? (
            <>
              {activeToken &&
                <AmountInput
                  balance={balance?.formatted}
                  amount={depositAmount}
                  isError={invalidInput}
                  errorText={'Input amount exceeds balance'}
                  onAmountChange={(e) => onAmountChange(e)}
                  onMaxAmount={onMaxAmount} />
              }
              <Button label={'Deposit'} onClick={depositToken} isLoading={isDeposited} w="full" />
            </>
          ) : (
            <Button label={'Approve'} onClick={approveToken} isLoading={isApproveLoading} w="full" />
          )}
        </Flex>
      </Modal>
    </>
  )
}

export default AddDeposit;