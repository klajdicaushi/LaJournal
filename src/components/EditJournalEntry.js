import React, { useCallback } from 'react';
//redux
import { useDispatch, useSelector } from "react-redux";
import entryActions from "../redux/entries/actions";
import selectors from "../redux/selectors";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
//other
import { findById } from "../helpers";
import { Redirect, useParams } from "react-router-dom";
import { useConfirm } from "material-ui-confirm";

const EditJournalEntry = () => {
  let {entryId} = useParams();
  entryId = parseInt(entryId);
  const entries = useSelector(selectors.extractEntries);
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const confirmEditEntry = useCallback((editedEntryData) => {
    const originalEntryData = findById(entries.all, entryId);

    let proceedWithSave = false;

    // Number of paragraphs changed
    if (originalEntryData.paragraphs.length !== editedEntryData.paragraphs.length) {
      let labelsExist = false;
      originalEntryData.paragraphs.forEach(paragraph => {
        if (paragraph.labels.length > 0)
          labelsExist = true;
      })

      if (labelsExist) {
        confirm({
          title: "Labels will be lost!",
          description: 'Since the number of paragraphs has changed, the assigned labels will be lost. Continue?'
        }).then(() => {
          proceedWithSave = true;
        })
      }
      else {
        proceedWithSave = true;
      }
    } else {
      proceedWithSave = true;
    }

    if (proceedWithSave)
      dispatch(entryActions.editEntry(entryId, editedEntryData))
  }, [entries, entryId]);

  if (entries.loading)
    return <div>Loading...</div>;

  const entry = findById(entries.all, entryId);

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

export default EditJournalEntry;