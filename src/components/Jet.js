import React from 'react';
import styled from 'styled-components';

const JET_FRAME_WIDTH = 290; // Exact width of a single jet frame
const JET_FRAME_HEIGHT = 150;  // Exact height of a single jet frame (total height of jet.png / 7)
const JET_TOTAL_FRAMES = 1;   // Confirmed: 7 frames in your sprite sheet

// Responsive sizing functions - same as in Game.js
const getJetWidth = () => {
  if (window.innerWidth <= 480) return Math.min(JET_FRAME_WIDTH * 0.3, window.innerWidth * 0.22);
  if (window.innerWidth <= 768) return Math.min(JET_FRAME_WIDTH * 0.4, window.innerWidth * 0.28);
  return JET_FRAME_WIDTH;
};

const getJetHeight = () => {
  if (window.innerWidth <= 480) return Math.min(JET_FRAME_HEIGHT * 0.3, window.innerWidth * 0.12);
  if (window.innerWidth <= 768) return Math.min(JET_FRAME_HEIGHT * 0.4, window.innerWidth * 0.15);
  return JET_FRAME_HEIGHT;
};

// Styled component for the jet container
const JetContainer = styled.div.attrs(props => ({
  style: {
    left: props.$x + 'px',
    bottom: props.$y + 'px',
    width: getJetWidth() + 'px',
    height: getJetHeight() + 'px',
    backgroundSize: getJetWidth() + 'px auto',
  }
}))`
  background-image: url('/Interactive_Portfolio/game/jet.png');
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

  /* Flying animation for main menu */
  animation: jetPropellerAnimation 0.7s steps(${JET_TOTAL_FRAMES}) infinite, flyingAnimation 3s ease-in-out infinite;

  @keyframes flyingAnimation {
    0%, 100% { transform: translateX(-50%) translateY(0px); }
    50% { transform: translateX(-50%) translateY(-8px); }
  }
`;

// Jet component now accepts x and y props
const Jet = ({ x, y }) => {
  console.log('Jet rendering with x:', x, 'y:', y);
  return (
    <JetContainer $x={x} $y={y} />
  );
};

export default Jet;