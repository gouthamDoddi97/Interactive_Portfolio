import React from 'react';
import styled from 'styled-components';

const BULLET_WIDTH = 200;
const BULLET_HEIGHT = 100;

// Responsive sizing functions - slightly bigger than before
const getBulletWidth = () => {
  if (window.innerWidth <= 480) return Math.min(BULLET_WIDTH * 0.45, window.innerWidth * 0.15);
  if (window.innerWidth <= 768) return Math.min(BULLET_WIDTH * 0.55, window.innerWidth * 0.18);
  return BULLET_WIDTH;
};

const getBulletHeight = () => {
  if (window.innerWidth <= 480) return Math.min(BULLET_HEIGHT * 0.45, window.innerWidth * 0.08);
  if (window.innerWidth <= 768) return Math.min(BULLET_HEIGHT * 0.55, window.innerWidth * 0.1);
  return BULLET_HEIGHT;
};

const BulletContainer = styled.div.attrs(props => ({
  style: {
    bottom: props.$currentY + 'px',
    left: props.$startX + 'px',
    width: getBulletWidth() + 'px',
    height: getBulletHeight() + 'px',
  }
}))`
background-image: url('/Interactive_Portfolio/game/bullet.png');
background-size: contain;
background-repeat: no-repeat;
background-position: center;
position: absolute;
transform: translateX(-50%); /* Center horizontally based on startX */
opacity: 1;
z-index: 99; /* TEMPORARY: High z-index to ensure visibility */
`;

const Bullet = ({ id, startX, currentY }) => {
  return (
    <BulletContainer $startX={startX} $currentY={currentY} />
  );
};

export default Bullet;