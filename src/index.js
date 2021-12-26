import * as React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import * as serviceWorker from './serviceWorker';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import AdapterLuxon from '@mui/lab/AdapterLuxon';

import { Provider } from 'react-redux';
import { ConnectedRouter } from "connected-react-router";
import store, { history } from './redux/store';
import { ConfirmProvider } from 'material-ui-confirm';

ReactDOM.render(
  <React.Fragment>
    {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    <CssBaseline/>
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <LocalizationProvider dateAdapter={AdapterLuxon} locale="en">
          <ConfirmProvider defaultOptions={{confirmationButtonProps: {autoFocus: true}}}>
            <App/>
          </ConfirmProvider>
        </LocalizationProvider>
      </ConnectedRouter>
    </Provider>
  </React.Fragment>,
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
