import { createReducer } from '@reduxjs/toolkit'
import { Tvl } from 'types';
import {
  setIsLoading,
  setTVL,
} from './actions'

interface StrategyTVLState {
  isLoading: boolean;
  tvls: Tvl[]
}

export const initialState: StrategyTVLState = {
  isLoading: true,
  tvls: [],
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setIsLoading, (state: any, action: any) => {
      state.isLoading = action.payload;
    })
    .addCase(setTVL, (state: any, action: any) => {
      state.tvls = action.payload;
    })
)
