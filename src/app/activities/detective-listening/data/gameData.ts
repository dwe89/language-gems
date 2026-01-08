import { GameData, CaseType, Language } from '../types';

export const caseTypes: CaseType[] = [
  {
    id: 'animals',
    name: 'Animals Case',
    description: 'Identify animal evidence from radio transmissions',
    icon: '🐾',
    color: 'from-green-500 to-emerald-600'
  },
  {
    id: 'food',
    name: 'Food Case',
    description: 'Solve the mystery of missing food items',
    icon: '🍎',
    color: 'from-red-500 to-pink-600'
  },
  {
    id: 'family',
    name: 'Family Case',
    description: 'Track down family members through radio clues',
    icon: '👨‍👩‍👧‍👦',
    color: 'from-blue-500 to-indigo-600'
  },
  {
    id: 'school',
    name: 'School Case',
    description: 'Investigate school-related evidence',
    icon: '🎒',
    color: 'from-purple-500 to-violet-600'
  },
  {
    id: 'travel',
    name: 'Travel Case',
    description: 'Follow travel clues across different locations',
    icon: '✈️',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'colors',
    name: 'Colors Case',
    description: 'Identify colors in the evidence',
    icon: '🌈',
    color: 'from-yellow-500 to-orange-600'
  },
  {
    id: 'numbers',
    name: 'Numbers Case',
    description: 'Crack the numerical code',
    icon: '🔢',
    color: 'from-gray-500 to-slate-600'
  }
];

export const languages: Language[] = [
  {
    id: 'spanish',
    name: 'Spanish Station',
    flag: '🇪🇸',
    frequency: '101.5 FM'
  },
  {
    id: 'french',
    name: 'French Station',
    flag: '🇫🇷',
    frequency: '102.3 FM'
  },
  {
    id: 'german',
    name: 'German Station',
    flag: '🇩🇪',
    frequency: '103.7 FM'
  }
];

// Sample game data - in production this would be loaded from a database or API
export const gameData: GameData = {
  animals: {
    spanish: [
      {
        audio: 'es_animals_perro.mp3',
        correct: 'dog',
        distractors: ['cat', 'bird'],
        word: 'perro'
      },
      {
        audio: 'es_animals_gato.mp3',
        correct: 'cat',
        distractors: ['dog', 'mouse'],
        word: 'gato'
      },
      {
        audio: 'es_animals_pajaro.mp3',
        correct: 'bird',
        distractors: ['fish', 'rabbit'],
        word: 'pájaro'
      },
      {
        audio: 'es_animals_pez.mp3',
        correct: 'fish',
        distractors: ['bird', 'horse'],
        word: 'pez'
      },
      {
        audio: 'es_animals_caballo.mp3',
        correct: 'horse',
        distractors: ['cow', 'pig'],
        word: 'caballo'
      },
      {
        audio: 'es_animals_vaca.mp3',
        correct: 'cow',
        distractors: ['horse', 'sheep'],
        word: 'vaca'
      },
      {
        audio: 'es_animals_cerdo.mp3',
        correct: 'pig',
        distractors: ['cow', 'goat'],
        word: 'cerdo'
      },
      {
        audio: 'es_animals_oveja.mp3',
        correct: 'sheep',
        distractors: ['goat', 'cow'],
        word: 'oveja'
      },
      {
        audio: 'es_animals_conejo.mp3',
        correct: 'rabbit',
        distractors: ['mouse', 'hamster'],
        word: 'conejo'
      },
      {
        audio: 'es_animals_raton.mp3',
        correct: 'mouse',
        distractors: ['rabbit', 'rat'],
        word: 'ratón'
      },
      {
        audio: 'es_animals_elefante.mp3',
        correct: 'elephant',
        distractors: ['lion', 'tiger'],
        word: 'elefante'
      },
      {
        audio: 'es_animals_leon.mp3',
        correct: 'lion',
        distractors: ['tiger', 'elephant'],
        word: 'león'
      },
      {
        audio: 'es_animals_tigre.mp3',
        correct: 'tiger',
        distractors: ['lion', 'leopard'],
        word: 'tigre'
      },
      {
        audio: 'es_animals_oso.mp3',
        correct: 'bear',
        distractors: ['wolf', 'fox'],
        word: 'oso'
      },
      {
        audio: 'es_animals_lobo.mp3',
        correct: 'wolf',
        distractors: ['bear', 'fox'],
        word: 'lobo'
      }
    ],
    french: [
      {
        audio: 'fr_animals_chien.mp3',
        correct: 'dog',
        distractors: ['cat', 'bird'],
        word: 'chien'
      },
      {
        audio: 'fr_animals_chat.mp3',
        correct: 'cat',
        distractors: ['dog', 'mouse'],
        word: 'chat'
      },
      {
        audio: 'fr_animals_oiseau.mp3',
        correct: 'bird',
        distractors: ['fish', 'rabbit'],
        word: 'oiseau'
      },
      {
        audio: 'fr_animals_poisson.mp3',
        correct: 'fish',
        distractors: ['bird', 'horse'],
        word: 'poisson'
      },
      {
        audio: 'fr_animals_cheval.mp3',
        correct: 'horse',
        distractors: ['cow', 'pig'],
        word: 'cheval'
      },
      {
        audio: 'fr_animals_vache.mp3',
        correct: 'cow',
        distractors: ['horse', 'sheep'],
        word: 'vache'
      },
      {
        audio: 'fr_animals_cochon.mp3',
        correct: 'pig',
        distractors: ['cow', 'goat'],
        word: 'cochon'
      },
      {
        audio: 'fr_animals_mouton.mp3',
        correct: 'sheep',
        distractors: ['goat', 'cow'],
        word: 'mouton'
      },
      {
        audio: 'fr_animals_lapin.mp3',
        correct: 'rabbit',
        distractors: ['mouse', 'hamster'],
        word: 'lapin'
      },
      {
        audio: 'fr_animals_souris.mp3',
        correct: 'mouse',
        distractors: ['rabbit', 'rat'],
        word: 'souris'
      },
      {
        audio: 'fr_animals_elephant.mp3',
        correct: 'elephant',
        distractors: ['lion', 'tiger'],
        word: 'éléphant'
      },
      {
        audio: 'fr_animals_lion.mp3',
        correct: 'lion',
        distractors: ['tiger', 'elephant'],
        word: 'lion'
      },
      {
        audio: 'fr_animals_tigre.mp3',
        correct: 'tiger',
        distractors: ['lion', 'leopard'],
        word: 'tigre'
      },
      {
        audio: 'fr_animals_ours.mp3',
        correct: 'bear',
        distractors: ['wolf', 'fox'],
        word: 'ours'
      },
      {
        audio: 'fr_animals_loup.mp3',
        correct: 'wolf',
        distractors: ['bear', 'fox'],
        word: 'loup'
      }
    ],
    german: [
      {
        audio: 'de_animals_hund.mp3',
        correct: 'dog',
        distractors: ['cat', 'bird'],
        word: 'Hund'
      },
      {
        audio: 'de_animals_katze.mp3',
        correct: 'cat',
        distractors: ['dog', 'mouse'],
        word: 'Katze'
      },
      {
        audio: 'de_animals_vogel.mp3',
        correct: 'bird',
        distractors: ['fish', 'rabbit'],
        word: 'Vogel'
      },
      {
        audio: 'de_animals_fisch.mp3',
        correct: 'fish',
        distractors: ['bird', 'horse'],
        word: 'Fisch'
      },
      {
        audio: 'de_animals_pferd.mp3',
        correct: 'horse',
        distractors: ['cow', 'pig'],
        word: 'Pferd'
      },
      {
        audio: 'de_animals_kuh.mp3',
        correct: 'cow',
        distractors: ['horse', 'sheep'],
        word: 'Kuh'
      },
      {
        audio: 'de_animals_schwein.mp3',
        correct: 'pig',
        distractors: ['cow', 'goat'],
        word: 'Schwein'
      },
      {
        audio: 'de_animals_schaf.mp3',
        correct: 'sheep',
        distractors: ['goat', 'cow'],
        word: 'Schaf'
      },
      {
        audio: 'de_animals_hase.mp3',
        correct: 'rabbit',
        distractors: ['mouse', 'hamster'],
        word: 'Hase'
      },
      {
        audio: 'de_animals_maus.mp3',
        correct: 'mouse',
        distractors: ['rabbit', 'rat'],
        word: 'Maus'
      },
      {
        audio: 'de_animals_elefant.mp3',
        correct: 'elephant',
        distractors: ['lion', 'tiger'],
        word: 'Elefant'
      },
      {
        audio: 'de_animals_lowe.mp3',
        correct: 'lion',
        distractors: ['tiger', 'elephant'],
        word: 'Löwe'
      },
      {
        audio: 'de_animals_tiger.mp3',
        correct: 'tiger',
        distractors: ['lion', 'leopard'],
        word: 'Tiger'
      },
      {
        audio: 'de_animals_bar.mp3',
        correct: 'bear',
        distractors: ['wolf', 'fox'],
        word: 'Bär'
      },
      {
        audio: 'de_animals_wolf.mp3',
        correct: 'wolf',
        distractors: ['bear', 'fox'],
        word: 'Wolf'
      }
    ]
  },
  food: {
    spanish: [
      {
        audio: 'es_food_manzana.mp3',
        correct: 'apple',
        distractors: ['orange', 'banana'],
        word: 'manzana'
      },
      {
        audio: 'es_food_naranja.mp3',
        correct: 'orange',
        distractors: ['apple', 'lemon'],
        word: 'naranja'
      },
      {
        audio: 'es_food_platano.mp3',
        correct: 'banana',
        distractors: ['apple', 'grape'],
        word: 'plátano'
      },
      {
        audio: 'es_food_pan.mp3',
        correct: 'bread',
        distractors: ['rice', 'pasta'],
        word: 'pan'
      },
      {
        audio: 'es_food_leche.mp3',
        correct: 'milk',
        distractors: ['water', 'juice'],
        word: 'leche'
      }
    ],
    french: [
      {
        audio: 'fr_food_pomme.mp3',
        correct: 'apple',
        distractors: ['orange', 'banana'],
        word: 'pomme'
      },
      {
        audio: 'fr_food_orange.mp3',
        correct: 'orange',
        distractors: ['apple', 'lemon'],
        word: 'orange'
      },
      {
        audio: 'fr_food_banane.mp3',
        correct: 'banana',
        distractors: ['apple', 'grape'],
        word: 'banane'
      },
      {
        audio: 'fr_food_pain.mp3',
        correct: 'bread',
        distractors: ['rice', 'pasta'],
        word: 'pain'
      },
      {
        audio: 'fr_food_lait.mp3',
        correct: 'milk',
        distractors: ['water', 'juice'],
        word: 'lait'
      }
    ],
    german: [
      {
        audio: 'de_food_apfel.mp3',
        correct: 'apple',
        distractors: ['orange', 'banana'],
        word: 'Apfel'
      },
      {
        audio: 'de_food_orange.mp3',
        correct: 'orange',
        distractors: ['apple', 'lemon'],
        word: 'Orange'
      },
      {
        audio: 'de_food_banane.mp3',
        correct: 'banana',
        distractors: ['apple', 'grape'],
        word: 'Banane'
      },
      {
        audio: 'de_food_brot.mp3',
        correct: 'bread',
        distractors: ['rice', 'pasta'],
        word: 'Brot'
      },
      {
        audio: 'de_food_milch.mp3',
        correct: 'milk',
        distractors: ['water', 'juice'],
        word: 'Milch'
      }
    ]
  },
  family: {
    spanish: [
      {
        audio: 'es_family_padre.mp3',
        correct: 'father',
        distractors: ['mother', 'brother'],
        word: 'padre'
      },
      {
        audio: 'es_family_madre.mp3',
        correct: 'mother',
        distractors: ['father', 'sister'],
        word: 'madre'
      },
      {
        audio: 'es_family_hermano.mp3',
        correct: 'brother',
        distractors: ['sister', 'cousin'],
        word: 'hermano'
      },
      {
        audio: 'es_family_hermana.mp3',
        correct: 'sister',
        distractors: ['brother', 'aunt'],
        word: 'hermana'
      },
      {
        audio: 'es_family_abuelo.mp3',
        correct: 'grandfather',
        distractors: ['grandmother', 'uncle'],
        word: 'abuelo'
      },
      {
        audio: 'es_family_abuela.mp3',
        correct: 'grandmother',
        distractors: ['grandfather', 'aunt'],
        word: 'abuela'
      },
      {
        audio: 'es_family_tio.mp3',
        correct: 'uncle',
        distractors: ['aunt', 'cousin'],
        word: 'tío'
      },
      {
        audio: 'es_family_tia.mp3',
        correct: 'aunt',
        distractors: ['uncle', 'cousin'],
        word: 'tía'
      },
      {
        audio: 'es_family_primo.mp3',
        correct: 'cousin',
        distractors: ['brother', 'nephew'],
        word: 'primo'
      },
      {
        audio: 'es_family_hijo.mp3',
        correct: 'son',
        distractors: ['daughter', 'nephew'],
        word: 'hijo'
      }
    ],
    french: [
      {
        audio: 'fr_family_pere.mp3',
        correct: 'father',
        distractors: ['mother', 'brother'],
        word: 'père'
      },
      {
        audio: 'fr_family_mere.mp3',
        correct: 'mother',
        distractors: ['father', 'sister'],
        word: 'mère'
      },
      {
        audio: 'fr_family_frere.mp3',
        correct: 'brother',
        distractors: ['sister', 'cousin'],
        word: 'frère'
      },
      {
        audio: 'fr_family_soeur.mp3',
        correct: 'sister',
        distractors: ['brother', 'aunt'],
        word: 'sœur'
      },
      {
        audio: 'fr_family_grandpere.mp3',
        correct: 'grandfather',
        distractors: ['grandmother', 'uncle'],
        word: 'grand-père'
      },
      {
        audio: 'fr_family_grandmere.mp3',
        correct: 'grandmother',
        distractors: ['grandfather', 'aunt'],
        word: 'grand-mère'
      },
      {
        audio: 'fr_family_oncle.mp3',
        correct: 'uncle',
        distractors: ['aunt', 'cousin'],
        word: 'oncle'
      },
      {
        audio: 'fr_family_tante.mp3',
        correct: 'aunt',
        distractors: ['uncle', 'cousin'],
        word: 'tante'
      },
      {
        audio: 'fr_family_cousin.mp3',
        correct: 'cousin',
        distractors: ['brother', 'nephew'],
        word: 'cousin'
      },
      {
        audio: 'fr_family_fils.mp3',
        correct: 'son',
        distractors: ['daughter', 'nephew'],
        word: 'fils'
      }
    ],
    german: [
      {
        audio: 'de_family_vater.mp3',
        correct: 'father',
        distractors: ['mother', 'brother'],
        word: 'Vater'
      },
      {
        audio: 'de_family_mutter.mp3',
        correct: 'mother',
        distractors: ['father', 'sister'],
        word: 'Mutter'
      },
      {
        audio: 'de_family_bruder.mp3',
        correct: 'brother',
        distractors: ['sister', 'cousin'],
        word: 'Bruder'
      },
      {
        audio: 'de_family_schwester.mp3',
        correct: 'sister',
        distractors: ['brother', 'aunt'],
        word: 'Schwester'
      },
      {
        audio: 'de_family_grossvater.mp3',
        correct: 'grandfather',
        distractors: ['grandmother', 'uncle'],
        word: 'Großvater'
      },
      {
        audio: 'de_family_grossmutter.mp3',
        correct: 'grandmother',
        distractors: ['grandfather', 'aunt'],
        word: 'Großmutter'
      },
      {
        audio: 'de_family_onkel.mp3',
        correct: 'uncle',
        distractors: ['aunt', 'cousin'],
        word: 'Onkel'
      },
      {
        audio: 'de_family_tante.mp3',
        correct: 'aunt',
        distractors: ['uncle', 'cousin'],
        word: 'Tante'
      },
      {
        audio: 'de_family_cousin.mp3',
        correct: 'cousin',
        distractors: ['brother', 'nephew'],
        word: 'Cousin'
      },
      {
        audio: 'de_family_sohn.mp3',
        correct: 'son',
        distractors: ['daughter', 'nephew'],
        word: 'Sohn'
      }
    ]
  },
  colors: {
    spanish: [
      {
        audio: 'es_colors_rojo.mp3',
        correct: 'red',
        distractors: ['blue', 'green'],
        word: 'rojo'
      },
      {
        audio: 'es_colors_azul.mp3',
        correct: 'blue',
        distractors: ['red', 'yellow'],
        word: 'azul'
      },
      {
        audio: 'es_colors_verde.mp3',
        correct: 'green',
        distractors: ['blue', 'purple'],
        word: 'verde'
      },
      {
        audio: 'es_colors_amarillo.mp3',
        correct: 'yellow',
        distractors: ['orange', 'red'],
        word: 'amarillo'
      },
      {
        audio: 'es_colors_negro.mp3',
        correct: 'black',
        distractors: ['white', 'gray'],
        word: 'negro'
      },
      {
        audio: 'es_colors_blanco.mp3',
        correct: 'white',
        distractors: ['black', 'gray'],
        word: 'blanco'
      },
      {
        audio: 'es_colors_morado.mp3',
        correct: 'purple',
        distractors: ['pink', 'blue'],
        word: 'morado'
      },
      {
        audio: 'es_colors_rosa.mp3',
        correct: 'pink',
        distractors: ['purple', 'red'],
        word: 'rosa'
      },
      {
        audio: 'es_colors_naranja.mp3',
        correct: 'orange',
        distractors: ['yellow', 'red'],
        word: 'naranja'
      },
      {
        audio: 'es_colors_gris.mp3',
        correct: 'gray',
        distractors: ['black', 'white'],
        word: 'gris'
      }
    ],
    french: [
      {
        audio: 'fr_colors_rouge.mp3',
        correct: 'red',
        distractors: ['blue', 'green'],
        word: 'rouge'
      },
      {
        audio: 'fr_colors_bleu.mp3',
        correct: 'blue',
        distractors: ['red', 'yellow'],
        word: 'bleu'
      },
      {
        audio: 'fr_colors_vert.mp3',
        correct: 'green',
        distractors: ['blue', 'purple'],
        word: 'vert'
      },
      {
        audio: 'fr_colors_jaune.mp3',
        correct: 'yellow',
        distractors: ['orange', 'red'],
        word: 'jaune'
      },
      {
        audio: 'fr_colors_noir.mp3',
        correct: 'black',
        distractors: ['white', 'gray'],
        word: 'noir'
      },
      {
        audio: 'fr_colors_blanc.mp3',
        correct: 'white',
        distractors: ['black', 'gray'],
        word: 'blanc'
      },
      {
        audio: 'fr_colors_violet.mp3',
        correct: 'purple',
        distractors: ['pink', 'blue'],
        word: 'violet'
      },
      {
        audio: 'fr_colors_rose.mp3',
        correct: 'pink',
        distractors: ['purple', 'red'],
        word: 'rose'
      },
      {
        audio: 'fr_colors_orange.mp3',
        correct: 'orange',
        distractors: ['yellow', 'red'],
        word: 'orange'
      },
      {
        audio: 'fr_colors_gris.mp3',
        correct: 'gray',
        distractors: ['black', 'white'],
        word: 'gris'
      }
    ],
    german: [
      {
        audio: 'de_colors_rot.mp3',
        correct: 'red',
        distractors: ['blue', 'green'],
        word: 'rot'
      },
      {
        audio: 'de_colors_blau.mp3',
        correct: 'blue',
        distractors: ['red', 'yellow'],
        word: 'blau'
      },
      {
        audio: 'de_colors_grun.mp3',
        correct: 'green',
        distractors: ['blue', 'purple'],
        word: 'grün'
      },
      {
        audio: 'de_colors_gelb.mp3',
        correct: 'yellow',
        distractors: ['orange', 'red'],
        word: 'gelb'
      },
      {
        audio: 'de_colors_schwarz.mp3',
        correct: 'black',
        distractors: ['white', 'gray'],
        word: 'schwarz'
      },
      {
        audio: 'de_colors_weiss.mp3',
        correct: 'white',
        distractors: ['black', 'gray'],
        word: 'weiß'
      },
      {
        audio: 'de_colors_lila.mp3',
        correct: 'purple',
        distractors: ['pink', 'blue'],
        word: 'lila'
      },
      {
        audio: 'de_colors_rosa.mp3',
        correct: 'pink',
        distractors: ['purple', 'red'],
        word: 'rosa'
      },
      {
        audio: 'de_colors_orange.mp3',
        correct: 'orange',
        distractors: ['yellow', 'red'],
        word: 'orange'
      },
      {
        audio: 'de_colors_grau.mp3',
        correct: 'gray',
        distractors: ['black', 'white'],
        word: 'grau'
      }
    ]
  }
};

// Utility functions for game data
export const getCaseData = (caseType: string, language: string) => {
  return gameData[caseType]?.[language] || [];
};

export const getRandomEvidence = (caseType: string, language: string, count: number = 10) => {
  const caseData = getCaseData(caseType, language);
  if (caseData.length === 0) return [];
  
  // Shuffle and take the requested number of items
  const shuffled = [...caseData].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, caseData.length));
};

export const getCaseTypeById = (id: string) => {
  return caseTypes.find(caseType => caseType.id === id);
};

export const getLanguageById = (id: string) => {
  return languages.find(language => language.id === id);
};
