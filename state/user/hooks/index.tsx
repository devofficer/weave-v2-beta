import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { WalletState } from 'state/types'
import { AppState, useAppDispatch } from '../../index'
import {
  setIsActiveConnector,
  setProfileInfo,
  setUpdateChain
} from '../actions'

export function useProfileInfoManager() {
  const dispatch = useAppDispatch()

  const isActiveConnector = useSelector<
    AppState,
    AppState['user']['isActiveConnector']
  >((state) => state.user.isActiveConnector)

  const user = useSelector<
    AppState,
    AppState['user']
  >((state) => state.user)

  const myBusd = useSelector<
    AppState,
    AppState['user']['myBusd']
  >((state) => state.user.myBusd)

  const myWeave = useSelector<
    AppState,
    AppState['user']['myWeave']
  >((state) => state.user.myWeave)

  const setIsActiverConnectorPreference = useCallback(
    (newState: boolean) => {
      dispatch(setIsActiveConnector(newState))
    },
    [dispatch],
  )

  const setUserProfileInfoPreference = useCallback(
    (newState: WalletState) => {
      dispatch(setProfileInfo(newState))
    },
    [dispatch],
  )
  const setUpdateChainPreference = useCallback(
    (newState: any) => {
      dispatch(setUpdateChain(newState))
    },
    [dispatch],
  )



  return {
    isActiveConnector,
    user,
    myBusd,
    myWeave,
    setUserProfileInfoPreference,
    setUpdateChainPreference,
    setIsActiverConnectorPreference,
  } as const
}
