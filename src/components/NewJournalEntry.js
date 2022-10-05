import React, { useCallback } from 'react';
import { useNavigate } from "react-router";
//redux
import { useDispatch, useSelector } from "react-redux";
import entryActions from "../redux/entries/actions";
import selectors from "../redux/selectors";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";

const NewJournalEntry = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const entries = useSelector(selectors.extractEntries);

  const confirmNewEntry = useCallback((entryData) => {
    dispatch(entryActions.createEntry(entryData, navigate))
  }, []);

  return (
    <div>
      <Backdrop open={entries.loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>
      <EditableJournalEntry
        onSave={confirmNewEntry}
      />
    </div>
  );
};

export default NewJournalEntry;