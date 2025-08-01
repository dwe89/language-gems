'use client';

// Enhanced verb types with multiple tenses
export interface Verb {
  infinitive: string;
  english: string;
  type: 'regular' | 'irregular' | 'stem-changing' | 'reflexive';
  category: 'ar' | 'er' | 'ir';
  difficulty: number;
  conjugations: {
    present: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    preterite?: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    imperfect?: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    future?: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    conditional?: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    subjunctive?: {
      yo: string;
      tu: string;
      el: string;
      nosotros: string;
      vosotros: string;
      ellos: string;
    };
    imperative?: {
      tu: string;
      usted: string;
      nosotros: string;
      vosotros: string;
      ustedes: string;
    };
  };
}

export const verbData: Record<string, Verb> = {
  hablar: {
    infinitive: 'hablar',
    english: 'to speak',
    type: 'regular',
    category: 'ar',
    difficulty: 1,
    conjugations: {
      present: { yo: 'hablo', tu: 'hablas', el: 'habla', nosotros: 'hablamos', vosotros: 'habláis', ellos: 'hablan' },
      preterite: { yo: 'hablé', tu: 'hablaste', el: 'habló', nosotros: 'hablamos', vosotros: 'hablasteis', ellos: 'hablaron' },
      imperfect: { yo: 'hablaba', tu: 'hablabas', el: 'hablaba', nosotros: 'hablábamos', vosotros: 'hablabais', ellos: 'hablaban' },
      future: { yo: 'hablaré', tu: 'hablarás', el: 'hablará', nosotros: 'hablaremos', vosotros: 'hablaréis', ellos: 'hablarán' },
      conditional: { yo: 'hablaría', tu: 'hablarías', el: 'hablaría', nosotros: 'hablaríamos', vosotros: 'hablaríais', ellos: 'hablarían' },
      subjunctive: { yo: 'hable', tu: 'hables', el: 'hable', nosotros: 'hablemos', vosotros: 'habléis', ellos: 'hablen' },
      imperative: { tu: 'habla', usted: 'hable', nosotros: 'hablemos', vosotros: 'hablad', ustedes: 'hablen' }
    }
  },
  comer: {
    infinitive: 'comer',
    english: 'to eat',
    type: 'regular',
    category: 'er',
    difficulty: 1,
    conjugations: {
      present: { yo: 'como', tu: 'comes', el: 'come', nosotros: 'comemos', vosotros: 'coméis', ellos: 'comen' },
      preterite: { yo: 'comí', tu: 'comiste', el: 'comió', nosotros: 'comimos', vosotros: 'comisteis', ellos: 'comieron' },
      imperfect: { yo: 'comía', tu: 'comías', el: 'comía', nosotros: 'comíamos', vosotros: 'comíais', ellos: 'comían' },
      future: { yo: 'comeré', tu: 'comerás', el: 'comerá', nosotros: 'comeremos', vosotros: 'comeréis', ellos: 'comerán' },
      conditional: { yo: 'comería', tu: 'comerías', el: 'comería', nosotros: 'comeríamos', vosotros: 'comeríais', ellos: 'comerían' },
      subjunctive: { yo: 'coma', tu: 'comas', el: 'coma', nosotros: 'comamos', vosotros: 'comáis', ellos: 'coman' },
      imperative: { tu: 'come', usted: 'coma', nosotros: 'comamos', vosotros: 'comed', ustedes: 'coman' }
    }
  },
  vivir: {
    infinitive: 'vivir',
    english: 'to live',
    type: 'regular',
    category: 'ir',
    difficulty: 1,
    conjugations: {
      present: { yo: 'vivo', tu: 'vives', el: 'vive', nosotros: 'vivimos', vosotros: 'vivís', ellos: 'viven' },
      preterite: { yo: 'viví', tu: 'viviste', el: 'vivió', nosotros: 'vivimos', vosotros: 'vivisteis', ellos: 'vivieron' },
      imperfect: { yo: 'vivía', tu: 'vivías', el: 'vivía', nosotros: 'vivíamos', vosotros: 'vivíais', ellos: 'vivían' },
      future: { yo: 'viviré', tu: 'vivirás', el: 'vivirá', nosotros: 'viviremos', vosotros: 'viviréis', ellos: 'vivirán' },
      conditional: { yo: 'viviría', tu: 'vivirías', el: 'viviría', nosotros: 'viviríamos', vosotros: 'viviríais', ellos: 'vivirían' },
      subjunctive: { yo: 'viva', tu: 'vivas', el: 'viva', nosotros: 'vivamos', vosotros: 'viváis', ellos: 'vivan' },
      imperative: { tu: 'vive', usted: 'viva', nosotros: 'vivamos', vosotros: 'vivid', ustedes: 'vivan' }
    }
  },
  ser: {
    infinitive: 'ser',
    english: 'to be (permanent)',
    type: 'irregular',
    category: 'er',
    difficulty: 4,
    conjugations: {
      present: { yo: 'soy', tu: 'eres', el: 'es', nosotros: 'somos', vosotros: 'sois', ellos: 'son' },
      preterite: { yo: 'fui', tu: 'fuiste', el: 'fue', nosotros: 'fuimos', vosotros: 'fuisteis', ellos: 'fueron' },
      imperfect: { yo: 'era', tu: 'eras', el: 'era', nosotros: 'éramos', vosotros: 'erais', ellos: 'eran' },
      future: { yo: 'seré', tu: 'serás', el: 'será', nosotros: 'seremos', vosotros: 'seréis', ellos: 'serán' },
      conditional: { yo: 'sería', tu: 'serías', el: 'sería', nosotros: 'seríamos', vosotros: 'seríais', ellos: 'serían' },
      subjunctive: { yo: 'sea', tu: 'seas', el: 'sea', nosotros: 'seamos', vosotros: 'seáis', ellos: 'sean' },
      imperative: { tu: 'sé', usted: 'sea', nosotros: 'seamos', vosotros: 'sed', ustedes: 'sean' }
    }
  },
  tener: {
    infinitive: 'tener',
    english: 'to have',
    type: 'irregular',
    category: 'er',
    difficulty: 3,
    conjugations: {
      present: { yo: 'tengo', tu: 'tienes', el: 'tiene', nosotros: 'tenemos', vosotros: 'tenéis', ellos: 'tienen' },
      preterite: { yo: 'tuve', tu: 'tuviste', el: 'tuvo', nosotros: 'tuvimos', vosotros: 'tuvisteis', ellos: 'tuvieron' },
      imperfect: { yo: 'tenía', tu: 'tenías', el: 'tenía', nosotros: 'teníamos', vosotros: 'teníais', ellos: 'tenían' },
      future: { yo: 'tendré', tu: 'tendrás', el: 'tendrá', nosotros: 'tendremos', vosotros: 'tendréis', ellos: 'tendrán' },
      conditional: { yo: 'tendría', tu: 'tendrías', el: 'tendría', nosotros: 'tendríamos', vosotros: 'tendríais', ellos: 'tendrían' },
      subjunctive: { yo: 'tenga', tu: 'tengas', el: 'tenga', nosotros: 'tengamos', vosotros: 'tengáis', ellos: 'tengan' },
      imperative: { tu: 'ten', usted: 'tenga', nosotros: 'tengamos', vosotros: 'tened', ustedes: 'tengan' }
    }
  },
  hacer: {
    infinitive: 'hacer',
    english: 'to do/make',
    type: 'irregular',
    category: 'er',
    difficulty: 3,
    conjugations: {
      present: { yo: 'hago', tu: 'haces', el: 'hace', nosotros: 'hacemos', vosotros: 'hacéis', ellos: 'hacen' },
      preterite: { yo: 'hice', tu: 'hiciste', el: 'hizo', nosotros: 'hicimos', vosotros: 'hicisteis', ellos: 'hicieron' },
      imperfect: { yo: 'hacía', tu: 'hacías', el: 'hacía', nosotros: 'hacíamos', vosotros: 'hacíais', ellos: 'hacían' },
      future: { yo: 'haré', tu: 'harás', el: 'hará', nosotros: 'haremos', vosotros: 'haréis', ellos: 'harán' },
      conditional: { yo: 'haría', tu: 'harías', el: 'haría', nosotros: 'haríamos', vosotros: 'haríais', ellos: 'harían' },
      subjunctive: { yo: 'haga', tu: 'hagas', el: 'haga', nosotros: 'hagamos', vosotros: 'hagáis', ellos: 'hagan' },
      imperative: { tu: 'haz', usted: 'haga', nosotros: 'hagamos', vosotros: 'haced', ustedes: 'hagan' }
    }
  },
  querer: {
    infinitive: 'querer',
    english: 'to want/love',
    type: 'stem-changing',
    category: 'er',
    difficulty: 2,
    conjugations: {
      present: { yo: 'quiero', tu: 'quieres', el: 'quiere', nosotros: 'queremos', vosotros: 'queréis', ellos: 'quieren' },
      preterite: { yo: 'quise', tu: 'quisiste', el: 'quiso', nosotros: 'quisimos', vosotros: 'quisisteis', ellos: 'quisieron' },
      imperfect: { yo: 'quería', tu: 'querías', el: 'quería', nosotros: 'queríamos', vosotros: 'queríais', ellos: 'querían' },
      future: { yo: 'querré', tu: 'querrás', el: 'querrá', nosotros: 'querremos', vosotros: 'querréis', ellos: 'querrán' },
      conditional: { yo: 'querría', tu: 'querrías', el: 'querría', nosotros: 'querríamos', vosotros: 'querríais', ellos: 'querrían' },
      subjunctive: { yo: 'quiera', tu: 'quieras', el: 'quiera', nosotros: 'queramos', vosotros: 'queráis', ellos: 'quieran' },
      imperative: { tu: 'quiere', usted: 'quiera', nosotros: 'queramos', vosotros: 'quered', ustedes: 'quieran' }
    }
  },
  pensar: {
    infinitive: 'pensar',
    english: 'to think',
    type: 'stem-changing',
    category: 'ar',
    difficulty: 2,
    conjugations: {
      present: { yo: 'pienso', tu: 'piensas', el: 'piensa', nosotros: 'pensamos', vosotros: 'pensáis', ellos: 'piensan' },
      preterite: { yo: 'pensé', tu: 'pensaste', el: 'pensó', nosotros: 'pensamos', vosotros: 'pensasteis', ellos: 'pensaron' },
      imperfect: { yo: 'pensaba', tu: 'pensabas', el: 'pensaba', nosotros: 'pensábamos', vosotros: 'pensabais', ellos: 'pensaban' },
      future: { yo: 'pensaré', tu: 'pensarás', el: 'pensará', nosotros: 'pensaremos', vosotros: 'pensaréis', ellos: 'pensarán' },
      conditional: { yo: 'pensaría', tu: 'pensarías', el: 'pensaría', nosotros: 'pensaríamos', vosotros: 'pensaríais', ellos: 'pensarían' },
      subjunctive: { yo: 'piense', tu: 'pienses', el: 'piense', nosotros: 'pensemos', vosotros: 'penséis', ellos: 'piensen' },
      imperative: { tu: 'piensa', usted: 'piense', nosotros: 'pensemos', vosotros: 'pensad', ustedes: 'piensen' }
    }
  }
};

export const tenseInfo = {
  'present.regular': {
    name: 'Present Tense (Regular)',
    description: 'Basic present tense conjugations for regular verbs',
    difficulty: 1,
    unlockLevel: 1
  },
  'present.irregular': {
    name: 'Present Tense (Irregular)',
    description: 'Present tense for irregular and stem-changing verbs',
    difficulty: 2,
    unlockLevel: 3
  },
  'preterite.regular': {
    name: 'Preterite Tense (Regular)',
    description: 'Past tense for completed actions with regular verbs',
    difficulty: 3,
    unlockLevel: 5
  },
  'preterite.irregular': {
    name: 'Preterite Tense (Irregular)',
    description: 'Past tense for completed actions with irregular verbs',
    difficulty: 4,
    unlockLevel: 7
  },
  'imperfect': {
    name: 'Imperfect Tense',
    description: 'Past tense for ongoing or habitual actions',
    difficulty: 3,
    unlockLevel: 6
  },
  'future': {
    name: 'Future Tense',
    description: 'Express future actions and intentions',
    difficulty: 4,
    unlockLevel: 8
  },
  'conditional': {
    name: 'Conditional Tense',
    description: 'Express hypothetical situations and polite requests',
    difficulty: 5,
    unlockLevel: 10
  },
  'subjunctive': {
    name: 'Subjunctive Mood',
    description: 'Express doubt, emotion, desire, and hypothetical situations',
    difficulty: 6,
    unlockLevel: 12
  },
  'imperative': {
    name: 'Imperative Mood',
    description: 'Give commands and make requests',
    difficulty: 4,
    unlockLevel: 9
  }
};

export const pronouns = ['yo', 'tu', 'el', 'nosotros', 'vosotros', 'ellos'];
export const pronounInfo = {
  yo: { english: 'I', formal: false },
  tu: { english: 'you (informal)', formal: false },
  el: { english: 'he/she/it/you (formal)', formal: true },
  nosotros: { english: 'we', formal: false },
  vosotros: { english: 'you all (informal)', formal: false },
  ellos: { english: 'they/you all (formal)', formal: true }
};

// Enhanced enemy system with more detailed stats
export interface Enemy {
  id: string;
  name: string;
  emoji: string;
  health: number;
  difficulty: string;
  verbTypes: string[];
  tenseTypes: string[];
  experience: number;
  description: string;
  specialAbility?: string;
  resistances?: string[];
  weaknesses?: string[];
  minLevel: number;
  attackPatterns: string[];
}

// Define enemies first
const gameEnemies: Record<string, Enemy> = {
  // Forest of Beginnings (Level 1-2)
  leaf_sprite: {
    id: 'leaf_sprite',
    name: 'Leaf Sprite',
    emoji: '🧚‍♀️',
    health: 60,
    difficulty: 'Beginner',
    verbTypes: ['regular'],
    tenseTypes: ['present.regular'],
    experience: 50,
    description: 'A playful forest spirit that tests basic present tense conjugations.',
    minLevel: 1,
    attackPatterns: ['basic']
  },
  forest_guardian: {
    id: 'forest_guardian',
    name: 'Forest Guardian',
    emoji: '🌳',
    health: 80,
    difficulty: 'Easy',
    verbTypes: ['regular'],
    tenseTypes: ['present.regular'],
    experience: 75,
    description: 'Ancient protector of the forest who challenges newcomers.',
    specialAbility: 'Root Bind - Reduces answer time by 3 seconds',
    minLevel: 1,
    attackPatterns: ['basic', 'time_pressure']
  },
  moss_goblin: {
    id: 'moss_goblin',
    name: 'Moss Goblin',
    emoji: '👺',
    health: 100,
    difficulty: 'Easy',
    verbTypes: ['regular', 'stem-changing'],
    tenseTypes: ['present.regular'],
    experience: 100,
    description: 'A mischievous creature that mixes regular and stem-changing verbs.',
    weaknesses: ['ar'],
    minLevel: 2,
    attackPatterns: ['basic', 'mixed_types']
  },

  // Cave of Memories (Level 3-4)
  memory_specter: {
    id: 'memory_specter',
    name: 'Memory Specter',
    emoji: '👻',
    health: 150,
    difficulty: 'Medium',
    verbTypes: ['irregular'],
    tenseTypes: ['present.irregular', 'preterite.regular'],
    experience: 150,
    description: 'Ghost of forgotten words that tests irregular present tense.',
    specialAbility: 'Memory Drain - Wrong answers deal extra damage',
    resistances: ['regular'],
    minLevel: 3,
    attackPatterns: ['punishing', 'irregular_focus']
  },
  time_weaver: {
    id: 'time_weaver',
    name: 'Time Weaver',
    emoji: '⏰',
    health: 180,
    difficulty: 'Medium',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['present.regular', 'preterite.regular'],
    experience: 200,
    description: 'Master of temporal conjugations who weaves past and present.',
    specialAbility: 'Temporal Shift - Randomly changes tense mid-battle',
    minLevel: 4,
    attackPatterns: ['tense_shifting', 'complex']
  },

  // Dungeon of Commands (Level 5-6)
  commander_specter: {
    id: 'commander_specter',
    name: 'Commander Specter',
    emoji: '⚔️',
    health: 220,
    difficulty: 'Hard',
    verbTypes: ['regular', 'irregular'],
    tenseTypes: ['imperative', 'present.irregular'],
    experience: 250,
    description: 'Ghostly commander who demands perfect imperative forms.',
    specialAbility: 'Battle Orders - Consecutive correct answers boost damage',
    minLevel: 5,
    attackPatterns: ['imperative_focus', 'combo_dependent']
  },
  imperative_phantom: {
    id: 'imperative_phantom',
    name: 'Imperative Phantom',
    emoji: '👤',
    health: 200,
    difficulty: 'Hard',
    verbTypes: ['irregular'],
    tenseTypes: ['imperative'],
    experience: 300,
    description: 'Spirit that only speaks in commands and demands.',
    resistances: ['regular'],
    weaknesses: ['imperative'],
    minLevel: 6,
    attackPatterns: ['command_only', 'formal_informal']
  },

  // Palace of Possibilities (Level 7-8)
  possibility_wraith: {
    id: 'possibility_wraith',
    name: 'Possibility Wraith',
    emoji: '🔮',
    health: 280,
    difficulty: 'Hard',
    verbTypes: ['irregular', 'stem-changing'],
    tenseTypes: ['conditional', 'future'],
    experience: 350,
    description: 'Ethereal being that speaks only in hypotheticals and futures.',
    specialAbility: 'Future Sight - Predicts wrong answers and counters',
    minLevel: 7,
    attackPatterns: ['conditional_focus', 'predictive']
  },
  perfection_guardian: {
    id: 'perfection_guardian',
    name: 'Perfection Guardian',
    emoji: '💎',
    health: 320,
    difficulty: 'Very Hard',
    verbTypes: ['irregular'],
    tenseTypes: ['future', 'conditional', 'present.irregular'],
    experience: 400,
    description: 'Ultimate guardian that demands flawless conjugation mastery.',
    resistances: ['regular', 'stem-changing'],
    minLevel: 8,
    attackPatterns: ['perfection_required', 'multi_tense']
  },

  // Lair of Legends (Level 10+)
  subjunctive_lord: {
    id: 'subjunctive_lord',
    name: 'Subjunctive Lord',
    emoji: '👑',
    health: 500,
    difficulty: 'Legendary',
    verbTypes: ['irregular'],
    tenseTypes: ['subjunctive', 'conditional'],
    experience: 600,
    description: 'Master of doubt and desire who speaks only in subjunctive mood.',
    specialAbility: 'Mood Shift - Changes between indicative and subjunctive',
    resistances: ['regular', 'present'],
    minLevel: 10,
    attackPatterns: ['mood_master', 'legendary']
  },
  chaos_lord: {
    id: 'chaos_lord',
    name: 'Chaos Lord',
    emoji: '🌀',
    health: 600,
    difficulty: 'Legendary',
    verbTypes: ['irregular', 'stem-changing', 'reflexive'],
    tenseTypes: ['subjunctive', 'conditional', 'preterite.irregular'],
    experience: 800,
    description: 'Ultimate challenge that combines all verb forms in chaotic patterns.',
    specialAbility: 'Chaos Storm - Randomly mixes all tenses and forms',
    minLevel: 12,
    attackPatterns: ['chaos', 'all_forms', 'legendary']
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
    enemies: [gameEnemies.leaf_sprite, gameEnemies.forest_guardian, gameEnemies.moss_goblin],
    unlockRequirement: null,
    recommendedLevel: 1,
    tenseTypes: ['present.regular']
  },
  cave_of_memories: {
    id: 'cave_of_memories',
    name: 'Cave of Memories',
    emoji: '🕳️',
    description: 'Ancient caverns filled with echoes of irregular verbs and past tenses.',
    background: 'from-gray-700 to-gray-900',
    enemies: [gameEnemies.memory_specter, gameEnemies.time_weaver],
    unlockRequirement: { level: 3, defeatedEnemies: ['leaf_sprite', 'forest_guardian', 'moss_goblin'] },
    recommendedLevel: 3,
    tenseTypes: ['present.irregular', 'preterite.regular']
  },
  dungeon_of_commands: {
    id: 'dungeon_of_commands',
    name: 'Dungeon of Commands',
    emoji: '🏰',
    description: 'A fortress where imperative forms and commands echo through stone halls.',
    background: 'from-stone-700 to-stone-900',
    enemies: [gameEnemies.commander_specter, gameEnemies.imperative_phantom],
    unlockRequirement: { level: 5, masteredTenses: ['present.regular', 'present.irregular'] },
    recommendedLevel: 5,
    tenseTypes: ['imperative', 'present.irregular']
  },
  palace_of_possibilities: {
    id: 'palace_of_possibilities',
    name: 'Palace of Possibilities',
    emoji: '🏛️',
    description: 'Majestic halls where future and conditional tenses shape reality.',
    background: 'from-purple-700 to-purple-900',
    enemies: [gameEnemies.possibility_wraith, gameEnemies.perfection_guardian],
    unlockRequirement: { level: 7, masteredTenses: ['imperative'] },
    recommendedLevel: 7,
    tenseTypes: ['future', 'conditional']
  },
  lair_of_legends: {
    id: 'lair_of_legends',
    name: 'Lair of Legends',
    emoji: '🌋',
    description: 'The ultimate challenge where subjunctive mood and chaos reign supreme.',
    background: 'from-red-800 to-red-950',
    enemies: [gameEnemies.subjunctive_lord, gameEnemies.chaos_lord],
    unlockRequirement: { level: 10, defeatedEnemies: ['possibility_wraith', 'perfection_guardian'] },
    recommendedLevel: 10,
    tenseTypes: ['subjunctive', 'conditional', 'all']
  }
};

// Export enemies for external use
export const enemies = gameEnemies;

// Utility functions
export function getRandomVerb(verbTypes: string[] = ['regular'], tenseTypes: string[] = ['present.regular'], unlockedTenses: string[] = ['present.regular']): Verb | null {
  const availableVerbs = Object.values(verbData).filter(verb => {
    // Check if verb type matches
    if (!verbTypes.includes(verb.type)) return false;
    
    // Check if verb has required tenses that are unlocked
    const hasUnlockedTense = tenseTypes.some(tenseType => {
      const [tense, subtype] = tenseType.split('.');
      return unlockedTenses.some(unlocked => unlocked.startsWith(tense)) && 
             verb.conjugations[tense as keyof typeof verb.conjugations];
    });
    
    return hasUnlockedTense;
  });

  if (availableVerbs.length === 0) return null;
  return availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
}

export function getRandomPronoun(): string {
  return pronouns[Math.floor(Math.random() * pronouns.length)];
}

export function getVerbConjugation(verb: Verb, tense: string, pronoun: string): string | null {
  const [tenseType, subtype] = tense.split('.');
  const conjugations = verb.conjugations[tenseType as keyof typeof verb.conjugations];
  
  if (!conjugations) return null;
  
  if (tenseType === 'imperative') {
    // Map pronouns to imperative forms
    const imperativeMap: Record<string, keyof typeof verb.conjugations.imperative> = {
      'tu': 'tu',
      'el': 'usted',
      'nosotros': 'nosotros',
      'vosotros': 'vosotros',
      'ellos': 'ustedes'
    };
    const imperativeKey = imperativeMap[pronoun];
    return imperativeKey ? (conjugations as any)[imperativeKey] : null;
  }
  
  return (conjugations as any)[pronoun] || null;
}

export function generateWrongAnswers(correctAnswer: string, verb: Verb, tense: string, pronoun: string): string[] {
  const wrongAnswers: string[] = [];
  const [tenseType] = tense.split('.');
  
  // Get other conjugations from the same verb
  const conjugations = verb.conjugations[tenseType as keyof typeof verb.conjugations];
  if (conjugations) {
    Object.values(conjugations).forEach(conjugation => {
      if (conjugation !== correctAnswer && !wrongAnswers.includes(conjugation)) {
        wrongAnswers.push(conjugation);
      }
    });
  }
  
  // Add some common conjugations from other verbs
  const otherVerbs = Object.values(verbData).filter(v => v.infinitive !== verb.infinitive);
  for (let i = 0; i < Math.min(3, otherVerbs.length); i++) {
    const randomVerb = otherVerbs[Math.floor(Math.random() * otherVerbs.length)];
    const randomConjugation = getVerbConjugation(randomVerb, tense, pronoun);
    if (randomConjugation && randomConjugation !== correctAnswer && !wrongAnswers.includes(randomConjugation)) {
      wrongAnswers.push(randomConjugation);
    }
  }
  
  // Return 3 random wrong answers
  const shuffled = wrongAnswers.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
}

export function isRegionUnlocked(regionId: string, stats: any): boolean {
  return stats.unlockedRegions.includes(regionId);
}
