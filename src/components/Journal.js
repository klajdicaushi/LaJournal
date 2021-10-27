import React, { useCallback } from 'react';
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import axios from "../axios";

const Journal = () => {
  const createJournalEntry = useCallback(() => {
    axios.get("/entries").then(response => {
      console.log(response.data)
    })
  }, []);

  return (
    <div>
      <Typography>Journal</Typography>
      <p>
        <Button onClick={createJournalEntry}>Test</Button>
      </p>
    </div>
  );
};

export default Journal;