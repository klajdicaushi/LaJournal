import React, { useCallback, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import selectors from "../redux/selectors";
import appActions from "../redux/app/actions";
// components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MoodPicker from "./reusable/MoodPicker";
// icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import CancelIcon from "@mui/icons-material/Cancel";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
// other
import { Redirect, useParams } from "react-router-dom";
import { deleteByValue, formatDate } from "../helpers";
import ReactHtmlParser from 'react-html-parser';
import { useConfirm } from "material-ui-confirm";
import entryActions from "../redux/entries/actions";

const Paragraph = ({data, selectable, selected, onSelect, onDeselect}) => {
  const parsedContent = ReactHtmlParser(data.content)

  const onChange = useCallback(event => {
    const checked = event.target.checked;
    if (checked)
      onSelect(data.order)
    else
      onDeselect(data.order)
  }, [data.order])

  if (!selectable)
    return parsedContent;

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item>
        <Checkbox
          checked={selected}
          onChange={onChange}
        />
      </Grid>
      <Grid item>
        {parsedContent}
      </Grid>
    </Grid>
  );
}

const JournalEntry = () => {
  let {entryId} = useParams();
  entryId = parseInt(entryId);
  const entries = useSelector(selectors.extractEntries);
  const labels = useSelector(selectors.extractLabels);
  const confirm = useConfirm();
  const dispatch = useDispatch();

  const [assigningLabels, setAssigningLabels] = useState(false);
  const [selectedParagraphs, setSelectedParagraphs] = useState([]);
  const [isAssignLabelDialogVisible, setIsAssignLabelDialogVisible] = useState(false);

  const editEntry = useCallback(() => {
    dispatch(push(`/entries/${entryId}/edit`))
  }, [])

  const handleDelete = useCallback(() => {
    confirm({title: "Delete journal entry?", description: 'This action is permanent!'})
      .then(() => {
        dispatch(entryActions.deleteEntry(entryId))
      })
      .catch(() => {
      })
  }, [entryId])

  const activateAssigningLabels = useCallback(() => {
    setAssigningLabels(true);
  }, [])

  const cancelAssigningLabels = useCallback(() => {
    // TODO: Check if labels have changed and ask confirmation
    setAssigningLabels(false);
    setSelectedParagraphs([]);
  }, [])

  const handleParagraphSelect = useCallback(paragraphOrder => {
    setSelectedParagraphs(prevState => [...prevState, paragraphOrder])
  }, [])

  const handleParagraphDeselect = useCallback(paragraphOrder => {
    setSelectedParagraphs(prevState => deleteByValue(prevState, paragraphOrder))
  }, [])

  const openAssignLabelDialog = useCallback(() => {
    if (selectedParagraphs.length === 0) {
      dispatch(appActions.showErrorNotification("Please select paragraphs first!"))
      return;
    }

    setIsAssignLabelDialogVisible(true);
  }, [selectedParagraphs])

  const closeAssignLabelDialog = useCallback(() => {
    setIsAssignLabelDialogVisible(false);
  }, [])

  const assignLabelToParagraphs = useCallback((label) => () => {
    confirm({
      title: "Confirm assigning label?",
      description: `Label to assign: ${label.name}`,
      dialogProps: {fullWidth: false}
    })
      .then(() => {
        console.log("ASSIGNING LABEL")
        // TODO: Perform actual call and deselect paragraphs on success
        closeAssignLabelDialog();
      })
      .catch(() => {
      })
  }, [selectedParagraphs])

  if (entries.loading || labels.loading)
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
            {assigningLabels &&
              <>
                <Grid item>
                  <Button
                    endIcon={<LabelIcon/>}
                    variant="outlined"
                    color="primary"
                    onClick={openAssignLabelDialog}
                  >
                    Assign label
                  </Button>
                </Grid>
                <Grid item>
                  <Button endIcon={<CancelIcon/>} variant="outlined" onClick={cancelAssigningLabels} color="error">
                    Cancel
                  </Button>
                </Grid>
              </>}
            {!assigningLabels &&
              <>
                <Grid item>
                  <Button endIcon={<LabelIcon/>} variant="outlined" onClick={activateAssigningLabels} color="secondary">
                    Assign Labels
                  </Button>
                </Grid>
                <Grid item>
                  <Button endIcon={<EditIcon/>} variant="outlined" onClick={editEntry}>
                    Edit
                  </Button>
                </Grid>
                <Grid item>
                  <Button endIcon={<DeleteIcon/>} variant="outlined" color="error" onClick={handleDelete}>
                    Delete
                  </Button>
                </Grid>
              </>}
          </Grid>
        </Grid>
      </Grid>

      <div className="mt8 noMarginParagraph">
        {entry.paragraphs.map(paragraph => (
          <Paragraph
            key={paragraph.order}
            data={paragraph}
            selectable={assigningLabels}
            selected={selectedParagraphs.includes(paragraph.order)}
            onSelect={handleParagraphSelect}
            onDeselect={handleParagraphDeselect}
          />))}
      </div>

      <Dialog open={isAssignLabelDialogVisible} onClose={closeAssignLabelDialog}>
        <DialogTitle>Select label to assign</DialogTitle>
        <List sx={{pt: 0}}>
          {labels.all.map((label) => (
            <ListItem key={label.id} button onClick={assignLabelToParagraphs(label)}>
              <ListItemAvatar>
                <Avatar>
                  <LabelIcon/>
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary={label.name} secondary={label.questions_hint}/>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
};

export default JournalEntry;