import React, { useCallback, useState } from 'react';
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "./redux/selectors";
import appActions from "./redux/app/actions";
// routing
import { Navigate } from "react-router";
import { useLocation } from "react-router-dom";
// components
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

const Login = () => {
  const user = useSelector(selectors.extractUser);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  let location = useLocation();

  const onUsernameChange = useCallback(event => {
    setUsername(event.target.value);
  }, []);

  const onPasswordChange = useCallback(event => {
    setPassword(event.target.value);
  }, []);

  const onLogin = useCallback(() => {
    dispatch(appActions.login(username, password))
  }, [username, password]);

  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from}/>;
  }

  return (
    <div>
      <TextField
        fullWidth
        label="Username"
        variant="standard"
        value={username}
        onChange={onUsernameChange}
      />
      <TextField
        fullWidth
        label="Password"
        variant="standard"
        value={password}
        onChange={onPasswordChange}
      />

      <Button onClick={onLogin}>
        Login
      </Button>
    </div>
  );
};

export default Login;