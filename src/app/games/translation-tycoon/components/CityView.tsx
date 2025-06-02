'use client';

import React, { useEffect, useState } from 'react';
import { BuildingUpgrade } from '../types';

interface CityViewProps {
  buildings: BuildingUpgrade[];
  onBuildingClick: (building: BuildingUpgrade) => void;
}

const CityView: React.FC<CityViewProps> = ({ buildings, onBuildingClick }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Check if we're in a desktop environment
    const checkIfDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    
    // Initial check
    checkIfDesktop();
    
    // Add resize listener
    window.addEventListener('resize', checkIfDesktop);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfDesktop);
  }, []);
  
  const getPositionStyle = (index: number) => {
    // Desktop positions use more of the screen space with buildings spread out
    const desktopPositions = [
      { left: '10%', bottom: '15%' },  // Left bottom
      { right: '10%', bottom: '15%' }, // Right bottom
      { left: '30%', bottom: '25%' },  // Middle left
      { right: '30%', bottom: '25%' }, // Middle right
      { left: '20%', bottom: '40%' },  // Upper left
      { right: '20%', bottom: '40%' }, // Upper right
      { left: '50%', bottom: '20%', transform: 'translateX(-50%)' }, // Center bottom
      { left: '50%', bottom: '45%', transform: 'translateX(-50%)' }  // Center middle
    ];
    
    // Mobile positions (more compact)
    const mobilePositions = [
      { left: '10%', bottom: '10%' },
      { right: '10%', bottom: '10%' },
      { left: '10%', bottom: '30%' },
      { right: '10%', bottom: '30%' }
    ];
    
    return isDesktop 
      ? desktopPositions[index % desktopPositions.length] 
      : mobilePositions[index % mobilePositions.length];
  };

  const getBuildingImage = (building: BuildingUpgrade) => {
    const basePath = '/games/translation-tycoon/buildings';
    return `${basePath}/${building.id}-level-${building.level}.png`;
  };

  return (
    <div className="city-view">
      {buildings.map((building, index) => (
        <div
          key={building.id}
          className="building"
          style={{
            ...getPositionStyle(index),
            width: `${120 + (building.level - 1) * 20}px`,
            height: `${120 + (building.level - 1) * 20}px`,
            backgroundImage: `url(${getBuildingImage(building)})`,
          }}
          onClick={() => onBuildingClick(building)}
        >
          <div className="building-level">
            Level {building.level}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CityView; 