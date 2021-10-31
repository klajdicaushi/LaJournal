import React, { useCallback } from "react";
// redux
import { useSelector } from "react-redux";
import selectors from "../redux/selectors";
// components
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import Typography from '@mui/material/Typography';
import Grid from "@mui/material/Grid";
import TypographyWithMaxRows from "./reusable/TypographyWithMaxRows";
import MoodPicker from "./reusable/MoodPicker";
// other
import { formatDate } from "../helpers";
import { withRouter } from "react-router-dom";


const Journal = ({history}) => {
  const entries = useSelector(selectors.extractEntries);

  const openEntry = useCallback((entryId) => () => {
    history.push(`/entries/${entryId}`);
  }, [history]);

  return (
    <div>
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

export default withRouter(Journal);