import React, { useCallback } from 'react';
import { Button } from "@mui/material";
import axios from "../axios";

const Journal = () => {
  const createJournalEntry = useCallback(() => {
    axios.get("/entries").then(response => {
      console.log(response.data)
    })
  }, [])

  return (
    <div>
      <p>Journal</p>
      <p>
        <Button onClick={createJournalEntry}>Test</Button>
      </p>
    </div>
  );
};

export default Journal;