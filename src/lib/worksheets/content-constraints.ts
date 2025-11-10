/**
 * Content Constraint System for Worksheet Generation
 * 
 * This file defines mandatory content requirements for each topic/subtopic
 * to ensure the AI generates appropriate, on-topic reading passages.
 */

export interface ContentConstraint {
  topicKey: string;
  subtopicKey: string;
  displayName: string;
  
  // Mandatory content requirements
  mandatoryTheme: string;
  mustUseVerbs?: string[];
  minVocabUse: number;
  
  // Additional guidance
  exampleSentences?: string[];
  avoidTopics?: string[];
  contentDescription: string;
}

/**
 * Content constraints for KS3 Spanish topics
 */
export const KS3_SPANISH_CONTENT_CONSTRAINTS: ContentConstraint[] = [
  // Identity & Personal Life
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'physical_personality_descriptions',
    displayName: 'Physical Descriptions',
    mandatoryTheme: 'Must describe physical appearance of self and/or 1-2 family members or friends using adjectives',
    mustUseVerbs: ['ser', 'tener', 'llevar'],
    minVocabUse: 6,
    exampleSentences: [
      'Soy alto y tengo el pelo castaño.',
      'Mi hermana es rubia y tiene los ojos azules.',
      'Mi mejor amigo es moreno y lleva gafas.'
    ],
    contentDescription: 'Physical appearance descriptions including hair color, eye color, height, build, and other physical characteristics. Should use ser for permanent characteristics and tener for features like hair/eyes.',
    avoidTopics: ['abstract personality traits without physical descriptions', 'hobbies', 'daily routines']
  },
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'family_friends',
    displayName: 'Family & Friends',
    mandatoryTheme: 'Must describe family members or friends, their names, ages, and relationships',
    mustUseVerbs: ['tener', 'ser', 'llamarse', 'vivir'],
    minVocabUse: 5,
    exampleSentences: [
      'Tengo una hermana que se llama María.',
      'Mi padre tiene cuarenta años.',
      'Mi mejor amigo vive en mi calle.'
    ],
    contentDescription: 'Family structure, friend relationships, basic information about family members including ages, names, and where they live.',
    avoidTopics: ['physical descriptions only', 'hobbies without mentioning people']
  },
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'personal_information',
    displayName: 'Personal Information',
    mandatoryTheme: 'Must introduce yourself with basic personal information (name, age, where you live)',
    mustUseVerbs: ['llamarse', 'tener', 'vivir', 'ser'],
    minVocabUse: 4,
    exampleSentences: [
      'Me llamo Juan y tengo trece años.',
      'Vivo en Madrid con mi familia.',
      'Soy de Inglaterra.'
    ],
    contentDescription: 'Basic personal introductions including name (llamarse), age (tener X años), nationality/origin (ser de), where you live (vivir en).',
    avoidTopics: ['detailed family descriptions', 'hobbies', 'future plans']
  },
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'feelings_emotions',
    displayName: 'Feelings & Emotions',
    mandatoryTheme: 'Must express how you feel or describe emotional states using estar and emotion vocabulary',
    mustUseVerbs: ['estar', 'sentirse', 'ponerse'],
    minVocabUse: 5,
    exampleSentences: [
      'Estoy feliz porque es mi cumpleaños.',
      'Mi hermano está triste hoy.',
      'Me siento nervioso antes de un examen.'
    ],
    contentDescription: 'Emotional states and feelings using estar (temporary states) with emotion adjectives. Can include reasons for feeling that way.',
    avoidTopics: ['physical descriptions without emotions', 'daily routines']
  },
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'relationships',
    displayName: 'Relationships',
    mandatoryTheme: 'Must describe relationships with family, friends, or people you know',
    mustUseVerbs: ['llevarse', 'conocer', 'ser'],
    minVocabUse: 4,
    exampleSentences: [
      'Me llevo bien con mi hermano.',
      'Conozco a mis vecinos desde hace años.',
      'Mi mejor amiga es muy simpática.'
    ],
    contentDescription: 'How you get along with family members, friends, neighbors. Relationships quality and characteristics.',
    avoidTopics: ['romantic relationships for Year 7', 'conflict without resolution']
  },
  {
    topicKey: 'identity_personal_life',
    subtopicKey: 'pets',
    displayName: 'Pets',
    mandatoryTheme: 'Must describe pets (or lack of pets) including type, name, and characteristics',
    mustUseVerbs: ['tener', 'ser', 'llamarse'],
    minVocabUse: 4,
    exampleSentences: [
      'Tengo un perro que se llama Max.',
      'Mi gato es negro y muy perezoso.',
      'No tengo mascotas pero me gustan los perros.'
    ],
    contentDescription: 'Pet ownership, pet names, pet characteristics and behaviors. Can also express desire for pets.',
    avoidTopics: ['wild animals', 'detailed pet care routines']
  },
  
  // Home, Local Area & Environment
  {
    topicKey: 'home_local_area',
    subtopicKey: 'house_home',
    displayName: 'House & Home',
    mandatoryTheme: 'Must describe your house or home including type and rooms',
    mustUseVerbs: ['vivir', 'tener', 'haber', 'estar'],
    minVocabUse: 6,
    exampleSentences: [
      'Vivo en una casa grande con jardín.',
      'Hay tres dormitorios y un salón.',
      'Mi dormitorio está en el primer piso.'
    ],
    contentDescription: 'House type (casa, piso), number and names of rooms, location of rooms, basic features.',
    avoidTopics: ['neighborhood descriptions without house', 'detailed furniture']
  },
  
  // School, Jobs & Future Plans
  {
    topicKey: 'school_jobs_future',
    subtopicKey: 'school_routine',
    displayName: 'School & Routine',
    mandatoryTheme: 'Must describe school subjects, schedule, or typical school day',
    mustUseVerbs: ['estudiar', 'tener', 'ir', 'empezar', 'terminar'],
    minVocabUse: 5,
    exampleSentences: [
      'Estudio matemáticas, inglés y español.',
      'Las clases empiezan a las ocho y media.',
      'Mi asignatura favorita es la educación física.'
    ],
    contentDescription: 'School subjects, class times, school schedule, favorite/least favorite subjects.',
    avoidTopics: ['detailed career plans', 'university plans']
  },
  
  // Free Time & Leisure
  {
    topicKey: 'free_time_leisure',
    subtopicKey: 'hobbies_sports',
    displayName: 'Hobbies & Sports',
    mandatoryTheme: 'Must describe hobbies, sports, or leisure activities you do',
    mustUseVerbs: ['jugar', 'hacer', 'practicar', 'gustar'],
    minVocabUse: 5,
    exampleSentences: [
      'Juego al fútbol los fines de semana.',
      'Me gusta leer libros de aventuras.',
      'Practico la natación en el polideportivo.'
    ],
    contentDescription: 'Sports, hobbies, leisure activities using jugar a (for sports/games), hacer (for activities), gustar (for preferences).',
    avoidTopics: ['professional sports', 'complex hobbies requiring specialized vocabulary']
  },

  // Food & Drink
  {
    topicKey: 'food_drink',
    subtopicKey: 'meals_mealtimes',
    displayName: 'Meals & Mealtimes',
    mandatoryTheme: 'Must describe typical meals, mealtimes, or foods you eat',
    mustUseVerbs: ['comer', 'desayunar', 'tomar', 'gustar'],
    minVocabUse: 6,
    exampleSentences: [
      'Desayuno cereales y leche por la mañana.',
      'Como en el colegio a las doce.',
      'Me gusta la pizza y las patatas fritas.'
    ],
    contentDescription: 'Typical meals (desayuno, almuerzo, cena), what you eat, meal times, food preferences.',
    avoidTopics: ['cooking recipes', 'restaurant experiences', 'formal dining']
  },
  
  // Holidays, Travel & Culture
  {
    topicKey: 'holidays_travel_culture',
    subtopicKey: 'holidays_destinations',
    displayName: 'Holidays & Destinations',
    mandatoryTheme: 'Must describe holidays, where you go, or vacation activities',
    mustUseVerbs: ['ir', 'visitar', 'pasar', 'quedarse'],
    minVocabUse: 5,
    exampleSentences: [
      'Voy a España todos los veranos.',
      'Visitamos la playa y hacemos castillos de arena.',
      'Paso dos semanas con mi familia.'
    ],
    contentDescription: 'Holiday destinations, vacation activities, where you stay, what you do on holidays.',
    avoidTopics: ['detailed travel logistics', 'expensive luxury holidays', 'solo travel']
  }
];

/**
 * Get content constraint for a specific topic/subtopic combination
 */
export function getContentConstraint(
  topicKey: string, 
  subtopicKey?: string
): ContentConstraint | undefined {
  if (!subtopicKey) {
    return undefined;
  }
  
  return KS3_SPANISH_CONTENT_CONSTRAINTS.find(
    constraint => 
      constraint.topicKey === topicKey && 
      constraint.subtopicKey === subtopicKey
  );
}

/**
 * Format content constraint as part of AI prompt
 */
export function formatContentConstraintForPrompt(constraint: ContentConstraint): string {
  const parts: string[] = [];
  
  parts.push(`📝 MANDATORY CONTENT REQUIREMENT FOR "${constraint.displayName.toUpperCase()}":`);
  parts.push(`${constraint.mandatoryTheme}`);
  parts.push('');
  
  if (constraint.mustUseVerbs && constraint.mustUseVerbs.length > 0) {
    parts.push(`⚠️ REQUIRED VERBS: You MUST use these verbs in the text: ${constraint.mustUseVerbs.join(', ')}`);
    parts.push('');
  }
  
  parts.push(`⚠️ MINIMUM VOCABULARY: You MUST include at least ${constraint.minVocabUse} words from the provided vocabulary list.`);
  parts.push('');
  
  parts.push(`📖 CONTENT DESCRIPTION: ${constraint.contentDescription}`);
  parts.push('');
  
  if (constraint.exampleSentences && constraint.exampleSentences.length > 0) {
    parts.push('✅ EXAMPLE SENTENCES (style guidance):');
    constraint.exampleSentences.forEach((example, idx) => {
      parts.push(`   ${idx + 1}. ${example}`);
    });
    parts.push('');
  }
  
  if (constraint.avoidTopics && constraint.avoidTopics.length > 0) {
    parts.push('❌ DO NOT WRITE ABOUT:');
    constraint.avoidTopics.forEach(avoid => {
      parts.push(`   - ${avoid}`);
    });
    parts.push('');
  }
  
  return parts.join('\n');
}
