import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import favoritesReducer from "./reducers/favoritesSlice";
import userReducer from "./reducers/userSlice";
import snackbarReducer from "./reducers/snackbarSlice";
import cartReducer from "./reducers/cartSlice";

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};

const rootReducer = combineReducers({
  user: userReducer, // User reducer
  snackbar: snackbarReducer, // Snackbar messages reducer
  cart: cartReducer, // Shopping cart reducer
  favorites: favoritesReducer, // Favorites reducer added here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoreActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
