import { configureStore } from '@reduxjs/toolkit'
import documentsSlice from './state/documents/documentsSlice'

export const makeStore = () => {
  return configureStore({
    reducer: {
      documents: documentsSlice
    }
  })
}

export type AppStore = ReturnType<typeof makeStore>

export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']