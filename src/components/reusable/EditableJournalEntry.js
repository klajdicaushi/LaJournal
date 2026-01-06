import React, { useCallback, useEffect, useState, useRef } from "react";
import { DateTime } from "luxon";
// components
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import MoodPicker from "./MoodPicker";
import EditorComposer from "../Editor/EditorComposer";
import Button from "@mui/material/Button";
// icons
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
// other
import { getBlocks, formatServerDate } from "../../helpers";
import { extractEditorContent } from "../Editor/editorUtils";
import { useConfirm } from "material-ui-confirm";
import { useNavigate } from "react-router";

function getContent(entry) {
  if (!entry) return "";

  return entry.paragraphs.reduce(
    (previousValue, currentValue) => previousValue + currentValue.content,
    ""
  );
}

const EditableJournalEntry = ({
  entry,
  confirmText = "Save",
  onSave,
  cancelUri = "/",
}) => {
  const [date, setDate] = useState(
    entry ? DateTime.fromJSDate(new Date(entry.date)) : DateTime.now()
  );
  const [title, setTitle] = useState(entry ? entry.title : "");
  const [mood, setMood] = useState(entry ? entry.rating : null);
  const [content, setContent] = useState(getContent(entry));
  const [edited, setEdited] = useState(false);
  const [editor, setEditor] = useState(null);
  const [initialJSONState] = useState(entry ? entry.json_content : null);
  const [initialHtmlContent] = useState(entry ? getContent(entry) : null);
  const quillRef = useRef(null);

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

  useEffect(() => {
    // Focus the editor when component mounts
    if (quillRef.current && content) {
      const quillEditor = quillRef.current.getEditor();
      // Set selection to the end of the content
      const length = quillEditor.getLength();
      quillEditor.setSelection(length, 0);
    } else if (quillRef.current) {
      // If no content, just focus the editor
      quillRef.current.focus();
    }
  }, []); // Run only on mount

  const confirm = useConfirm();
  const navigate = useNavigate();

  const handleDateChange = useCallback((value) => {
    setDate(value);
  }, []);

  const handleTitleChange = useCallback((event) => {
    setTitle(event.target.value);
    setEdited(true);
  }, []);

  const handleMoodChange = useCallback((event, newValue) => {
    setMood(newValue);
    setEdited(true);
  }, []);

  const handleContentChange = useCallback((newValue) => {
    setContent(newValue);
  }, []);

  const handleCancel = useCallback(() => {
    if (edited || getContent(entry) !== content) {
      confirm({
        title: "Are you sure?",
        description: "Your changes will be lost.",
      })
        .then(() => {
          navigate(cancelUri);
        })
        .catch(() => {});
    } else {
      navigate(cancelUri);
    }
  }, [cancelUri, edited, content, entry]);

  const handleConfirm = useCallback(() => {
    // Extract content from the Lexical editor
    const { jsonState, htmlContent } = extractEditorContent(editor);

    if (jsonState === initialJSONState) {
      // No changes made
      navigate(cancelUri);
      return;
    }

    // Split content into paragraphs/blocks
    const contentBlocks = getBlocks(htmlContent);
    const entryData = {
      title,
      date: formatServerDate(date.toJSDate()),
      rating: mood,
      paragraphs: contentBlocks.map((block, index) => ({
        content: block,
        order: index + 1,
      })),
      json_content: jsonState,
    };

    onSave(entryData);
  }, [date, title, mood, initialJSONState, editor]);

  const handleKeyDown = useCallback(
    (event) => {
      if (event.ctrlKey || event.metaKey) {
        let charCode = String.fromCharCode(event.which).toLowerCase();
        if (charCode === "s") {
          event.preventDefault();
          handleConfirm();
        }
      }
    },
    [handleConfirm]
  );

  return (
    <div onKeyDown={handleKeyDown} tabIndex={0}>
      <Grid container spacing={2}>
        <Grid item>
          <DatePicker
            label="Date"
            value={date}
            onChange={handleDateChange}
            disableFuture
          />
        </Grid>
        <Grid item size={{ xs: 12, lg: 6 }}>
          <TextField
            fullWidth
            label="Title"
            variant="outlined"
            value={title}
            onChange={handleTitleChange}
          />
        </Grid>
        <Grid item>
          <Typography component="legend">Mood</Typography>
          <MoodPicker value={mood} onChange={handleMoodChange} size="large" />
        </Grid>
      </Grid>

      <EditorComposer
        onEditorReady={setEditor}
        initialJSONState={initialJSONState}
        initialHtmlContent={initialHtmlContent}
      />

      <Grid container justifyContent="flex-end" sx={{ marginTop: 1 }}>
        <Grid item>
          <Grid container spacing={1}>
            <Grid item>
              <Button
                variant="contained"
                color="secondary"
                startIcon={<CancelIcon />}
                onClick={handleCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
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

export default EditableJournalEntry;
