import actions from './actions';
import { deleteById, replaceById } from "../../helpers";

const initialState = {
  all: [],
  bookmarked: null,
  activeEntry: null,
  filters: {
    searchQuery: "",
  },
  filtered: [],
  loading: true
}

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case action.GET_ENTRIES_PENDING:
    case action.GET_BOOKMARKED_ENTRIES_PENDING:
    case actions.CREATE_ENTRY_PENDING:
    case actions.EDIT_ENTRY_PENDING:
    case actions.ASSIGN_LABEL_TO_PARAGRAPHS_PENDING:
    case actions.REMOVE_LABEL_FROM_PARAGRAPH_PENDING:
    case actions.TOGGLE_ENTRY_BOOKMARK_PENDING:
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
    case actions.GET_BOOKMARKED_ENTRIES_FULFILLED:
      return {
        ...state,
        bookmarked: action.payload.data,
        loading: false
      }
    case actions.GET_ENTRY_FULFILLED:
      return {
        ...state,
        activeEntry: action.payload.data,
      }
    case actions.ENTRY_OPERATION_FAILED:
      return {
        ...state,
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
        activeEntry: action.data,
        loading: false
      }
    case actions.ASSIGN_LABEL_TO_PARAGRAPHS_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        activeEntry: action.data,
        loading: false
      }
    case actions.REMOVE_LABEL_FROM_PARAGRAPH_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        activeEntry: action.data,
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
        all: deleteById(state.all, action.entryId),
        activeEntry: null,
        loading: false
      }
    case actions.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.filters,
        }
      }
    case actions.FILTER_ENTRIES_FULFILLED:
      return {
        ...state,
        filtered: action.data
      }
    case actions.TOGGLE_ENTRY_BOOKMARK_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.data),
        activeEntry: action.data,
        loading: false
      }
    default:
      return state;
  }
}
