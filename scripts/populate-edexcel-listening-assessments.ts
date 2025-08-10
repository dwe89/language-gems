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

// Base German questions (translated from the Spanish/French version)
const germanQuestions = {
  foundation: [
    // Q1: Multiple Choice (Foundation) - Topic: Daily routines
    {
      question_number: 1,
      question_type: 'multiple-choice',
      section: 'A',
      title: 'Julia talks about her morning routine',
      instructions: 'What does she say? Listen to the recording and complete the sentences by selecting the correct letter.',
      audio_text: `Hallo, ich heiße Julia. Jeden Morgen stehe ich um halb sieben auf. Um fit zu bleiben, gehe ich zu Tanzkursen im Sportzentrum. Es macht viel Spaß und ich liebe die Musik. Nach dem Frühstück lese ich normalerweise die Zeitung, während ich meinen Kaffee trinke. Ich informiere mich gerne über die Neuigkeiten des Tages.`,
      audio_transcript: 'Julia describes her morning routine',
      question_data: {
        questions: [
          {
            id: 'q1a',
            question: 'Every morning to stay in shape, Julia...',
            options: [
              { letter: 'A', text: 'goes shopping' },
              { letter: 'B', text: 'goes to a dance class' },
              { letter: 'C', text: 'walks in the park' }
            ]
          },
          {
            id: 'q1b',
            question: 'After breakfast, she usually...',
            options: [
              { letter: 'A', text: 'reads the newspaper' },
              { letter: 'B', text: 'watches television' },
              { letter: 'C', text: 'listens to music' }
            ]
          },
          {
            id: 'q1c',
            question: 'Julia likes to be informed about...',
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

    // Q2: Multiple Response (Foundation) - Topic: Tourist attractions, places in town
    {
      question_number: 2,
      question_type: 'multiple-response',
      section: 'A',
      title: 'Listen to this advert promoting a German city',
      instructions: 'What is mentioned? Select the three correct letters.',
      audio_text: `Willkommen in der Stadt Frankfurt! Unsere schöne Stadt bietet alles, was Sie für einen perfekten Urlaub brauchen. Wir haben ausgezeichnete öffentliche Verkehrsmittel, die alle Sehenswürdigkeiten miteinander verbinden. Sie finden eine große Auswahl an Restaurants, in denen Sie die köstliche lokale Küche probieren können. Für Ihre Einkäufe besuchen Sie unser modernes Einkaufszentrum mit den besten Marken. Und natürlich genießen Sie unser Klima mit mehr als 200 Sonnentagen im Jahr.`,
      audio_transcript: 'Advertisement for Frankfurt promoting town facilities',
      question_data: {
        prompt: 'What facilities does the town offer?',
        options: [
          { letter: 'A', text: 'public transport' },
          { letter: 'B', text: 'beaches' },
          { letter: 'C', text: 'places to eat' },
          { letter: 'D', text: 'accommodation' },
          { letter: 'E', text: 'shopping' },
          { letter: 'F', text: 'the weather' }
        ]
      },
      marks: 3,
      theme: 'Local area, holiday and travel',
      topic: 'Tourist attractions, places in town',
      tts_config: {
        voiceName: 'Puck',
        style: 'enthusiastic advertisement'
      }
    },

    // Q3: Word Cloud (Foundation) - Topic: Holidays
    {
      question_number: 3,
      question_type: 'word-cloud',
      section: 'A',
      title: 'Hugo talks about his holidays',
      instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
      audio_text: `Ich heiße Hugo und ich liebe Ferien. Wenn ich in den Urlaub fahre, reise ich immer mit dem Flugzeug, weil es schneller ist. Ich bleibe lieber in der Nähe des Strandes, weil ich gerne schwimme und mich sonne. Das Wetter ist im Sommer oft sehr heiß, dann reise ich normalerweise.`,
      audio_transcript: 'Hugo talking about his holiday preferences',
      question_data: {
        prompt: 'What does Hugo say about his holidays?',
        wordCloud: ['beach', 'mountains', 'hotel', 'camping', 'plane', 'train', 'car', 'boat', 'sun', 'rain', 'heat', 'cold'],
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
      }
    },

    // Q4: Multiple Response (Foundation) - Topic: TV and film, sports
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
          { letter: 'B', text: 'documentaries' },
          { letter: 'C', text: 'sports' },
          { letter: 'D', text: 'music' },
          { letter: 'E', text: 'news' },
          { letter: 'F', text: 'cooking' }
        ]
      },
      marks: 3,
      theme: 'Identity and culture',
      topic: 'TV and film, sports',
      tts_config: {
        voiceName: 'Rasalgethi',
        style: 'friendly conversation'
      }
    },

    // Q5: Multiple Choice (Foundation) - Topic: Environmental issues
    {
      question_number: 5,
      question_type: 'multiple-choice',
      section: 'A',
      title: 'David, Lisa and Peter are talking about the environment',
      instructions: 'What do they say? Listen to the recording and complete the sentences by putting a cross in the correct box for each question.',
      audio_text: `David: Die Umweltverschmutzung ist ein ernstes Problem. Autos sind die Hauptursache.
Lisa: Meiner Meinung nach ist das größte Problem der Müll.
Peter: Ich recycle alles zu Hause, um die Umwelt zu schützen.`,
      audio_transcript: 'Three people discussing environmental issues in their cities',
      question_data: {
        questions: [
          {
            id: 'q5a',
            question: 'David thinks the biggest problem is...',
            options: [
              { letter: 'A', text: 'water pollution' },
              { letter: 'B', text: 'noise pollution' },
              { letter: 'C', text: 'car pollution' }
            ]
          },
          {
            id: 'q5b',
            question: 'Lisa is concerned about...',
            options: [
              { letter: 'A', text: 'rubbish' },
              { letter: 'B', text: 'recycling' },
              { letter: 'C', text: 'air pollution' }
            ]
          },
          {
            id: 'q5c',
            question: 'Peter says he...',
            options: [
              { letter: 'A', text: 'recycles everything' },
              { letter: 'B', text: 'uses public transport' },
              { letter: 'C', text: 'plants trees' }
            ]
          }
        ]
      },
      marks: 3,
      theme: 'Global issues',
      topic: 'Environmental issues',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'David', voiceName: 'Puck' },
          { name: 'Lisa', voiceName: 'Aoede' },
          { name: 'Peter', voiceName: 'Kore' }
        ],
        style: 'conversational'
      }
    },

    // Q6: Open Response A (Foundation) - Topic: Hobbies
    {
      question_number: 6,
      question_type: 'open-response-a',
      section: 'A',
      title: 'Lucas, Paul and Rashid are talking about their hobbies',
      instructions: 'What do they say? Write your answers in English. Complete sentences are not required.',
      audio_text: `Lucas: Mein Lieblingshobby ist Fußball spielen. Ich mache das jedes Wochenende.
Paul: Ich schaue lieber Fernsehserien, das ist sehr entspannend.
Rashid: Ich gehe sehr gerne einkaufen. Ich kaufe sehr gerne Kleidung.`,
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
        ],
        style: 'conversational'
      }
    }
  ], // End of German foundation questions

  // German Crossover Questions (Foundation Q7-Q10 = Higher Q1-Q4)
  crossover: [
    // Foundation Q7 = Higher Q1: Multiple Choice - Topic: Health and environmental issues
    {
      foundation_number: 7,
      higher_number: 1,
      question_type: 'multiple-choice',
      section: 'A',
      title: 'Max and Lisa are discussing environmental and health issues',
      instructions: 'What do they say? Listen to the recording and complete the sentences by selecting the correct letter.',
      audio_text: `Max: Ich denke, die Luftverschmutzung ist das größte Problem. Autos produzieren zu viel Abgas.
Lisa: Ich stimme zu, aber wir sollten auch mehr Sport machen, um unsere Gesundheit zu verbessern.`,
      audio_transcript: 'Max and Lisa discussing environmental problems and solutions',
      question_data: {
        questions: [
          {
            id: 'q_crossover_1a',
            question: 'Max thinks the biggest problem is...',
            options: [
              { letter: 'A', text: 'air pollution' },
              { letter: 'B', text: 'water contamination' },
              { letter: 'C', text: 'noise pollution' }
            ]
          },
          {
            id: 'q_crossover_1b',
            question: 'Lisa suggests we should...',
            options: [
              { letter: 'A', text: 'use public transport more' },
              { letter: 'B', text: 'exercise more' },
              { letter: 'C', text: 'buy less plastic' }
            ]
          },
          {
            id: 'q_crossover_1c',
            question: 'Both speakers are concerned about...',
            options: [
              { letter: 'A', text: 'the economy' },
              { letter: 'B', text: 'health' },
              { letter: 'C', text: 'public transport' }
            ]
          }
        ]
      },
      marks: 3,
      theme: 'Global issues',
      topic: 'Environment, physical well-being',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'Max', voiceName: 'Puck' },
          { name: 'Lisa', voiceName: 'Aoede' }
        ],
        style: 'conversational'
      }
    },

    // Foundation Q8 = Higher Q2: Word Cloud - Topic: Places in town, food
    {
      foundation_number: 8,
      higher_number: 2,
      question_type: 'word-cloud',
      section: 'A',
      title: 'Sascha talks in a podcast about his city',
      instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
      audio_text: `Hallo, ich bin Sascha und ich wohne in einer großen Stadt. Mein Lieblingsort ist der Markt am Hauptplatz. Wenn Sie hierher kommen, empfehle ich Ihnen, die Brezeln zu probieren, sie sind köstlich. Es ist eine sehr traditionelle Stadt.`,
      audio_transcript: 'Sascha talking about his city in a podcast',
      question_data: {
        prompt: 'What does he say about his city?',
        wordCloud: ['market on the main square', 'museum', 'bookshop', 'metro', 'car', 'bicycle', 'pretzels', 'paella', 'churros', 'beaches', 'restaurants'],
        questions: [
          {
            id: 'q_crossover_2a',
            textBefore: 'Sascha\'s favourite place is the',
            textAfter: '.',
            marks: 1
          },
          {
            id: 'q_crossover_2b',
            textBefore: 'He recommends you try...',
            textAfter: '.',
            marks: 1
          },
          {
            id: 'q_crossover_2c',
            textBefore: 'The city is described as being very...',
            textAfter: '.',
            marks: 1
          }
        ]
      },
      marks: 3,
      theme: 'Local area, holiday and travel',
      topic: 'Places in town, food and drink',
      tts_config: {
        voiceName: 'Kore',
        style: 'podcast conversational'
      }
    },

    // Foundation Q9 = Higher Q3: Multiple Response - Topic: School subjects
    {
      foundation_number: 9,
      higher_number: 3,
      question_type: 'multiple-response',
      section: 'A',
      title: 'Listen to Ana talking about her school subjects',
      instructions: 'What subjects does she mention? Select the three correct letters.',
      audio_text: `Ich heiße Ana und ich bin im letzten Jahr der Schule. Meine Lieblingsfächer sind Musik, weil ich gerne singe, und Mathe, weil es eine Herausforderung ist. Ich liebe auch Sport, weil er mich aktiv hält.`,
      audio_transcript: 'Ana discussing her school subjects',
      question_data: {
        prompt: 'What subjects does Ana mention?',
        options: [
          { letter: 'A', text: 'music' },
          { letter: 'B', text: 'geography' },
          { letter: 'C', text: 'mathematics' },
          { letter: 'D', text: 'English' },
          { letter: 'E', text: 'physical education' },
          { letter: 'F', text: 'chemistry' }
        ]
      },
      marks: 3,
      theme: 'School',
      topic: 'School subjects',
      tts_config: {
        voiceName: 'Rasalgethi',
        style: 'student conversation'
      }
    },

    // Foundation Q10 = Higher Q4: Multiple Choice - Topic: Future aspirations
    {
      foundation_number: 10,
      higher_number: 4,
      question_type: 'multiple-choice',
      section: 'A',
      title: 'Listen to Roberto talking about his future plans',
      instructions: 'What does he say? Listen to the recording and complete the sentences by selecting the correct letter.',
      audio_text: `Ich bin Roberto und ich bin sechzehn Jahre alt. Nächstes Jahr möchte ich Kunst studieren. Mein Traum ist es, Maler zu werden und um die Welt zu reisen. Ich denke, es ist wichtig, einen Job zu haben, der mich begeistert.`,
      audio_transcript: 'Roberto discussing his future career plans',
      question_data: {
        questions: [
          {
            id: 'q_crossover_4a',
            question: 'Next year Roberto wants to study...',
            options: [
              { letter: 'A', text: 'engineering' },
              { letter: 'B', text: 'art' },
              { letter: 'C', text: 'law' }
            ]
          },
          {
            id: 'q_crossover_4b',
            question: 'He wants to be a...',
            options: [
              { letter: 'A', text: 'private pilot' },
              { letter: 'B', text: 'doctor' },
              { letter: 'C', text: 'painter' }
            ]
          },
          {
            id: 'q_crossover_4c',
            question: 'He believes it is important to...',
            options: [
              { letter: 'A', text: 'earn a lot of money' },
              { letter: 'B', text: 'love his job' },
              { letter: 'C', text: 'work abroad' }
            ]
          }
        ]
      },
      marks: 3,
      theme: 'Future aspirations, study and work',
      topic: 'Career choices and ambitions',
      tts_config: {
        voiceName: 'Puck',
        style: 'thoughtful and mature'
      }
    }
  ], // End of German crossover questions

  // German Higher-only questions (Q5-Q9 for Higher tier)
  higher: [
    // Higher Q5: Open Response A - Topic: Accommodation
    {
      question_number: 5,
      question_type: 'open-response-a',
      section: 'A',
      title: 'Listen to three people talking about accommodation',
      instructions: 'What do they say? Write your answers in English. Complete sentences are not required.',
      audio_text: `Person 1: Für meinen Urlaub bleibe ich gerne in einem Fünf-Sterne-Hotel mit einem Pool.
Person 2: Ich übernachte lieber auf einem Campingplatz. Das ist eine Möglichkeit, in Kontakt mit der Natur zu sein.
Person 3: Ich bleibe in einer Wohnung. Das ist billiger und gibt mir mehr Freiheit.`,
      audio_transcript: 'Three people discussing their accommodation preferences',
      question_data: {
        prompt: 'Listen and complete the gaps about their accommodation preferences.',
        topic: 'Accommodation',
        speakers: [
          {
            id: 'person1',
            name: 'Person 1',
            gaps: [
              {
                id: 'person1_accommodation',
                label: 'Accommodation'
              }
            ]
          },
          {
            id: 'person2',
            name: 'Person 2',
            gaps: [
              {
                id: 'person2_accommodation',
                label: 'Accommodation'
              }
            ]
          },
          {
            id: 'person3',
            name: 'Person 3',
            gaps: [
              {
                id: 'person3_accommodation',
                label: 'Accommodation'
              }
            ]
          }
        ]
      },
      marks: 3,
      theme: 'Local area, holiday and travel',
      topic: 'Accommodation',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'Person 1', voiceName: 'Aoede' },
          { name: 'Person 2', voiceName: 'Puck' },
          { name: 'Person 3', voiceName: 'Kore' }
        ],
        style: 'conversational'
      }
    },

    // Higher Q6: Word Cloud - Topic: Mental well-being
    {
      question_number: 6,
      question_type: 'word-cloud',
      section: 'A',
      title: 'Listen to a report about mental well-being',
      instructions: 'Complete the gap in each sentence using a word or phrase from the box below. There are more words/phrases than gaps.',
      audio_text: `Für eine gute psychische Gesundheit ist es entscheidend, mit Freunden über seine Gefühle zu sprechen. Es ist auch wichtig, ausreichend zu schlafen. Schließlich hilft die Zeit in der Natur, Stress abzubauen.`,
      audio_transcript: 'Report on mental well-being',
      question_data: {
        prompt: 'What does the report say about mental well-being?',
        wordCloud: ['talk', 'sleep', 'exercise', 'work', 'relax', 'nature', 'city', 'shopping', 'friends', 'family'],
        questions: [
          {
            id: 'q6a',
            textBefore: 'To maintain good mental health, it\'s crucial to',
            textAfter: 'with friends.',
            marks: 1
          },
          {
            id: 'q6b',
            textBefore: 'It is also important to',
            textAfter: 'enough.',
            marks: 1
          },
          {
            id: 'q6c',
            textBefore: 'Spending time in',
            textAfter: 'helps reduce stress.',
            marks: 1
          },
        ]
      },
      marks: 3,
      theme: 'Identity and culture',
      topic: 'Mental well-being',
      tts_config: {
        voiceName: 'Rasalgethi',
        style: 'news report professional'
      }
    },

    // Higher Q7: Open Response B (Example B format) - Topic: Music, TV and film, local area
    {
      question_number: 7,
      question_type: 'open-response-b',
      section: 'A',
      title: 'Listen to three people talking about their preferences',
      instructions: 'Listen to the recording and complete the following tables in English. You do not need to write in full sentences.',
      audio_text: `Person 1: Ich liebe Popmusik. Sie macht mich glücklich. Ich hasse Heavy Metal, es ist zu laut.
Person 2: Ich gehe gerne ins Kino, aber ich mag es nicht, in Schlangen zu stehen.
Person 3: Ich mag den Strand sehr, aber ich mag keine extreme Hitze.`,
      audio_transcript: 'Three people discussing their likes and dislikes',
      question_data: {
        topic: 'Personal preferences',
        speakers: [
          {
            id: 'person1',
            name: 'Person 1',
            likes: {
              id: 'person1_opinion',
              textBefore: 'Likes:',
              textAfter: '............................................................................................................................... (2)',
              marks: 2
            },
            dislikes: {
              id: 'person1_dislikes',
              textBefore: 'Dislikes:',
              textAfter: '............................................................................................................................... (2)',
              marks: 2
            }
          },
          {
            id: 'person2',
            name: 'Person 2',
            likes: {
              id: 'person2_opinion',
              textBefore: 'Likes:',
              textAfter: '............................................................................................................................... (1)',
              marks: 1
            },
            dislikes: {
              id: 'person2_dislikes',
              textBefore: 'Dislikes:',
              textAfter: '............................................................................................................................... (1)',
              marks: 1
            }
          },
          {
            id: 'person3',
            name: 'Person 3',
            likes: {
              id: 'person3_opinion',
              textBefore: 'Likes:',
              textAfter: '............................................................................................................................... (1)',
              marks: 1
            },
            dislikes: {
              id: 'person3_dislikes',
              textBefore: 'Dislikes:',
              textAfter: '............................................................................................................................... (1)',
              marks: 1
            }
          }
        ]
      },
      marks: 8,
      theme: 'Identity and culture',
      topic: 'Music, TV and film, local area',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'Person 1', voiceName: 'Puck' },
          { name: 'Person 2', voiceName: 'Aoede' },
          { name: 'Person 3', voiceName: 'Kore' }
        ],
        style: 'conversational'
      }
    },

    // Higher Q8: Two-part Multiple Choice (6 marks total) - Topic: Work, shopping
    {
      question_number: 8,
      question_type: 'multi-part',
      section: 'A',
      title: 'Listen to two discussions about jobs and shopping',
      instructions: 'Listen to the recording and complete both parts.',
      audio_text: `Teil A:
Person 1: Was denkst du über Jobs?
Person 2: Ich finde, dass viele Jobs gut bezahlt, aber sehr stressig sind.
Person 3: Ich finde es wichtig, einen Job zu finden, der einem gefällt.

Teil B:
Person 4: Die Technologie hat unsere Art zu shoppen verändert.
Person 5: Ja, es ist bequemer, online einzukaufen.
Person 6: Ich kaufe lieber in physischen Geschäften ein.`,
      audio_transcript: 'Two discussions about jobs and shopping',
      question_data: {
        parts: [
          {
            id: 'part_a',
            type: 'multiple-choice',
            title: '8(a) Jobs discussion',
            instructions: 'What do they say about jobs? Select the correct letter for each question.',
            marks: 3,
            questions: [
              {
                id: 'q8a_i',
                question: '(i) Person 2 thinks many jobs are...',
                options: [
                  { letter: 'A', text: 'well paid but stressful' },
                  { letter: 'B', text: 'boring and badly paid' },
                  { letter: 'C', text: 'not very important' }
                ],
              },
              {
                id: 'q8a_ii',
                question: '(ii) Person 3 thinks it is important to...',
                options: [
                  { letter: 'A', text: 'work a lot' },
                  { letter: 'B', text: 'find a job you like' },
                  { letter: 'C', text: 'earn a lot of money' }
                ],
              },
              {
                id: 'q8a_iii',
                question: '(iii) The overall topic of the discussion is...',
                options: [
                  { letter: 'A', text: 'the economy' },
                  { letter: 'B', text: 'job satisfaction' },
                  { letter: 'C', text: 'new companies' }
                ],
              }
            ]
          },
          {
            id: 'part_b',
            type: 'multiple-choice',
            title: '8(b) Technology and shopping discussion',
            instructions: 'What do they say about technology and shopping? Select the correct letter for each question.',
            marks: 3,
            questions: [
              {
                id: 'q8b_i',
                question: '(i) Person 4 believes technology has changed...',
                options: [
                  { letter: 'A', text: 'how we buy things' },
                  { letter: 'B', text: 'the quality of products' },
                  { letter: 'C', text: 'how much we spend' }
                ],
              },
              {
                id: 'q8b_ii',
                question: '(ii) Person 5 thinks shopping online is...',
                options: [
                  { letter: 'A', text: 'more expensive' },
                  { letter: 'B', text: 'more comfortable' },
                  { letter: 'C', text: 'more dangerous' }
                ],
              },
              {
                id: 'q8b_iii',
                question: '(iii) Person 6 prefers to shop in...',
                options: [
                  { letter: 'A', text: 'online stores' },
                  { letter: 'B', text: 'supermarkets' },
                  { letter: 'C', text: 'physical shops' }
                ],
              }
            ]
          }
        ]
      },
      marks: 6,
      theme: 'Future aspirations, study and work',
      topic: 'Jobs, career choices, shopping',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'Person 1', voiceName: 'Aoede' },
          { name: 'Person 2', voiceName: 'Puck' },
          { name: 'Person 3', voiceName: 'Kore' },
          { name: 'Person 4', voiceName: 'Rasalgethi' },
          { name: 'Person 5', voiceName: 'Aoede' },
          { name: 'Person 6', voiceName: 'Puck' }
        ],
        style: 'conversational'
      }
    },

    // Higher Q9: Two-part question (7 marks total) - Topic: Equality, natural world
    {
      question_number: 9,
      question_type: 'multi-part',
      section: 'A',
      title: 'Gender equality discussion and a natural park report',
      instructions: 'Listen to the recording and complete both parts.',
      audio_text: `Teil A - Diskussion über Gleichheit:
Person 1: Geschlechtergleichheit ist mir sehr wichtig.
Person 2: Ich denke, jeder verdient die gleichen Chancen.
Person 3: Es ist von grundlegender Bedeutung, die Menschen aufzuklären, damit sie verstehen, was Gleichheit bedeutet.

Teil B - Bericht über einen Naturpark:
Eine neue Studie zeigt, dass der Nationalpark Bayerischer Wald in Gefahr ist. Der Hauptgrund ist die Umweltverschmutzung. Umweltschützer empfehlen, die Verschmutzung zu reduzieren und die Flora und Fauna zu schützen.`,
      audio_transcript: 'Gender equality discussion followed by natural park report',
      question_data: {
        parts: [
          {
            id: 'part_a',
            type: 'multiple-choice',
            title: '9(a) Gender equality discussion',
            instructions: 'What do they say about gender equality? Select the correct letter for each question.',
            marks: 3,
            questions: [
              {
                id: 'q9a_i',
                question: '(i) Person 1 believes gender equality is...',
                options: [
                  { letter: 'A', text: 'not very important' },
                  { letter: 'B', text: 'very important' },
                  { letter: 'C', text: 'a simple concept' }
                ]
              },
              {
                id: 'q9a_ii',
                question: '(ii) Person 2 thinks everyone deserves...',
                options: [
                  { letter: 'A', text: 'more money' },
                  { letter: 'B', text: 'more free time' },
                  { letter: 'C', text: 'the same opportunities' }
                ]
              },
              {
                id: 'q9a_iii',
                question: '(iii) Person 3 suggests it is fundamental to...',
                options: [
                  { letter: 'A', text: 'educate people' },
                  { letter: 'B', text: 'create new laws' },
                  { letter: 'C', text: 'ignore the problem' }
                ]
              }
            ]
          },
          {
            id: 'part_b',
            type: 'open-response-c',
            title: '9(b) You hear a report on a natural park',
            instructions: 'Listen to the report and answer the questions in English. Complete sentences are not required.',
            marks: 4,
            topic: 'Natural world',
            questions: [
              {
                id: 'park_status',
                question: '(i) What is the status of Bavarian Forest National Park?',
                marks: 1
              },
              {
                id: 'main_problem',
                question: '(ii) What is the main problem affecting the park?',
                marks: 1
              },
              {
                id: 'ecologist_recommendation',
                question: '(iii) What do ecologists recommend?',
                marks: 2
              }
            ]
          }
        ]
      },
      marks: 7,
      theme: 'Global issues',
      topic: 'Equality, the natural world',
      tts_config: {
        multiSpeaker: true,
        speakers: [
          { name: 'Person 1', voiceName: 'Puck' },
          { name: 'Person 2', voiceName: 'Aoede' },
          { name: 'Person 3', voiceName: 'Kore' },
          { name: 'Reporter', voiceName: 'Rasalgethi' }
        ],
        style: 'conversational and report'
      }
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
      audio_text: `<speak>
        <p><s>Einführung: <break time='1s'/> Sie werden Sätze über das Schulleben hören.</s></p>
        <p><s>Satz 1: <break time='1s'/> Ich spiele gerne<break time='0.5s'/> Fußball<break time='0.5s'/> weil es<break time='0.5s'/> lustig ist.</s></p>
        <p><s>Satz 2: <break time='1s'/> Der Chemielehrer<break time='0.5s'/> ist sehr<break time='0.5s'/> freundlich.</s></p>
        <p><s>Satz 3: <break time='1s'/> In der Pause<break time='0.5s'/> esse ich<break time='0.5s'/> einen Apfel.</s></p>
        <p><s>Satz 4: <break time='1s'/> Nach der Schule<break time='0.5s'/> gehe ich<break time='0.5s'/> nach Hause.</s></p>
        <p><s>Satz 5: <break time='1s'/> Mein Lieblingsfach<break time='0.5s'/> ist die<break time='0.5s'/> Kunst.</s></p>
        <p><s>Satz 6: <break time='1s'/> Die Schüler tragen eine<break time='0.5s'/> blaue<break time='0.5s'/> Uniform.</s></p>
      </speak>`,
      audio_transcript: 'Dictation about school life with 6 sentences',
      question_data: {
        subject: 'School life',
        introduction: 'You will hear sentences about school subjects and activities.',
        sentences: [
          {
            id: 's1',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's1g1',
                textBefore: 'Ich spiele gerne',
                textAfter: 'weil es'
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
            description: 'Two gaps',
            gaps: [
              {
                id: 's2g1',
                textBefore: 'Der Chemielehrer ist sehr',
                textAfter: '.'
              }
            ]
          },
          {
            id: 's3',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's3g1',
                textBefore: 'In der Pause esse ich einen',
                textAfter: '.'
              }
            ]
          },
          {
            id: 's4',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's4g1',
                textBefore: 'Nach der Schule gehe ich',
                textAfter: 'nach Hause.'
              }
            ]
          },
          {
            id: 's5',
            marks: 1,
            description: 'Two gaps',
            gaps: [
              {
                id: 's5g1',
                textBefore: 'Mein Lieblingsfach ist die',
                textAfter: '.'
              }
            ]
          },
          {
            id: 's6',
            marks: 1,
            description: 'Two gaps',
            gaps: [
              {
                id: 's6g1',
                textBefore: 'Die Schüler tragen eine',
                textAfter: 'Uniform.'
              }
            ]
          }
        ]
      },
      marks: 10,
      theme: 'School',
      topic: 'School subjects, routines',
      tts_config: {
        voiceName: 'Charon',
        style: 'clearly and slowly for dictation',
        ssml: true
      }
    },
    higher: {
      question_number: 10,
      question_type: 'dictation',
      section: 'B',
      title: 'Section B: Dictation',
      instructions: 'Listen to each sentence and fill in the missing words. Each sentence is heard three times.',
      audio_text: `<speak>
        <p><s>Einführung: <break time='1s'/> Sie werden Sätze über die Zukunft und die Arbeit hören.</s></p>
        <p><s>Satz 1: <break time='1s'/> Um ein gesundes<break time='0.5s'/> Leben<break time='0.5s'/> zu führen,<break time='0.5s'/> ist es wichtig,<break time='0.5s'/> Sport zu treiben<break time='0.5s'/> und gut<break time='0.5s'/> zu essen.</s></p>
        <p><s>Satz 2: <break time='1s'/> Mein Bruder<break time='0.5s'/> ist<break time='0.5s'/> Biologielehrer.</s></p>
        <p><s>Satz 3: <break time='1s'/> Der Job<break time='0.5s'/> meiner Träume<break time='0.5s'/> ist, Anwalt<break time='0.5s'/> zu sein.</s></p>
        <p><s>Satz 4: <break time='1s'/> Die Gesellschaft<break time='0.5s'/> braucht<break time='0.5s'/> mehr Gleichheit<break time='0.5s'/> und<break time='0.5s'/> Respekt.</s></p>
        <p><s>Satz 5: <break time='1s'/> Reisen<break time='0.5s'/> ist eine<break time='0.5s'/> Gelegenheit,<break time='0.5s'/> neue Kulturen<break time='0.5s'/> kennenzulernen.</s></p>
        <p><s>Satz 6: <break time='1s'/> Der Klimawandel<break time='0.5s'/> ist ein<break time='0.5s'/> globales<break time='0.5s'/> Problem.</s></p>
      </speak>`,
      audio_transcript: 'Dictation about future plans and careers with 6 sentences',
      question_data: {
        subject: 'Future plans and career',
        introduction: 'You will hear sentences about future plans and career aspirations.',
        sentences: [
          {
            id: 's1',
            marks: 3,
            description: 'Three gaps',
            gaps: [
              {
                id: 's1g1',
                textBefore: 'Um ein gesundes Leben zu führen, ist es',
                textAfter: 'Sport zu treiben und'
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
            description: 'One gap',
            gaps: [
              {
                id: 's2g1',
                textBefore: 'Mein Bruder ist',
                textAfter: 'Biologielehrer.'
              }
            ]
          },
          {
            id: 's3',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's3g1',
                textBefore: 'Der Job meiner Träume ist,',
                textAfter: 'zu sein.'
              }
            ]
          },
          {
            id: 's4',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's4g1',
                textBefore: 'Die Gesellschaft braucht mehr',
                textAfter: 'und'
              },
              {
                id: 's4g2',
                textBefore: '',
                textAfter: '.'
              }
            ]
          },
          {
            id: 's5',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's5g1',
                textBefore: 'Reisen ist eine',
                textAfter: 'neue Kulturen'
              },
              {
                id: 's5g2',
                textBefore: '',
                textAfter: '.'
              }
            ]
          },
          {
            id: 's6',
            marks: 2,
            description: 'Two gaps',
            gaps: [
              {
                id: 's6g1',
                textBefore: 'Der Klimawandel ist ein',
                textAfter: 'Problem.'
              }
            ]
          }
        ]
      },
      marks: 12,
      theme: 'Future aspirations, study and work',
      topic: 'Career choices and ambitions',
      tts_config: {
        voiceName: 'Kore',
        style: 'clearly and slowly for dictation',
        ssml: true
      }
    }
  }
}; // End of German questions object

// Main population function
async function populateEdexcelListeningAssessments() {
  try {
    console.log('🎧 Starting Edexcel Listening Assessment population...\n');

    for (const lang of languages) {
      for (const tier of tiers) {
        // Step 1: Query for existing papers for this language and tier
        const { data: existingPapers, error: queryError } = await supabase
          .from('edexcel_listening_assessments')
          .select('identifier')
          .eq('language', lang.code)
          .eq('level', tier.level)
          .order('identifier', { ascending: false }); // Order to get the highest number easily

        if (queryError) {
          console.error(`❌ Error querying existing papers for ${lang.name} ${tier.level}:`, queryError);
          continue;
        }

        let nextPaperNumber = 1;
        if (existingPapers && existingPapers.length > 0) {
          // Find the highest paper number and increment it
          const highestIdentifier = existingPapers[0].identifier; // 'paper-X'
          const match = highestIdentifier.match(/paper-(\d+)/);
          if (match && match[1]) {
            nextPaperNumber = parseInt(match[1]) + 1;
          }
        }

        const newIdentifier = `paper-${nextPaperNumber}`;
        console.log(`📚 Creating ${lang.name} ${tier.level} listening assessment with identifier: ${newIdentifier}...`);

        const assessment = {
          title: `Edexcel GCSE ${lang.name} ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Listening Paper ${nextPaperNumber}`,
          description: `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level Edexcel-style ${lang.name} listening assessment with audio generated by Gemini TTS`,
          level: tier.level,
          language: lang.code,
          identifier: newIdentifier, // Dynamically set the identifier
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
          console.error(`❌ Error creating ${lang.name} ${tier.level} assessment with identifier ${newIdentifier}:`, assessmentError);
          continue;
        }

        console.log(`✅ Created ${lang.name} ${tier.level} assessment:`, assessmentData.id, `(${newIdentifier})`);

        // Get the relevant questions for the current language
        const questionsForLang = lang.code === 'de' ? germanQuestions : {};

        // Remove unsupported fields and add assessment_id
        const baseFoundation = removeUnsupportedFields(questionsForLang.foundation);
        const baseCrossover = removeUnsupportedFields(questionsForLang.crossover);
        const baseHigher = removeUnsupportedFields(questionsForLang.higher);
        const baseDictationFoundation = questionsForLang.dictation.foundation;
        const baseDictationHigher = questionsForLang.dictation.higher;

        // Build questions for this tier
        let questionsToInsert = [];

        if (tier.level === 'foundation') {
          // Foundation: Q1-Q6 (foundation-only) + Q7-Q10 (crossover) + Q11 (foundation-only) + Q12 (dictation)

          // Add foundation-only questions (Q1-Q6)
          questionsToInsert.push(...baseFoundation.map(q => ({
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
          const q11Text = `Person 1: Ich mache mir Sorgen um die Umwelt.
Person 2: Es ist wichtig, die Umweltverschmutzung in den Städten zu reduzieren.
Person 3: Wir müssen weniger Plastik verwenden und mehr recyceln.

Person 4: Ich liebe soziale Medien, weil ich mit meinen Freunden sprechen kann.
Person 5: Ich spiele lieber Videospiele. Es macht mehr Spaß.`;

          questionsToInsert.push({
            question_number: 11,
            question_type: 'multi-part',
            section: 'A',
            title: 'Discussion about the environment and hobbies',
            instructions: 'Listen to the recording and complete both parts.',
            audio_text: q11Text,
            audio_transcript: 'Discussion about the environment and leisure activities',
            question_data: {
              parts: [
                {
                  id: 'part_a',
                  type: 'multiple-choice',
                  title: '11(a) Discussion about the environment',
                  instructions: 'What do they say about the environment? Select the correct letter for each question.',
                  marks: 3,
                  questions: [
                    {
                      id: 'q11a_i',
                      question: '(i) Person 2 is worried about pollution in...',
                      options: [
                        { letter: 'A', text: 'cities' },
                        { letter: 'B', text: 'beaches' },
                        { letter: 'C', text: 'mountains' }
                      ],
                      marks: 1
                    },
                    {
                      id: 'q11a_ii',
                      question: '(ii) Person 3 suggests...',
                      options: [
                        { letter: 'A', text: 'using less cars' },
                        { letter: 'B', text: 'planting more trees' },
                        { letter: 'C', text: 'using less plastic and recycling more' }
                      ],
                      marks: 1
                    },
                    {
                      id: 'q11a_iii',
                      question: '(iii) What topic concerns them all?',
                      options: [
                        { letter: 'A', text: 'The economy' },
                        { letter: 'B', text: 'The environment' },
                        { letter: 'C', text: 'Politics' }
                      ],
                      marks: 1
                    }
                  ]
                },
                {
                  id: 'part_b',
                  type: 'open-response-b',
                  title: '11(b) Listen to two people talking about their hobbies',
                  instructions: 'Listen to the recording and complete the following table in English. You do not need to write in full sentences.',
                  marks: 2,
                  speakers: [
                    {
                      id: 'person_d',
                      name: 'Person D',
                      likes: {
                        id: 'person_d_preference',
                        textBefore: 'Likes:',
                        textAfter: '............................................................................................................................... (1)',
                        marks: 1
                      },
                      dislikes: null
                    },
                    {
                      id: 'person_e',
                      name: 'Person E',
                      likes: {
                        id: 'person_e_preference',
                        textBefore: 'Prefers:',
                        textAfter: '............................................................................................................................... (1)',
                        marks: 1
                      },
                      dislikes: null
                    }
                  ]
                }
              ]
            },
            marks: 5,
            theme: 'Global issues',
            topic: 'Environment, social media and gaming',
            tts_config: {
              multiSpeaker: true,
              speakers: [
                { name: 'Person 1', voiceName: 'Puck' },
                { name: 'Person 2', voiceName: 'Aoede' },
                { name: 'Person 3', voiceName: 'Kore' },
                { name: 'Person 4', voiceName: 'Rasalgethi' },
                { name: 'Person 5', voiceName: 'Puck' }
              ],
              style: 'conversational'
            },
            assessment_id: assessmentData.id
          });

          // Add dictation (Q12)
          questionsToInsert.push({
            ...baseDictationFoundation,
            assessment_id: assessmentData.id
          });

        } else {
          // Higher: Q1-Q4 (crossover) + Q5-Q9 (higher-only) + Q10 (dictation)

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
            ...baseDictationHigher,
            assessment_id: assessmentData.id
          });
        }

        // Insert all questions for this assessment
        const { error: questionsError } = await supabase
          .from('edexcel_listening_questions')
          .insert(questionsToInsert);

        if (questionsError) {
          console.error(`❌ Error inserting questions for ${lang.name} ${tier.level} with identifier ${newIdentifier}:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${questionsToInsert.length} questions for ${lang.name} ${tier.level} (${newIdentifier})\n`);
      }
    }

    console.log('\n🎉 Edexcel Listening Assessment population completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`- Languages: ${languages.length} (${languages.map(l => l.name).join(', ')})`);
    console.log(`- Tiers: ${tiers.length} (${tiers.map(t => t.level).join(', ')})`);
    console.log(`- Foundation questions per assessment: ${tiers.find(t => t.level === 'foundation')?.totalQuestions}`);
    console.log(`- Higher questions per assessment: ${tiers.find(t => t.level === 'higher')?.totalQuestions}`);
    console.log(`- Crossover questions: 4 (Foundation Q7-Q10 = Higher Q1-Q4)`);
    console.log(`- Total unique questions: 28 (6 foundation + 4 crossover + 5 higher + 2 dictation)`);

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
