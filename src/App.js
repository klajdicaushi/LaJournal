import React, {
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
// redux
import { useDispatch } from "react-redux";
import labelActions from "./redux/labels/actions";
import entriesActions from "./redux/entries/actions";
import appActions from "./redux/app/actions";
// components
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Tooltip from "@mui/material/Tooltip";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
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
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import PasswordIcon from "@mui/icons-material/Password";
// other
import { Navigate, Routes } from "react-router";
import { Link, Route } from "react-router-dom";
import { styled as styledM, useTheme } from "@mui/material/styles";
import styled from "styled-components";
import routes from "./routes";
import "./index.css";
import { ColorModeContext } from "./AppWrapper";

const openDrawerWidth = 240;
const closedDrawerWidth = 56;

const Main = styledM("main", { shouldForwardProp: (prop) => prop !== "open" })(
  ({ theme, open }) => ({
    flexGrow: 1,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    width: `calc(100% - ${closedDrawerWidth}px)`,
    ...(open && {
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      width: `calc(100% - ${openDrawerWidth}px)`,
    }),
  })
);

const DrawerHeader = styled.div`
  padding: 8px;
`;

const Menus = ({ openDrawer }) => {
  const menus = [];

  routes.forEach((route) => {
    if (route.label) {
      const menuItem = (
        <ListItem key={route.path} disablePadding>
          <ListItemButton key={route.path} component={Link} to={route.path}>
            <ListItemIcon>{route.icon}</ListItemIcon>
            <ListItemText primary={route.label} />
          </ListItemButton>
        </ListItem>
      );

      if (openDrawer) {
        menus.push(menuItem);
      } else {
        menus.push(
          <Tooltip title={route.label} key={route.path} placement="right">
            {menuItem}
          </Tooltip>
        );
      }
    }
  });

  return <List>{menus}</List>;
};

const AppRoutes = () => (
  <Suspense fallback="Loading...">
    <Routes>
      {routes.map((route) => (
        <Route
          key={route.path}
          exact
          path={route.path}
          element={route.element}
        />
      ))}
      <Route path="about" render={() => <Navigate to="/" />} />
    </Routes>
  </Suspense>
);

export default function App() {
  const theme = useTheme();
  const colorMode = useContext(ColorModeContext);
  const dispatch = useDispatch();
  const [openDrawer, setOpenDrawer] = useState(true);
  const [optionsAnchor, setOptionsAnchor] = useState(null);
  const [openChangePasswordDialog, setOpenChangePasswordDialog] =
    useState(false);
  const [input, setInput] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  useEffect(() => {
    dispatch(labelActions.getLabels());
    dispatch(entriesActions.getEntries());
  }, []);

  const toggleDrawerOpen = useCallback(() => {
    setOpenDrawer((prevState) => !prevState);
  }, []);

  const handleOptionsClick = useCallback((event) => {
    setOptionsAnchor(event.currentTarget);
  }, []);

  const handleCloseOptions = useCallback(() => {
    setOptionsAnchor(null);
  }, []);

  const toggleOpenChangePasswordDialog = useCallback(() => {
    setOpenChangePasswordDialog((prevState) => !prevState);
  }, []);

  const handleInputChange = useCallback(
    (attr) => (event) => {
      setInput((prevState) => ({ ...prevState, [attr]: event.target.value }));
    },
    []
  );

  const changePassword = useCallback(() => {
    if (input.newPassword !== input.confirmNewPassword) {
      dispatch(
        appActions.showErrorNotification(
          "New Password and Confirm Password do not match!"
        )
      );
      return;
    }

    if (input.currentPassword === input.newPassword) {
      dispatch(
        appActions.showErrorNotification(
          "New Password should be different from current one!"
        )
      );
      return;
    }

    dispatch(
      appActions.changePassword(input.currentPassword, input.newPassword)
    );
  }, [input]);

  const logOut = useCallback(() => {
    dispatch(appActions.logOut(true));
  }, []);

  const openOptions = Boolean(optionsAnchor);

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        sx={{
          width: openDrawer ? openDrawerWidth - 16 : closedDrawerWidth,
          // flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: openDrawer ? openDrawerWidth : closedDrawerWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
          },
        }}
        variant="permanent"
        anchor="left"
        open={openDrawer}
      >
        <DrawerHeader>
          <Grid container alignItems="center">
            {openDrawer && (
              <Grid size="grow">
                <Grid container justifyContent="center" alignItems="center">
                  <Grid>
                    <Typography variant="h6" component="div" align="center">
                      LaJournal
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            )}
            <Grid>
              <IconButton onClick={toggleDrawerOpen}>
                {openDrawer ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </Grid>
          </Grid>
        </DrawerHeader>
        <Divider />
        <Menus openDrawer={openDrawer} />
        <Divider />

        <Grid
          container
          justifyContent="center"
          style={{ marginTop: "auto", marginBottom: 16 }}
        >
          <Grid item>
            <Grid
              container
              justifyContent="center"
              alignItems="center"
              spacing={2}
            >
              <Grid item style={{ display: "flex" }}>
                <DarkModeToggle
                  checked={theme.palette.mode === "dark"}
                  onChange={colorMode.toggleColorMode}
                  size={50}
                />
              </Grid>
              <Grid item>
                <IconButton color="inherit" onClick={handleOptionsClick}>
                  <AccountCircleIcon />
                </IconButton>

                <Paper>
                  <Menu
                    open={openOptions}
                    anchorEl={optionsAnchor}
                    onClose={handleCloseOptions}
                    anchorOrigin={{ horizontal: "left", vertical: "top" }}
                  >
                    <MenuItem onClick={toggleOpenChangePasswordDialog}>
                      <ListItemIcon>
                        <PasswordIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Change Password</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={logOut}>
                      <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                      </ListItemIcon>
                      <ListItemText>Logout</ListItemText>
                    </MenuItem>
                  </Menu>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Drawer>
      <Main open={openDrawer}>
        {/* <DrawerHeader /> */}
        <AppRoutes />

        <Dialog
          open={openChangePasswordDialog}
          onClose={toggleOpenChangePasswordDialog}
          fullWidth
        >
          <DialogTitle>Change Password</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              label="Current Password"
              type="password"
              variant="standard"
              value={input.current}
              onChange={handleInputChange("currentPassword")}
            />
            <TextField
              fullWidth
              label="New Password"
              type="password"
              variant="standard"
              value={input.value}
              onChange={handleInputChange("newPassword")}
            />
            <TextField
              fullWidth
              label="Confirm Password"
              type="password"
              variant="standard"
              sx={{ marginTop: 2 }}
              value={input.confirm}
              onChange={handleInputChange("confirmNewPassword")}
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
