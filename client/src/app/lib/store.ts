import { configureStore } from '@reduxjs/toolkit'
import authreducer from './slices/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth:authreducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']