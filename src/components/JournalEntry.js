import React from "react";
// redux
import { useSelector } from "react-redux";
// other
import selectors from "../redux/selectors";
import { Redirect, useParams } from "react-router-dom";
import { Typography } from "@mui/material";

const JournalEntry = () => {
  let {entryId} = useParams();
  const entries = useSelector(selectors.extractEntries);

  if (entries.loading)
    return <div>Loading...</div>;

  const entry = entries.all.find(entry => entry.id === parseInt(entryId));

  if (!entry)
    return <Redirect to="/"/>;

  return (
    <div>
      <Typography variant="h5">{entry.title}</Typography>
      Journal Entry {entryId}
    </div>
  );
};

export default JournalEntry;