import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

// Load environment variables
config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Spanish Foundation Assessment Questions Data - Complete 40 Question Set
const spanishFoundationQuestions = [
  // Questions 1-4: Letter Matching - Hobbies
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some Spanish teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Sofía', text: 'Me fascina crear dibujos y pinturas en mi tiempo libre. Siempre llevo mi cuaderno de bocetos.' },
        { name: 'Raúl', text: 'Paso horas tocando la guitarra y componiendo canciones nuevas para mi banda.' },
        { name: 'Elena', text: 'Colecciono monedas antiguas de diferentes países. Tengo más de doscientas.' },
        { name: 'Pablo', text: 'Cultivo tomates y flores en el jardín de mi abuela todos los fines de semana.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Sofía': 'A', 'Raúl': 'E', 'Elena': 'B', 'Pablo': 'D' }
    }
  },
  // Questions 5-9: Multiple Choice - Valencia Travel Guide
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Valencia',
    instructions: 'You read this extract from a travel guide about Valencia. Answer the questions by selecting the correct option.',
    reading_text: 'Valencia es famosa por su impresionante Ciudad de las Artes y las Ciencias, un complejo arquitectónico moderno. Durante el verano, las temperaturas pueden ser muy altas, así que es recomendable visitar los museos con aire acondicionado. La especialidad culinaria más conocida es la paella valenciana, que se prepara tradicionalmente con pollo y verduras. Los restaurantes locales sirven la comida principal entre las dos y las cuatro de la tarde. Para los turistas jóvenes, la playa de la Malvarrosa ofrece deportes acuáticos y discotecas nocturnas.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        {
          question: 'What is Valencia famous for?',
          options: ['A. Ancient castles', 'B. City of Arts and Sciences', 'C. Mountain views'],
          correct: 'B'
        },
        {
          question: 'What should you do during hot summer weather?',
          options: ['A. Visit air-conditioned museums', 'B. Stay at the beach all day', 'C. Eat more paella'],
          correct: 'A'
        },
        {
          question: 'What is traditional Valencian paella made with?',
          options: ['A. Seafood and rice', 'B. Chicken and vegetables', 'C. Beef and potatoes'],
          correct: 'B'
        },
        {
          question: 'When do local restaurants serve the main meal?',
          options: ['A. Between 12-2pm', 'B. Between 2-4pm', 'C. Between 6-8pm'],
          correct: 'B'
        },
        {
          question: 'What does Malvarrosa beach offer young tourists?',
          options: ['A. Quiet relaxation', 'B. Family restaurants', 'C. Water sports and nightlife'],
          correct: 'C'
        }
      ]
    }
  },
  {
    question_number: 10,
    question_type: 'student-grid',
    title: 'Questions 10-15: Weekend activities',
    instructions: 'You see an online forum. Some Spanish students are describing their weekend activities. Answer the following questions. Write L for Lucía, D for Diego, I for Isabel.',
    marks: 6,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: ['L', 'D', 'I'],
      studentTexts: [
        {
          name: 'Lucía',
          text: 'Los fines de semana me levanto temprano para ir al gimnasio. Después voy al centro comercial con mis amigas para comprar ropa nueva. Por la noche, prefiero quedarme en casa viendo series en Netflix.'
        },
        {
          name: 'Diego', 
          text: 'No me gusta hacer ejercicio los sábados. Prefiero dormir hasta tarde y luego cocinar algo especial para mi familia. También me encanta leer novelas de aventuras en mi habitación.'
        },
        {
          name: 'Isabel',
          text: 'Los domingos siempre voy a la piscina municipal para nadar. Es mi deporte favorito desde pequeña. Después ayudo a mi madre en el jardín plantando flores y verduras.'
        }
      ],
      questions: [
        { question: 'Who dislikes exercising on weekends?', correct: 'D' },
        { question: 'Who gets up early on weekends?', correct: 'L' },
        { question: 'Who likes shopping for clothes?', correct: 'L' },
        { question: 'Who enjoys cooking for family?', correct: 'D' },
        { question: 'Who likes swimming?', correct: 'I' },
        { question: 'Who helps with gardening?', correct: 'I' }
      ]
    }
  },
  // Add more questions here - this is just a sample
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { spanish: 'Mi hermana pequeña tiene ocho años y le gusta bailar.', marks: 2, questionNumber: '40.1' },
        { spanish: 'Ayer comimos pizza en un restaurante italiano muy bueno.', marks: 2, questionNumber: '40.2' },
        { spanish: 'El próximo verano vamos a visitar a nuestros primos en Madrid.', marks: 2, questionNumber: '40.3' },
        { spanish: 'Me duele la cabeza porque estudié hasta muy tarde anoche.', marks: 2, questionNumber: '40.4' },
        { spanish: 'Si llueve mañana, no podremos ir a la playa con nuestros amigos.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

// French Foundation Assessment Questions Data
const frenchFoundationQuestions = [
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some French teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Marie', text: 'J\'adore dessiner et peindre pendant mon temps libre. Je porte toujours mon carnet de croquis.' },
        { name: 'Pierre', text: 'Je passe des heures à jouer de la guitare et à composer de nouvelles chansons pour mon groupe.' },
        { name: 'Camille', text: 'Je collectionne des pièces de monnaie anciennes de différents pays. J\'en ai plus de deux cents.' },
        { name: 'Lucas', text: 'Je cultive des tomates et des fleurs dans le jardin de ma grand-mère tous les week-ends.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Marie': 'A', 'Pierre': 'E', 'Camille': 'B', 'Lucas': 'D' }
    }
  },
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Lyon',
    instructions: 'You read this extract from a travel guide about Lyon. Answer the questions by selecting the correct option.',
    reading_text: 'Lyon est célèbre pour sa magnifique vieille ville, un site du patrimoine mondial de l\'UNESCO. Pendant l\'été, les températures peuvent être très élevées, il est donc conseillé de visiter les musées climatisés. La spécialité culinaire la plus connue est la quenelle lyonnaise, qui se prépare traditionnellement avec du brochet et de la sauce Nantua. Les restaurants locaux servent le repas principal entre midi et quatorze heures. Pour les jeunes touristes, les berges du Rhône offrent des activités nautiques et des bars nocturnes.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        {
          question: 'What is Lyon famous for?',
          options: ['A. Modern buildings', 'B. UNESCO World Heritage old town', 'C. Mountain views'],
          correct: 'B'
        },
        {
          question: 'What should you do during hot summer weather?',
          options: ['A. Visit air-conditioned museums', 'B. Stay by the river all day', 'C. Eat more quenelles'],
          correct: 'A'
        },
        {
          question: 'What is traditional Lyon quenelle made with?',
          options: ['A. Chicken and cream', 'B. Pike and Nantua sauce', 'C. Beef and vegetables'],
          correct: 'B'
        },
        {
          question: 'When do local restaurants serve the main meal?',
          options: ['A. Between 11am-1pm', 'B. Between 12pm-2pm', 'C. Between 1pm-3pm'],
          correct: 'B'
        },
        {
          question: 'What do the Rhône riverbanks offer young tourists?',
          options: ['A. Quiet relaxation', 'B. Family restaurants', 'C. Water activities and nightlife'],
          correct: 'C'
        }
      ]
    }
  },
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { french: 'Ma petite sœur a huit ans et elle aime danser.', marks: 2, questionNumber: '40.1' },
        { french: 'Hier nous avons mangé une pizza dans un très bon restaurant italien.', marks: 2, questionNumber: '40.2' },
        { french: 'L\'été prochain nous allons rendre visite à nos cousins à Paris.', marks: 2, questionNumber: '40.3' },
        { french: 'J\'ai mal à la tête parce que j\'ai étudié très tard hier soir.', marks: 2, questionNumber: '40.4' },
        { french: 'S\'il pleut demain, nous ne pourrons pas aller à la plage avec nos amis.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

// German Foundation Assessment Questions Data
const germanFoundationQuestions = [
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some German teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Anna', text: 'Ich liebe es, in meiner Freizeit zu zeichnen und zu malen. Ich trage immer mein Skizzenbuch bei mir.' },
        { name: 'Max', text: 'Ich verbringe Stunden damit, Gitarre zu spielen und neue Lieder für meine Band zu komponieren.' },
        { name: 'Lisa', text: 'Ich sammle alte Münzen aus verschiedenen Ländern. Ich habe mehr als zweihundert.' },
        { name: 'Tom', text: 'Ich baue Tomaten und Blumen in Omas Garten an, jeden Wochenende.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Anna': 'A', 'Max': 'E', 'Lisa': 'B', 'Tom': 'D' }
    }
  },
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Munich',
    instructions: 'You read this extract from a travel guide about Munich. Answer the questions by selecting the correct option.',
    reading_text: 'München ist berühmt für sein beeindruckendes Oktoberfest, das größte Volksfest der Welt. Während des Sommers können die Temperaturen sehr hoch sein, daher ist es ratsam, die klimatisierten Museen zu besuchen. Die bekannteste kulinarische Spezialität ist die Weißwurst, die traditionell mit süßem Senf und Brezeln serviert wird. Die örtlichen Restaurants servieren das Hauptgericht zwischen zwölf und vierzehn Uhr. Für junge Touristen bietet der Englische Garten Freizeitaktivitäten und Biergärten.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        {
          question: 'What is Munich famous for?',
          options: ['A. Modern architecture', 'B. Oktoberfest festival', 'C. Mountain skiing'],
          correct: 'B'
        },
        {
          question: 'What should you do during hot summer weather?',
          options: ['A. Visit air-conditioned museums', 'B. Stay in beer gardens all day', 'C. Eat more sausages'],
          correct: 'A'
        },
        {
          question: 'What is Weißwurst traditionally served with?',
          options: ['A. Sauerkraut and potatoes', 'B. Sweet mustard and pretzels', 'C. Bread and butter'],
          correct: 'B'
        },
        {
          question: 'When do local restaurants serve the main meal?',
          options: ['A. Between 11am-1pm', 'B. Between 12pm-2pm', 'C. Between 1pm-3pm'],
          correct: 'B'
        },
        {
          question: 'What does the English Garden offer young tourists?',
          options: ['A. Quiet study areas', 'B. Shopping centers', 'C. Leisure activities and beer gardens'],
          correct: 'C'
        }
      ]
    }
  },
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { german: 'Meine kleine Schwester ist acht Jahre alt und tanzt gern.', marks: 2, questionNumber: '40.1' },
        { german: 'Gestern haben wir Pizza in einem sehr guten italienischen Restaurant gegessen.', marks: 2, questionNumber: '40.2' },
        { german: 'Nächsten Sommer werden wir unsere Cousins in Berlin besuchen.', marks: 2, questionNumber: '40.3' },
        { german: 'Mir tut der Kopf weh, weil ich gestern Abend sehr spät gelernt habe.', marks: 2, questionNumber: '40.4' },
        { german: 'Wenn es morgen regnet, können wir nicht mit unseren Freunden an den Strand gehen.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

async function populateAssessments() {
  try {
    console.log('🚀 Starting AQA Reading Assessment population...');

    // Define languages and their question sets
    const languages = [
      { code: 'es', name: 'Spanish', questions: spanishFoundationQuestions },
      { code: 'fr', name: 'French', questions: frenchFoundationQuestions },
      { code: 'de', name: 'German', questions: germanFoundationQuestions }
    ];

    // Define multiple papers per level (for future expansion)
    const papers = [
      { identifier: 'paper-1', suffix: 'Paper 1' }
      // Can add more papers later: { identifier: 'paper-2', suffix: 'Paper 2' }, etc.
    ];

    for (const lang of languages) {
      console.log(`\n📚 Creating ${lang.name} assessments...`);

      for (const paper of papers) {
        // Create Foundation Assessment
        const foundationAssessment = {
          title: `AQA Reading Assessment - Foundation ${paper.suffix} (${lang.name})`,
          description: `Foundation level AQA-style ${lang.name} reading assessment with 40 questions covering all GCSE themes`,
          level: 'foundation',
          language: lang.code,
          identifier: paper.identifier,
          version: '1.0',
          total_questions: 40,
          time_limit_minutes: 45,
          is_active: true
        };

        const { data: foundationData, error: foundationError } = await supabase
          .from('aqa_reading_assessments')
          .upsert(foundationAssessment)
          .select('id')
          .single();

        if (foundationError) {
          console.error(`Error creating ${lang.name} foundation ${paper.suffix}:`, foundationError);
          continue;
        }

        console.log(`✅ Created ${lang.name} foundation ${paper.suffix}:`, foundationData.id);

        // Create Higher Assessment
        const higherAssessment = {
          title: `AQA Reading Assessment - Higher ${paper.suffix} (${lang.name})`,
          description: `Higher level AQA-style ${lang.name} reading assessment with 40 questions and advanced analytical tasks`,
          level: 'higher',
          language: lang.code,
          identifier: paper.identifier,
          version: '1.0',
          total_questions: 40,
          time_limit_minutes: 60,
          is_active: true
        };

        const { data: higherData, error: higherError } = await supabase
          .from('aqa_reading_assessments')
          .upsert(higherAssessment)
          .select('id')
          .single();

        if (higherError) {
          console.error(`Error creating ${lang.name} higher ${paper.suffix}:`, higherError);
          continue;
        }

        console.log(`✅ Created ${lang.name} higher ${paper.suffix}:`, higherData.id);

        // Insert Foundation Questions
        const foundationQuestionsWithAssessmentId = lang.questions.map((q: any) => ({
          ...q,
          assessment_id: foundationData.id,
          difficulty_rating: 3
        }));

        const { error: questionsError } = await supabase
          .from('aqa_reading_questions')
          .upsert(foundationQuestionsWithAssessmentId);

        if (questionsError) {
          console.error(`Error inserting ${lang.name} foundation questions:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${lang.name} foundation questions`);

        // For higher level, use the same questions but with higher difficulty rating
        const higherQuestionsWithAssessmentId = lang.questions.map((q: any) => ({
          ...q,
          assessment_id: higherData.id,
          difficulty_rating: 4
        }));

        const { error: higherQuestionsError } = await supabase
          .from('aqa_reading_questions')
          .upsert(higherQuestionsWithAssessmentId);

        if (higherQuestionsError) {
          console.error(`Error inserting ${lang.name} higher questions:`, higherQuestionsError);
          continue;
        }

        console.log(`✅ Inserted ${lang.name} higher questions`);
      }
    }

    console.log('\n🎉 AQA Reading Assessment population completed successfully!');

  } catch (error) {
    console.error('❌ Error populating assessments:', error);
  }
}

// Run the population script
if (require.main === module) {
  populateAssessments().then(() => {
    console.log('Script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });
}

export { populateAssessments };
