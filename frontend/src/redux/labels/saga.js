import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance from "../../axios";
import labelActions from "./actions";
import appActions from "../app/actions";

function* deleteLabel() {
  yield takeEvery(labelActions.DELETE_LABEL, function* (action) {
    try {
      yield put({type: labelActions.DELETE_LABEL_PENDING});
      yield call(axiosInstance.delete, `/labels/${action.labelId}`);
      yield put({type: labelActions.DELETE_LABEL_FULFILLED, labelId: action.labelId});
    } catch (e) {
      console.log("ERROR HAPPENED", e);
      yield put(appActions.showErrorNotification())
    }
  })
}

export default function* () {
  yield all([
    fork(deleteLabel),
  ]);
}
