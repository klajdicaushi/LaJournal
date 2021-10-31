import React from 'react';
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
// other
import { formatDate } from "../helpers";
import MoodPicker from "./reusable/MoodPicker";


const Journal = () => {
  const entries = useSelector(selectors.extractEntries);

  return (
    <div>
      <Grid container spacing={2}>
        {entries.all.map(entry => (
          <Grid item xs={12} lg={6} xl={3}>
            <Card key={entry.id}>
              <CardActionArea>
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