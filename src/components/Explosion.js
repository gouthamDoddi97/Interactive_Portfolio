import React, { useEffect } from 'react';
import styled, { keyframes } from 'styled-components';

const EXPLOSION_FRAME_WIDTH = 128;
const EXPLOSION_FRAME_HEIGHT = 171;
const EXPLOSION_TOTAL_FRAMES = 2; // Total frames in the sprite sheet
const EXPLOSION_COLS = 8;
const EXPLOSION_ROWS = 6;

// Optimized keyframes for smoother animation
const explosionAnimation = keyframes`
  from { background-position: 0 0; }
  to { background-position: -${EXPLOSION_FRAME_WIDTH * EXPLOSION_COLS}px -${EXPLOSION_FRAME_HEIGHT * EXPLOSION_ROWS}px; }
`;

const ExplosionContainer = styled.div`
  width: ${EXPLOSION_FRAME_WIDTH}px;
  height: ${EXPLOSION_FRAME_HEIGHT}px;
  background-image: url('/Interactive_Portfolio/game/explosion.png');
  background-size: ${EXPLOSION_FRAME_WIDTH * EXPLOSION_COLS}px ${EXPLOSION_FRAME_HEIGHT * EXPLOSION_ROWS}px;
  background-repeat: no-repeat;
  position: absolute;
  z-index: 15;
  transform: translateX(-50%); /* Center the explosion */

  /* Faster, smoother animation */
  animation: ${explosionAnimation} 0.4s steps(${EXPLOSION_TOTAL_FRAMES}) forwards;
`;

const Explosion = ({ x, y, onAnimationComplete }) => {
  useEffect(() => {
    // Faster cleanup - reduced from 800ms to 400ms
    const timer = setTimeout(() => {
      onAnimationComplete();
    }, 400); // Match the faster animation duration
    return () => clearTimeout(timer);
  }, [onAnimationComplete]);

  return (
    <ExplosionContainer style={{ left: x, bottom: y }} />
  );
};

export default Explosion;
