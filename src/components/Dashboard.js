import React, { useCallback, useEffect, useState } from "react";
// redux
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import labelActions from "../redux/labels/actions";
// components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// other
import { timeFrom } from "../helpers";
import axiosInstance from "../axios";

const Dashboard = () => {
  const dispatch = useDispatch();
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axiosInstance.get("/entries/stats")
      .then(response => setStats(response.data))
  }, [])

  const goToPath = useCallback((path) => () => {
    dispatch(push(path));
  }, []);

  // const goToMostUsedLabelEntries = useCallback(() => {
  //   dispatch(entryActions.setSelectedLabelIds([stats.most_used_label.id]))
  //   dispatch(push("/entries"))
  // }, [stats])

  const showParagraphsOfMostUsedLabel = useCallback(() => {
      dispatch(labelActions.setLabelToShowParagraphs(stats.most_used_label.id));
      dispatch(push("/labels"));
  }, [stats])

  if (!stats)
    return "Loading...";

  const cards = [
    {
      header: `${stats.total_entries} entries`,
      description: "This is the total number of entries you have written",
      onClick: goToPath("/entries")
    },
    {
      header: stats.latest_entry ? `${timeFrom(stats.latest_entry.created_at)}` : "Never",
      description: "Last entry created",
      onClick: stats.latest_entry ? goToPath(`/entries/${stats.latest_entry.id}`) : undefined
    },
    {
      header: `${stats.total_labels_used} labels used`,
      description: "This is the total number of labels you have used in entries",
      onClick: goToPath("/labels")
    },
    {
      header: stats.most_used_label ? `${stats.most_used_label.name}` : "None",
      description: `This is the label you have used the most: ${stats.most_used_label ? stats.most_used_label.count : 0} time/s`,
      onClick: stats.most_used_label ? showParagraphsOfMostUsedLabel : undefined
    },
  ]

  return (
    <div>
      <Grid container spacing={1}>
        {cards.map((card, index) => (
          <Grid item xs={6} lg={3} key={index}>
            <Card>
              <CardActionArea onClick={card.onClick}>
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {card.header}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {card.description}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default Dashboard;