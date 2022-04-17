import React, { useCallback, useEffect, useState } from 'react';
// components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import DatePicker from "@mui/lab/DatePicker";
import MoodPicker from "./MoodPicker";
import ReactQuill from 'react-quill';
import Button from "@mui/material/Button";
// icons
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
// other
import { BlocksFinder, formatServerDate } from "../../helpers";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";
import 'react-quill/dist/quill.snow.css';
import styled from "styled-components";

function getContent(entry) {
  if (!entry) return "";

  return entry.paragraphs.reduce((previousValue, currentValue) => previousValue + currentValue.content, "");
}

const ContentContainer = styled.div`
  .ql-editor {
    max-height: calc(100vh - 260px);

    p, ol, ul, h1, h2, h3, h4, h5, h6 {
      padding-bottom: 8px;
    }
  }
`;

const EditableJournalEntry = ({entry, confirmText, onSave, cancelUri}) => {
  const [date, setDate] = useState(entry ? new Date(entry.date) : new Date());
  const [title, setTitle] = useState(entry ? entry.title : "");
  const [mood, setMood] = useState(entry ? entry.rating : null);
  const [content, setContent] = useState(getContent(entry));
  const [edited, setEdited] = useState(false);

  useEffect(() => {
    const alertUser = (e) => {
      if (edited || getContent(entry) !== content) {
        e.preventDefault();
        e.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", alertUser);
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, [edited, content, entry]);

  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleTitleChange = useCallback(event => {
    setTitle(event.target.value);
    setEdited(true);
  }, []);

  const handleMoodChange = useCallback((event, newValue) => {
    setMood(newValue);
    setEdited(true);
  }, []);

  const handleContentChange = useCallback(newValue => {
    setContent(newValue);
  }, [])

  const handleCancel = useCallback(() => {
    if (edited || getContent(entry) !== content) {
      confirm({title: "Are you sure?", description: 'Your changes will be lost.'})
        .then(() => {
          navigate(cancelUri)
        })
        .catch(() => {
        })
    } else {
      navigate(cancelUri)
    }
  }, [cancelUri, edited, content, entry])

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

  const handleKeyDown = useCallback((event) => {
    if (event.ctrlKey || event.metaKey) {
      let charCode = String.fromCharCode(event.which).toLowerCase();
      if (charCode === 's') {
        event.preventDefault();
        handleConfirm();
      }
    }
  }, [handleConfirm]);

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Grid container spacing={2}>
        <Grid item>
          <DatePicker
            label="Date"
            fullWidth
            value={date}
            onChange={setDate}
            disableFuture
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

      <ContentContainer>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={handleContentChange}
          style={{fontSize: 14}}
          modules={{
            clipboard: {
              matchVisual: false,
            },
          }}
        />
      </ContentContainer>

      <Grid container justifyContent="flex-end" sx={{marginTop: 1}}>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                color="error"
                startIcon={<CancelIcon/>}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
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
        </Grid>
      </Grid>
    </div>
  );
};

EditableJournalEntry.defaultProps = {
  confirmText: "Save",
  cancelUri: "/"
}

export default EditableJournalEntry;