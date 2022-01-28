import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import * as serviceWorker from './serviceWorker';
import AppWrapper from "./AppWrapper";
// redux
import { Provider } from 'react-redux';
import store from './redux/store';
// other providers
import { ConfirmProvider } from 'material-ui-confirm';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterLuxon from '@mui/lab/AdapterLuxon';

ReactDOM.render(
  <React.Fragment>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline/>
    <Provider store={store}>
      <LocalizationProvider dateAdapter={AdapterLuxon} locale="en">
        <ConfirmProvider defaultOptions={{
          confirmationButtonProps: {autoFocus: true}
        }}>
          <AppWrapper/>
        </ConfirmProvider>
      </LocalizationProvider>
    </Provider>
  </React.Fragment>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
