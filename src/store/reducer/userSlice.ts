
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import ApiService from "../../ApiService/ApiService"

interface UserState {
  fullName: string 
  email: string 
  password: string 
  loading: boolean
  error: string | null
}

const initialState: UserState = {
  fullName: "", 
  email: "",    
  password: "", 
  loading: false,
  error: null
}

export const fetchUserData = createAsyncThunk(
  'user/fetchUserData',
  async (formData: { fullName: string; email: string; password: string }) => {
    const response = await ApiService.getInstance().post('/api/auth/register', formData)
    return response.data
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
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserData.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.loading = false
        state.fullName = "" 
        state.email = ""
        state.password = ""
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Registration failed'
      })
  }
})

export const { setFullName, setEmail, setPassword, setIsLoading , setError} = userSlice.actions
export default userSlice.reducer