import actions from './actions';

export default function labelsReducer(state = [], action) {
  switch (action.type) {
    case actions.GET_LABELS_FULFILLED:
      return action.payload.data;
    default:
      return state;
  }
}
