import React, { useCallback, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import appActions from "../redux/app/actions";
// components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MoodPicker from "./reusable/MoodPicker";
import FormControlLabel from "@mui/material/FormControlLabel";

// icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import LabelOffIcon from "@mui/icons-material/LabelOff";
import CheckIcon from "@mui/icons-material/Check";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
// other
import { Navigate, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { deleteByValue, formatDate } from "../helpers";
import ReactHtmlParser from 'react-html-parser';
import { useConfirm } from "material-ui-confirm";
import entryActions from "../redux/entries/actions";
import 'react-quill/dist/quill.core.css'

const Paragraph = ({data, selectable, selected, showLabels, onSelect, onDeselect, onLabelRemove}) => {

  const onChange = useCallback(event => {
    const checked = event.target.checked;
    if (checked)
      onSelect(data.order)
    else
      onDeselect(data.order)
  }, [data.order])

  return (
    <Grid container spacing={1} alignItems="center" className={selectable && "focusOnHover"}>
      <Grid item xs>
        {selectable ?
          <FormControlLabel
            control={<Checkbox checked={selected} onChange={onChange}/>}
            label={ReactHtmlParser(data.content)}
          />
          :
          <div>
            {ReactHtmlParser(data.content)}
          </div>
        }
      </Grid>
      {(selectable || showLabels) &&
        <Grid item>
          {data.labels.map(label => (
            <Typography key={label.id} paragraph variant="caption">
              > {label.name} {" "}
              {selectable && <span onClick={onLabelRemove(label)} className="redText pointerCursor">X</span>}
            </Typography>
          ))}
        </Grid>}
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
  const navigate = useNavigate();

  const [assigningLabels, setAssigningLabels] = useState(false);
  const [selectedParagraphs, setSelectedParagraphs] = useState([]);
  const [isAssignLabelDialogVisible, setIsAssignLabelDialogVisible] = useState(false);
  const [showLabels, setShowLabels] = useState(false);

  const editEntry = useCallback(() => {
    navigate(`/entries/${entryId}/edit`)
  }, [])

  const handleDelete = useCallback(() => {
    confirm({title: "Delete journal entry?", description: 'This action is permanent!'})
      .then(() => {
        dispatch(entryActions.deleteEntry(entryId, navigate))
      })
      .catch(() => {
      })
  }, [entryId])

  const activateAssigningLabels = useCallback(() => {
    setAssigningLabels(true);
  }, [])

  const finishAssigningLabels = useCallback(async () => {
    let proceed = true;

    if (selectedParagraphs.length > 0) {
      await confirm({
        title: "Are you sure?",
        description: "Selection will be lost!",
        dialogProps: {fullWidth: false}
      })
        .then(() => {
        })
        .catch(() => {
          proceed = false
        })
    }

    if (proceed) {
      setAssigningLabels(false);
      setSelectedParagraphs([]);
    }
  }, [selectedParagraphs])

  const toggleShowLabels = useCallback(() => {
    setShowLabels(prevState => !prevState);
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
    dispatch(entryActions.assignLabelToParagraphs(entryId, selectedParagraphs, label.id))
    closeAssignLabelDialog();
    setSelectedParagraphs([]);
  }, [selectedParagraphs])

  const removeLabelFromParagraph = useCallback((paragraphOrder) => (label) => () => {
    confirm({
      title: "Confirm removing label?",
      description: `Label to remove: ${label.name}`,
      dialogProps: {fullWidth: false}
    })
      .then(() => {
        dispatch(entryActions.removeLabelFromParagraph(entryId, paragraphOrder, label.id))
      })
      .catch(() => {
      })
  }, [])

  if (entries.loading || labels.loading)
    return <div>Loading...</div>;

  const entry = entries.all.find(entry => entry.id === entryId);

  if (!entry)
    return <Navigate to="/"/>;

  return (
    <div>
      <Grid container justifyContent="space-between" alignItems="center">
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

        {!assigningLabels &&
          <Grid>
            <Button
              startIcon={showLabels ? <LabelOffIcon/> : <LabelIcon/>}
              onClick={toggleShowLabels}
            >
              {showLabels ? "Hide Labels" : "Show Labels"}
            </Button>
          </Grid>}

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
                  <Button endIcon={<CheckIcon/>} variant="outlined" onClick={finishAssigningLabels} color="success">
                    Finish
                  </Button>
                </Grid>
              </>}
            {!assigningLabels &&
              <>
                <Grid item>
                  <Button endIcon={<LabelIcon/>} variant="outlined" onClick={activateAssigningLabels}>
                    Edit Labels
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

      <div className="mt8 noMarginParagraph ql-editor">
        {entry.paragraphs.map(paragraph => (
          <Paragraph
            key={paragraph.order}
            data={paragraph}
            selectable={assigningLabels}
            selected={selectedParagraphs.includes(paragraph.order)}
            showLabels={showLabels}
            onSelect={handleParagraphSelect}
            onDeselect={handleParagraphDeselect}
            onLabelRemove={removeLabelFromParagraph(paragraph.order)}
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