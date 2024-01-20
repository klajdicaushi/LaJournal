import React, { memo, useCallback } from "react";
// components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import MoodPicker from "./MoodPicker";
// icons
import BookmarkIcon from "@mui/icons-material/Bookmark";
// other
import { formatDate } from "../../helpers";
import { useNavigate } from "react-router";

const EntriesList = ({entries}) => {
  const navigate = useNavigate();

  const openEntry = useCallback((entryId) => () => {
    navigate(`/entries/${entryId}`)
  }, []);

  return (
    <Grid container spacing={2}>
      {entries.map(entry => (
        <Grid item key={entry.id} xs={12} lg={6} xl={3}>
          <Card>
            <CardActionArea onClick={openEntry(entry.id)}>
              <CardContent>
                <Typography variant="h6" sx={{xl: {maxWidth: 250}}} title={entry.title || "No title"} noWrap>
                  {entry.title || "No title"}
                </Typography>
                <Grid container alignItems="center" justifyContent="space-between">
                  <Grid item>
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
                  </Grid>

                  {entry.is_bookmarked &&
                    <Grid item>
                      <Tooltip title="Bookmarked">
                        <BookmarkIcon fontSize="small"/>
                      </Tooltip>
                    </Grid>}
                </Grid>
              </CardContent>
            </CardActionArea>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default memo(EntriesList);