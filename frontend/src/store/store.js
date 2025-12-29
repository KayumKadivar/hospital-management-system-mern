import { configureStore } from "@reduxjs/toolkit";
import dashboardAuthReducer from "./auth/dashboardAuthSlice";
import { apiSlice } from "./services/apiSlice";

const store = configureStore({
  reducer: {
    dashboardAuth: dashboardAuthReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

export default store