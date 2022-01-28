import { combineReducers } from "redux";
import labelsReducer from "./labels/reducer";
import entriesReducer from "./entries/reducer";
import appReducer from "./app/reducer";

const createRootReducer = combineReducers({
  labels: labelsReducer,
  entries: entriesReducer,
  app: appReducer,
});

export default createRootReducer;