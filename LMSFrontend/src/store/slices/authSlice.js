import { createSlice } from "@reduxjs/toolkit";

let initialState = {
  user: null, // Stores user details
  isAuthenticated: false, // Boolean for authentication status
  role: null, // Stores user role (e.g., 'admin', 'employee', etc.)
};

if (localStorage.getItem("user")) {
  const user = JSON.parse(localStorage.getItem("user"));
  initialState = {
    ...initialState,
    user,
    isAuthenticated: true,
    role: user.role,
  };
}

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
      const { user, role } = action.payload;
      state.user = user;
      state.isAuthenticated = true;
      state.role = role;
    },
    logout: (state) => {
      state.user = "";
      state.isAuthenticated = false;
      state.role = "";
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
