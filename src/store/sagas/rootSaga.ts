import { all, fork } from 'redux-saga/effects'
import { authRootSaga } from './tokenSagas'

export function* rootSaga() {
  console.log('Root saga starting...');
  yield all([
    fork(authRootSaga)
  ]);
  console.log('All sagas started');
}