// store/sagas/tokenSagas.ts
import { call, put, takeEvery, takeLatest, delay, race, take, select } from 'redux-saga/effects'
import { 
  refreshTokenStart, 
  refreshTokenSuccess, 
  refreshTokenFailure,
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFailure,
  logout
} from '../reducer/authSlice'
import ApiService from '../../ApiService/ApiService'
import type { RootState } from '../store'

/**
 * Worker Saga: Refresh access token using refresh token
 */
function* refreshTokenSaga(): Generator<any, void, any> {
  try {
    const refreshToken = localStorage.getItem('refreshToken')
    
    if (!refreshToken) {
      yield put(refreshTokenFailure('No refresh token available'))
      return
    }

    // Make refresh token API call
    const response = yield call(
      ApiService.getInstance().post,
      `${import.meta.env.VITE_API_BASE_URL}/auth/refresh`,
      { refreshToken }
    )

    const { accessToken, refreshToken: newRefreshToken } = response.data

    // Update localStorage
    localStorage.setItem('accessToken', accessToken)
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken)
    }

    // Update Redux state
    yield put(refreshTokenSuccess({ 
      accessToken, 
      refreshToken: newRefreshToken 
    }))

    console.log('Token refreshed successfully')

  } catch (error: any) {
    console.error('Token refresh failed:', error)
    
    // Clear tokens on failure
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    
    yield put(refreshTokenFailure(
      error.response?.data?.message || 'Token refresh failed'
    ))
    
    // Auto-logout on refresh failure
    yield put(logout())
  }
}

/**
 * Worker Saga: Verify token validity
 */
function* verifyTokenSaga(): Generator<any, void, any> {
  try {
    const token = localStorage.getItem('accessToken')
    
    if (!token) {
      yield put(verifyTokenFailure('No token available'))
      return
    }

    // Verify token with backend
    const response = yield call(
      ApiService.getInstance().get,
      `${import.meta.env.VITE_API_BASE_URL}/auth/verify`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )

    if (response.data.valid) {
      yield put(verifyTokenSuccess())
    } else {
      yield put(verifyTokenFailure('Token is invalid'))
    }

  } catch (error: any) {
    yield put(verifyTokenFailure(
      error.response?.data?.message || 'Token verification failed'
    ))
  }
}

/**
 * Worker Saga: Handle 401 errors and auto-refresh
 * This replaces your axios interceptor logic
 */
function* handleAuthErrorSaga(action: any): Generator<any, void, any> {
  const { error, originalRequest } = action.payload

  try {
    // Start token refresh
    yield put(refreshTokenStart())
    
    // Wait for refresh to complete with timeout
    const { refreshSuccess, refreshFailure, timeout } = yield race({
      refreshSuccess: take('auth/refreshTokenSuccess'),
      refreshFailure: take('auth/refreshTokenFailure'),
      timeout: delay(10000) // 10 second timeout
    })

    if (refreshSuccess) {
      // Retry original request with new token
      const token = localStorage.getItem('accessToken')
      if (token && originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${token}`
      }
      
      // You might want to retry the original API call here
      console.log('Token refreshed, retrying request...')
      
    } else if (refreshFailure || timeout) {
      console.error('Token refresh failed or timed out')
      yield put(logout())
    }

  } catch (error) {
    console.error('Auth error handling failed:', error)
    yield put(logout())
  }
}

/**
 * Worker Saga: Periodic token verification
 */
function* periodicTokenVerificationSaga(): Generator<any, void, any> {
  while (true) {
    yield delay(5 * 60 * 1000) 
    const isAuthenticated = yield select((state: RootState) => state.auth.isAuthenticated)
    if (isAuthenticated) {
      yield put(verifyTokenStart())
    }
  }
}

// Watcher Sagas
export function* watchRefreshToken() {
  yield takeEvery('auth/refreshTokenStart', refreshTokenSaga)
}

export function* watchVerifyToken() {
  yield takeEvery('auth/verifyTokenStart', verifyTokenSaga)
}

export function* watchAuthError() {
  yield takeEvery('API_AUTH_ERROR', handleAuthErrorSaga)
}

export function* watchPeriodicVerification() {
  yield takeEvery('auth/periodicVerificationStart', periodicTokenVerificationSaga)
}