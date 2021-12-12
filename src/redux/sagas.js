import { all } from 'redux-saga/effects';
import labelSagas from './labels/saga';
import entrySagas from './entries/saga';

export default function* rootSaga() {
  yield all([
    labelSagas(),
    entrySagas(),
  ]);
}
