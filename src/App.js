import React, { Suspense, useEffect } from 'react';
// redux
import { useDispatch } from "react-redux";
import labelActions from "./redux/labels/actions";
import entriesActions from "./redux/entries/actions";
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
// icons
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
// other
import { Link, Redirect, Route, Switch } from "react-router-dom";
import { styled as styledM, useTheme } from '@mui/material/styles';
import styled from 'styled-components';
import routes from "./routes";
import "./index.css";

const drawerWidth = 240;

const Main = styledM('main', {shouldForwardProp: (prop) => prop !== 'open'})(
  ({theme, open}) => ({
    flexGrow: 1,
    padding: theme.spacing(4),
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

const Routes = () => (
  <Suspense fallback="Loading...">
    <Switch>
      {routes.map(route => (
        <Route key={route.path} exact path={route.path} component={route.component}/>
      ))}
      <Redirect to="/"/>
    </Switch>
  </Suspense>
)

export default function App() {
  const theme = useTheme();
  const dispatch = useDispatch()
  const [open, setOpen] = React.useState(true);

  useEffect(() => {
    dispatch(labelActions.getLabels());
    dispatch(entriesActions.getEntries());
  });

  const toggleDrawerOpen = () => {
    setOpen(prevState => !prevState);
  }

  return (
    <Box sx={{display: 'flex'}}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={toggleDrawerOpen}
            edge="start"
            sx={{mr: 2, ...(open && {display: 'none'})}}
          >
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            LaJournal
          </Typography>
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
        open={open}
      >
        <DrawerHeader>
          <IconButton onClick={toggleDrawerOpen}>
            {theme.direction === 'ltr' ? <ChevronLeftIcon/> : <ChevronRightIcon/>}
          </IconButton>
        </DrawerHeader>
        <Divider/>
        <Menus/>
      </Drawer>
      <Main open={open}>
        <DrawerHeader/>
        <Routes/>
      </Main>
    </Box>
  );
}
