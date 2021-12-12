import React, { useCallback } from "react";
// redux
import { useDispatch, useSelector } from "react-redux";
import selectors from "../redux/selectors";
import { push } from "connected-react-router";
// components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import TypographyWithMaxRows from "./reusable/TypographyWithMaxRows";
import MoodPicker from "./reusable/MoodPicker";
//icons
import AddIcon from "@mui/icons-material/Add";
// other
import { formatDate } from "../helpers";

const Journal = () => {
  const entries = useSelector(selectors.extractEntries);
  const dispatch = useDispatch();

  const openEntry = useCallback((entryId) => () => {
    dispatch(push(`/entries/${entryId}`))
  }, []);

  const openNewEntry = useCallback(() => {
    dispatch(push(`/entries/new`))
  }, []);

  return (
    <div>
      <Button variant="outlined" startIcon={<AddIcon/>} sx={{marginBottom: 1}} onClick={openNewEntry}>
        New Entry
      </Button>

      <Grid container spacing={2}>
        {entries.all.map(entry => (
          <Grid item key={entry.id} xs={12} lg={6} xl={3}>
            <Card>
              <CardActionArea onClick={openEntry(entry.id)}>
                <CardContent sx={{height: 211}}>
                  <Typography variant="h6">
                    {entry.title || "No title"}
                  </Typography>
                  <Grid container spacing={1} alignItems="center">
                    <Grid item>
                      <Typography gutterBottom variant="caption" display="block">
                        {formatDate(entry.date)}
                      </Typography>
                    </Grid>
                    <Grid item>
                      <MoodPicker readOnly value={entry.rating}/>
                    </Grid>
                  </Grid>
                  <TypographyWithMaxRows variant="body2" rows={5}>
                    {entry.content}
                  </TypographyWithMaxRows>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Journal;