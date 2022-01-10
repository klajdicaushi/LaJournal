import { all, call, fork, put, takeEvery } from 'redux-saga/effects';
import axiosInstance from "../../axios";
import entryActions from "./actions";
import appActions from "../app/actions";
import { push } from "connected-react-router";

function* createEntry() {
  yield takeEvery(entryActions.CREATE_ENTRY, function* (action) {
    try {
      yield put({type: entryActions.CREATE_ENTRY_PENDING});
      const response = yield call(axiosInstance.post, `/entries`, action.newEntryData);
      yield put({type: entryActions.CREATE_ENTRY_FULFILLED, data: response.data});

      const newEntryId = response.data.id;

      yield put(push(`/entries/${newEntryId}`));
      yield put(appActions.showSuccessNotification("Entry created successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e)
      yield put(appActions.showErrorNotification());
    }
  })
}

function* editEntry() {
  yield takeEvery(entryActions.EDIT_ENTRY, function* (action) {
    try {
      const entryId = action.entryId;
      yield put({type: entryActions.EDIT_ENTRY_PENDING});
      const response = yield call(axiosInstance.put, `/entries/${entryId}`, action.editedEntryData);
      yield put({type: entryActions.EDIT_ENTRY_FULFILLED, data: response.data});

      yield put(push(`/entries/${entryId}`));
      yield put(appActions.showSuccessNotification("Entry updated successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e)
      yield put(appActions.showErrorNotification());
    }
  })
}

function* assignLabelsToParagraph() {
  yield takeEvery(entryActions.ASSIGN_LABEL_TO_PARAGRAPHS, function* (action) {
    try {
      yield put({type: entryActions.ASSIGN_LABEL_TO_PARAGRAPHS_PENDING});
      const {entryId, paragraphOrders, label} = action;
      const response = yield call(axiosInstance.post, `/entries/${entryId}/assign_labels`, {
        paragraph_orders: paragraphOrders,
        label
      });
      yield put({type: entryActions.ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED, data: response.data});

      yield put(appActions.showSuccessNotification("Labels assigned successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e)
      yield put(appActions.showErrorNotification());
    }
  })
}

function* deleteEntry() {
  yield takeEvery(entryActions.DELETE_ENTRY, function* (action) {
    try {
      const entryId = action.entryId;
      yield put({type: entryActions.DELETE_ENTRY_PENDING});
      yield call(axiosInstance.delete, `/entries/${entryId}`);
      yield put({type: entryActions.DELETE_ENTRY_FULFILLED, entryId});
      yield put(push(`/entries`));
      yield put(appActions.showSuccessNotification("Entry deleted successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e);
      yield put(appActions.showErrorNotification())
    }
  })
}

export default function* () {
  yield all([
    fork(createEntry),
    fork(editEntry),
    fork(assignLabelsToParagraph),
    fork(deleteEntry),
  ]);
}