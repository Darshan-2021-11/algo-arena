import { configureStore } from '@reduxjs/toolkit'
import authreducer from './slices/authSlice';
import contestreducer from './slices/contestSlice';
import popupreducer from './slices/popupSlice';

export const store = configureStore({
  reducer: {
    auth: authreducer,
    contest: contestreducer,
    popup: popupreducer
  }
});

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch