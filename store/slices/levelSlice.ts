import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Payload {
  level: number;
  target: number;
  title: string;
  current: number;
}

const initialState: Payload = {
  level: 0,
  target: 0,
  title: "",
  current: 0,
};

export const levelSlice = createSlice({
  name: "levels",
  initialState,
  reducers: {
    setLevel: (state, action: PayloadAction<Payload>) => {
      state.current = action.payload.current;
      state.level = action.payload.level;
      state.target = action.payload.target;
      state.title = action.payload.title;
    },
  },
});

export const { setLevel } = levelSlice.actions;

export default levelSlice;
