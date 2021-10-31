import actions from './actions';

const initialState = {
  all: [],
  loading: true
}

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case action.GET_ENTRIES_PENDING:
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
    default:
      return state;
  }
}
