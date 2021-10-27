import React from 'react';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import selectors from "../redux/selectors";
import { useSelector } from "react-redux";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import Tooltip from "@mui/material/Tooltip";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteIcon from "@mui/icons-material/Delete";
import LabelIcon from "@mui/icons-material/Label";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import HelpIcon from "@mui/icons-material/Help";

const Labels = () => {
  const labels = useSelector(selectors.extractLabels);

  return (
    <div>
      <List dense>
        <ListItem
          secondaryAction={
            <Tooltip title="Confirm">
              <IconButton edge="end" aria-label="edit">
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
              <TextField
                fullWidth
                label="Name"
                variant="standard"
              />
            }
            secondary={
              <TextField
                fullWidth
                label="Questions Hint"
                variant="standard"
                startAdornment={
                  <InputAdornment position="start">
                    <HelpIcon/>
                  </InputAdornment>
                }
              />
            }
          />
        </ListItem>

        {labels.map(label => (
          <ListItem
            key={label.id}
            secondaryAction={
              <Grid container spacing={2}>
                <Grid item>
                  <Tooltip title="Edit">
                    <IconButton edge="end" aria-label="delete">
                      <EditIcon/>
                    </IconButton>
                  </Tooltip>
                </Grid>
                <Grid item>
                  <Tooltip title="Delete">
                    <IconButton edge="end" aria-label="delete" color="error">
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
    </div>
  );
};

export default Labels;