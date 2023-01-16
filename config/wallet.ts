import dynamic from 'next/dynamic'
import { WalletConfig } from 'types';
const MetamaskIcon = dynamic(() => import('../components/icons/MetamaskIcon'));
const OntoIcon = dynamic(() => import('../components/icons/OntoIcon'));
const OKXIcon = dynamic(() => import('../components/icons/OKXIcon'));

export enum ConnectorNames {
  MetaMask = 'metaMask',
  Onto = 'onto',
  OKX = 'okx',
  Injected = 'injected',
  WalletConnect = 'walletConnect',
  WalletLink = 'coinbaseWallet',
}

export const wallets: WalletConfig<ConnectorNames>[] = [

  {
    title: 'Metamask',
    icon: MetamaskIcon,
    installed: typeof window !== 'undefined' && Boolean(window.ethereum?.isMetaMask),
    connectorId: ConnectorNames.MetaMask,
    priority: 1,
    href: 'https://metamask.app.link/dapp/pancakeswap.finance/',
  },

  {
    title: 'Onto',
    icon: OntoIcon,
    connectorId: ConnectorNames.Onto,
    // @ts-ignore
    installed: typeof window !== 'undefined' && typeof window.onto !== 'undefined',
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && typeof window.onto !== 'undefined' ? 0 : 999
    },
  },
  {
    title: 'OKX',
    icon: OKXIcon,
    connectorId: ConnectorNames.OKX,
    // @ts-ignore
    installed: typeof window !== 'undefined' && Boolean(window.okexchain.isOKExWallet),
    priority: () => {
      // @ts-ignore
      return typeof window !== 'undefined' && Boolean(window.okexchain.isOKExWallet) ? 0 : 999
    },
  },
  // {
  //   title: 'WalletConnect',
  //   icon: WalletConnectIcon,
  //   connectorId: ConnectorNames.WalletConnect,
  //   priority: 5,
  // },
]
