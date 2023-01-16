import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { FLUSH, PAUSE, PERSIST, persistReducer, persistStore, PURGE, REGISTER, REHYDRATE } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import strategy from './strategy/reducer'
import tokens from './tokens/reducer'
import lpFarms from './lpFarms/reducer'
import user from './user/reducer'
import weavey from './weavey/reducer'

const PERSISTED_KEYS: string[] = ['user', 'strategy']

const persistConfig = {
  key: 'primary',
  whitelist: PERSISTED_KEYS,
  storage,
  version: 1,
}

const reducers = combineReducers({
  user,
  strategy,
  tokens,
  lpFarms,
  weavey
});

const persistedReducer = persistReducer(
  persistConfig,
  reducers
)

// eslint-disable-next-line import/no-mutable-exports
let store: ReturnType<typeof makeStore>

export function makeStore(preloadedState = undefined) {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: true,
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }),
    devTools: process.env.NODE_ENV === 'development',
    preloadedState,
  })
}


export const initializeStore = (preloadedState = undefined) => {
  let _store = store ?? makeStore(preloadedState)

  // After navigating to a page with an initial Redux state, merge that state
  // with the current state in the store, and create a new store
  // if (preloadedState && store) {
  //   _store = makeStore({
  //     ...store.getState(),
  //     ...preloadedState,
  //   })
  //   // Reset the current store
  //   store = undefined
  // }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store

  // Create the store once in the client
  if (!store) {
    store = _store
  }

  return _store
}

store = initializeStore()

/**
 * @see https://redux-toolkit.js.org/usage/usage-with-typescript#getting-the-dispatch-type
 */
export type AppDispatch = typeof store.dispatch
export type AppState = ReturnType<typeof store.getState>
export const useAppDispatch = () => useDispatch<AppDispatch>()

export default store

export const persistor = persistStore(store)

export function useStore(initialState: any) {
  return useMemo(() => initializeStore(initialState), [initialState])
}
