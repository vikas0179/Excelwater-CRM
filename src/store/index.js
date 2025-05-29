import { combineReducers, configureStore } from "@reduxjs/toolkit";
import rootReducer from "./rootReducer";
// import { apiSlice } from "./api/apiSlice";
import storage from "redux-persist/lib/storage";
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE, persistReducer } from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import authSlice from "./authSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["authSlice"]
};

const combine = combineReducers({ authSlice });

const persistedReducer = persistReducer(persistConfig, combine);

const store = configureStore({
  reducer: {
    ...rootReducer,
    persistedReducer
    // [apiSlice.reducerPath]: apiSlice.reducer
  },
  //devTools: false,
  middleware: (getDefaultMiddleware) => {
    const middleware = [
      ...getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
        }
      })
      // apiSlice.middleware
    ];
    return middleware;
  }
});

const persistor = persistStore(store);

export { store, persistor };
