import { lazy } from "react";

import InboxIcon from '@mui/icons-material/MoveToInbox';


const routes = [
  {
    path: "/",
    label: "Dashboard",
    component: lazy(() => import('./components/Dashboard')),
    icon: <InboxIcon/>
  },
  {
    path: "/journal",
    label: "Journal",
    component: lazy(() => import('./components/Journal')),
    icon: <InboxIcon/>
  },
]

export default routes;
