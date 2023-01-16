import type { NextPage } from 'next'
// import { useCallback } from 'react'
import dynamic from 'next/dynamic'
import { Flex } from '@chakra-ui/react'
// import {
//   processesApeFarmEntries
// } from "config/farms"
// import { polygonTokensJson } from "config/tokens"
// import { trpc } from 'utils/trpc'
// import { TOAST_OPTOPNS } from 'config'

const Home = dynamic(() => import('components/layout/Home'))
// const Button = dynamic(() => import('components/common/Button'))

// const swapdata = [
//   {
//     name: 'PancakeSwap',
//     chainId: 56,
//     logoURI: 'https://assets.coingecko.com/coins/images/12632/small/pancakeswap-cake-logo_%281%29.png?1629359065',
//     gTokenSymbol: 'Cake',
//     gTokenAddress: '0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://pancakeswap.finance/images/tokens/0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82.png"
//   },
//   {
//     name: 'BabySwap',
//     chainId: 56,
//     logoURI: 'https://baby-upload.s3.ap-southeast-1.amazonaws.com/images/coins/0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657.png',
//     gTokenSymbol: 'BABY',
//     gTokenAddress: '0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://baby-upload.s3.ap-southeast-1.amazonaws.com/images/coins/0x53E562b9B7E5E94b81f10e96Ee70Ad06df3D2657.png"
//   },
//   {
//     name: 'KnightSwap',
//     chainId: 56,
//     logoURI: 'https://app.knightswap.financial/images/tokens/KNIGHT.png',
//     gTokenSymbol: 'KNIGHT',
//     gTokenAddress: '0xD23811058Eb6e7967D9a00dc3886E75610c4AbBa',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://app.knightswap.financial/images/tokens/KNIGHT.png"
//   },
//   {
//     name: 'SpookySwap',
//     chainId: 250,
//     logoURI: 'https://assets.spooky.fi/tokens/BOO.png',
//     gTokenSymbol: 'BOO',
//     gTokenAddress: '0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://assets.spooky.fi/tokens/BOO.png"
//   },
//   {
//     name: 'SpiritSwap',
//     chainId: 250,
//     logoURI: 'https://www.spiritswap.finance/assets/imgs/spiritswap_logo_normal.png',
//     gTokenSymbol: 'SPIRIT',
//     gTokenAddress: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://swap.spiritswap.finance/images/coins/SPIRIT.png"
//   },
//   {
//     name: 'ApeSwap',
//     chainId: 250,
//     logoURI: 'https://www.spiritswap.finance/assets/imgs/spiritswap_logo_normal.png',
//     gTokenSymbol: 'SPIRIT',
//     gTokenAddress: '0x5Cc61A78F164885776AA610fb0FE1257df78E59B',
//     gTokenDecimals: 18,
//     gTokenLogoURI: "https://swap.spiritswap.finance/images/coins/SPIRIT.png"
//   }
// ]

const ImportData: NextPage = () => {
  // const toast = useToast()
  // const saveFarmsMutation = trpc.useMutation(['farms.save'], {
  //   onSuccess: () => {
  //     toast({
  //       title: 'Success',
  //       description: 'Farm is saved correctly.',
  //       status: 'success',
  //       ...TOAST_OPTOPNS,
  //     })
  //   },
  // })

  // const saveTokensMutation = trpc.useMutation(['tokens.save'], {
  //   onSuccess: () => {
  //     toast({
  //       title: 'Success',
  //       description: 'Token is saved correctly.',
  //       status: 'success',
  //       ...TOAST_OPTOPNS,
  //     })
  //   },
  // })

  // const handleImportFarms = useCallback(() => {

  //   processesApeFarmEntries.forEach((e) => {
  //     const saveData: any = {
  //       type: e.type,
  //       chainId: e.chainId,
  //       poolId: e.poolID,
  //       project: e.Project,
  //       token1Address: e.token1Address,
  //       token1Name: e.token1Name,
  //       token1Symbol: e.token1Symbol,
  //       token2Address: e.token2Address,
  //       token2Name: e.token2Name,
  //       token2Symbol: e.token2Symbol,
  //       apr: e.apr,
  //       tvl: e.tvl,
  //     }
  //     saveFarmsMutation.mutate(saveData)
  //   })
  // }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // const handleSaveTokens = useCallback(() => {

  //   polygonTokensJson.forEach((e) => {
  //     const saveData: any = {
  //       name: e.name,
  //       chainId: e.chainId,
  //       symbol: e.symbol,
  //       address: e.address,
  //       decimals: e.decimals,
  //       logoURI: e.logoURI,
  //     }
  //     saveTokensMutation.mutate(saveData)
  //   })
  // }, [saveTokensMutation]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Home
      title="Weave Finanial | Strategy Builder"
      active=""
      px={0}
      py={0}
    >
      <Flex
        px={{ base: 4, md: 10 }}
        py={2}
      >
        {/* <Button
          label={'Import Farm Data'}
          onClick={handleImportFarms}
        />
        <Button
          label={'Import Token Data'}
          onClick={handleSaveTokens}
        /> */}
      </Flex>
    </Home>
  )
}

export default ImportData
