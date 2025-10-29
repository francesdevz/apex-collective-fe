import type { PayloadAction } from '@reduxjs/toolkit'
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import ApiService from '../../ApiService/ApiService'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isRefreshing: boolean
  refreshError: string | null
  user: any | null
}

interface VerifyUserCredentials {
  email: string;
  password: string;
}

export const verifyUser = createAsyncThunk("auth/verifyUser", async(credentials: VerifyUserCredentials) => {
  const response = await ApiService.getInstance().post("/auth/login/user", credentials);
  return response;
})

const initialState: AuthState = {
  accessToken: localStorage.getItem('accessToken'),
  refreshToken: localStorage.getItem('refreshToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isRefreshing: false,
  refreshError: null,
  user: null
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<{ 
      accessToken: string; 
      refreshToken: string;
      user?: any 
    }>) => {
      const { accessToken, refreshToken, user } = action.payload;
      
      // Save to localStorage
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Update state
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.user = user || null;
    },
    // Add these actions to trigger sagas
    initializeAuthSagas: (state) => {
      // This action doesn't change state, just triggers sagas
    },
    startPeriodicVerification: (state) => {
      // This action doesn't change state, just triggers sagas
    },
    refreshTokenStart: (state) => {
      state.isRefreshing = true;
      state.refreshError = null;
    },
    refreshTokenSuccess: (state, action: PayloadAction<{
      accessToken: string;
      refreshToken?: string;
    }>) => {
      state.isRefreshing = false;
      state.accessToken = action.payload.accessToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
        localStorage.setItem('refreshToken', action.payload.refreshToken);
      }
      localStorage.setItem('accessToken', action.payload.accessToken);
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.isRefreshing = false;
      state.refreshError = action.payload;
      state.isAuthenticated = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.user = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    logout: (state) => {
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.user = null;
      state.refreshError = null;
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
    verifyTokenStart: (state) => {
      state.isRefreshing = true;
    },
    verifyTokenSuccess: (state) => {
      state.isRefreshing = false;
    },
    verifyTokenFailure: (state, action: PayloadAction<string>) => {
      state.isRefreshing = false;
      state.refreshError = action.payload;
    }
  }
})

export const { 
  setTokens, 
  initializeAuthSagas, 
  startPeriodicVerification,
  refreshTokenStart, 
  refreshTokenSuccess, 
  refreshTokenFailure,
  logout,
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFailure
} = authSlice.actions

export default authSlice.reducer