import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const EXPLOSION_FRAME_WIDTH = 128; // From your analysis
const EXPLOSION_FRAME_HEIGHT = 171; // From your analysis (1024 / 6 rounded)
const EXPLOSION_TOTAL_FRAMES = 2; // From your analysis
const EXPLOSION_COLS = 8;
const EXPLOSION_ROWS = 6; // Used for calculation if needed, but steps handles it

// Keyframes for explosion sprite animation
const explosionSpriteAnimation = keyframes`
  from { background-position: 0 0; }
  to { background-position: ${-(EXPLOSION_FRAME_WIDTH * EXPLOSION_COLS)}px ${-(EXPLOSION_FRAME_HEIGHT * EXPLOSION_ROWS)}px; }
  /* This 'to' needs to be precise for a grid. It should go to the end of the last frame.
     A simpler approach for sequential steps is to simply use the total width/height of the sprite sheet
     and let steps() handle the individual frames. */
     /* Let's refine this to move across the entire sprite sheet */
`;

const ExplosionContainer = styled.div`
  width: ${EXPLOSION_FRAME_WIDTH}px;
  height: ${EXPLOSION_FRAME_HEIGHT}px;
  background-image: url('/game/explosion.png');
  background-size: auto ${EXPLOSION_FRAME_HEIGHT * EXPLOSION_ROWS}px; /* Scale background to fit all rows */
  background-repeat: no-repeat;
  position: absolute;
  z-index: 15; /* Above other elements */

  /* Animation for the sprite sheet */
  animation: playExplosionFrames 0.8s steps(${EXPLOSION_TOTAL_FRAMES}) forwards;
  /* Adjust duration and steps based on how fast you want the explosion */
  /* 'forwards' means it stays on the last frame after animation, then we'll remove it */

  @keyframes playExplosionFrames {
    from { background-position: 0 0; }
    to { background-position: -${EXPLOSION_FRAME_WIDTH * EXPLOSION_COLS}px -${EXPLOSION_FRAME_HEIGHT * EXPLOSION_ROWS}px; }
  }
`;

const Explosion = ({ x, y, onAnimationComplete }) => {
  useEffect(() => {
    // Automatically remove explosion after animation
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 800); // Match animation duration
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <ExplosionContainer style={{ left: x, bottom: y }} />
  );
};

export default Explosion;