import React, { useCallback, useEffect } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import entryActions from "../redux/entries/actions";
// components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import OutlinedInput from '@mui/material/OutlinedInput';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import MenuItem from '@mui/material/MenuItem';
import EntriesList from "./reusable/EntriesList";
//icons
import AddIcon from "@mui/icons-material/Add";
// other
import { useNavigate } from "react-router";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const Journal = () => {
  const entries = useSelector(selectors.extractEntries);
  const labels = useSelector(selectors.extractLabels);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Deselected labels on unmount
      dispatch(entryActions.setSelectedLabelIds([]))
    }
  }, [])

  const openNewEntry = useCallback(() => {
    navigate(`/entries/new`)
  }, []);

  const handleLabelsSelectChange = (event) => {
    const value = event.target.value;
    const selectedLabelIds = typeof value === 'string' ? value.split(',') : value;

    dispatch(entryActions.setSelectedLabelIds(selectedLabelIds))
  };

  const labelsById = {}
  labels.all.forEach(label => {
    labelsById[label.id] = label.name
  });

  const entriesToShow = entries.selectedLabelIds.length > 0 ? entries.filtered : entries.all;

  return (
    <div>
      <Grid container spacing={1} alignItems="center" sx={{marginBottom: 2}}>
        <Grid item>
          <Button variant="outlined" startIcon={<AddIcon/>} sx={{marginBottom: 1}} onClick={openNewEntry}>
            New Entry
          </Button>
        </Grid>
        <Grid item xs>
          <FormControl fullWidth>
            <InputLabel>Labels</InputLabel>
            <Select
              multiple
              value={entries.selectedLabelIds}
              onChange={handleLabelsSelectChange}
              fullWidth
              input={<OutlinedInput label="Chip"/>}
              renderValue={(selected) => (
                <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                  {selected.map((labelId) => (
                    <Chip key={labelId} label={labelsById[labelId]}/>
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {labels.all.map(label => (
                <MenuItem
                  key={label.id}
                  value={label.id}
                  // style={getStyles(name, personName, theme)}
                >
                  {label.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>

      <EntriesList entries={entriesToShow}/>
    </div>
  );
};

export default Journal;