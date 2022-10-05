import React, { useCallback } from 'react';
//redux
import { useDispatch } from "react-redux";
import entryActions from "../redux/entries/actions";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
import { useNavigate } from "react-router";

const NewJournalEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const confirmNewEntry = useCallback((entryData) => {
    dispatch(entryActions.createEntry(entryData, navigate))
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