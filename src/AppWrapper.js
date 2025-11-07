import React, { useCallback, useEffect, useMemo } from 'react';
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "./redux/selectors";
import appActions from "./redux/app/actions";
// routing
import { BrowserRouter, Route, useLocation } from "react-router-dom";
import { Navigate, Routes } from "react-router";
// components
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Login from "./Login";
import App from "./App";
import CssBaseline from "@mui/material/CssBaseline";
// providers
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ConfirmProvider } from "material-ui-confirm";
import { LocalizationProvider } from "@mui/lab";
import AdapterLuxon from "@mui/lab/AdapterLuxon";

export const ColorModeContext = React.createContext({
  toggleColorMode: () => {
  }
});

const RequireAuth = ({ children }) => {
  const user = useSelector(selectors.extractUser);
  let location = useLocation();

  if (!user)
    return <Navigate to="/login" state={{ from: location }} replace />;

  return children;
}

const getInitialModeBasedOnOS = () => {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? "dark" : "light"
}

const AppWrapper = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectors.extractNotification);
  const [mode, setMode] = React.useState(getInitialModeBasedOnOS());

  useEffect(() => {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      setMode(event.explicitOriginalTarget.matches ? "dark" : "light")
    });
  }, []);

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      setMode((prevMode) => {
        return prevMode === 'light' ? 'dark' : 'light';
      });
    },
  }), []);

  const theme = React.useMemo(() => {
    let background;
    if (mode === 'light')
      background = {
        default: '#f6f8fa',
        paper: '#ffffff',
      }
    else {
      // GitHub Dark Dimmed style
      background = {
        default: '#1c2128',
        paper: '#22272e',
      }
      // MUI website dark mode style
      // background = {
      //   default: '#0A1929',
      //   paper: '#001E3C',
      // }
    }

    return createTheme({
      palette: {
        mode,
        primary: {
          main: '#3f51b5'
        },
        secondary: {
          main: '#edf2ff'
        },
        background
      }
    })
  }, [mode]);

  useEffect(async () => {
    // If there is a refresh token in the local storage, attempt to log in with it
    const refreshToken = localStorage.getItem('refresh_token');

    if (refreshToken)
      dispatch(appActions.loginWithRefreshToken(refreshToken));
  }, [])

  const closeNotification = useCallback(() => {
    dispatch(appActions.closeNotification());
  }, [])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon} locale="en">
          <ConfirmProvider defaultOptions={{
            confirmationButtonProps: { autoFocus: true }
          }}>
            <CssBaseline />

            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route
                  path="*"
                  element={
                    <RequireAuth>
                      <App />
                    </RequireAuth>
                  }
                />
              </Routes>
            </BrowserRouter>

            <Snackbar
              open={notification.open}
              autoHideDuration={4000}
              onClose={closeNotification}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            >
              <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: '100%' }}>
                {notification.message}
              </Alert>
            </Snackbar>
          </ConfirmProvider>
        </LocalizationProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  )
}

export default AppWrapper;