import { SentenceChallenge } from '../types';

export interface WordObject {
  id: string;
  word: string;
  isCorrect: boolean;
  x: number;
  y: number;
  speed: number;
  rotation: number;
  scale: number;
  spawnTime: number;
  clicked: boolean;
}

export interface ParticleEffect {
  id: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  type: 'success' | 'error' | 'ambient';
}

// Base theme engine class for shared functionality
export abstract class BaseThemeEngine {
  public generateDecoys(correctWords: string[], allChallenges: SentenceChallenge[], difficulty: string): string[] {
    // Get words from other sentences in the same category
    const otherWords = allChallenges
      .flatMap(challenge => challenge.words)
      .filter(word => !correctWords.includes(word))
      .filter((word, index, arr) => arr.indexOf(word) === index); // Remove duplicates

    // Add some common Spanish words as additional decoys
    const commonDecoys = [
      'el', 'la', 'los', 'las', 'un', 'una', 'y', 'o', 'pero', 'que', 'de', 'del', 'al',
      'en', 'con', 'por', 'para', 'sin', 'sobre', 'bajo', 'entre', 'desde', 'hasta',
      'muy', 'más', 'menos', 'también', 'solo', 'siempre', 'nunca', 'aquí', 'allí',
      'hoy', 'ayer', 'mañana', 'ahora', 'después', 'antes', 'cuando', 'donde', 'como'
    ];

    const allDecoys = [...otherWords, ...commonDecoys]
      .filter(word => !correctWords.includes(word));

    // Determine number of decoys based on difficulty
    const decoyCount = difficulty === 'beginner' ? 4 : difficulty === 'intermediate' ? 6 : 8;
    
    // Shuffle and select decoys
    const shuffled = allDecoys.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, decoyCount);
  }

  public createParticleEffect(
    x: number,
    y: number,
    type: 'success' | 'error' | 'ambient',
    count: number = 10
  ): ParticleEffect[] {
    const colors = {
      success: ['#10B981', '#34D399', '#6EE7B7'],
      error: ['#EF4444', '#F87171', '#FCA5A5'],
      ambient: ['#8B5CF6', '#A78BFA', '#C4B5FD']
    };

    return Array.from({ length: count }, (_, i) => ({
      id: `particle-${Date.now()}-${i}`,
      x,
      y,
      vx: (Math.random() - 0.5) * 10,
      vy: (Math.random() - 0.5) * 10,
      life: 1,
      maxLife: 1,
      color: colors[type][Math.floor(Math.random() * colors[type].length)],
      size: Math.random() * 6 + 2,
      type
    }));
  }

  public checkCollision(obj1: WordObject, obj2: WordObject, minDistance: number = 120): boolean {
    const distance = Math.sqrt(
      Math.pow(obj1.x - obj2.x, 2) + Math.pow(obj1.y - obj2.y, 2)
    );
    return distance < minDistance;
  }

  public findNonOverlappingPosition(
    existingObjects: WordObject[],
    screenWidth: number,
    screenHeight: number,
    objectWidth: number = 120,
    maxAttempts: number = 50
  ): { x: number; y: number } {
    let position = { x: 0, y: -100 };
    let attempts = 0;

    do {
      position.x = Math.random() * (screenWidth - objectWidth) + objectWidth / 2;
      position.y = -100 - (Math.random() * 200); // Spawn above screen
      attempts++;
    } while (
      attempts < maxAttempts &&
      existingObjects.some(obj => {
        const distance = Math.sqrt(
          Math.pow(position.x - obj.x, 2) + Math.pow(position.y - obj.y, 2)
        );
        return distance < 120; // Minimum distance between objects
      })
    );

    return position;
  }
}
