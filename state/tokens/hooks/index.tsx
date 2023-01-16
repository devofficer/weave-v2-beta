import { useCallback } from 'react'
import { useSelector } from 'react-redux'
import { AppState, useAppDispatch } from '../../index'
import { setTokens } from '../actions'
type T = /*unresolved*/ any

export function useTokenStateManager() {
  const dispatch = useAppDispatch()

  const allTokens = useSelector<
    AppState,
    AppState['tokens']['tokens']
  >((state) => state.tokens.tokens)


  const setTokensPreference = useCallback(
    (newState: Array<T>) => {
      dispatch(setTokens(newState))
    },
    [dispatch],
  )


  return {
    allTokens,
    setTokensPreference,
  } as const
}
