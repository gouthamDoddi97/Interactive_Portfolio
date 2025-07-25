

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const JET_FRAME_WIDTH = 290; // Exact width of a single jet frame
const JET_FRAME_HEIGHT = 150;  // Exact height of a single jet frame (total height of jet.png / 7)
const JET_TOTAL_FRAMES = 1;   // Confirmed: 7 frames in your sprite sheet

// Styled component for the jet container
const JetContainer = styled.div`
  width: ${JET_FRAME_WIDTH}px;
  height: ${JET_FRAME_HEIGHT}px;
  background-image: url('/game/jet.png');
  background-size: ${JET_FRAME_WIDTH}px auto; /* Ensure full width, auto height */
  background-repeat: no-repeat;
  position: absolute;
  bottom: 50px; /* Adjust position as needed */
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  
  /* Jet propeller animation */
  animation: jetPropellerAnimation 0.7s steps(${JET_TOTAL_FRAMES}) infinite;

  @keyframes jetPropellerAnimation {
    from { background-position: 0 0; }
    to { background-position: 0 ${-(JET_FRAME_HEIGHT * JET_TOTAL_FRAMES)}px; }
    /* The 'to' position should be (0, -total_sprite_sheet_height) or if scaled, (0, -scaled_height) */
    /* Since we set background-size to JET_FRAME_WIDTH auto, the scaled height is the actual image height (409px) */
    /* So, for 7 frames, it moves the background image up by the full height of the sprite sheet */
    /* Example: if your sprite sheet is 409px tall, it goes from 0px to -409px */
  }

  /* Add styling for firing effect if you want a temporary visual change */
  &.firing {
    /* Example: slightly brighter background, or a subtle glow */
    filter: brightness(1.2);
    /* You could also swap out the background-image if you had a separate jet_firing.png */
  }
`;

const Jet = ({ isFiring }) => {
  return (
    <JetContainer className={isFiring ? 'firing' : ''}>
      {/* Bullet components will be rendered here or by the parent */}
    </JetContainer>
  );
};

export default Jet;