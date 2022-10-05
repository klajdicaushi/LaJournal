import { all } from 'redux-saga/effects';
import appSagas from './app/saga';
import labelSagas from './labels/saga';
import entrySagas from './entries/saga';

export default function* rootSaga() {
  yield all([
    appSagas(),
    labelSagas(),
    entrySagas(),
  ]);
}
