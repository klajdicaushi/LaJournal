import React, { useCallback } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
// components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MoodPicker from "./reusable/MoodPicker";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
// other
import { Redirect, useParams } from "react-router-dom";
import { formatDate } from "../helpers";
import ReactHtmlParser from 'react-html-parser';
import { useConfirm } from "material-ui-confirm";
import entryActions from "../redux/entries/actions";

const JournalEntry = () => {
  let {entryId} = useParams();
  entryId = parseInt(entryId);
  const entries = useSelector(selectors.extractEntries);
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const handleDelete = useCallback(() => {
    confirm({title: "Delete journal entry?", description: 'This action is permanent!'})
      .then(() => {
        dispatch(entryActions.deleteEntry(entryId))
      })
  }, [entryId])

  if (entries.loading)
    return <div>Loading...</div>;

  const entry = entries.all.find(entry => entry.id === entryId);

  if (!entry)
    return <Redirect to="/"/>;

  return (
    <div>
      <Grid container justifyContent="space-between">
        <Grid item>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item>
              <Typography variant="h5">{entry.title}</Typography>
            </Grid>
            <Grid item>
              <MoodPicker readOnly value={entry.rating}/>
            </Grid>
            <Grid item>
              <Typography variant="caption">{formatDate(entry.date)}</Typography>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={1}>
            <Button endIcon={<DeleteIcon/>} variant="outlined" color="error" onClick={handleDelete}>
              Delete
            </Button>
          </Grid>
        </Grid>
      </Grid>

      <div className="mt8 noMarginParagraph">
        {entry.paragraphs.map(paragraph => (ReactHtmlParser(paragraph.content)))}
      </div>
    </div>
  );
};

export default JournalEntry;