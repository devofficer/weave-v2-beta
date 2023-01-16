import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from '../../index'
import { setSavedLPFarms } from '../actions'
type T = /*unresolved*/ any

export function useLPFarmStateManager() {
  const dispatch = useAppDispatch()

  const lpFarms = useSelector<
    AppState,
    AppState['lpFarms']['farms']
  >((state) => state.lpFarms.farms)


  const setSavedLPFarmsPreference = useCallback(
    (newState: Array<T>) => {
      dispatch(setSavedLPFarms(newState))
    },
    [dispatch],
  )


  return {
    lpFarms,
    setSavedLPFarmsPreference,
  } as const
}
