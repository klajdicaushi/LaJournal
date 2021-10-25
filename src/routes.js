import { lazy } from "react";

import DashboardIcon from '@mui/icons-material/Dashboard';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';


const routes = [
  {
    path: "/",
    label: "Dashboard",
    component: lazy(() => import('./components/Dashboard')),
    icon: <DashboardIcon/>
  },
  {
    path: "/journal",
    label: "Journal",
    component: lazy(() => import('./components/Journal')),
    icon: <LibraryBooksIcon/>
  },
]

export default routes;
