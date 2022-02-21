import React, { useCallback } from 'react';
//redux
import { useDispatch, useSelector } from "react-redux";
import entryActions from "../redux/entries/actions";
import selectors from "../redux/selectors";
// components
import EditableJournalEntry from "./reusable/EditableJournalEntry";
// other
import { doParagraphsStartOrEndChange, findById } from "../helpers";
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
    const oldParagraphsNumber = originalEntryData.paragraphs.length;
    const newParagraphsNumber = editedEntryData.paragraphs.length;

    if (oldParagraphsNumber !== newParagraphsNumber) {
      let labelsExist = false;
      for (let paragraph of originalEntryData.paragraphs) {
        if (paragraph.labels.length > 0) {
          labelsExist = true;
          break;
        }
      }

      if (labelsExist) {
        let canKeepLabels;

        // Paragraphs added
        if (newParagraphsNumber > oldParagraphsNumber)
          canKeepLabels = !doParagraphsStartOrEndChange(originalEntryData.paragraphs, editedEntryData.paragraphs);
        // Paragraphs removed
        else
          canKeepLabels = !doParagraphsStartOrEndChange(editedEntryData.paragraphs, originalEntryData.paragraphs);

        if (!canKeepLabels) {
          await confirm({
            title: "Labels will be lost!",
            description: "Content and order of paragraphs have changed, so labels can't be stored. Proceed?"
          }).then(() => {
          }).catch(() => {
            proceedWithSave = false;
          })
        }
      }
    }

    if (proceedWithSave)
      dispatch(entryActions.editEntry(entryId, editedEntryData, navigate))
  }, [entries, entryId]);

  if (entries.loading)
    return <div>Loading...</div>;

  const entry = findById(entries.all, entryId);

  if (!entry)
    return <Navigate to="/"/>;

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