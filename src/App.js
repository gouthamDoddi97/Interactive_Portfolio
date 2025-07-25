import React, { useEffect, useRef, useState } from 'react';
import { create } from 'zustand';
import styled from 'styled-components';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import Jet from './components/Jet';
import Bullet from './components/Bullet';
import Explosion from './components/Explosion';
import * as resumeData from './resumeData';

  // Only show these four main categories
  const menuItems = [
    { label: 'WORK', route: '/resume/experience' },
    { label: 'SKILLS', route: '/resume/skills' },
    { label: 'ABOUT ME', route: '/resume/profileSummary' },
    { label: 'CONTACT', route: '/resume/profile' },
    { label: 'PLAY GAME', route: '/game' },
  ];

// --- Game Constants ---
const JET_WIDTH = 290;
const JET_HEIGHT = 150;
const BULLET_WIDTH = 200;
const BULLET_HEIGHT = 100;
const FALLING_BRICK_WIDTH = 150;
const FALLING_BRICK_HEIGHT = 50;
const GAME_AREA_PADDING = 50;
const BRICK_SPAWN_INTERVAL_MS = 1500;
const BRICK_SPEED = 6;
const BULLET_SPEED = 18;
const BULLET_FIRE_RATE_MS = 200;

// --- Zustand Store ---
const useGameStore = create((set, get) => ({
  jetX: window.innerWidth / 2 - JET_WIDTH / 2,
  bullets: [],
  bricks: [],
  explosions: [],
  score: 0,
  gameOver: false,
  jetSpeed: 30,
  bonusActive: false,
  missedBricks: 0,
  moveJet: (dir) =>
    set((state) => ({
      jetX: Math.max(
        GAME_AREA_PADDING,
        Math.min(window.innerWidth - JET_WIDTH - GAME_AREA_PADDING, state.jetX + dir * state.jetSpeed)
      ),
    })),
  fireBullet: () =>
    set((state) => ({
      bullets: [
        ...state.bullets,
        {
          x: state.jetX + JET_WIDTH / 2 - BULLET_WIDTH / 2,
          y: JET_HEIGHT,
          id: Date.now() + Math.random(),
        },
      ],
    })),
  addExplosion: (x, y) =>
    set((state) => ({
      explosions: [
        ...state.explosions,
        {
          id: Date.now() + Math.random(),
          x,
          y,
        },
      ],
    })),
  removeExplosion: (id) =>
    set((state) => ({
      explosions: state.explosions.filter((exp) => exp.id !== id),
    })),
  tick: () => {
    const { bullets, bricks, jetX, score, gameOver, addExplosion, bonusActive, missedBricks } = get();
    if (gameOver) return;
    // Move bullets up
    const newBullets = bullets
      .map((b) => ({ ...b, y: b.y + BULLET_SPEED }))
      .filter((b) => b.y < window.innerHeight);
    // Move bricks down
    let newBricks = bricks
      .map((br) => ({ ...br, y: br.y - BRICK_SPEED }));
    // Collision detection
    let newScore = score;
    let filteredBricks = [];
    let filteredBullets = [...newBullets];
    let bonusTriggered = false;
    let newMissedBricks = missedBricks;
    for (let brick of newBricks) {
      let hit = false;
      for (let i = 0; i < filteredBullets.length; i++) {
        const bullet = filteredBullets[i];
        if (
          bullet.x < brick.x + FALLING_BRICK_WIDTH &&
          bullet.x + BULLET_WIDTH > brick.x &&
          bullet.y < brick.y + FALLING_BRICK_HEIGHT &&
          bullet.y + BULLET_HEIGHT > brick.y
        ) {
          // Call addExplosion FIRST for instant feedback
          addExplosion(
            brick.x + FALLING_BRICK_WIDTH / 2 - 128 / 2,
            brick.y + FALLING_BRICK_HEIGHT / 2 - 171 / 2
          );
          hit = true;
          if (brick.type === 'bonus') {
            bonusTriggered = true;
          }
          filteredBullets.splice(i, 1);
          newScore += (brick.type === 'bonus' ? 50 : 10);
          break;
        }
      }
      // If not hit, check if it escaped (fell below 0)
      if (!hit) {
        if (brick.y + FALLING_BRICK_HEIGHT <= 0) {
          newMissedBricks++;
        } else {
          filteredBricks.push(brick);
        }
      }
    }
    // Game over if missedBricks >= 3
    const gameOverNow = newMissedBricks >= 3 || filteredBricks.some(
      (br) =>
        br.y <= 0 + JET_HEIGHT &&
        br.x + FALLING_BRICK_WIDTH > jetX &&
        br.x < jetX + JET_WIDTH
    );
    set({
      bullets: filteredBullets,
      bricks: filteredBricks,
      score: newScore,
      gameOver: gameOverNow,
      missedBricks: newMissedBricks,
    });
    // Handle bonus effect
    if (bonusTriggered && !bonusActive) {
      set({ jetSpeed: 80, bonusActive: true });
      setTimeout(() => {
        set({ jetSpeed: 30, bonusActive: false });
      }, 5000);
    }
  },
  spawnBrick: () =>
    set((state) => {
      // 1 in 5 chance for bonus brick
      const isBonus = Math.random() < 0.2;
      return {
        bricks: [
          ...state.bricks,
          {
            x: Math.random() * (window.innerWidth - FALLING_BRICK_WIDTH - 2 * GAME_AREA_PADDING) + GAME_AREA_PADDING,
            y: window.innerHeight - FALLING_BRICK_HEIGHT,
            id: Date.now() + Math.random(),
            type: isBonus ? 'bonus' : 'regular',
          },
        ],
      };
    }),
  reset: () =>
    set({
      jetX: window.innerWidth / 2 - JET_WIDTH / 2,
      bullets: [],
      bricks: [],
      explosions: [],
      score: 0,
      gameOver: false,
      jetSpeed: 30,
      bonusActive: false,
      missedBricks: 0,
    }),
}));

// --- Styled Components ---
const GameArea = styled.div`
  width: 100vw;
  height: 100vh;
  background: #222 url(${process.env.PUBLIC_URL}/game/bg_main_background2.webp) center/cover;
  position: fixed;
  top: 0;
  left: 0;
  overflow: hidden;
  z-index: 1;
`;
const JetContainer = styled.div`
  position: absolute;
  left: ${(props) => props.x}px;
  bottom: 0;
  width: ${JET_WIDTH}px;
  height: ${JET_HEIGHT}px;
`;
const BulletStyled = styled.div`
  position: absolute;
  width: ${BULLET_WIDTH}px;
  height: ${BULLET_HEIGHT}px;
  left: ${(props) => props.x}px;
  bottom: ${(props) => props.y}px;
  background-image: url(${process.env.PUBLIC_URL}/game/bullet.png);
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  z-index: 9;
`;
const BrickStyled = styled.div`
  position: absolute;
  width: ${FALLING_BRICK_WIDTH}px;
  height: ${FALLING_BRICK_HEIGHT}px;
  left: ${(props) => props.x}px;
  bottom: ${(props) => props.y}px;
  background: ${props => props.type === 'bonus'
    ? 'gold url("https://em-content.zobj.net/source/microsoft-teams/337/star_2b50.png") center/contain no-repeat'
    : `#f44 url(${process.env.PUBLIC_URL}/game/pixelated_node.jpeg) center/cover`};
  border-radius: 6px;
  border: 2px solid #fff;
  box-shadow: ${props => props.type === 'bonus' ? '0 0 24px 8px gold' : 'none'};
`;
const MenuContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #111 url(${process.env.PUBLIC_URL}/game/bg_main_background.webp) center/cover;
`;
const MenuButton = styled.button`
  font-size: 2em;
  margin: 20px;
  padding: 20px 60px;
  border-radius: 12px;
  border: 2px solid #fff;
  background: rgba(0,0,0,0.7);
  color: #fff;
  cursor: pointer;
  box-shadow: 0 0 20px #0ff;
  transition: background 0.2s, color 0.2s;
  &:hover {
    background: #0ff;
    color: #111;
  }
`;

// --- Resume Section Pages ---
function ResumeSectionPage({ section }) {
  const navigate = useNavigate();
  const data = resumeData[section];
  return (
    <MenuContainer>
      <MenuButton onClick={() => navigate('/')}>Back to Menu</MenuButton>
      <h1 style={{ color: '#0ff', marginBottom: 32 }}>{section.charAt(0).toUpperCase() + section.slice(1)}</h1>
      <div style={{ maxWidth: 900, background: 'rgba(0,0,0,0.7)', padding: 32, borderRadius: 16, color: '#fff' }}>
        {Array.isArray(data)
          ? data.map((item, i) => <div key={i} style={{ marginBottom: 16 }}>{typeof item === 'string' ? item : JSON.stringify(item)}</div>)
          : typeof data === 'object'
            ? Object.entries(data).map(([k, v], i) => <div key={i}><b>{k}:</b> {Array.isArray(v) ? v.join(', ') : v.toString()}</div>)
            : <div>{data}</div>
        }
      </div>
    </MenuContainer>
  );
}

// --- Main Menu ---
function MainMenu() {
  const navigate = useNavigate();
  const [selected, setSelected] = React.useState(0);
  const btnRefs = React.useRef([]);
  const addExplosion = useGameStore(state => state.addExplosion);
  const [explosionTestActive, setExplosionTestActive] = React.useState(false);
  const explosionIntervalRef = React.useRef(null);

  // Keyboard navigation
  React.useEffect(() => {
    const handle = (e) => {
      if (e.key === 'ArrowDown') {
        setSelected((prev) => (prev + 1) % menuItems.length);
      } else if (e.key === 'ArrowUp') {
        setSelected((prev) => (prev - 1 + menuItems.length) % menuItems.length);
      } else if (e.key === 'Enter') {
        if (menuItems[selected].label === 'SKILLS') {
          setExplosionTestActive(true);
        }
        navigate(menuItems[selected].route);
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [selected, menuItems, navigate]);

  // Focus selected button for accessibility
  React.useEffect(() => {
    btnRefs.current[selected]?.focus();
  }, [selected]);

  // Explosion test effect
  React.useEffect(() => {
    if (explosionTestActive) {
      explosionIntervalRef.current = setInterval(() => {
        const x = Math.random() * (window.innerWidth - 128);
        const y = Math.random() * (window.innerHeight - 128);
        addExplosion(x, y);
      }, 200);
    } else if (explosionIntervalRef.current) {
      clearInterval(explosionIntervalRef.current);
      explosionIntervalRef.current = null;
    }
    return () => {
      if (explosionIntervalRef.current) {
        clearInterval(explosionIntervalRef.current);
        explosionIntervalRef.current = null;
      }
    };
  }, [explosionTestActive, addExplosion]);

  // Stop explosion test when navigating away
  React.useEffect(() => {
    return () => {
      if (explosionIntervalRef.current) {
        clearInterval(explosionIntervalRef.current);
        explosionIntervalRef.current = null;
      }
    };
  }, []);



  return (
    <div className="root" style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'transparent'
    }}>
      <h1 style={{
        color: '#0ff',
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '2.5em',
        marginBottom: 40,
        textShadow: '0 0 8px #0ff, 0 0 16px #fff'
      }}>
        MY INTERACTIVE RESUME
      </h1>
      {menuItems.map((item, idx) => (
        <button
          key={item.label}
          ref={el => btnRefs.current[idx] = el}
          className={`retro-menu-btn${selected === idx ? ' selected' : ''}`}
          tabIndex={0}
          onClick={() => {
            if (item.label === 'SKILLS') setExplosionTestActive(true);
            navigate(item.route);
          }}
        >
          {item.label}
        </button>
      ))}
      <div style={{ marginTop: 40, color: '#fff', fontFamily: '"Press Start 2P", monospace', fontSize: '0.9em', opacity: 0.7 }}>
        Use ↑/↓ to navigate, Enter to select
      </div>
    </div>
  );
}

// --- Game Page ---
function Game() {
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
    removeExplosion,
    bonusActive,
    missedBricks,
  } = useGameStore();
  const navigate = useNavigate();

  // Game loop
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      tick();
    }, 16);
    return () => clearInterval(interval);
  }, [tick, gameOver]);

  // Brick spawner
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      spawnBrick();
    }, BRICK_SPAWN_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [spawnBrick, gameOver]);

  // Automatic bullet firing
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      fireBullet();
    }, BULLET_FIRE_RATE_MS);
    return () => clearInterval(interval);
  }, [fireBullet, gameOver]);

  // Keyboard controls
  useEffect(() => {
    const handle = (e) => {
      if (gameOver) {
        if (e.key === 'Enter') reset();
        return;
      }
      if (e.key === 'ArrowLeft') moveJet(-1);
      if (e.key === 'ArrowRight') moveJet(1);
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [moveJet, reset, gameOver]);

  return (
    <div>
      <h2 style={{
        textAlign: 'center',
        color: bonusActive ? '#ff0' : '#0ff',
        position: 'absolute',
        top: 32,
        left: 0,
        width: '100vw',
        zIndex: 10,
        fontFamily: '"Press Start 2P", monospace',
        fontSize: '2.5em',
        fontWeight: 'bold',
        letterSpacing: '0.08em',
        textShadow: bonusActive
          ? '0 0 24px #ff0, 0 0 48px #fff, 0 0 16px #ff0'
          : '0 0 12px #0ff, 0 0 32px #fff, 0 0 8px #0ff',
        background: 'rgba(0,0,0,0.25)',
        padding: '18px 0 10px 0',
        margin: 0,
        borderBottom: bonusActive ? '2px solid #ff0' : '2px solid #0ff',
        boxShadow: bonusActive ? '0 2px 32px #ff0' : '0 2px 16px #0ff',
      }}>
        SCORE: {score} {bonusActive && <span style={{ color: '#ff0', marginLeft: 32, fontSize: '0.7em' }}>BONUS SPEED!</span>}
        {gameOver && <span style={{ color: '#ff0044', marginLeft: 32 }}>GAME OVER!</span>}
      </h2>
      <GameArea>
        <JetContainer x={jetX}>
          <Jet />
        </JetContainer>
        {bullets.map((b) => (
          <BulletStyled key={b.id} x={b.x} y={b.y} />
        ))}
        {bricks.map((br) => (
          <BrickStyled key={br.id} x={br.x} y={br.y} type={br.type} />
        ))}
        {explosions.map((exp) => (
          <Explosion
            key={exp.id}
            x={exp.x}
            y={exp.y}
            onAnimationComplete={() => removeExplosion(exp.id)}
          />
        ))}
        {gameOver && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}>
            <div style={{
              color: '#ff0044',
              fontFamily: '"Press Start 2P", monospace',
              fontSize: '4em',
              textShadow: '0 0 16px #fff, 0 0 32px #ff0044',
              marginBottom: 40,
              fontWeight: 'bold',
              letterSpacing: '0.1em',
              textAlign: 'center',
            }}>
              GAME OVER
            </div>
            <button
              className="retro-menu-btn"
              style={{ fontSize: '1.5em', padding: '18px 60px', marginTop: 20 }}
              onClick={() => { reset(); navigate('/'); }}
            >
              MAIN MENU
            </button>
          </div>
        )}
        <div style={{
          position: 'absolute',
          top: 32,
          right: 32,
          zIndex: 20,
          display: 'flex',
          gap: '16px',
        }}>
          {[0, 1, 2].map(i => (
            <img
              key={i}
              src={process.env.PUBLIC_URL + '/game/bullet1.png'}
              alt="life"
              style={{
                width: 48,
                height: 48,
                opacity: i < 3 - missedBricks ? 1 : 0.2,
                filter: i < 3 - missedBricks ? 'drop-shadow(0 0 8px #ff0)' : 'grayscale(1)',
                transition: 'opacity 0.3s',
              }}
            />
          ))}
        </div>
      </GameArea>
    </div>
  );
}

// --- Main App with Routing ---
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/game" element={<Game />} />
        <Route path="/resume/:section" element={<ResumeSectionRoute />} />
      </Routes>
    </Router>
  );
}

// --- Resume Section Route Wrapper ---
function ResumeSectionRoute() {
  const { section } = useParams();
  return <ResumeSectionPage section={section} />;
}

export default App;
