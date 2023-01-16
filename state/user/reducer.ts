import { createReducer } from '@reduxjs/toolkit'
import {
  setIsActiveConnector,
  setProfileInfo,
  setUpdateChain,
  setMyBusd,
  setMyWeave
} from './actions'
import { WalletState } from '../types'

export const initialState: WalletState = {
  isActiveConnector: false,
  connectorId: '',
  name: '',
  address: '',
  chain: {},
  chains: [],
  myBusd: 0,
  myWeave: 0
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setIsActiveConnector, (state: any, action: any) => {
      state.isActiveConnector = action.payload;
    })
    .addCase(setProfileInfo, (state: any, action: any) => {
      state.connectorId = action.payload.connectorId;
      state.name = action.payload.name;
      state.address = action.payload.address;
      state.chain = action.payload.chain;
      state.chains = action.payload.chains;
    })
    .addCase(setUpdateChain, (state: any, action: any) => {
      state.chain = action.payload;
    })
    .addCase(setMyBusd, (state: any, action: any) => {
      state.myBusd = action.payload;
    })
    .addCase(setMyWeave, (state: any, action: any) => {
      state.myWeave = action.payload;
    })
)
