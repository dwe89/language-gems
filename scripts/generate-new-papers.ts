import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Language configurations
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 45 },
  { level: 'higher', timeLimit: 60 }
];

async function getNextPaperNumber(language: string, level: string): Promise<number> {
  const { data: existingAssessments } = await supabase
    .from('aqa_reading_assessments')
    .select('identifier')
    .eq('language', language)
    .eq('level', level)
    .like('identifier', 'paper-%');

  if (!existingAssessments || existingAssessments.length === 0) {
    return 1;
  }

  // Extract paper numbers and find the highest
  const paperNumbers = existingAssessments
    .map(assessment => {
      const match = assessment.identifier.match(/paper-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);

  return Math.max(...paperNumbers) + 1;
}

// Generate Spanish questions for a specific paper - ALL 40 QUESTIONS
function generateSpanishQuestions(paperNumber: number, assessmentId: string, level: string) {
  const cities = ['Malaga', 'Seville', 'Madrid', 'Bilbao', 'Valencia'];
  const lifestyles = ['vida urbana', 'vida rural', 'vida saludable', 'vida estudiantil', 'vida familiar'];
  const mediaTypes = ['periódico', 'revista', 'red social', 'noticias online', 'blog de viajes'];

  const city = cities[(paperNumber - 1) % cities.length];
  const lifestyle = lifestyles[(paperNumber - 1) % lifestyles.length];
  const mediaType = mediaTypes[(paperNumber - 1) % mediaTypes.length];

  return [
    // Questions 1-4: Letter Matching - Identity and relationships with others (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: 'Questions 1-4: Family and friends',
      instructions: 'Some Spanish teenagers are describing their family members and friends. Which characteristic does each person mention? Write the correct letter in each box.',
      marks: 4,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Identity and relationships with others',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Elena', text: `Mi hermana es muy creativa y siempre está dibujando o pintando. Le encanta el arte.` },
          { name: 'Juan', text: 'Mi mejor amigo es muy deportista. Jugamos al fútbol juntos todos los fines de semana.' },
          { name: 'Laura', text: 'Mi abuela es muy sabia y siempre me da los mejores consejos. Hablamos mucho.' },
          { name: 'David', text: 'Mi padre es muy trabajador. Siempre está ocupado, pero encuentra tiempo para la familia.' }
        ],
        options: [
          { letter: 'A', subject: 'Creative' },
          { letter: 'B', subject: 'Sporty' },
          { letter: 'C', subject: 'Wise' },
          { letter: 'D', subject: 'Hard-working' },
          { letter: 'E', subject: 'Funny' },
          { letter: 'F', subject: 'Quiet' }
        ],
        correctAnswers: { 'Elena': 'A', 'Juan': 'B', 'Laura': 'C', 'David': 'D' }
      }
    },

    // Questions 5-9: Multiple Choice - Healthy living and lifestyle (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: A healthy ${lifestyle}`,
      instructions: `You read this extract from a blog about a healthy ${lifestyle}. Answer the questions by selecting the correct option.`,
      reading_text: `Llevar una ${lifestyle} es más fácil de lo que parece. Es importante comer cinco porciones de frutas y verduras al día. Caminar es un buen ejercicio para empezar, al menos 30 minutos. También es fundamental dormir lo suficiente, entre 7 y 8 horas. Evitar el estrés y pasar tiempo al aire libre son claves para el bienestar mental.`,
      marks: 5,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Healthy living and lifestyle',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'How many portions of fruit and vegetables should you eat daily?', options: ['A. Three', 'B. Four', 'C. Five'], correct: 'C' },
          { question: 'What is a good starting exercise?', options: ['A. Running', 'B. Walking', 'C. Swimming'], correct: 'B' },
          { question: 'How long should you exercise for?', options: ['A. 20 minutes', 'B. 30 minutes', 'C. 40 minutes'], correct: 'B' },
          { question: 'How many hours of sleep are enough?', options: ['A. 6-7 hours', 'B. 7-8 hours', 'C. 8-9 hours'], correct: 'B' },
          { question: 'What is important for mental well-being?', options: ['A. Avoiding friends', 'B. Watching TV', 'C. Avoiding stress and being outdoors'], correct: 'C' }
        ]
      }
    },

    // Questions 10-15: Student Grid - Education and work (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: 'Questions 10-15: After school activities and plans',
      instructions: 'You see an online forum. Some Spanish students are describing what they do after school. Answer the following questions. Write P for Paula, R for Ricardo, S for Silvia.',
      marks: 6,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Education and work',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['P', 'R', 'S'],
        studentTexts: [
          { name: 'Paula', text: 'Después de clase, voy a mi academia de baile tres veces por semana. Quiero ser bailarina profesional. También hago mis deberes por la tarde.' },
          { name: 'Ricardo', text: 'Me gusta ir al gimnasio con mis amigos y luego ver tutoriales de programación en línea. Quiero estudiar informática en la universidad.' },
          { name: 'Silvia', text: 'Por las tardes, ayudo en una tienda de ropa de mi tía. Aprendo mucho sobre el negocio. En el futuro, quiero estudiar diseño de moda.' }
        ],
        questions: [
          { question: 'Who goes to a dance academy?', correct: 'P' },
          { question: 'Who wants to be a professional dancer?', correct: 'P' },
          { question: 'Who goes to the gym with friends?', correct: 'R' },
          { question: 'Who watches programming tutorials?', correct: 'R' },
          { question: 'Who helps in a clothes shop?', correct: 'S' },
          { question: 'Who wants to study fashion design?', correct: 'S' }
        ]
      }
    },

    // Questions 16-20: Open Response - Free-time activities (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: 'Questions 16-20: Hobbies and free time',
      instructions: 'You read this extract from a survey about hobbies. Answer the following questions in English.',
      reading_text: 'En España, los jóvenes disfrutan de una variedad de actividades en su tiempo libre. El deporte es muy popular, especialmente el fútbol y el baloncesto. Muchos también pasan tiempo con amigos, van al cine o escuchan música. La lectura y los videojuegos son otras aficiones comunes. Durante las vacaciones, a muchos les gusta viajar y descubrir nuevos lugares.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Free-time activities',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What two sports are very popular?', expectedWords: 3, acceptableAnswers: ['football and basketball', 'soccer and basketball'] },
          { question: 'Name two things young people do with friends.', expectedWords: 4, acceptableAnswers: ['go to the cinema and listen to music', 'go to the movies and listen to music', 'cinema and music'] },
          { question: 'What are two other common hobbies?', expectedWords: 4, acceptableAnswers: ['reading and video games', 'video games and reading'] },
          { question: 'What do many like to do during holidays?', expectedWords: 2, acceptableAnswers: ['travel', 'to travel'] },
          { question: 'What do they like to discover?', expectedWords: 2, acceptableAnswers: ['new places', 'new places'] }
        ]
      }
    },

    // Questions 21-25: Time Sequence - Customs, festivals and celebrations (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: 'Questions 21-25: Festival celebrations',
      instructions: 'A Spanish person talks about their experiences with festivals. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
      reading_text: `Cada año, mi familia y yo celebramos la Semana Santa en ${city}. Es una tradición muy importante para nosotros. Cuando era niño, siempre me vestía con el traje típico para las procesiones. Este año, estoy ayudando a organizar la música para la procesión principal. El próximo año, espero poder viajar a Pamplona para ver San Fermín, es mi sueño.`,
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Customs, festivals and celebrations',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: [
          { event: 'Celebrating Easter Week annually', correct: 'N' },
          { event: 'Dressing in traditional costume as a child', correct: 'P' },
          { event: 'Helping to organize music for a procession', correct: 'N' },
          { event: 'Travelling to Pamplona', correct: 'F' },
          { event: 'Seeing San Fermín', correct: 'F' }
        ]
      }
    },

    // Questions 26-30: Headline Matching - Celebrity culture (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: 'Questions 26-30: Celebrity news',
      instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Celebrity culture',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: [
          { letter: 'A', text: 'Cantante famosa lanza nuevo álbum' },
          { letter: 'B', text: 'Actor español gana premio internacional' },
          { letter: 'C', text: 'Futbolista abre academia para jóvenes talentos' },
          { letter: 'D', text: 'Chef de televisión publica libro de recetas' },
          { letter: 'E', text: 'Modelo internacional lanza su línea de ropa' },
          { letter: 'F', text: 'Influencer de viajes visita América Latina' }
        ],
        articles: [
          { text: 'La popular cantante Rosalía ha anunciado el lanzamiento de su tercer álbum de estudio para el próximo mes.', correct: 'A' },
          { text: 'El actor Antonio Banderas fue galardonado con el "Premio de Honor" en el Festival de Cine de Cannes.', correct: 'B' },
          { text: 'El famoso futbolista Sergio Ramos inauguró una escuela de fútbol para niños y adolescentes en su ciudad natal.', correct: 'C' },
          { text: 'El conocido chef Karlos Arguiñano presenta su nuevo libro, "Cocina Fácil para Todos", con recetas caseras.', correct: 'D' },
          { text: 'La influencer de viajes, Alexity, comparte sus experiencias explorando los paisajes de Colombia y Perú.', correct: 'F' }
        ]
      }
    },

    // Questions 31-35: Sentence Completion - Travel and tourism, including places of interest (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: 'Questions 31-35: A trip to Spain',
      instructions: 'Complete the sentences based on the text. Write the missing words in English.',
      reading_text: `El verano pasado visité ${city}, una ciudad fantástica en el sur de España. Me encantaron sus playas y el ambiente vibrante. Por la mañana, paseábamos por el centro histórico y visitábamos museos. Por la tarde, disfrutábamos del sol en la playa. Por la noche, cenábamos en restaurantes con vistas al mar. Es un lugar perfecto para las vacaciones.`,
      marks: 5,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Travel and tourism, including places of interest',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { incomplete: `Last summer, I visited _____.`, correct: city },
          { incomplete: 'I loved its _____ and vibrant atmosphere.', correct: 'beaches' },
          { incomplete: 'In the morning, we visited _____.', correct: 'museums' },
          { incomplete: 'In the evening, we had dinner in restaurants with _____ views.', correct: 'sea' },
          { incomplete: 'It is a perfect place for _____.', correct: 'holidays' }
        ]
      }
    },

    // Questions 36-39: Multiple Choice - Media and technology (4 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: 'Questions 36-39: The impact of technology',
      instructions: 'Read this article about media and technology. Answer the questions by selecting the correct option.',
      reading_text: `La tecnología ha transformado la forma en que nos comunicamos. Ahora podemos hablar con personas de todo el mundo en segundos gracias a las ${mediaType}. Los teléfonos inteligentes nos permiten acceder a información y entretenimiento en cualquier lugar. Sin embargo, es importante limitar el tiempo de pantalla para evitar problemas de salud.`,
      marks: 4,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Media and technology',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What has technology transformed?', options: ['A. Our food', 'B. Our communication', 'C. Our travel'], correct: 'B' },
          { question: 'What helps us talk to people globally?', options: ['A. Letters', 'B. Social media', 'C. Books'], correct: 'B' },
          { question: 'What do smartphones give us access to?', options: ['A. Only entertainment', 'B. Information and entertainment', 'C. Only information'], correct: 'B' },
          { question: 'What is important to limit?', options: ['A. Talking time', 'B. Screen time', 'C. Eating time'], correct: 'B' }
        ]
      }
    },

    // Question 40: Translation (10 marks)
    {
      question_number: 40,
      question_type: 'translation',
      title: 'Question 40: Translation',
      instructions: 'Translate these sentences into English.',
      marks: 10,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'The environment and where people live',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { spanish: 'Es importante reciclar para proteger el planeta.', marks: 2, questionNumber: '40.1' },
          { spanish: 'Me gusta mucho vivir cerca de la costa.', marks: 2, questionNumber: '40.2' },
          { spanish: 'Mi casa tiene un jardín grande y soleado.', marks: 2, questionNumber: '40.3' },
          { spanish: 'Debemos reducir el consumo de energía.', marks: 2, questionNumber: '40.4' },
          { spanish: 'El cambio climático es un problema global.', marks: 2, questionNumber: '40.5' }
        ]
      }
    }
  ];
}

// Generate French questions for a specific paper - ALL 40 QUESTIONS
function generateFrenchQuestions(paperNumber: number, assessmentId: string, level: string) {
  const cities = ['Nice', 'Bordeaux', 'Lille', 'Strasbourg', 'Toulouse'];
  const lifestyles = ['vie quotidienne', 'vie familiale', 'vie étudiante', 'vie professionnelle', 'vie saine'];
  const mediaTypes = ['journaux', 'magazines', 'internet', 'radio', 'télévision'];

  const city = cities[(paperNumber - 1) % cities.length];
  const lifestyle = lifestyles[(paperNumber - 1) % lifestyles.length];
  const mediaType = mediaTypes[(paperNumber - 1) % mediaTypes.length];

  return [
    // Questions 1-4: Letter Matching - Identity and relationships with others (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: 'Questions 1-4: Family and friends',
      instructions: 'Some French teenagers are describing their family members and friends. Which characteristic does each person mention? Write the correct letter in each box.',
      marks: 4,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Identity and relationships with others',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Sophie', text: `Mon frère est très gentil et m'aide toujours avec mes devoirs. C'est le meilleur.` },
          { name: 'Lucas', text: 'Ma mère est une excellente cuisinière. Elle prépare les meilleurs plats français.' },
          { name: 'Manon', text: 'Ma meilleure amie est très drôle. Elle me fait rire tout le temps avec ses blagues.' },
          { name: 'Hugo', text: 'Mon grand-père est très passionné par l\'histoire. Il me raconte toujours des anecdotes fascinantes.' }
        ],
        options: [
          { letter: 'A', subject: 'Kind' },
          { letter: 'B', subject: 'Good cook' },
          { letter: 'C', subject: 'Funny' },
          { letter: 'D', subject: 'Passionate about history' },
          { letter: 'E', subject: 'Organized' },
          { letter: 'F', subject: 'Calm' }
        ],
        correctAnswers: { 'Sophie': 'A', 'Lucas': 'B', 'Manon': 'C', 'Hugo': 'D' }
      }
    },

    // Questions 5-9: Multiple Choice - Healthy living and lifestyle (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: A healthy ${lifestyle}`,
      instructions: `You read this extract from a blog about a healthy ${lifestyle}. Answer the questions by selecting the correct option.`,
      reading_text: `Adopter un ${lifestyle} n'est pas compliqué. Il faut manger des fruits et légumes chaque jour et éviter les produits trop gras. Pratiquer un sport régulièrement, comme le vélo ou la natation, est très bénéfique. Il est aussi crucial de boire beaucoup d'eau et de dormir suffisamment, au moins sept heures. La méditation aide à gérer le stress et améliorer le bien-être.`,
      marks: 5,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Healthy living and lifestyle',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What should you eat daily?', options: ['A. Meat and fish', 'B. Fruits and vegetables', 'C. Dairy products'], correct: 'B' },
          { question: 'What should you avoid?', options: ['A. Sugary drinks', 'B. Fatty products', 'C. Protein'], correct: 'B' },
          { question: 'What two sports are beneficial?', options: ['A. Running and boxing', 'B. Cycling and swimming', 'C. Football and tennis'], correct: 'B' },
          { question: 'How many hours of sleep are enough?', options: ['A. At least seven', 'B. At least six', 'C. At least eight'], correct: 'A' },
          { question: 'What helps manage stress?', options: ['A. Watching TV', 'B. Playing video games', 'C. Meditation'], correct: 'C' }
        ]
      }
    },

    // Questions 10-15: Student Grid - Education and work (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: 'Questions 10-15: After school activities and plans',
      instructions: 'You see an online forum. Some French students are describing what they do after school. Answer the following questions. Write C for Clara, T for Thomas, A for Alice.',
      marks: 6,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Education and work',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['C', 'T', 'A'],
        studentTexts: [
          { name: 'Clara', text: 'Après les cours, je vais à mon club de lecture tous les mardis. J\'adore les romans de science-fiction. Je prépare aussi mes examens.' },
          { name: 'Thomas', text: 'Je suis bénévole à la bibliothèque de ma ville le mercredi. J\'aime organiser les livres. Plus tard, je veux être bibliothécaire.' },
          { name: 'Alice', text: 'Je travaille à temps partiel dans un café le week-end pour gagner de l\'argent de poche. J\'apprends à faire du bon café.' }
        ],
        questions: [
          { question: 'Who goes to a book club?', correct: 'C' },
          { question: 'Who loves science-fiction novels?', correct: 'C' },
          { question: 'Who volunteers at the library?', correct: 'T' },
          { question: 'Who wants to be a librarian?', correct: 'T' },
          { question: 'Who works part-time in a café?', correct: 'A' },
          { question: 'Who learns to make good coffee?', correct: 'A' }
        ]
      }
    },

    // Questions 16-20: Open Response - Free-time activities (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: 'Questions 16-20: Hobbies and free time',
      instructions: 'You read this extract from a survey about hobbies. Answer the following questions in English.',
      reading_text: 'En France, les jeunes apprécient diverses activités durant leur temps libre. Le sport est très populaire, surtout le football et le rugby. Beaucoup passent aussi du temps avec des amis, sortent au restaurant ou regardent des films. Les jeux de société et la musique sont d\'autres passions courantes. Pendant les vacances, beaucoup aiment faire du camping et explorer la nature.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Free-time activities',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What two sports are very popular?', expectedWords: 3, acceptableAnswers: ['football and rugby', 'rugby and football'] },
          { question: 'Name two things young people do with friends.', expectedWords: 4, acceptableAnswers: ['go to the restaurant and watch movies', 'eat out and watch movies', 'restaurant and films'] },
          { question: 'What are two other common passions?', expectedWords: 4, acceptableAnswers: ['board games and music', 'music and board games'] },
          { question: 'What do many like to do during holidays?', expectedWords: 2, acceptableAnswers: ['camping', 'go camping'] },
          { question: 'What do they like to explore?', expectedWords: 2, acceptableAnswers: ['nature', 'the nature'] }
        ]
      }
    },

    // Questions 21-25: Time Sequence - Customs, festivals and celebrations (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: 'Questions 21-25: Festival celebrations',
      instructions: 'A French person talks about their experiences with festivals. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
      reading_text: `Chaque année, je célèbre le 14 Juillet à Paris avec mes amis. C'est un jour très spécial pour les Français. Quand j'étais petite, mes parents m'emmenaient toujours voir le défilé militaire. Cette année, je participe à l'organisation du feu d'artifice. L'année prochaine, j'aimerais aller au Carnaval de ${city} pour découvrir une autre ambiance festive.`,
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Customs, festivals and celebrations',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: [
          { event: 'Celebrating Bastille Day annually', correct: 'N' },
          { event: 'Being taken to see the military parade as a child', correct: 'P' },
          { event: 'Participating in organizing the fireworks', correct: 'N' },
          { event: `Going to the Carnival in ${city}`, correct: 'F' },
          { event: 'Discovering another festive atmosphere', correct: 'F' }
        ]
      }
    },

    // Questions 26-30: Headline Matching - Celebrity culture (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: 'Questions 26-30: Celebrity news',
      instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Celebrity culture',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: [
          { letter: 'A', text: 'Actrice française devient ambassadrice de bonne volonté' },
          { letter: 'B', text: 'Chanteur populaire annonce tournée mondiale' },
          { letter: 'C', text: 'Designer de mode ouvre boutique à Paris' },
          { letter: 'D', text: 'Athlète olympique prend sa retraite' },
          { letter: 'E', text: 'Comédien lance sa chaîne YouTube' },
          { letter: 'F', text: 'Écrivaine à succès publie un nouveau roman' }
        ],
        articles: [
          { text: 'La célèbre actrice Marion Cotillard a été nommée ambassadrice de l\'UNICEF pour la protection des enfants.', correct: 'A' },
          { text: 'Le chanteur Stromae a révélé les dates de sa prochaine tournée internationale qui passera par l\'Europe et l\'Amérique.', correct: 'B' },
          { text: 'La styliste française Isabel Marant a inauguré sa nouvelle boutique phare sur l\'avenue Montaigne.', correct: 'C' },
          { text: 'La championne olympique de judo, Clarisse Agbegnenou, a annoncé sa décision de se retirer de la compétition.', correct: 'D' },
          { text: 'L\'écrivaine à succès Leïla Slimani présente son dernier ouvrage, un thriller psychologique très attendu.', correct: 'F' }
        ]
      }
    },

    // Questions 31-35: Sentence Completion - Travel and tourism, including places of interest (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: 'Questions 31-35: A trip to France',
      instructions: 'Complete the sentences based on the text. Write the missing words in English.',
      reading_text: `L'été dernier, j'ai visité ${city}, une ville magnifique sur la Côte d'Azur. J'ai été impressionné par ses plages de galets et son architecture. Le matin, nous explorions la vieille ville et ses marchés. L'après-midi, nous nous baignions dans la mer Méditerranée. Le soir, nous dégustions des plats locaux dans de petits restaurants. C'est un endroit idéal pour se détendre.`,
      marks: 5,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Travel and tourism, including places of interest',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { incomplete: `Last summer, I visited _____.`, correct: city },
          { incomplete: 'I was impressed by its pebble _____ and architecture.', correct: 'beaches' },
          { incomplete: 'In the morning, we explored the old _____ and its markets.', correct: 'town' },
          { incomplete: 'In the afternoon, we swam in the _____ Sea.', correct: 'Mediterranean' },
          { incomplete: 'It is an ideal place to _____.', correct: 'relax' }
        ]
      }
    },

    // Questions 36-39: Multiple Choice - Media and technology (4 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: 'Questions 36-39: The impact of technology',
      instructions: 'Read this article about media and technology. Answer the questions by selecting the correct option.',
      reading_text: `La technologie a radicalement changé nos vies. Nous lisons les nouvelles sur des ${mediaType} en ligne et communiquons par visioconférence. Les applications mobiles nous facilitent la vie au quotidien. Cependant, il faut être vigilant face aux fausses informations et à la cyberintimidation.`,
      marks: 4,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Media and technology',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What has technology radically changed?', options: ['A. Our holidays', 'B. Our lives', 'C. Our food'], correct: 'B' },
          { question: 'Where do we read the news now?', options: ['A. Offline newspapers', 'B. Online newspapers', 'C. Books'], correct: 'B' },
          { question: 'What makes daily life easier?', options: ['A. Computers', 'B. Mobile applications', 'C. Robots'], correct: 'B' },
          { question: 'What should we be vigilant about?', options: ['A. Good information', 'B. False information and cyberbullying', 'C. New technologies'], correct: 'B' }
        ]
      }
    },

    // Question 40: Translation (10 marks)
    {
      question_number: 40,
      question_type: 'translation',
      title: 'Question 40: Translation',
      instructions: 'Translate these sentences into English.',
      marks: 10,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'The environment and where people live',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { french: 'Il faut protéger les animaux en voie de disparition.', marks: 2, questionNumber: '40.1' },
          { french: 'J\'habite dans un appartement au troisième étage.', marks: 2, questionNumber: '40.2' },
          { french: 'Notre ville est très verte avec beaucoup de parcs.', marks: 2, questionNumber: '40.3' },
          { french: 'La pollution est un grand problème dans les grandes villes.', marks: 2, questionNumber: '40.4' },
          { french: 'Nous devons utiliser moins d\'eau et d\'électricité.', marks: 2, questionNumber: '40.5' }
        ]
      }
    }
  ];
}

// Generate German questions for a specific paper - ALL 40 QUESTIONS
function generateGermanQuestions(paperNumber: number, assessmentId: string, level: string) {
  const cities = ['Hamburg', 'Cologne', 'Dresden', 'Frankfurt', 'Stuttgart'];
  const lifestyles = ['Stadtleben', 'Landleben', 'Gesundes Leben', 'Studentenleben', 'Familienleben'];
  const mediaTypes = ['Zeitschriften', 'Blogs', 'Podcasts', 'Soziale Medien', 'Nachrichten-Apps'];

  const city = cities[(paperNumber - 1) % cities.length];
  const lifestyle = lifestyles[(paperNumber - 1) % lifestyles.length];
  const mediaType = mediaTypes[(paperNumber - 1) % mediaTypes.length];

  return [
    // Questions 1-4: Letter Matching - Identity and relationships with others (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: 'Questions 1-4: Family and friends',
      instructions: 'Some German teenagers are describing their family members and friends. Which characteristic does each person mention? Write the correct letter in each box.',
      marks: 4,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Identity and relationships with others',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Sarah', text: `Mein Bruder ist sehr neugierig und stellt immer viele Fragen. Er liebt es zu lernen.` },
          { name: 'Leon', text: 'Meine Schwester ist sehr musikalisch. Sie spielt Geige und singt im Chor.' },
          { name: 'Emilia', text: 'Mein bester Freund ist sehr abenteuerlustig. Wir gehen oft zusammen wandern und klettern.' },
          { name: 'Ben', text: 'Meine Oma ist sehr geduldig und hört mir immer zu. Sie gibt mir gute Ratschläge.' }
        ],
        options: [
          { letter: 'A', subject: 'Curious' },
          { letter: 'B', subject: 'Musical' },
          { letter: 'C', subject: 'Adventurous' },
          { letter: 'D', subject: 'Patient' },
          { letter: 'E', subject: 'Organized' },
          { letter: 'F', subject: 'Reserved' }
        ],
        correctAnswers: { 'Sarah': 'A', 'Leon': 'B', 'Emilia': 'C', 'Ben': 'D' }
      }
    },

    // Questions 5-9: Multiple Choice - Healthy living and lifestyle (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: A healthy ${lifestyle}`,
      instructions: `You read this extract from a blog about a healthy ${lifestyle}. Answer the questions by selecting the correct option.`,
      reading_text: `Ein ${lifestyle} ist für jeden erreichbar. Iss viel Vollkornprodukte und mageres Fleisch. Vermeide zu viel Zucker und Salz. Regelmäßige Bewegung, wie Schwimmen oder Tanzen, ist wichtig für das Herz. Achte auf genug Flüssigkeitszufuhr und reduziere Bildschirmzeit. Positive Gedanken und Zeit mit Freunden fördern die psychische Gesundheit.`,
      marks: 5,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Healthy living and lifestyle',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What two foods should you eat a lot of?', options: ['A. Fast food and sweets', 'B. Whole grains and lean meat', 'C. Cheese and butter'], correct: 'B' },
          { question: 'What two things should you avoid?', options: ['A. Sugar and salt', 'B. Fruits and vegetables', 'C. Water and exercise'], correct: 'A' },
          { question: 'What two activities are good for the heart?', options: ['A. Reading and watching TV', 'B. Swimming and dancing', 'C. Sleeping and eating'], correct: 'B' },
          { question: 'What should you reduce?', options: ['A. Food intake', 'B. Water intake', 'C. Screen time'], correct: 'C' },
          { question: 'What promotes mental health?', options: ['A. Negative thoughts', 'B. Time with friends', 'C. Staying indoors'], correct: 'B' }
        ]
      }
    },

    // Questions 10-15: Student Grid - Education and work (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: 'Questions 10-15: After school activities and plans',
      instructions: 'You see an online forum. Some German students are describing what they do after school. Answer the following questions. Write T for Tim, M for Marie, J for Jonas.',
      marks: 6,
      theme: 'Theme 1: People and lifestyle',
      topic: 'Education and work',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['T', 'M', 'J'],
        studentTexts: [
          { name: 'Tim', text: 'Nach der Schule gehe ich oft in den Park, um Skateboard zu fahren. Ich träume davon, Skateboard-Profi zu werden. Außerdem mache ich Hausaufgaben.' },
          { name: 'Marie', text: 'Ich besuche einen Zeichenkurs am Nachmittag. Ich liebe es, Comics zu zeichnen und möchte später Illustratorin werden.' },
          { name: 'Jonas', text: 'Ich arbeite ehrenamtlich in einem Tierheim am Wochenende. Ich kümmere mich um Hunde und Katzen. Später will ich Tierarzt werden.' }
        ],
        questions: [
          { question: 'Who goes skateboarding?', correct: 'T' },
          { question: 'Who dreams of becoming a professional skateboarder?', correct: 'T' },
          { question: 'Who attends a drawing class?', correct: 'M' },
          { question: 'Who wants to become an illustrator?', correct: 'M' },
          { question: 'Who volunteers at an animal shelter?', correct: 'J' },
          { question: 'Who wants to become a vet?', correct: 'J' }
        ]
      }
    },

    // Questions 16-20: Open Response - Free-time activities (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: 'Questions 16-20: Hobbies and free time',
      instructions: 'You read this extract from a survey about hobbies. Answer the following questions in English.',
      reading_text: 'In Deutschland genießen Jugendliche eine Vielfalt an Freizeitaktivitäten. Computerspiele und das Treffen mit Freunden sind sehr beliebt. Viele besuchen auch Konzerte oder Sportveranstaltungen. Das Hören von Musik und das Anschauen von Filmen sind ebenfalls häufige Hobbys. In den Ferien fahren viele gerne Ski in den Bergen oder entspannen am See.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Free-time activities',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What two activities are very popular?', expectedWords: 4, acceptableAnswers: ['computer games and meeting friends', 'meeting friends and computer games'] },
          { question: 'Name two events many people visit.', expectedWords: 4, acceptableAnswers: ['concerts or sports events', 'sports events or concerts'] },
          { question: 'What are two other common hobbies?', expectedWords: 4, acceptableAnswers: ['listening to music and watching movies', 'watching movies and listening to music'] },
          { question: 'What do many like to do during holidays?', expectedWords: 3, acceptableAnswers: ['ski in the mountains', 'go skiing in the mountains'] },
          { question: 'Where do they also relax?', expectedWords: 2, acceptableAnswers: ['at the lake', 'by the lake'] }
        ]
      }
    },

    // Questions 21-25: Time Sequence - Customs, festivals and celebrations (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: 'Questions 21-25: Festival celebrations',
      instructions: 'A German person talks about their experiences with festivals. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
      reading_text: `Jedes Jahr feiere ich das Oktoberfest in ${city} mit meiner Familie. Es ist ein riesiges Volksfest. Als Kind durfte ich immer Karussell fahren. Dieses Jahr helfe ich beim Aufbau eines Zeltes. Nächstes Jahr hoffe ich, den Kölner Karneval zu erleben, da er sehr berühmt ist.`,
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Customs, festivals and celebrations',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: [
          { event: 'Celebrating Oktoberfest annually', correct: 'N' },
          { event: 'Riding carousels as a child', correct: 'P' },
          { event: 'Helping to set up a tent', correct: 'N' },
          { event: 'Experiencing Cologne Carnival', correct: 'F' },
          { event: 'Attending a famous festival', correct: 'F' }
        ]
      }
    },

    // Questions 26-30: Headline Matching - Celebrity culture (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: 'Questions 26-30: Celebrity news',
      instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
      marks: 5,
      theme: 'Theme 2: Popular culture',
      topic: 'Celebrity culture',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: [
          { letter: 'A', text: 'Deutscher Schauspieler dreht Hollywood-Film' },
          { letter: 'B', text: 'Pop-Sängerin plant Charity-Konzert' },
          { letter: 'C', text: 'TV-Moderatorin startet eigene Talkshow' },
          { letter: 'D', text: 'Formel-1-Fahrer eröffnet Museum' },
          { letter: 'E', text: 'Bestseller-Autor kündigt neue Serie an' },
          { letter: 'F', text: 'Olympionikin unterstützt Jugendprojekt' }
        ],
        articles: [
          { text: 'Der bekannte deutsche Schauspieler Daniel Brühl wird in einem großen Hollywood-Blockbuster mitspielen.', correct: 'A' },
          { text: 'Die Pop-Sängerin Lena Meyer-Landrut organisiert ein Benefizkonzert für den Umweltschutz.', correct: 'B' },
          { text: 'Die beliebte Fernsehmoderatorin Barbara Schöneberger wird ab Herbst ihre eigene Late-Night-Show haben.', correct: 'C' },
          { text: 'Der ehemalige Formel-1-Weltmeister Sebastian Vettel hat ein Museum für Motorsport eröffnet.', correct: 'D' },
          { text: 'Die Bestseller-Autorin Cornelia Funke arbeitet an einer neuen Fantasy-Romanserie für Jugendliche.', correct: 'E' }
        ]
      }
    },

    // Questions 31-35: Sentence Completion - Travel and tourism, including places of interest (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: 'Questions 31-35: A trip to Germany',
      instructions: 'Complete the sentences based on the text. Write the missing words in English.',
      reading_text: `Letzten Frühling besuchte ich ${city}, eine lebendige Stadt im Norden Deutschlands. Ich war beeindruckt von ihrem Hafen und der Speicherstadt. Am Vormittag machten wir eine Hafenrundfahrt. Am Nachmittag besuchten wir das Miniatur Wunderland. Am Abend aßen wir Fischbrötchen in einem Restaurant am Wasser. Es ist ein tolles Ziel für eine Städtereise.`,
      marks: 5,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Travel and tourism, including places of interest',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { incomplete: `Last spring, I visited _____.`, correct: city },
          { incomplete: 'I was impressed by its _____ and the Speicherstadt.', correct: 'port' },
          { incomplete: 'In the morning, we took a _____ tour.', correct: 'harbour' },
          { incomplete: 'In the afternoon, we visited Miniatur _____.', correct: 'Wunderland' },
          { incomplete: 'It is a great destination for a _____ trip.', correct: 'city' }
        ]
      }
    },

    // Questions 36-39: Multiple Choice - Media and technology (4 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: 'Questions 36-39: The impact of technology',
      instructions: 'Read this article about media and technology. Answer the questions by selecting the correct option.',
      reading_text: `Die Digitalisierung hat unsere Welt verändert. Wir bleiben über ${mediaType} mit Freunden und Familie in Kontakt. Das Internet bietet unbegrenzte Informationen und Unterhaltung. Man sollte jedoch vorsichtig sein und seine persönlichen Daten schützen, besonders online.`,
      marks: 4,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'Media and technology',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: [
          { question: 'What has digitalization changed?', options: ['A. Our food', 'B. Our clothes', 'C. Our world'], correct: 'C' },
          { question: 'How do we stay in touch with friends and family?', options: ['A. Letters', 'B. Social media', 'C. Phone calls only'], correct: 'B' },
          { question: 'What does the internet offer?', options: ['A. Limited information', 'B. Unlimited information and entertainment', 'C. Only news'], correct: 'B' },
          { question: 'What should you protect online?', options: ['A. Your friends', 'B. Your personal data', 'C. Your computer'], correct: 'B' }
        ]
      }
    },

    // Question 40: Translation (10 marks)
    {
      question_number: 40,
      question_type: 'translation',
      title: 'Question 40: Translation',
      instructions: 'Translate these sentences into English.',
      marks: 10,
      theme: 'Theme 3: Communication and the world around us',
      topic: 'The environment and where people live',
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: [
          { german: 'Es ist wichtig, Energie zu sparen.', marks: 2, questionNumber: '40.1' },
          { german: 'Ich lebe in einem Dorf auf dem Land.', marks: 2, questionNumber: '40.2' },
          { german: 'Mein Haus ist alt, aber sehr gemütlich.', marks: 2, questionNumber: '40.3' },
          { german: 'Wir müssen mehr für den Umweltschutz tun.', marks: 2, questionNumber: '40.4' },
          { german: 'Saubere Luft ist für alle wichtig.', marks: 2, questionNumber: '40.5' }
        ]
      }
    }
  ];
}

// Main function to generate new papers
async function generateNewPapers() {
  try {
    console.log('🚀 Starting new paper generation...');

    for (const language of languages) {
      for (const tier of tiers) {
        console.log(`\n📝 Processing ${language.name} ${tier.level}...`);

        // Get the next paper number
        const nextPaperNumber = await getNextPaperNumber(language.code, tier.level);
        const identifier = `paper-${nextPaperNumber}`;

        console.log(`   Next paper: ${identifier}`);

        // Create the assessment
        const assessmentData = {
          title: `AQA GCSE ${language.name} Reading Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Paper ${nextPaperNumber}`,
          description: `Complete AQA-style ${tier.level} reading assessment with 40 questions covering all GCSE themes.`,
          level: tier.level,
          language: language.code,
          identifier: identifier,
          version: '1.0',
          total_questions: 9, // 9 question groups covering 40 marks
          time_limit_minutes: tier.timeLimit,
          is_active: true
        };

        const { data: newAssessment, error: assessmentError } = await supabase
          .from('aqa_reading_assessments')
          .insert([assessmentData])
          .select()
          .single();

        if (assessmentError) {
          console.error(`❌ Error creating ${language.name} ${tier.level} assessment:`, assessmentError);
          continue;
        }

        console.log(`   ✅ Created assessment: ${newAssessment.id}`);

        // Generate questions based on language
        let questions;
        switch (language.code) {
          case 'es':
            questions = generateSpanishQuestions(nextPaperNumber, newAssessment.id, tier.level);
            break;
          case 'fr':
            questions = generateFrenchQuestions(nextPaperNumber, newAssessment.id, tier.level);
            break;
          case 'de':
            questions = generateGermanQuestions(nextPaperNumber, newAssessment.id, tier.level);
            break;
          default:
            console.error(`❌ Unknown language: ${language.code}`);
            continue;
        }

        // Insert questions
        const { error: questionsError } = await supabase
          .from('aqa_reading_questions')
          .insert(questions);

        if (questionsError) {
          console.error(`❌ Error inserting questions for ${language.name} ${tier.level}:`, questionsError);
          // Clean up the assessment if questions failed
          await supabase
            .from('aqa_reading_assessments')
            .delete()
            .eq('id', newAssessment.id);
          continue;
        }

        console.log(`   ✅ Inserted ${questions.length} question groups (40 total marks)`);
        console.log(`   🎯 ${language.name} ${tier.level} ${identifier} completed successfully!`);
      }
    }

    console.log('\n🎉 New paper generation completed!');
    console.log('\n📊 Summary:');

    // Show final count
    for (const language of languages) {
      for (const tier of tiers) {
        const { data: assessments } = await supabase
          .from('aqa_reading_assessments')
          .select('identifier')
          .eq('language', language.code)
          .eq('level', tier.level)
          .like('identifier', 'paper-%');

        console.log(`   ${language.name} ${tier.level}: ${assessments?.length || 0} papers available`);
      }
    }

  } catch (error) {
    console.error('❌ Error generating new papers:', error);
  }
}

// Run the script
generateNewPapers();