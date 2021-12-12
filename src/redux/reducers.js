import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import labelsReducer from "./labels/reducer";
import entriesReducer from "./entries/reducer";

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  labels: labelsReducer,
  entries: entriesReducer,
});

export default createRootReducer;