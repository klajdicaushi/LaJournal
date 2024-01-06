import React, { useCallback, useEffect, useState } from "react";
// redux
import { useDispatch } from "react-redux";
import labelActions from "../redux/labels/actions";
// components
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
// other
import { formatDate, timeFrom } from "../helpers";
import axiosInstance from "../axios";
import { useNavigate } from "react-router";

function getEntriesCountDisplay(count) {
  return `${count} ${count === 1 ? "entry" : "entries"}`;
}

function getLabelsCountDisplay(count) {
  return `${count} ${count === 1 ? "label" : "labels"}`;
}

function getTimesUsedDisplay(count) {
  return `${count || 0} ${count === 1 ? "time" : "times"}`;
}


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null)

  useEffect(() => {
    axiosInstance.get("/entries/stats")
      .then(response => setStats(response.data))
  }, [])

  const goToPath = useCallback((path) => () => {
    navigate(path);
  }, []);

  // const goToMostUsedLabelEntries = useCallback(() => {
  //   dispatch(entryActions.setSelectedLabelIds([stats.most_used_label.id]))
  //   navigate("/entries");
  // }, [stats])

  const showParagraphsOfMostUsedLabel = useCallback(() => {
    dispatch(labelActions.setLabelToShowParagraphs(stats.most_used_label.id));
    navigate("/labels");
  }, [stats])

  if (!stats)
    return "Loading...";

  const cards = [
    {
      header: getEntriesCountDisplay(stats.entries_this_month),
      description: "This month",
      onClick: goToPath("/entries")
    },
    {
      header: getEntriesCountDisplay(stats.entries_this_year),
      description: "This year",
      onClick: goToPath("/entries")
    },
    {
      header: getEntriesCountDisplay(stats.total_entries),
      description: "Total",
      onClick: goToPath("/entries")
    },
    {
      header: getEntriesCountDisplay(stats.bookmarked_entries),
      description: "Bookmarked",
      onClick: goToPath("/bookmarks")
    },
    {
      header: stats.latest_entry ? `${timeFrom(stats.latest_entry.created_at)}` : "Never",
      tooltip: stats.latest_entry ? formatDate(stats.latest_entry.created_at) : undefined,
      description: "Last entry created",
      onClick: stats.latest_entry ? goToPath(`/entries/${stats.latest_entry.id}`) : undefined
    },
    {
      header: getLabelsCountDisplay(stats.total_labels_used),
      description: "Total number of labels used in entries",
      onClick: goToPath("/labels")
    },
    {
      header: stats.most_used_label ? `${stats.most_used_label.name}` : "None",
      description: `The label used the most: ${getTimesUsedDisplay(stats.most_used_label?.paragraphs_count)}`,
      onClick: stats.most_used_label ? showParagraphsOfMostUsedLabel : undefined
    },
  ]

  return (
    <div>
      <Grid container spacing={1}>
        {cards.map((card, index) => (
          <Grid item xs={6} lg={3} key={index}>
            <Card>
              <CardActionArea onClick={card.onClick} style={{height: 112}}>
                <CardContent>
                  <Typography gutterBottom variant="h5" title={card.tooltip}>
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