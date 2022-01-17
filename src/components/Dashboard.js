import React, { useCallback, useEffect, useState } from "react";
// redux
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
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
  }, [])

  if (!stats)
    return "Loading...";

  const cards = [
    {
      header: `${stats.total_entries} entries`,
      description: "This is the total number of entries you have written",
      path: "/entries"
    },
    {
      header: stats.latest_entry ? `${timeFrom(stats.latest_entry.created_at)}` : "Never",
      description: "Last entry created",
      path: stats.latest_entry ? `/entries/${stats.latest_entry.id}` : null
    },
    {
      header: `${stats.total_labels_used} labels used`,
      description: "This is the total number of labels you have used in entries",
      path: "/labels"
    },
    {
      header: stats.most_used_label ? `${stats.most_used_label.name}` : "None",
      description: `This is the label you have used the most: ${stats.most_used_label ? stats.most_used_label.count : 0} time/s`,
      path: "/labels"
    },
  ]

  return (
    <div>
      <Grid container spacing={1}>
        {cards.map(card => (
          <Grid item xs={6} lg={3}>
            <Card>
              <CardActionArea onClick={card.path ? goToPath(card.path) : undefined}>
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