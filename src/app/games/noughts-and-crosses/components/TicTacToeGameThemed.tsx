'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from './ThemeProvider';
import { Brain, ArrowLeft, Volume2, VolumeX } from 'lucide-react';
import confetti from 'canvas-confetti';
import { useAudio } from '../hooks/useAudio';

// Theme animations
import ClassicAnimation from './themes/ClassicAnimation';
import LavaTempleAnimation from './themes/LavaTempleAnimation';
import TokyoNightsAnimation from './themes/TokyoNightsAnimation';
import SpaceExplorerAnimation from './themes/SpaceExplorerAnimation';
import PirateAdventureAnimation from './themes/PirateAdventureAnimation';

type CellContent = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'lost' | 'tie';

interface TicTacToeGameProps {
  settings: {
    difficulty: string;
    category: string;
    language: string;
    theme: string;
    playerMark: string;
    computerMark: string;
  };
  onBackToMenu: () => void;
  onGameEnd: (result: { outcome: 'win' | 'loss' | 'tie'; wordsLearned: number; perfectGame?: boolean }) => void;
}

// Simple vocabulary for the game
const VOCABULARY = {
  animals: {
    spanish: [
      { word: 'perro', translation: 'dog', difficulty: 'beginner' },
      { word: 'gato', translation: 'cat', difficulty: 'beginner' },
      { word: 'pájaro', translation: 'bird', difficulty: 'beginner' },
      { word: 'caballo', translation: 'horse', difficulty: 'beginner' },
      { word: 'conejo', translation: 'rabbit', difficulty: 'beginner' },
      { word: 'elefante', translation: 'elephant', difficulty: 'intermediate' },
      { word: 'jirafa', translation: 'giraffe', difficulty: 'intermediate' },
      { word: 'león', translation: 'lion', difficulty: 'intermediate' }
    ],
    french: [
      { word: 'chien', translation: 'dog', difficulty: 'beginner' },
      { word: 'chat', translation: 'cat', difficulty: 'beginner' },
      { word: 'oiseau', translation: 'bird', difficulty: 'beginner' },
      { word: 'cheval', translation: 'horse', difficulty: 'beginner' },
      { word: 'lapin', translation: 'rabbit', difficulty: 'beginner' }
    ],
    german: [
      { word: 'hund', translation: 'dog', difficulty: 'beginner' },
      { word: 'katze', translation: 'cat', difficulty: 'beginner' },
      { word: 'vogel', translation: 'bird', difficulty: 'beginner' },
      { word: 'pferd', translation: 'horse', difficulty: 'beginner' },
      { word: 'kaninchen', translation: 'rabbit', difficulty: 'beginner' }
    ]
  },
  food: {
    spanish: [
      { word: 'pan', translation: 'bread', difficulty: 'beginner' },
      { word: 'agua', translation: 'water', difficulty: 'beginner' },
      { word: 'leche', translation: 'milk', difficulty: 'beginner' },
      { word: 'manzana', translation: 'apple', difficulty: 'beginner' },
      { word: 'pollo', translation: 'chicken', difficulty: 'beginner' }
    ],
    french: [
      { word: 'pain', translation: 'bread', difficulty: 'beginner' },
      { word: 'eau', translation: 'water', difficulty: 'beginner' },
      { word: 'lait', translation: 'milk', difficulty: 'beginner' },
      { word: 'pomme', translation: 'apple', difficulty: 'beginner' },
      { word: 'poulet', translation: 'chicken', difficulty: 'beginner' }
    ],
    german: [
      { word: 'brot', translation: 'bread', difficulty: 'beginner' },
      { word: 'wasser', translation: 'water', difficulty: 'beginner' },
      { word: 'milch', translation: 'milk', difficulty: 'beginner' },
      { word: 'apfel', translation: 'apple', difficulty: 'beginner' },
      { word: 'huhn', translation: 'chicken', difficulty: 'beginner' }
    ]
  },
  colors: {
    spanish: [
      { word: 'rojo', translation: 'red', difficulty: 'beginner' },
      { word: 'azul', translation: 'blue', difficulty: 'beginner' },
      { word: 'verde', translation: 'green', difficulty: 'beginner' },
      { word: 'amarillo', translation: 'yellow', difficulty: 'beginner' },
      { word: 'negro', translation: 'black', difficulty: 'beginner' }
    ],
    french: [
      { word: 'rouge', translation: 'red', difficulty: 'beginner' },
      { word: 'bleu', translation: 'blue', difficulty: 'beginner' },
      { word: 'vert', translation: 'green', difficulty: 'beginner' },
      { word: 'jaune', translation: 'yellow', difficulty: 'beginner' },
      { word: 'noir', translation: 'black', difficulty: 'beginner' }
    ],
    german: [
      { word: 'rot', translation: 'red', difficulty: 'beginner' },
      { word: 'blau', translation: 'blue', difficulty: 'beginner' },
      { word: 'grün', translation: 'green', difficulty: 'beginner' },
      { word: 'gelb', translation: 'yellow', difficulty: 'beginner' },
      { word: 'schwarz', translation: 'black', difficulty: 'beginner' }
    ]
  },
  numbers: {
    spanish: [
      { word: 'uno', translation: 'one', difficulty: 'beginner' },
      { word: 'dos', translation: 'two', difficulty: 'beginner' },
      { word: 'tres', translation: 'three', difficulty: 'beginner' },
      { word: 'cuatro', translation: 'four', difficulty: 'beginner' },
      { word: 'cinco', translation: 'five', difficulty: 'beginner' }
    ],
    french: [
      { word: 'un', translation: 'one', difficulty: 'beginner' },
      { word: 'deux', translation: 'two', difficulty: 'beginner' },
      { word: 'trois', translation: 'three', difficulty: 'beginner' },
      { word: 'quatre', translation: 'four', difficulty: 'beginner' },
      { word: 'cinq', translation: 'five', difficulty: 'beginner' }
    ],
    german: [
      { word: 'eins', translation: 'one', difficulty: 'beginner' },
      { word: 'zwei', translation: 'two', difficulty: 'beginner' },
      { word: 'drei', translation: 'three', difficulty: 'beginner' },
      { word: 'vier', translation: 'four', difficulty: 'beginner' },
      { word: 'fünf', translation: 'five', difficulty: 'beginner' }
    ]
  },
  family: {
    spanish: [
      { word: 'madre', translation: 'mother', difficulty: 'beginner' },
      { word: 'padre', translation: 'father', difficulty: 'beginner' },
      { word: 'hijo', translation: 'son', difficulty: 'beginner' },
      { word: 'hija', translation: 'daughter', difficulty: 'beginner' },
      { word: 'hermano', translation: 'brother', difficulty: 'beginner' }
    ],
    french: [
      { word: 'mère', translation: 'mother', difficulty: 'beginner' },
      { word: 'père', translation: 'father', difficulty: 'beginner' },
      { word: 'fils', translation: 'son', difficulty: 'beginner' },
      { word: 'fille', translation: 'daughter', difficulty: 'beginner' },
      { word: 'frère', translation: 'brother', difficulty: 'beginner' }
    ],
    german: [
      { word: 'mutter', translation: 'mother', difficulty: 'beginner' },
      { word: 'vater', translation: 'father', difficulty: 'beginner' },
      { word: 'sohn', translation: 'son', difficulty: 'beginner' },
      { word: 'tochter', translation: 'daughter', difficulty: 'beginner' },
      { word: 'bruder', translation: 'brother', difficulty: 'beginner' }
    ]
  },
  body: {
    spanish: [
      { word: 'cabeza', translation: 'head', difficulty: 'beginner' },
      { word: 'brazo', translation: 'arm', difficulty: 'beginner' },
      { word: 'pierna', translation: 'leg', difficulty: 'beginner' },
      { word: 'mano', translation: 'hand', difficulty: 'beginner' },
      { word: 'pie', translation: 'foot', difficulty: 'beginner' },
      { word: 'ojo', translation: 'eye', difficulty: 'beginner' },
      { word: 'nariz', translation: 'nose', difficulty: 'beginner' }
    ],
    french: [
      { word: 'tête', translation: 'head', difficulty: 'beginner' },
      { word: 'bras', translation: 'arm', difficulty: 'beginner' },
      { word: 'jambe', translation: 'leg', difficulty: 'beginner' },
      { word: 'main', translation: 'hand', difficulty: 'beginner' },
      { word: 'pied', translation: 'foot', difficulty: 'beginner' },
      { word: 'œil', translation: 'eye', difficulty: 'beginner' },
      { word: 'nez', translation: 'nose', difficulty: 'beginner' }
    ],
    german: [
      { word: 'kopf', translation: 'head', difficulty: 'beginner' },
      { word: 'arm', translation: 'arm', difficulty: 'beginner' },
      { word: 'bein', translation: 'leg', difficulty: 'beginner' },
      { word: 'hand', translation: 'hand', difficulty: 'beginner' },
      { word: 'fuß', translation: 'foot', difficulty: 'beginner' },
      { word: 'auge', translation: 'eye', difficulty: 'beginner' },
      { word: 'nase', translation: 'nose', difficulty: 'beginner' }
    ]
  },
  clothes: {
    spanish: [
      { word: 'camisa', translation: 'shirt', difficulty: 'beginner' },
      { word: 'pantalones', translation: 'pants', difficulty: 'beginner' },
      { word: 'zapatos', translation: 'shoes', difficulty: 'beginner' },
      { word: 'sombrero', translation: 'hat', difficulty: 'beginner' },
      { word: 'vestido', translation: 'dress', difficulty: 'beginner' },
      { word: 'chaqueta', translation: 'jacket', difficulty: 'intermediate' }
    ],
    french: [
      { word: 'chemise', translation: 'shirt', difficulty: 'beginner' },
      { word: 'pantalon', translation: 'pants', difficulty: 'beginner' },
      { word: 'chaussures', translation: 'shoes', difficulty: 'beginner' },
      { word: 'chapeau', translation: 'hat', difficulty: 'beginner' },
      { word: 'robe', translation: 'dress', difficulty: 'beginner' },
      { word: 'veste', translation: 'jacket', difficulty: 'intermediate' }
    ],
    german: [
      { word: 'hemd', translation: 'shirt', difficulty: 'beginner' },
      { word: 'hose', translation: 'pants', difficulty: 'beginner' },
      { word: 'schuhe', translation: 'shoes', difficulty: 'beginner' },
      { word: 'hut', translation: 'hat', difficulty: 'beginner' },
      { word: 'kleid', translation: 'dress', difficulty: 'beginner' },
      { word: 'jacke', translation: 'jacket', difficulty: 'intermediate' }
    ]
  },
  house: {
    spanish: [
      { word: 'casa', translation: 'house', difficulty: 'beginner' },
      { word: 'cocina', translation: 'kitchen', difficulty: 'beginner' },
      { word: 'baño', translation: 'bathroom', difficulty: 'beginner' },
      { word: 'dormitorio', translation: 'bedroom', difficulty: 'beginner' },
      { word: 'sala', translation: 'living room', difficulty: 'beginner' },
      { word: 'mesa', translation: 'table', difficulty: 'beginner' },
      { word: 'silla', translation: 'chair', difficulty: 'beginner' }
    ],
    french: [
      { word: 'maison', translation: 'house', difficulty: 'beginner' },
      { word: 'cuisine', translation: 'kitchen', difficulty: 'beginner' },
      { word: 'salle de bain', translation: 'bathroom', difficulty: 'beginner' },
      { word: 'chambre', translation: 'bedroom', difficulty: 'beginner' },
      { word: 'salon', translation: 'living room', difficulty: 'beginner' },
      { word: 'table', translation: 'table', difficulty: 'beginner' },
      { word: 'chaise', translation: 'chair', difficulty: 'beginner' }
    ],
    german: [
      { word: 'haus', translation: 'house', difficulty: 'beginner' },
      { word: 'küche', translation: 'kitchen', difficulty: 'beginner' },
      { word: 'badezimmer', translation: 'bathroom', difficulty: 'beginner' },
      { word: 'schlafzimmer', translation: 'bedroom', difficulty: 'beginner' },
      { word: 'wohnzimmer', translation: 'living room', difficulty: 'beginner' },
      { word: 'tisch', translation: 'table', difficulty: 'beginner' },
      { word: 'stuhl', translation: 'chair', difficulty: 'beginner' }
    ]
  },
  school: {
    spanish: [
      { word: 'escuela', translation: 'school', difficulty: 'beginner' },
      { word: 'libro', translation: 'book', difficulty: 'beginner' },
      { word: 'lápiz', translation: 'pencil', difficulty: 'beginner' },
      { word: 'papel', translation: 'paper', difficulty: 'beginner' },
      { word: 'maestro', translation: 'teacher', difficulty: 'beginner' },
      { word: 'estudiante', translation: 'student', difficulty: 'beginner' }
    ],
    french: [
      { word: 'école', translation: 'school', difficulty: 'beginner' },
      { word: 'livre', translation: 'book', difficulty: 'beginner' },
      { word: 'crayon', translation: 'pencil', difficulty: 'beginner' },
      { word: 'papier', translation: 'paper', difficulty: 'beginner' },
      { word: 'professeur', translation: 'teacher', difficulty: 'beginner' },
      { word: 'étudiant', translation: 'student', difficulty: 'beginner' }
    ],
    german: [
      { word: 'schule', translation: 'school', difficulty: 'beginner' },
      { word: 'buch', translation: 'book', difficulty: 'beginner' },
      { word: 'bleistift', translation: 'pencil', difficulty: 'beginner' },
      { word: 'papier', translation: 'paper', difficulty: 'beginner' },
      { word: 'lehrer', translation: 'teacher', difficulty: 'beginner' },
      { word: 'schüler', translation: 'student', difficulty: 'beginner' }
    ]
  },
  sports: {
    spanish: [
      { word: 'fútbol', translation: 'soccer', difficulty: 'beginner' },
      { word: 'baloncesto', translation: 'basketball', difficulty: 'beginner' },
      { word: 'tenis', translation: 'tennis', difficulty: 'beginner' },
      { word: 'natación', translation: 'swimming', difficulty: 'beginner' },
      { word: 'correr', translation: 'running', difficulty: 'beginner' },
      { word: 'pelota', translation: 'ball', difficulty: 'beginner' }
    ],
    french: [
      { word: 'football', translation: 'soccer', difficulty: 'beginner' },
      { word: 'basketball', translation: 'basketball', difficulty: 'beginner' },
      { word: 'tennis', translation: 'tennis', difficulty: 'beginner' },
      { word: 'natation', translation: 'swimming', difficulty: 'beginner' },
      { word: 'course', translation: 'running', difficulty: 'beginner' },
      { word: 'balle', translation: 'ball', difficulty: 'beginner' }
    ],
    german: [
      { word: 'fußball', translation: 'soccer', difficulty: 'beginner' },
      { word: 'basketball', translation: 'basketball', difficulty: 'beginner' },
      { word: 'tennis', translation: 'tennis', difficulty: 'beginner' },
      { word: 'schwimmen', translation: 'swimming', difficulty: 'beginner' },
      { word: 'laufen', translation: 'running', difficulty: 'beginner' },
      { word: 'ball', translation: 'ball', difficulty: 'beginner' }
    ]
  },
  weather: {
    spanish: [
      { word: 'sol', translation: 'sun', difficulty: 'beginner' },
      { word: 'lluvia', translation: 'rain', difficulty: 'beginner' },
      { word: 'nieve', translation: 'snow', difficulty: 'beginner' },
      { word: 'viento', translation: 'wind', difficulty: 'beginner' },
      { word: 'nube', translation: 'cloud', difficulty: 'beginner' },
      { word: 'calor', translation: 'heat', difficulty: 'beginner' }
    ],
    french: [
      { word: 'soleil', translation: 'sun', difficulty: 'beginner' },
      { word: 'pluie', translation: 'rain', difficulty: 'beginner' },
      { word: 'neige', translation: 'snow', difficulty: 'beginner' },
      { word: 'vent', translation: 'wind', difficulty: 'beginner' },
      { word: 'nuage', translation: 'cloud', difficulty: 'beginner' },
      { word: 'chaleur', translation: 'heat', difficulty: 'beginner' }
    ],
    german: [
      { word: 'sonne', translation: 'sun', difficulty: 'beginner' },
      { word: 'regen', translation: 'rain', difficulty: 'beginner' },
      { word: 'schnee', translation: 'snow', difficulty: 'beginner' },
      { word: 'wind', translation: 'wind', difficulty: 'beginner' },
      { word: 'wolke', translation: 'cloud', difficulty: 'beginner' },
      { word: 'hitze', translation: 'heat', difficulty: 'beginner' }
    ]
  },
  transport: {
    spanish: [
      { word: 'coche', translation: 'car', difficulty: 'beginner' },
      { word: 'autobús', translation: 'bus', difficulty: 'beginner' },
      { word: 'tren', translation: 'train', difficulty: 'beginner' },
      { word: 'avión', translation: 'airplane', difficulty: 'beginner' },
      { word: 'bicicleta', translation: 'bicycle', difficulty: 'beginner' },
      { word: 'barco', translation: 'boat', difficulty: 'beginner' }
    ],
    french: [
      { word: 'voiture', translation: 'car', difficulty: 'beginner' },
      { word: 'bus', translation: 'bus', difficulty: 'beginner' },
      { word: 'train', translation: 'train', difficulty: 'beginner' },
      { word: 'avion', translation: 'airplane', difficulty: 'beginner' },
      { word: 'vélo', translation: 'bicycle', difficulty: 'beginner' },
      { word: 'bateau', translation: 'boat', difficulty: 'beginner' }
    ],
    german: [
      { word: 'auto', translation: 'car', difficulty: 'beginner' },
      { word: 'bus', translation: 'bus', difficulty: 'beginner' },
      { word: 'zug', translation: 'train', difficulty: 'beginner' },
      { word: 'flugzeug', translation: 'airplane', difficulty: 'beginner' },
      { word: 'fahrrad', translation: 'bicycle', difficulty: 'beginner' },
      { word: 'boot', translation: 'boat', difficulty: 'beginner' }
    ]
  },
  emotions: {
    spanish: [
      { word: 'feliz', translation: 'happy', difficulty: 'beginner' },
      { word: 'triste', translation: 'sad', difficulty: 'beginner' },
      { word: 'enojado', translation: 'angry', difficulty: 'beginner' },
      { word: 'asustado', translation: 'scared', difficulty: 'beginner' },
      { word: 'sorprendido', translation: 'surprised', difficulty: 'intermediate' },
      { word: 'cansado', translation: 'tired', difficulty: 'beginner' }
    ],
    french: [
      { word: 'heureux', translation: 'happy', difficulty: 'beginner' },
      { word: 'triste', translation: 'sad', difficulty: 'beginner' },
      { word: 'en colère', translation: 'angry', difficulty: 'beginner' },
      { word: 'effrayé', translation: 'scared', difficulty: 'beginner' },
      { word: 'surpris', translation: 'surprised', difficulty: 'intermediate' },
      { word: 'fatigué', translation: 'tired', difficulty: 'beginner' }
    ],
    german: [
      { word: 'glücklich', translation: 'happy', difficulty: 'beginner' },
      { word: 'traurig', translation: 'sad', difficulty: 'beginner' },
      { word: 'wütend', translation: 'angry', difficulty: 'beginner' },
      { word: 'ängstlich', translation: 'scared', difficulty: 'beginner' },
      { word: 'überrascht', translation: 'surprised', difficulty: 'intermediate' },
      { word: 'müde', translation: 'tired', difficulty: 'beginner' }
    ]
  },
  time: {
    spanish: [
      { word: 'hora', translation: 'hour', difficulty: 'beginner' },
      { word: 'día', translation: 'day', difficulty: 'beginner' },
      { word: 'semana', translation: 'week', difficulty: 'beginner' },
      { word: 'mes', translation: 'month', difficulty: 'beginner' },
      { word: 'año', translation: 'year', difficulty: 'beginner' },
      { word: 'mañana', translation: 'morning', difficulty: 'beginner' },
      { word: 'noche', translation: 'night', difficulty: 'beginner' }
    ],
    french: [
      { word: 'heure', translation: 'hour', difficulty: 'beginner' },
      { word: 'jour', translation: 'day', difficulty: 'beginner' },
      { word: 'semaine', translation: 'week', difficulty: 'beginner' },
      { word: 'mois', translation: 'month', difficulty: 'beginner' },
      { word: 'année', translation: 'year', difficulty: 'beginner' },
      { word: 'matin', translation: 'morning', difficulty: 'beginner' },
      { word: 'nuit', translation: 'night', difficulty: 'beginner' }
    ],
    german: [
      { word: 'stunde', translation: 'hour', difficulty: 'beginner' },
      { word: 'tag', translation: 'day', difficulty: 'beginner' },
      { word: 'woche', translation: 'week', difficulty: 'beginner' },
      { word: 'monat', translation: 'month', difficulty: 'beginner' },
      { word: 'jahr', translation: 'year', difficulty: 'beginner' },
      { word: 'morgen', translation: 'morning', difficulty: 'beginner' },
      { word: 'nacht', translation: 'night', difficulty: 'beginner' }
    ]
  },
  nature: {
    spanish: [
      { word: 'árbol', translation: 'tree', difficulty: 'beginner' },
      { word: 'flor', translation: 'flower', difficulty: 'beginner' },
      { word: 'montaña', translation: 'mountain', difficulty: 'beginner' },
      { word: 'río', translation: 'river', difficulty: 'beginner' },
      { word: 'mar', translation: 'sea', difficulty: 'beginner' },
      { word: 'bosque', translation: 'forest', difficulty: 'intermediate' }
    ],
    french: [
      { word: 'arbre', translation: 'tree', difficulty: 'beginner' },
      { word: 'fleur', translation: 'flower', difficulty: 'beginner' },
      { word: 'montagne', translation: 'mountain', difficulty: 'beginner' },
      { word: 'rivière', translation: 'river', difficulty: 'beginner' },
      { word: 'mer', translation: 'sea', difficulty: 'beginner' },
      { word: 'forêt', translation: 'forest', difficulty: 'intermediate' }
    ],
    german: [
      { word: 'baum', translation: 'tree', difficulty: 'beginner' },
      { word: 'blume', translation: 'flower', difficulty: 'beginner' },
      { word: 'berg', translation: 'mountain', difficulty: 'beginner' },
      { word: 'fluss', translation: 'river', difficulty: 'beginner' },
      { word: 'meer', translation: 'sea', difficulty: 'beginner' },
      { word: 'wald', translation: 'forest', difficulty: 'intermediate' }
    ]
  },
  technology: {
    spanish: [
      { word: 'computadora', translation: 'computer', difficulty: 'beginner' },
      { word: 'teléfono', translation: 'phone', difficulty: 'beginner' },
      { word: 'internet', translation: 'internet', difficulty: 'beginner' },
      { word: 'televisión', translation: 'television', difficulty: 'beginner' },
      { word: 'radio', translation: 'radio', difficulty: 'beginner' },
      { word: 'cámara', translation: 'camera', difficulty: 'beginner' }
    ],
    french: [
      { word: 'ordinateur', translation: 'computer', difficulty: 'beginner' },
      { word: 'téléphone', translation: 'phone', difficulty: 'beginner' },
      { word: 'internet', translation: 'internet', difficulty: 'beginner' },
      { word: 'télévision', translation: 'television', difficulty: 'beginner' },
      { word: 'radio', translation: 'radio', difficulty: 'beginner' },
      { word: 'appareil photo', translation: 'camera', difficulty: 'beginner' }
    ],
    german: [
      { word: 'computer', translation: 'computer', difficulty: 'beginner' },
      { word: 'telefon', translation: 'phone', difficulty: 'beginner' },
      { word: 'internet', translation: 'internet', difficulty: 'beginner' },
      { word: 'fernseher', translation: 'television', difficulty: 'beginner' },
      { word: 'radio', translation: 'radio', difficulty: 'beginner' },
      { word: 'kamera', translation: 'camera', difficulty: 'beginner' }
    ]
  },
  music: {
    spanish: [
      { word: 'música', translation: 'music', difficulty: 'beginner' },
      { word: 'guitarra', translation: 'guitar', difficulty: 'beginner' },
      { word: 'piano', translation: 'piano', difficulty: 'beginner' },
      { word: 'canción', translation: 'song', difficulty: 'beginner' },
      { word: 'cantante', translation: 'singer', difficulty: 'beginner' },
      { word: 'tambor', translation: 'drum', difficulty: 'beginner' }
    ],
    french: [
      { word: 'musique', translation: 'music', difficulty: 'beginner' },
      { word: 'guitare', translation: 'guitar', difficulty: 'beginner' },
      { word: 'piano', translation: 'piano', difficulty: 'beginner' },
      { word: 'chanson', translation: 'song', difficulty: 'beginner' },
      { word: 'chanteur', translation: 'singer', difficulty: 'beginner' },
      { word: 'tambour', translation: 'drum', difficulty: 'beginner' }
    ],
    german: [
      { word: 'musik', translation: 'music', difficulty: 'beginner' },
      { word: 'gitarre', translation: 'guitar', difficulty: 'beginner' },
      { word: 'klavier', translation: 'piano', difficulty: 'beginner' },
      { word: 'lied', translation: 'song', difficulty: 'beginner' },
      { word: 'sänger', translation: 'singer', difficulty: 'beginner' },
      { word: 'trommel', translation: 'drum', difficulty: 'beginner' }
    ]
  },
  travel: {
    spanish: [
      { word: 'viaje', translation: 'trip', difficulty: 'beginner' },
      { word: 'hotel', translation: 'hotel', difficulty: 'beginner' },
      { word: 'aeropuerto', translation: 'airport', difficulty: 'beginner' },
      { word: 'pasaporte', translation: 'passport', difficulty: 'beginner' },
      { word: 'maleta', translation: 'suitcase', difficulty: 'beginner' },
      { word: 'turista', translation: 'tourist', difficulty: 'beginner' }
    ],
    french: [
      { word: 'voyage', translation: 'trip', difficulty: 'beginner' },
      { word: 'hôtel', translation: 'hotel', difficulty: 'beginner' },
      { word: 'aéroport', translation: 'airport', difficulty: 'beginner' },
      { word: 'passeport', translation: 'passport', difficulty: 'beginner' },
      { word: 'valise', translation: 'suitcase', difficulty: 'beginner' },
      { word: 'touriste', translation: 'tourist', difficulty: 'beginner' }
    ],
    german: [
      { word: 'reise', translation: 'trip', difficulty: 'beginner' },
      { word: 'hotel', translation: 'hotel', difficulty: 'beginner' },
      { word: 'flughafen', translation: 'airport', difficulty: 'beginner' },
      { word: 'reisepass', translation: 'passport', difficulty: 'beginner' },
      { word: 'koffer', translation: 'suitcase', difficulty: 'beginner' },
      { word: 'tourist', translation: 'tourist', difficulty: 'beginner' }
    ]
  }
};

const generateWrongOptions = (correctTranslation: string, category: string, language: string) => {
  const categoryData = VOCABULARY[category as keyof typeof VOCABULARY];
  if (!categoryData) return [];
  
  const languageData = categoryData[language as keyof typeof categoryData];
  if (!languageData) return [];
  
  const categoryWords = languageData;
  const otherTranslations = categoryWords
    .filter((item: any) => item.translation !== correctTranslation)
    .map((item: any) => item.translation);
  
  // Shuffle and take 3 random wrong options
  const shuffled = otherTranslations.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, 3);
};

export default function TicTacToeGame({ settings, onBackToMenu, onGameEnd }: TicTacToeGameProps) {
  const { themeClasses } = useTheme();
  
  // Audio state
  const [soundEnabled, setSoundEnabled] = useState(true);
  const { playSFX, playThemeSFX, startBackgroundMusic, stopBackgroundMusic } = useAudio(soundEnabled);
  
  const [board, setBoard] = useState<CellContent[]>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [winner, setWinner] = useState<'X' | 'O' | null>(null);
  const [winningLine, setWinningLine] = useState<number[]>([]);
  const [showVocabQuestion, setShowVocabQuestion] = useState(false);
  const [pendingMove, setPendingMove] = useState<number | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<any>(null);
  const [wordsLearned, setWordsLearned] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [storyDismissed, setStoryDismissed] = useState(false);

  // Audio effects - Start background music when story is dismissed
  useEffect(() => {
    if (storyDismissed) {
      startBackgroundMusic(settings.theme);
    }
    
    // Cleanup - stop music when component unmounts
    return () => {
      stopBackgroundMusic();
    };
  }, [storyDismissed, settings.theme, startBackgroundMusic, stopBackgroundMusic]);
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setGameState('playing');
    setWinner(null);
    setWinningLine([]);
    setShowVocabQuestion(false);
    setPendingMove(null);
    setCurrentQuestion(null);
    setWordsLearned(0);
    setCorrectAnswers(0);
    // Keep storyDismissed as true to prevent modal from showing again
    // setStoryDismissed(false);
  };

  // Get vocabulary for current settings
  const getVocabulary = () => {
    const categoryData = VOCABULARY[settings.category as keyof typeof VOCABULARY];
    if (!categoryData) return [];
    const languageData = categoryData[settings.language as keyof typeof categoryData];
    return languageData || [];
  };

  const generateVocabularyQuestion = () => {
    const vocabulary = getVocabulary();
    if (vocabulary.length === 0) return null;
    
    const randomWord = vocabulary[Math.floor(Math.random() * vocabulary.length)];
    const wrongOptions = generateWrongOptions(randomWord.translation, settings.category, settings.language);
    
    // Create 4 options: 1 correct + 3 wrong, then shuffle
    const options = [randomWord.translation, ...wrongOptions].sort(() => 0.5 - Math.random());
    const correctIndex = options.indexOf(randomWord.translation);
    
    return {
      word: randomWord.word,
      translation: randomWord.translation,
      options: options,
      correctIndex: correctIndex,
      language: settings.language
    };
  };

  const checkWinner = (squares: CellContent[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
      [0, 4, 8], [2, 4, 6] // diagonals
    ];
    
    for (let line of lines) {
      const [a, b, c] = line;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a] as 'X' | 'O', line };
      }
    }
    
    // Check for tie
    if (squares.every(cell => cell !== null)) {
      return { winner: 'tie' as const, line: [] };
    }
    
    return { winner: null, line: [] };
  };

  const handleCellClick = (index: number) => {
    if (board[index] || gameState !== 'playing' || currentPlayer !== 'X') return;
    
    // Play square select sound
    playSFX('square-select');
    
    // Generate and show vocabulary question
    const question = generateVocabularyQuestion();
    if (!question) {
      // Fallback if no vocabulary available
      makeMove(index);
      return;
    }
    
    setCurrentQuestion(question);
    setPendingMove(index);
    setShowVocabQuestion(true);
  };

  const handleVocabAnswer = (selectedIndex: number) => {
    setShowVocabQuestion(false);
    
    if (!currentQuestion || pendingMove === null) return;
    
    const isCorrect = selectedIndex === currentQuestion.correctIndex;
    
    if (isCorrect) {
      // Play correct answer sound
      playSFX('correct-answer');
      setWordsLearned(prev => prev + 1);
      setCorrectAnswers(prev => prev + 1);
      makeMove(pendingMove);
    } else {
      // Play wrong answer sound
      playSFX('wrong-answer');
      
      // Wrong answer - computer gets a turn or player tries again depending on difficulty
      if (settings.difficulty === 'beginner') {
        // Give player another chance on beginner
        const newQuestion = generateVocabularyQuestion();
        setCurrentQuestion(newQuestion);
        setShowVocabQuestion(true);
        return;
      } else {
        // Computer gets to make a move
        makeComputerMove();
      }
    }
    
    setPendingMove(null);
    setCurrentQuestion(null);
  };

  const makeMove = (index: number) => {
    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setCurrentPlayer(currentPlayer === 'X' ? 'O' : 'X');
      if (currentPlayer === 'X') {
        // After player's move, computer moves
        setTimeout(() => makeComputerMove(newBoard), 1000);
      }
    }
  };

  const makeComputerMove = (currentBoard = board) => {
    const availableCells = currentBoard
      .map((cell, index) => cell === null ? index : null)
      .filter(val => val !== null) as number[];
    
    if (availableCells.length === 0) return;
    
    // Enhanced AI Logic
    const computerMark = settings.computerMark as 'X' | 'O';
    const playerMark = settings.playerMark as 'X' | 'O';
    
    // Helper function to check if a move creates a winning line
    const checkWinMove = (board: CellContent[], mark: 'X' | 'O', position: number): boolean => {
      const testBoard = [...board];
      testBoard[position] = mark;
      const result = checkWinner(testBoard);
      return result.winner === mark;
    };
    
    // Helper function to check if a move blocks opponent from winning
    const checkBlockMove = (board: CellContent[], playerMark: 'X' | 'O', position: number): boolean => {
      const testBoard = [...board];
      testBoard[position] = playerMark;
      const result = checkWinner(testBoard);
      return result.winner === playerMark;
    };
    
    let bestMove: number;
    
    // Difficulty-based AI
    if (settings.difficulty === 'advanced') {
      // 1. Try to win
      const winMove = availableCells.find(pos => checkWinMove(currentBoard, computerMark, pos));
      if (winMove !== undefined) {
        bestMove = winMove;
      } else {
        // 2. Block player from winning
        const blockMove = availableCells.find(pos => checkBlockMove(currentBoard, playerMark, pos));
        if (blockMove !== undefined) {
          bestMove = blockMove;
        } else {
          // 3. Take center if available
          if (availableCells.includes(4)) {
            bestMove = 4;
          } else {
            // 4. Take corners
            const corners = [0, 2, 6, 8].filter(pos => availableCells.includes(pos));
            if (corners.length > 0) {
              bestMove = corners[Math.floor(Math.random() * corners.length)];
            } else {
              // 5. Take any available
              bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
            }
          }
        }
      }
    } else if (settings.difficulty === 'intermediate') {
      // 70% smart moves, 30% random
      if (Math.random() < 0.7) {
        // Try to win first
        const winMove = availableCells.find(pos => checkWinMove(currentBoard, computerMark, pos));
        if (winMove !== undefined) {
          bestMove = winMove;
        } else {
          // Block player sometimes
          const blockMove = availableCells.find(pos => checkBlockMove(currentBoard, playerMark, pos));
          if (blockMove !== undefined && Math.random() < 0.8) {
            bestMove = blockMove;
          } else {
            // Take center or corner
            if (availableCells.includes(4)) {
              bestMove = 4;
            } else {
              const corners = [0, 2, 6, 8].filter(pos => availableCells.includes(pos));
              if (corners.length > 0) {
                bestMove = corners[Math.floor(Math.random() * corners.length)];
              } else {
                bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
              }
            }
          }
        }
      } else {
        // Random move
        bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
      }
    } else {
      // Beginner: 40% smart moves, 60% random
      if (Math.random() < 0.4) {
        const winMove = availableCells.find(pos => checkWinMove(currentBoard, computerMark, pos));
        if (winMove !== undefined) {
          bestMove = winMove;
        } else if (Math.random() < 0.5) {
          const blockMove = availableCells.find(pos => checkBlockMove(currentBoard, playerMark, pos));
          bestMove = blockMove !== undefined ? blockMove : availableCells[Math.floor(Math.random() * availableCells.length)];
        } else {
          bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
        }
      } else {
        bestMove = availableCells[Math.floor(Math.random() * availableCells.length)];
      }
    }
    
    const newBoard = [...currentBoard];
    newBoard[bestMove] = computerMark;
    setBoard(newBoard);
    
    const result = checkWinner(newBoard);
    if (result.winner) {
      handleGameEnd(result.winner, result.line);
    } else {
      setCurrentPlayer('X');
    }
  };

  const handleGameEnd = (gameWinner: 'X' | 'O' | 'tie', line: number[]) => {
    if (gameWinner === 'tie') {
      setGameState('tie');
      setWinner(null);
      playSFX('tie-game');
    } else {
      setWinner(gameWinner);
      setWinningLine(line);
      
      if (gameWinner === 'X') {
        setGameState('won');
        playSFX('victory');
        playThemeSFX(settings.theme);
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } else {
        setGameState('lost');
        playSFX('defeat');
      }
    }
    
    // Call parent callback with results
    setTimeout(() => {
      const perfectGame = correctAnswers === wordsLearned && wordsLearned >= 3;
      onGameEnd({
        outcome: gameWinner === 'X' ? 'win' : gameWinner === 'tie' ? 'tie' : 'loss',
        wordsLearned,
        perfectGame
      });
    }, 2000);
  };

  const renderThemeAnimation = () => {
    const animationProps = { 
      board, 
      gameState, 
      storyDismissed,
      onStoryDismiss: () => setStoryDismissed(true)
    };
    
    switch (settings.theme) {
      case 'tokyo':
        return <TokyoNightsAnimation {...animationProps} />;
      case 'pirate':
        return <PirateAdventureAnimation {...animationProps} />;
      case 'space':
        return <SpaceExplorerAnimation {...animationProps} />;
      case 'temple':
        return <LavaTempleAnimation {...animationProps} />;
      default:
        return <ClassicAnimation {...animationProps} />;
    }
  };

  const getThemeTitle = () => {
    switch (settings.theme) {
      case 'tokyo':
        return '🌃 Tokyo Nights Hack';
      case 'pirate':
        return '🏴‍☠️ Pirate Adventure';
      case 'space':
        return '🚀 Space Explorer';
      case 'temple':
        return '🔥 Lava Temple';
      default:
        return '🎯 Classic Challenge';
    }
  };

  return (
    <div className="w-full h-screen relative overflow-hidden">
      
      {/* Full-Screen Immersive Theme Background */}
      <div className="absolute inset-0">
        {renderThemeAnimation()}
      </div>

      {/* Header Overlay */}
      <div className="absolute top-0 left-0 right-0 z-20 bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="flex justify-between items-center p-6">
          <motion.button
            onClick={() => {
              playSFX('button-click');
              onBackToMenu();
            }}
            className="flex items-center gap-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white px-6 py-3 rounded-full transition-all shadow-lg border border-white/20"
            whileHover={{ scale: 1.05, x: -4 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Menu</span>
          </motion.button>
          
          {/* Themed Title */}
          <motion.div
            className="flex-1 text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h1 
              className="text-2xl md:text-3xl font-bold text-white"
              style={{
                textShadow: '3px 3px 0px rgba(0, 0, 0, 0.8), -1px -1px 0px rgba(0, 0, 0, 0.8), 1px -1px 0px rgba(0, 0, 0, 0.8), -1px 1px 0px rgba(0, 0, 0, 0.8), 0 0 10px rgba(0, 0, 0, 0.5)',
              }}
            >
              {getThemeTitle()}
            </h1>
          </motion.div>
          
          <motion.button
            onClick={() => {
              playSFX('button-click');
              setSoundEnabled(!soundEnabled);
            }}
            className="p-3 rounded-full bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white transition-all shadow-lg border border-white/20"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      {/* Game Content - Split Layout: Board Left, Theme Right - Only show after story dismissed */}
      {storyDismissed && (
        <div className="absolute inset-0 pt-24 pb-4 flex items-start justify-center z-10">
          <div className="w-full max-w-7xl mx-auto px-8 flex items-start gap-8 mt-2">
          
          {/* Left Side - Game Board */}
          <div className="flex-shrink-0">
            <motion.div 
              className="bg-black/40 backdrop-blur-lg border-2 border-white/30 rounded-2xl p-4 shadow-2xl"
              initial={{ scale: 0.8, opacity: 0, x: -50 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
            >
              <div className="grid grid-cols-3 gap-6 aspect-square w-[28rem] mx-auto mb-2">
                {board.map((cell, index) => (
                  <motion.button
                    key={index}
                    onClick={() => handleCellClick(index)}
                    disabled={!!cell || gameState !== 'playing' || currentPlayer !== 'X'}
                    className={`
                      aspect-square rounded-2xl border-3 flex flex-col items-center justify-center text-6xl font-bold transition-all duration-300 relative
                      backdrop-blur-md bg-white/15 border-white/40 shadow-lg
                      ${winningLine.includes(index) 
                        ? 'bg-yellow-400/40 border-yellow-400 shadow-xl shadow-yellow-400/50 scale-105'
                        : cell 
                          ? cell === 'X' 
                            ? 'bg-blue-500/40 border-blue-400 text-blue-100 shadow-xl shadow-blue-400/50' 
                            : 'bg-red-500/40 border-red-400 text-red-100 shadow-xl shadow-red-400/50'
                          : 'hover:bg-white/25 hover:border-white/60 cursor-pointer'
                      }
                      ${!cell && gameState === 'playing' && currentPlayer === 'X' ? 'transform hover:scale-110' : ''}
                    `}
                    whileHover={!cell && gameState === 'playing' && currentPlayer === 'X' ? { 
                      scale: 1.1, 
                      y: -4,
                      boxShadow: "0 10px 25px rgba(255, 255, 255, 0.3)" 
                    } : {}}
                    whileTap={!cell && gameState === 'playing' && currentPlayer === 'X' ? { scale: 0.95 } : {}}
                  >
                    {/* Fixed glyph for each square */}
                    <div className="absolute top-1 left-1 text-white/25 text-xs font-bold select-none bg-black/20 rounded-full w-5 h-5 flex items-center justify-center">
                      {index + 1}
                    </div>
                    
                    <AnimatePresence>
                      {cell && (
                        <motion.span
                          initial={{ scale: 0, rotate: 180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: "spring", stiffness: 200, damping: 15 }}
                          className={`drop-shadow-2xl ${cell === 'X' ? 'text-blue-300' : 'text-red-300'}`}
                        >
                          {cell}
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </motion.button>
                ))}
              </div>

              {/* Game Status - Simplified */}
              <div className="text-center min-h-[60px] flex items-center justify-center">
                <AnimatePresence mode="wait">
                  {gameState === 'won' && (
                    <motion.div
                      key="winner"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <div className="text-2xl font-bold text-green-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-green-400/50">
                        🎉 Victory Achieved!
                      </div>
                      <div className="text-sm text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                        Words learned: {wordsLearned} • Accuracy: {Math.round((correctAnswers / Math.max(wordsLearned, 1)) * 100)}%
                      </div>
                      <div className="flex gap-3 justify-center mt-3">
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            resetGame();
                          }}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-bold rounded-full transition-all shadow-lg text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🎮 Play Again
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            onBackToMenu();
                          }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full transition-all shadow-lg border border-white/20 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🏠 Menu
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {gameState === 'lost' && (
                    <motion.div
                      key="loser"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <div className="text-2xl font-bold text-red-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-red-400/50">
                        💔 Mission Failed
                      </div>
                      <div className="text-sm text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                        Words learned: {wordsLearned}
                      </div>
                      <div className="flex gap-3 justify-center mt-3">
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            resetGame();
                          }}
                          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all shadow-lg text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🔄 Try Again
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            onBackToMenu();
                          }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full transition-all shadow-lg border border-white/20 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🏠 Menu
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {gameState === 'tie' && (
                    <motion.div
                      key="tie"
                      initial={{ opacity: 0, y: 20, scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -20, scale: 0.8 }}
                      className="space-y-4"
                    >
                      <div className="text-2xl font-bold text-yellow-300 drop-shadow-lg bg-black/50 backdrop-blur-sm rounded-2xl px-4 py-3 border border-yellow-400/50">
                        🤝 Stalemate
                      </div>
                      <div className="text-sm text-white bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                        Words learned: {wordsLearned}
                      </div>
                      <div className="flex gap-3 justify-center mt-3">
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            resetGame();
                          }}
                          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-bold rounded-full transition-all shadow-lg text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🎯 Rematch
                        </motion.button>
                        <motion.button
                          onClick={() => {
                            playSFX('button-click');
                            onBackToMenu();
                          }}
                          className="px-4 py-2 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold rounded-full transition-all shadow-lg border border-white/20 text-sm"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          🏠 Menu
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                  
                  {/* Removed computer thinking message to save space */}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>

          {/* Right Side - Theme Area (ship, treasure, etc.) */}
          <div className="flex-1 h-full relative">
            {/* This area is reserved for theme-specific elements like ships and treasures */}
          </div>
        </div>
        </div>
      )}

      {/* Vocabulary Question Modal */}
      <AnimatePresence>
        {showVocabQuestion && currentQuestion && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200"
            >
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Brain className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Vocabulary Challenge</h3>
                <p className="text-gray-600">Answer correctly to make your move!</p>
              </div>
              
              <div className="text-center mb-6">
                <div className="text-sm text-purple-600 font-medium mb-2">
                  {currentQuestion.language} → English
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  "{currentQuestion.word}"
                </div>
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option: string, index: number) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      playSFX('button-click');
                      handleVocabAnswer(index);
                    }}
                    className="w-full p-4 text-left rounded-xl border-2 border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all font-medium"
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-purple-600 font-bold mr-3">{String.fromCharCode(65 + index)}.</span>
                    {option}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
