import React, { useCallback, useState } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import appActions from "../redux/app/actions";
import entryActions from "../redux/entries/actions";
// components
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import MoodPicker from "./reusable/MoodPicker";
import FormControlLabel from "@mui/material/FormControlLabel";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Avatar from "@mui/material/Avatar";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Paper from "@mui/material/Paper";
// icons
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import LabelOffIcon from "@mui/icons-material/LabelOff";
import CheckIcon from "@mui/icons-material/Check";
import TextIncrease from "@mui/icons-material/TextIncrease";
import TextDecrease from "@mui/icons-material/TextDecrease";
import TextFormat from "@mui/icons-material/TextFormat";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
// other
import { Navigate, useNavigate } from "react-router";
import { useParams } from "react-router-dom";
import { deleteByValue, formatDate } from "../helpers";
import ReactHtmlParser from 'react-html-parser';
import { useConfirm } from "material-ui-confirm";
import styled from "styled-components";
import 'react-quill/dist/quill.core.css';

const emptyParagraph = "<p><br></p>";

const fontSizeKey = 'fontSize';
const storedFontSize = localStorage.getItem(fontSizeKey);
const DEFAULT_FONT_SIZE = 14;
const MINIMAL_FONT_SIZE = 5;

const StickyGrid = styled(Grid)`
  position: sticky !important;
  position: -webkit-sticky !important;;
  top: 64px;
  padding: 8px;
`;

const ContentContainer = styled.div`
  margin-top: 8px;
  max-height: calc(100vh - 200px);
  
  p, ol, ul, h1, h2, h3, h4, h5, h6 {
    padding-bottom: 8px;
  }
`;

const Paragraph = ({data, selectable, selected, showLabels, onSelect, onDeselect, onLabelRemove, fontSize}) => {

  const onChange = useCallback(event => {
    const checked = event.target.checked;
    if (checked)
      onSelect(data.order);
    else
      onDeselect(data.order);
  }, [data.order])

  const content = <div style={{fontSize}}>{ReactHtmlParser(data.content)}</div>;

  return (
    <Grid container spacing={1} alignItems="center" className={(selectable || showLabels) ? "focusOnHover" : ""}>
      <Grid item xs>
        {(selectable && data.content !== emptyParagraph) ?
          <FormControlLabel
            control={<Checkbox checked={selected} onChange={onChange}/>}
            label={content}
          /> : content
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
  const [fontSize, setFontSize] = useState(storedFontSize ? parseInt(storedFontSize) : DEFAULT_FONT_SIZE);

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

  const increaseFontSize = useCallback(() => {
    setFontSize(prevState => {
      const newValue = prevState + 1;
      localStorage.setItem(fontSizeKey, newValue.toString());
      return newValue;
    });
  }, [])

  const decreaseFontSize = useCallback(() => {
    setFontSize(prevState => {
      const newValue = Math.max(MINIMAL_FONT_SIZE, prevState - 1);
      localStorage.setItem(fontSizeKey, newValue.toString());
      return newValue;
    })
  }, [])

  const resetFontSize = useCallback(() => {
    setFontSize(DEFAULT_FONT_SIZE);
    localStorage.setItem(fontSizeKey, DEFAULT_FONT_SIZE.toString());
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

  const goToNext = useCallback(() => {
    const entryIndex = entries.all.findIndex(entry => entry.id === entryId);
    const nextEntry = entries.all[entryIndex - 1];
    navigate(`/entries/${nextEntry.id}`);
  }, [entries.all, entryId]);

  const goToPrevious = useCallback(() => {
    const entryIndex = entries.all.findIndex(entry => entry.id === entryId);
    const previousEntry = entries.all[entryIndex + 1];
    navigate(`/entries/${previousEntry.id}`);
  }, [entries.all, entryId]);

  if (entries.loading || labels.loading)
    return <div>Loading...</div>;

  const entryIndex = entries.all.findIndex(entry => entry.id === entryId);

  if (entryIndex < 0)
    return <Navigate to="/"/>;

  const entry = entries.all[entryIndex];

  return (
    <div>
      {/* Header */}
      <StickyGrid container justifyContent="space-between" alignItems="center" component={Paper}>
        <Grid item>
          <Grid container spacing={1} alignItems="flex-start">
            <Grid item>
              <Typography variant="h5" style={{maxWidth: 250}} noWrap title={entry.title}>{entry.title}</Typography>
            </Grid>
            <Grid item>
              <MoodPicker readOnly value={entry.rating}/>
            </Grid>
            <Grid item>
              <Typography variant="caption">{formatDate(entry.date)}</Typography>
            </Grid>
            <Grid item>
              <Tooltip title="Increase font size">
                <IconButton size="small" onClick={increaseFontSize}>
                  <TextIncrease fontSize="inherit"/>
                </IconButton>
              </Tooltip>
              <Tooltip title="Decrease font size">
                <span>
                <IconButton size="small" onClick={decreaseFontSize} disabled={fontSize === MINIMAL_FONT_SIZE}>
                  <TextDecrease fontSize="inherit"/>
                </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Reset font size" onClick={resetFontSize}>
                <span>
                <IconButton size="small" disabled={fontSize === DEFAULT_FONT_SIZE}>
                  <TextFormat fontSize="inherit"/>
                </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>

        {!assigningLabels &&
          <Grid item>
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

        <Grid item>
          <Grid container>
            <Grid item>
              <Tooltip title="Next Entry">
                <span>
                <IconButton
                  color="primary"
                  onClick={goToNext}
                  disabled={entryIndex === 0}
                >
                  <ChevronLeftIcon/>
                </IconButton>
                </span>
              </Tooltip>
            </Grid>
            <Grid item>
              <Tooltip title="Previous Entry">
                <span>
                <IconButton
                  color="primary"
                  onClick={goToPrevious}
                  disabled={entryIndex === entries.all.length - 1}
                >
                  <ChevronRightIcon/>
                </IconButton>
                </span>
              </Tooltip>
            </Grid>
          </Grid>
        </Grid>
      </StickyGrid>

      {/* Content */}
      <ContentContainer className="noMarginParagraph ql-editor">
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
            fontSize={fontSize}
          />))}
      </ContentContainer>

      {/* Assign Labels Dialog */}
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
              <ListItemText primary={label.name} secondary={label.description}/>
            </ListItem>
          ))}
        </List>
      </Dialog>
    </div>
  );
};

export default JournalEntry;