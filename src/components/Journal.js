import React, { useCallback, useEffect } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import entryActions from "../redux/entries/actions";
// components
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
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
      // Empty search query on unmount
      dispatch(entryActions.setFilters({searchQuery: null}))
    }
  }, [])

  const openNewEntry = useCallback(() => {
    navigate(`/entries/new`)
  }, []);

  const handleSearchQueryChange = (event) => {
    dispatch(entryActions.setFilters({searchQuery: event.target.value}))
  };

  const labelsById = {}
  labels.all.forEach(label => {
    labelsById[label.id] = label.name
  });

  const entriesToShow = entries.filters.searchQuery ? entries.filtered : entries.all;

  return (
    <div>
      <Grid container spacing={1} alignItems="center" sx={{marginBottom: 2}}>
        <Grid item>
          <Button variant="outlined" startIcon={<AddIcon/>} sx={{marginBottom: 1}} onClick={openNewEntry}>
            New Entry
          </Button>
        </Grid>
        <Grid item xs>
          <TextField
            fullWidth
            label="Search title..."
            variant="outlined"
            value={entries.filters.searchQuery}
            onChange={handleSearchQueryChange}
          />
        </Grid>
      </Grid>

      <EntriesList entries={entriesToShow}/>
    </div>
  );
};

export default Journal;