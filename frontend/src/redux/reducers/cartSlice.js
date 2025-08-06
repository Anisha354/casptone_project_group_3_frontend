import { createSlice } from "@reduxjs/toolkit";

const slice = createSlice({
  name: "cart",
  initialState: [],

  reducers: {
    loadCart(_state, { payload }) {
      return payload;
    },

    clearCart() {
      return [];
    },
  },
});

export const { loadCart, clearCart } = slice.actions;
export default slice.reducer;
