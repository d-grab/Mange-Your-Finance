import { createSlice } from "@reduxjs/toolkit";

export interface SnackType {
  reload: boolean;
}

const initialState: SnackType = {
  reload: false,
};

export const reloadSlice = createSlice({
  name: "reload",
  initialState,
  reducers: {
    reload: (state) => {
      state.reload = !state.reload;
    },
  },
});

// Action creators are generated for each case reducer function
export const { reload } = reloadSlice.actions;

export default reloadSlice;
