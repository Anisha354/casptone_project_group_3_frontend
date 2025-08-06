import { createSlice } from "@reduxjs/toolkit";

const TOKEN_KEY = "Capstone_grp_3-app-token";

const initialState = {
  currentUser: null,

  token: localStorage.getItem(TOKEN_KEY) || null,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginSuccess: (state, { payload }) => {
      state.currentUser = payload.user;
      state.token = payload.token;
      localStorage.setItem(TOKEN_KEY, payload.token);
    },
    updateUser: (state, { payload }) => {
      state.currentUser = payload.user;
    },
    logout: (state) => {
      state.currentUser = null;
      state.token = null;
      localStorage.removeItem(TOKEN_KEY);
    },
  },
});

export const { loginSuccess, updateUser, logout } = userSlice.actions;
export default userSlice.reducer;
