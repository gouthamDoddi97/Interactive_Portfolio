import React, { useEffect, useCallback, useState } from 'react';
import { create } from 'zustand';
import styled from 'styled-components';
import { Howl } from 'howler';
import Jet from './components/Jet';
import Bullet from './components/Bullet';
import Explosion from './components/Explosion';
import { useNavigate } from 'react-router-dom'; // Import useNavigate


// Define sounds (ensure these files are in public/game/)
const shootSound = new Howl({ 
  src: ['/game/shoot.mp3'],
  onloaderror: () => console.log('Shoot sound not found, continuing without sound'),
  onplayerror: () => console.log('Shoot sound play error, continuing without sound')
});
const explosionSound = new Howl({ 
  src: ['/game/explosion.mp3'],
  onloaderror: () => console.log('Explosion sound not found, continuing without sound'),
  onplayerror: () => console.log('Explosion sound play error, continuing without sound')
});
const crashSound = new Howl({ 
  src: ['/game/crash.mp3'],
  onloaderror: () => console.log('Crash sound not found, continuing without sound'),
  onplayerror: () => console.log('Crash sound play error, continuing without sound')
});

// --- Game Constants ---
const JET_WIDTH = 290;
const JET_HEIGHT = 130;
const BULLET_WIDTH = 200;
const BULLET_HEIGHT = 100;
const FALLING_BRICK_WIDTH = 150;
const FALLING_BRICK_HEIGHT = 150;

// Responsive sizing functions
const getJetWidth = () => {
  if (window.innerWidth <= 480) return JET_WIDTH * 0.5;
  if (window.innerWidth <= 768) return JET_WIDTH * 0.7;
  return JET_WIDTH;
};

const getJetHeight = () => {
  if (window.innerWidth <= 480) return JET_HEIGHT * 0.5;
  if (window.innerWidth <= 768) return JET_HEIGHT * 0.7;
  return JET_HEIGHT;
};

const getBulletWidth = () => {
  if (window.innerWidth <= 480) return BULLET_WIDTH * 0.5;
  if (window.innerWidth <= 768) return BULLET_WIDTH * 0.7;
  return BULLET_WIDTH;
};

const getBulletHeight = () => {
  if (window.innerWidth <= 480) return BULLET_HEIGHT * 0.5;
  if (window.innerWidth <= 768) return BULLET_HEIGHT * 0.7;
  return BULLET_HEIGHT;
};

const getBrickWidth = () => {
  if (window.innerWidth <= 480) return FALLING_BRICK_WIDTH * 0.6;
  if (window.innerWidth <= 768) return FALLING_BRICK_WIDTH * 0.8;
  return FALLING_BRICK_WIDTH;
};

const getBrickHeight = () => {
  if (window.innerWidth <= 480) return FALLING_BRICK_HEIGHT * 0.6;
  if (window.innerWidth <= 768) return FALLING_BRICK_HEIGHT * 0.8;
  return FALLING_BRICK_HEIGHT;
};
// Explosion dimensions from Explosion.js
const EXPLOSION_FRAME_WIDTH = 128;
const EXPLOSION_FRAME_HEIGHT = 171;

// Make game dimensions truly full screen
const GAME_WIDTH_PERCENT = 1.0; // 100% of viewport width
const GAME_HEIGHT_PERCENT = 1.0; // 100% of viewport height

const GAME_AREA_PADDING = 50;
const GAME_AREA_PADDING_MOBILE = 20;
const GAME_AREA_PADDING_SMALL = 10;
const BRICK_SPAWN_INTERVAL_MS = 1500;
const BRICK_SPEED = 6;
const BULLET_SPEED = 18;
const BULLET_FIRE_RATE_MS = 200;

// --- Zustand Store ---
const useGameStore = create((set, get) => ({
  // Initialize game dimensions based on current window size (will be updated on mount)
  gameRenderWidth: window.innerWidth * GAME_WIDTH_PERCENT,
  gameRenderHeight: window.innerHeight * GAME_HEIGHT_PERCENT,

  jetX: window.innerWidth / 2,
  bullets: [],
  bricks: [],
  explosions: [], // Add explosions to state
  score: 0,
  gameOver: false,
  lastFireTime: 0, // Initialize lastFireTime
  missedBricks: 0, // Initialize missedBricks

  setGameDimensions: (width, height) => set({ gameRenderWidth: width, gameRenderHeight: height }),

  moveJet: (dir) =>
    set((state) => {
      const isMobile = window.innerWidth <= 768;
      const isSmall = window.innerWidth <= 480;
      const padding = isSmall ? GAME_AREA_PADDING_SMALL : isMobile ? GAME_AREA_PADDING_MOBILE : GAME_AREA_PADDING;
      const moveSpeed = isMobile ? 20 : 30;
      const screenWidth = window.innerWidth;
      const currentJetWidth = getJetWidth();
      
      return {
        jetX: Math.max(
          currentJetWidth / 2, // Left boundary: half jet width from left edge
          Math.min(screenWidth - currentJetWidth / 2, state.jetX + dir * moveSpeed) // Right boundary: half jet width from right edge
        ),
      };
    }),

  fireBullet: () => {
    const state = get();
    // Only allow firing if not game over and within fire rate
    if (state.gameOver) return;
    const now = performance.now();
    if (now - state.lastFireTime < BULLET_FIRE_RATE_MS) {
        return;
    }
    try {
      shootSound.play(); // Play sound
    } catch (error) {
      console.log('Could not play shoot sound');
    }
    set((state) => ({
      bullets: [
        ...state.bullets,
        {
          x: state.jetX, // Fire from jet center (bullet will be centered on this position)
          y: getJetHeight(), // Initial Y for bullets, from bottom
          id: Date.now() + Math.random(),
        },
      ],
      lastFireTime: now, // Update last fire time
    }));
  },

  tick: () => {
    const { bullets, bricks, jetX, score, gameOver, gameRenderHeight, gameRenderWidth, missedBricks } = get();
    if (gameOver) return;

    // Move bullets up
    const newBullets = bullets
      .map((b) => ({ ...b, y: b.y + BULLET_SPEED }))
      .filter((b) => b.y < gameRenderHeight); // Filter based on responsive height

    // Move bricks down
    const newBricks = bricks
      .map((br) => ({ ...br, y: br.y - BRICK_SPEED }));

    // Collision detection
    let newScore = score;
    let newMissedBricks = missedBricks;
    let filteredBricks = [];
    let filteredBullets = [...newBullets];
    let currentExplosions = []; // Store new explosions for this tick

    function AABB(a, b) {
      return (
        a.x < b.x + b.width &&
        a.x + a.width > b.x &&
        a.y < b.y + b.height &&
        a.y + a.height > b.y
      );
    }

    for (let brick of newBricks) {
      let hit = false;
               // Bullet collision check (AABB)
         for (let i = 0; i < filteredBullets.length; i++) {
           const bullet = filteredBullets[i];
           const bulletRect = { x: bullet.x, y: bullet.y, width: getBulletWidth(), height: getBulletHeight() };
           const brickRect = { x: brick.x, y: brick.y, width: getBrickWidth(), height: getBrickHeight() };
           if (AABB(bulletRect, brickRect)) {
                         try {
                 explosionSound.play(); // Play explosion sound
               } catch (error) {
                 console.log('Could not play explosion sound');
               }
          // Add explosion at brick center
                         currentExplosions.push({
                 id: Date.now() + Math.random(),
                 x: brick.x + getBrickWidth() / 2 - EXPLOSION_FRAME_WIDTH / 2,
                 y: brick.y + getBrickHeight() / 2 - EXPLOSION_FRAME_HEIGHT / 2,
               });
          hit = true;
          if (brick.type === 'bonus') {
            // bonusTriggered = true; // This variable is not defined in the original code
          }
          filteredBullets.splice(i, 1);
          newScore += (brick.type === 'bonus' ? 50 : 10);
          break;
        }
      }
      if (!hit) {
                 // Check if brick escaped (below screen)
         if (brick.y + getBrickHeight() <= 0) {
          newMissedBricks++;
          console.log('Brick escaped! Missed bricks:', newMissedBricks); // Debug log
        } else {
          filteredBricks.push(brick);
        }
      }
    }

    // Game over if any brick reaches jet
    // The jet is positioned at its center due to translateX(-50%), so jetX is the center
    const jetRect = { 
      x: jetX - getJetWidth() / 2, 
      y: 0, 
      width: getJetWidth(), 
      height: getJetHeight() 
    };
             const brickHitsJet = filteredBricks.some(brick => {
           const brickRect = { x: brick.x, y: brick.y, width: getBrickWidth(), height: getBrickHeight() };
           const collision = AABB(brickRect, jetRect);
           if (collision) {
             console.log('Jet collision detected!', {
               brick: brickRect,
               jet: jetRect,
               jetX: jetX
             });
             try {
               crashSound.play(); // Play crash sound
             } catch (error) {
               console.log('Could not play crash sound');
             }
           }
           return collision;
         });
    const gameOverNow = newMissedBricks >= 3 || brickHitsJet;

    set((state) => ({
      bullets: filteredBullets,
      bricks: filteredBricks,
      score: newScore,
      gameOver: gameOverNow,
      explosions: [...state.explosions, ...currentExplosions], // Add new explosions
      missedBricks: newMissedBricks, // Update missedBricks
    }));
    
    // Debug log for missed bricks state update
    if (newMissedBricks !== missedBricks) {
      console.log('Missed bricks updated:', newMissedBricks);
    }
  },

  spawnBrick: () =>
    set((state) => ({
      bricks: [
        ...state.bricks,
        {
          x: Math.random() * (state.gameRenderWidth - FALLING_BRICK_WIDTH - 2 * GAME_AREA_PADDING) + GAME_AREA_PADDING,
          y: state.gameRenderHeight - FALLING_BRICK_HEIGHT, // Spawn at top of rendered game area
          id: Date.now() + Math.random(),
        },
      ],
    })),

  handleExplosionAnimationComplete: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((exp) => exp.id !== id),
    })),

        reset: () =>
        set((state) => ({
          jetX: window.innerWidth / 2, // Center jet based on current window width
          bullets: [],
          bricks: [],
          explosions: [],
          score: 0,
          gameOver: false,
          lastFireTime: 0, // Reset last fire time
          missedBricks: 0, // Reset missedBricks
        })),
}));

// --- Styled Components ---
const GameArea = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222 url(${process.env.PUBLIC_URL}/game/bg_main_background2.webp) center/cover;
  position: relative;
  overflow: hidden;
  border: 4px solid #fff;
  box-sizing: border-box;
  
  @media (max-width: 768px) {
    border: 2px solid #fff;
  }
  
  @media (max-width: 480px) {
    border: 1px solid #fff;
  }
`;

const GameOverScreen = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
  color: red;
  font-size: 4em;
  text-shadow: 4px 4px black;
  font-family: "Press Start 2P", monospace; /* Ensure font consistency */

  button {
    margin-top: 30px;
    padding: 15px 30px;
    font-size: 1.5em;
    background-color: lime;
    color: black;
    border: 2px solid darkgreen;
    border-radius: 10px;
    cursor: pointer;
    font-family: "Press Start 2P", monospace;
    box-shadow: 0 5px 15px rgba(0, 255, 0, 0.5);
    margin-bottom: 15px; /* Add some space below buttons */


    &:hover {
      background-color: #00cc00;
    }
    &:active {
      box-shadow: none;
      transform: translateY(2px);
    }
  }
  
  @media (max-width: 768px) {
    font-size: 3em;
    
    button {
      padding: 12px 24px;
      font-size: 1.2em;
    }
  }
  
  @media (max-width: 480px) {
    font-size: 2em;
    
    button {
      padding: 10px 20px;
      font-size: 1em;
    }
  }
`;

// In-Game UI for Score
const ScoreDisplay = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  color: white;
  font-family: "Press Start 2P", monospace;
  font-size: 1.5em;
  z-index: 101; /* Ensure it's above everything else */
  text-shadow: 2px 2px black;
  
  @media (max-width: 768px) {
    font-size: 1.2em;
    top: 8px;
    left: 8px;
  }
  
  @media (max-width: 480px) {
    font-size: 1em;
    top: 5px;
    left: 5px;
  }
`;



function Game() {
  const navigate = useNavigate(); // Initialize useNavigate hook
  const [gameStarted, setGameStarted] = useState(false);

  const {
    jetX,
    bullets,
    bricks,
    explosions,
    score,
    gameOver,
    moveJet,
    fireBullet,
    tick,
    spawnBrick,
    reset,
    gameRenderWidth,
    gameRenderHeight,
    setGameDimensions,
    handleExplosionAnimationComplete,
    missedBricks,
  } = useGameStore();

  const gameAreaRef = React.useRef(null);

  // Update game dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setGameDimensions(width, height);
      // Reset jetX on resize to keep it centered
      useGameStore.setState(state => ({ jetX: width / 2 }));
    };
    
    // Initial set
    updateDimensions();

    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [setGameDimensions]);

  // Start game after a short delay to show jet entering from top
  useEffect(() => {
    const timer = setTimeout(() => {
      setGameStarted(true);
    }, 500); // 0.5 second delay
    return () => clearTimeout(timer);
  }, []);


  // Automatic bullet firing
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const interval = setInterval(() => {
      fireBullet();
    }, BULLET_FIRE_RATE_MS);
    return () => clearInterval(interval);
  }, [fireBullet, gameOver, gameStarted]);

  // Game loop for bullet movement
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const interval = setInterval(() => {
      tick();
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, [tick, gameOver, gameStarted]);

  // Brick spawner
  useEffect(() => {
    if (gameOver || !gameStarted) return;
    const interval = setInterval(() => {
      spawnBrick();
    }, BRICK_SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [spawnBrick, gameOver, gameStarted]);

  // Keyboard controls
  useEffect(() => {
    const handle = (e) => {
      if (e.key === 'Escape' && !gameOver && gameStarted) {
        reset(); // Reset game state before navigating
        navigate('/');
        return;
      }
      if (e.key === 'Enter' && gameOver) {
        reset();
        return;
      }
      // Allow 'm' or 'M' to return to main menu from game over screen
      if ((e.key === 'm' || e.key === 'M') && gameOver) {
        reset(); // Reset game state before navigating
        navigate('/');
        return;
      }
      if (!gameOver && gameStarted) {
          if (e.key === 'ArrowLeft') moveJet(-1);
          if (e.key === 'ArrowRight') moveJet(1);
          if (e.key === ' ') { // Space bar for firing
            e.preventDefault(); // Prevent page scrolling
            fireBullet();
          }
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [moveJet, reset, gameOver, fireBullet, navigate, gameStarted]); // Add navigate to dependency array

  // Touch/Mouse controls for mobile
  useEffect(() => {
    if (gameOver || !gameStarted) return;

    let isDragging = false;
    let lastTouchX = 0;

    const handleTouchStart = (e) => {
      isDragging = true;
      lastTouchX = e.touches[0].clientX;
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      
      const currentTouchX = e.touches[0].clientX;
      const deltaX = currentTouchX - lastTouchX;
      
      if (Math.abs(deltaX) > 10) { // Minimum movement threshold
        if (deltaX > 0) {
          moveJet(1); // Move right
        } else {
          moveJet(-1); // Move left
        }
        lastTouchX = currentTouchX;
      }
      
      e.preventDefault();
    };

    const handleTouchEnd = () => {
      isDragging = false;
    };

    const handleMouseDown = (e) => {
      isDragging = true;
      lastTouchX = e.clientX;
    };

    const handleMouseMove = (e) => {
      if (!isDragging) return;
      
      const currentX = e.clientX;
      const deltaX = currentX - lastTouchX;
      
      if (Math.abs(deltaX) > 10) { // Minimum movement threshold
        if (deltaX > 0) {
          moveJet(1); // Move right
        } else {
          moveJet(-1); // Move left
        }
        lastTouchX = currentX;
      }
    };

    const handleMouseUp = () => {
      isDragging = false;
    };

    // Add event listeners for touch
    document.addEventListener('touchstart', handleTouchStart, { passive: false });
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    // Add event listeners for mouse (for desktop testing)
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [gameOver, gameStarted, moveJet]);



  return (
    // The GameArea itself will fill the screen based on its calculated width/height
    <GameArea ref={gameAreaRef}>
      {!gameOver && <ScoreDisplay>Score: {score}</ScoreDisplay>}

      {/* Helper text for controls */}
      {!gameOver && (
        <div style={{
          position: 'absolute',
          top: window.innerWidth <= 768 ? 24 : 32,
          left: window.innerWidth <= 768 ? 24 : 32,
          color: 'white',
          fontFamily: '"Press Start 2P", monospace',
          fontSize: window.innerWidth <= 480 ? '10px' : '12px',
          textShadow: '2px 2px black',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          padding: window.innerWidth <= 768 ? '8px' : '10px',
          borderRadius: '5px',
          border: '1px solid #fff',
          zIndex: 20
        }}>
          {window.innerWidth <= 768 ? 'TOUCH: Drag to Move' : 'ESC: Back to Menu'}
        </div>
      )}

      <div style={{
        position: 'absolute',
        top: window.innerWidth <= 768 ? 24 : 32,
        right: window.innerWidth <= 768 ? 24 : 32,
        zIndex: 20,
        display: 'flex',
        gap: window.innerWidth <= 768 ? '12px' : '16px',
      }}>
        {[0, 1, 2].map(i => (
          <img
            key={i}
            src={process.env.PUBLIC_URL + '/game/bullet1.png'}
            alt="life"
            style={{
              width: window.innerWidth <= 480 ? 36 : window.innerWidth <= 768 ? 42 : 48,
              height: window.innerWidth <= 480 ? 36 : window.innerWidth <= 768 ? 42 : 48,
              opacity: i < 3 - missedBricks ? 1 : 0.2,
              filter: i < 3 - missedBricks ? 'drop-shadow(0 0 8px #ff0)' : 'grayscale(1)',
              transition: 'opacity 0.3s',
            }}
          />
        ))}
        {/* Debug display */}
        <div style={{ 
          position: 'absolute', 
          top: window.innerWidth <= 768 ? 60 : 80, 
          right: window.innerWidth <= 768 ? 24 : 32, 
          color: 'white', 
          fontSize: window.innerWidth <= 480 ? '10px' : '12px',
          fontFamily: 'monospace',
          whiteSpace: 'nowrap'
        }}>
          Lives: {3 - missedBricks} | Missed: {missedBricks}
        </div>
      </div>

      <div style={{
        position: 'absolute',
        left: jetX,
        bottom: gameStarted ? (window.innerWidth <= 480 ? 10 : window.innerWidth <= 768 ? 15 : 20) : '100vh',
        transition: gameStarted ? 'bottom 0.5s ease-out' : 'none',
        zIndex: 10
      }}>
        <Jet x={0} y={0} />
      </div>
      {bullets.map((b) => (
        <Bullet key={b.id} startX={b.x} currentY={b.y} />
      ))}
      {bricks.map((br) => (
        <BrickStyled key={br.id} x={br.x} y={br.y} />
      ))}
      {explosions.map((exp) => (
        <Explosion
          key={exp.id}
          x={exp.x}
          y={exp.y}
          onAnimationComplete={() => handleExplosionAnimationComplete(exp.id)}
        />
      ))}

      {/* Mobile Touch Controls */}
      {!gameOver && gameStarted && window.innerWidth <= 768 && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: 20,
          zIndex: 30
        }}>
          <button
            onClick={() => moveJet(-1)}
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'rgba(0, 255, 0, 0.8)',
              border: '3px solid #00ff00',
              borderRadius: '50%',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            ←
          </button>
          <button
            onClick={() => moveJet(1)}
            style={{
              width: 60,
              height: 60,
              backgroundColor: 'rgba(0, 255, 0, 0.8)',
              border: '3px solid #00ff00',
              borderRadius: '50%',
              color: 'white',
              fontSize: '24px',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 10px rgba(0, 255, 0, 0.5)',
              userSelect: 'none',
              touchAction: 'manipulation'
            }}
          >
            →
          </button>
        </div>
      )}

      {gameOver && (
        <GameOverScreen>
          <h1>GAME OVER!</h1>
          <button onClick={reset}>RETRY</button>
          <button onClick={() => { reset(); navigate('/'); }}>MAIN MENU</button> {/* Now calls reset() */}
        </GameOverScreen>
      )}


    </GameArea>
  );
}

// Styled component for Bricks (remains similar)
const BrickStyled = styled.div`
  position: absolute;
  width: ${(props) => getBrickWidth()}px;
  height: ${(props) => getBrickHeight()}px;
  left: ${(props) => props.x}px;
  bottom: ${(props) => props.y}px;
  background: url(${process.env.PUBLIC_URL}/game/alien.gif) center/cover;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-size: 1.2em;
`;

export default Game;
