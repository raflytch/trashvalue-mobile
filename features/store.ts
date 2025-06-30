import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import registerReducer from "./slices/registerSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    register: registerReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
