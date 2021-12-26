import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";
import labelsReducer from "./labels/reducer";
import entriesReducer from "./entries/reducer";
import appReducer from "./app/reducer";

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  labels: labelsReducer,
  entries: entriesReducer,
  app: appReducer,
});

export default createRootReducer;