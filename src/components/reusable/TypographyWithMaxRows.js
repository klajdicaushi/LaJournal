import React from 'react';
import styled from "styled-components";
import Typography from "@mui/material/Typography";
import PropTypes from "prop-types";

const StyledTypography = styled(Typography)`
  display: -webkit-box;
  -webkit-line-clamp: ${props => props.$rows};
  -webkit-box-orient: vertical;
  overflow-y: hidden;
`;


const TypographyWithMaxRows = ({children, rows}) => (
  <StyledTypography $rows={rows} component="div">
    {children}
  </StyledTypography>
);

TypographyWithMaxRows.defaultProps = {
  rows: 4
}

TypographyWithMaxRows.propTypes = {
  rows: PropTypes.number,
}

export default TypographyWithMaxRows;