import React from "react";
// redux
import { useSelector } from "react-redux";
import selectors from "../redux/selectors";
// components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import MoodPicker from "./reusable/MoodPicker";
// other
import { Redirect, useParams } from "react-router-dom";
import { formatDate } from "../helpers";
import ReactHtmlParser from 'react-html-parser';

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

      <div className="mt8 noMarginParagraph">
        {entry.paragraphs.map(paragraph => (ReactHtmlParser(paragraph.content)))}
      </div>
    </div>
  );
};

export default JournalEntry;