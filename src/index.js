import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import AppWrapper from "./AppWrapper";
// redux
import { Provider } from 'react-redux';
import store from './redux/store';
import { injectStore } from './axios';

injectStore(store);

ReactDOM.render(
  <React.Fragment>
    <Provider store={store}>
      <AppWrapper/>
    </Provider>
  </React.Fragment>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
