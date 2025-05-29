import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {},
  reducers: {
    login: (state, action) => ({ ...action.payload }),
    logout: (state, action) => (state = ""),
    roleHandler: (state, action) => ({ ...action.payload })
  }
});

export const { login, logout, roleHandler } = authSlice.actions;

export default authSlice.reducer;
