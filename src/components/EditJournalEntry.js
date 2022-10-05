import React, { useCallback } from 'react';
//redux
import { useDispatch, useSelector } from "react-redux";
import entryActions from "../redux/entries/actions";
import selectors from "../redux/selectors";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
// other
import { findById } from "../helpers";
import { Navigate, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

const EditJournalEntry = () => {
  let {entryId} = useParams();
  entryId = parseInt(entryId);
  const entries = useSelector(selectors.extractEntries);
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const navigate = useNavigate();

  const confirmEditEntry = useCallback(async (editedEntryData) => {
    const originalEntryData = findById(entries.all, entryId);

    let proceedWithSave = true;

    // Number of paragraphs changed
    if (originalEntryData.paragraphs.length !== editedEntryData.paragraphs.length) {
      let labelsExist = false;
      originalEntryData.paragraphs.forEach(paragraph => {
        if (paragraph.labels.length > 0)
          labelsExist = true;
      })

      if (labelsExist) {
        await confirm({
          title: "Labels will be lost!",
          description: 'Since the number of paragraphs has changed, the assigned labels will be lost. Continue?'
        }).then(() => {
        }).catch(() => {
          proceedWithSave = false;
        })
      }
    }

    if (proceedWithSave)
      dispatch(entryActions.editEntry(entryId, editedEntryData, navigate))
  }, [entries, entryId]);

  if (entries.loading && entries.all.length === 0)
    return <div>Loading...</div>;

  const entry = findById(entries.all, entryId);

  if (!entry)
    return <Navigate to="/"/>;

  return (
    <div>
      <Backdrop open={entries.loading}>
        <CircularProgress color="inherit"/>
      </Backdrop>
      <EditableJournalEntry
        entry={entry}
        onSave={confirmEditEntry}
        cancelUri={`/entries/${entryId}`}
      />
    </div>
  );
};

export default EditJournalEntry;