'use client';

// Basic verb data and utility functions
// This file is a simplified version - enhanced functionality is in VerbDataEnhanced.tsx

interface VerbConjugation {
  yo: string;
  tu: string;
  el: string;
  nosotros: string;
  vosotros: string;
  ellos: string;
}

export interface Verb {
  infinitive: string;
  english: string;
  type: string;
  category?: string;
  difficulty?: number;
  conjugations: VerbConjugation;
}

// Basic present tense regular verbs
export const verbData = {
  hablar: {
    infinitive: 'hablar',
    english: 'to speak',
    type: 'regular',
    category: 'ar',
    difficulty: 1,
    conjugations: {
      yo: 'hablo',
      tu: 'hablas',
      el: 'habla',
      nosotros: 'hablamos',
      vosotros: 'habláis',
      ellos: 'hablan'
    }
  },
  comer: {
    infinitive: 'comer',
    english: 'to eat',
    type: 'regular',
    category: 'er',
    difficulty: 1,
    conjugations: {
      yo: 'como',
      tu: 'comes',
      el: 'come',
      nosotros: 'comemos',
      vosotros: 'coméis',
      ellos: 'comen'
    }
  }
};

// Simple pronoun map for display
export const pronounMap = {
  yo: { english: 'I', formal: false },
  tu: { english: 'you', formal: false },
  el: { english: 'he/she/it', formal: false },
  nosotros: { english: 'we', formal: false },
  vosotros: { english: 'you all', formal: false },
  ellos: { english: 'they/you all (formal)', formal: true }
};

// Basic enemy data structure
export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  health: number;
  difficulty: string;
  verbTypes: string[];
  tenseTypes?: string[];
  experience: number;
  description: string;
}

// Basic enemy data
export const enemies = {
  // Forest of Beginnings (Level 1)
  moss_goblin: {
    id: 'moss_goblin',
    name: 'Moss Goblin',
    emoji: '👺',
    health: 100,
    difficulty: 'Beginner',
    verbTypes: ['regular'],
    tenseTypes: ['present.regular'],
    experience: 20,
    description: 'A small creature covered in moss, perfect for learning basic conjugations.'
  },
  leaf_sprite: {
    id: 'leaf_sprite',
    name: 'Leaf Sprite',
    emoji: '🧚‍♀️',
    health: 150,
    difficulty: 'Beginner',
    verbTypes: ['regular'],
    tenseTypes: ['present.regular'],
    experience: 40,
    description: 'A playful forest spirit that tests basic present tense conjugations.'
  },
  forest_guardian: {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    emoji: '🌳',
    health: 200,
    difficulty: 'Easy',
    verbTypes: ['regular'],
    tenseTypes: ['present.regular'],
    experience: 100,
    description: 'Ancient protector of the forest who challenges newcomers.'
  },

  // Temple of Chaos (Level 2)
  chaos_acolyte: {
    id: 'chaos_acolyte',
    name: 'Chaos Acolyte',
    emoji: '�',
    health: 150,
    difficulty: 'Easy',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 30,
    description: 'A mysterious follower of the temple.'
  },
  time_weaver: {
    id: 'time_weaver',
    name: 'Time Weaver',
    emoji: '⏰',
    health: 250,
    difficulty: 'Medium',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 50,
    description: 'A being that manipulates temporal energy.'
  },
  chaos_lord: {
    id: 'chaos_lord',
    name: 'Chaos Lord',
    emoji: '🌀',
    health: 250,
    difficulty: 'Medium',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 120,
    description: 'The powerful ruler of the temple.'
  },

  // Cave of Memories (Level 3)
  shadow_wraith: {
    id: 'shadow_wraith',
    name: 'Shadow Wraith',
    emoji: '👤',
    health: 300,
    difficulty: 'Medium',
    verbTypes: ['regular'],
    tenseTypes: ['preterite.regular'],
    experience: 60,
    description: 'A mysterious wraith from the shadows.'
  },
  memory_specter: {
    id: 'memory_specter',
    name: 'Memory Specter',
    emoji: '👻',
    health: 350,
    difficulty: 'Medium',
    verbTypes: ['regular'],
    tenseTypes: ['preterite.regular'],
    experience: 80,
    description: 'A specter that haunts memories.'
  },
  temporal_guardian: {
    id: 'temporal_guardian',
    name: 'Temporal Guardian',
    emoji: '⚡',
    health: 400,
    difficulty: 'Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular'],
    experience: 150,
    description: 'The guardian of time itself.'
  },

  // Lair of Legends (Level 4)
  legendary_beast: {
    id: 'legendary_beast',
    name: 'Legendary Beast',
    emoji: '🐉',
    health: 400,
    difficulty: 'Hard',
    verbTypes: ['irregular'],
    tenseTypes: ['preterite.irregular'],
    experience: 100,
    description: 'A fearsome beast of legend.'
  },
  mythical_guardian: {
    id: 'mythical_guardian',
    name: 'Mythical Guardian',
    emoji: '🛡️',
    health: 500,
    difficulty: 'Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 200,
    description: 'The ancient guardian of legends.'
  },

  // Swamp of Habits (Level 5)
  swamp_hag: {
    id: 'swamp_hag',
    name: 'Swamp Hag',
    emoji: '🧙‍♀️',
    health: 500,
    difficulty: 'Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['preterite.regular', 'preterite.irregular'],
    experience: 120,
    description: 'A mysterious creature of the swamp.'
  },
  habitual_phantom: {
    id: 'habitual_phantom',
    name: 'Habitual Phantom',
    emoji: '👻',
    health: 600,
    difficulty: 'Very Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 250,
    description: 'A phantom that haunts with repetitive actions.'
  },

  // Skyward Spire (Level 6)
  sky_guardian: {
    id: 'sky_guardian',
    name: 'Sky Guardian',
    emoji: '☁️',
    health: 700,
    difficulty: 'Very Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 300,
    description: 'The majestic guardian of the skies.'
  },

  // Palace of Possibilities (Level 7)
  possibility_wraith: {
    id: 'possibility_wraith',
    name: 'Possibility Wraith',
    emoji: '🔮',
    health: 800,
    difficulty: 'Very Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 150,
    description: 'A wraith of infinite possibilities.'
  },
  conditional_specter: {
    id: 'conditional_specter',
    name: 'Conditional Specter',
    emoji: '❓',
    health: 900,
    difficulty: 'Legendary',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 350,
    description: 'A specter of hypothetical scenarios.'
  },

  // Dungeon of Commands (Level 8)
  commander_specter: {
    id: 'commander_specter',
    name: 'Commander Specter',
    emoji: '⚔️',
    health: 1000,
    difficulty: 'Legendary',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'present.irregular', 'preterite.regular', 'preterite.irregular'],
    experience: 200,
    description: 'Ghostly commander who demands perfect imperative forms.'
  },
  imperative_phantom: {
    id: 'imperative_phantom',
    name: 'Imperative Phantom',
    emoji: '👤',
    health: 1200,
    difficulty: 'Legendary',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 400,
    description: 'Spirit that only speaks in commands and demands.'
  },

  // Shrine of Perfection (Level 9) 
  perfection_guardian: {
    id: 'perfection_guardian',
    name: 'Perfection Guardian',
    emoji: '�',
    health: 1400,
    difficulty: 'Legendary',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 450,
    description: 'Ultimate guardian that demands flawless conjugation mastery.'
  },
  compound_wraith: {
    id: 'compound_wraith',
    name: 'Compound Wraith',
    emoji: '⚗️',
    health: 1300,
    difficulty: 'Legendary',
    verbTypes: ['irregular', 'stem-changing'],
    tenseTypes: ['present.irregular'],
    experience: 400,
    description: 'Ethereal being that speaks in complex compound tenses.'
  },

  // Castle of Conjugations (Level 10)
  subjunctive_lord: {
    id: 'subjunctive_lord',
    name: 'Subjunctive Lord',
    emoji: '👑',
    health: 1500,
    difficulty: 'Legendary',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular'],
    experience: 600,
    description: 'Master of doubt and desire who speaks only in subjunctive mood.'
  },
  conjugation_master: {
    id: 'conjugation_master',
    name: 'Conjugation Master',
    emoji: '🧙‍♂️',
    health: 2000,
    difficulty: 'Legendary',
    verbTypes: ['irregular', 'stem-changing', 'reflexive'],
    tenseTypes: ['present.irregular'],
    experience: 1000,
    description: 'The ultimate master of all conjugations and verb forms.'
  }
};

// Enhanced regions with unlock requirements
export const regions = {
  forest_of_beginnings: {
    id: 'forest_of_beginnings',
    name: 'Forest of Beginnings',
    emoji: '🌲',
    description: 'A peaceful woodland where your journey begins with basic present tense verbs.',
    background: 'from-green-700 to-green-900',
    enemies: [enemies.moss_goblin, enemies.leaf_sprite, enemies.forest_guardian],
    unlockRequirement: null,
    recommendedLevel: 1,
    tenseTypes: ['present.regular']
  },
  temple_of_chaos: {
    id: 'temple_of_chaos',
    name: 'Temple of Chaos',
    emoji: '🏛️',
    description: 'Master irregular present tense verbs in this mystical temple.',
    background: 'from-purple-700 to-purple-900',
    enemies: [enemies.chaos_acolyte, enemies.time_weaver, enemies.chaos_lord],
    unlockRequirement: { level: 2, defeatedEnemies: ['moss_goblin', 'leaf_sprite', 'forest_guardian'] },
    recommendedLevel: 2,
    tenseTypes: ['present.irregular']
  },
  cave_of_memories: {
    id: 'cave_of_memories',
    name: 'Cave of Memories',
    emoji: '🕳️',
    description: 'Ancient caverns filled with echoes of regular verbs in the past tense.',
    background: 'from-gray-700 to-gray-900',
    enemies: [enemies.shadow_wraith, enemies.memory_specter, enemies.temporal_guardian],
    unlockRequirement: { level: 3, defeatedEnemies: ['chaos_acolyte', 'time_weaver', 'chaos_lord'] },
    recommendedLevel: 3,
    tenseTypes: ['preterite.regular']
  },
  lair_of_legends: {
    id: 'lair_of_legends',
    name: 'Lair of Legends',
    emoji: '�',
    description: 'An ancient labyrinth testing mastery of irregular preterite tense verbs.',
    background: 'from-red-800 to-red-950',
    enemies: [enemies.legendary_beast, enemies.mythical_guardian],
    unlockRequirement: { level: 4, defeatedEnemies: ['shadow_wraith', 'memory_specter', 'temporal_guardian'] },
    recommendedLevel: 4,
    tenseTypes: ['preterite.irregular']
  },
  swamp_of_habits: {
    id: 'swamp_of_habits',
    name: 'Swamp of Habits',
    emoji: '🌿',
    description: 'A foggy swamp reflecting repetitive actions in the past, with preterite challenges.',
    background: 'from-green-800 to-gray-800',
    enemies: [enemies.swamp_hag, enemies.habitual_phantom],
    unlockRequirement: { level: 5, defeatedEnemies: ['legendary_beast', 'mythical_guardian'] },
    recommendedLevel: 5,
    tenseTypes: ['preterite.regular', 'preterite.irregular']
  },
  skyward_spire: {
    id: 'skyward_spire',
    name: 'Skyward Spire',
    emoji: '🏔️',
    description: 'A gleaming tower rising into the clouds, where players tackle future tense verbs.',
    background: 'from-blue-600 to-blue-800',
    enemies: [enemies.sky_guardian],
    unlockRequirement: { level: 6, defeatedEnemies: ['swamp_hag', 'habitual_phantom'] },
    recommendedLevel: 6,
    tenseTypes: ['future']
  },
  palace_of_possibilities: {
    id: 'palace_of_possibilities',
    name: 'Palace of Possibilities',
    emoji: '�',
    description: 'A grand palace embodying hypothetical scenarios with conditional tense verbs.',
    background: 'from-purple-700 to-purple-900',
    enemies: [enemies.possibility_wraith, enemies.conditional_specter],
    unlockRequirement: { level: 7, defeatedEnemies: ['sky_guardian'] },
    recommendedLevel: 7,
    tenseTypes: ['conditional']
  },
  dungeon_of_commands: {
    id: 'dungeon_of_commands',
    name: 'Dungeon of Commands',
    emoji: '⚔️',
    description: 'A grim, intimidating dungeon where quick responses are needed for imperative commands.',
    background: 'from-stone-700 to-stone-900',
    enemies: [enemies.commander_specter, enemies.imperative_phantom],
    unlockRequirement: { level: 8, defeatedEnemies: ['possibility_wraith', 'conditional_specter'] },
    recommendedLevel: 8,
    tenseTypes: ['imperative']
  },
  shrine_of_perfection: {
    id: 'shrine_of_perfection',
    name: 'Shrine of Perfection',
    emoji: '⛩️',
    description: 'A serene sanctuary focused on compound tenses, offering perfect tense challenges.',
    background: 'from-yellow-600 to-orange-700',
    enemies: [enemies.perfection_guardian, enemies.compound_wraith],
    unlockRequirement: { level: 9, defeatedEnemies: ['commander_specter', 'imperative_phantom'] },
    recommendedLevel: 9,
    tenseTypes: ['perfect']
  },
  castle_of_conjugations: {
    id: 'castle_of_conjugations',
    name: 'Castle of Conjugations',
    emoji: '�',
    description: 'The final and most challenging region, featuring complex subjunctive mood conjugations.',
    background: 'from-indigo-800 to-purple-900',
    enemies: [enemies.subjunctive_lord, enemies.conjugation_master],
    unlockRequirement: { level: 10, defeatedEnemies: ['perfection_guardian', 'compound_wraith'] },
    recommendedLevel: 10,
    tenseTypes: ['subjunctive']
  }
};

// Utility functions
export function getRandomVerb(verbTypes: string[] = ['regular']): Verb {
  const filteredVerbs = Object.values(verbData).filter(verb => 
    verbTypes.includes(verb.type)
  );
  
  return filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)];
}

// Get a random pronoun
export function getRandomPronoun(): string {
  const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
  return pronouns[Math.floor(Math.random() * pronouns.length)];
}

// Check if a region is unlocked
export function isRegionUnlocked(regionId: string, stats: any): boolean {
  const region = regions[regionId as keyof typeof regions];
  if (!region) return false;
  
  // If no unlock requirement, it's always unlocked
  if (!region.unlockRequirement) return true;
  
  // Debug logging for cave_of_memories
  if (regionId === 'cave_of_memories') {
    console.log('Checking cave_of_memories unlock:', {
      regionId,
      level: stats.level,
      requiredLevel: region.unlockRequirement.level,
      defeatedEnemies: stats.defeatedEnemies,
      isSet: stats.defeatedEnemies instanceof Set,
      requiredEnemies: region.unlockRequirement.defeatedEnemies,
      hasRequiredEnemies: region.unlockRequirement.defeatedEnemies?.every((enemyId: string) => stats.defeatedEnemies.has(enemyId))
    });
  }
  
  // Check player level requirement
  if (region.unlockRequirement.level && (!stats.level || stats.level < region.unlockRequirement.level)) {
    return false;
  }
  
  // Check defeated enemies requirement
  if (region.unlockRequirement.defeatedEnemies) {
    if (!stats.defeatedEnemies) return false;
    const hasDefeatedAll = region.unlockRequirement.defeatedEnemies.every(
      (enemyId: string) => stats.defeatedEnemies.has(enemyId)
    );
    if (!hasDefeatedAll) return false;
  }
  
  return true;
}

// Export single default object for compatibility
export default {
  verbData,
  enemies,
  regions,
  getRandomVerb,
  getRandomPronoun,
  isRegionUnlocked
};
