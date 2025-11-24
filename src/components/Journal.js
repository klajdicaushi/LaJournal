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
import { useDebouncedEffect } from "../helpers";

const Journal = () => {
  const entries = useSelector(selectors.extractEntries);
  const labels = useSelector(selectors.extractLabels);
  const [searchQuery, setSearchQuery] = React.useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    return () => {
      // Empty search query on unmount
      dispatch(entryActions.setFilters({ searchQuery: "" }));
    };
  }, []);

  useDebouncedEffect(
    () => {
      dispatch(entryActions.setFilters({ searchQuery }));
    },
    [searchQuery],
    250
  );

  const openNewEntry = useCallback(() => {
    navigate(`/entries/new`);
  }, []);

  const handleSearchQueryChange = useCallback((event) => {
    setSearchQuery(event.target.value);
  }, []);

  const labelsById = {};
  labels.all.forEach((label) => {
    labelsById[label.id] = label.name;
  });

  const entriesToShow = entries.filters.searchQuery
    ? entries.filtered
    : entries.all;

  return (
    <div
      className="containerPadding"
      style={{ width: "100%", boxSizing: "border-box" }}
    >
      <Grid container spacing={1} alignItems="center" sx={{ marginBottom: 2 }}>
        <Grid item>
          <Button
            variant="outlined"
            startIcon={<AddIcon />}
            sx={{ marginBottom: 1 }}
            onClick={openNewEntry}
          >
            New Entry
          </Button>
        </Grid>
        <Grid size="grow">
          <TextField
            fullWidth
            label="Search title or content..."
            variant="outlined"
            value={searchQuery}
            onChange={handleSearchQueryChange}
          />
        </Grid>
      </Grid>

      <EntriesList entries={entriesToShow} />
    </div>
  );
};

export default Journal;
