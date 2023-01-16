import { createReducer } from '@reduxjs/toolkit'
import { Token } from 'types';
import { setTokens } from './actions'

export const initialState: { tokens: Token[] } = {
  tokens: []
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setTokens, (state: any, action: any) => {
      state.tokens = action.payload;
    })
)
