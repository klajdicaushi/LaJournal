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
import Select from "@mui/material/Select";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
// other
import { formatDate, timeFrom, getEntriesCountDisplay, formatMonth, formatYear, formatWeek } from "../helpers";
import axiosInstance from "../axios";
import { useNavigate } from "react-router";
import { LineChart, BarChart } from "@mui/x-charts";

function getLabelsCountDisplay(count) {
  return `${count} ${count === 1 ? "label" : "labels"}`;
}

function getTimesUsedDisplay(count) {
  return `${count || 0} ${count === 1 ? "time" : "times"}`;
}


const formatters = {
  "week": formatWeek,
  "month": formatMonth,
  "year": formatYear
}

const charts = {
  "line": LineChart,
  "bar": BarChart
}


const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null)
  const [period, setPeriod] = useState("month")
  const [showTimeline, setShowTimeline] = useState(false)
  const [timeline, setTimeline] = useState(null)
  const [chartType, setChartType] = useState("line");

  useEffect(() => {
    axiosInstance.get("/entries/stats")
      .then(response => setStats(response.data));
    axiosInstance.get("/entries/timeline")
      .then(response => setTimeline(response.data))
  }, [])

  const goToPath = useCallback((path) => () => {
    navigate(path);
  }, []);

  const toggleShowTimeline = useCallback(() => {
    setShowTimeline(prevState => !prevState)
  }, []);

  const handlePeriodChange = useCallback((event) => {
    setPeriod(event.target.value)
  }, []);

  const handleChartTypeChange = useCallback((event) => {
    setChartType(event.target.value)
  }, []);

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
  ];


  let chartOptions = {};
  const Chart = charts[chartType];

  if (timeline) {
    chartOptions = {
      dataset: timeline[period],
      xAxis: [{
        scaleType: 'band',
        dataKey: 'period',
        valueFormatter: formatters[period]
      }],
      series: [{
        dataKey: 'count',
        label: 'Count',
      }],
      slotProps: {legend: {hidden: true}},
      height: 300
    };
  }

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

      <Grid container spacing={2} alignItems="center" sx={{marginTop: 1}}>
        <Grid item>
          <FormControlLabel
            control={<Switch checked={showTimeline} onClick={toggleShowTimeline}/>}
            label="Entries timeline"
          />
        </Grid>

        {showTimeline &&
          <>
            <Grid item>
              <FormControl variant="standard" sx={{minWidth: 100}}>
                <Select
                  labelId="period-label"
                  id="period-select"
                  value={period}
                  onChange={handlePeriodChange}
                >
                  <MenuItem value="week">By Week</MenuItem>
                  <MenuItem value="month">By Month</MenuItem>
                  <MenuItem value="year">By Year</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item>
              <FormControl variant="standard" sx={{minWidth: 60}}>
                <Select
                  labelId="chart-type-label"
                  id="chart-type-select"
                  value={chartType}
                  onChange={handleChartTypeChange}
                >
                  <MenuItem value="line">Line</MenuItem>
                  <MenuItem value="bar">Bar</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </>}
      </Grid>

      {showTimeline &&
        <>
          {!timeline && <div>Loading...</div>}
          {timeline && <Chart {...chartOptions}/>}
        </>}

    </div>
  );
};

export default Dashboard;