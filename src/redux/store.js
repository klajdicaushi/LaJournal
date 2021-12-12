import { applyMiddleware, compose, createStore } from "redux";
import promise from 'redux-promise-middleware';
import createSagaMiddleware from 'redux-saga';
import { createBrowserHistory } from 'history'
import rootSaga from "./sagas";
import createRootReducer from "./reducers";
import { routerMiddleware } from "connected-react-router";

const sagaMiddleware = createSagaMiddleware();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export const history = createBrowserHistory();

const store = createStore(
  createRootReducer(history),
  composeEnhancers(applyMiddleware(
    routerMiddleware(history),
    promise,
    sagaMiddleware
  ))
);

sagaMiddleware.run(rootSaga);

export default store;