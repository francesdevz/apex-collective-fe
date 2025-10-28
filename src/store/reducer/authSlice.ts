import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

interface AuthState {
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
  isRefreshing: boolean
  refreshError: string | null
  user: any | null
}

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
      state.accessToken = action.payload.accessToken
      state.refreshToken = action.payload.refreshToken
      state.isAuthenticated = true
      state.user = action.payload.user || null
    },
    refreshTokenStart: (state) => {
      state.isRefreshing = true
      state.refreshError = null
    },
    refreshTokenSuccess: (state, action: PayloadAction<{
      accessToken: string;
      refreshToken?: string;
    }>) => {
      state.isRefreshing = false
      state.accessToken = action.payload.accessToken
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken
      }
    },
    refreshTokenFailure: (state, action: PayloadAction<string>) => {
      state.isRefreshing = false
      state.refreshError = action.payload
      state.isAuthenticated = false
      state.accessToken = null
      state.refreshToken = null
      state.user = null
    },
    logout: (state) => {
      state.accessToken = null
      state.refreshToken = null
      state.isAuthenticated = false
      state.user = null
      state.refreshError = null
    },
    verifyTokenStart: (state) => {
      state.isRefreshing = true
    },
    verifyTokenSuccess: (state) => {
      state.isRefreshing = false
    },
    verifyTokenFailure: (state, action: PayloadAction<string>) => {
      state.isRefreshing = false
      state.refreshError = action.payload
    }
  }
})

export const { 
  setTokens, 
  refreshTokenStart, 
  refreshTokenSuccess, 
  refreshTokenFailure,
  logout,
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFailure
} = authSlice.actions

export default authSlice.reducer