import React from 'react';
import styled from 'styled-components';

const JET_FRAME_WIDTH = 290; // Exact width of a single jet frame
const JET_FRAME_HEIGHT = 150;  // Exact height of a single jet frame (total height of jet.png / 7)
const JET_TOTAL_FRAMES = 1;   // Confirmed: 7 frames in your sprite sheet

// Styled component for the jet container
const JetContainer = styled.div.attrs(props => ({
  style: {
    left: props.$x + 'px',
    bottom: props.$y + 'px',
  }
}))`
  width: ${JET_FRAME_WIDTH}px;
  height: ${JET_FRAME_HEIGHT}px;
  background-image: url('/game/jet.png');
  background-size: ${JET_FRAME_WIDTH}px auto; /* Ensure full width, auto height */
  background-repeat: no-repeat;
  position: absolute;
  transform: translateX(-50%); /* Center horizontally relative to its left position */
  z-index: 10;
  
  /* Jet propeller animation */
  animation: jetPropellerAnimation 0.7s steps(${JET_TOTAL_FRAMES}) infinite;

  @keyframes jetPropellerAnimation {
    from { background-position: 0 0; }
    to { background-position: 0 ${-(JET_FRAME_HEIGHT * JET_TOTAL_FRAMES)}px; }
  }
`;

// Jet component now accepts x and y props
const Jet = ({ x, y }) => {
  return (
    <JetContainer $x={x} $y={y} />
  );
};

export default Jet;