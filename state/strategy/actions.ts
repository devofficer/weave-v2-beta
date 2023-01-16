import { createAction } from "@reduxjs/toolkit"

type T = any
export const setIsLoading = createAction<boolean>('strategy/setIsLoading')
export const setTVL = createAction<Array<T>>('strategy/setTVL')