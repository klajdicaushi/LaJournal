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
import Paper from "@mui/material/Paper";
// other
import styled from "styled-components";
import Typography from "@mui/material/Typography";

const StyledPaper = styled(Paper)`
  padding: 24px;
  height: 255px;
  width: 400px;
  margin: auto;
  position: absolute;
  top:0;
  bottom: 0;
  left: 0;
  right: 0;
`;

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

  const onKeyPress = useCallback(event => {
    if (event.key === "Enter")
      onLogin();
  }, [onLogin])

  if (user) {
    const from = location.state?.from?.pathname || "/";
    return <Navigate to={from}/>;
  }

  return (
    <StyledPaper elevation={10}>
      <Typography align="center" paragraph>LaJournal</Typography>
      <TextField
        autoFocus
        fullWidth
        label="Username"
        variant="standard"
        value={username}
        onChange={onUsernameChange}
        onKeyPress={onKeyPress}
      />
      <TextField
        fullWidth
        sx={{marginTop: 2}}
        label="Password"
        variant="standard"
        type="password"
        value={password}
        onChange={onPasswordChange}
        onKeyPress={onKeyPress}
      />

      <Button onClick={onLogin} fullWidth sx={{marginTop: 2}} variant="contained">
        Login
      </Button>
    </StyledPaper>
  );
};

export default Login;