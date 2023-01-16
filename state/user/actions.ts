import { createAction } from "@reduxjs/toolkit"

export const setIsActiveConnector = createAction<Object>('user/setIsActiveConnector')
export const setProfileInfo = createAction<Object>('user/setProfileInfo')
export const setUpdateChain = createAction<Object>('user/setUpdateChain')
export const setMyBusd = createAction<number>('user/setMyBusd')
export const setMyWeave = createAction<number>('user/setMyWeave')
