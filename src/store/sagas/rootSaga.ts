// store/sagas/rootSaga.ts
import { all } from 'redux-saga/effects'
import { 
  watchRefreshToken, 
  watchVerifyToken, 
  watchAuthError,
  watchPeriodicVerification 
} from './tokenSagas'

export function* rootSaga() {
  yield all([
    watchRefreshToken(),
    watchVerifyToken(),
    watchAuthError(),
    watchPeriodicVerification(),
  ])
}