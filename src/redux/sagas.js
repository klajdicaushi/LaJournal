import { all } from 'redux-saga/effects';
import labelSagas from './labels/saga';

export default function* rootSaga() {
  yield all([
    labelSagas(),
  ]);
}
