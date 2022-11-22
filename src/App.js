import React, { Suspense, useCallback, useContext, useEffect, useState } from 'react';
// redux
import { useDispatch } from "react-redux";
import labelActions from "./redux/labels/actions";
import entriesActions from "./redux/entries/actions";
import appActions from "./redux/app/actions";
// components
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import DarkModeToggle from "react-dark-mode-toggle";
// icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
// other
import { Navigate, Routes } from "react-router";
import { Link, Route } from "react-router-dom";
import { styled as styledM, useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import routes from "./routes";
import "./index.css";
import { ColorModeContext } from "./AppWrapper";

const drawerWidth = 240;

const Main = styledM('main', {shouldForwardProp: (prop) => prop !== 'open'})(
  ({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const AppBar = styledM(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({theme, open}) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const DrawerHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 8px;
  min-height: 64px;
  justify-content: flex-end;
`;

const Menus = () => {
  const menus = [];

  routes.forEach(route => {
    if (route.label)
      menus.push(
        <ListItem button key={route.path} component={Link} to={route.path}>
          <ListItemIcon>
            {route.icon}
          </ListItemIcon>
          <ListItemText primary={route.label}/>
        </ListItem>
      )
  });

  return <List>{menus}</List>;
};

const AppRoutes = () => (
  <Suspense fallback="Loading...">
    <Routes>
      {routes.map(route => (
        <Route key={route.path} exact path={route.path} element={route.element}/>
      ))}
      <Route path="about" render={() => <Navigate to="/"/>}/>
    </Routes>
  </Suspense>
)

export default function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch()
  const [openDrawer, setOpenDrawer] = useState(true);
  const [optionsAnchor, setOptionsAnchor] = useState(null);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);
  const [newPassword, setNewPassword] = useState({value: "", confirm: ""});

  useEffect(() => {
    dispatch(labelActions.getLabels());
    dispatch(entriesActions.getEntries());
  });

  const toggleDrawerOpen = useCallback(() => {
    setOpenDrawer(prevState => !prevState);
  }, []);

  const handleOptionsClick = useCallback((event) => {
    console.log(event.currentTarget)
    setOptionsAnchor(event.currentTarget);
  }, [])

  const handleCloseOptions = useCallback(() => {
    setOptionsAnchor(null);
  }, []);

  const toggleOpenChangePasswordDialog = useCallback(() => {
    setOpenChangePasswordDialog(prevState => !prevState);
  }, [])

  const handlePasswordChange = useCallback((attr) => (event) => {
    setNewPassword(prevState => ({...prevState, [attr]: event.target.value}));
  }, [])

  const changePassword = useCallback(() => {
    if (newPassword.value !== newPassword.confirm)
      dispatch(appActions.showErrorNotification("Passwords do not match!"));

    dispatch(appActions.changePassword(newPassword.value));
  }, [newPassword]);

  const logOut = useCallback(() => {
    dispatch(appActions.logOut(true));
  }, []);

  const openOptions = Boolean(optionsAnchor);

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar position="fixed" open={openDrawer}>
        <Toolbar>
          <IconButton
            color="inherit"
            onClick={toggleDrawerOpen}
            edge="start"
            sx={{mr: 2, ...(openDrawer && {display: 'none'})}}
          >
            <MenuIcon/>
          </IconButton>

          <Grid container justifyContent="space-between" alignItems="center">
            <Grid item>
              <Typography variant="h6" noWrap component="div">
                LaJournal
              </Typography>
            </Grid>
            <Grid item>
              <Grid container alignItems="center" spacing={2}>
                <Grid item style={{display: "flex"}}>
                  <DarkModeToggle
                    checked={theme.palette.mode === 'dark'}
                    onChange={colorMode.toggleColorMode}
                    size={50}
                  />
                </Grid>
                <Grid item>
                  <IconButton color="inherit" onClick={handleOptionsClick}>
                    <AccountCircleIcon/>
                  </IconButton>

                  <Paper>
                    <Menu
                      open={openOptions}
                      onClose={handleCloseOptions}
                      anchorOrigin={{horizontal: 'right', vertical: 'top'}}
                    >
                      <MenuItem onClick={toggleOpenChangePasswordDialog}>
                        <ListItemIcon>
                          <PasswordIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Change Password</ListItemText>
                      </MenuItem>
                      <MenuItem onClick={logOut}>
                        <ListItemIcon>
                          <LogoutIcon fontSize="small"/>
                        </ListItemIcon>
                        <ListItemText>Logout</ListItemText>
                      </MenuItem>
                    </Menu>
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
          },
        }}
        variant="persistent"
        anchor="left"
        open={openDrawer}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawerOpen}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </DrawerHeader>
        <Divider/>
        <Menus/>
      </Drawer>
      <Main open={openDrawer}>
        <DrawerHeader/>
        <AppRoutes/>

        <Dialog open={openChangePasswordDialog} onClose={toggleOpenChangePasswordDialog} fullWidth>
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="New Password"
              type="password"
              variant="standard"
              value={newPassword.value}
              onChange={handlePasswordChange("value")}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="standard"
              sx={{marginTop: 2}}
              value={newPassword.confirm}
              onChange={handlePasswordChange("confirm")}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={toggleOpenChangePasswordDialog}>Cancel</Button>
            <Button onClick={changePassword}>Confirm</Button>
          </DialogActions>
        </Dialog>
      </Main>
    </Box>
  );
}
