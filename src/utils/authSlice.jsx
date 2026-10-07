import { createSlice } from "@reduxjs/toolkit";

export const AUTH_STATUS = {
  INITIALIZING: "INITIALIZING",
  AUTHENTICATED: "AUTHENTICATED",
  UNAUTHENTICATED: "UNAUTHENTICATED",
};

const initialState = {
  status: AUTH_STATUS.INITIALIZING,
  isAuthInitialized: false,
  isAuthLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthInitializing: (state) => {
      state.status = AUTH_STATUS.INITIALIZING;
      state.isAuthInitialized = false;
      state.isAuthLoading = true;
    },
    setAuthenticated: (state) => {
      state.status = AUTH_STATUS.AUTHENTICATED;
      state.isAuthInitialized = true;
      state.isAuthLoading = false;
    },
    setUnauthenticated: (state) => {
      state.status = AUTH_STATUS.UNAUTHENTICATED;
      state.isAuthInitialized = true;
      state.isAuthLoading = false;
    },
  },
});

export const { setAuthInitializing, setAuthenticated, setUnauthenticated } =
  authSlice.actions;
export default authSlice.reducer;
