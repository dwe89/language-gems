#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Language configurations
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 70, totalMarks: 50 },
  { level: 'higher', timeLimit: 75, totalMarks: 50 } // Higher: Q1(10) + Q2(15) + Q3(25) = 50 marks
];

// Helper function to get random simple nouns
const getRandomNouns = (count: number) => {
  const nouns = ['book', 'school', 'park', 'friend', 'dog', 'house', 'car', 'tree', 'ball', 'shop', 'game', 'weather', 'food', 'teacher', 'phone', 'music', 'sport', 'beach', 'family', 'computer'];
  const shuffled = nouns.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};


// --- NEW QUESTIONS FOR PAPER 2 ---

// Foundation Writing Questions Template (Paper 2)
const foundationQuestionsPaper2 = [
  // Q1: Photo Description (10 marks) - New Photo, New Instructions
  {
    question_number: 1,
    question_type: 'photo-description',
    title: 'Question 1: Photo Description',
    instructions: 'Look at the photo and write 5 sentences about what the people are doing and how they might feel. Each sentence is worth 2 marks.',
    marks: 10,
    theme: 'Theme 2: Popular culture',
    topic: 'Music, cinema and TV',
    question_data: {
      photoDescription: 'A family having dinner together at home',
      photoUrl: '/images/assessments/family-dinner.jpg',
      sentences: 5,
      marksPerSentence: 2
    }
  },
  
  // Q2: Short Message (10 marks) - New Topic, RANDOM Nouns
  {
    question_number: 2,
    question_type: 'short-message',
    title: 'Question 2: Short Message',
    instructions: 'Write a short message to your friend about your plans for the weekend. Write approximately 50 words. In your message, you must mention all the bullet points.',
    marks: 10,
    word_count_requirement: 50,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    question_data: {
      topic: 'weekend plans',
      wordCount: 50,
      requirements: getRandomNouns(5) // 5 random nouns
    }
  },

  // Q3: Gap Fill (5 marks) - New Sentences, New Options, New Correct Answers
  {
    question_number: 3,
    question_type: 'gap-fill',
    title: 'Question 3: Grammar',
    instructions: 'Complete each sentence by choosing the correct word from the options given.',
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Home and local area',
    question_data: {
      questions: [
        {
          sentence: 'Mi casa ……………… grande.',
          options: ['es', 'son', 'está'],
          correct: 'es'
        },
        {
          sentence: 'Hay un ……………… en el jardín.',
          options: ['árbol', 'árboles', 'árbola'],
          correct: 'árbol'
        },
        {
          sentence: 'Ayer ……………… al cine.',
          options: ['fui', 'va', 'vamos'],
          correct: 'fui'
        },
        {
          sentence: 'Mis padres ……………… trabajadores.',
          options: ['es', 'son', 'somos'],
          correct: 'son'
        },
        {
          sentence: 'Me gusta ……………… música.',
          options: ['escuchar', 'escuchas', 'escucho'],
          correct: 'escuchar'
        }
      ]
    }
  },

  // Q4: Translation (10 marks) - New Sentences
  {
    question_number: 4,
    question_type: 'translation',
    title: 'Question 4: Translation',
    instructions: 'Translate these sentences into Spanish.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Food and drink',
    question_data: {
      sentences: [
        { english: 'I usually eat breakfast at seven o\'clock in the morning.', marks: 2 },
        { english: 'For lunch, I often have a sandwich and an apple.', marks: 2 },
        { english: 'My favourite food is pasta with tomato sauce.', marks: 2 },
        { english: 'Yesterday, I drank a glass of water because I was thirsty.', marks: 2 },
        { english: 'Next week, I am going to try a new Japanese restaurant.', marks: 2 }
      ]
    }
  },

  // Q5: Extended Writing (15 marks) - New Prompt, New Bullet Points
  {
    question_number: 5,
    question_type: 'extended-writing',
    title: 'Question 5: Extended Writing',
    instructions: 'You are writing a blog post about your healthy lifestyle. Write approximately 90 words. You must write something about each bullet point.',
    marks: 15,
    word_count_requirement: 90,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living',
    question_data: {
      prompt: 'Your healthy lifestyle.',
      wordCount: 90,
      bulletPoints: [
        'What you eat and drink to stay healthy (present tense)',
        'What sports or exercise you do (present tense)',
        'What you did last weekend to relax (past tense)'
      ]
    }
  }
];

// Higher Writing Questions Template (Paper 2)
const higherQuestionsPaper2 = [
  // Q1: Translation (10 marks) - Simplified and new sentences
  {
    question_number: 1,
    question_type: 'translation',
    title: 'Question 1: Translation',
    instructions: 'Translate the following sentences into Spanish.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others', // More general topic
    question_data: {
      sentences: [
        { english: 'My best friend is called Emily and she lives near the park.', marks: 2 },
        { english: 'Last weekend I visited my grandparents and we ate pizza.', marks: 2 },
        { english: 'Tomorrow, if the weather is good, I will go to the beach with my family.', marks: 2 },
        { english: 'I think that learning a new language is very interesting and useful.', marks: 2 },
        { english: 'When I was younger, I used to play football every day after school.', marks: 2 }
      ]
    }
  },

  // Q2: Extended Writing (15 marks) - New Prompt, New Bullet Points
  {
    question_number: 2,
    question_type: 'extended-writing',
    title: 'Question 2: Extended Writing',
    instructions: 'You are writing an article for your school magazine about the importance of protecting the environment. Write approximately 90 words. You must write something about each bullet point.',
    marks: 15,
    word_count_requirement: 90,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Environmental issues',
    question_data: {
      prompt: 'The importance of protecting the environment.',
      wordCount: 90,
      bulletPoints: [
        'What environmental problems exist in your area (present tense)',
        'What you do personally to help the environment (present tense)',
        'What more could be done by governments or individuals (conditional/future tense)'
      ]
    }
  },

  // Q3: Advanced Extended Writing (25 marks) - Broader Topic, New Bullet Points
  {
    question_number: 3,
    question_type: 'extended-writing',
    title: 'Question 3: Extended Writing',
    instructions: 'You are writing a post for your school\'s website about the advantages and disadvantages of modern technology. Write approximately 150 words. You must write something about both bullet points.',
    marks: 25,
    word_count_requirement: 150,
    theme: 'Theme 2: Popular culture',
    topic: 'Social media and technology',
    question_data: {
      prompt: 'The advantages and disadvantages of modern technology.',
      wordCount: 150,
      bulletPoints: [
        'Positive aspects of technology (e.g., communication, learning, entertainment)',
        'Negative aspects of technology (e.g., screen time, privacy, fake news)'
      ]
    }
  }
];

// Language-specific question adaptations
const getLanguageSpecificQuestions = (langCode: string, tier: string = 'foundation') => {
  // Use the new Paper 2 templates here
  const baseQuestions = JSON.parse(JSON.stringify(tier === 'foundation' ? foundationQuestionsPaper2 : higherQuestionsPaper2)); // Deep copy
  
  if (tier === 'foundation') {
    // Foundation tier adaptations for Paper 2
    if (langCode === 'fr') {
      baseQuestions[2].question_data.questions = [
        {
          sentence: 'Ma maison ……………… grande.',
          options: ['est', 'sont', 'êtes'],
          correct: 'est'
        },
        {
          sentence: 'Il y a un ……………… dans le jardin.',
          options: ['arbre', 'arbres', 'arbrea'],
          correct: 'arbre'
        },
        {
          sentence: 'Hier je ……………… au cinéma.',
          options: ['suis allé', 'allais', 'vais'],
          correct: 'suis allé' // Past participle agreement (masculine singular implied for 'je')
        },
        {
          sentence: 'Mes parents ……………… travailleurs.',
          options: ['est', 'sont', 'sommes'],
          correct: 'sont'
        },
        {
          sentence: 'J\'aime ……………… de la musique.',
          options: ['écouter', 'écoutes', 'écoute'],
          correct: 'écouter'
        }
      ];

      baseQuestions[3].instructions = 'Translate these sentences into French.';
      baseQuestions[3].question_data.sentences = [
        { english: 'I usually eat breakfast at seven o\'clock in the morning.', marks: 2 },
        { english: 'For lunch, I often have a sandwich and an apple.', marks: 2 },
        { english: 'My favourite food is pasta with tomato sauce.', marks: 2 },
        { english: 'Yesterday, I drank a glass of water because I was thirsty.', marks: 2 },
        { english: 'Next week, I am going to try a new Japanese restaurant.', marks: 2 }
      ];

      baseQuestions[4].instructions = `You are writing a blog post about your healthy lifestyle. Write approximately ${baseQuestions[4].word_count_requirement} words in French. You must write something about each bullet point.`;

    } else if (langCode === 'de') {
      baseQuestions[2].question_data.questions = [
        {
          sentence: 'Mein Haus ……………… groß.',
          options: ['ist', 'sind', 'bin'],
          correct: 'ist'
        },
        {
          sentence: 'Es gibt einen ……………… im Garten.',
          options: ['Baum', 'Bäume', 'Baumes'],
          correct: 'Baum'
        },
        {
          sentence: 'Gestern ……………… ich ins Kino.',
          options: ['ging', 'gehe', 'gehst'],
          correct: 'ging'
        },
        {
          sentence: 'Meine Eltern ……………… fleißig.',
          options: ['ist', 'sind', 'bin'],
          correct: 'sind'
        },
        {
          sentence: 'Ich höre gerne ……………… .',
          options: ['Musik', 'Musiken', 'Musikern'],
          correct: 'Musik'
        }
      ];

      baseQuestions[3].instructions = 'Translate these sentences into German.';
      baseQuestions[3].question_data.sentences = [
        { english: 'I usually eat breakfast at seven o\'clock in the morning.', marks: 2 },
        { english: 'For lunch, I often have a sandwich and an apple.', marks: 2 },
        { english: 'My favourite food is pasta with tomato sauce.', marks: 2 },
        { english: 'Yesterday, I drank a glass of water because I was thirsty.', marks: 2 },
        { english: 'Next week, I am going to try a new Japanese restaurant.', marks: 2 }
      ];

      baseQuestions[4].instructions = `You are writing a blog post about your healthy lifestyle. Write approximately ${baseQuestions[4].word_count_requirement} words in German. You must write something about each bullet point.`;
    }
  } else {
    // Higher tier adaptations for Paper 2
    if (langCode === 'fr') {
      baseQuestions[0].instructions = 'Translate the following sentences into French.';
      baseQuestions[0].question_data.sentences = [
        { english: 'My best friend is called Emily and she lives near the park.', marks: 2 },
        { english: 'Last weekend I visited my grandparents and we ate pizza.', marks: 2 },
        { english: 'Tomorrow, if the weather is good, I will go to the beach with my family.', marks: 2 },
        { english: 'I think that learning a new language is very interesting and useful.', marks: 2 },
        { english: 'When I was younger, I used to play football every day after school.', marks: 2 }
      ];

      baseQuestions[1].instructions = `You are writing an article for your school magazine about the importance of protecting the environment. Write approximately ${baseQuestions[1].word_count_requirement} words in French. You must write something about each bullet point.`;
      baseQuestions[2].instructions = `You are writing a post for your school\'s website about the advantages and disadvantages of modern technology. Write approximately ${baseQuestions[2].word_count_requirement} words in French. You must write something about both bullet points.`;

    } else if (langCode === 'de') {
      baseQuestions[0].instructions = 'Translate the following sentences into German.';
      baseQuestions[0].question_data.sentences = [
        { english: 'My best friend is called Emily and she lives near the park.', marks: 2 },
        { english: 'Last weekend I visited my grandparents and we ate pizza.', marks: 2 },
        { english: 'Tomorrow, if the weather is good, I will go to the beach with my family.', marks: 2 },
        { english: 'I think that learning a new language is very interesting and useful.', marks: 2 },
        { english: 'When I was younger, I used to play football every day after school.', marks: 2 }
      ];

      baseQuestions[1].instructions = `You are writing an article for your school magazine about the importance of protecting the environment. Write approximately ${baseQuestions[1].word_count_requirement} words in German. You must write something about each bullet point.`;
      baseQuestions[2].instructions = `You are writing a post for your school\'s website about the advantages and disadvantages of modern technology. Write approximately ${baseQuestions[2].word_count_requirement} words in German. You must write something about both bullet points.`;
    }
  }
  
  return baseQuestions;
};

async function populateWritingAssessments() {
  try {
    console.log('✍️  Starting AQA Writing Assessment population (incremental mode with NEW questions)...\n');

    const nextPaperNumbers: { [key: string]: number } = {};

    for (const lang of languages) {
      for (const tier of tiers) {
        const { data, error } = await supabase
          .from('aqa_writing_assessments')
          .select('identifier')
          .eq('language', lang.code)
          .eq('level', tier.level)
          .like('identifier', 'paper-%')
          .order('identifier', { ascending: false })
          .limit(1);

        if (error) {
          console.error(`❌ Error fetching existing assessments for ${lang.name} ${tier.level}:`, error);
          continue;
        }

        let highestPaperNum = 0;
        if (data && data.length > 0) {
          const latestIdentifier = data[0].identifier;
          const numMatch = latestIdentifier.match(/paper-(\d+)/);
          if (numMatch && numMatch[1]) {
            highestPaperNum = parseInt(numMatch[1], 10);
          }
        }
        nextPaperNumbers[`${lang.code}-${tier.level}`] = highestPaperNum + 1;
        console.log(`ℹ️ Next available paper for ${lang.name} ${tier.level} will be: Paper ${highestPaperNum + 1}`);
      }
    }
    console.log('\n');

    for (const lang of languages) {
      for (const tier of tiers) {
        const nextPaperNumber = nextPaperNumbers[`${lang.code}-${tier.level}`];
        const newIdentifier = `paper-${nextPaperNumber}`;
        const newTitle = `AQA Writing Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Paper ${nextPaperNumber} (${lang.name})`;
        const newDescription = `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level AQA-style ${lang.name} writing assessment with 5 questions covering all writing skills (Paper ${nextPaperNumber})`;

        console.log(`📝 Creating ${lang.name} ${tier.level} writing assessment: ${newTitle}...`);

        const assessment = {
          title: newTitle,
          description: newDescription,
          level: tier.level,
          language: lang.code,
          identifier: newIdentifier,
          version: '1.0',
          total_questions: tier.level === 'foundation' ? foundationQuestionsPaper2.length : higherQuestionsPaper2.length,
          time_limit_minutes: tier.timeLimit,
          total_marks: tier.totalMarks,
          is_active: true
        };

        const { data: assessmentData, error: assessmentError } = await supabase
          .from('aqa_writing_assessments')
          .insert(assessment)
          .select('id')
          .single();

        if (assessmentError) {
          if (assessmentError.code === '23505') {
            console.warn(`⚠️  Assessment with identifier "${newIdentifier}" for ${lang.name} ${tier.level} already exists. Skipping insertion.`);
          } else {
            console.error(`❌ Error creating ${lang.name} ${tier.level} assessment (${newIdentifier}):`, assessmentError);
          }
          continue;
        }

        console.log(`✅ Created ${lang.name} ${tier.level} assessment: ${assessmentData.id} (Identifier: ${newIdentifier})`);

        const questionsToUse = getLanguageSpecificQuestions(lang.code, tier.level);

        const questionsWithAssessmentId = questionsToUse.map((q: any) => ({
          ...q,
          assessment_id: assessmentData.id,
          difficulty_rating: tier.level === 'foundation' ? 3 : 4
        }));

        const { error: questionsError } = await supabase
          .from('aqa_writing_questions')
          .insert(questionsWithAssessmentId);

        if (questionsError) {
          console.error(`❌ Error inserting ${lang.name} ${tier.level} questions for ${newIdentifier}:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${lang.name} ${tier.level} questions for ${newIdentifier} (${questionsToUse.length} questions)`);
      }
    }

    console.log('\n🎉 AQA Writing Assessment population completed successfully (incremental mode with NEW questions)!');
    console.log('\n📊 Summary:');
    console.log(`- Languages processed: ${languages.length}`);
    console.log(`- Tiers processed: ${tiers.length}`);
    console.log(`- New assessments created based on existing count, using "Paper 2" question set.`);

    const { data: allAssessments } = await supabase
      .from('aqa_writing_assessments')
      .select('language, level, identifier, title')
      .order('language, level, identifier');

    if (allAssessments) {
      console.log('\n📋 Current Assessments in Database:');
      allAssessments.forEach(assessment => {
        console.log(`  - [${assessment.language.toUpperCase()}] ${assessment.level.charAt(0).toUpperCase() + assessment.level.slice(1)}: ${assessment.title} (ID: ${assessment.identifier})`);
      });
    }

  } catch (error) {
    console.error('❌ Error populating writing assessments:', error);
    process.exit(1);
  }
}

// Run the population script
if (require.main === module) {
  populateWritingAssessments()
    .then(() => {
      console.log('\n✅ Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Script failed:', error);
      process.exit(1);
    });
}

export { populateWritingAssessments };