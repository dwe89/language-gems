'use client';

import React from 'react';
import { BuildingUpgrade } from '../types';

interface CityViewProps {
  buildings: BuildingUpgrade[];
  onBuildingClick: (building: BuildingUpgrade) => void;
}

const CityView: React.FC<CityViewProps> = ({ buildings, onBuildingClick }) => {
  const getPositionStyle = (index: number) => {
    const positions = [
      { left: '10%', bottom: '10%' },
      { right: '10%', bottom: '10%' },
      { left: '10%', bottom: '30%' },
      { right: '10%', bottom: '30%' }
    ];
    return positions[index % positions.length];
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