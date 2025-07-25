import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// Removed Howl, Jet, Bullet, Explosion imports as game logic moved to Game.js
import Game from './Game'; // Import the new Game component
import Jet from './components/Jet'; // Import Jet component for main menu

import { profile, experience, skills, education, profileSummary, careerHighlights, earlyCareer, links, interests, personalDetails, certificates } from './resumeData';


// --- Styled Components ---
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-image: url(${process.env.PUBLIC_URL}/game/bg_main_background2.webp);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  color: white;
  font-family: "Press Start 2P", monospace;
  
  @media (max-width: 768px) {
    font-size: 0.8em;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6em;
  }
`;

const BrickContainer = styled.div`
  position: absolute;
  top: 10%;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  z-index: 5;
  padding: 0 20px;
  box-sizing: border-box;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 20px;
    padding: 0 15px;
  }
  
  @media (max-width: 480px) {
    gap: 15px;
    padding: 0 10px;
    top: 15%;
  }
`;

const Brick = styled.div`
  font-size: 3em;
  padding: 20px 40px;
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
  text-shadow: 2px 2px purple, -2px -2px lightblue;
  background-color: rgba(0,0,0,0.6);
  backdrop-filter: blur(2px);
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  
  ${props => props.$isSelected && `
    border-color: yellow;
    box-shadow: 0 0 15px yellow, 0 0 25px orange;
    transform: scale(1.05);
  `}

  &:hover {
    transform: scale(1.05);
  }
  
  @media (max-width: 768px) {
    font-size: 2.5em;
    padding: 15px 30px;
  }
  
  @media (max-width: 480px) {
    font-size: 2em;
    padding: 10px 20px;
  }
`;

const NavButtonsContainer = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 10px;

  .start-btn, .play-btn {
    background-color: lightgray;
    text-shadow: -1px -1px black, 1px 1px white;
    color: gray;
    border: none;
    padding: 10px 20px;
    border-radius: 7px;
    box-shadow: 0 .2em gray;
    cursor: pointer;
    font-family: "Press Start 2P", monospace;

    &:active {
      box-shadow: none;
      position: relative;
      top: .2em;
    }
  }
  .video-game-button {
    background-color: lightgray;
    text-shadow: -1px -1px black, 1px 1px white;
    color: gray;
    border: none;
    padding: 10px 15px;
    border-radius: 7px;
    box-shadow: 0 .2em gray;
    cursor: pointer;
    font-family: "Press Start 2P", monospace;

    &:active {
      box-shadow: none;
      position: relative;
      top: .2em;
    }
  }
  
  @media (max-width: 768px) {
    bottom: 15px;
    left: 15px;
    gap: 8px;
    
    .start-btn, .play-btn {
      padding: 8px 16px;
      font-size: 0.8em;
    }
    
    .video-game-button {
      padding: 8px 12px;
      font-size: 0.8em;
    }
  }
  
  @media (max-width: 480px) {
    bottom: 10px;
    left: 10px;
    gap: 6px;
    
    .start-btn, .play-btn {
      padding: 6px 12px;
      font-size: 0.7em;
    }
    
    .video-game-button {
      padding: 6px 10px;
      font-size: 0.7em;
    }
  }
`;

const HelperText = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  color: white;
  font-family: "Press Start 2P", monospace;
  font-size: 0.8em;
  text-shadow: 2px 2px black;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #fff;
  
  @media (max-width: 768px) {
    top: 15px;
    left: 15px;
    font-size: 0.7em;
    padding: 8px;
  }
  
  @media (max-width: 480px) {
    top: 10px;
    left: 10px;
    font-size: 0.6em;
    padding: 6px;
    max-width: 90%;
  }
`;

const GamePage = styled.div`
  width: 90%;
  height: 90%;
  background-image: url(${process.env.PUBLIC_URL}/game/bg_main_background.webp);
  background-size: cover;
  background-position: center;
  padding: 20px;
  overflow-y: auto;
  border: 5px solid gray;
  color: white;
  font-size: 1.2em;
  box-shadow: 0 0 20px rgba(0, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  position: relative;

  h1 {
    text-align: center;
    color: lime;
    text-shadow: 2px 2px black;
    margin-bottom: 20px;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
  }

  a {
    color: skyblue;
  }

  p {
    margin-bottom: 10px;
  }

  h2, h3 {
    color: #00ffff;
    margin-top: 15px;
    margin-bottom: 10px;
  }
`;

const BackButton = styled.button`
  background-color: lightgray;
  text-shadow: -1px -1px black, 1px 1px white;
  color: gray;
  border: none;
  padding: 10px 20px;
  border-radius: 7px;
  box-shadow: 0 .2em gray;
  cursor: pointer;
  position: absolute;
  top: 20px;
  right: 20px;
  z-index: 20;

  &:active {
    box-shadow: none;
    position: relative;
    top: .2em;
  }
`;

// Removed GameOverScreen as it's now part of Game.js

// --- HomePage Component (Main Menu) ---
const HomePage = () => {
  const navigate = useNavigate();

  const BRICK_KEYS = ['experience', 'skills', 'education', 'about'];
  const [selectedBrickIndex, setSelectedBrickIndex] = useState(0);
  const [jetX, setJetX] = useState(Math.max(50, Math.min(window.innerWidth - 340, window.innerWidth / 2 - 145))); // Center jet initially with bounds
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelectClick = useCallback(() => {
    setSelectedBrickIndex((prevIndex) => (prevIndex + 1) % (BRICK_KEYS?.length || 0));
  }, [BRICK_KEYS?.length]);

  const handleStartClick = useCallback(() => {
    const selectedKey = BRICK_KEYS[selectedBrickIndex];
    navigate(`/${selectedKey}`);
  }, [selectedBrickIndex, BRICK_KEYS, navigate]);

  const handlePlayGame = useCallback(() => {
    setIsTransitioning(true);
    // Animate jet to top of screen
    setJetX(window.innerWidth / 2 - 145); // Keep centered
    
    // After animation, navigate to game
    setTimeout(() => {
      navigate('/game');
    }, 1000); // 1 second animation
  }, [navigate]);

  // Handle window resize for jet positioning
  useEffect(() => {
    const handleResize = () => {
      setJetX(prev => Math.max(50, Math.min(window.innerWidth - 340, prev)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Keyboard controls for the main menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isTransitioning) return; // Disable controls during transition
      
      if (e.key === 'Enter') {
        handleStartClick();
      } else if (e.key === 'Shift') {
        handleSelectClick();
      } else if (e.key === 'p' || e.key === 'P') {
        handlePlayGame();
      } else if (e.key === 'ArrowLeft') {
        setJetX(prev => Math.max(50, prev - 30));
      } else if (e.key === 'ArrowRight') {
        setJetX(prev => Math.min(window.innerWidth - 340, prev + 30));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSelectClick, handleStartClick, handlePlayGame, isTransitioning]);


  return (
    <GameContainer>
      {!isTransitioning && (
        <>
          <HelperText>
            ARROW KEYS: Move Jet | SHIFT: Select | P: Play Game
          </HelperText>
          
          <BrickContainer>
            { (Array.isArray(BRICK_KEYS) ? BRICK_KEYS : []).map((key, index) => (
              <Brick
                key={key}
                $isSelected={index === selectedBrickIndex}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Brick>
            ))}
          </BrickContainer>

          <NavButtonsContainer>
            <span className='video-game-button'>A</span>
            <span className='video-game-button'>B</span>
            <span className='start-btn' onClick={handleSelectClick}>SELECT</span>
            <span className='start-btn' onClick={handleStartClick}>START</span>
            <span className='play-btn' onClick={handlePlayGame}>PLAY</span>
          </NavButtonsContainer>
        </>
      )}

      {/* Jet positioned at bottom with margin/padding */}
      <div style={{
        position: 'absolute',
        bottom: isTransitioning ? '100vh' : 120, // Fly to top when transitioning
        left: jetX,
        transform: isTransitioning ? 'translateY(-100%)' : 'none',
        zIndex: 10,
        transition: isTransitioning ? 'bottom 1s ease-in-out' : 'left 0.1s ease-out'
      }}>
        <Jet x={0} y={0} />
      </div>
    </GameContainer>
  );
};

// --- Page Components (Unchanged) ---
const ExperiencePage = () => {
  const navigate = useNavigate();
  return (
    <GamePage>
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <h1>Experience</h1>
      {experience.map((job, index) => (
        <div key={index}>
          <h3>{job.title} at {job.company} ({job.period})</h3>
          <ul>
            {job.bullets.map((bullet, bIndex) => (
              <li key={bIndex}>{bullet}</li>
            ))}
          </ul>
        </div>
      ))}
    </GamePage>
  );
};

const SkillsPage = () => {
  const navigate = useNavigate();
  return (
    <GamePage>
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <h1>Skills & Technologies</h1>
      {skills.map((skillCat, index) => (
        <div key={index}>
          <h3>{skillCat.category}</h3>
          <p>{skillCat.items.join(', ')}</p>
        </div>
      ))}
    </GamePage>
  );
};

const EducationPage = () => {
  const navigate = useNavigate();
  return (
    <GamePage>
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <h1>Education & Certifications</h1>
      {education.map((edu, index) => (
        <div key={index}>
          <h3>{edu.degree} - {edu.institution} ({edu.period})</h3>
        </div>
      ))}
      <h3>Certifications</h3>
      <ul>
        {certificates.map((cert, index) => (
          <li key={index}>{cert}</li>
        ))}
      </ul>
    </GamePage>
  );
};

const AboutPage = () => {
  const navigate = useNavigate();
  return (
    <GamePage>
      <BackButton onClick={() => navigate('/')}>Back</BackButton>
      <h1>About Me / Highlights</h1>
      <h2>Profile Summary</h2>
      <p>{profileSummary}</p>
      <h2>Career Highlights</h2>
      <ul>
        {careerHighlights.map((highlight, index) => (
          <li key={index}>{highlight}</li>
        ))}
      </ul>
      <h2>Early Career</h2>
      <ul>
        {earlyCareer.map((item, index) => (
          <li key={index}>{item.title} at {item.company} ({item.period}) - {item.bullets[0]}</li>
        ))}
      </ul>
      <h2>Interests</h2>
      <p>{interests.join(', ')}</p>
      <h2>Contact</h2>
      <ul>
        <li>Email: {profile.email}</li>
        <li>LinkedIn: <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">{profile.linkedin}</a></li>
        <li>GitHub: <a href={profile.github} target="_blank" rel="noopener noreferrer">{profile.github}</a></li>
        {personalDetails.map((detail, index) => (
          <li key={index}>{detail.label}: {detail.value}</li>
        ))}
      </ul>
    </GamePage>
  );
};


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/game" element={<Game />} /> {/* New route for the game */}
      </Routes>
    </Router>
  );
}

export default App;
