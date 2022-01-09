import React, { useCallback } from 'react';
//redux
import { useDispatch, useSelector } from "react-redux";
import entryActions from "../redux/entries/actions";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
import { Redirect, useParams } from "react-router-dom";
import selectors from "../redux/selectors";

const NewJournalEntry = () => {
  let {entryId} = useParams();
  entryId = parseInt(entryId);
  const entries = useSelector(selectors.extractEntries);
  const dispatch = useDispatch();

  const confirmEditEntry = useCallback((entryData) => {
    dispatch(entryActions.editEntry(entryId, entryData))
  }, []);

  if (entries.loading)
    return <div>Loading...</div>;

  const entry = entries.all.find(entry => entry.id === entryId);

  if (!entry)
    return <Redirect to="/"/>;

  return (
    <div>
      <EditableJournalEntry
        entry={entry}
        onSave={confirmEditEntry}
        cancelUri={`/entries/${entryId}`}
      />
    </div>
  );
};

export default NewJournalEntry;