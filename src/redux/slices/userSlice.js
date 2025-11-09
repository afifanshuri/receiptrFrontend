import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    profile: {
      firstName: null,
      lastName: null,
      email: null,
    },
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
    isFirstLogin: false,
  },
  reducers: {
    setUser: (state, action) => {
      state.id = action.payload.id;
      state.profile.firstName = action.payload.firstName;
      state.profile.lastName = action.payload.lastName;
      state.profile.email = action.payload.email;
    },
    setAccessToken: (state, action) => {
      state.accessToken = action.payload;
    },
    setUserAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
    resetUser: (state) => {
      state.id = null;
      state.profile.firstName = null;
      state.profile.lastName = null;
      state.profile.email = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isFirstLogin = false;
    },
  },
});

export const { setUser, setAccessToken, resetUser, setUserAuthenticated } =
  userSlice.actions;

export default userSlice.reducer;
