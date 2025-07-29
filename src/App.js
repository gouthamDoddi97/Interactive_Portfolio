import React, { useState, useEffect, useCallback } from 'react';
import {
  HashRouter as Router,
  Routes,
  Route,
  useNavigate,
} from 'react-router-dom';
import styled from 'styled-components';
import { Howl } from 'howler';
import Game from './Game'; // Import the new Game component
import Jet from './components/Jet'; // Import Jet component for main menu
import WorkExperience from './components/WorkExperience';
import Skills from './components/Skills';
import AboutMe from './components/AboutMe';
import Education from './components/Education';
import html2pdf from 'html2pdf.js';

import {
  profile,
  experience,
  skills,
  education,
  profileSummary,
  careerHighlights,
  earlyCareer,
  links,
  interests,
  personalDetails,
  certificates,
} from './resumeData';

// Menu select sound
const menuSelectSound = new Howl({ 
  src: ['/Interactive_Portfolio/game/select.mp3'],
  preload: true,
  html5: true,
  volume: 0.3, // Reduced volume
  onload: () => console.log('Menu select sound loaded successfully'),
  onloaderror: () => console.log('Menu select sound not found, continuing without sound'),
  onplayerror: () => console.log('Menu select sound play error, continuing without sound')
});

// Menu theme music
const menuThemeMusic = new Howl({ 
  src: ['/Interactive_Portfolio/game/Menu Theme.wav'],
  preload: true,
  html5: true,
  loop: true,
  volume: 0.4, // Lower volume for background music
  onload: () => console.log('Menu theme music loaded successfully'),
  onloaderror: () => console.log('Menu theme music not found, continuing without sound'),
  onplayerror: () => console.log('Menu theme music play error, continuing without sound')
});

// Fly by sound for jet movement
const flyBySound = new Howl({ 
  src: ['/Interactive_Portfolio/game/flyBy.wav'],
  preload: true,
  html5: true,
  volume: 0.5,
  onload: () => console.log('Fly by sound loaded successfully'),
  onloaderror: () => console.log('Fly by sound not found, continuing without sound'),
  onplayerror: () => console.log('Fly by sound play error, continuing without sound')
});

// Jet engine sound for continuous play
const jetEngineSound = new Howl({ 
  src: ['/Interactive_Portfolio/game/jet.mp3'],
  preload: true,
  html5: true,
  loop: false, // Disable automatic looping
  volume: 0.3,
  onload: () => console.log('Jet engine sound loaded successfully'),
  onloaderror: () => console.log('Jet engine sound not found, continuing without sound'),
  onplayerror: () => console.log('Jet engine sound play error, continuing without sound'),
  onend: () => {
    console.log('Jet engine sound ended, restarting...');
    // Jet engine sound disabled by default
    // if (window.globalSoundEnabled) {
    //   jetEngineSound.play();
    // }
  }
});

const playMenuSelect = () => {
  try {
    menuSelectSound.play();
    console.log('Menu select sound played');
  } catch (error) {
    console.log('Could not play menu select sound:', error);
  }
};

const playFlyBySound = () => {
  try {
    flyBySound.play();
    console.log('Fly by sound played');
  } catch (error) {
    console.log('Could not play fly by sound:', error);
  }
};

const startJetEngineSound = () => {
  try {
    if (!jetEngineSound.playing()) {
      jetEngineSound.play();
      console.log('Jet engine sound started');
    } else {
      console.log('Jet engine sound already playing');
    }
  } catch (error) {
    console.log('Could not start jet engine sound:', error);
  }
};

const stopJetEngineSound = () => {
  try {
    jetEngineSound.stop();
    console.log('Jet engine sound stopped');
  } catch (error) {
    console.log('Could not stop jet engine sound:', error);
  }
};

const startMenuMusic = () => {
  try {
    menuThemeMusic.play();
    console.log('Menu theme music started');
  } catch (error) {
    console.log('Could not start menu theme music:', error);
  }
};

const stopMenuMusic = () => {
  try {
    menuThemeMusic.stop();
    console.log('Menu theme music stopped');
  } catch (error) {
    console.log('Could not stop menu theme music:', error);
  }
};



// --- Styled Components ---
const GameContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
         background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
         background-image: url('/Interactive_Portfolio/game/bg_main_background2.webp');
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  color: white;
         font-family: 'Press Start 2P', monospace;
         box-sizing: border-box;

         @media (max-width: 768px) {
           font-size: 0.8em;
           height: 100vh;
           width: 100vw;
           overflow: hidden;
          //  background-image: url('/Interactive_Portfolio/game/mobilewp.webg');
           background-size: cover;
           background-position: center;
         }

         @media (max-width: 480px) {
           font-size: 0.6em;
           height: 100vh;
           width: 100vw;
           overflow: hidden;
          //  background-image: url('/Interactive_Portfolio/game/mobilewp.webp');
           background-size: cover;
           background-position: center;
         }
       `;

       const ResumeContainer = styled.div`
         width: 100vw;
         height: 100vh;
         display: flex;
         justify-content: center;
         align-items: flex-start;
         background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
         background-image: url('/Interactive_Portfolio/game/bg_main_background2.webp');
         background-size: cover;
         background-position: center;
         position: relative;
         overflow: auto;
         color: white;
         font-family: 'Press Start 2P', monospace;

  @media (max-width: 768px) {
    font-size: 0.8em;
  }

  @media (max-width: 480px) {
    font-size: 0.6em;
  }
`;

const BrickContainer = styled.div`
  position: absolute;
  top: 25%;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 30px;
  z-index: 10;
  padding: 0 20px;
  box-sizing: border-box;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: none; /* Hide brick container on mobile */
  }

  @media (max-width: 480px) {
    display: none; /* Hide brick container on mobile */
  }
`;

// --- Brick styled component (PC main menu) ---
const Brick = styled.div`
  font-size: 3em;
  padding: 20px 40px;
  border: 2px solid white;
  border-radius: 5px;
  cursor: pointer;
  text-shadow: 2px 2px purple, -2px -2px lightblue;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  transition: transform 0.2s ease-in-out, border-color 0.2s ease-in-out,
    box-shadow 0.2s ease-in-out;
  
  ${(props) =>
    props.$isSelected &&
    `
    border-color: yellow;
    box-shadow: 0 0 15px yellow, 0 0 25px orange;
    color: yellow;
    transform: scale(1.05);
    text-shadow: 2px 2px #000, 0 0 15px yellow;
  `}

  &:hover {
    border-color: yellow;
    box-shadow: 0 0 15px yellow, 0 0 25px orange;
    color: yellow;
    transform: scale(1.05);
    text-shadow: 2px 2px #000, 0 0 15px yellow;
  }

  @media (max-width: 768px) {
    font-size: 1em;
    padding: 4px 8px;
  }

  @media (max-width: 480px) {
    font-size: 0.7em;
    padding: 3px 6px;
  }
`;

const NavButtonsContainer = styled.div`
  position: fixed;
  bottom: 20px;
  left: 20px;
  display: flex;
  gap: 15px;
  align-items: center;
  z-index: 20;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    display: none !important; /* Force hide desktop buttons on mobile */
  }
`;

const MobileMenuContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: column;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(135deg, rgba(0, 0, 0, 0.95) 0%, rgba(20, 20, 40, 0.95) 100%);
    border-top: 3px solid #0ff;
    box-shadow: 
      0 -4px 20px rgba(0, 255, 255, 0.4),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    z-index: 30;
    padding: 12px 16px;
    gap: 8px;
    backdrop-filter: blur(10px);
  }
`;

const MobileButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 6px;
  margin-bottom: 6px;
  
  &:last-child {
    margin-bottom: 0;
  }
`;



const MobileButton = styled.button`
  flex: 1;
  background: linear-gradient(135deg, #2a2a2a 0%, #444 50%, #2a2a2a 100%);
  border: 2px solid #0ff;
  border-radius: 8px;
  color: #0ff;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.7em;
  padding: 10px 8px;
    cursor: pointer;
  text-shadow: 1px 1px #000, 0 0 8px rgba(0, 255, 255, 0.5);
  box-shadow: 
    0 3px 6px rgba(0, 0, 0, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
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
    background: linear-gradient(135deg, #3a3a3a 0%, #555 50%, #3a3a3a 100%);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 
      0 4px 8px rgba(0, 0, 0, 0.9),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 12px rgba(0, 255, 0, 0.4);
    transform: translateY(-1px);
    
    &::before {
      left: 100%;
    }
  }

    &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.8),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: 0.6em;
    padding: 8px 6px;
  }
`;

const MobileMainMenuContainer = styled.div`
  display: none;
  
  @media (max-width: 768px) {
    display: flex !important;
    flex-direction: column;
    position: absolute;
    top: 25%;
    left: 50%;
    transform: translateX(-50%);
    width: 85%;
    gap: 16px;
    z-index: 30;
  }
`;

const MobileMainMenuItem = styled.button`
  width: 100%;
  background: transparent;
  border: 2px solid #0ff;
  border-radius: 10px;
  color: #0ff;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.9em;
  padding: 16px 20px;
    cursor: pointer;
  text-shadow: 2px 2px #000, 0 0 10px rgba(0, 255, 255, 0.5);
  box-shadow: 
    0 4px 8px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
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
  
  ${(props) =>
    props.$isSelected &&
    `
    border-color: #ffff00;
    color: #ffff00;
    box-shadow: 
      0 0 20px rgba(255, 255, 0, 0.8),
      inset 0 0 20px rgba(255, 255, 0, 0.2),
      0 0 15px rgba(255, 255, 0, 0.5);
    text-shadow: 2px 2px #000, 0 0 15px rgba(255, 255, 0, 0.8);
  `}
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 
      0 6px 12px rgba(0, 0, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.2),
      0 0 15px rgba(0, 255, 0, 0.5);
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }

    &:active {
    transform: translateY(0);
    box-shadow: 
      0 2px 4px rgba(0, 0, 0, 0.5),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }
  
  @media (max-width: 480px) {
    font-size: 0.8em;
    padding: 14px 18px;
  }
`;

const RetroButton = styled.button`
  background: linear-gradient(145deg, #2a2a2a, #1a1a1a);
  border: 2px solid #00ffff;
  border-radius: 8px;
  color: #00ffff;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8em;
  padding: 12px 20px;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
  z-index: 25;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.2),
      transparent
    );
    transition: left 0.5s ease;
  }

  &:hover {
    background: linear-gradient(145deg, #3a3a3a, #2a2a2a);
    border-color: #00ff00;
    color: #00ff00;
    box-shadow: 0 0 20px rgba(0, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 0 10px rgba(0, 255, 255, 0.5),
      inset 0 2px 4px rgba(0, 0, 0, 0.3);
  }

  @media (max-width: 768px) {
    font-size: 0.5em;
    padding: 6px 10px;
    min-width: 70px;
  }

  @media (max-width: 480px) {
    font-size: 0.4em;
    padding: 4px 8px;
    min-width: 60px;
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
    box-shadow: 0 0 20px rgba(0, 255, 0, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;

const HelperText = styled.div`
  position: fixed;
  top: 20px;
  left: 20px;
  color: white;
  font-family: 'Press Start 2P', monospace;
  font-size: 0.8em;
  text-shadow: 2px 2px black;
  background-color: rgba(0, 0, 0, 0.7);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #fff;
  z-index: 10;

  @media (max-width: 768px) {
    display: none !important; /* Force hide helper text on mobile */
  }
`;

const TitleText = styled.div`
  position: fixed;
  top: 100px;
  left: 50%;
  transform: translateX(-50%);
  color: #FFD700;
  font-family: 'Orbitron', monospace;
  font-size: 2.2em;
  font-weight: 700;
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 
    0 0 5px #FFD700,
    0 0 10px #FFD700,
    0 0 15px #FFD700,
    0 0 20px #FFD700,
    2px 2px 2px #000,
    4px 4px 4px #000,
    6px 6px 6px #000,
    0 0 30px rgba(255, 215, 0, 0.8),
    0 0 40px rgba(255, 215, 0, 0.6),
    0 0 50px rgba(255, 215, 0, 0.4);
  background: linear-gradient(135deg, rgba(0, 0, 0, 0.9) 0%, rgba(20, 20, 40, 0.9) 100%);
  padding: 20px 30px;
  border-radius: 15px;
  border: 4px solid #FFD700;
  border-style: double;
  box-shadow: 
    0 0 30px rgba(255, 215, 0, 0.8),
    inset 0 0 30px rgba(255, 215, 0, 0.2),
    0 10px 20px rgba(0, 0, 0, 0.8);
  z-index: 100;
  text-align: center;
  backdrop-filter: blur(10px);
  animation: metallicGlow 3s infinite;
  letter-spacing: 3px;
  text-transform: uppercase;
  white-space: nowrap;

  @media (max-width: 768px) {
    white-space: normal;
  }

  .desktop-only {
    display: inline;
  }

  .mobile-only {
    display: none;
  }

  @media (max-width: 768px) {
    .desktop-only {
      display: none;
    }

    .mobile-only {
      display: inline;
    }
  }

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    right: -30px;
    width: 20px;
    height: 3px;
    background: #FFD700;
    box-shadow: 0 0 10px #FFD700;
    transform: translateY(-50%);
    animation: rightExtend 2s infinite;
  }

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -30px;
    width: 20px;
    height: 3px;
    background: #FFD700;
    box-shadow: 0 0 10px #FFD700;
    transform: translateY(-50%);
    animation: leftExtend 2s infinite;
  }

  @keyframes metallicGlow {
    0%, 100% {
      color: #FFD700;
      text-shadow: 
        0 0 5px #FFD700,
        0 0 10px #FFD700,
        0 0 15px #FFD700,
        0 0 20px #FFD700,
        2px 2px 2px #000,
        4px 4px 4px #000,
        6px 6px 6px #000,
        0 0 30px rgba(255, 215, 0, 0.8),
        0 0 40px rgba(255, 215, 0, 0.6),
        0 0 50px rgba(255, 215, 0, 0.4);
      border-color: #FFD700;
      box-shadow: 
        0 0 30px rgba(255, 215, 0, 0.8),
        inset 0 0 30px rgba(255, 215, 0, 0.2),
        0 10px 20px rgba(0, 0, 0, 0.8);
    }
    50% {
      color: #FFA500;
      text-shadow: 
        0 0 5px #FFA500,
        0 0 10px #FFA500,
        0 0 15px #FFA500,
        0 0 20px #FFA500,
        2px 2px 2px #000,
        4px 4px 4px #000,
        6px 6px 6px #000,
        0 0 30px rgba(255, 165, 0, 0.8),
        0 0 40px rgba(255, 165, 0, 0.6),
        0 0 50px rgba(255, 165, 0, 0.4);
      border-color: #FFA500;
      box-shadow: 
        0 0 30px rgba(255, 165, 0, 0.8),
        inset 0 0 30px rgba(255, 165, 0, 0.2),
        0 10px 20px rgba(0, 0, 0, 0.8);
    }
  }

  @keyframes borderGlow {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
      opacity: 0.8;
    }
  }

  @keyframes leftExtend {
    0%, 100% {
      width: 20px;
      left: -30px;
    }
    50% {
      width: 40px;
      left: -50px;
    }
  }

  @keyframes rightExtend {
    0%, 100% {
      width: 20px;
      right: -30px;
    }
    50% {
      width: 40px;
      right: -50px;
    }
  }

  @media (max-width: 768px) {
    font-size: 1.3em;
    padding: 15px 25px;
    top: 15px;
    letter-spacing: 2px;
  }

  @media (max-width: 480px) {
    font-size: 1.1em;
    padding: 12px 20px;
    top: 10px;
    letter-spacing: 1.5px;
  }

         
`;

// Removed GameOverScreen as it's now part of Game.js

       // --- HomePage Component (Main Menu) ---
       const HomePage = ({ setGlobalSoundEnabled, setGameSoundEnabled, gameSoundEnabled }) => {
  const navigate = useNavigate();

  const BRICK_KEYS = ['experience', 'skills', 'education', 'about'];
           const [selectedBrickIndex, setSelectedBrickIndex] = useState(0);
           const [selectedMobileIndex, setSelectedMobileIndex] = useState(0);
         const [jetX, setJetX] = useState(
           Math.max(50, Math.min(window.innerWidth - 340, window.innerWidth / 2 - 145))
         ); // Center jet initially with bounds
         const [isTransitioning, setIsTransitioning] = useState(false);
         const [musicEnabled, setMusicEnabled] = useState(true);

  // --- New: PC hover handler for bricks ---
  const handleBrickHover = (index) => {
    setSelectedBrickIndex(index);
    playMenuSelect();
  };

  // --- New: Mobile tap handler for main menu ---
  const handleMobileMenuTap = (index, path) => {
    setSelectedMobileIndex(index);
    playMenuSelect();
    setTimeout(() => navigate(path), 120); // Small delay for highlight effect
  };

  const handleSelectClick = useCallback(() => {
    playMenuSelect();
    // Update both desktop and mobile selection
    setSelectedBrickIndex(
      (prevIndex) => (prevIndex + 1) % (BRICK_KEYS?.length || 0)
    );
    setSelectedMobileIndex(
      (prevIndex) => (prevIndex + 1) % (BRICK_KEYS?.length || 0)
    );
  }, [BRICK_KEYS?.length]);

  const handleStartClick = useCallback(() => {
    playMenuSelect();
    // Use mobile selection on mobile, desktop selection on desktop
    const isMobile = window.innerWidth <= 768;
    const selectedIndex = isMobile ? selectedMobileIndex : selectedBrickIndex;
    const selectedKey = BRICK_KEYS[selectedIndex];
    navigate(`/${selectedKey}`);
  }, [selectedBrickIndex, selectedMobileIndex, BRICK_KEYS, navigate]);

  const handlePlayGame = useCallback(() => {
  playMenuSelect();
  playFlyBySound(); // Play fly by sound when jet starts moving
  setIsTransitioning(true);
  // Animate jet to top of screen
  setJetX(window.innerWidth / 2 - 145); // Keep centered

  // After animation, navigate to game
    setTimeout(() => {
    // Request fullscreen on mobile
    if (window.innerWidth <= 768) {
      const gameContainer = document.documentElement;
      if (gameContainer.requestFullscreen) {
        gameContainer.requestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      } else if (gameContainer.webkitRequestFullscreen) {
        gameContainer.webkitRequestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      } else if (gameContainer.msRequestFullscreen) {
        gameContainer.msRequestFullscreen().catch(err => {
          console.log('Fullscreen request failed:', err);
        });
      }
    }
    navigate('/game');
  }, 1000); // 1 second animation
}, [navigate]);

  const handleDownloadResume = useCallback(async () => {
    playMenuSelect();
    try {
                   // Fetch the resume HTML file
             const response = await fetch('/Interactive_Portfolio/resume.html');
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
          allowTaint: true,
        },
        jsPDF: {
          unit: 'in',
          format: 'a4',
          orientation: 'portrait',
        },
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

           const toggleMusic = useCallback(() => {
           if (musicEnabled) {
             stopMenuMusic();
             setMusicEnabled(false);
           } else {
             startMenuMusic();
             setMusicEnabled(true);
           }
         }, [musicEnabled]);

         const toggleGameSound = useCallback(() => {
           if (gameSoundEnabled) {
             setGameSoundEnabled(false);
             setGlobalSoundEnabled(false);
             window.globalSoundEnabled = false; // Update global variable
             stopJetEngineSound(); // Stop jet engine sound when game sound is turned off
           } else {
             setGameSoundEnabled(true);
             setGlobalSoundEnabled(true);
             window.globalSoundEnabled = true; // Update global variable
             startJetEngineSound(); // Start jet engine sound when game sound is turned on
           }
         }, [gameSoundEnabled, setGlobalSoundEnabled]);



  // Handle window resize for jet positioning
  useEffect(() => {
    const handleResize = () => {
      setJetX((prev) => Math.max(50, Math.min(window.innerWidth - 340, prev)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

           // Start menu music when component mounts
  useEffect(() => {
           if (musicEnabled) {
             startMenuMusic();
           }
           return () => stopMenuMusic(); // Stop music when component unmounts
         }, [musicEnabled]);

         // Jet engine sound disabled by default - user interaction handler removed
         // useEffect(() => {
         //   const handleUserInteraction = () => {
         //     if (gameSoundEnabled && !jetEngineSound.playing()) {
         //       startJetEngineSound();
         //     }
         //     // Remove event listeners after first interaction
         //     document.removeEventListener('click', handleUserInteraction);
         //     document.removeEventListener('keydown', handleUserInteraction);
         //     document.removeEventListener('touchstart', handleUserInteraction);
         //   };

         //   // Add event listeners for user interaction
         //   document.addEventListener('click', handleUserInteraction);
         //   document.addEventListener('keydown', handleUserInteraction);
         //   document.addEventListener('touchstart', handleUserInteraction);

         //   return () => {
         //     document.removeEventListener('click', handleUserInteraction);
         //     document.removeEventListener('keydown', handleUserInteraction);
         //     document.removeEventListener('touchstart', handleUserInteraction);
         //   };
         // }, [gameSoundEnabled]);

         // Jet engine sound disabled by default
         // useEffect(() => {
         //   // Delay starting jet sound to allow user interaction first
         //   const timer = setTimeout(() => {
         //     if (gameSoundEnabled) {
         //       startJetEngineSound();
         //     }
         //   }, 1000); // 1 second delay to allow user interaction
           
         //   return () => {
         //     clearTimeout(timer);
         //     stopJetEngineSound(); // Stop jet sound when component unmounts
         //   };
         // }, [gameSoundEnabled]);

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
                     } else if (e.key === 'm' || e.key === 'M') {
               toggleMusic();
             } else if (e.key === 'g' || e.key === 'G') {
               toggleGameSound();
             } else if (e.key === 'ArrowLeft') {
          setJetX((prev) => Math.max(50, prev - 30));
        } else if (e.key === 'ArrowRight') {
          setJetX((prev) => Math.min(window.innerWidth - 340, prev + 30));
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleSelectClick, handleStartClick, handlePlayGame, isTransitioning, toggleMusic, toggleGameSound]);

  return (
    <GameContainer>
                <TitleText>
            <span className="desktop-only">ARCADE GAME THEMED PORTFOLIO</span>
            <span className="mobile-only">
              ARCADE<br />
              GAME THEMED<br />
              PORTFOLIO
            </span>
          </TitleText>
      
      {!isTransitioning && (
        <>
          <HelperText>
            ARROW KEYS: Move Jet | SHIFT: Select | P: Play Game | D: Download Resume | M: Music Toggle | G: Game Sound Toggle
          </HelperText>

          <BrickContainer>
            {(Array.isArray(BRICK_KEYS) ? BRICK_KEYS : []).map((key, index) => (
              <Brick
                key={key}
                $isSelected={index === selectedBrickIndex}
                onMouseEnter={() => handleBrickHover(index)}
                onClick={() => {
                  setSelectedBrickIndex(index);
                  playMenuSelect();
                  navigate(`/${key}`);
                }}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </Brick>
            ))}
          </BrickContainer>

          <MobileMainMenuContainer>
            <MobileMainMenuItem
              $isSelected={selectedMobileIndex === 0}
              onClick={() => handleMobileMenuTap(0, '/experience')}
            >
              Experience
            </MobileMainMenuItem>
            <MobileMainMenuItem
              $isSelected={selectedMobileIndex === 1}
              onClick={() => handleMobileMenuTap(1, '/skills')}
            >
              Skills
            </MobileMainMenuItem>
            <MobileMainMenuItem
              $isSelected={selectedMobileIndex === 2}
              onClick={() => handleMobileMenuTap(2, '/education')}
            >
              Education
            </MobileMainMenuItem>
            <MobileMainMenuItem
              $isSelected={selectedMobileIndex === 3}
              onClick={() => handleMobileMenuTap(3, '/about')}
            >
              About Me
            </MobileMainMenuItem>
          </MobileMainMenuContainer>

          <NavButtonsContainer>
            <RetroButton onClick={handleSelectClick}>SELECT</RetroButton>
            <RetroButton onClick={handleStartClick}>START</RetroButton>
            <PlayButton onClick={handlePlayGame}>PLAY</PlayButton>
            <RetroButton onClick={handleDownloadResume}>DOWNLOAD</RetroButton>
            <RetroButton onClick={toggleMusic}>
              {musicEnabled ? 'MUSIC ON' : 'MUSIC OFF'}
            </RetroButton>
            <RetroButton onClick={toggleGameSound}>
              {gameSoundEnabled ? 'GAME SOUND ON' : 'GAME SOUND OFF'}
            </RetroButton>
          </NavButtonsContainer>

          <MobileMenuContainer>
            <MobileButtonRow>
              <MobileButton onClick={handleSelectClick}>SELECT</MobileButton>
              <MobileButton onClick={handleStartClick}>START</MobileButton>
              <MobileButton onClick={handlePlayGame}>PLAY</MobileButton>
            </MobileButtonRow>
            <MobileButtonRow>
              <MobileButton onClick={handleDownloadResume}>DOWNLOAD</MobileButton>
              <MobileButton onClick={toggleMusic}>
                {musicEnabled ? 'MUSIC ON' : 'MUSIC OFF'}
              </MobileButton>
            </MobileButtonRow>
            <MobileButtonRow>
              <MobileButton onClick={toggleGameSound}>
                {gameSoundEnabled ? 'GAME SOUND ON' : 'GAME SOUND OFF'}
              </MobileButton>
            </MobileButtonRow>
          </MobileMenuContainer>
        </>
      )}

      {/* Jet positioned at bottom with margin/padding */}
      <div
        style={{
          position: 'absolute',
          bottom: isTransitioning ? '100vh' : (window.innerWidth <= 480 ? '30vh' : window.innerWidth <= 768 ? 220 : '14vh'), // Responsive bottom positioning - moved higher for mobile
          left: window.innerWidth <= 768 ? '50%' : jetX, // Center jet on mobile
          transform: isTransitioning 
            ? 'translateY(-100%)' 
            : window.innerWidth <= 768 
              ? 'translateX(-50%)' 
              : 'none', // Center transform on mobile
          zIndex: 10,
          transition: isTransitioning
            ? 'bottom 1s ease-in-out'
            : 'left 0.1s ease-out',
        }}
      >
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
  const [globalSoundEnabled, setGlobalSoundEnabled] = useState(true);
  const [gameSoundEnabled, setGameSoundEnabled] = useState(true);
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage setGlobalSoundEnabled={setGlobalSoundEnabled} setGameSoundEnabled={setGameSoundEnabled} gameSoundEnabled={gameSoundEnabled} />} />
        <Route path="/experience" element={<ExperiencePage />} />
        <Route path="/skills" element={<SkillsPage />} />
        <Route path="/education" element={<EducationPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/game" element={<Game globalSoundEnabled={globalSoundEnabled} gameSoundEnabled={gameSoundEnabled} />} /> {/* New route for the game */}
      </Routes>
    </Router>
  );
}

export default App;
