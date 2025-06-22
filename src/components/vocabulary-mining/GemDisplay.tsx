'use client';

import React from 'react';
import { 
  GemType, 
  MasteryLevel, 
  VocabularyGem, 
  GemCollection 
} from '../../types/vocabulary-mining';
import { 
  getGemInfo, 
  getMasteryInfo, 
  getNextReviewText 
} from '../../utils/vocabulary-mining';
import { 
  Clock, 
  Zap, 
  Target, 
  TrendingUp, 
  Calendar,
  Star,
  Award
} from 'lucide-react';

interface GemDisplayProps {
  gem: VocabularyGem;
  collection?: GemCollection;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
  onClick?: () => void;
}

export function GemDisplay({ 
  gem, 
  collection, 
  size = 'md', 
  showDetails = false,
  onClick 
}: GemDisplayProps) {
  const gemInfo = getGemInfo(gem.gemType);
  const masteryInfo = collection ? getMasteryInfo(collection.masteryLevel) : null;
  
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base'
  };
  
  const accuracy = collection 
    ? collection.totalEncounters > 0 
      ? Math.round((collection.correctEncounters / collection.totalEncounters) * 100)
      : 0
    : 0;

  return (
    <div 
      className={`relative group ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
    >
      {/* Gem Icon */}
      <div 
        className={`
          ${sizeClasses[size]} 
          rounded-full flex items-center justify-center
          border-2 transition-all duration-200
          ${onClick ? 'hover:scale-110 hover:shadow-lg' : ''}
        `}
        style={{ 
          backgroundColor: gemInfo.color + '20',
          borderColor: gemInfo.color,
          color: gemInfo.color
        }}
      >
        <span className="font-bold">{gemInfo.icon}</span>
        
        {/* Gem Level Badge */}
        {collection && collection.gemLevel > 1 && (
          <div 
            className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-white"
            style={{ backgroundColor: gemInfo.color }}
          >
            {collection.gemLevel}
          </div>
        )}
        
        {/* Mastery Level Indicator */}
        {collection && collection.masteryLevel >= 4 && (
          <div className="absolute -bottom-1 -right-1">
            <Star className="w-4 h-4 text-yellow-500 fill-current" />
          </div>
        )}
      </div>
      
      {/* Tooltip/Details */}
      {showDetails && (
        <div className="absolute z-10 bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-gray-900 text-white text-xs rounded-lg p-3 shadow-lg min-w-48">
            <div className="font-semibold mb-1">{gem.term}</div>
            <div className="text-gray-300 mb-2">{gem.translation}</div>
            
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="flex items-center">
                <span 
                  className="w-2 h-2 rounded-full mr-1"
                  style={{ backgroundColor: gemInfo.color }}
                />
                {gemInfo.name}
              </span>
              {collection && (
                <span className="flex items-center">
                  <Award className="w-3 h-3 mr-1" />
                  Level {collection.gemLevel}
                </span>
              )}
            </div>
            
            {collection && (
              <>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="flex items-center">
                    <Target className="w-3 h-3 mr-1" />
                    {accuracy}% accuracy
                  </span>
                  <span className="flex items-center">
                    <Zap className="w-3 h-3 mr-1" />
                    {collection.currentStreak} streak
                  </span>
                </div>
                
                {masteryInfo && (
                  <div className="flex items-center text-xs mb-1">
                    <span 
                      className="w-2 h-2 rounded-full mr-1"
                      style={{ backgroundColor: masteryInfo.color }}
                    />
                    {masteryInfo.name}
                  </div>
                )}
                
                {collection.nextReviewAt && (
                  <div className="flex items-center text-xs text-gray-400">
                    <Calendar className="w-3 h-3 mr-1" />
                    {getNextReviewText(collection.nextReviewAt)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

interface GemGridProps {
  gems: (VocabularyGem & { collection?: GemCollection })[];
  onGemClick?: (gem: VocabularyGem, collection?: GemCollection) => void;
  maxDisplay?: number;
}

export function GemGrid({ gems, onGemClick, maxDisplay }: GemGridProps) {
  const displayGems = maxDisplay ? gems.slice(0, maxDisplay) : gems;
  const remainingCount = maxDisplay && gems.length > maxDisplay ? gems.length - maxDisplay : 0;
  
  return (
    <div className="flex flex-wrap gap-2">
      {displayGems.map((gem) => (
        <GemDisplay
          key={gem.id}
          gem={gem}
          collection={gem.collection}
          showDetails
          onClick={() => onGemClick?.(gem, gem.collection)}
        />
      ))}
      
      {remainingCount > 0 && (
        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
          +{remainingCount}
        </div>
      )}
    </div>
  );
}

interface GemStatsProps {
  collection: GemCollection;
  gem: VocabularyGem;
}

export function GemStats({ collection, gem }: GemStatsProps) {
  const gemInfo = getGemInfo(gem.gemType);
  const masteryInfo = getMasteryInfo(collection.masteryLevel);
  const accuracy = collection.totalEncounters > 0 
    ? Math.round((collection.correctEncounters / collection.totalEncounters) * 100)
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-sm border p-4">
      <div className="flex items-center mb-4">
        <GemDisplay gem={gem} collection={collection} size="lg" />
        <div className="ml-4">
          <h3 className="text-lg font-semibold">{gem.term}</h3>
          <p className="text-gray-600">{gem.translation}</p>
          <div className="flex items-center mt-1">
            <span 
              className="px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: gemInfo.color }}
            >
              {gemInfo.name}
            </span>
            <span 
              className="ml-2 px-2 py-1 rounded-full text-xs font-medium text-white"
              style={{ backgroundColor: masteryInfo.color }}
            >
              {masteryInfo.name}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{collection.gemLevel}</div>
          <div className="text-sm text-gray-600">Gem Level</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{accuracy}%</div>
          <div className="text-sm text-gray-600">Accuracy</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-purple-600">{collection.currentStreak}</div>
          <div className="text-sm text-gray-600">Current Streak</div>
        </div>
        
        <div className="text-center">
          <div className="text-2xl font-bold text-orange-600">{collection.totalEncounters}</div>
          <div className="text-sm text-gray-600">Total Practice</div>
        </div>
      </div>
      
      {collection.nextReviewAt && (
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="w-4 h-4 mr-2" />
            Next review: {getNextReviewText(collection.nextReviewAt)}
          </div>
        </div>
      )}
      
      {gem.exampleSentence && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="text-sm font-medium text-blue-900">Example:</div>
          <div className="text-sm text-blue-800 italic">"{gem.exampleSentence}"</div>
          {gem.exampleTranslation && (
            <div className="text-sm text-blue-600 mt-1">"{gem.exampleTranslation}"</div>
          )}
        </div>
      )}
    </div>
  );
}

interface MasteryProgressProps {
  masteryLevel: MasteryLevel;
  progress?: number; // 0-100 percentage to next level
}

export function MasteryProgress({ masteryLevel, progress = 0 }: MasteryProgressProps) {
  const masteryInfo = getMasteryInfo(masteryLevel);
  const nextLevel = Math.min(5, masteryLevel + 1) as MasteryLevel;
  const nextMasteryInfo = getMasteryInfo(nextLevel);
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="flex items-center">
          <span 
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: masteryInfo.color }}
          />
          {masteryInfo.name}
        </span>
        {masteryLevel < 5 && (
          <span className="text-gray-500">
            Next: {nextMasteryInfo.name}
          </span>
        )}
      </div>
      
      {masteryLevel < 5 && (
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="h-2 rounded-full transition-all duration-300"
            style={{ 
              width: `${progress}%`,
              backgroundColor: nextMasteryInfo.color 
            }}
          />
        </div>
      )}
      
      <div className="text-xs text-gray-600">
        {masteryInfo.description}
      </div>
    </div>
  );
}
