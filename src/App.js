import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
// Removed Howl, Jet, Bullet, Explosion imports as game logic moved to Game.js
import Game from './Game'; // Import the new Game component
import Jet from './components/Jet'; // Import Jet component for main menu
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import AboutMe from './components/AboutMe';
import Education from './components/Education';
import html2pdf from 'html2pdf.js';

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

const ResumeContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  background-image: url(${process.env.PUBLIC_URL}/game/bg_main_background2.webp);
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: auto;
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
  gap: 15px;
  align-items: center;
  z-index: 5;
  
  @media (max-width: 768px) {
    gap: 12px;
    bottom: 15px;
    left: 15px;
  }
  
  @media (max-width: 480px) {
    gap: 10px;
    bottom: 10px;
    left: 10px;
  }
`;

const RetroButton = styled.button`
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  font-family: "Press Start 2P", monospace;
  font-size: 0.8em;
  padding: 12px 20px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 
    0 0 10px rgba(0, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }
  
  &:hover {
    background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 
      0 0 20px rgba(0, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 
      0 0 10px rgba(0, 255, 255, 0.5),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 768px) {
    font-size: 0.7em;
    padding: 10px 16px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.6em;
    padding: 8px 12px;
  }
`;

const PlayButton = styled(RetroButton)`
  background: linear-gradient(145deg, #1a3a1a, #0a2a0a);
  border-color: #00ff00;
  color: #00ff00;
  
  &:hover {
    background: linear-gradient(145deg, #2a4a2a, #1a3a1a);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 
      0 0 20px rgba(0, 255, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
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

  const handleDownloadResume = useCallback(async () => {
    try {
      // Fetch the resume HTML file
      const response = await fetch('/resume.html');
      const htmlContent = await response.text();
      
      // Create a temporary div to hold the HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = htmlContent;
      document.body.appendChild(tempDiv);
      
      // Configure PDF options
      const opt = {
        margin: 0.5,
        filename: 'Goutham_Doddi_Resume.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          allowTaint: true
        },
        jsPDF: { 
          unit: 'in', 
          format: 'a4', 
          orientation: 'portrait' 
        }
      };
      
      // Generate and download PDF
      await html2pdf().from(tempDiv).set(opt).save();
      
      // Clean up
      document.body.removeChild(tempDiv);
    } catch (error) {
      console.error('Error downloading resume:', error);
      alert('Error downloading resume. Please try again.');
    }
  }, []);

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
      } else if (e.key === 'd' || e.key === 'D') {
        handleDownloadResume();
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
            ARROW KEYS: Move Jet | SHIFT: Select | P: Play Game | D: Download Resume
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
            <RetroButton onClick={handleSelectClick}>SELECT</RetroButton>
            <RetroButton onClick={handleStartClick}>START</RetroButton>
            <PlayButton onClick={handlePlayGame}>PLAY</PlayButton>
            <RetroButton onClick={handleDownloadResume}>DOWNLOAD</RetroButton>
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

// --- Page Components using new components ---
const ExperiencePage = () => {
  return (
    <ResumeContainer>
      <WorkExperience experience={experience} />
    </ResumeContainer>
  );
};

const SkillsPage = () => {
  return (
    <ResumeContainer>
      <Skills skills={skills} />
    </ResumeContainer>
  );
};

const EducationPage = () => {
  return (
    <ResumeContainer>
      <Education education={education} certificates={certificates} />
    </ResumeContainer>
  );
};

const AboutPage = () => {
  return (
    <ResumeContainer>
      <AboutMe 
        profileSummary={profileSummary}
        careerHighlights={careerHighlights}
        earlyCareer={earlyCareer}
        interests={interests}
        profile={profile}
        personalDetails={personalDetails}
      />
    </ResumeContainer>
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
