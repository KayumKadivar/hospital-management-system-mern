import { createSlice } from "@reduxjs/toolkit";

const dashboardAuthSlice = createSlice({
  name: 'dashboardAuth',
  initialState: {
    isAuthenticated: false,
    loading: false,
    error: null,
    admin: null
  },
  reducers: {
    loginstart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.admin = action.payload;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
    },
    logout(state) {
      state.isAuthenticated = false;
      state.admin = null;
    }
  }
})


export const { loginstart, loginSuccess, loginFailure, logout } = dashboardAuthSlice.actions;

export default dashboardAuthSlice.reducer;