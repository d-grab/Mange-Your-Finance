import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SnackType {
  toggle: boolean;
  msg: string;
}

const initialState: SnackType = {
  toggle: false,
  msg: "",
};

export const snackSlice = createSlice({
  name: "snackbar",
  initialState,
  reducers: {
    reset: (state) => {
      state = initialState;
    },
    set: (state, action: PayloadAction<SnackType>) => {
      state.msg = action.payload.msg;
      state.toggle = action.payload.toggle;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reset, set } = snackSlice.actions;

export default snackSlice;
