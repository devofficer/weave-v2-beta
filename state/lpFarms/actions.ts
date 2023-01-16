import { createAction } from "@reduxjs/toolkit"

type T = any
export const setSavedLPFarms = createAction<Array<T>>('lpFarms/setSavedLPFarms')