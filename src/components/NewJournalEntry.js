import React, { useCallback, useState } from 'react';
//redux
import { useDispatch } from "react-redux";
import entryActions from "../redux/entries/actions";
// components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DatePicker from "@mui/lab/DatePicker";
import MoodPicker from "./reusable/MoodPicker";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from "@mui/material/Button";
//icons
import SaveIcon from "@mui/icons-material/Save";
import { BlocksFinder, formatServerDate } from "../helpers";

const NewJournalEntry = () => {
  const [date, setDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [mood, setMood] = useState(null);
  const [content, setContent] = useState("");
  const dispatch = useDispatch();

  const handleTitleChange = useCallback(event => {
    setTitle(event.target.value);
  }, []);

  const handleMoodChange = useCallback((event, newValue) => {
    setMood(newValue)
  }, []);

  const confirmNewEntry = useCallback(() => {
    const contentBlocks = new BlocksFinder(content).findBlocks();
    const newEntryData = {
      title,
      date: formatServerDate(date),
      rating: mood,
      paragraphs: contentBlocks.map((block, index) => ({
        content: block,
        order: index + 1
      }))
    };
    dispatch(entryActions.createEntry(newEntryData))
  }, [date, title, mood, content])

  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <DatePicker
            label="Date"
            fullWidth
            value={date}
            onChange={setDate}
            renderInput={(params) => <TextField {...params} variant="standard"/>}
          />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TextField
            fullWidth
            label="Title"
            variant="standard"
            value={title}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item xs>
          <Typography component="legend">Mood</Typography>
          <MoodPicker value={mood} onChange={handleMoodChange} size="large"/>
        </Grid>
      </Grid>

      <ReactQuill
        theme="snow"
        value={content}
        onChange={setContent}
        // readOnly
        style={{fontSize: 14}}
      />

      <Grid container justifyContent="flex-end" sx={{marginTop: 1}}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<SaveIcon/>}
            onClick={confirmNewEntry}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

export default NewJournalEntry;