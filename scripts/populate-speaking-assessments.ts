/**
 * Populate Speaking Assessments
 * 
 * This script creates sample AQA speaking assessments for testing.
 * Run with: npx tsx scripts/populate-speaking-assessments.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// =====================================================
// Types
// =====================================================

interface SpeakingAssessment {
  language: 'es' | 'fr' | 'de';
  level: 'foundation' | 'higher';
  identifier: string;
  title: string;
  description?: string;
  total_marks: number;
  time_limit_minutes: number;
  prep_time_minutes: number;
  is_active: boolean;
}

interface RoleplayTask {
  task_number: number;
  student_prompt_en: string;       // What the student needs to say (in English)
  examiner_question: string;       // The examiner's question (in target language)
  examiner_question_audio_url?: string;  // Pre-generated TTS audio (optional)
  expected_keywords?: string[];    // Keywords to look for in response
}

interface SpeakingQuestion {
  section_number: number;
  question_number: number;
  section_type: 'roleplay' | 'reading_aloud' | 'short_conversation' | 'photocard' | 'general_conversation';
  prompt_text: string;             // Main instruction/scenario
  context_text?: string;           // Additional context
  reading_text?: string;           // For reading aloud
  photo_urls?: string[];           // For photocard
  bullet_points?: string[];        // For photocard
  theme?: string;
  marks: number;
  time_limit_seconds?: number;
  roleplay_tasks?: RoleplayTask[]; // Structured roleplay tasks
}

// =====================================================
// Sample Spanish Foundation Assessment
// =====================================================

const spanishFoundationAssessment: SpeakingAssessment = {
  language: 'es',
  level: 'foundation',
  identifier: 'SP-F-2024-01',
  title: 'Spanish Foundation Speaking Practice 1',
  description: 'Foundation tier speaking assessment covering holidays, school, and free time.',
  total_marks: 60,
  time_limit_minutes: 12,
  prep_time_minutes: 3,
  is_active: true,
};

const spanishFoundationQuestions: SpeakingQuestion[] = [
  // Roleplay - Hotel Reception
  {
    section_number: 1,
    question_number: 1,
    section_type: 'roleplay',
    prompt_text: 'You are at a Spanish hotel. The examiner will play the role of the receptionist and will speak first.',
    context_text: `Situation: You have just arrived at a hotel in Spain and need to book a room.
    
Complete the following tasks:
1. Say hello and ask for a room.
2. Say you want a room for two nights.
3. Ask what time breakfast is.
4. Say thank you and goodbye.`,
    marks: 10,
    time_limit_seconds: 120,
    roleplay_tasks: [
      {
        task_number: 1,
        student_prompt_en: "Say hello and ask for a room.",
        examiner_question: "Buenos días. ¿En qué puedo ayudarle?",
        expected_keywords: ["hola", "buenos días", "habitación", "quiero", "quisiera", "necesito"]
      },
      {
        task_number: 2,
        student_prompt_en: "Say you want a room for two nights.",
        examiner_question: "Muy bien. ¿Para cuántas noches?",
        expected_keywords: ["dos", "noches", "dos noches"]
      },
      {
        task_number: 3,
        student_prompt_en: "Ask what time breakfast is.",
        examiner_question: "Perfecto. Su habitación es la número doce.",
        expected_keywords: ["qué hora", "desayuno", "a qué hora"]
      },
      {
        task_number: 4,
        student_prompt_en: "Say thank you and goodbye.",
        examiner_question: "El desayuno es a las ocho de la mañana.",
        expected_keywords: ["gracias", "adiós", "hasta luego", "muchas gracias"]
      }
    ]
  },
  // Reading Aloud
  {
    section_number: 2,
    question_number: 1,
    section_type: 'reading_aloud',
    prompt_text: 'Read the following passage aloud in Spanish.',
    reading_text: `Me llamo Pedro y tengo dieciséis años. Vivo en Madrid con mi familia. Tengo un hermano mayor que se llama Juan. En mi tiempo libre me gusta jugar al fútbol y escuchar música. Los fines de semana, salgo con mis amigos al cine o al centro comercial. Mi asignatura favorita es la historia porque el profesor es muy simpático.`,
    marks: 10,
    time_limit_seconds: 90,
  },
  // Photocard
  {
    section_number: 3,
    question_number: 1,
    section_type: 'photocard',
    prompt_text: 'Look at the photo and answer the questions.',
    context_text: 'You will be asked to describe the photo and answer follow-up questions about the topic.',
    theme: 'Free time activities',
    photo_urls: ['/images/speaking/photocard-park.jpg'],
    bullet_points: [
      'Describe the photo',
      'What activities do you do in your free time?',
      'What did you do last weekend?',
      'What would you like to do next weekend?'
    ],
    marks: 15,
    time_limit_seconds: 150,
  },
  // General Conversation
  {
    section_number: 4,
    question_number: 1,
    section_type: 'general_conversation',
    prompt_text: 'Have a conversation about school and future plans.',
    theme: 'Current and future study and employment',
    context_text: `You will have a conversation about:
• Your school subjects
• What you like and dislike about school
• Your future plans after school`,
    marks: 25,
    time_limit_seconds: 240,
  },
];

// =====================================================
// Sample Spanish Higher Assessment
// =====================================================

const spanishHigherAssessment: SpeakingAssessment = {
  language: 'es',
  level: 'higher',
  identifier: 'SP-H-2024-01',
  title: 'Spanish Higher Speaking Practice 1',
  description: 'Higher tier speaking assessment with complex scenarios and extended responses.',
  total_marks: 70,
  time_limit_minutes: 15,
  prep_time_minutes: 3,
  is_active: true,
};

const spanishHigherQuestions: SpeakingQuestion[] = [
  // Roleplay - Train Station
  {
    section_number: 1,
    question_number: 1,
    section_type: 'roleplay',
    prompt_text: 'You are at a Spanish train station. The examiner will play the role of the ticket seller.',
    context_text: `Situation: You are buying train tickets at a station in Spain.

Complete the following tasks:
1. Say you want to buy two tickets to Barcelona.
2. Ask how long the journey takes.
3. Ask what platform the train leaves from.
4. Say you would prefer a window seat if possible.
5. ! (Respond to an unexpected question)`,
    marks: 15,
    time_limit_seconds: 150,
    roleplay_tasks: [
      {
        task_number: 1,
        student_prompt_en: "Say you want to buy two tickets to Barcelona.",
        examiner_question: "Buenos días. ¿Qué desea?",
        expected_keywords: ["quisiera", "quiero", "dos billetes", "Barcelona", "por favor"]
      },
      {
        task_number: 2,
        student_prompt_en: "Ask how long the journey takes.",
        examiner_question: "Muy bien. ¿Para hoy?",
        expected_keywords: ["cuánto tiempo", "dura", "viaje", "tarda"]
      },
      {
        task_number: 3,
        student_prompt_en: "Ask what platform the train leaves from.",
        examiner_question: "El viaje dura aproximadamente tres horas.",
        expected_keywords: ["qué andén", "de qué andén", "sale", "tren"]
      },
      {
        task_number: 4,
        student_prompt_en: "Say you would prefer a window seat if possible.",
        examiner_question: "Sale del andén número cinco.",
        expected_keywords: ["preferiría", "me gustaría", "ventana", "asiento", "si es posible"]
      },
      {
        task_number: 5,
        student_prompt_en: "! Respond to the unexpected question.",
        examiner_question: "¿Va a volver el mismo día o va a pasar la noche en Barcelona?",
        expected_keywords: [] // Unprepared - any reasonable response
      }
    ]
  },
  // Reading Aloud
  {
    section_number: 2,
    question_number: 1,
    section_type: 'reading_aloud',
    prompt_text: 'Read the following passage aloud in Spanish.',
    reading_text: `El cambio climático es uno de los problemas más graves que enfrenta nuestro planeta. Cada año, las temperaturas suben y los efectos son devastadores. Sin embargo, hay esperanza. Los jóvenes de todo el mundo están tomando medidas para proteger el medio ambiente. Reciclan, usan transporte público y organizan manifestaciones para concienciar a los políticos. Es imprescindible que actuemos ahora para garantizar un futuro sostenible para las próximas generaciones.`,
    marks: 10,
    time_limit_seconds: 90,
  },
  // Photocard
  {
    section_number: 3,
    question_number: 1,
    section_type: 'photocard',
    prompt_text: 'Look at the photo and answer the questions.',
    context_text: 'You will be asked to describe the photo and answer follow-up questions. Be prepared for questions that require opinions and justifications.',
    theme: 'Environment and social issues',
    photo_urls: ['/images/speaking/photocard-environment.jpg'],
    bullet_points: [
      'Describe the photo in detail',
      'What environmental problems concern you most?',
      'What do you do to help the environment?',
      'What should governments do to tackle climate change?',
      'Do you think young people can make a difference? Why/Why not?'
    ],
    marks: 15,
    time_limit_seconds: 180,
  },
  // General Conversation
  {
    section_number: 4,
    question_number: 1,
    section_type: 'general_conversation',
    prompt_text: 'Have a conversation about social issues and global challenges.',
    theme: 'Global and local issues',
    context_text: `You will have a conversation about:
• Environmental issues in your local area
• Global poverty and inequality
• What can be done to address these problems
• Your personal involvement in social causes`,
    marks: 30,
    time_limit_seconds: 300,
  },
];

// =====================================================
// Sample French Foundation Assessment
// =====================================================

const frenchFoundationAssessment: SpeakingAssessment = {
  language: 'fr',
  level: 'foundation',
  identifier: 'FR-F-2024-01',
  title: 'French Foundation Speaking Practice 1',
  description: 'Foundation tier speaking assessment covering travel, holidays, and daily routine.',
  total_marks: 60,
  time_limit_minutes: 12,
  prep_time_minutes: 3,
  is_active: true,
};

const frenchFoundationQuestions: SpeakingQuestion[] = [
  // Roleplay - Café
  {
    section_number: 1,
    question_number: 1,
    section_type: 'roleplay',
    prompt_text: 'You are at a French café. The examiner will play the role of the waiter.',
    context_text: `Situation: You are ordering food and drink at a café in France.

Complete the following tasks:
1. Greet the waiter and order a drink.
2. Ask for a croque-monsieur.
3. Ask how much it costs.
4. Say thank you and goodbye.`,
    marks: 10,
    time_limit_seconds: 120,
    roleplay_tasks: [
      {
        task_number: 1,
        student_prompt_en: "Greet the waiter and order a drink.",
        examiner_question: "Bonjour! Qu'est-ce que vous désirez?",
        expected_keywords: ["bonjour", "je voudrais", "s'il vous plaît", "un café", "une limonade", "un coca"]
      },
      {
        task_number: 2,
        student_prompt_en: "Ask for a croque-monsieur.",
        examiner_question: "Très bien. Et avec ça?",
        expected_keywords: ["croque-monsieur", "je voudrais", "aussi", "s'il vous plaît"]
      },
      {
        task_number: 3,
        student_prompt_en: "Ask how much it costs.",
        examiner_question: "Voilà votre croque-monsieur.",
        expected_keywords: ["combien", "ça coûte", "c'est combien", "ça fait combien"]
      },
      {
        task_number: 4,
        student_prompt_en: "Say thank you and goodbye.",
        examiner_question: "Ça fait huit euros cinquante.",
        expected_keywords: ["merci", "au revoir", "bonne journée"]
      }
    ]
  },
  // Reading Aloud
  {
    section_number: 2,
    question_number: 1,
    section_type: 'reading_aloud',
    prompt_text: 'Read the following passage aloud in French.',
    reading_text: `Bonjour, je m'appelle Marie et j'ai quinze ans. J'habite à Paris avec ma famille. Nous avons un petit appartement près du centre-ville. Le week-end, j'aime faire du shopping avec mes amies ou aller au cinéma. Mon film préféré est une comédie française. L'été prochain, je vais aller en vacances en Espagne avec mes parents.`,
    marks: 10,
    time_limit_seconds: 90,
  },
  // Photocard
  {
    section_number: 3,
    question_number: 1,
    section_type: 'photocard',
    prompt_text: 'Look at the photo and answer the questions.',
    context_text: 'You will be asked to describe the photo and answer follow-up questions about the topic.',
    theme: 'Daily routine and home life',
    photo_urls: ['/images/speaking/photocard-breakfast.jpg'],
    bullet_points: [
      'Describe the photo',
      'What is your morning routine?',
      'What do you do to help at home?',
      'What did you do at home yesterday?'
    ],
    marks: 15,
    time_limit_seconds: 150,
  },
  // General Conversation
  {
    section_number: 4,
    question_number: 1,
    section_type: 'general_conversation',
    prompt_text: 'Have a conversation about holidays and travel.',
    theme: 'Travel and tourism',
    context_text: `You will have a conversation about:
• Where you went on holiday last year
• What you did on holiday
• Your ideal holiday destination`,
    marks: 25,
    time_limit_seconds: 240,
  },
];

// =====================================================
// Population Script
// =====================================================

async function populateAssessments() {
  console.log('🎤 Starting Speaking Assessment Population...\n');

  const allAssessments = [
    { assessment: spanishFoundationAssessment, questions: spanishFoundationQuestions },
    { assessment: spanishHigherAssessment, questions: spanishHigherQuestions },
    { assessment: frenchFoundationAssessment, questions: frenchFoundationQuestions },
  ];

  for (const { assessment, questions } of allAssessments) {
    console.log(`\n📝 Creating: ${assessment.title}`);

    // Check if assessment already exists
    const { data: existing } = await supabase
      .from('aqa_speaking_assessments')
      .select('id')
      .eq('identifier', assessment.identifier)
      .single();

    if (existing) {
      console.log(`   ⏭️  Already exists, deleting and recreating...`);
      // Delete associated results first (cascades to responses)
      await supabase.from('aqa_speaking_results').delete().eq('assessment_id', existing.id);
      // Delete existing assessment (cascades to questions)
      await supabase.from('aqa_speaking_assessments').delete().eq('id', existing.id);
    }

    // Insert assessment
    const { data: insertedAssessment, error: assessmentError } = await supabase
      .from('aqa_speaking_assessments')
      .insert(assessment)
      .select()
      .single();

    if (assessmentError) {
      console.error(`   ❌ Error creating assessment:`, assessmentError);
      continue;
    }

    console.log(`   ✅ Assessment created: ${insertedAssessment.id}`);

    // Insert questions with proper structure
    const questionsWithAssessmentId = questions.map(q => ({
      assessment_id: insertedAssessment.id,
      section_type: q.section_type,
      section_number: q.section_number,
      question_number: q.question_number,
      prompt_text: q.prompt_text,
      context_text: q.context_text,
      reading_text: q.reading_text,
      photo_urls: q.photo_urls,
      theme: q.theme,
      bullet_points: q.bullet_points,
      marks: q.marks,
      time_limit_seconds: q.time_limit_seconds,
      roleplay_tasks: q.roleplay_tasks,
    }));

    const { error: questionsError } = await supabase
      .from('aqa_speaking_questions')
      .insert(questionsWithAssessmentId);

    if (questionsError) {
      console.error(`   ❌ Error creating questions:`, questionsError);
    } else {
      console.log(`   ✅ ${questions.length} questions created`);
    }
  }

  console.log('\n✨ Speaking Assessment Population Complete!\n');
}

// Run the script
populateAssessments()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
