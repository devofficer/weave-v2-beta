import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from '../../index'
import {
  setIsLoading,
  setTVL,
} from '../actions'
type T = /*unresolved*/ any

export function useStrategyStateManager() {
  const dispatch = useAppDispatch()

  const isLoading = useSelector<
    AppState,
    AppState['strategy']['isLoading']
  >((state) => state.strategy.isLoading)

  const tvls = useSelector<
    AppState,
    AppState['strategy']['tvls']
  >((state) => state.strategy.tvls)

  const setIsLoadingPreference = useCallback(
    (newState: boolean) => {
      dispatch(setIsLoading(newState))
    },
    [dispatch],
  )

  const setTVLPreference = useCallback(
    (newState: Array<T>) => {
      console.log('newState', newState)
      dispatch(setTVL(newState))
    },
    [dispatch],
  )

  return {
    isLoading,
    tvls,
    setIsLoadingPreference,
    setTVLPreference,
  } as const
}
