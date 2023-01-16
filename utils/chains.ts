import { rinkeby, mainnet, goerli } from 'wagmi/chains'
import { Chain } from 'wagmi'

export const avalandche: Chain = {
  id: 43114,
  name: 'Avalanche C-Chain',
  network: 'avalanche',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://snowtrace.io/',
    },
  },
}

export const avalandcheFuji: Chain = {
  id: 43113,
  name: 'Avalanche Fuji',
  network: 'avalanche-fuji',
  rpcUrls: {
    default: 'https://rpc.ankr.com/avalanche_fuji',
  },
  nativeCurrency: { name: 'Avalanche', symbol: 'AVAX', decimals: 18 },
  blockExplorers: {
    default: {
      name: 'snowtrace',
      url: 'https://testnet.snowtrace.io/',
    },
  },
  testnet: true,
}

export const fantomOpera: Chain = {
  id: 250,
  name: 'Fantom Opera',
  network: 'fantom',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.ftm.tools',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://ftmscan.com',
    },
  },
}

export const fantomTestnet: Chain = {
  id: 4002,
  name: 'Fantom Testnet',
  network: 'fantom-testnet',
  nativeCurrency: { name: 'Fantom', symbol: 'FTM', decimals: 18 },
  rpcUrls: {
    default: 'https://rpc.testnet.fantom.network',
  },
  blockExplorers: {
    default: {
      name: 'FTMScan',
      url: 'https://testnet.ftmscan.com',
    },
  },
  testnet: true,
}

const bscExplorer = { name: 'BscScan', url: 'https://bscscan.com' }

export const bsc: Chain = {
  id: 56,
  name: 'BNB Smart Chain',
  network: 'bsc',
  rpcUrls: {
    public: 'https://bsc-dataseed1.binance.org',
    default: 'https://bsc-dataseed1.binance.org',
  },
  blockExplorers: {
    default: bscExplorer,
    etherscan: bscExplorer,
  },
  nativeCurrency: {
    name: 'Binance Chain Native Token',
    symbol: 'BNB',
    decimals: 18,
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 15921452,
  },
}

export const bscTest: Chain = {
  id: 97,
  name: 'BNB Smart Chain Testnet',
  network: 'bsc-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'Test BNB',
    symbol: 'tBNB',
  },
  rpcUrls: {
    public: 'https://bsctestapi.terminet.io/rpc',
    default: 'https://bsctestapi.terminet.io/rpc',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
  multicall: {
    address: '0xcA11bde05977b3631167028862bE2a173976CA11',
    blockCreated: 17422483,
  },
  testnet: true,
}

export const okexchain: Chain = {
  id: 66,
  name: 'OKExChain',
  network: 'okexchain-mainnet',
  nativeCurrency: {
    decimals: 18,
    name: 'OKExChain Token',
    symbol: 'OKT',
  },
  rpcUrls: {
    public: 'https://exchainrpc.okex.org/',
    default: 'https://exchainrpc.okex.org/',
  },
  blockExplorers: {
    default: { name: 'OKLink', url: 'https://www.oklink.com/okexchain/' },
  },
}

export const weaveTestnet: Chain = {
  id: 31337,
  name: 'Weave Testnet',
  network: 'weave-testnet',
  nativeCurrency: {
    decimals: 18,
    name: 'BNB Native Token',
    symbol: 'BNB',
  },
  rpcUrls: {
    public: 'https://rpc.weave.financial/',
    default: 'https://rpc.weave.financial/',
  },
  blockExplorers: {
    default: { name: 'BscScan', url: 'https://testnet.bscscan.com' },
  },
}

export enum ChainId {
  BSC = 56,
  FANTOM = 250,
  POLYGON = 137,
  OKEXCHAIN = 66,
  WEAVE_TESTNET = 31337,
  BSC_TESTNET = 97,
  FANTOM_TESTNET = 4002,
  POLYGON_TESTNET = 80001
}

export { rinkeby, mainnet, goerli }
