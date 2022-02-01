import React, { useCallback, useEffect, useMemo } from 'react';
import axiosInstance, { updateAxiosToken } from "./axios";
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

const RequireAuth = ({children}) => {
  const user = useSelector(selectors.extractUser);
  let location = useLocation();

  if (!user)
    return <Navigate to="/login" state={{from: location}} replace/>;

  return children;
}

const AppWrapper = () => {
  const dispatch = useDispatch();
  const notification = useSelector(selectors.extractNotification);
  const [mode, setMode] = React.useState(localStorage.getItem('colorMode') || "light");

  const colorMode = useMemo(() => ({
    toggleColorMode: () => {
      let newMode;
      setMode((prevMode) => {
        newMode = prevMode === 'light' ? 'dark' : 'light';
        return newMode;
      });
      localStorage.setItem('colorMode', newMode);
    },
  }), []);

  const theme = React.useMemo(() => createTheme({
    palette: {mode}
  }), [mode]);

  useEffect(async () => {
    // If there is a token in the local storage, verify if it is valid
    // If yes, login the user
    let token = localStorage.getItem('token');

    if (token) {
      const headers = {'Authorization': 'Bearer ' + token};
      try {
        const response = await axiosInstance.post("/validate-token", {}, {headers})
        updateAxiosToken(token);
        dispatch(appActions.loginSuccessful(response.data, token))
      } catch {
      }
    }
  }, [])

  const closeNotification = useCallback(() => {
    dispatch(appActions.closeNotification());
  }, [])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterLuxon} locale="en">
          <ConfirmProvider defaultOptions={{
            confirmationButtonProps: {autoFocus: true}
          }}>
            <CssBaseline/>

            <BrowserRouter>
              <Routes>
                <Route path="/login" element={<Login/>}/>
                <Route
                  path="*"
                  element={
                    <RequireAuth>
                      <App/>
                    </RequireAuth>
                  }
                />
              </Routes>
            </BrowserRouter>

            <Snackbar
              open={notification.open}
              autoHideDuration={4000}
              onClose={closeNotification}
              anchorOrigin={{vertical: "bottom", horizontal: "right"}}
            >
              <Alert onClose={closeNotification} severity={notification.severity} sx={{width: '100%'}}>
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