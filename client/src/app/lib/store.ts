import { configureStore } from '@reduxjs/toolkit'
import authreducer from './slices/authSlice';
import contestreducer from './slices/contestSlice';
import popupreducer from './slices/popupSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth:authreducer,
      contest:contestreducer,
      popup:popupreducer
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']