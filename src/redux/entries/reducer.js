import actions from './actions';

const initialState = {
  all: [],
}

export default function entriesReducer(state = initialState, action) {
  switch (action.type) {
    case actions.GET_ENTRIES_FULFILLED:
      return {
        ...state,
        all: action.payload.data
      }
    default:
      return state;
  }
}
