import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import { all, fork } from 'redux-saga/effects';
import type { SagaIterator } from 'redux-saga';

// Import reducers
import authReducer from './slices/authSlice';
import categoryReducer from './slices/categorySlice';
import authorReducer from './slices/authorSlice';
// Import sagas
import { authSaga } from './sagas/authSaga';
import { categorySaga } from './sagas/categorySaga';
import { authorSaga } from './sagas/authorSaga';    
// Create saga middleware
const sagaMiddleware = createSagaMiddleware();

// Root saga
function* rootSaga(): SagaIterator {
  yield all([
    fork(authSaga),
    fork(categorySaga),
    fork(authorSaga),
  ]);
}

// Configure store
export const store = configureStore({
  reducer: {
    auth: authReducer,
    category: categoryReducer,
    author: authorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(sagaMiddleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Run saga middleware
sagaMiddleware.run(rootSaga);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 