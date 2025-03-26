import { AuthInitialState } from "@/types/auth";
import { isJWTExpired } from "@/utils/jwt";
import { createSlice } from "@reduxjs/toolkit";

const initialState: AuthInitialState = {
  isAuthenticated:
    !!localStorage.getItem("auth-token") &&
    !isJWTExpired(localStorage.getItem("auth-token")),
  authToken: localStorage.getItem("auth-token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, actions) => {
      state.isAuthenticated = true;
      state.authToken = actions.payload;
      localStorage.setItem("auth-token", actions.payload);
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.authToken = null;
      localStorage.removeItem("auth-token");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
