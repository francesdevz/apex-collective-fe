

export interface UserState {
  fullName: string 
  email: string
  password: string 
  loading: boolean
  error: string | null
}

export interface UserActions {
  setFullName: (name: string) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
  fetchUserData: (formData: { fullName: string; email: string; password: string }) => void
  setIsLoading: (isLoading: boolean) => void
  setError: (error: string | null) => void
}

export interface LoginComponentProps extends UserState, UserActions {}