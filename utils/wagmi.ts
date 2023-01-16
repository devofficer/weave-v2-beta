import { bsc, fantomOpera, bscTest, weaveTestnet } from 'utils/chains'
import { configureChains, createClient } from 'wagmi'
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { polygon } from 'wagmi/chains'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'
import { OntoWalletConnector } from './connectors/ontoWallet'
import { OkexWalletConnector } from './connectors/okxWallet'

const CHAINS = [
  bsc,
  fantomOpera,
  polygon,
  weaveTestnet
  // bscTest,
  // mainnet,
  // okexchain,
]

const getNodeRealUrl = (networkName: string) => {
  let host = null

  switch (networkName) {
    case 'homestead':
      if (process.env.NEXT_PUBLIC_NODE_REAL_API_ETH) {
        host = `eth-mainnet.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_ETH}`
      }
      break
    case 'rinkeby':
      if (process.env.NEXT_PUBLIC_NODE_REAL_API_RINKEBY) {
        host = `eth-rinkeby.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_RINKEBY}`
      }
      break
    case 'goerli':
      if (process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI) {
        host = `eth-goerli.nodereal.io/v1/${process.env.NEXT_PUBLIC_NODE_REAL_API_GOERLI}`
      }
      break
    default:
      host = null
  }

  if (!host) {
    return null
  }

  const url = `https://${host}`
  return {
    http: url,
    webSocket: url.replace(/^http/i, 'wss').replace('.nodereal.io/v1', '.nodereal.io/ws/v1'),
  }
}

export const { provider, chains } = configureChains(CHAINS, [
  jsonRpcProvider({
    rpc: (chain) => {
      //   if (!!process.env.NEXT_PUBLIC_NODE_PRODUCTION && chain.id === bsc.id) {
      //     return { http: process.env.NEXT_PUBLIC_NODE_PRODUCTION }
      //   }
      return getNodeRealUrl(chain.network) || { http: chain.rpcUrls.default }
    },
  }),
])

export const injectedConnector = new InjectedConnector({
  chains,
  options: {
    shimDisconnect: true,
    shimChainChangedDisconnect: true,
  },
})

export const coinbaseConnector = new CoinbaseWalletConnector({
  chains,
  options: {
    appName: 'PancakeSwap',
    appLogoUrl: 'https://pancakeswap.com/logo.png',
  },
})

export const walletConnectConnector = new WalletConnectConnector({
  chains,
  options: {
    qrcode: true,
  },
})

export const metaMaskConnector = new MetaMaskConnector({
  chains,
  options: {
    shimDisconnect: true,
    shimChainChangedDisconnect: true,
  },
})

export const ontoConnector = new OntoWalletConnector({ chains })
export const okxConnector = new OkexWalletConnector({ chains })

export const client = createClient({
  autoConnect: false,
  provider,
  connectors: [
    metaMaskConnector,
    ontoConnector,
    okxConnector
    // injectedConnector,
    // coinbaseConnector,
    // walletConnectConnector,
  ],
})