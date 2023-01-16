import { createReducer } from '@reduxjs/toolkit'
import { IFarm } from 'types';
import { setSavedLPFarms } from './actions'

export const initialState: { farms: IFarm[] } = {
  farms: []
}

export default createReducer(initialState, (builder) =>
  builder
    .addCase(setSavedLPFarms, (state: any, action: any) => {
      state.farms = action.payload;
    })
)
