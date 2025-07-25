// src/components/SkillsPage.js
import React from 'react';
import styled from 'styled-components';
import { skills } from '../resumeData'; // Import skills data

const SkillsContainer = styled.div`
  /* Basic styling for your skills page - adapt from resume.html but keep game theme */
  color: white;
  padding: 20px;
  max-height: 80vh; /* Adjust as needed for game screen */
  overflow-y: auto; /* Enable scrolling for long content */
  font-family: "Press Start 2P", monospace; /* Use your game's font */
  text-align: left;
  line-height: 1.6;

  h1 {
    font-size: 1.8em;
    color: #00ff00; /* Retro green */
    margin-bottom: 20px;
    text-align: center;
  }
`;

const SkillsCategory = styled.div`
  margin-bottom: 15px;

  h3 {
    font-size: 1.2em;
    color: #00ffff; /* Retro cyan */
    margin-bottom: 10px;
    border-bottom: 1px dashed #00ffff;
    padding-bottom: 5px;
  }
`;

const SkillTagContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px; /* Space between tags */
`;

const SkillTag = styled.span`
  background-color: #333;
  color: #fff;
  padding: 5px 10px;
  border-radius: 3px;
  font-size: 0.8em;
  border: 1px solid #666;
  text-transform: uppercase;
`;

const SkillsPage = () => {
  return (
    <SkillsContainer>
      <h1>TECHNICAL SKILLS</h1>
      {skills.map((categoryData, index) => (
        <SkillsCategory key={index}>
          <h3>{categoryData.category}:</h3>
          <SkillTagContainer>
            {categoryData.items.map((item, itemIndex) => (
              <SkillTag key={itemIndex}>{item}</SkillTag>
            ))}
          </SkillTagContainer>
        </SkillsCategory>
      ))}
    </SkillsContainer>
  );
};

export default SkillsPage;