import { all, call, fork, put, takeEvery, takeLatest } from 'redux-saga/effects';
import axiosInstance from "../../axios";
import entryActions from "./actions";
import appActions from "../app/actions";
import { stringify } from "query-string";

function* createEntry() {
  yield takeEvery(entryActions.CREATE_ENTRY, function* (action) {
    try {
      yield put({type: entryActions.CREATE_ENTRY_PENDING});
      const response = yield call(axiosInstance.post, `/entries`, action.newEntryData);
      yield put({type: entryActions.CREATE_ENTRY_FULFILLED, data: response.data});

      const newEntryId = response.data.id;

      action.navigate(`/entries/${newEntryId}`)
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

      action.navigate(`/entries/${entryId}`);
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
      const {entryId, paragraphOrders, labelId} = action;
      const response = yield call(axiosInstance.post, `/entries/${entryId}/assign_label`, {
        paragraph_orders: paragraphOrders,
        label_id: labelId
      });
      yield put({type: entryActions.ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED, data: response.data});

      yield put(appActions.showSuccessNotification("Labels assigned successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e)
      yield put(appActions.showErrorNotification());
    }
  })
}

function* removeLabelFromParagraph() {
  yield takeEvery(entryActions.REMOVE_LABEL_FROM_PARAGRAPH, function* (action) {
    try {
      yield put({type: entryActions.REMOVE_LABEL_FROM_PARAGRAPH_PENDING});
      const {entryId, paragraphOrder, labelId} = action;
      const response = yield call(axiosInstance.post, `/entries/${entryId}/remove_label`, {
        paragraph_order: paragraphOrder,
        label_id: labelId
      });
      yield put({type: entryActions.REMOVE_LABEL_FROM_PARAGRAPH_FULFILLED, data: response.data});

      yield put(appActions.showSuccessNotification("Label removed successfully!"))
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
      action.navigate(`/entries`);
      yield put(appActions.showSuccessNotification("Entry deleted successfully!"))
    } catch (e) {
      console.log("ERROR HAPPENED", e);
      yield put(appActions.showErrorNotification())
    }
  })
}

function* filterEntries() {
  yield takeLatest(entryActions.SET_SELECTED_LABEL_IDS, function* (action) {
    try {
      const {selectedLabelIds} = action;
      if (selectedLabelIds.length === 0) {
        yield put({type: entryActions.FILTER_ENTRIES_FULFILLED, data: []});
        return;
      }

      const queryParams = {labels: selectedLabelIds};
      const response = yield call(axiosInstance.get, `/entries?${stringify(queryParams)}`);
      yield put({type: entryActions.FILTER_ENTRIES_FULFILLED, data: response.data});
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
    fork(removeLabelFromParagraph),
    fork(deleteEntry),
    fork(filterEntries),
  ]);
}