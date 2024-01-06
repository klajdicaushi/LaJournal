import React, { useEffect } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import entryActions from "../redux/entries/actions";
// components
import EntriesList from "./reusable/EntriesList";


const Bookmarks = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(entryActions.getBookmarkedEntries());
  }, []);

  const entries = useSelector(selectors.extractEntries);

  if (!entries.bookmarked)
    return <div>Loading...</div>;

  return (
    <div>
      <EntriesList entries={entries.bookmarked} />
    </div>
  );
}

export default Bookmarks;