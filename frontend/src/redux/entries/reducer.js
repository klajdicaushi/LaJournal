import actions from './actions';
import { deleteById, replaceById } from "../../helpers";

const initialState = {
  all: [],
  selectedLabelIds: [],
  filtered: [],
  loading: true
}

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case action.GET_ENTRIES_PENDING:
    case actions.CREATE_ENTRY_PENDING:
    case actions.EDIT_ENTRY_PENDING:
    case actions.ASSIGN_LABEL_TO_PARAGRAPHS_PENDING:
    case actions.REMOVE_LABEL_FROM_PARAGRAPH_PENDING:
      return {
        ...state,
        loading: true
      }
    case actions.GET_ENTRIES_FULFILLED:
      return {
        ...state,
        all: action.payload.data,
        loading: false
      }
    case actions.CREATE_ENTRY_FULFILLED:
      return {
        ...state,
        all: [action.data, ...state.all],
        loading: false
      }
    case actions.EDIT_ENTRY_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        loading: false
      }
    case actions.ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        loading: false
      }
    case actions.REMOVE_LABEL_FROM_PARAGRAPH_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        loading: false
      }
    case actions.DELETE_ENTRY_PENDING:
      return {
        ...state,
        loading: true
      }
    case actions.DELETE_ENTRY_FULFILLED:
      return {
        ...state,
        all: deleteById(state.all, action.entryId)
      }
    case actions.SET_SELECTED_LABEL_IDS:
      return {
        ...state,
        selectedLabelIds: action.selectedLabelIds
      }
    case actions.FILTER_ENTRIES_FULFILLED:
      return {
        ...state,
        filtered: action.data
      }
    default:
      return state;
  }
}
