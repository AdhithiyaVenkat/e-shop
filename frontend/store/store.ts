import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/authSlice';
import cartReducer from '../features/cartSlice';
import productReducer from '../features/productSlice';

// Redux Persist Configuration
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth', 'cart'], // Persist only authentication and cart slices
};

// Combine Reducers
const rootReducer = combineReducers({
  auth: authReducer,
  cart: cartReducer,
  products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serialization checks for persist
    }),
});

export const persistor = persistStore(store);

// Define types for the store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
