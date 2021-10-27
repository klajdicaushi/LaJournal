import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import promise from 'redux-promise-middleware';

import labelsReducer from "./labels/reducer";

const rootReducer = combineReducers({
  labels: labelsReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(promise))
);

export default store;