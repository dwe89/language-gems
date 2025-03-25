'use client';

import React from 'react';
import { TowerBlock } from './TowerBlock';
import { TowerBlock as TowerBlockType } from '../types';

interface TowerProps {
  blocks: TowerBlockType[];
  fallingBlocks: string[];
}

export const Tower: React.FC<TowerProps> = ({ blocks, fallingBlocks }) => {
  return (
    <div className="tower-container">
      <div className="tower-body">
        {blocks.map((block, index) => (
          <TowerBlock 
            key={block.id}
            block={block}
            index={index}
            isFalling={fallingBlocks.includes(block.id)}
          />
        ))}
      </div>
      <div className="tower-base"></div>
    </div>
  );
}; 