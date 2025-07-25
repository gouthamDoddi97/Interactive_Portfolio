import React, { useEffect, useRef } from 'react';
import styled, { keyframes } from 'styled-components';

const bulletTravel = keyframes`
  from { transform: translateY(0); opacity: 1; }
  to { transform: translateY(calc(-100vh - 50px)); opacity: 0; }
`;

const BulletContainer = styled.div`
width: 200px; /* Adjust to the actual width of your bullet sprite */
height: 100px; /* Adjust to the actual height of your bullet sprite */
background-image: url(${process.env.PUBLIC_URL}/game/bullet.png);
background-size: contain; /* Or adjust as needed: e.g., '100% 100%' */
background-repeat: no-repeat;
background-position: center;
position: absolute;
bottom: ${props => props.$startY}px;
left: ${props => props.$startX}px;
transform: translateX(-50%); /* Center horizontally based on startX */
opacity: 1; /* Always visible for debugging */
background-color: transparent; /* Ensure transparency */
z-index: 9; /* Above jet and falling bricks */
animation: ${bulletTravel} ${props => props.$duration}s linear forwards;
`;

const Bullet = ({ id, startX, startY, targetY, duration, onAnimationComplete }) => {
const bulletRef = useRef(null);

useEffect(() => {
const node = bulletRef.current;
const handleAnimationEnd = () => {
onAnimationComplete(id);
};

if (node) {
  node.addEventListener('animationend', handleAnimationEnd);
}

return () => {
  if (node) {
    node.removeEventListener('animationend', handleAnimationEnd);
  }
};
}, [id, onAnimationComplete]);

return (
  <BulletContainer
    ref={bulletRef}
    $startX={startX}
    $startY={startY}
    $duration={duration}
  />
);
};

export default Bullet;