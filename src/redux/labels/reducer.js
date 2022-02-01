import actions from './actions';
import { replaceById, deleteById } from "../../helpers";

const initialState = {
  all: [],
  loading: true,
  creatingNewLabel: false,
  deletingLabel: false,
  labelToShowParagraphs: null,
}

export default function labelsReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_LABELS_FULFILLED:
      return {
        ...state,
        loading: false,
        all: action.payload.data
      }
    case actions.CREATE_NEW_LABEL_PENDING:
      return {
        ...state,
        creatingNewLabel: true
      }
    case actions.CREATE_NEW_LABEL_FULFILLED:
      return {
        ...state,
        all: [action.payload.data, ...state.all],
        creatingNewLabel: false
      }
    case actions.EDIT_LABEL_FULFILLED:
      return {
        ...state,
        all: replaceById(state.all, action.payload.data)
      }
    case actions.DELETE_LABEL_PENDING:
      return {
        ...state,
        deletingLabel: true
      }
    case actions.DELETE_LABEL_FULFILLED:
      return {
        ...state,
        deletingLabel: false,
        all: deleteById(state.all, action.labelId)
      }
    case actions.SET_LABEL_TO_SHOW_PARAGRAPHS:
      return {
        ...state,
        labelToShowParagraphs: action.labelId
      }
    default:
      return state;
  }
}
