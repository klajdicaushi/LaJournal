import { all, call, fork, put, takeEvery, takeLatest, select } from 'redux-saga/effects';
import axiosInstance from "../../axios";
import entryActions from "./actions";
import appActions from "../app/actions";
import selectors from "../selectors";
import queryString from "query-string";

function* processError(error) {
  console.log("ERROR HAPPENED", error);
  if (error.toJSON().message === "Network Error")
    yield put(appActions.showErrorNotification("Network Error! Please verify your connection and try again."));
  else
    yield put(appActions.showErrorNotification());

  yield put({type: entryActions.ENTRY_OPERATION_FAILED});
}

function* createEntry() {
  yield takeEvery(entryActions.CREATE_ENTRY, function* (action) {
    try {
      yield put({type: entryActions.CREATE_ENTRY_PENDING});
      const response = yield call(axiosInstance.post, `/entries`, action.newEntryData);
      yield put({type: entryActions.CREATE_ENTRY_FULFILLED, data: response.data});

      const newEntryId = response.data.id;

      action.navigate(`/entries/${newEntryId}`)
      yield put(appActions.showSuccessNotification("Entry created successfully!"))
    } catch (error) {
      processError(error);
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
    } catch (error) {
      processError(error);
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
      processError(error);
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
    } catch (error) {
      processError(error);
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
      processError(error);
    }
  })
}

function* filterEntries() {
  yield takeLatest(entryActions.SET_FILTERS, function* (action) {
    try {
      const filters = yield select(selectors.extractEntriesFilters);
      const searchQuery = filters.searchQuery;
      if (!searchQuery) {
        yield put({type: entryActions.FILTER_ENTRIES_FULFILLED, data: []});
        return;
      }

      const queryParams = {search_query: searchQuery};
      const response = yield call(axiosInstance.get, `/entries?${queryString.stringify(queryParams)}`);
      yield put({type: entryActions.FILTER_ENTRIES_FULFILLED, data: response.data});
    } catch (e) {
      processError(error);
    }
  })
}

function* toggleEntryBookmark() {
  yield takeEvery(entryActions.TOGGLE_ENTRY_BOOKMARK, function* (action) {
    try {
      const entryId = action.entryId;
      yield put({type: entryActions.TOGGLE_ENTRY_BOOKMARK_PENDING});
      const response = yield call(axiosInstance.post, `/entries/${entryId}/toggle_bookmark`);
      yield put({type: entryActions.TOGGLE_ENTRY_BOOKMARK_FULFILLED, data: response.data});
      const isEntryBookmarked = response.data.is_bookmarked;

      yield put(appActions.showSuccessNotification(
        `Bookmark ${isEntryBookmarked ? "added" : "removed"} successfully!`
      ))
    } catch (e) {
      processError(error);
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
    fork(toggleEntryBookmark),
  ]);
}