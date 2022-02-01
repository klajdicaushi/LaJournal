import React from "react";
// components
import Rating from "@mui/material/Rating";
// icons
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentNeutralIcon from '@mui/icons-material/SentimentNeutral';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';
// other
import { green, orange, red, yellow } from "@mui/material/colors";
import styled from "styled-components";

const Mood = styled.span`
  ${props => props.$color && `color: ${props.$color}`}
`;

const moods = {
  1: {
    icon: <SentimentVeryDissatisfiedIcon/>,
    label: 'Really Bad',
    color: red[500]
  },
  2: {
    icon: <SentimentDissatisfiedIcon/>,
    label: 'Bad',
    color: orange[500]
  },
  3: {
    icon: <SentimentNeutralIcon/>,
    label: 'Average',
    color: yellow[500]
  },
  4: {
    icon: <SentimentSatisfiedAltIcon/>,
    label: 'Good',
    color: green[300]
  },
  5: {
    icon: <SentimentVerySatisfiedIcon/>,
    label: 'Great',
    color: green[500]
  },
};

function MoodPicker({value: selectedValue, ...other}) {
  function IconContainer({value, ...other}) {
    const isSelected = selectedValue === value;
    const currentMood = moods[value];
    return <Mood {...other} $color={isSelected && currentMood.color}>{currentMood.icon}</Mood>;
  }

  return (
    <Rating
      value={selectedValue}
      IconContainerComponent={IconContainer}
      highlightSelectedOnly
      {...other}
    />
  );
}

export default MoodPicker;