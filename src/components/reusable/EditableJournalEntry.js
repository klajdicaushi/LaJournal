import React, { useCallback, useState } from 'react';
// components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DatePicker from "@mui/lab/DatePicker";
import MoodPicker from "./MoodPicker";
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Button from "@mui/material/Button";
// icons
import SaveIcon from "@mui/icons-material/Save";
// other
import { BlocksFinder, formatServerDate } from "../../helpers";

function getContent(entry) {
  if (!entry)
    return "";

  return entry.paragraphs.reduce((previousValue, currentValue) =>   previousValue + currentValue.content, "");
}


const EditableJournalEntry = ({entry, confirmText, onSave}) => {
  const [date, setDate] = useState(entry ? new Date(entry.date) : new Date());
  const [title, setTitle] = useState(entry ? entry.title : "");
  const [mood, setMood] = useState(entry ? entry.rating : null);
  const [content, setContent] = useState(getContent(entry));

  const handleTitleChange = useCallback(event => {
    setTitle(event.target.value);
  }, []);

  const handleMoodChange = useCallback((event, newValue) => {
    setMood(newValue)
  }, []);

  const handleConfirm = useCallback(() => {
    const contentBlocks = new BlocksFinder(content).findBlocks();
    const entryData = {
      title,
      date: formatServerDate(date),
      rating: mood,
      paragraphs: contentBlocks.map((block, index) => ({
        content: block,
        order: index + 1
      }))
    };

    onSave(entryData);
  }, [date, title, mood, content]);

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
        modules={{
          clipboard: {
            matchVisual: false,
          },
        }}
      />

      <Grid container justifyContent="flex-end" sx={{marginTop: 1}}>
        <Grid item>
          <Button
            variant="contained"
            startIcon={<SaveIcon/>}
            onClick={handleConfirm}
          >
            {confirmText}
          </Button>
        </Grid>
      </Grid>
    </div>
  );
};

EditableJournalEntry.defaultProps = {
  confirmText: "Save"
}

export default EditableJournalEntry;