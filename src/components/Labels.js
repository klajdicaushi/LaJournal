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
import ConfirmDialog from "./reusable/ConfirmDialog";

const emptyLabel = () => ({name: "", questionsHint: ""});

const Labels = () => {
  const labels = useSelector(selectors.extractLabels);
  const dispatch = useDispatch();
  const [newLabel, setNewLabel] = useState(emptyLabel());
  const [labelToDelete, setLabelToDelete] = useState(null);

  useEffect(() => {
    if (!labels.creatingNewLabel)
      setNewLabel(emptyLabel());
  }, [labels.creatingNewLabel]);

  useEffect(() => {
    if (!labels.deletingLabel)
      setLabelToDelete(null);
  }, [labels.deletingLabel]);


  const onNewLabelChange = useCallback(attr => event => {
    setNewLabel(prevState => ({...prevState, [attr]: event.target.value}));
  }, []);

  const confirmNewLabel = useCallback(() => {
    dispatch(labelActions.createNewLabel(newLabel));
  }, [newLabel])

  const onNewLabelKeyPress = useCallback(event => {
    if (event.key === "Enter")
      confirmNewLabel();
  }, [newLabel]);

  const selectLabelToDelete = useCallback((label) => () => {
    setLabelToDelete(label);
  }, []);

  const confirmDeleteLabel = useCallback(() => {
    dispatch(labelActions.deleteLabel(labelToDelete.id));
  }, [labelToDelete]);

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
                onChange={onNewLabelChange('name')}
                startAdornment={
                  <InputAdornment position="start">
                    <TagIcon/>
                  </InputAdornment>
                }
                onKeyPress={onNewLabelKeyPress}
              />
            }
            secondary={
              <Input
                fullWidth
                placeholder="Questions Hint"
                value={newLabel.questionsHint}
                onChange={onNewLabelChange('questionsHint')}
                startAdornment={
                  <InputAdornment position="start">
                    <HelpIcon/>
                  </InputAdornment>
                }
                size="small"
                onKeyPress={onNewLabelKeyPress}
              />
            }
          />
        </ListItem>

        {labels.all.map(label => (
          <ListItem
            key={label.id}
            secondaryAction={
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip title="Edit">
                    <IconButton edge="end" aria-label="edit">
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Delete">
                    <IconButton edge="end" aria-label="delete" color="error" onClick={selectLabelToDelete(label)}>
                      <DeleteIcon/>
                    </IconButton>
                  </Tooltip>
                </Grid>
              </Grid>
            }
          >
            <ListItemAvatar>
              <Avatar>
                <LabelIcon/>
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={label.name}
              secondary={label.questions_hint}
            />
          </ListItem>
        ))}
      </List>

      <ConfirmDialog
        text={labelToDelete && `Are you sure you want to delete label ${labelToDelete.name}?`}
        open={Boolean(labelToDelete)}
        onCancel={selectLabelToDelete(null)}
        onConfirm={confirmDeleteLabel}
      />
    </div>
  );
};

export default Labels;