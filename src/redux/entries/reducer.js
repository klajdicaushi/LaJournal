import actions from './actions';
import { deleteById, replaceById } from "../../helpers";

const initialState = {
  all: [],
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
    default:
      return state;
  }
}
