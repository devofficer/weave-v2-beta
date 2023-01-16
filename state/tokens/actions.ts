import { createAction } from "@reduxjs/toolkit"

type T = any
export const setTokens = createAction<Array<T>>('tokens/setTokens')