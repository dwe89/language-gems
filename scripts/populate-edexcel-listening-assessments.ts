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
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 45, totalQuestions: 12 }, // Q1-Q10 + Q11(a)(b) + Q12 = 12 questions, 50 marks
  { level: 'higher', timeLimit: 60, totalQuestions: 10 }      // Q1-Q7 + Q8(a)(b) + Q9(a)(b) + Q10 = 10 questions, 50 marks
];

// Edexcel Themes (based on GCSE specification)
const themes = [
  'Identity and culture',
  'Local area, holiday and travel',
  'School',
  'Future aspirations, study and work',
  'Global issues'
];

// Remove difficulty_rating from all questions and create complete language sets
const removeUnsupportedFields = (questions: any[]) => {
  return questions.map(q => {
    const { difficulty_rating, ...cleanQuestion } = q;
    return cleanQuestion;
  });
};

// Base German questions
const germanQuestions = {
  foundation: [
  // Q1: Multiple Choice (Foundation)
  {
    question_number: 1,
    question_type: 'multiple-choice',
    section: 'A',
    title: 'Julia is talking about her morning routine',
    instructions: 'What does she say? Listen to the recording and complete the sentences by selecting the correct letter.',
    audio_text: `Hallo, ich heiße Julia. Jeden Morgen stehe ich um halb acht auf. Um fit zu bleiben, gehe ich zu Tanzkursen im Sportzentrum. Es macht viel Spaß und ich liebe die Musik. Nach dem Frühstück lese ich normalerweise die Zeitung, während ich meinen Kaffee trinke. Ich informiere mich gerne über die Neuigkeiten des Tages.`,
    audio_transcript: 'Julia describes her morning routine',
    question_data: {
      questions: [
        {
          id: 'q1a',
          question: 'Every morning to stay in shape, Julia',
          options: [
            { letter: 'A', text: 'goes shopping' },
            { letter: 'B', text: 'goes to a dance class' },
            { letter: 'C', text: 'walks in the park' }
          ]
        },
        {
          id: 'q1b',
          question: 'After breakfast, she usually',
          options: [
            { letter: 'A', text: 'reads the newspaper' },
            { letter: 'B', text: 'watches television' },
            { letter: 'C', text: 'listens to music' }
          ]
        },
        {
          id: 'q1c',
          question: 'Julia likes to be informed about',
          options: [
            { letter: 'A', text: 'sports news' },
            { letter: 'B', text: 'daily news' },
            { letter: 'C', text: 'weather news' }
          ]
        }
      ]
    },
    marks: 3,
    theme: 'Identity and culture',
    topic: 'Daily routines',
    tts_config: {
      voiceName: 'Aoede',
      style: 'natural and clear'
    }
  },

  // Q2: Multiple Response (Foundation)
  {
    question_number: 2,
    question_type: 'multiple-response',
    section: 'A',
    title: 'Listen to this advert promoting a German town',
    instructions: 'What is mentioned? Select the three correct letters.',
    audio_text: `Willkommen in Hamburg! Unsere schöne Hafenstadt bietet alles, was Sie für einen perfekten Urlaub brauchen. Wir haben ausgezeichnete öffentliche Verkehrsmittel, die alle Sehenswürdigkeiten miteinander verbinden. Sie finden eine große Auswahl an Restaurants, in denen Sie die köstliche lokale Küche probieren können. Für Ihre Einkäufe besuchen Sie unser modernes Einkaufszentrum mit den besten internationalen Marken. Und natürlich genießen Sie unser nordisches Klima mit mehr als 200 Sonnentagen im Jahr.`,
    audio_transcript: 'Advertisement for Hamburg promoting town facilities',
    question_data: {
      prompt: 'What facilities does the town offer?',
      options: [
        { letter: 'A', text: 'public transport' },
        { letter: 'B', text: 'airport' },
        { letter: 'C', text: 'places to eat' },
        { letter: 'D', text: 'accommodation' },
        { letter: 'E', text: 'shopping' },
        { letter: 'F', text: 'the weather' }
      ]
    },
    marks: 3,
    theme: 'Local area, holiday and travel',
    topic: 'Town and region',
    tts_config: {
      voiceName: 'Puck',
      style: 'enthusiastic advertisement'
    },
    difficulty_rating: 3
  },

  // Q3: Word Cloud (Foundation)
  {
    question_number: 3,
    question_type: 'word-cloud',
    section: 'A',
    title: 'Hugo is talking about his holidays',
    instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
    audio_text: `Ich heiße Hugo und ich liebe Ferien. Wenn ich in den Urlaub fahre, reise ich immer mit dem Flugzeug, weil es schneller ist. Ich bleibe lieber in der Nähe des Strandes, weil ich gerne schwimme und mich sonne. Das Wetter ist im Sommer oft sehr heiß, dann reise ich normalerweise.`,
    audio_transcript: 'Hugo talking about his holiday preferences',
    question_data: {
      prompt: 'What does Hugo say about his holidays?',
      wordCloud: ['Strand', 'Berge', 'Hotel', 'Camping', 'Flugzeug', 'Zug', 'Auto', 'Boot', 'Sonne', 'Regen', 'Hitze', 'Kälte'],
      questions: [
        {
          id: 'q3a',
          textBefore: 'When Hugo goes on holiday, he goes by',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q3b',
          textBefore: 'He prefers to stay near the',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q3c',
          textBefore: 'The weather is usually',
          textAfter: '.',
          marks: 1
        }
      ]
    },
    marks: 3,
    theme: 'Local area, holiday and travel',
    topic: 'Holidays',
    tts_config: {
      voiceName: 'Kore',
      style: 'conversational'
    },
    difficulty_rating: 3
  },

  // Q4: Multiple Response (Foundation)
  {
    question_number: 4,
    question_type: 'multiple-response',
    section: 'A',
    title: 'Lena is talking about what she watches on TV',
    instructions: 'What type of programmes does she mention? Listen to the recording and put a cross in each one of the three correct boxes.',
    audio_text: `Hallo, ich bin Lena. Ich schaue abends sehr gerne fern. Meine Lieblingssendungen sind Abenteuerfilme, weil sie sehr spannend sind. Ich schaue auch viele Filme, besonders am Wochenende. Und natürlich schaue ich immer die Nachrichten, um zu wissen, was in der Welt passiert.`,
    audio_transcript: 'Lena discussing her TV viewing preferences',
    question_data: {
      prompt: 'What type of programmes does Lena mention?',
      options: [
        { letter: 'A', text: 'adventure' },
        { letter: 'B', text: 'films' },
        { letter: 'C', text: 'sport' },
        { letter: 'D', text: 'music' },
        { letter: 'E', text: 'news' },
        { letter: 'F', text: 'cooking' }
      ]
    },
    marks: 3,
    theme: 'Identity and culture',
    topic: 'Media and technology',
    tts_config: {
      voiceName: 'Rasalgethi',
      style: 'friendly conversation'
    },
    difficulty_rating: 3
  },

  // Q5: Multiple Choice (Foundation)
  {
    question_number: 5,
    question_type: 'multiple-choice',
    section: 'A',
    title: 'David, Lisa and Peter are talking about the environment',
    instructions: 'What do they say? Listen to the recording and complete the sentences by putting a cross in the correct box for each question.',
    audio_text: `David: Meine Stadt hat ein ernstes Problem. Es ist im Sommer zu heiß, es ist unerträglich.

Lisa: Meiner Meinung nach ist das größte Problem die Luftverschmutzung. Es gibt zu viele Autos auf den Straßen.

Peter: Ich wohne in Berlin und es gibt sehr viele Züge und U-Bahnen. Die öffentlichen Verkehrsmittel sind ausgezeichnet.`,
    audio_transcript: 'Three people discussing environmental issues in their cities',
    question_data: {
      questions: [
        {
          id: 'q5a',
          question: 'David\'s city is too ...',
          options: [
            { letter: 'A', text: 'cold' },
            { letter: 'B', text: 'windy' },
            { letter: 'C', text: 'hot' }
          ]
        },
        {
          id: 'q5b',
          question: 'Lisa thinks there is a problem with ...',
          options: [
            { letter: 'A', text: 'water' },
            { letter: 'B', text: 'recycling' },
            { letter: 'C', text: 'pollution' }
          ]
        },
        {
          id: 'q5c',
          question: 'Peter says in Berlin there are lots of ...',
          options: [
            { letter: 'A', text: 'trains' },
            { letter: 'B', text: 'bicycles' },
            { letter: 'C', text: 'cars' }
          ]
        },
        {
          id: 'q5d',
          question: 'The speakers agree that the solution is to ...',
          options: [
            { letter: 'A', text: 'use more renewable energy' },
            { letter: 'B', text: 'reduce car usage' },
            { letter: 'C', text: 'plant more trees' }
          ]
        }
      ]
    },
    marks: 4,
    theme: 'Global issues',
    topic: 'Environment',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'David', voiceName: 'Puck' },
        { name: 'Lisa', voiceName: 'Aoede' },
        { name: 'Peter', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 3
  },

  // Q6: Open Response A (Foundation)
  {
    question_number: 6,
    question_type: 'open-response-a',
    section: 'A',
    title: 'Lucas, Paul and Rashid are talking about their hobbies',
    instructions: 'What do they say? Write your answers in English. Complete sentences are not required.',
    audio_text: `Lucas: Mein Lieblingshobby ist Gitarre spielen. Ich übe jeden Tag nach der Schule.

Paul: Ich spiele am Wochenende sehr gerne Fußball mit meinen Freunden im Park.

Rashid: Ich lese lieber Abenteuerbücher. Das ist sehr entspannend und ich lerne viele neue Dinge.`,
    audio_transcript: 'Three people discussing their hobbies',
    question_data: {
      prompt: 'Listen and complete the gaps about their hobbies.',
      topic: 'Hobbies and interests',
      speakers: [
        {
          id: 'lucas',
          name: 'Lucas',
          gaps: [
            {
              id: 'lucas_hobby',
              label: 'Hobby'
            }
          ]
        },
        {
          id: 'paul',
          name: 'Paul',
          gaps: [
            {
              id: 'paul_hobby',
              label: 'Hobby'
            }
          ]
        },
        {
          id: 'rachid',
          name: 'Rashid',
          gaps: [
            {
              id: 'rachid_hobby',
              label: 'Hobby'
            }
          ]
        }
      ]
    },
    marks: 3,
    theme: 'Identity and culture',
    topic: 'Free time activities',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Lucas', voiceName: 'Puck' },
        { name: 'Paul', voiceName: 'Kore' },
        { name: 'Rashid', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 3
  }
      ], // End of German foundation questions

      // German Crossover Questions (Foundation Q7-Q10 = Higher Q1-Q4)
      crossover: [
        // Foundation Q7 = Higher Q1: Multiple Choice
        {
    foundation_number: 7,
    higher_number: 1,
    question_type: 'multiple-choice',
    section: 'A',
    title: 'Max and Lisa are discussing environmental issues',
    instructions: 'What do they say? Listen to the recording and complete the sentences by selecting the correct letter.',
    audio_text: `Max: Ich denke, das größte Problem ist die Luftverschmutzung. Autos produzieren zu viele giftige Gase.

Lisa: Ich stimme zu, aber ich denke auch, dass wir mehr öffentliche Verkehrsmittel nutzen sollten. Es ist besser für die Umwelt.`,
    audio_transcript: 'Max and Lisa discussing environmental problems and solutions',
    question_data: {
      questions: [
        {
          id: 'q_crossover_1a',
          question: 'Max thinks the biggest problem is',
          options: [
            { letter: 'A', text: 'air pollution' },
            { letter: 'B', text: 'water contamination' },
            { letter: 'C', text: 'noise pollution' }
          ]
        },
        {
          id: 'q_crossover_1b',
          question: 'Lisa suggests we should',
          options: [
            { letter: 'A', text: 'use public transport more' },
            { letter: 'B', text: 'recycle everything' },
            { letter: 'C', text: 'buy less plastic' }
          ]
        },
        {
          id: 'q_crossover_1c',
          question: 'Both speakers are concerned about',
          options: [
            { letter: 'A', text: 'the economy' },
            { letter: 'B', text: 'the environment' },
            { letter: 'C', text: 'public health' }
          ]
        }
      ]
    },
    marks: 3,
    theme: 'Global issues',
    topic: 'Environment',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Max', voiceName: 'Puck' },
        { name: 'Lisa', voiceName: 'Aoede' }
      ]
    },
    difficulty_rating: 4
  },

  // Foundation Q8 = Higher Q2: Word Cloud
  {
    foundation_number: 8,
    higher_number: 2,
    question_type: 'word-cloud',
    section: 'A',
    title: 'Sascha is talking in a podcast about his city',
    instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
    audio_text: `Hallo, ich bin Sascha und ich wohne in Köln. Mein Lieblingsort in der Stadt ist das Museum für moderne Kunst. Es hat eine unglaubliche Sammlung. Wenn Sie nach Köln kommen, empfehle ich Ihnen, zum Markt zu gehen. Er ist sehr authentisch und traditionell. Und natürlich müssen Sie die lokale Küche probieren. Es ist das berühmteste Gericht unserer Region.`,
    audio_transcript: 'Sascha talking about his city Cologne in a podcast',
    question_data: {
      prompt: 'What does he say about his city?',
      wordCloud: ['Museum für moderne Kunst', 'Strand', 'Einkaufszentrum', 'Park', 'lokale Küche', 'Pommes frites', 'Fisch', 'Theater', 'Bibliothek', 'Stadion', 'Markt'],
      questions: [
        {
          id: 'q_crossover_2a',
          textBefore: 'Sascha\'s favourite place is the',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q_crossover_2b',
          textBefore: 'He recommends you go to the',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q_crossover_2c',
          textBefore: 'You can eat',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q_crossover_2d',
          textBefore: 'The city is famous for its',
          textAfter: '.',
          marks: 1
        },
        {
          id: 'q_crossover_2e',
          textBefore: 'Tourists should visit the',
          textAfter: '.',
          marks: 1
        }
      ]
    },
    marks: 5,
    theme: 'Local area, holiday and travel',
    topic: 'Town and region',
    tts_config: {
      voiceName: 'Kore',
      style: 'podcast conversational'
    },
    difficulty_rating: 4
  },

  // Foundation Q9 = Higher Q3: Multiple Response
  {
    foundation_number: 9,
    higher_number: 3,
    question_type: 'multiple-response',
    section: 'A',
    title: 'Listen to Lea talking about her school subjects',
    instructions: 'What subjects does she mention? Select the three correct letters.',
    audio_text: `Ich heiße Lea und bin in der 10. Klasse. Dieses Jahr lerne ich viele Fächer. Mathe ist sehr schwer, aber notwendig. Ich habe auch Geschichte, was ich sehr interessant finde, weil wir etwas über die Vergangenheit lernen. Und natürlich lerne ich Englisch, weil ich in Zukunft um die Welt reisen möchte. Mein Lieblingsfach ist Biologie, weil mich die Natur fasziniert.`,
    audio_transcript: 'Lea discussing her school subjects',
    question_data: {
      prompt: 'What subjects does Lea mention?',
      options: [
        { letter: 'A', text: 'mathematics' },
        { letter: 'B', text: 'geography' },
        { letter: 'C', text: 'history' },
        { letter: 'D', text: 'English' },
        { letter: 'E', text: 'biology' },
        { letter: 'F', text: 'chemistry' }
      ]
    },
    marks: 3,
    theme: 'School',
    topic: 'School subjects',
    tts_config: {
      voiceName: 'Rasalgethi',
      style: 'student conversation'
    },
    difficulty_rating: 4
  },

  // Foundation Q10 = Higher Q4: Multiple Choice
  {
    foundation_number: 10,
    higher_number: 4,
    question_type: 'multiple-choice',
    section: 'A',
    title: 'Listen to Robert talking about his future plans',
    instructions: 'What does he say? Listen to the recording and complete the sentences by selecting the correct letter.',
    audio_text: `Ich heiße Robert und bin siebzehn Jahre alt. Nächstes Jahr möchte ich Medizin an der Universität studieren. Ich wollte schon immer Arzt werden, um Menschen zu helfen. Nach meinem Studium würde ich gerne in einem öffentlichen Krankenhaus arbeiten. Ich denke, es ist wichtig, der Gemeinschaft zu dienen.`,
    audio_transcript: 'Robert discussing his future career plans',
    question_data: {
      questions: [
        {
          id: 'q_crossover_4a',
          question: 'Next year Robert wants to study',
          options: [
            { letter: 'A', text: 'engineering' },
            { letter: 'B', text: 'medicine' },
            { letter: 'C', text: 'law' }
          ]
        },
        {
          id: 'q_crossover_4b',
          question: 'After university, he would like to work in',
          options: [
            { letter: 'A', text: 'a private clinic' },
            { letter: 'B', text: 'a public hospital' },
            { letter: 'C', text: 'a research center' }
          ]
        },
        {
          id: 'q_crossover_4c',
          question: 'Robert wants to be a doctor because he wants to',
          options: [
            { letter: 'A', text: 'earn good money' },
            { letter: 'B', text: 'help people' },
            { letter: 'C', text: 'travel the world' }
          ]
        },
        {
          id: 'q_crossover_4d',
          question: 'Robert believes it is important to',
          options: [
            { letter: 'A', text: 'serve the community' },
            { letter: 'B', text: 'work internationally' },
            { letter: 'C', text: 'continue studying' }
          ]
        }
      ]
    },
    marks: 4,
    theme: 'Future aspirations, study and work',
    topic: 'Career choices and ambitions',
    tts_config: {
      voiceName: 'Puck',
      style: 'thoughtful and mature'
    },
    difficulty_rating: 4
  }
      ], // End of German crossover questions

      // German Higher-only questions (Q5-Q9 for Higher tier)
      higher: [
        // Higher Q5: Open Response A
        {
    question_number: 5,
    question_type: 'open-response-a',
    section: 'A',
    title: 'Listen to three people talking about technology',
    instructions: 'What do they say? Write your answers in English. Complete sentences are not required.',
    audio_text: `Person 1: Ich benutze mein Smartphone für alles: soziale Medien, Musik, Fotos. Ich kann nicht ohne leben.

Person 2: Ich bevorzuge meinen Laptop zum Arbeiten. Er ist bequemer, um lange Dokumente zu schreiben.

Person 3: Ich liebe mein Tablet, um digitale Bücher zu lesen. Es ist perfekt zum Reisen.`,
    audio_transcript: 'Three people discussing their preferred technology devices',
    question_data: {
      prompt: 'Listen and complete the gaps about technology use.',
      topic: 'Technology and devices',
      speakers: [
        {
          id: 'person1',
          name: 'Person 1',
          gaps: [
            {
              id: 'person1_device',
              label: 'Preferred device'
            }
          ]
        },
        {
          id: 'person2',
          name: 'Person 2',
          gaps: [
            {
              id: 'person2_device',
              label: 'Preferred device'
            }
          ]
        },
        {
          id: 'person3',
          name: 'Person 3',
          gaps: [
            {
              id: 'person3_device',
              label: 'Preferred device'
            }
          ]
        }
      ]
    },
    marks: 3,
    theme: 'Identity and culture',
    topic: 'Media and technology',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Person 1', voiceName: 'Aoede' },
        { name: 'Person 2', voiceName: 'Puck' },
        { name: 'Person 3', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 5
  },

  // Higher Q6: Word Cloud
  {
    question_number: 6,
    question_type: 'word-cloud',
    section: 'A',
    title: 'Listen to a report about healthy living',
    instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
    audio_text: `Laut einer neuen Studie ist es für ein gesundes Leben unerlässlich, regelmäßig Sport zu treiben. Experten empfehlen, mindestens dreißig Minuten pro Tag zu gehen. Es ist auch wichtig, sich ausgewogen zu ernähren, mit viel frischem Gemüse und Obst. Schließlich ist es für die Erholung des Körpers unerlässlich, acht Stunden pro Nacht zu schlafen.`,
    audio_transcript: 'Health report about maintaining a healthy lifestyle',
    question_data: {
      prompt: 'What does the report say about healthy living?',
      wordCloud: ['Übung', 'gehen', 'laufen', 'schwimmen', 'Gemüse', 'Fleisch', 'Fisch', 'schlafen', 'arbeiten', 'studieren', 'sich entspannen'],
      questions: [
        {
          id: 'q6a',
          textBefore: 'To maintain a healthy life, it\'s fundamental to do',
          textAfter: 'regularly.',
          marks: 1
        },
        {
          id: 'q6b',
          textBefore: 'Experts recommend',
          textAfter: 'at least thirty minutes a day.',
          marks: 1
        },
        {
          id: 'q6c',
          textBefore: 'A balanced diet should include',
          textAfter: 'and fresh fruits.',
          marks: 1
        },

      ]
    },
    marks: 3,
    theme: 'Identity and culture',
    topic: 'Healthy living and lifestyle',
    tts_config: {
      voiceName: 'Rasalgethi',
      style: 'news report professional'
    },
    difficulty_rating: 5
  },

  // Higher Q7: Open Response B (Example B format)
  {
    question_number: 7,
    question_type: 'open-response-b',
    section: 'A',
    title: 'Listen to Julian and Amira talking about their preferences',
    instructions: 'Listen to the recording and complete the following tables in English. You do not need to write in full sentences.',
    audio_text: `Julian: Ich mag Fußball sehr, weil es sehr aufregend ist. Ich mag auch Rockmusik. Aber ich mag überhaupt kein scharfes Essen, es ist zu stark für mich.

Amira: Ich bevorzuge Schwimmen, weil es sehr entspannend ist. Ich lese in meiner Freizeit gerne Liebesromane. Aber ich kann den Lärm der Stadt nicht ertragen, ich bevorzuge die Ruhe.

Max: Ich bin fasziniert vom Reisen und dem Kennenlernen neuer Kulturen. Ich genieße es auch, traditionelle Gerichte zu kochen. Allerdings mag ich die Kälte des Winters nicht, ich bevorzuge warmes Wetter.`,
    audio_transcript: 'Julian, Amira and Max discussing their likes and dislikes',
    question_data: {
      topic: 'Personal preferences',
      speakers: [
        {
          id: 'julien',
          name: 'Julian',
          likes: {
            id: 'julien_likes',
            textBefore: 'likes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          },
          dislikes: {
            id: 'julien_dislikes',
            textBefore: 'dislikes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          }
        },
        {
          id: 'amira',
          name: 'Amira',
          likes: {
            id: 'amira_likes',
            textBefore: 'likes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          },
          dislikes: {
            id: 'amira_dislikes',
            textBefore: 'dislikes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          }
        },
        {
          id: 'max',
          name: 'Max',
          likes: {
            id: 'max_likes',
            textBefore: 'likes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          },
          dislikes: {
            id: 'max_dislikes',
            textBefore: 'dislikes',
            textAfter: '............................................................................................................................... (1)',
            marks: 1
          }
        }
      ]
    },
    marks: 6,
    theme: 'Identity and culture',
    topic: 'Leisure, free time, media, technology',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Julian', voiceName: 'Puck' },
        { name: 'Amira', voiceName: 'Aoede' },
        { name: 'Max', voiceName: 'Kore' }
      ]
    },
    difficulty_rating: 4
  },

  // Higher Q8: Two-part Multiple Choice (6 marks total)
  {
    question_number: 8,
    question_type: 'multi-part',
    section: 'A',
    title: 'Listen to discussions about work and technology',
    instructions: 'Listen to the recording and complete both parts.',
    audio_text: `Teil A:
Person A: Was denkst du über Heimarbeit?
Person B: Ich finde es sehr praktisch, weil ich Zeit beim Pendeln spare.
Person C: Ja, aber ich vermisse die Interaktion mit den Kollegen.

Teil B:
Person D: Künstliche Intelligenz wird viele Jobs verändern.
Person E: Das stimmt, aber sie wird auch neue Möglichkeiten schaffen.
Person F: Wichtig ist, sich anzupassen und weiter zu lernen.`,
    audio_transcript: 'Two discussions about remote work and AI impact on jobs',
    question_data: {
      parts: [
        {
          id: 'part_a',
          type: 'multiple-choice',
          title: '8(a) Remote work discussion',
          instructions: 'What do they say about remote work? Select the correct letter for each question.',
          marks: 3,
          questions: [
            {
              id: 'q8a_i',
              question: '(i) Person B thinks remote work is convenient because...',
              options: [
                { letter: 'A', text: 'it saves commuting time' },
                { letter: 'B', text: 'it is more productive' },
                { letter: 'C', text: 'it is less stressful' }
              ],
              marks: 1
            },
            {
              id: 'q8a_ii',
              question: '(ii) Person C misses...',
              options: [
                { letter: 'A', text: 'the office environment' },
                { letter: 'B', text: 'interaction with colleagues' },
                { letter: 'C', text: 'face-to-face meetings' }
              ],
              marks: 1
            },
            {
              id: 'q8a_iii',
              question: '(iii) The overall tone of the discussion is...',
              options: [
                { letter: 'A', text: 'negative' },
                { letter: 'B', text: 'balanced' },
                { letter: 'C', text: 'enthusiastic' }
              ],
              marks: 1
            }
          ]
        },
        {
          id: 'part_b',
          type: 'multiple-choice',
          title: '8(b) Technology and jobs discussion',
          instructions: 'What do they say about AI and jobs? Select the correct letter for each question.',
          marks: 3,
          questions: [
            {
              id: 'q8b_i',
              question: '(i) Person D believes AI will...',
              options: [
                { letter: 'A', text: 'eliminate all jobs' },
                { letter: 'B', text: 'change many jobs' },
                { letter: 'C', text: 'improve job satisfaction' }
              ],
              marks: 1
            },
            {
              id: 'q8b_ii',
              question: '(ii) Person E thinks AI will also...',
              options: [
                { letter: 'A', text: 'create new opportunities' },
                { letter: 'B', text: 'reduce working hours' },
                { letter: 'C', text: 'increase salaries' }
              ],
              marks: 1
            },
            {
              id: 'q8b_iii',
              question: '(iii) Person F emphasizes the importance of...',
              options: [
                { letter: 'A', text: 'finding new jobs' },
                { letter: 'B', text: 'adapting and learning' },
                { letter: 'C', text: 'avoiding technology' }
              ],
              marks: 1
            }
          ]
        }
      ]
    },
    marks: 6,
    theme: 'Future aspirations, study and work',
    topic: 'Jobs, career choices and ambitions',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Person 1', voiceName: 'Aoede' },
        { name: 'Person 2', voiceName: 'Puck' },
        { name: 'Person 3', voiceName: 'Kore' },
        { name: 'Person 4', voiceName: 'Rasalgethi' },
        { name: 'Person 5', voiceName: 'Aoede' },
        { name: 'Person 6', voiceName: 'Puck' }
      ]
    },
    difficulty_rating: 5
  },

  // Higher Q9: Two-part question (7 marks total)
  {
    question_number: 9,
    question_type: 'multi-part',
    section: 'A',
    title: 'Social media discussion and youth employment report',
    instructions: 'Listen to the recording and complete both parts.',
    audio_text: `Teil A - Diskussion über soziale Medien:
Person A: Soziale Medien haben unsere Art zu kommunizieren komplett verändert.
Person B: Ja, aber ich denke auch, dass wir zu viel Zeit damit verbringen, auf Bildschirme zu starren.
Person C: Das stimmt, wir sollten ihre Nutzung einschränken und mehr Aktivitäten im Freien machen.

Teil B - Bericht über Jugendarbeitslosigkeit:
Eine neue Studie zeigt, dass die Jugendarbeitslosigkeit in diesem Jahr deutlich gesunken ist. Die Sektoren, die den meisten jungen Leuten Arbeit bieten, sind Technologie, Tourismus und Gesundheitswesen. Die Regierung hat Berufsbildungsprogramme eingeführt, um den Berufseinstieg zu erleichtern.`,
    audio_transcript: 'Social media discussion followed by youth employment report',
    question_data: {
      parts: [
        {
          id: 'part_a',
          type: 'multiple-choice',
          title: '9(a) Social media discussion',
          instructions: 'What do they say about social media? Select the correct letter for each question.',
          marks: 3,
          questions: [
            {
              id: 'q9a_i',
              question: '(i) Person A thinks social media has...',
              options: [
                { letter: 'A', text: 'completely changed communication' },
                { letter: 'B', text: 'improved relationships' },
                { letter: 'C', text: 'reduced face-to-face contact' }
              ],
              marks: 1
            },
            {
              id: 'q9a_ii',
              question: '(ii) Person B is concerned about...',
              options: [
                { letter: 'A', text: 'privacy issues' },
                { letter: 'B', text: 'too much screen time' },
                { letter: 'C', text: 'fake news' }
              ],
              marks: 1
            },
            {
              id: 'q9a_iii',
              question: '(iii) Person C suggests people should...',
              options: [
                { letter: 'A', text: 'delete social media accounts' },
                { letter: 'B', text: 'limit usage and do outdoor activities' },
                { letter: 'C', text: 'use social media for work only' }
              ],
              marks: 1
            }
          ]
        },
        {
          id: 'part_b',
          type: 'open-response-c',
          title: '9(b) You hear a report on youth employment',
          instructions: 'Listen to the report and answer the questions in English. Complete sentences are not required.',
          marks: 4,
          topic: 'Youth employment',
          questions: [
            {
              id: 'youth_employment_trend',
              question: '(i) What has happened to youth unemployment this year?',
              marks: 1
            },
            {
              id: 'youth_employment_sectors',
              question: '(ii) Name two sectors that offer the most jobs to young people.',
              marks: 2
            },
            {
              id: 'youth_employment_programs',
              question: '(iii) What has the government implemented to help young people find work?',
              marks: 1
            }
          ]
        }
      ]
    },
    marks: 7,
    theme: 'Global issues',
    topic: 'Media and employment',
    tts_config: {
      multiSpeaker: true,
      speakers: [
        { name: 'Personne A', voiceName: 'Puck' },
        { name: 'Personne B', voiceName: 'Aoede' },
        { name: 'Personne C', voiceName: 'Kore' },
        { name: 'Reporter', voiceName: 'Rasalgethi' }
      ]
    },
    difficulty_rating: 5
  }
      ], // End of German higher questions

      // German Dictation Questions (Section B)
      dictation: {
        foundation: {
    question_number: 12,
    question_type: 'dictation',
    section: 'B',
    title: 'Section B: Dictation',
    instructions: 'Listen to each sentence and fill in the missing words. Each sentence is heard three times.',
    audio_text: `Einleitung: Sie werden Sätze über das Schulleben hören.

Satz 1: Ich lerne gerne Geschichte, weil es sehr interessant ist.

Satz 2: In der Pause spielen wir auf dem Schulhof Fußball.

Satz 3: Die Mathelehrerin ist sehr nett und geduldig.

Satz 4: Nach der Schule gehe ich in die Bibliothek, um meine Hausaufgaben zu machen.

Satz 5: Mein Lieblingsfach ist Biologie.

Satz 6: Die Schüler tragen eine blaue Uniform.`,
    audio_transcript: 'Dictation about school life with 6 sentences',
    question_data: {
      subject: 'School life',
      introduction: 'You will hear sentences about school subjects and activities.',
      sentences: [
        {
          id: 's1',
          marks: 2,
          description: 'Two gaps - each to be filled with one word from the vocabulary list',
          gaps: [
            {
              id: 's1g1',
              textBefore: 'Ich lerne gerne',
              textAfter: 'weil es sehr'
            },
            {
              id: 's1g2',
              textBefore: '',
              textAfter: '.'
            }
          ]
        },
        {
          id: 's2',
          marks: 2,
          description: 'Two gaps - one from vocabulary list, one from outside vocabulary list',
          gaps: [
            {
              id: 's2g1',
              textBefore: 'In der Pause spielen wir',
              textAfter: 'auf dem'
            },
            {
              id: 's2g2',
              textBefore: '',
              textAfter: 'Schulhof.'
            }
          ]
        },
        {
          id: 's3',
          marks: 2,
          description: 'Two gaps - one from vocabulary list, one from outside vocabulary list',
          gaps: [
            {
              id: 's3g1',
              textBefore: 'Die',
              textAfter: 'ist sehr nett und'
            },
            {
              id: 's3g2',
              textBefore: '',
              textAfter: '.'
            }
          ]
        },
        {
          id: 's4',
          marks: 2,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's4g1',
              textBefore: '',
            }
          ]
        },
        {
          id: 's5',
          marks: 1,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's5g1',
              textBefore: '',
            }
          ]
        },
        {
          id: 's6',
          marks: 1,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's6g1',
              textBefore: '',
            }
          ]
        }
      ]
    },
    marks: 10,
    theme: 'School',
    topic: 'School subjects',
    tts_config: {
      voiceName: 'Aoede',
      style: 'clearly and slowly for dictation'
    },
    difficulty_rating: 3
  },
  higher: {
    question_number: 10,
    question_type: 'dictation',
    section: 'B',
    title: 'Section B: Dictation',
    instructions: 'Listen to each sentence and fill in the missing words. Each sentence is heard three times.',
    audio_text: `Einleitung: Sie werden Sätze über zukünftige Pläne und berufliche Laufbahnen hören.

Satz 1: Mein Bruder ist sehr glücklich.

Satz 2: Zu viele Filme zu sehen ist schlecht und langweilig.

Satz 3: Um einen guten Job zu bekommen, ist es wichtig, praktische Erfahrung zu haben.

Satz 4: Die jungen Leute von heute haben viele Karrieremöglichkeiten.

Satz 5: Es ist entscheidend, Kommunikationsfähigkeiten für die Arbeitswelt zu entwickeln.

Satz 6: Kontinuierliche Weiterbildung ist für den beruflichen Erfolg in der Zukunft unerlässlich.`,
    audio_transcript: 'Dictation about future plans and careers with 6 sentences',
    question_data: {
      subject: 'Future plans and career',
      introduction: 'You will hear sentences about future plans and career aspirations.',
      sentences: [
        {
          id: 's1',
          marks: 1,
          description: 'Fill in the gaps',
          gaps: [
            {
              id: 's1g1',
              textBefore: 'Mein',
              textAfter: 'ist sehr'
            },
            {
              id: 's1g2',
              textBefore: '',
              textAfter: '.'
            }
          ]
        },
        {
          id: 's2',
          marks: 1,
          description: 'Fill in the gaps',
          gaps: [
            {
              id: 's2g1',
              textBefore: 'Zu viele',
              textAfter: 'ist'
            },
            {
              id: 's2g2',
              textBefore: '',
              textAfter: '.'
            }
          ]
        },
        {
          id: 's3',
          marks: 2,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's3g1',
              textBefore: '',
            }
          ]
        },
        {
          id: 's4',
          marks: 2,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's4g1',
              textBefore: '',
            }
          ]
        },
        {
          id: 's5',
          marks: 2,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's5g1',
              textBefore: '',
            }
          ]
        },
        {
          id: 's6',
          marks: 2,
          description: 'Complete sentence - write out the whole sentence',
          gaps: [
            {
              id: 's6g1',
              textBefore: '',
            }
          ]
        }
      ]
    },
    marks: 10,
    theme: 'Future aspirations, study and work',
    topic: 'Career choices and ambitions',
    tts_config: {
      voiceName: 'Puck',
      style: 'clearly and slowly for dictation'
    },
    difficulty_rating: 5
  }
    } // End of German dictation object
  }; // End of German questions object

// Main population function
async function populateEdexcelListeningAssessments() {
  try {
    console.log('🎧 Starting Edexcel Listening Assessment population...\n');

    console.log('📝 Adding Paper 2 assessments (keeping existing data)\n');

    // Create assessments for each language and tier
    for (const lang of languages) {
      for (const tier of tiers) {
        console.log(`📚 Creating ${lang.name} ${tier.level} listening assessment...`);

        const assessment = {
          title: `Edexcel GCSE ${lang.name} ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Listening Paper 2`,
          description: `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level Edexcel-style ${lang.name} listening assessment with audio generated by Gemini TTS`,
          level: tier.level,
          language: lang.code,
          identifier: 'paper-2',
          version: '1.0',
          total_questions: tier.totalQuestions,
          time_limit_minutes: tier.timeLimit,
          total_marks: 50,
          section_a_marks: 40,
          section_b_marks: 10,
          is_active: true
        };

        const { data: assessmentData, error: assessmentError } = await supabase
          .from('edexcel_listening_assessments')
          .insert(assessment)
          .select('id')
          .single();

        if (assessmentError) {
          console.error(`❌ Error creating ${lang.name} ${tier.level} assessment:`, assessmentError);
          continue;
        }

        console.log(`✅ Created ${lang.name} ${tier.level} assessment:`, assessmentData.id);

        // Remove unsupported fields and add assessment_id
        const baseQuestions = removeUnsupportedFields(germanQuestions.foundation);
        const baseCrossover = removeUnsupportedFields(germanQuestions.crossover);
        const baseHigher = removeUnsupportedFields(germanQuestions.higher);
        const baseDictation = removeUnsupportedFields([germanQuestions.dictation.foundation, germanQuestions.dictation.higher]);

        // Build questions for this tier
        let questionsToInsert = [];

        if (tier.level === 'foundation') {
          // Foundation: Q1-Q6 (foundation-only) + Q7-Q10 (crossover) + Q11 (foundation-only) + Q12 (dictation)

          // Add foundation-only questions (Q1-Q6)
          questionsToInsert.push(...baseQuestions.map(q => ({
            ...q,
            assessment_id: assessmentData.id
          })));

          // Add crossover questions as Q7-Q10
          questionsToInsert.push(...baseCrossover.map(q => {
            const { foundation_number, higher_number, ...cleanQuestion } = q;
            return {
              ...cleanQuestion,
              question_number: foundation_number,
              assessment_id: assessmentData.id
            };
          }));

          // Add Q11 (Multi-part: Open Response C + Open Response B) - Foundation only
          const q11Text = `Laut einem neuen Bericht ist der Umweltschutz eine dringende Priorität. Die Wissenschaftler empfehlen, den Gebrauch von Einwegplastik zu reduzieren und das Recycling zu erhöhen.

Julian: Ich mag Fußball sehr, weil es sehr aufregend ist und ich mit meinen Freunden spielen kann.

Amira: Ich lese lieber Bücher, weil es entspannend ist, aber ich schaue nicht gern fern, weil es langweilig ist.`;

          questionsToInsert.push({
            question_number: 11,
            question_type: 'multi-part',
            section: 'A',
            title: 'Environmental report and preferences discussion',
            instructions: 'Listen to the recording and complete both parts.',
            audio_text: q11Text,
            audio_transcript: 'Environmental report followed by preferences discussion',
            question_data: {
              parts: [
                {
                  id: 'part_a',
                  type: 'open-response-c',
                  title: '11(a) You hear a report on environmental protection',
                  instructions: 'Listen to the report and answer the questions in English. Complete sentences are not required.',
                  marks: 2,
                  topic: 'Environmental protection',
                  questions: [
                    {
                      id: 'env_priority',
                      question: '(i) What is described as an urgent priority?',
                      marks: 1
                    },
                    {
                      id: 'env_recommendation',
                      question: '(ii) What do scientists recommend about plastic?',
                      marks: 1
                    }
                  ]
                },
                {
                  id: 'part_b',
                  type: 'open-response-b',
                  title: '11(b) Listen to Julian and Amira talking about their preferences',
                  instructions: 'Listen to the recording and complete the following table in English. You do not need to write in full sentences.',
                  marks: 4,
                  speakers: [
                    {
                      id: 'julien',
                      name: 'Julian',
                      likes: {
                        id: 'julien_likes',
                        marks: 1
                      },
                      dislikes: {
                        id: 'julien_dislikes',
                        marks: 1
                      }
                    },
                    {
                      id: 'amira',
                      name: 'Amira',
                      likes: {
                        id: 'amira_likes',
                        marks: 1
                      },
                      dislikes: {
                        id: 'amira_dislikes',
                        marks: 1
                      }
                    }
                  ]
                }
              ]
            },
            marks: 6,
            theme: 'Global issues',
            topic: 'Environment',
            tts_config: {
              voiceName: 'Rasalgethi',
              style: 'news report'
            },
            assessment_id: assessmentData.id
          });

          // Add dictation (Q12)
          questionsToInsert.push({
            ...baseDictation[0], // foundation dictation
            assessment_id: assessmentData.id
          });

        } else {
          // Higher: Q1-Q4 (crossover) + Q5-Q7 (higher-only) + Q8 (two-part MC) + Q9 (two-part MC+ORC) + Q10 (dictation)

          // Add crossover questions as Q1-Q4
          questionsToInsert.push(...baseCrossover.map(q => {
            const { foundation_number, higher_number, ...cleanQuestion } = q;
            return {
              ...cleanQuestion,
              question_number: higher_number,
              assessment_id: assessmentData.id
            };
          }));

          // Add higher-only questions (Q5-Q9)
          questionsToInsert.push(...baseHigher.map(q => ({
            ...q,
            assessment_id: assessmentData.id
          })));


          // Add dictation (Q10)
          questionsToInsert.push({
            ...baseDictation[1], // higher dictation
            assessment_id: assessmentData.id
          });
        }

        // Insert all questions for this assessment
        const { error: questionsError } = await supabase
          .from('edexcel_listening_questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error(`❌ Error inserting questions for ${lang.name} ${tier.level}:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${questionsToInsert.length} questions for ${lang.name} ${tier.level}\n`);
      }
    }

    console.log('\n🎉 Edexcel Listening Assessment population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Languages: ${languages.length} (${languages.map(l => l.name).join(', ')})`);
    console.log(`- Tiers: ${tiers.length} (${tiers.map(t => t.level).join(', ')})`);
    console.log(`- Total assessments created: ${languages.length * tiers.length}`);
    console.log(`- Foundation questions per assessment: ${tiers.find(t => t.level === 'foundation')?.totalQuestions}`);
    console.log(`- Higher questions per assessment: ${tiers.find(t => t.level === 'higher')?.totalQuestions}`);
    console.log(`- Crossover questions: 4 (Foundation Q7-Q10 = Higher Q1-Q4)`);
    console.log(`- Total unique questions: 28 (6 foundation + 4 crossover + 3 higher + 2 dictation + 2 Q11 + 2 Q8,Q9 + other language variants)`);

  } catch (error) {
    console.error('❌ Error populating Edexcel listening assessments:', error);
  }
}

// Run the population if this script is executed directly
if (require.main === module) {
  populateEdexcelListeningAssessments()
    .then(() => {
      console.log('\n✅ Population script completed');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Population script failed:', error);
      process.exit(1);
    });
}

export { populateEdexcelListeningAssessments };
