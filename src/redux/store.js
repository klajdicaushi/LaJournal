import { applyMiddleware, combineReducers, compose, createStore } from "redux";
import promise from 'redux-promise-middleware';
import createSagaMiddleware from 'redux-saga';

import labelsReducer from "./labels/reducer";
import rootSaga from "./sagas";

const sagaMiddleware = createSagaMiddleware();

const rootReducer = combineReducers({
  labels: labelsReducer
});

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  rootReducer,
  composeEnhancers(applyMiddleware(promise, sagaMiddleware))
);

sagaMiddleware.run(rootSaga);

export default store;