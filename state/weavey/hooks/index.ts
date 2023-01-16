import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { AppState, useAppDispatch } from '../../index';
import { WeaveyState } from './../../types';
import { setWeaveyContent } from './../actions';

export function useWeaveyManager() {
  const dispatch = useAppDispatch()

  const weavey = useSelector<
    AppState,
    AppState['weavey']
  >((state) => state.weavey)

  const setWeaveyContentPreference = useCallback(
    (newState: WeaveyState) => {
      dispatch(setWeaveyContent(newState))
    },
    [dispatch],
  )

  return {
    weavey,
    setWeaveyContentPreference
  } as const
}
