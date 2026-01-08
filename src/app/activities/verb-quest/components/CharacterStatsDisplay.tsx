import React from 'react';
import { Character } from './Character';

interface CharacterStatsDisplayProps {
  character: Character;
}

export default function CharacterStatsDisplay({ character }: CharacterStatsDisplayProps) {
  const { stats } = character;
  
  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2">
        <span className="text-yellow-400">⭐</span>
        <span>{stats.name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-blue-400">Lv.</span>
        <span>{stats.level}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-green-400">❤️</span>
        <span>{stats.health}/{stats.maxHealth}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-purple-400">⚡</span>
        <span>{stats.experience}/{stats.experienceToNext}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <span className="text-orange-400">🏆</span>
        <span>{stats.defeatedEnemies.size}</span>
      </div>
    </div>
  );
}
