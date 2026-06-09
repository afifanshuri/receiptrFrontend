import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    id: null,
    profile: {
      firstName: null,
      lastName: null,
      email: null,
      role: null,
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
      state.profile.role = action.payload.role;
    },
    setUserAuthenticated: (state, action) => {
      state.isAuthenticated = true;
      state.accessToken = action.payload;
    },
    setUserNotAuthenticated: (state) => {
      state.isAuthenticated = false;
      state.accessToken = null;
    },
    resetUser: (state) => {
      state.id = null;
      state.profile.firstName = null;
      state.profile.lastName = null;
      state.profile.email = null;
      state.accessToken = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.isFirstLogin = false;
      state.profile.role = null;
    },
  },
});

export const {
  setUser,
  setAccessToken,
  resetUser,
  setUserAuthenticated,
  setUserNotAuthenticated,
} = userSlice.actions;

export default userSlice.reducer;
