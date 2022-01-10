import React, { useCallback, useEffect, useState } from 'react';
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import labelActions from "../redux/labels/actions";
// components
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Input from "@mui/material/Input";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
// icons
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import HelpIcon from "@mui/icons-material/Help";
import TagIcon from "@mui/icons-material/Tag";
import CloseIcon from "@mui/icons-material/Close";
// other
import { useConfirm } from "material-ui-confirm";

const emptyLabel = () => ({name: "", questionsHint: ""});

const Label = ({label, onEdit, onDelete}) => {
  const [editing, setEditing] = useState(false);
  const [editedLabel, setEditedLabel] = useState(label);

  useEffect(() => {
    setEditing(false);
    setEditedLabel(label);
  }, [label])

  const toggleEdit = useCallback(() => {
    setEditing(prevState => !prevState);
  }, []);
  
  const handleEditedLabelChange = useCallback((attr) => (event) => {
    setEditedLabel(prevState => ({...prevState, [attr]: event.target.value}))
  }, []);

  const handleEditedLabelKeyPress = useCallback(event => {
    if (event.key === "Enter")
      confirmEditLabel();
  }, [editedLabel]);

  const confirmEditLabel = useCallback(() => {
    onEdit(editedLabel)
  }, [editedLabel])

  let primary, secondary, buttons;
  if (editing) {
    primary = (
      <Input
        fullWidth
        autoFocus
        placeholder="Name"
        value={editedLabel.name}
        onChange={handleEditedLabelChange('name')}
        onKeyPress={handleEditedLabelKeyPress}
      />
    );
    secondary = (
      <Input
        fullWidth
        placeholder="Questions Hint"
        value={editedLabel.questions_hint}
        onChange={handleEditedLabelChange('questions_hint')}
        size="small"
        onKeyPress={handleEditedLabelKeyPress}
      />
    );
    buttons = [
      {tooltip: "Cancel", icon: <CloseIcon/>, onClick: toggleEdit},
      {tooltip: "Confirm", icon: <CheckIcon/>, onClick: confirmEditLabel},
    ];
  } else {
    primary = label.name;
    secondary = label.questions_hint;
    buttons = [
      {tooltip: "Edit", icon: <EditIcon/>, onClick: toggleEdit},
      {tooltip: "Delete", icon: <DeleteIcon/>, onClick: onDelete},
    ];
  }

  return (
    <ListItem
      secondaryAction={
        <Grid container spacing={2}>
          {buttons.map((button, index) => (
            <Grid item key={index}>
              <Tooltip title={button.tooltip}>
                <IconButton edge="end" aria-label={button.tooltip} onClick={button.onClick}>
                  {button.icon}
                </IconButton>
              </Tooltip>
            </Grid>
          ))}
        </Grid>
      }
    >
      <ListItemAvatar>
        <Avatar>
          <LabelIcon/>
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={primary}
        secondary={secondary}
      />
    </ListItem>
  )
};

const Labels = () => {
  const labels = useSelector(selectors.extractLabels);
  const dispatch = useDispatch();
  const [newLabel, setNewLabel] = useState(emptyLabel());
  const confirm = useConfirm();

  useEffect(() => {
    if (!labels.creatingNewLabel)
      setNewLabel(emptyLabel());
  }, [labels.creatingNewLabel]);

  const handleNewLabelChange = useCallback(attr => event => {
    setNewLabel(prevState => ({...prevState, [attr]: event.target.value}));
  }, []);

  const confirmNewLabel = useCallback(() => {
    if (!newLabel.name)
      return;
    dispatch(labelActions.createNewLabel(newLabel));
  }, [newLabel])

  const handleNewLabelKeyPress = useCallback(event => {
    if (event.key === "Enter")
      confirmNewLabel();
  }, [newLabel]);

  const confirmEditLabel = useCallback(label => {
    dispatch(labelActions.editLabel(label));
  }, [])

  const handleDelete = useCallback((label) => () => {
    confirm({title: "Are you sure?", description: `Deleting label: ${label.name}`})
      .then(() => {
        dispatch(labelActions.deleteLabel(label.id));
      })
      .catch(() => {
      })
  }, [])

  return (
    <div>
      <List dense>
        <ListItem
          secondaryAction={
            <Tooltip title="Confirm">
              <IconButton edge="end" aria-label="edit" onClick={confirmNewLabel}>
                <CheckIcon/>
              </IconButton>
            </Tooltip>
          }
        >
          <ListItemAvatar>
            <Avatar>
              <AddIcon/>
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              <Input
                fullWidth
                placeholder="Name"
                value={newLabel.name}
                onChange={handleNewLabelChange('name')}
                startAdornment={
                  <InputAdornment position="start">
                    <TagIcon/>
                  </InputAdornment>
                }
                onKeyPress={handleNewLabelKeyPress}
              />
            }
            secondary={
              <Input
                fullWidth
                placeholder="Questions Hint"
                value={newLabel.questionsHint}
                onChange={handleNewLabelChange('questionsHint')}
                startAdornment={
                  <InputAdornment position="start">
                    <HelpIcon/>
                  </InputAdornment>
                }
                size="small"
                onKeyPress={handleNewLabelKeyPress}
              />
            }
          />
        </ListItem>

        {labels.all.map(label => (
          <Label
            key={label.id}
            label={label}
            onEdit={confirmEditLabel}
            onDelete={handleDelete(label)}
          />
        ))}
      </List>
    </div>
  );
};

export default Labels;