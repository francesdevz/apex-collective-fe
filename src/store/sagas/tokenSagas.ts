import { call, put, takeEvery, delay, select, fork, take, race } from 'redux-saga/effects'
import { 
  refreshTokenStart, 
  refreshTokenSuccess, 
  refreshTokenFailure,
  verifyTokenStart,
  verifyTokenSuccess,
  verifyTokenFailure,
  logout,
  startPeriodicVerification
} from '../reducer/authSlice'
import ApiService from '../../ApiService/ApiService'
import type { RootState } from '../store'

/**
 * Worker Saga: Refresh access token using refresh token
 */
function* refreshTokenSaga(): Generator<any, void, any> {
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      yield put(refreshTokenFailure('No refresh token available'));
      return;
    }
    const response = yield call(
      ApiService.getInstance().post,
      '/auth/refresh', 
      { refreshToken }
    );
    const { accessToken, refreshToken: newRefreshToken } = response;
    yield put(refreshTokenSuccess({ 
      accessToken, 
      refreshToken: newRefreshToken 
    }));
  } catch (error: any) {
    console.error('❌ Token refresh failed:', error);
    yield put(refreshTokenFailure(
      error.message || 'Token refresh failed'
    ));
    
    yield put(logout());
  }
}

/**
 * Worker Saga: Verify token validity
 */
function* verifyTokenSaga(): Generator<any, void, any> {
  try {
    const apiService = ApiService.getInstance();
    const token = localStorage.getItem('accessToken');
  
    if (!token) {
      yield put(verifyTokenFailure('No token available'));
      return;
    }
    
    const response = yield call(
      [apiService, apiService.get], 
      '/auth/login/verify',
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    
    if (response.valid) {
      yield put(verifyTokenSuccess());
    } else {
      yield put(verifyTokenFailure('Token is invalid'));
      yield put(logout());
    }

  } catch (error: any) {
    yield put(verifyTokenFailure(
      error.response?.data?.message || error.message || 'Token verification failed'
    ));
    yield put(logout());
  }
}

/**
 * Worker Saga: Periodic token verification
 */
function* periodicTokenVerificationSaga(): Generator<any, void, any> {
  console.log('🔄 Periodic token verification saga STARTED');
  
  let checkCount = 0;
  
  while (true) {
    yield delay(30 * 1000); 
    checkCount++;
    const isAuthenticated = yield select((state: RootState) => state.auth.isAuthenticated);
    if (isAuthenticated) {
      yield put(verifyTokenStart());
    } else {
      break; 
    }
  }
}

/**
 * Worker Saga: Initialize all auth processes
 */
function* initializeAuthSagasSaga(): Generator<any, void, any> {
  try {
    yield put(verifyTokenStart());
    yield put(startPeriodicVerification());
  } catch (error) {
    console.error('❌ Failed to initialize auth processes:', error);
  }
}

/**
 * Worker Saga: Handle 401 errors and auto-refresh
 */
function* handleAuthErrorSaga(action: any): Generator<any, void, any> {
  try {

    // Start token refresh
    yield put(refreshTokenStart());
    
    // Wait for refresh to complete with timeout
    const { refreshSuccess, refreshFailure, timeout } = yield race({
      refreshSuccess: take('auth/refreshTokenSuccess'),
      refreshFailure: take('auth/refreshTokenFailure'),
      timeout: delay(10000) // 10 second timeout
    });

    if (refreshSuccess) {
        // TODO: Retry the original failed request here if needed
    } else if (refreshFailure || timeout) {
      yield put(logout());
    }

  } catch (error) {
    yield put(logout());
  }
}

function* startPeriodicVerificationOnLoad(): Generator<any, void, any> {
  const isAuthenticated = yield select((state: RootState) => state.auth.isAuthenticated);
  console.log('📱 App load - isAuthenticated:', isAuthenticated);
  if (isAuthenticated) {
    console.log('📱 Starting periodic verification on app load');
    yield fork(periodicTokenVerificationSaga);
  }
}

export function* watchRefreshToken() {
  yield takeEvery('auth/refreshTokenStart', refreshTokenSaga);
}

export function* watchVerifyToken() {
  yield takeEvery('auth/verifyTokenStart', verifyTokenSaga);
}

export function* watchAuthError() {
  yield takeEvery('API_AUTH_ERROR', handleAuthErrorSaga);
}

export function* watchInitializeAuthSagas() {
  yield takeEvery('auth/initializeAuthSagas', initializeAuthSagasSaga);
}

export function* watchStartPeriodicVerification() {
  yield takeEvery('auth/startPeriodicVerification', periodicTokenVerificationSaga);
}

export function* authRootSaga() {
  console.log('🔑 Auth root saga started');
  yield fork(startPeriodicVerificationOnLoad);
  yield fork(watchRefreshToken);
  yield fork(watchVerifyToken);
  yield fork(watchAuthError);
  yield fork(watchInitializeAuthSagas);
  yield fork(watchStartPeriodicVerification);
}