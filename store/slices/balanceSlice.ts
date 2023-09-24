import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Balances {
  incomeBalance: number;
  outcomeBalance: number;
  currentBalance: number;
}

const initialState: Balances = {
  incomeBalance: 0,
  outcomeBalance: 0,
  currentBalance: 0,
};

export const balanceSlice = createSlice({
  name: "balances",
  initialState,
  reducers: {
    resetBalances: (state) => {
      state = initialState;
    },
    setBalances: (state, action: PayloadAction<Balances>) => {
      state.incomeBalance = action.payload.incomeBalance;
      state.outcomeBalance = action.payload.outcomeBalance;
      state.currentBalance = action.payload.currentBalance;
    },
  },
});

export const { resetBalances, setBalances } = balanceSlice.actions;

export default balanceSlice;
