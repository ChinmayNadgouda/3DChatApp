import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import roomReducer from "./roomSlice";

// Set up persist configuration
const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, roomReducer);

export const store = configureStore({
  reducer: {
    room: persistedReducer,
  },
});

// Create a persistor
export const persistor = persistStore(store);
