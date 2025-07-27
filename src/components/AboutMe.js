import React, { useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const AboutPage = styled.div`
  width: 90%;
  min-height: 90%;
  background: linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${process.env.PUBLIC_URL}/game/bg_main_background.webp);
  background-size: cover;
  background-position: center;
  padding: 20px;
  border: 3px solid #00ffff;
  border-radius: 10px;
  color: white;
  font-size: 1.2em;
  font-family: 'Courier New', monospace;
  box-shadow: 
    0 0 20px rgba(0, 255, 255, 0.7),
    inset 0 0 20px rgba(0, 255, 255, 0.1),
    0 0 40px rgba(0, 255, 255, 0.3);
  display: flex;
  flex-direction: column;
  position: relative;
  scroll-behavior: smooth;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid rgba(0, 255, 255, 0.3);
    border-radius: 10px;
    pointer-events: none;
  }

  h1 {
    text-align: center;
    color: #00ff00;
    text-shadow: 
      0 0 10px #00ff00,
      0 0 20px #00ff00,
      2px 2px 4px rgba(0, 0, 0, 0.8);
    margin-bottom: 20px;
    margin-top: 60px;
    font-size: 2em;
    letter-spacing: 2px;
    animation: glow 2s ease-in-out infinite alternate;
  }
  
  @keyframes glow {
    from {
      text-shadow: 0 0 10px #00ff00, 0 0 20px #00ff00, 2px 2px 4px rgba(0, 0, 0, 0.8);
    }
    to {
      text-shadow: 0 0 20px #00ff00, 0 0 30px #00ff00, 2px 2px 4px rgba(0, 0, 0, 0.8);
    }
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    margin-bottom: 10px;
    padding: 8px;
    border-left: 2px solid rgba(0, 255, 255, 0.3);
    background: rgba(0, 255, 255, 0.05);
    border-radius: 0 5px 5px 0;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 255, 255, 0.1);
      border-left-color: #00ffff;
      transform: translateX(5px);
    }
  }

  a {
    color: skyblue;
  }

  p {
    margin-bottom: 10px;
    padding: 8px;
    border-left: 2px solid rgba(0, 255, 255, 0.3);
    background: rgba(0, 255, 255, 0.05);
    border-radius: 0 5px 5px 0;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(0, 255, 255, 0.1);
      border-left-color: #00ffff;
      transform: translateX(5px);
    }
  }

  h2, h3 {
    color: #00ffff;
    margin-top: 15px;
    margin-bottom: 10px;
    text-shadow: 0 0 8px #00ffff;
    border-left: 3px solid #00ffff;
    padding-left: 10px;
    background: linear-gradient(90deg, rgba(0, 255, 255, 0.1), transparent);
  }
  
  @media (max-width: 768px) {
    font-size: 1em;
    padding: 15px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9em;
    padding: 10px;
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

const AboutMe = ({ 
  profileSummary, 
  careerHighlights, 
  earlyCareer, 
  interests, 
  profile, 
  personalDetails 
}) => {
  const navigate = useNavigate();
  const pageRef = React.useRef(null);
  
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        navigate('/');
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        const parentContainer = pageRef.current?.parentElement;
        if (parentContainer) {
          parentContainer.scrollTop -= 50;
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        const parentContainer = pageRef.current?.parentElement;
        if (parentContainer) {
          parentContainer.scrollTop += 50;
        }
      }
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      const parentContainer = pageRef.current?.parentElement;
      if (parentContainer) {
        parentContainer.scrollTop += e.deltaY;
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    if (pageRef.current) {
      pageRef.current.addEventListener('wheel', handleWheel, { passive: false });
    }
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (pageRef.current) {
        pageRef.current.removeEventListener('wheel', handleWheel);
      }
    };
  }, [navigate]);
  
  return (
    <AboutPage ref={pageRef}>
      <HelperText>
        ESC: Back to Menu | ARROW KEYS: Scroll
      </HelperText>
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
    </AboutPage>
  );
};

export default AboutMe;
