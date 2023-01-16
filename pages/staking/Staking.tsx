import type { NextPage } from 'next';
import dynamic from 'next/dynamic'
import {
  Divider,
  Flex,
  Heading,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';
import { WEAVE_TOKEN_ICON_URL } from 'config/constants';
import { useWithdrawFees } from 'hooks/useStake';
// import { useWithdrawFees } from 'hooks/useStake';
const Home = dynamic(() => import('components/layout/Home'))
const Image = dynamic(() => import('components/common/Image'));
const Button = dynamic(() => import('components/common/Button'));
const StakingCard = dynamic(() => import('components/stake/StakingCard'));

const Staking: NextPage = () => {
  const withdrawFee = useWithdrawFees();
  const handleWithdrawFee = () => {
    withdrawFee();
  }

  return (
    <Home title="Weave Finanial | Staking" active='staking'>
      <SimpleGrid columns={[1, 1, 1, 3]} spacing={{ base: 4, md: 4, xl: 32 }}>
        <StakingCard type="single" />
        <StakingCard type="lp" />
        <Flex flexDirection={'column'} gap={4} borderWidth={1} borderRadius={'2xl'} px={12} py={4} bg={useColorModeValue('white', 'whiteAlpha.100')}>
          <Heading
            as={'h2'}
            textAlign={'center'}
            fontWeight={600}
            whiteSpace="nowrap"
            fontSize={{ base: 'xl', sm: '3xl', md: '3xl' }}>
            Collect Fees
          </Heading>
          <Flex flexDirection={'column'} justifyContent={'center'} gap={10} height='full'>
            <Flex justifyContent={'center'}>
              <Image
                width={100}
                height={100}
                src={WEAVE_TOKEN_ICON_URL}
                alt={'staking'}
              />
            </Flex>
            <Flex flexDirection={'column'} justifyContent={'center'} alignItems={'center'} gap={3}>
              <Heading
                as={'h3'}
                fontWeight={600}
                fontSize={'2xl'}>
                Available
              </Heading>
              <Heading
                as={'h1'}
                fontWeight={600}
                fontSize={{ base: '3xl', sm: '5xl', md: '5xl' }}>
                0.00
              </Heading>
            </Flex>
            <Divider />
            <Flex pt={3} flexDirection={'column'} alignItems={'center'} gap={1}>
              <Button size={'md'} width={"100%"} label={'Withdraw Fees'} colorType={"primary"} onClick={handleWithdrawFee} />
            </Flex>
          </Flex>
        </Flex>
      </SimpleGrid>
    </Home>
  );
};

export default Staking;
