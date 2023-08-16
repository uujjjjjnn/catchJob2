import { configureStore, createSlice, getDefaultMiddleware } from "@reduxjs/toolkit";
import { apiSlice } from "./api";
import loginReducer from "./login";
// import userReducer from "./login";

const loadingSlice = createSlice({
  name: "loading",
  initialState: {
    isLoading: true,
  },
  reducers: {
    startLoading: (state) => {
      state.isLoading = true;
    },
    stopLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export const { startLoading, stopLoading } = loadingSlice.actions;

const store = configureStore({
  reducer: {
    loading: loadingSlice.reducer,
    // user: userReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    login: loginReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(apiSlice.middleware),
  devTools: true,
});

export default store;
