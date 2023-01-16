import useAuth from './useAuth'
import {
  METAMASK_LOGO_URL,
  ONTO_LOGO_URL,
  OKX_LOGO_URL,
  BSC_LOGO_URL,
  POLYGON_LOGO_URL,
  FANTOM_LOGO_URL,
  OKEXCHAIN_LOGO_URL,
  connectorLocalStorageKey,
  WEAVE_LOGO_URL
} from 'config/constants';
import { ChainId } from 'utils/chains';

export const useWallet = () => {
  const { login, logout } = useAuth()

  const getIconOfConnector = (connectorId: any) => {
    switch (connectorId) {
      case "metaMask":
        return METAMASK_LOGO_URL
        break;
      case "onto":
        return ONTO_LOGO_URL;
        break;
      case "okx":
        return OKX_LOGO_URL;
      default:
        break;
    }
  }

  const getIconOfChain = (chainId: any) => {
    switch (chainId) {
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
        return BSC_LOGO_URL;
      case ChainId.OKEXCHAIN:
        return OKEXCHAIN_LOGO_URL;
      case ChainId.FANTOM:
      case ChainId.FANTOM_TESTNET:
        return FANTOM_LOGO_URL;
      case ChainId.POLYGON:
      case ChainId.POLYGON_TESTNET:
        return POLYGON_LOGO_URL;
      case ChainId.WEAVE_TESTNET:
        return WEAVE_LOGO_URL;
      default:
        return BSC_LOGO_URL;
    }
  }

  const getNameOfChain = (chainId: any) => {
    switch (chainId) {
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
        return 'Binance';
      case ChainId.OKEXCHAIN:
        return 'OkexChain';
      case ChainId.FANTOM:
      case ChainId.FANTOM_TESTNET:
        return 'Fantom';
      case ChainId.POLYGON:
      case ChainId.POLYGON_TESTNET:
        return 'Polygon';
      case ChainId.WEAVE_TESTNET:
        return 'Weave Testnet'
      default:
        return 'Binance';
    }
  }

  const getColorOfChain = (chainId: any) => {
    switch (chainId) {
      case ChainId.BSC:
      case ChainId.BSC_TESTNET:
        return '#ECC94B';
      case ChainId.OKEXCHAIN:
        return '#000000';
      case ChainId.FANTOM:
      case ChainId.FANTOM_TESTNET:
        return '#34B3E4';
      case ChainId.POLYGON:
      case ChainId.POLYGON_TESTNET:
        return '#805AD5';
      case ChainId.WEAVE_TESTNET:
        return '#805AD5';
      default:
        return '#ECC94B';
    }
  }


  const getActiveConnectorLocalStorage = () => {
    const walletLocalStorageKey = window?.localStorage?.getItem('weave-wallet');
    if (walletLocalStorageKey !== null) {
      const json = JSON.parse(walletLocalStorageKey)
      connectorLocalStorageKey.isActiveConnector = json.isActiveConnector;
      connectorLocalStorageKey.chainId = json.chainId;
      connectorLocalStorageKey.connectorId = json.connectorId;
    } else {
      connectorLocalStorageKey.isActiveConnector = false;
    }

    return connectorLocalStorageKey;
  }

  const connectWallet = (connectorId: any) => {
    login(connectorId);
  }

  const disconnectWallet = () => {
    logout();
  }

  return {
    connectWallet,
    disconnectWallet,
    getIconOfConnector,
    getIconOfChain,
    getColorOfChain,
    getNameOfChain,
    getActiveConnectorLocalStorage
  }
}
