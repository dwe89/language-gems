/**
 * Comprehensive decoy words pool for Word Blast game
 * Organized by language with common words that serve as effective distractors
 */

export interface DecoyWordsPool {
  spanish: string[];
  french: string[];
  german: string[];
}

export const DECOY_WORDS: DecoyWordsPool = {
  spanish: [
    // Articles and determiners
    'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas',
    'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas',
    'aquel', 'aquella', 'aquellos', 'aquellas',
    
    // Common prepositions
    'de', 'del', 'al', 'en', 'con', 'por', 'para', 'sin', 'sobre',
    'bajo', 'entre', 'desde', 'hasta', 'hacia', 'contra', 'según',
    
    // Conjunctions
    'y', 'o', 'pero', 'que', 'si', 'como', 'cuando', 'donde',
    'porque', 'aunque', 'mientras', 'sino', 'ni',
    
    // Common verbs
    'ser', 'estar', 'tener', 'hacer', 'ir', 'venir', 'ver', 'dar',
    'saber', 'poder', 'querer', 'decir', 'hablar', 'comer', 'beber',
    'vivir', 'trabajar', 'estudiar', 'jugar', 'dormir', 'caminar',
    'correr', 'escribir', 'leer', 'escuchar', 'mirar', 'comprar',
    'vender', 'abrir', 'cerrar', 'empezar', 'terminar', 'llegar',
    'salir', 'entrar', 'subir', 'bajar', 'llevar', 'traer',
    
    // Common nouns
    'casa', 'coche', 'libro', 'mesa', 'silla', 'puerta', 'ventana',
    'agua', 'comida', 'tiempo', 'día', 'noche', 'año', 'mes',
    'semana', 'hora', 'minuto', 'persona', 'hombre', 'mujer',
    'niño', 'niña', 'familia', 'amigo', 'trabajo', 'escuela',
    'ciudad', 'país', 'mundo', 'vida', 'muerte', 'amor', 'dinero',
    'problema', 'solución', 'pregunta', 'respuesta', 'historia',
    'música', 'película', 'juego', 'deporte', 'animal', 'perro',
    'gato', 'pájaro', 'árbol', 'flor', 'color', 'número',
    
    // Adjectives
    'bueno', 'malo', 'grande', 'pequeño', 'nuevo', 'viejo', 'joven',
    'alto', 'bajo', 'largo', 'corto', 'ancho', 'estrecho', 'gordo',
    'delgado', 'fuerte', 'débil', 'rápido', 'lento', 'fácil',
    'difícil', 'importante', 'interesante', 'aburrido', 'feliz',
    'triste', 'contento', 'enfadado', 'cansado', 'enfermo', 'sano',
    
    // Adverbs
    'muy', 'más', 'menos', 'también', 'tampoco', 'solo', 'solamente',
    'siempre', 'nunca', 'a veces', 'aquí', 'allí', 'ahí', 'cerca',
    'lejos', 'arriba', 'abajo', 'delante', 'detrás', 'dentro', 'fuera',
    'hoy', 'ayer', 'mañana', 'ahora', 'después', 'antes', 'pronto',
    'tarde', 'temprano', 'bien', 'mal', 'mejor', 'peor',
    
    // Numbers
    'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho',
    'nueve', 'diez', 'once', 'doce', 'veinte', 'treinta', 'cien', 'mil',
    
    // Colors
    'rojo', 'azul', 'verde', 'amarillo', 'negro', 'blanco', 'gris',
    'rosa', 'morado', 'naranja', 'marrón',
    
    // Body parts
    'cabeza', 'cara', 'ojo', 'nariz', 'boca', 'oreja', 'cuello',
    'brazo', 'mano', 'dedo', 'pierna', 'pie', 'corazón', 'estómago',
    
    // Food
    'pan', 'carne', 'pescado', 'pollo', 'verdura', 'fruta', 'leche',
    'queso', 'huevo', 'arroz', 'pasta', 'sopa', 'ensalada', 'postre'
  ],

  french: [
    // Articles and determiners
    'le', 'la', 'les', 'un', 'une', 'des', 'du', 'de', 'au', 'aux',
    'ce', 'cette', 'ces', 'cet', 'mon', 'ma', 'mes', 'ton', 'ta', 'tes',
    'son', 'sa', 'ses', 'notre', 'nos', 'votre', 'vos', 'leur', 'leurs',
    
    // Common prepositions
    'de', 'à', 'dans', 'sur', 'sous', 'avec', 'sans', 'pour', 'par',
    'entre', 'chez', 'vers', 'depuis', 'pendant', 'avant', 'après',
    'contre', 'selon', 'malgré', 'parmi',
    
    // Conjunctions
    'et', 'ou', 'mais', 'que', 'si', 'comme', 'quand', 'où',
    'parce que', 'bien que', 'tandis que', 'puisque', 'car', 'donc',
    
    // Common verbs
    'être', 'avoir', 'faire', 'aller', 'venir', 'voir', 'savoir',
    'pouvoir', 'vouloir', 'dire', 'parler', 'manger', 'boire',
    'vivre', 'travailler', 'étudier', 'jouer', 'dormir', 'marcher',
    'courir', 'écrire', 'lire', 'écouter', 'regarder', 'acheter',
    'vendre', 'ouvrir', 'fermer', 'commencer', 'finir', 'arriver',
    'partir', 'entrer', 'sortir', 'monter', 'descendre', 'porter',
    'apporter', 'prendre', 'donner', 'mettre', 'comprendre',
    
    // Common nouns
    'maison', 'voiture', 'livre', 'table', 'chaise', 'porte', 'fenêtre',
    'eau', 'nourriture', 'temps', 'jour', 'nuit', 'année', 'mois',
    'semaine', 'heure', 'minute', 'personne', 'homme', 'femme',
    'enfant', 'garçon', 'fille', 'famille', 'ami', 'travail', 'école',
    'ville', 'pays', 'monde', 'vie', 'mort', 'amour', 'argent',
    'problème', 'solution', 'question', 'réponse', 'histoire',
    'musique', 'film', 'jeu', 'sport', 'animal', 'chien', 'chat',
    'oiseau', 'arbre', 'fleur', 'couleur', 'nombre', 'mot', 'phrase',
    
    // Adjectives
    'bon', 'mauvais', 'grand', 'petit', 'nouveau', 'vieux', 'jeune',
    'haut', 'bas', 'long', 'court', 'large', 'étroit', 'gros',
    'mince', 'fort', 'faible', 'rapide', 'lent', 'facile', 'difficile',
    'important', 'intéressant', 'ennuyeux', 'heureux', 'triste',
    'content', 'fâché', 'fatigué', 'malade', 'sain', 'beau', 'laid',
    
    // Adverbs
    'très', 'plus', 'moins', 'aussi', 'encore', 'déjà', 'toujours',
    'jamais', 'souvent', 'parfois', 'ici', 'là', 'près', 'loin',
    'dessus', 'dessous', 'devant', 'derrière', 'dedans', 'dehors',
    'aujourd\'hui', 'hier', 'demain', 'maintenant', 'puis', 'alors',
    'bientôt', 'tard', 'tôt', 'bien', 'mal', 'mieux', 'pire',
    
    // Numbers
    'un', 'deux', 'trois', 'quatre', 'cinq', 'six', 'sept', 'huit',
    'neuf', 'dix', 'onze', 'douze', 'vingt', 'trente', 'cent', 'mille',
    
    // Colors
    'rouge', 'bleu', 'vert', 'jaune', 'noir', 'blanc', 'gris',
    'rose', 'violet', 'orange', 'marron',
    
    // Body parts
    'tête', 'visage', 'œil', 'nez', 'bouche', 'oreille', 'cou',
    'bras', 'main', 'doigt', 'jambe', 'pied', 'cœur', 'estomac',
    
    // Food
    'pain', 'viande', 'poisson', 'poulet', 'légume', 'fruit', 'lait',
    'fromage', 'œuf', 'riz', 'pâtes', 'soupe', 'salade', 'dessert'
  ],

  german: [
    // Articles and determiners
    'der', 'die', 'das', 'den', 'dem', 'des', 'ein', 'eine', 'einen',
    'einem', 'einer', 'eines', 'kein', 'keine', 'keinen', 'keinem',
    'dieser', 'diese', 'dieses', 'diesen', 'diesem', 'jeder', 'jede',
    'jedes', 'jeden', 'jedem', 'mein', 'meine', 'meinen', 'meinem',
    'meiner', 'meines', 'dein', 'deine', 'sein', 'seine', 'ihr', 'ihre',
    
    // Common prepositions
    'in', 'an', 'auf', 'unter', 'über', 'vor', 'hinter', 'neben',
    'zwischen', 'mit', 'ohne', 'für', 'gegen', 'durch', 'um',
    'von', 'zu', 'nach', 'bei', 'seit', 'während', 'wegen',
    'trotz', 'statt', 'außer', 'bis',
    
    // Conjunctions
    'und', 'oder', 'aber', 'dass', 'wenn', 'als', 'wie', 'wo',
    'weil', 'da', 'obwohl', 'während', 'bevor', 'nachdem',
    'damit', 'so dass', 'falls', 'sobald',
    
    // Common verbs
    'sein', 'haben', 'werden', 'können', 'müssen', 'sollen', 'wollen',
    'dürfen', 'mögen', 'machen', 'gehen', 'kommen', 'sehen', 'wissen',
    'sagen', 'sprechen', 'essen', 'trinken', 'leben', 'arbeiten',
    'lernen', 'spielen', 'schlafen', 'laufen', 'rennen', 'schreiben',
    'lesen', 'hören', 'schauen', 'kaufen', 'verkaufen', 'öffnen',
    'schließen', 'beginnen', 'aufhören', 'ankommen', 'abfahren',
    'einsteigen', 'aussteigen', 'aufstehen', 'hinsetzen', 'nehmen',
    'geben', 'bringen', 'holen', 'verstehen', 'erklären',
    
    // Common nouns
    'Haus', 'Auto', 'Buch', 'Tisch', 'Stuhl', 'Tür', 'Fenster',
    'Wasser', 'Essen', 'Zeit', 'Tag', 'Nacht', 'Jahr', 'Monat',
    'Woche', 'Stunde', 'Minute', 'Person', 'Mann', 'Frau', 'Kind',
    'Junge', 'Mädchen', 'Familie', 'Freund', 'Arbeit', 'Schule',
    'Stadt', 'Land', 'Welt', 'Leben', 'Tod', 'Liebe', 'Geld',
    'Problem', 'Lösung', 'Frage', 'Antwort', 'Geschichte',
    'Musik', 'Film', 'Spiel', 'Sport', 'Tier', 'Hund', 'Katze',
    'Vogel', 'Baum', 'Blume', 'Farbe', 'Zahl', 'Wort', 'Satz',
    
    // Adjectives
    'gut', 'schlecht', 'groß', 'klein', 'neu', 'alt', 'jung',
    'hoch', 'niedrig', 'lang', 'kurz', 'breit', 'schmal', 'dick',
    'dünn', 'stark', 'schwach', 'schnell', 'langsam', 'leicht',
    'schwer', 'wichtig', 'interessant', 'langweilig', 'glücklich',
    'traurig', 'zufrieden', 'böse', 'müde', 'krank', 'gesund',
    'schön', 'hässlich', 'reich', 'arm', 'voll', 'leer',
    
    // Adverbs
    'sehr', 'mehr', 'weniger', 'auch', 'noch', 'schon', 'immer',
    'nie', 'oft', 'manchmal', 'hier', 'da', 'dort', 'nah', 'weit',
    'oben', 'unten', 'vorn', 'hinten', 'drinnen', 'draußen',
    'heute', 'gestern', 'morgen', 'jetzt', 'dann', 'später',
    'früh', 'spät', 'gut', 'schlecht', 'besser', 'schlechter',
    
    // Numbers
    'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht',
    'neun', 'zehn', 'elf', 'zwölf', 'zwanzig', 'dreißig', 'hundert', 'tausend',
    
    // Colors
    'rot', 'blau', 'grün', 'gelb', 'schwarz', 'weiß', 'grau',
    'rosa', 'lila', 'orange', 'braun',
    
    // Body parts
    'Kopf', 'Gesicht', 'Auge', 'Nase', 'Mund', 'Ohr', 'Hals',
    'Arm', 'Hand', 'Finger', 'Bein', 'Fuß', 'Herz', 'Magen',
    
    // Food
    'Brot', 'Fleisch', 'Fisch', 'Huhn', 'Gemüse', 'Obst', 'Milch',
    'Käse', 'Ei', 'Reis', 'Nudeln', 'Suppe', 'Salat', 'Nachtisch'
  ]
};

/**
 * Get decoy words for a specific language
 * @param language - The target language ('spanish', 'french', 'german')
 * @param count - Number of decoy words to return
 * @param excludeWords - Words to exclude from the decoy pool
 * @returns Array of decoy words
 */
export function getDecoyWords(
  language: 'spanish' | 'french' | 'german',
  count: number = 10,
  excludeWords: string[] = []
): string[] {
  const languagePool = DECOY_WORDS[language] || DECOY_WORDS.spanish;
  const excludeSet = new Set(excludeWords.map(word => word.toLowerCase()));
  
  const availableDecoys = languagePool.filter(
    word => !excludeSet.has(word.toLowerCase())
  );
  
  // Shuffle and return the requested count
  const shuffled = availableDecoys.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Get language key from various language identifiers
 * @param language - Language identifier (can be 'es', 'spanish', 'Spanish', etc.)
 * @returns Normalized language key
 */
export function normalizeLanguage(language: string): 'spanish' | 'french' | 'german' {
  const lang = language.toLowerCase();
  
  if (lang === 'es' || lang === 'spanish' || lang === 'español') {
    return 'spanish';
  } else if (lang === 'fr' || lang === 'french' || lang === 'français') {
    return 'french';
  } else if (lang === 'de' || lang === 'german' || lang === 'deutsch') {
    return 'german';
  }
  
  // Default to Spanish if language not recognized
  return 'spanish';
}