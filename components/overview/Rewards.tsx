import { Flex, Avatar, AvatarGroup, Popover, PopoverTrigger, Portal, PopoverContent, PopoverArrow, PopoverBody, useColorModeValue } from '@chakra-ui/react'

const Rewards = () => {
  const iconSize = { base: '32px', md: '32px', xl: '32px' }
  const spacingSize = { sm: -3, md: -2, xl: -2 }
  return (
    <>
      <Popover trigger='hover'>
        <PopoverTrigger >
          <AvatarGroup max={2} spacing={spacingSize} cursor="pointer">
            <Avatar width={iconSize} height={iconSize} border={'none'} name='Binance' src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png' />
            <Avatar width={iconSize} height={iconSize} border={'none'} name='Segun Adebayo' src='https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png' />
            <Avatar width={iconSize} height={iconSize} border={'none'} name='Kent Dodds' src='https://pancakeswap.finance/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png' />
          </AvatarGroup>
        </PopoverTrigger>
        <Portal>
          <PopoverContent
            w={'200px'}
            bg={useColorModeValue('whiteAlpha.800', 'dark.900')}
            color={useColorModeValue('gray.600', 'gray.100')}
            boxShadow="lg"
            borderColor={useColorModeValue('gray.100', 'gray.700')}
            backdropFilter={useColorModeValue('blur(5px)', 'blur(5px)')}>
            <PopoverArrow
              borderColor={useColorModeValue('gray.100', 'gray.700')}
              bg={useColorModeValue('whiteAlpha.800', 'dark.900')} />

            <PopoverBody >
              <Flex justifyContent={'center'}>
                <AvatarGroup max={5} spacing={spacingSize}>
                  <Avatar width={iconSize} height={iconSize} border={'none'} name='Binance' src='https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png' />
                  <Avatar width={iconSize} height={iconSize} border={'none'} name='Segun Adebayo' src='https://pancakeswap.finance/images/tokens/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c.png' />
                  <Avatar width={iconSize} height={iconSize} border={'none'} name='Kent Dodds' src='https://pancakeswap.finance/images/tokens/0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56.png' />
                  <Avatar width={iconSize} height={iconSize} border={'none'} name='Prosper Otemuyiwa' src='https://pancakeswap.finance/images/tokens/0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402.png' />
                  <Avatar width={iconSize} height={iconSize} border={'none'} name='Christian Nwamba' src='https://pancakeswap.finance/images/tokens/0x2170Ed0880ac9A755fd29B2688956BD959F933F8.png' />
                </AvatarGroup>
              </Flex>
            </PopoverBody>
          </PopoverContent>
        </Portal>
      </Popover>
    </>
  )
}

export default Rewards;