
import { configureStore } from '@reduxjs/toolkit'
import popupReducer from './lib/slices/popupSlice';
import authReducer from './lib/slices/authSlice';
import processReducer from './lib/slices/processSlice';
import { enableMapSet } from 'immer';

export const makeStore = () => {
  return configureStore({
    reducer: {
      popup: popupReducer,
    auth: authReducer,
    process: processReducer
    }
  })
}

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']