//cấu hình Redux Store
import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { activeUserReducer } from './user/userSlice'

export const store = configureStore({
  reducer: {
    activeBoard: activeBoardReducer,
    user: activeUserReducer
  }
})
