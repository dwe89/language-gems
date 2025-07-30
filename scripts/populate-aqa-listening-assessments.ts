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
  { level: 'foundation', timeLimit: 35 },
  { level: 'higher', timeLimit: 45 }
];

// AQA Themes
const themes = [
  'Theme 1: People and lifestyle',
  'Theme 2: Popular culture',
  'Theme 3: Communication and the world around us'
];

// French Foundation Questions
const frenchFoundationQuestions = [
  // Type 1: Letter Matching (Marie's week)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'La semaine de Marie',
    instructions: 'Écoutez ce que dit Marie sur sa semaine. Choisissez la lettre correcte pour chaque jour.',
    audio_text: `Lundi je suis allée à la piscine le matin. Mardi j'ai étudié à la médiathèque tout l'après-midi. Mercredi je suis sortie avec mes copines au cinéma. Jeudi j'ai travaillé à la maison toute la journée. Vendredi je suis allée faire du shopping au centre-ville. Samedi j'ai regardé la télé à la maison. Dimanche j'ai rendu visite à mes grands-parents.`,
    audio_transcript: 'Marie describes her weekly activities',
    question_data: {
      options: [
        { letter: 'A', text: 'went to the swimming pool' },
        { letter: 'B', text: 'studied at the media library' },
        { letter: 'C', text: 'went out with friends' },
        { letter: 'D', text: 'worked at home' },
        { letter: 'E', text: 'went shopping' },
        { letter: 'F', text: 'watched TV at home' },
        { letter: 'G', text: 'visited grandparents' }
      ],
      questions: [
        { id: 'monday', label: 'Lundi', correctAnswer: 'A' },
        { id: 'tuesday', label: 'Mardi', correctAnswer: 'B' },
        { id: 'wednesday', label: 'Mercredi', correctAnswer: 'C' },
        { id: 'thursday', label: 'Jeudi', correctAnswer: 'D' },
        { id: 'friday', label: 'Vendredi', correctAnswer: 'E' }
      ]
    },
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      voiceName: 'Puck',
      style: 'natural and clear'
    },
    difficulty_rating: 3
  },

  // Type 2: Multiple Choice (Holiday traditions)
  {
    question_number: 2,
    question_type: 'multiple-choice',
    title: 'Traditions de Noël',
    instructions: 'Écoutez les conversations sur les traditions de Noël et choisissez la bonne réponse.',
    audio_text: `Conversation 1: Dans ma famille nous mangeons toujours de la dinde le réveillon de Noël. Ma grand-mère prépare le dîner et tous les parents viennent à la maison. Après le dîner, nous ouvrons les cadeaux sous le sapin de Noël.

Conversation 2: Nous célébrons l'Épiphanie. Les enfants laissent leurs chaussures devant la porte et le matin ils trouvent des bonbons et des petits cadeaux. C'est une très belle tradition.

Conversation 3: Chez nous nous décorons le sapin de Noël le premier dimanche de décembre. Toute la famille participe et nous mettons des lumières, des boules colorées et une étoile au sommet.`,
    audio_transcript: 'Three conversations about Christmas traditions',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: 'Que mange la famille le réveillon de Noël?',
          options: [
            { letter: 'A', text: 'Agneau' },
            { letter: 'B', text: 'Dinde' },
            { letter: 'C', text: 'Poisson' },
            { letter: 'D', text: 'Poulet' }
          ],
          correctAnswer: 'B'
        },
        {
          id: 'q2',
          question: 'Quand les enfants trouvent-ils des cadeaux dans la deuxième famille?',
          options: [
            { letter: 'A', text: 'Le réveillon de Noël' },
            { letter: 'B', text: 'Le jour de Noël' },
            { letter: 'C', text: 'L\'Épiphanie' },
            { letter: 'D', text: 'Le Nouvel An' }
          ],
          correctAnswer: 'C'
        },
        {
          id: 'q3',
          question: 'Quand décorent-ils le sapin dans la troisième famille?',
          options: [
            { letter: 'A', text: 'Le premier dimanche de novembre' },
            { letter: 'B', text: 'Le premier dimanche de décembre' },
            { letter: 'C', text: 'Le dernier dimanche de novembre' },
            { letter: 'D', text: 'Le dernier dimanche de décembre' }
          ],
          correctAnswer: 'B'
        }
      ]
    },
    marks: 3,
    theme: 'Theme 2: Popular culture',
    topic: 'Customs, festivals and celebrations',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Personne 1', voiceName: 'Aoede' },
        { name: 'Personne 2', voiceName: 'Kore' },
        { name: 'Personne 3', voiceName: 'Puck' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 3: Lifestyle Grid (French podcast)
  {
    question_number: 3,
    question_type: 'lifestyle-grid',
    title: 'Podcast sur les modes de vie',
    instructions: 'Écoutez le podcast où trois personnes parlent de leurs modes de vie. Pour chaque personne, choisissez quel aspect est bon et lequel doit être amélioré.',
    audio_text: `Présentateur: Aujourd'hui nous parlons avec trois jeunes de leurs modes de vie.

Anne: Bonjour, je suis Anne. Je fais du sport tous les jours à la salle de gym, j'adore rester en forme. Je mange beaucoup de fruits et légumes, mais j'ai un problème: je dors très peu parce que je travaille très tard. Je ne dors que cinq heures chaque nuit.

Pierre: Moi c'est Pierre. Je dors huit heures toutes les nuits, c'est très important pour moi. Je bois aussi beaucoup d'eau pendant la journée. Mais je reconnais que je ne fais pas d'exercice, je passe toute la journée assis au bureau et à la maison devant la télé.

Sophie: Je m'appelle Sophie. Je mange très bien, je cuisine toujours des plats maison avec des ingrédients frais. Mais je fume un paquet de cigarettes par jour, je sais que c'est mauvais mais je n'arrive pas à arrêter. Je bois aussi trop de café, environ six tasses par jour.`,
    audio_transcript: 'Podcast with three people discussing their lifestyles',
    question_data: {
      options: [
        { letter: 'A', text: 'physical exercise' },
        { letter: 'B', text: 'diet/nutrition' },
        { letter: 'C', text: 'sleep' },
        { letter: 'D', text: 'harmful habits' },
        { letter: 'E', text: 'hydration' }
      ],
      speakers: [
        { id: 'anne', name: 'Anne', correctGood: 'A', correctNeedsImprovement: 'C' },
        { id: 'pierre', name: 'Pierre', correctGood: 'C', correctNeedsImprovement: 'A' },
        { id: 'sophie', name: 'Sophie', correctGood: 'B', correctNeedsImprovement: 'D' }
      ]
    },
    marks: 6,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Présentateur', voiceName: 'Puck' },
        { name: 'Anne', voiceName: 'Aoede' },
        { name: 'Pierre', voiceName: 'Kore' },
        { name: 'Sophie', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 4: Opinion Rating (TV chat show)
  {
    question_number: 4,
    question_type: 'opinion-rating',
    title: 'Émission télévisée sur les réseaux sociaux',
    instructions: 'Écoutez l\'émission où ils parlent des réseaux sociaux. Pour chaque aspect, décidez si l\'opinion est positive (P), négative (N), ou les deux (P+N).',
    audio_text: `Présentateur: Aujourd'hui nous parlons des réseaux sociaux. Sont-ils bons ou mauvais pour les jeunes?

Invité 1: Les réseaux sociaux sont fantastiques pour rester en contact avec les amis et la famille. On peut parler avec des gens du monde entier instantanément.

Invité 2: Oui, mais ils créent aussi beaucoup d'addiction. Les jeunes passent trop de temps à regarder leur portable et ne font pas d'exercice ni d'études.

Invité 3: Pour l'éducation ils peuvent être très utiles. Il y a beaucoup de groupes d'étude et de ressources éducatives. Mais en même temps, il y a beaucoup de fausses informations qui confondent les étudiants.

Invité 1: En ce qui concerne la vie privée, c'est un désastre total. Les entreprises vendent nos données personnelles et nous n'avons aucun contrôle sur nos informations.`,
    audio_transcript: 'TV show discussion about social media',
    question_data: {
      aspects: [
        { id: 'communication', label: 'Communication avec les autres', correctAnswer: 'P' },
        { id: 'addiction', label: 'Addiction et temps perdu', correctAnswer: 'N' },
        { id: 'education', label: 'Usage éducatif', correctAnswer: 'P+N' },
        { id: 'privacy', label: 'Vie privée', correctAnswer: 'N' }
      ]
    },
    marks: 4,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Présentateur', voiceName: 'Puck' },
        { name: 'Invité 1', voiceName: 'Aoede' },
        { name: 'Invité 2', voiceName: 'Kore' },
        { name: 'Invité 3', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 5: Open Response (Reality TV star)
  {
    question_number: 5,
    question_type: 'open-response',
    title: 'Interview avec une star de télé-réalité',
    instructions: 'Écoutez l\'interview et répondez aux questions en anglais.',
    audio_text: `Journaliste: Nous sommes ici avec Camille, la gagnante de l'émission de télé-réalité "La Maison". Camille, parlez-nous de votre expérience.

Camille: C'était incroyable mais très difficile. Vivre avec douze personnes inconnues pendant trois mois n'est pas facile. Au début nous étions tous amis, mais après les conflits ont commencé à cause de la nourriture, du ménage, de tout.

Journaliste: Quel a été le moment le plus difficile?

Camille: Quand ma meilleure amie dans la maison, Laura, m'a trahie dans la dernière semaine. Nous avions fait une alliance dès le premier jour, mais elle a voté contre moi pour arriver en finale. Ça m'a fait très mal parce que j'avais complètement confiance en elle.

Journaliste: Et quels sont vos projets maintenant avec le prix de 100.000 euros?

Camille: D'abord je vais payer les dettes de mes parents. Ensuite je veux ouvrir un petit restaurant avec mon frère. Nous avons toujours rêvé d'avoir notre propre entreprise familiale.`,
    audio_transcript: 'Interview with reality TV show winner',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: 'How long did Camille live in the house?',
          marks: 1,
          sampleAnswer: 'Three months'
        },
        {
          id: 'q2',
          question: 'What caused conflicts between the housemates?',
          marks: 2,
          sampleAnswer: 'Food and cleaning (any two issues)'
        },
        {
          id: 'q3',
          question: 'Why was Camille hurt by Laura?',
          marks: 2,
          sampleAnswer: 'Laura betrayed her/voted against her despite their alliance/friendship'
        },
        {
          id: 'q4',
          question: 'What are Camille\'s two plans for the prize money?',
          marks: 2,
          sampleAnswer: 'Pay parents\' debts and open a restaurant with her brother'
        }
      ]
    },
    marks: 7,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Journaliste', voiceName: 'Puck' },
        { name: 'Camille', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 6: Activity Timing (Phone conversation)
  {
    question_number: 6,
    question_type: 'activity-timing',
    title: 'Conversation téléphonique sur les projets',
    instructions: 'Écoutez la conversation téléphonique. Pour chaque question, choisissez l\'activité et quand elle va la faire.',
    audio_text: `Sophie: Salut Anne! Comment ça va? Je t'appelle pour te raconter mes projets pour le week-end.

Anne: Salut! Raconte-moi, qu'est-ce que tu vas faire?

Sophie: Bon, samedi matin je vais faire du shopping au centre commercial avec ma sœur. J'ai besoin de nouveaux vêtements pour le travail.

Anne: Super! Et l'après-midi?

Sophie: L'après-midi je vais à la salle de sport. J'ai cours de yoga à cinq heures. Dimanche matin je veux rendre visite à mes grands-parents, ça fait longtemps que je ne les ai pas vus.

Anne: Et dimanche après-midi?

Sophie: Dimanche après-midi je vais au cinéma avec Pierre. Nous voulons voir le nouveau film d'action qui vient de sortir.`,
    audio_transcript: 'Phone conversation about weekend plans',
    question_data: {
      activities: [
        { number: 1, text: 'go shopping' },
        { number: 2, text: 'go to the gym' },
        { number: 3, text: 'visit grandparents' },
        { number: 4, text: 'go to the cinema' }
      ],
      timeOptions: [
        { letter: 'A', text: 'Saturday morning' },
        { letter: 'B', text: 'Saturday afternoon' },
        { letter: 'C', text: 'Sunday morning' },
        { letter: 'D', text: 'Sunday afternoon' }
      ],
      questions: [
        { id: 'q1', correctActivity: 1, correctTime: 'A' },
        { id: 'q2', correctActivity: 2, correctTime: 'B' },
        { id: 'q3', correctActivity: 3, correctTime: 'C' },
        { id: 'q4', correctActivity: 4, correctTime: 'D' }
      ]
    },
    marks: 8,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Sophie', voiceName: 'Aoede' },
        { name: 'Anne', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 7: Multi-Part (University conversation)
  {
    question_number: 7,
    question_type: 'multi-part',
    title: 'Conversation à l\'université',
    instructions: 'Écoutez la conversation entre deux étudiants universitaires et répondez aux deux parties.',
    audio_text: `Étudiant 1: Salut! Comment ça va avec les examens?

Étudiant 2: Très stressée, en fait. J'ai cinq examens cette semaine. Le plus difficile c'est celui de mathématiques demain. J'ai étudié toute la nuit mais je ne comprends rien.

Étudiant 1: Pourquoi tu ne viens pas dans mon groupe d'étude? Nous nous réunissons à la bibliothèque tous les après-midis. Nous sommes quatre étudiants et nous nous aidons mutuellement.

Étudiant 2: Quelle bonne idée! À quelle heure vous vous réunissez?

Étudiant 1: À trois heures de l'après-midi, après les cours. Nous étudions jusqu'à six heures. Nous avons aussi un professeur particulier qui vient les vendredis pour nous aider avec les problèmes les plus difficiles.`,
    audio_transcript: 'University students discussing study group',
    question_data: {
      parts: [
        {
          id: 'part1',
          question: 'Which is the most difficult exam for the second student?',
          options: [
            { letter: 'A', text: 'History' },
            { letter: 'B', text: 'Mathematics' },
            { letter: 'C', text: 'Science' },
            { letter: 'D', text: 'Literature' }
          ],
          correctAnswer: 'B',
          marks: 1
        },
        {
          id: 'part2',
          question: 'When does the private tutor come?',
          options: [
            { letter: 'A', text: 'Mondays' },
            { letter: 'B', text: 'Wednesdays' },
            { letter: 'C', text: 'Fridays' },
            { letter: 'D', text: 'Sundays' }
          ],
          correctAnswer: 'C',
          marks: 1
        }
      ]
    },
    marks: 2,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Education and work',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Étudiant 1', voiceName: 'Puck' },
        { name: 'Étudiant 2', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 8: Dictation
  {
    question_number: 8,
    question_type: 'dictation',
    title: 'Dictée sur l\'environnement',
    instructions: 'Écoutez les phrases sur l\'environnement et écrivez-les exactement comme vous les entendez.',
    audio_text: 'Le changement climatique est l\'un des problèmes les plus graves de notre époque. Nous devons recycler davantage et utiliser moins de plastique. Les jeunes sont très inquiets pour l\'avenir de la planète.',
    audio_transcript: 'Dictation about environmental issues',
    question_data: {
      sentences: [
        {
          id: 'sentence1',
          text: 'Le changement climatique est l\'un des problèmes les plus graves de notre époque.',
          correctText: 'Le changement climatique est l\'un des problèmes les plus graves de notre époque.',
          acceptableVariations: [
            'Le changement climatique est l\'un des problemes les plus graves de notre epoque.'
          ]
        },
        {
          id: 'sentence2',
          text: 'Nous devons recycler davantage et utiliser moins de plastique.',
          correctText: 'Nous devons recycler davantage et utiliser moins de plastique.',
          acceptableVariations: [
            'Nous devons recycler davantage et utiliser moins de plastique.'
          ]
        },
        {
          id: 'sentence3',
          text: 'Les jeunes sont très inquiets pour l\'avenir de la planète.',
          correctText: 'Les jeunes sont très inquiets pour l\'avenir de la planète.',
          acceptableVariations: [
            'Les jeunes sont tres inquiets pour l\'avenir de la planete.'
          ]
        }
      ]
    },
    marks: 6,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'The environment and where people live',
    tts_config: {
      voiceName: 'Aoede',
      style: 'clearly and slowly for dictation'
    },
    difficulty_rating: 4
  }
];

// German Foundation Questions
const germanFoundationQuestions = [
  // Type 1: Letter Matching (Max's week)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Max\' Woche',
    instructions: 'Hören Sie, was Max über seine Woche sagt. Wählen Sie den richtigen Buchstaben für jeden Tag.',
    audio_text: `Montag bin ich morgens ins Fitnessstudio gegangen. Dienstag habe ich den ganzen Nachmittag in der Bibliothek studiert. Mittwoch bin ich mit meinen Freunden ins Kino gegangen. Donnerstag habe ich den ganzen Tag zu Hause gearbeitet. Freitag bin ich ins Einkaufszentrum zum Shoppen gegangen. Samstag habe ich zu Hause ferngesehen und mich ausgeruht. Sonntag habe ich meine Großeltern besucht.`,
    audio_transcript: 'Max describes his weekly activities',
    question_data: {
      options: [
        { letter: 'A', text: 'went to the gym' },
        { letter: 'B', text: 'studied at the library' },
        { letter: 'C', text: 'went out with friends' },
        { letter: 'D', text: 'worked at home' },
        { letter: 'E', text: 'went shopping' },
        { letter: 'F', text: 'rested at home' },
        { letter: 'G', text: 'visited grandparents' }
      ],
      questions: [
        { id: 'monday', label: 'Montag', correctAnswer: 'A' },
        { id: 'tuesday', label: 'Dienstag', correctAnswer: 'B' },
        { id: 'wednesday', label: 'Mittwoch', correctAnswer: 'C' },
        { id: 'thursday', label: 'Donnerstag', correctAnswer: 'D' },
        { id: 'friday', label: 'Freitag', correctAnswer: 'E' }
      ]
    },
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      voiceName: 'Puck',
      style: 'natural and clear'
    },
    difficulty_rating: 3
  },

  // Type 2: Multiple Choice (Holiday traditions)
  {
    question_number: 2,
    question_type: 'multiple-choice',
    title: 'Weihnachtstraditionen',
    instructions: 'Hören Sie die Gespräche über Weihnachtstraditionen und wählen Sie die richtige Antwort.',
    audio_text: `Gespräch 1: In meiner Familie essen wir immer Truthahn an Heiligabend. Meine Großmutter bereitet das Abendessen vor und alle Verwandten kommen nach Hause. Nach dem Essen öffnen wir die Geschenke unter dem Weihnachtsbaum.

Gespräch 2: Wir feiern den Dreikönigstag. Die Kinder stellen ihre Schuhe vor die Tür und am Morgen finden sie Süßigkeiten und kleine Geschenke. Das ist eine sehr schöne Tradition.

Gespräch 3: Bei uns schmücken wir den Weihnachtsbaum am ersten Sonntag im Dezember. Die ganze Familie macht mit und wir hängen Lichter, bunte Kugeln und einen Stern an die Spitze.`,
    audio_transcript: 'Three conversations about Christmas traditions',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: 'Was isst die Familie an Heiligabend?',
          options: [
            { letter: 'A', text: 'Lamm' },
            { letter: 'B', text: 'Truthahn' },
            { letter: 'C', text: 'Fisch' },
            { letter: 'D', text: 'Huhn' }
          ],
          correctAnswer: 'B'
        },
        {
          id: 'q2',
          question: 'Wann finden die Kinder Geschenke in der zweiten Familie?',
          options: [
            { letter: 'A', text: 'An Heiligabend' },
            { letter: 'B', text: 'Am Weihnachtstag' },
            { letter: 'C', text: 'Am Dreikönigstag' },
            { letter: 'D', text: 'An Neujahr' }
          ],
          correctAnswer: 'C'
        },
        {
          id: 'q3',
          question: 'Wann schmücken sie den Baum in der dritten Familie?',
          options: [
            { letter: 'A', text: 'Am ersten Sonntag im November' },
            { letter: 'B', text: 'Am ersten Sonntag im Dezember' },
            { letter: 'C', text: 'Am letzten Sonntag im November' },
            { letter: 'D', text: 'Am letzten Sonntag im Dezember' }
          ],
          correctAnswer: 'B'
        }
      ]
    },
    marks: 3,
    theme: 'Theme 2: Popular culture',
    topic: 'Customs, festivals and celebrations',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Person 1', voiceName: 'Aoede' },
        { name: 'Person 2', voiceName: 'Kore' },
        { name: 'Person 3', voiceName: 'Puck' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 3: Lifestyle Grid (German podcast)
  {
    question_number: 3,
    question_type: 'lifestyle-grid',
    title: 'Podcast über Lebensstile',
    instructions: 'Hören Sie den Podcast, in dem drei Personen über ihre Lebensstile sprechen. Wählen Sie für jede Person, welcher Aspekt gut ist und welcher verbessert werden muss.',
    audio_text: `Moderator: Heute sprechen wir mit drei jungen Leuten über ihre Lebensstile.

Anna: Hallo, ich bin Anna. Ich mache jeden Tag Sport im Fitnessstudio, ich liebe es, fit zu bleiben. Ich esse viel Obst und Gemüse, aber ich habe ein Problem: Ich schlafe sehr wenig, weil ich bis sehr spät arbeite. Ich schlafe nur fünf Stunden jede Nacht.

Klaus: Ich bin Klaus. Ich schlafe jede Nacht acht Stunden, das ist sehr wichtig für mich. Ich trinke auch viel Wasser während des Tages. Aber ich gebe zu, dass ich keinen Sport mache, ich sitze den ganzen Tag im Büro und zu Hause vor dem Fernseher.

Maria: Ich heiße Maria. Ich esse sehr gut, ich koche immer hausgemachtes Essen mit frischen Zutaten. Aber ich rauche eine Schachtel Zigaretten am Tag, ich weiß, dass es schlecht ist, aber ich kann nicht aufhören. Ich trinke auch zu viel Kaffee, etwa sechs Tassen am Tag.`,
    audio_transcript: 'Podcast with three people discussing their lifestyles',
    question_data: {
      options: [
        { letter: 'A', text: 'physical exercise' },
        { letter: 'B', text: 'diet/nutrition' },
        { letter: 'C', text: 'sleep' },
        { letter: 'D', text: 'harmful habits' },
        { letter: 'E', text: 'hydration' }
      ],
      speakers: [
        { id: 'anna', name: 'Anna', correctGood: 'A', correctNeedsImprovement: 'C' },
        { id: 'klaus', name: 'Klaus', correctGood: 'C', correctNeedsImprovement: 'A' },
        { id: 'maria', name: 'Maria', correctGood: 'B', correctNeedsImprovement: 'D' }
      ]
    },
    marks: 6,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Moderator', voiceName: 'Puck' },
        { name: 'Anna', voiceName: 'Aoede' },
        { name: 'Klaus', voiceName: 'Kore' },
        { name: 'Maria', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 4: Opinion Rating (TV chat show)
  {
    question_number: 4,
    question_type: 'opinion-rating',
    title: 'Fernsehsendung über soziale Medien',
    instructions: 'Hören Sie die Sendung, in der sie über soziale Medien sprechen. Entscheiden Sie für jeden Aspekt, ob die Meinung positiv (P), negativ (N) oder beides (P+N) ist.',
    audio_text: `Moderator: Heute sprechen wir über soziale Medien. Sind sie gut oder schlecht für junge Leute?

Gast 1: Soziale Medien sind fantastisch, um mit Freunden und Familie in Kontakt zu bleiben. Man kann sofort mit Menschen aus der ganzen Welt sprechen.

Gast 2: Ja, aber sie schaffen auch viel Sucht. Junge Leute verbringen zu viel Zeit damit, auf ihr Handy zu schauen und machen keinen Sport oder studieren nicht.

Gast 3: Für die Bildung können sie sehr nützlich sein. Es gibt viele Lerngruppen und Bildungsressourcen. Aber gleichzeitig gibt es viele falsche Informationen, die die Schüler verwirren.

Gast 1: Was die Privatsphäre angeht, ist es eine totale Katastrophe. Die Unternehmen verkaufen unsere persönlichen Daten und wir haben keine Kontrolle über unsere Informationen.`,
    audio_transcript: 'TV show discussion about social media',
    question_data: {
      aspects: [
        { id: 'communication', label: 'Kommunikation mit anderen', correctAnswer: 'P' },
        { id: 'addiction', label: 'Sucht und verlorene Zeit', correctAnswer: 'N' },
        { id: 'education', label: 'Bildungsnutzung', correctAnswer: 'P+N' },
        { id: 'privacy', label: 'Privatsphäre', correctAnswer: 'N' }
      ]
    },
    marks: 4,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Moderator', voiceName: 'Puck' },
        { name: 'Gast 1', voiceName: 'Aoede' },
        { name: 'Gast 2', voiceName: 'Kore' },
        { name: 'Gast 3', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 5: Open Response (Reality TV star)
  {
    question_number: 5,
    question_type: 'open-response',
    title: 'Interview mit Reality-TV-Star',
    instructions: 'Hören Sie das Interview und beantworten Sie die Fragen auf Englisch.',
    audio_text: `Interviewer: Wir sind hier mit Carmen, der Gewinnerin der Reality-Show "Das Haus". Carmen, erzählen Sie uns von Ihrer Erfahrung.

Carmen: Es war unglaublich, aber sehr schwierig. Mit zwölf unbekannten Personen drei Monate lang zu leben ist nicht einfach. Am Anfang waren wir alle Freunde, aber dann begannen die Konflikte wegen des Essens, der Reinigung, allem.

Interviewer: Was war der schwierigste Moment?

Carmen: Als meine beste Freundin im Haus, Laura, mich in der letzten Woche verraten hat. Wir hatten vom ersten Tag an eine Allianz gemacht, aber sie stimmte gegen mich, um ins Finale zu kommen. Es tat mir sehr weh, weil ich ihr völlig vertraut hatte.

Interviewer: Und was sind Ihre Pläne jetzt mit dem Preis von 100.000 Euro?

Carmen: Zuerst werde ich die Schulden meiner Eltern bezahlen. Dann möchte ich mit meinem Bruder ein kleines Restaurant eröffnen. Wir haben immer davon geträumt, unser eigenes Familienunternehmen zu haben.`,
    audio_transcript: 'Interview with reality TV show winner',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: 'How long did Carmen live in the house?',
          marks: 1,
          sampleAnswer: 'Three months'
        },
        {
          id: 'q2',
          question: 'What caused conflicts between the housemates?',
          marks: 2,
          sampleAnswer: 'Food and cleaning (any two issues)'
        },
        {
          id: 'q3',
          question: 'Why was Carmen hurt by Laura?',
          marks: 2,
          sampleAnswer: 'Laura betrayed her/voted against her despite their alliance/friendship'
        },
        {
          id: 'q4',
          question: 'What are Carmen\'s two plans for the prize money?',
          marks: 2,
          sampleAnswer: 'Pay parents\' debts and open a restaurant with her brother'
        }
      ]
    },
    marks: 7,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Interviewer', voiceName: 'Puck' },
        { name: 'Carmen', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 6: Activity Timing (Phone conversation)
  {
    question_number: 6,
    question_type: 'activity-timing',
    title: 'Telefongespräch über Pläne',
    instructions: 'Hören Sie das Telefongespräch. Wählen Sie für jede Frage die Aktivität und wann sie sie machen wird.',
    audio_text: `Maria: Hallo Anna! Wie geht's? Ich rufe an, um dir meine Pläne für das Wochenende zu erzählen.

Anna: Hallo! Erzähl mal, was wirst du machen?

Maria: Also, Samstagmorgen gehe ich mit meiner Schwester ins Einkaufszentrum shoppen. Ich brauche neue Kleidung für die Arbeit.

Anna: Toll! Und am Nachmittag?

Maria: Am Nachmittag gehe ich ins Fitnessstudio. Ich habe um fünf Yoga-Stunde. Sonntagmorgen möchte ich meine Großeltern besuchen, ich habe sie lange nicht gesehen.

Anna: Und Sonntagnachmittag?

Maria: Sonntagnachmittag gehe ich mit Pedro ins Kino. Wir wollen den neuen Actionfilm sehen, der gerade herausgekommen ist.`,
    audio_transcript: 'Phone conversation about weekend plans',
    question_data: {
      activities: [
        { number: 1, text: 'go shopping' },
        { number: 2, text: 'go to the gym' },
        { number: 3, text: 'visit grandparents' },
        { number: 4, text: 'go to the cinema' }
      ],
      timeOptions: [
        { letter: 'A', text: 'Saturday morning' },
        { letter: 'B', text: 'Saturday afternoon' },
        { letter: 'C', text: 'Sunday morning' },
        { letter: 'D', text: 'Sunday afternoon' }
      ],
      questions: [
        { id: 'q1', correctActivity: 1, correctTime: 'A' },
        { id: 'q2', correctActivity: 2, correctTime: 'B' },
        { id: 'q3', correctActivity: 3, correctTime: 'C' },
        { id: 'q4', correctActivity: 4, correctTime: 'D' }
      ]
    },
    marks: 8,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Maria', voiceName: 'Aoede' },
        { name: 'Anna', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 3
  }
];

// Spanish Foundation Questions
const spanishFoundationQuestions = [
  // Type 1: Letter Matching (Carlos's week)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'La semana de Carlos',
    instructions: 'Escucha lo que dice Carlos sobre su semana. Elige la letra correcta para cada día.',
    audio_text: `Lunes fui al gimnasio por la mañana. El martes estudié en la biblioteca toda la tarde. El miércoles salí con mis amigos al cine. El jueves trabajé en casa todo el día. El viernes fui de compras al centro comercial. El sábado descansé en casa viendo la televisión. El domingo visité a mis abuelos.`,
    audio_transcript: 'Carlos describes his weekly activities',
    question_data: {
      options: [
        { letter: 'A', text: 'went to the gym' },
        { letter: 'B', text: 'studied at the library' },
        { letter: 'C', text: 'went out with friends' },
        { letter: 'D', text: 'worked at home' },
        { letter: 'E', text: 'went shopping' },
        { letter: 'F', text: 'rested at home' },
        { letter: 'G', text: 'visited grandparents' }
      ],
      questions: [
        { id: 'monday', label: 'Lunes', correctAnswer: 'A' },
        { id: 'tuesday', label: 'Martes', correctAnswer: 'B' },
        { id: 'wednesday', label: 'Miércoles', correctAnswer: 'C' },
        { id: 'thursday', label: 'Jueves', correctAnswer: 'D' },
        { id: 'friday', label: 'Viernes', correctAnswer: 'E' }
      ]
    },
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      voiceName: 'Puck',
      style: 'natural and clear'
    },
    difficulty_rating: 3
  },

  // Type 2: Multiple Choice (Holiday traditions)
  {
    question_number: 2,
    question_type: 'multiple-choice',
    title: 'Tradiciones navideñas',
    instructions: 'Escucha las conversaciones sobre tradiciones navideñas y elige la respuesta correcta.',
    audio_text: `Conversación 1: En mi familia siempre cenamos pavo en Nochebuena. Mi abuela prepara la cena y todos los parientes vienen a casa. Después de cenar, abrimos los regalos bajo el árbol de Navidad.

Conversación 2: Nosotros celebramos el día de Reyes. Los niños dejan sus zapatos fuera de la puerta y por la mañana encuentran dulces y pequeños regalos. Es una tradición muy bonita.

Conversación 3: En mi casa decoramos el árbol de Navidad el primer domingo de diciembre. Toda la familia participa y ponemos luces, bolas de colores y una estrella en la punta.`,
    audio_transcript: 'Three conversations about Christmas traditions',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: '¿Qué come la familia en Nochebuena?',
          options: [
            { letter: 'A', text: 'Cordero' },
            { letter: 'B', text: 'Pavo' },
            { letter: 'C', text: 'Pescado' },
            { letter: 'D', text: 'Pollo' }
          ],
          correctAnswer: 'B'
        },
        {
          id: 'q2',
          question: '¿Cuándo encuentran regalos los niños en la segunda familia?',
          options: [
            { letter: 'A', text: 'En Nochebuena' },
            { letter: 'B', text: 'En Navidad' },
            { letter: 'C', text: 'En el día de Reyes' },
            { letter: 'D', text: 'En Año Nuevo' }
          ],
          correctAnswer: 'C'
        },
        {
          id: 'q3',
          question: '¿Cuándo decoran el árbol en la tercera familia?',
          options: [
            { letter: 'A', text: 'El primer domingo de noviembre' },
            { letter: 'B', text: 'El primer domingo de diciembre' },
            { letter: 'C', text: 'El último domingo de noviembre' },
            { letter: 'D', text: 'El último domingo de diciembre' }
          ],
          correctAnswer: 'B'
        }
      ]
    },
    marks: 3,
    theme: 'Theme 2: Popular culture',
    topic: 'Customs, festivals and celebrations',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Persona 1', voiceName: 'Aoede' },
        { name: 'Persona 2', voiceName: 'Kore' },
        { name: 'Persona 3', voiceName: 'Puck' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 3: Lifestyle Grid (Spanish podcast)
  {
    question_number: 3,
    question_type: 'lifestyle-grid',
    title: 'Podcast sobre estilos de vida',
    instructions: 'Escucha el podcast donde tres personas hablan de sus estilos de vida. Para cada persona, elige qué aspecto es bueno y cuál necesita mejorar.',
    audio_text: `Presentador: Hoy hablamos con tres jóvenes sobre sus estilos de vida.

Ana: Hola, soy Ana. Hago ejercicio todos los días en el gimnasio, me encanta mantenerme en forma. Como mucha fruta y verdura, pero tengo un problema: duermo muy poco porque trabajo hasta muy tarde. Solo duermo cinco horas cada noche.

Carlos: Yo soy Carlos. Duermo ocho horas todas las noches, es muy importante para mí. También bebo mucha agua durante el día. Pero reconozco que no hago nada de ejercicio, paso todo el día sentado en la oficina y en casa viendo la televisión.

María: Me llamo María. Como muy bien, siempre cocino comida casera con ingredientes frescos. Pero fumo un paquete de cigarrillos al día, sé que es malo pero no puedo dejarlo. También bebo demasiado café, como seis tazas al día.`,
    audio_transcript: 'Podcast with three people discussing their lifestyles',
    question_data: {
      options: [
        { letter: 'A', text: 'physical exercise' },
        { letter: 'B', text: 'diet/nutrition' },
        { letter: 'C', text: 'sleep' },
        { letter: 'D', text: 'harmful habits' },
        { letter: 'E', text: 'hydration' }
      ],
      speakers: [
        { id: 'ana', name: 'Ana', correctGood: 'A', correctNeedsImprovement: 'C' },
        { id: 'carlos', name: 'Carlos', correctGood: 'C', correctNeedsImprovement: 'A' },
        { id: 'maria', name: 'María', correctGood: 'B', correctNeedsImprovement: 'D' }
      ]
    },
    marks: 6,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Presentador', voiceName: 'Puck' },
        { name: 'Ana', voiceName: 'Aoede' },
        { name: 'Carlos', voiceName: 'Kore' },
        { name: 'María', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 4: Opinion Rating (TV chat show)
  {
    question_number: 4,
    question_type: 'opinion-rating',
    title: 'Programa de televisión sobre redes sociales',
    instructions: 'Escucha el programa donde hablan sobre las redes sociales. Para cada aspecto, decide si la opinión es positiva (P), negativa (N), o ambas (P+N).',
    audio_text: `Presentador: Hoy hablamos sobre las redes sociales. ¿Son buenas o malas para los jóvenes?

Invitado 1: Las redes sociales son fantásticas para mantenerse en contacto con amigos y familia. Puedes hablar con personas de todo el mundo instantáneamente.

Invitado 2: Sí, pero también crean mucha adicción. Los jóvenes pasan demasiado tiempo mirando el móvil y no hacen ejercicio ni estudian.

Invitado 3: Para la educación pueden ser muy útiles. Hay muchos grupos de estudio y recursos educativos. Pero al mismo tiempo, hay mucha información falsa que confunde a los estudiantes.

Invitado 1: En cuanto a la privacidad, es un desastre total. Las empresas venden nuestros datos personales y no tenemos control sobre nuestra información.`,
    audio_transcript: 'TV show discussion about social media',
    question_data: {
      aspects: [
        { id: 'communication', label: 'Comunicación con otros', correctAnswer: 'P' },
        { id: 'addiction', label: 'Adicción y tiempo perdido', correctAnswer: 'N' },
        { id: 'education', label: 'Uso educativo', correctAnswer: 'P+N' },
        { id: 'privacy', label: 'Privacidad personal', correctAnswer: 'N' }
      ]
    },
    marks: 4,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Presentador', voiceName: 'Puck' },
        { name: 'Invitado 1', voiceName: 'Aoede' },
        { name: 'Invitado 2', voiceName: 'Kore' },
        { name: 'Invitado 3', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 5: Open Response (Reality TV star)
  {
    question_number: 5,
    question_type: 'open-response',
    title: 'Entrevista con estrella de reality show',
    instructions: 'Escucha la entrevista y responde a las preguntas en inglés.',
    audio_text: `Entrevistador: Estamos aquí con Carmen, la ganadora del reality show "La Casa". Carmen, cuéntanos sobre tu experiencia.

Carmen: Fue increíble pero muy difícil. Vivir con doce personas desconocidas durante tres meses no es fácil. Al principio todos éramos amigos, pero después empezaron los conflictos por la comida, la limpieza, todo.

Entrevistador: ¿Cuál fue el momento más difícil?

Carmen: Cuando mi mejor amiga en la casa, Laura, me traicionó en la semana final. Hicimos una alianza desde el primer día, pero ella votó contra mí para llegar a la final. Me dolió mucho porque confiaba en ella completamente.

Entrevistador: ¿Y qué planes tienes ahora con el premio de 100.000 euros?

Carmen: Primero voy a pagar las deudas de mis padres. Después quiero abrir un pequeño restaurante con mi hermano. Siempre hemos soñado con tener nuestro propio negocio familiar.`,
    audio_transcript: 'Interview with reality TV show winner',
    question_data: {
      questions: [
        {
          id: 'q1',
          question: 'How long did Carmen live in the house?',
          marks: 1,
          sampleAnswer: 'Three months'
        },
        {
          id: 'q2',
          question: 'What caused conflicts between the housemates?',
          marks: 2,
          sampleAnswer: 'Food and cleaning (any two issues)'
        },
        {
          id: 'q3',
          question: 'Why was Carmen hurt by Laura?',
          marks: 2,
          sampleAnswer: 'Laura betrayed her/voted against her despite their alliance/friendship'
        },
        {
          id: 'q4',
          question: 'What are Carmen\'s two plans for the prize money?',
          marks: 2,
          sampleAnswer: 'Pay parents\' debts and open a restaurant with her brother'
        }
      ]
    },
    marks: 7,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Entrevistador', voiceName: 'Puck' },
        { name: 'Carmen', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 4
  },

  // Type 6: Activity Timing (Phone conversation)
  {
    question_number: 6,
    question_type: 'activity-timing',
    title: 'Conversación telefónica sobre planes',
    instructions: 'Escucha la conversación telefónica. Para cada pregunta, elige la actividad y cuándo va a hacerla.',
    audio_text: `María: ¡Hola Ana! ¿Qué tal? Te llamo para contarte mis planes para el fin de semana.

Ana: ¡Hola! Cuéntame, ¿qué vas a hacer?

María: Bueno, el sábado por la mañana voy a ir de compras al centro comercial con mi hermana. Necesito ropa nueva para el trabajo.

Ana: ¡Qué bien! ¿Y por la tarde?

María: Por la tarde voy al gimnasio. Tengo clase de yoga a las cinco. El domingo por la mañana quiero visitar a mis abuelos, hace tiempo que no los veo.

Ana: ¿Y el domingo por la tarde?

María: El domingo por la tarde voy al cine con Pedro. Queremos ver la nueva película de acción que acaba de salir.`,
    audio_transcript: 'Phone conversation about weekend plans',
    question_data: {
      activities: [
        { number: 1, text: 'go shopping' },
        { number: 2, text: 'go to the gym' },
        { number: 3, text: 'visit grandparents' },
        { number: 4, text: 'go to the cinema' }
      ],
      timeOptions: [
        { letter: 'A', text: 'Saturday morning' },
        { letter: 'B', text: 'Saturday afternoon' },
        { letter: 'C', text: 'Sunday morning' },
        { letter: 'D', text: 'Sunday afternoon' }
      ],
      questions: [
        { id: 'q1', correctActivity: 1, correctTime: 'A' },
        { id: 'q2', correctActivity: 2, correctTime: 'B' },
        { id: 'q3', correctActivity: 3, correctTime: 'C' },
        { id: 'q4', correctActivity: 4, correctTime: 'D' }
      ]
    },
    marks: 8,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Free-time activities',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'María', voiceName: 'Aoede' },
        { name: 'Ana', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 7: Multi-Part (University conversation)
  {
    question_number: 7,
    question_type: 'multi-part',
    title: 'Conversación en la universidad',
    instructions: 'Escucha la conversación entre dos estudiantes universitarios y responde a las dos partes.',
    audio_text: `Estudiante 1: ¡Hola! ¿Cómo te va con los exámenes?

Estudiante 2: Muy estresada, la verdad. Tengo cinco exámenes esta semana. El más difícil es el de matemáticas mañana. He estado estudiando toda la noche pero no entiendo nada.

Estudiante 1: ¿Por qué no vienes a mi grupo de estudio? Nos reunimos en la biblioteca todas las tardes. Somos cuatro estudiantes y nos ayudamos mutuamente.

Estudiante 2: ¡Qué buena idea! ¿A qué hora os reunís?

Estudiante 1: A las tres de la tarde, después de las clases. Estudiamos hasta las seis. También tenemos un profesor particular que viene los viernes para ayudarnos con los problemas más difíciles.`,
    audio_transcript: 'University students discussing study group',
    question_data: {
      parts: [
        {
          id: 'part1',
          question: 'Which is the most difficult exam for the second student?',
          options: [
            { letter: 'A', text: 'History' },
            { letter: 'B', text: 'Mathematics' },
            { letter: 'C', text: 'Science' },
            { letter: 'D', text: 'Literature' }
          ],
          correctAnswer: 'B',
          marks: 1
        },
        {
          id: 'part2',
          question: 'When does the private tutor come?',
          options: [
            { letter: 'A', text: 'Mondays' },
            { letter: 'B', text: 'Wednesdays' },
            { letter: 'C', text: 'Fridays' },
            { letter: 'D', text: 'Sundays' }
          ],
          correctAnswer: 'C',
          marks: 1
        }
      ]
    },
    marks: 2,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Education and work',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Estudiante 1', voiceName: 'Puck' },
        { name: 'Estudiante 2', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 3
  },

  // Type 8: Dictation
  {
    question_number: 8,
    question_type: 'dictation',
    title: 'Dictado sobre el medio ambiente',
    instructions: 'Escucha las frases sobre el medio ambiente y escríbelas exactamente como las oyes.',
    audio_text: 'El cambio climático es uno de los problemas más graves de nuestro tiempo. Debemos reciclar más y usar menos plástico. Los jóvenes están muy preocupados por el futuro del planeta.',
    audio_transcript: 'Dictation about environmental issues',
    question_data: {
      sentences: [
        {
          id: 'sentence1',
          text: 'El cambio climático es uno de los problemas más graves de nuestro tiempo.',
          correctText: 'El cambio climático es uno de los problemas más graves de nuestro tiempo.',
          acceptableVariations: [
            'El cambio climatico es uno de los problemas mas graves de nuestro tiempo.'
          ]
        },
        {
          id: 'sentence2',
          text: 'Debemos reciclar más y usar menos plástico.',
          correctText: 'Debemos reciclar más y usar menos plástico.',
          acceptableVariations: [
            'Debemos reciclar mas y usar menos plastico.'
          ]
        },
        {
          id: 'sentence3',
          text: 'Los jóvenes están muy preocupados por el futuro del planeta.',
          correctText: 'Los jóvenes están muy preocupados por el futuro del planeta.',
          acceptableVariations: [
            'Los jovenes estan muy preocupados por el futuro del planeta.'
          ]
        }
      ]
    },
    marks: 6,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'The environment and where people live',
    tts_config: {
      voiceName: 'Aoede',
      style: 'clearly and slowly for dictation'
    },
    difficulty_rating: 4
  }
];

async function populateListeningAssessments() {
  try {
    console.log('🎧 Starting AQA Listening Assessment population...\n');

    // Clear existing data
    console.log('🧹 Clearing existing listening assessment data...');
    await supabase.from('aqa_listening_questions').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aqa_listening_assessments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    console.log('✅ Cleared existing data\n');

    // Create assessments for each language and tier
    for (const lang of languages) {
      for (const tier of tiers) {
        console.log(`📚 Creating ${lang.name} ${tier.level} listening assessment...`);

        const assessment = {
          title: `AQA Listening Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Paper 1 (${lang.name})`,
          description: `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level AQA-style ${lang.name} listening assessment with audio generated by Gemini TTS`,
          level: tier.level,
          language: lang.code,
          identifier: 'paper-1',
          version: '1.0',
          total_questions: 40,
          time_limit_minutes: tier.timeLimit,
          is_active: true
        };

        const { data: assessmentData, error: assessmentError } = await supabase
          .from('aqa_listening_assessments')
          .insert(assessment)
          .select('id')
          .single();

        if (assessmentError) {
          console.error(`❌ Error creating ${lang.name} ${tier.level} assessment:`, assessmentError);
          continue;
        }

        console.log(`✅ Created ${lang.name} ${tier.level} assessment:`, assessmentData.id);

        // Use Spanish questions as template for all languages (can be customized later)
        const questionsToUse = spanishFoundationQuestions;

        const questionsWithAssessmentId = questionsToUse.map(q => ({
          ...q,
          assessment_id: assessmentData.id,
          difficulty_rating: tier.level === 'foundation' ? 3 : 4
        }));

        const { error: questionsError } = await supabase
          .from('aqa_listening_questions')
          .insert(questionsWithAssessmentId);

        if (questionsError) {
          console.error(`❌ Error inserting ${lang.name} ${tier.level} questions:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${lang.name} ${tier.level} questions (${questionsToUse.length} questions)`);
      }
    }

    console.log('\n🎉 AQA Listening Assessment population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Languages: ${languages.length} (${languages.map(l => l.name).join(', ')})`);
    console.log(`- Tiers: ${tiers.length} (${tiers.map(t => t.level).join(', ')})`);
    console.log(`- Total assessments created: ${languages.length * tiers.length}`);
    console.log(`- Questions per assessment: ${spanishFoundationQuestions.length}`);
    console.log(`- Total questions: ${languages.length * tiers.length * spanishFoundationQuestions.length}`);

  } catch (error) {
    console.error('❌ Error populating listening assessments:', error);
  }
}

// Run the population script
if (require.main === module) {
  populateListeningAssessments().then(() => {
    console.log('\n✨ Script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { populateListeningAssessments };
