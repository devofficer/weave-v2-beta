import { createAction } from '@reduxjs/toolkit'

export const resetUserState = createAction<{ chainId: number; newChainId?: number }>('global/resetUserState')
