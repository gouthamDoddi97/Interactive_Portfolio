import React from 'react';
import styled from 'styled-components';

const BulletContainer = styled.div.attrs(props => ({
  style: {
    bottom: props.$currentY + 'px',
    left: props.$startX + 'px',
  }
}))`
width: 200px; /* Adjust to the actual width of your bullet sprite */
height: 100px; /* Adjust to the actual height of your bullet sprite */
background-image: url(${process.env.PUBLIC_URL}/game/bullet.png);
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