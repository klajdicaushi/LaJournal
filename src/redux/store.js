import { applyMiddleware, compose, createStore } from "redux";
import promise from 'redux-promise-middleware';
import createSagaMiddleware from 'redux-saga';
import rootSaga from "./sagas";
import createRootReducer from "./reducers";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  createRootReducer,
  composeEnhancers(applyMiddleware(
    promise,
    sagaMiddleware
  ))
);

sagaMiddleware.run(rootSaga);

export default store;