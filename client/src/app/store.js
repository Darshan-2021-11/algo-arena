'use client'
import { configureStore } from '@reduxjs/toolkit'
import problemReducer from './Problems/[id]/problemslice'

export default configureStore({
  reducer: {
    problem:problemReducer
  }
})