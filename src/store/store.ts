import { userSlice } from './reducer/userSlice'
import { configureStore } from '@reduxjs/toolkit'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './sagas/rootSaga';
import { authSlice } from './reducer/authSlice';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    user: userSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => 
    getDefaultMiddleware({ 
      thunk: true,
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'auth/refreshTokenStart'] 
      }
    }).concat(sagaMiddleware)
})

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch