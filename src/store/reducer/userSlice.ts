
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ApiService from "../../ApiService/ApiService"
import * as types from '../../Types/index'

interface UserState {
  fullName: string 
  email: string 
  password: string 
}

interface initialStates extends types.CommonTypes, UserState {};

const initialState: initialStates = {
  fullName: "", 
  email: "",    
  password: "",
  isLoading: false,
  errorMessage: null,
  successMessage: null
} 

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (formData: { fullName: string; email: string; password: string }) => {
    const response = await ApiService.getInstance().post('/api/auth/register', formData)
    return response
  }
)

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setFullName: (state, action: PayloadAction<string>) => {
      state.fullName = action.payload
    },
    setEmail: (state, action: PayloadAction<string>) => {
      state.email = action.payload
    },
    setPassword: (state, action: PayloadAction<string>) => {
      state.password = action.payload
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.errorMessage = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.isLoading = true
        state.errorMessage = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.isLoading = false
        state.fullName = "" 
        state.email = ""
        state.password = ""
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.isLoading = false
        state.errorMessage = action.error.message || 'Registration failed'
      })
  }
})

export const { setFullName, setEmail, setPassword, setIsLoading , setError} = userSlice.actions
export default userSlice.reducer