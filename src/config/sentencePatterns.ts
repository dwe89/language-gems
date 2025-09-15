// Comprehensive sentence pattern configurations for different topics and subcategories
export interface SentencePattern {
  name: string;
  columns: string[];
  description?: string;
}

export interface TopicPatterns {
  [subcategory: string]: SentencePattern[];
}

export interface PatternDatabase {
  [topic: string]: TopicPatterns;
}

export const SENTENCE_PATTERNS: PatternDatabase = {
  'food_drink': {
    'meals': [
      {
        name: 'Food Preferences',
        description: 'Express likes and dislikes about food',
        columns: [
          'Opinion Starters (e.g., "Me gusta", "No me gusta", "Me encanta", "Odio")',
          'Food Items (e.g., "la pizza", "el chocolate", "las verduras", "la fruta")',
          'Reasons (e.g., "porque es delicioso", "porque es saludable", "porque es dulce")',
          'Time/Frequency (e.g., "siempre", "a veces", "nunca", "todos los días")',
          'Additional Info (e.g., "con mi familia", "en casa", "en el restaurante")'
        ]
      },
      {
        name: 'Meal Times',
        description: 'Describe eating habits at different times',
        columns: [
          'Time Expressions (e.g., "Por la mañana", "A la hora del almuerzo", "Por la noche")',
          'Subject + Verb (e.g., "(yo) como", "(tú) bebes", "(nosotros) preparamos")',
          'Food/Drink (e.g., "cereales", "un bocadillo", "café con leche")',
          'Location (e.g., "en casa", "en el colegio", "en la cafetería")',
          'Opinion (e.g., "y está rico", "pero es rápido", "porque tengo hambre")'
        ]
      }
    ],
    'food_drink_vocabulary': [
      {
        name: 'Food Inventory',
        description: 'Talk about what food you have or need',
        columns: [
          'Possession (e.g., "En casa tengo", "No tengo", "Mi madre compra", "Necesitamos")',
          'Food Items (e.g., "manzanas", "leche", "pan", "queso")',
          'Quantities (e.g., "mucho", "poco", "bastante", "nada de")',
          'Descriptions (e.g., "fresco", "delicioso", "caro", "barato")',
          'Actions (e.g., "para comer", "para cocinar", "para el desayuno")'
        ]
      },
      {
        name: 'Shopping for Food',
        description: 'Express needs and preferences when shopping',
        columns: [
          'Shopping Intentions (e.g., "Voy a comprar", "Necesito", "Quiero", "Me gustaría comprar")',
          'Food Items (e.g., "verduras frescas", "carne", "pescado", "frutas")',
          'Quantities (e.g., "un kilo de", "medio kilo de", "una docena de", "un poco de")',
          'Preferences (e.g., "que esté", "que sea", "que no tenga", "que cueste")',
          'Criteria (e.g., "fresco", "barato", "orgánico", "menos de 5 euros")'
        ]
      }
    ]
  },
  
  'identity_personal_life': {
    'family_friends': [
      {
        name: 'Family Descriptions',
        description: 'Describe family members and their characteristics',
        columns: [
          'Family Members (e.g., "Mi padre", "Mi madre", "Mi hermano", "Mi abuela")',
          'Verb Forms (e.g., "es", "no es", "está", "tiene")',
          'Adjectives (e.g., "alto", "simpático", "trabajador", "divertido")',
          'Additional Info (e.g., "y muy", "pero también", "porque siempre")',
          'Examples (e.g., "me ayuda", "trabaja mucho", "hace deporte")'
        ]
      },
      {
        name: 'Personal Traits',
        description: 'Talk about your own personality and characteristics',
        columns: [
          'Self Reference (e.g., "Soy", "No soy", "Me considero", "Creo que soy")',
          'Personality (e.g., "tímido", "extrovertido", "amable", "gracioso")',
          'Physical (e.g., "alto", "bajo", "moreno", "rubio")',
          'Abilities (e.g., "y sé", "pero no puedo", "porque me gusta")',
          'Activities (e.g., "tocar guitarra", "jugar fútbol", "estudiar mucho")'
        ]
      },
      {
        name: 'Friend Relationships',
        description: 'Describe friendships and social relationships',
        columns: [
          'Friend Reference (e.g., "Mi mejor amigo", "Mis amigos", "Un amigo mío", "Mi compañero")',
          'Relationship Verbs (e.g., "es", "se llama", "vive", "estudia")',
          'Descriptions (e.g., "muy divertido", "súper inteligente", "bastante tímido")',
          'Activities Together (e.g., "y jugamos", "y vamos", "y hablamos", "y estudiamos")',
          'Shared Interests (e.g., "fútbol juntos", "al cine", "de todo", "matemáticas")'
        ]
      }
    ],
    'physical_personality_descriptions': [
      {
        name: 'Appearance & Character',
        description: 'Describe physical appearance and personality together',
        columns: [
          'Subject (e.g., "Mi mejor amigo", "Yo", "Mi profesora", "Mi hermana")',
          'Physical Features (e.g., "tiene el pelo", "es muy", "lleva", "mide")',
          'Descriptions (e.g., "largo y rubio", "alta", "gafas", "1,70 metros")',
          'Personality (e.g., "y es", "pero también es", "además es")',
          'Character Traits (e.g., "muy simpático", "un poco tímido", "súper divertido")'
        ]
      }
    ]
  },

  'school_jobs_future': {
    'school_subjects': [
      {
        name: 'Subject Opinions',
        description: 'Express opinions about different school subjects',
        columns: [
          'Opinion Starters (e.g., "Me gusta", "Odio", "Me encanta", "No soporto")',
          'School Subjects (e.g., "las matemáticas", "la historia", "el inglés", "las ciencias")',
          'Reasons (e.g., "porque es fácil", "porque es interesante", "porque es útil")',
          'Frequency (e.g., "siempre", "a veces", "nunca", "normalmente")',
          'Context (e.g., "en clase", "con mi profesor", "cuando hago deberes", "en los exámenes")'
        ]
      },
      {
        name: 'Academic Performance',
        description: 'Talk about how well you do in different subjects',
        columns: [
          'Subject Reference (e.g., "En matemáticas", "En historia", "En inglés", "En ciencias")',
          'Performance (e.g., "soy bueno", "tengo dificultades", "saco buenas notas", "necesito ayuda")',
          'Reasons (e.g., "porque estudio mucho", "porque es difícil", "porque me gusta")',
          'Actions (e.g., "y hago", "pero necesito", "así que voy a")',
          'Solutions (e.g., "muchos ejercicios", "estudiar más", "pedir ayuda al profesor")'
        ]
      }
    ]
  },

  'free_time_leisure': {
    'hobbies_interests': [
      {
        name: 'Hobby Preferences',
        description: 'Talk about leisure activities and hobbies',
        columns: [
          'Time Expressions (e.g., "En mi tiempo libre", "Los fines de semana", "Después del colegio")',
          'Preferences (e.g., "me gusta", "prefiero", "me encanta", "no me gusta")',
          'Activities (e.g., "leer libros", "jugar videojuegos", "hacer deporte", "escuchar música")',
          'Reasons (e.g., "porque es relajante", "porque es divertido", "porque es emocionante")',
          'Social Context (e.g., "solo", "con amigos", "con mi familia", "en grupo")'
        ]
      }
    ]
  }
};

// Default fallback pattern for topics not yet configured
export const DEFAULT_PATTERN: SentencePattern = {
  name: 'General Structure',
  description: 'A flexible general-purpose sentence pattern',
  columns: [
    'Time/Frequency (e.g., "A veces", "Normalmente", "Nunca", "Siempre")',
    'Subject + Verb (e.g., "(yo) tengo", "(tú) eres", "(nosotros) vamos")',
    'Object/Complement (e.g., "un perro", "muy alto", "al parque")',
    'Location/Context (e.g., "en casa", "con amigos", "los fines de semana")',
    'Opinion/Reason (e.g., "y me gusta", "porque es divertido", "pero es difícil")'
  ]
};

// Helper function to get patterns for a topic/subcategory
export function getSentencePatterns(topic: string, subcategory?: string): SentencePattern[] {
  const topicPatterns = SENTENCE_PATTERNS[topic];
  
  if (!topicPatterns) {
    return [DEFAULT_PATTERN];
  }
  
  if (subcategory && topicPatterns[subcategory]) {
    return topicPatterns[subcategory];
  }
  
  // Return first available subcategory patterns if specific subcategory not found
  const firstSubcategory = Object.keys(topicPatterns)[0];
  return topicPatterns[firstSubcategory] || [DEFAULT_PATTERN];
}

// Helper function to randomly select a pattern
export function selectRandomPattern(patterns: SentencePattern[]): SentencePattern {
  return patterns[Math.floor(Math.random() * patterns.length)];
}
