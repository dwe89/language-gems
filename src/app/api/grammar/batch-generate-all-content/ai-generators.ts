// Comprehensive Spanish grammar content generators
import {
  generateVerbExercisesComprehensive,
  generateNounExercisesComprehensive,
  generateAdjectiveExercisesComprehensive,
  generatePronounExercisesComprehensive,
  generatePrepositionExercisesComprehensive,
  generateGenericExercisesComprehensive,
  generateVerbQuestionsComprehensive,
  generateNounQuestionsComprehensive,
  generateAdjectiveQuestionsComprehensive,
  generatePronounQuestionsComprehensive,
  generatePrepositionQuestionsComprehensive,
  generateGenericQuestionsComprehensive
} from './comprehensive-generators';

export async function generatePracticeContentWithAI(topic: any) {
  // Generate comprehensive Spanish grammar content without AI dependency
  console.log(`Generating practice content for ${topic.slug} in category ${topic.category}`);

  try {
    const exercises = generateComprehensiveExercises(topic);

    return {
      title: `${topic.name} Practice`,
      content_data: {
        exercises: exercises,
        practice_type: 'mixed_exercises',
        instructions: `Practice ${topic.name.toLowerCase()} with these interactive exercises.`,
        estimated_duration: 15
      },
      difficulty_level: determineDifficulty(topic.category, topic.slug),
      age_group: '11-14',
      estimated_duration: 15
    };

  } catch (error) {
    console.error(`Content generation failed for ${topic.slug}:`, error);
    // Fallback to static content
    return generateStaticPracticeContent(topic);
  }
}

export async function generateQuizContentWithAI(topic: any) {
  // Generate comprehensive Spanish grammar quiz content
  console.log(`Generating quiz content for ${topic.slug} in category ${topic.category}`);

  try {
    const questions = generateComprehensiveQuestions(topic);

    return {
      title: `${topic.name} Quiz`,
      content_data: {
        questions: questions,
        quiz_type: 'mixed_assessment',
        time_limit: 1200,
        instructions: `Test your knowledge of ${topic.name.toLowerCase()}.`,
        passing_score: 70,
        show_explanations: true,
        randomize_questions: true,
        max_attempts: 3
      },
      difficulty_level: determineDifficulty(topic.category, topic.slug),
      age_group: '11-14',
      estimated_duration: 10
    };

  } catch (error) {
    console.error(`Quiz generation failed for ${topic.slug}:`, error);
    // Fallback to static content
    return generateStaticQuizContent(topic);
  }
}

function getTopicContext(category: string, name: string): string {
  const contexts = {
    'verbs': {
      'present-tense': 'Regular and irregular verb conjugations in present tense, including -ar, -er, -ir verbs',
      'preterite': 'Past tense conjugations, regular and irregular forms, usage contexts',
      'imperfect': 'Imperfect tense formation and usage, vs preterite distinctions',
      'future': 'Future tense formation, regular and irregular stems',
      'conditional': 'Conditional mood formation and usage',
      'subjunctive': 'Present subjunctive formation and usage contexts',
      'ser-vs-estar': 'Differences between ser and estar, usage rules and contexts'
    },
    'nouns': {
      'gender': 'Masculine and feminine noun identification, rules and exceptions',
      'plurals': 'Plural formation rules, regular and irregular forms',
      'articles': 'Definite and indefinite articles, agreement with nouns'
    },
    'adjectives': {
      'agreement': 'Adjective-noun agreement in gender and number',
      'position': 'Adjective placement rules, meaning changes',
      'comparison': 'Comparative and superlative forms'
    },
    'pronouns': {
      'direct-object': 'Direct object pronoun forms and placement',
      'indirect-object': 'Indirect object pronoun forms and usage',
      'reflexive': 'Reflexive pronoun forms and usage'
    }
  };

  const categoryContext = contexts[category as keyof typeof contexts];
  if (categoryContext && typeof categoryContext === 'object') {
    return categoryContext[name as keyof typeof categoryContext] || `Spanish ${category} grammar focusing on ${name}`;
  }
  
  return `Spanish ${category} grammar focusing on ${name}`;
}

function determineDifficulty(category: string, slug: string): 'beginner' | 'intermediate' | 'advanced' {
  // Basic topics
  if (slug.includes('present-tense') || slug.includes('articles') || slug.includes('gender') || 
      slug.includes('plurals') || slug.includes('subject')) {
    return 'beginner';
  }
  
  // Advanced topics
  if (slug.includes('subjunctive') || slug.includes('conditional') || slug.includes('pluperfect') ||
      slug.includes('nominalisation') || slug.includes('relative') || slug.includes('reported-speech')) {
    return 'advanced';
  }
  
  // Default to intermediate
  return 'intermediate';
}

// Fallback static content generators
function generateStaticPracticeContent(topic: any) {
  return {
    title: `${topic.name} Practice`,
    content_data: {
      exercises: [
        {
          type: 'fill_blank',
          instructions: `Complete the sentences using ${topic.name.toLowerCase()}`,
          prompts: [
            { 
              sentence: 'This is a practice exercise for _____', 
              answer: topic.name.toLowerCase(), 
              explanation: `Example of ${topic.name.toLowerCase()} usage` 
            }
          ]
        }
      ],
      practice_type: 'mixed_exercises',
      instructions: `Practice ${topic.name.toLowerCase()} with these interactive exercises.`,
      estimated_duration: 15
    },
    difficulty_level: determineDifficulty(topic.category, topic.slug),
    age_group: '11-14',
    estimated_duration: 15
  };
}

function generateStaticQuizContent(topic: any) {
  return {
    title: `${topic.name} Quiz`,
    content_data: {
      questions: [
        {
          question_text: `Which statement about ${topic.name.toLowerCase()} is correct?`,
          correct_answer: 'Statement A',
          options: ['Statement A', 'Statement B', 'Statement C', 'Statement D'],
          explanation: `This demonstrates the correct understanding of ${topic.name.toLowerCase()}`
        }
      ],
      quiz_type: 'mixed_assessment',
      time_limit: 1200,
      instructions: `Test your knowledge of ${topic.name.toLowerCase()}.`,
      passing_score: 70,
      show_explanations: true,
      randomize_questions: true,
      max_attempts: 3
    },
    difficulty_level: determineDifficulty(topic.category, topic.slug),
    age_group: '11-14',
    estimated_duration: 10
  };
}

function generateComprehensiveExercises(topic: any) {
  const exercises = [];
  const category = topic.category;
  const slug = topic.slug;
  const name = topic.name;

  if (category === 'verbs') {
    exercises.push(...generateVerbExercisesComprehensive(name, slug));
  } else if (category === 'nouns') {
    exercises.push(...generateNounExercisesComprehensive(name, slug));
  } else if (category === 'adjectives') {
    exercises.push(...generateAdjectiveExercisesComprehensive(name, slug));
  } else if (category === 'pronouns') {
    exercises.push(...generatePronounExercisesComprehensive(name, slug));
  } else if (category === 'prepositions') {
    exercises.push(...generatePrepositionExercisesComprehensive(name, slug));
  } else {
    exercises.push(...generateGenericExercisesComprehensive(name, slug, category));
  }

  // Ensure we have exactly 30 exercises
  while (exercises.length < 30) {
    exercises.push(...generateGenericExercisesComprehensive(name, slug, category));
  }

  return exercises.slice(0, 30);
}

function generateComprehensiveQuestions(topic: any) {
  const questions = [];
  const category = topic.category;
  const slug = topic.slug;
  const name = topic.name;

  if (category === 'verbs') {
    questions.push(...generateVerbQuestionsComprehensive(name, slug));
  } else if (category === 'nouns') {
    questions.push(...generateNounQuestionsComprehensive(name, slug));
  } else if (category === 'adjectives') {
    questions.push(...generateAdjectiveQuestionsComprehensive(name, slug));
  } else if (category === 'pronouns') {
    questions.push(...generatePronounQuestionsComprehensive(name, slug));
  } else if (category === 'prepositions') {
    questions.push(...generatePrepositionQuestionsComprehensive(name, slug));
  } else {
    questions.push(...generateGenericQuestionsComprehensive(name, slug, category));
  }

  // Ensure we have exactly 20 questions
  while (questions.length < 20) {
    questions.push(...generateGenericQuestionsComprehensive(name, slug, category));
  }

  return questions.slice(0, 20);
}
