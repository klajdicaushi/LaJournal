// pages
import Dashboard from "./components/Dashboard";
import NewJournalEntry from "./components/NewJournalEntry";
import JournalEntry from "./components/JournalEntry";
import EditJournalEntry from "./components/EditJournalEntry";
import Journal from "./components/Journal";
import Labels from "./components/Labels";
import Bookmarks from "./components/Bookmarks";

// icons
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LabelIcon from '@mui/icons-material/Label';
import DashboardIcon from '@mui/icons-material/Dashboard';
import BookmarkIcon from '@mui/icons-material/Bookmark';


const routes = [
  {
    path: "/",
    label: "Dashboard",
    element: <Dashboard/>,
    icon: <DashboardIcon/>
  },
  {
    path: "/entries/new",
    element: <NewJournalEntry/>,
  },
  {
    path: "/entries/:entryId",
    element: <JournalEntry/>,
  },
  {
    path: "/entries/:entryId/edit",
    element: <EditJournalEntry/>,
  },
  {
    path: "/entries",
    label: "Journal",
    element: <Journal/>,
    icon: <LibraryBooksIcon/>
  },
  {
    path: "/bookmarks",
    label: "Bookmarks",
    element: <Bookmarks/>,
    icon: <BookmarkIcon/>
  },
  {
    path: "/labels",
    label: "Labels",
    element: <Labels/>,
    icon: <LabelIcon/>
  },
]

export default routes;
