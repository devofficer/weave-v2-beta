/* eslint-disable */
import dynamic from 'next/dynamic'
import {
  Divider,
  Flex,
  Heading,
  Switch,
  Text,
  useColorModeValue,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { BUSD_LOGO_URL, WEAVE_TOKEN_ICON_URL } from 'config/constants';
import { useWeaveTVL, useUserBalance, useWeaveSingleAPY, useWeaveLPAPR, useWeavePrice, useWeavePerDay, useLPTokenPrice, useWeaveRewards, useAutoCompoundSetWeave, useCheckApproval, useDepositWeave, useCompoundAll, useClaimAll, useToggleAutoCompound, useIsAutoCompound, useApproveWeave } from 'hooks/useStake';
import { useEffect, useState } from 'react';
import { commafy } from 'utils';
import { useAccount, useSigner } from 'wagmi';
import Pancakeswap from './Pancakeswap';
import ModalAmountInput from './ModalAmountInput';

const WalletConnectButton = dynamic(() => import('components/WalletConnectButton'));
const Image = dynamic(() => import('components/common/Image'));
const Button = dynamic(() => import('components/common/Button'));

const StakingCard = ({ type }: { type: string }) => {

  const { onOpen, onClose, isOpen } = useDisclosure()
  const [weaveAPY, setWeaveAPY] = useState('0.00')
  const [weaveAPR, setWeaveAPR] = useState('0.00')
  const [price, setPrice] = useState('0.00')
  const [action, setAction] = useState('deposit');
  // const [weaveDeposit, setWeaveDeposit] = useState<string | undefined>('')
  // const [weaveDepositAdjusted, setWeaveDepositAdjusted] = useState<string | undefined>('')
  // const [weaveTVL, setWeaveTVL] = useState<string | undefined>('')
  // const [weaveTVLAdjusted, setWeaveTVLAdjusted] = useState<string | undefined>('')
  // const [weavePerDay, setWeavePerDay] = useState<number>(0)
  // const [totalRewards, setTotalRewards] = useState<number | undefined>(0)
  // const [autoCompound, setAutoCompound] = useState<boolean | undefined>(false)
  // const [isLoading, setIsLoading] = useState<boolean>(true)
  const { isConnected } = useAccount()
  const { lpTokenPrice } = useLPTokenPrice()
  const { weavePrice } = useWeavePrice()
  const { userBalance, userBalanceAdjusted, getUserBalance } = useUserBalance(type)
  const { weaveTVL, weaveTVLAdjusted } = useWeaveTVL(type)
  // const { apr } = useWeaveLPAPR(type)
  const { userTokenPerDay } = useWeavePerDay(type)
  const { isApproval, checkApproval } = useCheckApproval(type)

  // console.log(userBalance, userBalanceAdjusted)
  // console.log(weaveTVL, weaveTVLAdjusted)
  // console.log('busdPrice', busdPrice)
  // console.log('lpTokenPrice', lpTokenPrice)
  // console.log('weavePrice', weavePrice)
  // console.log('apr', apr)
  const compoundAll = useCompoundAll(type);
  const claimAll = useClaimAll(type);
  const toggleAutoCompound = useToggleAutoCompound(type);
  const { isAutoCompound, getIsCompound } = useIsAutoCompound(type);
  const approveWeave = useApproveWeave(type);

  const handleCompound = () => {
    compoundAll();
  }

  const handleClaim = () => {
    claimAll();
  }

  const handleAutoCompound = async () => {
    await toggleAutoCompound();
    await getIsCompound();
  }

  const displayValue = (value: any) => {
    if (!isConnected) {
      return '0.00'
    } else if (value === undefined || value.toString() === 'NaN') {
      return '0.00'
    } else {
      return commafy(value)
    }
  }

  const handleApprove = async () => {
    await approveWeave();
    await checkApproval();
  }

  useEffect(() => {
    const singleAPRtemp = ((Number(userTokenPerDay) * Number(userBalanceAdjusted) * Number(weavePrice)) / (Number(userBalance) * Number(weavePrice))) * 365 * 100;
    const lpAPRtemp = ((Number(userTokenPerDay) * Number(userBalanceAdjusted) * Number(weavePrice)) / (Number(userBalance) * Number(lpTokenPrice))) * 365 * 100;
    if (type === "single") {
      setWeaveAPR(singleAPRtemp?.toFixed(2));
      setWeaveAPY((100 * (Math.pow(1 + singleAPRtemp / 5200, 52) - 1))?.toFixed(2));
      setPrice(weavePrice);
    } else if (type === "lp") {
      setWeaveAPR(lpAPRtemp?.toFixed(2));
      setWeaveAPY((100 * (Math.pow(1 + lpAPRtemp / 5200, 52) - 1)).toFixed(2));
      setPrice(lpTokenPrice);
    }

  }, [userTokenPerDay, userBalance, userBalanceAdjusted, weavePrice, lpTokenPrice])

  useEffect(() => {
    const timer = setInterval(async () => {
      if (type === "single") {
        setPrice(weavePrice);
      } else if (type === "lp") {
        setPrice(lpTokenPrice);
      }
    }, 1000);
    return () => clearInterval(timer);
  })


  return (
    <Flex flexDirection={'column'} gap={4}>
      <Flex flexDirection={'column'} gap={4} borderWidth={1} borderRadius={'2xl'} px={12} py={4} bg={useColorModeValue('white', 'whiteAlpha.100')}>
        <Heading
          as={'h2'}
          textAlign={'center'}
          fontWeight={600}
          whiteSpace="nowrap"
          fontSize={{ base: 'xl', sm: 'xl', md: '5xl', lg: '2xl' }}>
          {type === "single" && 'Single Staking'}
          {type === "lp" && 'Liquidity Staking'}
        </Heading>
        <Flex justifyContent={'center'} gap={1}>
          <Image
            width={56}
            height={56}
            src={WEAVE_TOKEN_ICON_URL}
            alt={'staking'}
          />
          {type === 'lp' && <Image
            width={56}
            height={56}
            src={BUSD_LOGO_URL}
            alt={'staking'}
          />}
        </Flex>
        <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
          <Heading
            as={'h3'}
            fontWeight={600}
            fontSize={'2xl'}>
            Staked
          </Heading>
          <Heading
            display={'flex'}
            as={'h1'}
            fontWeight={600}
            fontSize={{ base: '5xl', lg: 'xl', xl: '3xl' }}>
            {displayValue(userBalance)}/{displayValue(weaveTVL)}
          </Heading>
          <Flex justifyContent={'center'} gap={1}>
            <Image
              width={24}
              height={20}
              src={BUSD_LOGO_URL}
              alt={'staking'}
            />
            <Heading
              as={'h4'}
              fontWeight={600}
              fontSize={'xl'}>
              BUSD ${displayValue(Number(userBalance) * Number(price))} Value
            </Heading>
          </Flex>
          {type === 'single'
            ? <Pancakeswap feature='buyWeave' />
            : <Pancakeswap feature='addLiquidity' />}
        </Flex>
        <VStack
          spacing={5}
          align='stretch'
          justifyContent={'center'}
          py={3}
          gap={1}
        >
          <Flex justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <Text
              fontSize={'md'}>
              APY
            </Text>
            <Text
              fontWeight={600}
              fontSize={'md'}>
              {(weaveAPY.toString() === 'NaN') ? '-'
                : `${displayValue(Number(weaveAPY))}%`
              }
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <Text
              fontSize={'md'}>
              APR
            </Text>
            <Text
              fontWeight={600}
              fontSize={'md'}>
              {(weaveAPR.toString() === 'NaN') ? '-'
                : `${displayValue(Number(weaveAPR))}%`
              }
            </Text>
          </Flex>
          <Flex justifyContent={'space-between'} alignItems={'center'} gap={1}>
            <Text
              fontSize={'md'}>
              WEAVE/DAY
            </Text>
            <Text
              fontWeight={600}
              fontSize={'md'}>
              {displayValue(Number(userTokenPerDay) * Number(userBalanceAdjusted))}
            </Text>
          </Flex>
        </VStack>
        <Divider />
        <Flex pt={3} flexDirection={'column'} alignItems={'center'} gap={1}>
          {!isConnected ? (
            <WalletConnectButton width={'100%'} />
          ) : (
            <>
              {!isApproval
                ? <Button size={'md'} width={"100%"} label={'Approve'} colorType={"primary"} onClick={handleApprove} />
                : <>
                  <Button size={'md'} width={"100%"} label={'Deposit'} colorType={"primary"} onClick={() => {
                    setAction('deposit');
                    onOpen();
                  }} />
                  <Button size={'md'} width={"100%"} label={'Withdraw'} colorType={"primary"} onClick={() => {
                    setAction('withdraw');
                    onOpen();
                  }} />
                </>}
            </>
          )}
        </Flex>
      </Flex>

      <Flex flexDirection={'column'} gap={4} borderWidth={1} borderRadius={'2xl'} px={12} py={4} bg={useColorModeValue('white', 'whiteAlpha.100')}>
        <Flex justifyContent={'space-between'} alignItems={'center'}>
          <Image
            width={32}
            height={32}
            src={WEAVE_TOKEN_ICON_URL}
            alt={'staking'}
          />
          <Flex flexDirection={'column'} alignItems={'center'} gap={1}>
            <Heading
              as={'h4'}
              whiteSpace="nowrap"
              fontSize={'xl'}>
              Claimable Rewards
            </Heading>
            <Heading
              as={'h4'}
              fontSize={'xl'}>
              0.00
            </Heading>
          </Flex>
        </Flex>
        <Divider />

        {!isConnected ? (
          <WalletConnectButton width={'100%'} />
        ) : (
          <Flex flexDirection={'column'} gap={3}>
            <Flex justifyContent={'space-between'} alignItems={'center'} gap={1}>
              <Heading
                as={'h4'}
                fontSize={'md'}>
                Auto-Compound
              </Heading>
              <Switch size='lg' colorScheme={useColorModeValue('light', 'dark')} isChecked={isAutoCompound} onChange={handleAutoCompound} />
            </Flex>
            <Flex justifyContent={'space-between'} alignItems={'center'} gap={2}>
              <Button size={'md'} width={"100%"} lineHeight={1} label={'Compound'} colorType={"primary"} onClick={handleCompound} />
              <Button size={'md'} width={"100%"} lineHeight={1} label={'Claim'} colorType={"primary"} onClick={handleClaim} />
            </Flex>
          </Flex>
        )}

      </Flex>

      <ModalAmountInput type={type} action={action} onClose={onClose} isOpen={isOpen} />
    </Flex>
  );
};

export default StakingCard;
