import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/user.type';

interface AuthState {
  user: any | null;
  token: string | null;
  isLoading: boolean;
  message: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  message: null,
  isAuthenticated: !!localStorage.getItem('token'),
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Initialize auth
    initializeAuth: (state) => {
      state.isLoading = true;
    },

    // Set user
    setUser: (state, action) => {
      state.isLoading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
      state.message = null;
    },
    // Login actions
    loginRequest: (state, action: PayloadAction<{ email: string; password: string }>) => {
      console.log(action.payload);
      state.isLoading = true;
      state.message = null;
    },
    loginSuccess: (state, action: PayloadAction<{ user: User; token: string }>) => {
      state.isLoading = false;
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.message = null;
    },
    loginFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
      state.isAuthenticated = false;
    },

    // Register actions
    registerRequest: (state, action: PayloadAction<{ email: string; name: string; password: string }>) => {
      state.message = null;
      state.isLoading = true;
    },
    registerSuccess: (state) => {
      state.isLoading = false;
      state.message = null;
    },
    registerFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
      state.message = action.payload;
    },


    // Logout action
    logoutRequest: (state) => {
      state.isLoading = true;
      state.message = null;
    },
    logoutSuccess: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.message = null;
      localStorage.removeItem('token');
    },
    logoutFailure: (state, action: PayloadAction<string>) => {
      state.isLoading = false;
          state.message = action.payload;
    },
    // Clear error
    clearMessage: (state) => {
      state.message = null;
    },
  },
});

export const {
  loginRequest,
  loginSuccess,
  loginFailure,
  registerRequest,
  registerSuccess,
  registerFailure,
  logoutRequest,
  logoutSuccess,
  logoutFailure,
  clearMessage,
  initializeAuth,
  setUser,
} = authSlice.actions;

export default authSlice.reducer; 