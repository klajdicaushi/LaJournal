import { lazy } from "react";

import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LabelIcon from '@mui/icons-material/Label';


const routes = [
  {
    path: "/",
    label: "Journal",
    component: lazy(() => import('./components/Journal')),
    icon: <LibraryBooksIcon/>
  },
  {
    path: "/labels",
    label: "Labels",
    component: lazy(() => import('./components/Labels')),
    icon: <LabelIcon/>
  },
]

export default routes;
