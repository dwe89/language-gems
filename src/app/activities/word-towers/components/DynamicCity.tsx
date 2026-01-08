'use client';

import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface DynamicCityProps {
  level: number;
  timeOfDay: 'morning' | 'day' | 'evening' | 'night';
  weather: 'clear' | 'cloudy' | 'rain' | 'snow';
}

export const DynamicCity: React.FC<DynamicCityProps> = ({
  level,
  timeOfDay,
  weather
}) => {
  // Calculate which buildings should be visible based on level
  const visibleBuildings = useMemo(() => {
    const buildings = [
      { id: 1, minLevel: 1, height: 60, color: '#4A90E2' },
      { id: 2, minLevel: 3, height: 80, color: '#7ED321' },
      { id: 3, minLevel: 5, height: 100, color: '#F5A623' },
      { id: 4, minLevel: 7, height: 70, color: '#BD10E0' },
      { id: 5, minLevel: 10, height: 120, color: '#B8E986' },
      { id: 6, minLevel: 12, height: 90, color: '#50E3C2' },
      { id: 7, minLevel: 15, height: 110, color: '#FF6B6B' }
    ];
    
    return buildings.filter(building => level >= building.minLevel);
  }, [level]);

  // Get time-based filter styles
  const getTimeFilter = () => {
    switch (timeOfDay) {
      case 'morning':
        return 'hue-rotate(15deg) brightness(1.1) contrast(1.05)';
      case 'day':
        return 'brightness(1) contrast(1)';
      case 'evening':
        return 'hue-rotate(30deg) brightness(0.9) sepia(0.2)';
      case 'night':
        return 'hue-rotate(240deg) brightness(0.6) contrast(1.2)';
      default:
        return 'brightness(1) contrast(1)';
    }
  };

  // Weather effects
  const WeatherEffect = () => {
    if (weather === 'rain') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 50 }).map((_, i) => (
            <motion.div
              key={`rain-${i}`}
              className="absolute w-px h-4 bg-blue-300 opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px'
              }}
              animate={{
                y: ['0vh', '120vh'],
                opacity: [0.6, 0.6, 0]
              }}
              transition={{
                duration: 1 + Math.random() * 0.5,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      );
    }

    if (weather === 'snow') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={`snow-${i}`}
              className="absolute w-2 h-2 bg-white rounded-full opacity-80"
              style={{
                left: `${Math.random() * 100}%`,
                top: '-20px'
              }}
              animate={{
                y: ['0vh', '120vh'],
                x: [0, Math.random() * 40 - 20],
                opacity: [0.8, 0.8, 0]
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 3,
                ease: 'linear'
              }}
            />
          ))}
        </div>
      );
    }

    if (weather === 'cloudy') {
      return (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            className="absolute top-10 left-0 w-32 h-16 bg-gray-400 rounded-full opacity-30"
            animate={{
              x: ['-100px', '100vw'],
            }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear'
            }}
          />
          <motion.div
            className="absolute top-20 right-0 w-24 h-12 bg-gray-300 rounded-full opacity-25"
            animate={{
              x: ['100vw', '-100px'],
            }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
              delay: 10
            }}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div 
      className="absolute inset-0 transition-all duration-2000 ease-in-out"
      style={{ filter: getTimeFilter() }}
    >
      {/* Background city skyline */}
      <div className="absolute bottom-0 left-0 right-0 h-64">
        {/* Base buildings (always visible) */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-gray-600 to-gray-400 opacity-60" />
        
        {/* Dynamic buildings that appear as levels progress */}
        <div className="absolute bottom-0 left-0 right-0 flex items-end justify-around">
          {visibleBuildings.map((building) => (
            <motion.div
              key={building.id}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: building.height, opacity: 0.7 }}
              transition={{ 
                duration: 2,
                ease: "easeOut",
                delay: 0.5
              }}
              className="relative"
              style={{
                width: '60px',
                backgroundColor: building.color,
                border: '2px solid rgba(255,255,255,0.2)'
              }}
            >
              {/* Building windows */}
              <div className="absolute inset-2 grid grid-cols-3 gap-1">
                {Array.from({ length: Math.floor(building.height / 15) * 3 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 ${
                      timeOfDay === 'night' 
                        ? Math.random() > 0.7 ? 'bg-yellow-200' : 'bg-gray-800'
                        : 'bg-blue-200 opacity-50'
                    }`}
                  />
                ))}
              </div>
              
              {/* Construction crane for new buildings */}
              {building.minLevel === level && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute -top-8 -right-4"
                >
                  <div className="w-1 h-8 bg-yellow-400"></div>
                  <div className="absolute top-2 left-0 w-6 h-px bg-yellow-400"></div>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Construction site elements for higher levels */}
        {level >= 5 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute bottom-0 right-16"
          >
            {/* Scaffolding */}
            <div className="w-12 h-20 border-2 border-gray-500 bg-gray-400 opacity-40">
              <div className="grid grid-cols-3 h-full gap-px p-1">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className="bg-gray-600 opacity-60" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Additional cranes for higher levels */}
        {level >= 8 && (
          <motion.div
            initial={{ opacity: 0, rotate: 0 }}
            animate={{ opacity: 1, rotate: 5 }}
            className="absolute bottom-20 left-20"
          >
            <div className="w-px h-16 bg-yellow-500"></div>
            <div className="absolute top-4 left-0 w-12 h-px bg-yellow-500 origin-left rotate-12"></div>
          </motion.div>
        )}
      </div>

      {/* Weather effects overlay */}
      <WeatherEffect />

      {/* Day/night lighting overlay */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/30 to-purple-900/20 pointer-events-none" />
      )}
      
      {timeOfDay === 'evening' && (
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/20 to-yellow-900/10 pointer-events-none" />
      )}
    </div>
  );
};
