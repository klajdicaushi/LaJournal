import React, { useCallback } from 'react';
//redux
import { useDispatch } from "react-redux";
import entryActions from "../redux/entries/actions";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";

const NewJournalEntry = () => {
  const dispatch = useDispatch();

  const confirmNewEntry = useCallback((entryData) => {
    dispatch(entryActions.createEntry(entryData))
  }, []);

  return (
    <div>
      <EditableJournalEntry
        onSave={confirmNewEntry}
      />
    </div>
  );
};

export default NewJournalEntry;