import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import { setAccessTokenGetter } from "../api/client";
import authReducer from "./slices/authSlice";
import projectsReducer from "./slices/projectsSlice";
import tasksReducer from "./slices/tasksSlice";
import themeReducer from "./slices/themeSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  projects: projectsReducer,
  tasks: tasksReducer,
  theme: themeReducer
});

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "theme"]
};

export const store = configureStore({
  reducer: persistReducer(persistConfig, rootReducer),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"]
      }
    })
});

export const persistor = persistStore(store);
setAccessTokenGetter(() => store.getState().auth.token);

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
