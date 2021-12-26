import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance from "../../axios";
import entryActions from "./actions";
import { push } from "connected-react-router";

function* createLabel() {
  yield takeEvery(entryActions.CREATE_ENTRY, function* (action) {
    try {
      yield put({type: entryActions.CREATE_ENTRY_PENDING});
      const response = yield call(axiosInstance.post, `/entries`, action.newEntryData);
      yield put({type: entryActions.CREATE_ENTRY_FULFILLED, data: response.data});

      const newEntryId = response.data.id;

      yield put(push(`/entries/${newEntryId}`));
    } catch (e) {
      console.log("ERROR HAPPENED", e)
    }
  })
}

function* deleteLabel() {
  yield takeEvery(entryActions.DELETE_ENTRY, function* (action) {
    try {
      const entryId = action.entryId;
      yield put({type: entryActions.DELETE_ENTRY_PENDING});
      yield call(axiosInstance.delete, `/entries/${entryId}`);
      yield put({type: entryActions.DELETE_ENTRY_FULFILLED, entryId});
      yield put(push(`/entries`));
    } catch (e) {
      console.log("ERROR HAPPENED", e)
    }
  })
}

export default function*() {
  yield all([
    fork(createLabel),
    fork(deleteLabel),
  ]);
}