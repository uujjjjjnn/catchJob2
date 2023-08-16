import { createSlice } from "@reduxjs/toolkit";

const initialState = { name: "", email: "", token: null, isLoggedIn: false };

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      // state.name = action.payload.name;
      // state.email = action.payload.email;
      // state.token = action.payload.accessToken;
      // state.isLoggedIn = true;
    },
    setTokenFromLocalStorage: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.token = action.payload.token;
      state.isLoggedIn = true;
      // state.userLoggedOut = false;
    },
    logOut: (state, action) => {
      state.name = null;
      state.token = null;
      state.email = null;
      state.isLoggedIn = false;
      // state.userLoggedOut = true;
    },
  },
});

export const { setCredentials, setTokenFromLocalStorage, logOut } = loginSlice.actions;

export default loginSlice.reducer;

export const selectName = (state) => state.login.name;
export const selectEmail = (state) => state.login.email;
export const selectCurrentToken = (state) => state.login.token;
export const selectLoggedIn = (state) => state.login.isLoggedIn;
export const selectUserLoggedOut = (state) => state.login.userLoggedOut;
