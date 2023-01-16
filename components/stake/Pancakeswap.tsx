import dynamic from 'next/dynamic';
import Image from 'next/image';
// import { ArrowForwardIcon, Icon } from '@chakra-ui/icons';
import { PANCAKESWAP_LOGO_URL } from 'config/constants';

const Button = dynamic(() => import('components/common/Button'));
const Link = dynamic(() => import('components/common/Link'));

const PancakeswapIcon = () => {
  return (
    <Image width={'16'} height={'16'} src={PANCAKESWAP_LOGO_URL} alt="" />
  )
}

const Pancakeswap = ({ feature }: { feature: string }) => {
  let labelOnButton = '', linkUrl: string;
  if (feature === 'buyWeave') {
    labelOnButton = 'Buy Weave';
    linkUrl = 'https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x6CC97eF7D330C090681c3a6d266F6AdeDf80e56B';
  }

  if (feature === 'addLiquidity') {
    labelOnButton = 'Add Liquidity';
    linkUrl = 'https://pancakeswap.finance/add/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56/0x6CC97eF7D330C090681c3a6d266F6AdeDf80e56B';
  }

  if (feature === 'buyLiquidity') {
    labelOnButton = 'Buy Liquidity';
    linkUrl = 'https://pancakeswap.finance/swap?inputCurrency=0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56&outputCurrency=0x6CC97eF7D330C090681c3a6d266F6AdeDf80e56B';
  }

  return (
    <>
      <Button
        label={labelOnButton}
        leftIcon={<PancakeswapIcon />}
        // rightIcon={<ArrowForwardIcon />}
        onClick={() => {
          window.open(linkUrl)
        }}
        width='100%'
        height='30'
        bg={'green.500'}
        _hover={{ bgColor: 'green.600' }}
      />
      <div style={{ height: '10px' }}>
        {(feature === 'addLiquidity') && <Link label="Need help?" href='https://weave.financial/academy/' target={'_blank'} color={'gray'} />}
      </div>
    </>

  )
}

export default Pancakeswap;