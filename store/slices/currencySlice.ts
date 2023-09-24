import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface CurrencyCode {
  code: string;
}

const initialState: CurrencyCode = {
  code: "GBP",
};

export const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency: (state, action: PayloadAction<CurrencyCode>) => {
      state.code = action.payload.code;
    },
  },
});

export const { setCurrency } = currencySlice.actions;

export default currencySlice;
