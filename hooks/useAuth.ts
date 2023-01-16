import { useCallback } from 'react'
import { ConnectorNames } from 'config/wallet'
import { useConnect, useDisconnect, ConnectorNotFoundError, UserRejectedRequestError, chainId } from 'wagmi'
import { useToast } from '@chakra-ui/react';
import { TOAST_OPTOPNS } from 'config';
import { connectorLocalStorageKey } from 'config/constants';
import { useProfileInfoManager } from 'state/user/hooks';
import { WalletState } from 'state/types';
import { ChainId } from 'utils/chains';

const useAuth = () => {
  const { setUserProfileInfoPreference, setIsActiverConnectorPreference } = useProfileInfoManager()
  const { connectAsync, connectors } = useConnect()
  const { disconnectAsync } = useDisconnect()
  const toast = useToast()

  const login = useCallback(
    async (connectorId: ConnectorNames) => {
      const findConnector = connectors.find((c) => c.id === connectorId)
      try {
        const connected = await connectAsync({ connector: findConnector, chainId: ChainId.BSC })
        if (!connected.chain.unsupported) {
          connectorLocalStorageKey.isActiveConnector = true;
          connectorLocalStorageKey.connectorId = connected.connector?.id;
          connectorLocalStorageKey.chainId = connected.chain.id;
          window?.localStorage?.setItem('weave-wallet', JSON.stringify(connectorLocalStorageKey))

          const state: WalletState = {
            connectorId: connected.connector?.id,
            name: connected.connector?.name,
            address: connected.account,
            chain: connected.chain,
            chains: [],
            myBusd: 0,
            myWeave: 0,
            isActiveConnector: true
          }
          setUserProfileInfoPreference(state)
          setIsActiverConnectorPreference(true)
        }
      } catch (error) {
        if (error instanceof ConnectorNotFoundError) {
          toast({
            title: 'Provider Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
        if (error instanceof UserRejectedRequestError) {
          toast({
            title: 'UserRejected Error',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
          return
        }
        if (error instanceof Error) {
          toast({
            title: 'Please authorize to access your account',
            description: error.message,
            status: 'error',
            ...TOAST_OPTOPNS
          });
        }
      }
    },
    [connectors, connectAsync],
  )

  const logout = useCallback(async () => {
    try {
      window?.localStorage?.removeItem('wallet')
      await disconnectAsync()
    } catch (error) {
      console.error(error)
    } finally {
      setUserProfileInfoPreference({
        connectorId: '',
        name: '',
        address: '',
        chain: '',
        chains: [],
        myBusd: 0,
        myWeave: 0,
        isActiveConnector: false
      })
      setIsActiverConnectorPreference(false)
    }
  }, [disconnectAsync, chainId])

  return { login, logout }
}

export default useAuth
