import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./slices/userSlice";
import snackSlice from "./slices/snackSlice";
import reloadSlice from "./slices/reloadSlice";
import balanceSlice from "./slices/balanceSlice";
import currencySlice from "./slices/currencySlice";
import levelSlice from "./slices/levelSlice";
import avatarSlice from "./slices/avatarSlice";

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
    snackbar: snackSlice.reducer,
    reload: reloadSlice.reducer,
    balances: balanceSlice.reducer,
    currency: currencySlice.reducer,
    levels: levelSlice.reducer,
    avatar: avatarSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
