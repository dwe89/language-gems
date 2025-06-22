import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

type SentenceGenerationRequest = {
  mode: 'assignment' | 'freeplay';
  assignmentId?: string;
  theme?: string;
  topic?: string;
  tier?: 'Foundation' | 'Higher';
  grammarFocus?: string;
  count?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  vocabularyIds?: number[];
  teacherSentences?: Array<{
    spanish: string;
    english: string;
    grammarFocus?: string;
    difficulty?: 'easy' | 'medium' | 'hard';
  }>;
}

type VocabularyWord = {
  id: number;
  spanish: string;
  english: string;
  theme: string;
  topic: string;
  part_of_speech: string;
}

// Simple sentence templates for different grammar focuses
const SENTENCE_TEMPLATES = {
  'basic-present': [
    'Yo [verb] [noun]',
    'Tú [verb] [noun]',
    'El/Ella [verb] [noun]',
    'Nosotros [verb] [noun]',
  ],
  'adjective-agreement': [
    'El [noun-m] es [adj-m]',
    'La [noun-f] es [adj-f]',
    'Los [noun-mpl] son [adj-mpl]',
    'Las [noun-fpl] son [adj-fpl]',
  ],
  'ser-estar': [
    'Yo soy [adj]',
    'Tú estás [adj]',
    'El libro está [prep] la mesa',
    'Ella es [profession]',
  ],
  'questions': [
    '¿Cómo te llamas?',
    '¿De dónde eres?',
    '¿Qué hora es?',
    '¿Cuántos años tienes?',
  ],
  'family': [
    'Mi [family] se llama [name]',
    'Tengo [number] [family-plural]',
    'Mi [family] tiene [age] años',
    'Vivo con mi [family]',
  ],
  'food': [
    'Me gusta [food]',
    'No me gusta [food]',
    'Desayuno [food]',
    'Para cenar como [food]',
  ],
  'school': [
    'Estudio [subject]',
    'Mi [subject] favorita es [subject]',
    'Tengo clase de [subject]',
    'El profesor de [subject] es [adj]',
  ],
  'time': [
    'Son las [hour] y [minutes]',
    'A las [hour] tengo [activity]',
    'El [day] tengo [subject]',
    'Me levanto a las [hour]',
  ]
};

// Pre-made Foundation-level sentences for immediate use
const FOUNDATION_SENTENCES = [
  {
    spanish: 'Me llamo María',
    english: 'My name is María',
    theme: 'People and lifestyle',
    topic: 'Identity and relationships',
    grammar: 'reflexive-verbs'
  },
  {
    spanish: 'Tengo quince años',
    english: 'I am fifteen years old',
    theme: 'People and lifestyle',
    topic: 'Identity and relationships',
    grammar: 'numbers-age'
  },
  {
    spanish: 'Vivo en Madrid',
    english: 'I live in Madrid',
    theme: 'Communication and the world around us',
    topic: 'Environment and where people live',
    grammar: 'present-tense'
  },
  {
    spanish: 'Mi hermana es simpática',
    english: 'My sister is nice',
    theme: 'People and lifestyle',
    topic: 'Identity and relationships',
    grammar: 'adjective-agreement'
  },
  {
    spanish: 'Me gusta el fútbol',
    english: 'I like football',
    theme: 'Popular culture',
    topic: 'Free time activities',
    grammar: 'gustar-verb'
  },
  {
    spanish: 'Como pan por la mañana',
    english: 'I eat bread in the morning',
    theme: 'People and lifestyle',
    topic: 'Healthy living and lifestyle',
    grammar: 'present-tense'
  },
  {
    spanish: 'Voy al instituto en autobús',
    english: 'I go to school by bus',
    theme: 'People and lifestyle',
    topic: 'Education and work',
    grammar: 'transport'
  },
  {
    spanish: 'Mi color favorito es azul',
    english: 'My favorite color is blue',
    theme: 'People and lifestyle',
    topic: 'Identity and relationships',
    grammar: 'colors-preferences'
  },
  {
    spanish: 'Hay un parque cerca de mi casa',
    english: 'There is a park near my house',
    theme: 'Communication and the world around us',
    topic: 'Environment and where people live',
    grammar: 'hay-location'
  },
  {
    spanish: 'Los domingos veo la televisión',
    english: 'On Sundays I watch television',
    theme: 'Popular culture',
    topic: 'Free time activities',
    grammar: 'days-routine'
  },
  {
    spanish: 'Mi madre trabaja en un hospital',
    english: 'My mother works in a hospital',
    theme: 'People and lifestyle',
    topic: 'Education and work',
    grammar: 'family-professions'
  },
  {
    spanish: 'Estudio español e inglés',
    english: 'I study Spanish and English',
    theme: 'People and lifestyle',
    topic: 'Education and work',
    grammar: 'school-subjects'
  },
  {
    spanish: 'En verano hace calor',
    english: 'In summer it is hot',
    theme: 'Communication and the world around us',
    topic: 'Environment and where people live',
    grammar: 'weather-seasons'
  },
  {
    spanish: 'Celebramos la Navidad en diciembre',
    english: 'We celebrate Christmas in December',
    theme: 'Popular culture',
    topic: 'Customs, festivals and celebrations',
    grammar: 'festivals-months'
  },
  {
    spanish: 'Mi dormitorio es pequeño pero cómodo',
    english: 'My bedroom is small but comfortable',
    theme: 'Communication and the world around us',
    topic: 'Environment and where people live',
    grammar: 'house-descriptions'
  },
  // Family and Friends sentences
  {
    spanish: 'Mi familia es muy importante para mí',
    english: 'My family is very important to me',
    theme: 'People and lifestyle',
    topic: 'Family and Friends',
    grammar: 'family-importance'
  },
  {
    spanish: 'Tengo dos hermanos mayores',
    english: 'I have two older brothers',
    theme: 'People and lifestyle',
    topic: 'Family and Friends',
    grammar: 'family-members'
  },
  {
    spanish: 'Mi mejor amigo se llama Carlos',
    english: 'My best friend is called Carlos',
    theme: 'People and lifestyle',
    topic: 'Family and Friends',
    grammar: 'friendship'
  },
  {
    spanish: 'Mis abuelos viven cerca',
    english: 'My grandparents live nearby',
    theme: 'People and lifestyle',
    topic: 'Family and Friends',
    grammar: 'family-location'
  },
  {
    spanish: 'Hablo con mis amigos todos los días',
    english: 'I talk with my friends every day',
    theme: 'People and lifestyle',
    topic: 'Family and Friends',
    grammar: 'daily-communication'
  },
  // School sentences
  {
    spanish: 'Mi asignatura favorita es matemáticas',
    english: 'My favorite subject is mathematics',
    theme: 'People and lifestyle',
    topic: 'School Subjects',
    grammar: 'school-preferences'
  },
  {
    spanish: 'Tengo clase de ciencias a las diez',
    english: 'I have science class at ten',
    theme: 'People and lifestyle',
    topic: 'School Day and Routine',
    grammar: 'school-schedule'
  },
  {
    spanish: 'El profesor explica la lección',
    english: 'The teacher explains the lesson',
    theme: 'People and lifestyle',
    topic: 'School Types and School System',
    grammar: 'classroom-activities'
  },
  {
    spanish: 'Hago los deberes en casa',
    english: 'I do homework at home',
    theme: 'People and lifestyle',
    topic: 'School Day and Routine',
    grammar: 'homework-routine'
  },
  {
    spanish: 'En el recreo juego con mis amigos',
    english: 'At break time I play with my friends',
    theme: 'People and lifestyle',
    topic: 'School Day and Routine',
    grammar: 'break-activities'
  },
  // Travel and Holiday sentences
  {
    spanish: 'En verano voy a la playa',
    english: 'In summer I go to the beach',
    theme: 'Communication and the world around us',
    topic: 'Holiday Activities and Experiences',
    grammar: 'holiday-activities'
  },
  {
    spanish: 'Viajo en avión a España',
    english: 'I travel by plane to Spain',
    theme: 'Communication and the world around us',
    topic: 'Transport',
    grammar: 'travel-transport'
  },
  {
    spanish: 'El hotel tiene piscina',
    english: 'The hotel has a swimming pool',
    theme: 'Communication and the world around us',
    topic: 'Accommodation',
    grammar: 'hotel-facilities'
  },
  {
    spanish: 'Hoy llueve mucho',
    english: 'Today it is raining a lot',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-present'
  },
  {
    spanish: 'Mañana hará sol',
    english: 'Tomorrow it will be sunny',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-future'
  },
  {
    spanish: 'En invierno nieva mucho',
    english: 'In winter it snows a lot',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-seasons'
  },
  {
    spanish: 'El viento sopla fuerte',
    english: 'The wind blows strong',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-conditions'
  },
  {
    spanish: 'Hace frío en la montaña',
    english: 'It is cold in the mountain',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-temperature'
  },
  {
    spanish: 'El cielo está nublado',
    english: 'The sky is cloudy',
    theme: 'Communication and the world around us',
    topic: 'Weather',
    grammar: 'weather-descriptions'
  },
  {
    spanish: 'Necesito un mapa de la ciudad',
    english: 'I need a map of the city',
    theme: 'Communication and the world around us',
    topic: 'Tourist Information and Directions',
    grammar: 'tourist-needs'
  },
  // Career and Future sentences
  {
    spanish: 'Quiero ser médico en el futuro',
    english: 'I want to be a doctor in the future',
    theme: 'People and lifestyle',
    topic: 'Career Choices and Ambitions',
    grammar: 'future-aspirations'
  },
  {
    spanish: 'Estudio para el examen',
    english: 'I study for the exam',
    theme: 'People and lifestyle',
    topic: 'Further Education and Training',
    grammar: 'study-preparation'
  },
  {
    spanish: 'Trabajo los fines de semana',
    english: 'I work on weekends',
    theme: 'People and lifestyle',
    topic: 'Jobs and Employment',
    grammar: 'work-schedule'
  },
  {
    spanish: 'Mi hermana va a la universidad',
    english: 'My sister goes to university',
    theme: 'People and lifestyle',
    topic: 'Further Education and Training',
    grammar: 'higher-education'
  },
  // Environmental and Global sentences
  {
    spanish: 'Reciclamos en casa',
    english: 'We recycle at home',
    theme: 'Communication and the world around us',
    topic: 'Environmental Issues',
    grammar: 'environmental-actions'
  },
  {
    spanish: 'Es importante cuidar el planeta',
    english: 'It is important to take care of the planet',
    theme: 'Communication and the world around us',
    topic: 'Environmental Issues',
    grammar: 'environmental-importance'
  },
  {
    spanish: 'Como frutas y verduras',
    english: 'I eat fruits and vegetables',
    theme: 'People and lifestyle',
    topic: 'Healthy Living',
    grammar: 'healthy-eating'
  },
  {
    spanish: 'Hago ejercicio todos los días',
    english: 'I exercise every day',
    theme: 'People and lifestyle',
    topic: 'Healthy Living',
    grammar: 'exercise-routine'
  },
  // Animals and Nature (for free topics)
  {
    spanish: 'Mi perro es muy cariñoso',
    english: 'My dog is very affectionate',
    theme: 'Popular culture',
    topic: 'Pets and Domestic Animals',
    grammar: 'pet-descriptions'
  },
  {
    spanish: 'Los leones viven en África',
    english: 'Lions live in Africa',
    theme: 'Communication and the world around us',
    topic: 'Wild Animals',
    grammar: 'animal-habitats'
  },
  {
    spanish: 'Me gustan los animales',
    english: 'I like animals',
    theme: 'Popular culture',
    topic: 'Pets and Domestic Animals',
    grammar: 'animal-preferences'
  },
  {
    spanish: 'El bosque es muy verde',
    english: 'The forest is very green',
    theme: 'Communication and the world around us',
    topic: 'Environment and Conservation',
    grammar: 'nature-descriptions'
  }
];

function generateSentenceFromTemplate(template: string, vocabulary: VocabularyWord[]): string | null {
  // Simple template replacement - in a real implementation, this would be more sophisticated
  let sentence = template;
  
  // Replace placeholders with appropriate vocabulary
  const placeholders = template.match(/\[([^\]]+)\]/g);
  if (!placeholders) return sentence;
  
  for (const placeholder of placeholders) {
    const type = placeholder.replace(/[\[\]]/g, '');
    const word = findWordByType(type, vocabulary);
    if (word) {
      sentence = sentence.replace(placeholder, word.spanish);
    }
  }
  
  return sentence.includes('[') ? null : sentence; // Return null if any placeholders remain
}

function findWordByType(type: string, vocabulary: VocabularyWord[]): VocabularyWord | null {
  // Map placeholder types to part of speech or themes
  const typeMap: { [key: string]: string[] } = {
    'verb': ['v'],
    'noun': ['n (m)', 'n (f)', 'n (mpl)', 'n (fpl)'],
    'adj': ['adj'],
    'family': ['n (m)', 'n (f)'], // Would need more specific filtering
    'food': ['n (m)', 'n (f)'], // Would need theme filtering
    'subject': ['n (m)', 'n (f)'], // Would need theme filtering
  };
  
  const partsOfSpeech = typeMap[type] || [type];
  return vocabulary.find(word => 
    partsOfSpeech.some(pos => word.part_of_speech.includes(pos))
  ) || null;
}

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: SentenceGenerationRequest = await request.json();
    const { mode, assignmentId, theme, topic, tier = 'Foundation', grammarFocus, count = 10, difficulty = 'medium', vocabularyIds, teacherSentences } = body;

    let sentences: any[] = [];

    // If teacher sentences are provided, prioritize those
    if (teacherSentences && teacherSentences.length > 0) {
      sentences = teacherSentences.map((sentence, index) => ({
        id: `teacher-${Date.now()}-${index}`,
        text: sentence.spanish,
        originalText: sentence.english,
        translatedText: sentence.spanish,
        language: 'es',
        difficulty: sentence.difficulty || difficulty,
        curriculum: {
          tier,
          theme: theme || 'Custom Content',
          topic: topic || 'Teacher Created',
          grammarFocus: sentence.grammarFocus || grammarFocus || 'custom'
        },
        explanation: `Teacher-created sentence${sentence.grammarFocus ? ` focusing on ${sentence.grammarFocus}` : ''}`,
        vocabularyWords: [],
        isTeacherCreated: true
      }));

      // If we have enough teacher sentences, return them
      if (sentences.length >= count) {
        return NextResponse.json({ sentences: sentences.slice(0, count) });
      }
    }

    if (mode === 'assignment' && assignmentId) {
      // For assignment mode, get sentences from the assignment configuration
      const { data: assignment, error: assignmentError } = await supabase
        .from('assignments')
        .select(`
          *,
          vocabulary_assignment_lists!inner(
            *,
            vocabulary_assignment_items!inner(
              vocabulary!inner(*)
            )
          )
        `)
        .eq('id', assignmentId)
        .single();

      if (assignmentError) {
        console.error('Error fetching assignment:', assignmentError);
        return NextResponse.json({ error: 'Assignment not found' }, { status: 404 });
      }

      // Get vocabulary from assignment
      const vocabularyWords = assignment.vocabulary_assignment_lists?.vocabulary_assignment_items?.map((item: any) => item.vocabulary) || [];
      
      // For now, use pre-made sentences that match the theme/topic
      // In a full implementation, this would generate sentences using the vocabulary
      const matchingSentences = FOUNDATION_SENTENCES.filter(sentence => 
        (!theme || sentence.theme.toLowerCase().includes(theme.toLowerCase())) &&
        (!topic || sentence.topic.toLowerCase().includes(topic.toLowerCase()))
      );

      sentences = matchingSentences.slice(0, count).map((sentence, index) => ({
        id: `assignment-${assignmentId}-${index}`,
        text: sentence.spanish,
        originalText: sentence.english,
        translatedText: sentence.spanish,
        language: 'es',
        difficulty: difficulty,
        curriculum: {
          tier,
          theme: sentence.theme,
          topic: sentence.topic,
          grammarFocus: sentence.grammar
        },
        explanation: `This sentence practices ${sentence.grammar.replace('-', ' ')}`,
        vocabularyWords: vocabularyWords.slice(0, 5) // Include some vocabulary for reference
      }));

    } else {
      // Free play mode - generate sentences based on selected criteria
      console.log('Free play mode - filtering criteria:', { theme, topic, grammarFocus, tier });
      
      let vocabularyQuery = supabase
        .from('vocabulary')
        .select('*');

      if (theme) {
        vocabularyQuery = vocabularyQuery.ilike('theme', `%${theme}%`);
      }
      if (topic) {
        vocabularyQuery = vocabularyQuery.ilike('topic', `%${topic}%`);
      }
      if (vocabularyIds && vocabularyIds.length > 0) {
        vocabularyQuery = vocabularyQuery.in('id', vocabularyIds);
      }

      const { data: vocabulary, error: vocabError } = await vocabularyQuery.limit(50);

      if (vocabError) {
        console.error('Error fetching vocabulary:', vocabError);
        return NextResponse.json({ error: 'Failed to fetch vocabulary' }, { status: 500 });
      }

      // For now, use pre-made sentences filtered by criteria
      let availableSentences = FOUNDATION_SENTENCES;
      console.log('Total available sentences before filtering:', availableSentences.length);

      // More flexible filtering logic
      if (theme) {
        const themeFiltered = availableSentences.filter(sentence => {
          const themeMatch = sentence.theme.toLowerCase().includes(theme.toLowerCase()) ||
                           theme.toLowerCase().includes(sentence.theme.toLowerCase());
          return themeMatch;
        });
        console.log(`Theme filter (${theme}) matched:`, themeFiltered.length, 'sentences');
        availableSentences = themeFiltered;
      }
      
      if (topic && availableSentences.length > 0) {
        const topicFiltered = availableSentences.filter(sentence => {
          const topicMatch = sentence.topic.toLowerCase().includes(topic.toLowerCase()) ||
                           topic.toLowerCase().includes(sentence.topic.toLowerCase()) ||
                           // Also check for partial matches
                           sentence.topic.toLowerCase().replace(/\s+/g, '').includes(topic.toLowerCase().replace(/\s+/g, '')) ||
                           topic.toLowerCase().replace(/\s+/g, '').includes(sentence.topic.toLowerCase().replace(/\s+/g, ''));
          return topicMatch;
        });
        console.log(`Topic filter (${topic}) matched:`, topicFiltered.length, 'sentences');
        availableSentences = topicFiltered;
      }
      
      if (grammarFocus && availableSentences.length > 0) {
        const grammarFiltered = availableSentences.filter(sentence => 
          sentence.grammar.includes(grammarFocus)
        );
        console.log(`Grammar filter (${grammarFocus}) matched:`, grammarFiltered.length, 'sentences');
        availableSentences = grammarFiltered;
      }

      console.log('Final filtered sentences count:', availableSentences.length);

      // If no exact matches, fall back to broader theme matching
      if (availableSentences.length === 0 && theme) {
        console.log('No exact matches, trying broader theme matching...');
        availableSentences = FOUNDATION_SENTENCES.filter(sentence => {
          // Broader theme mapping
          const themeKeywords: Record<string, string[]> = {
            'People and lifestyle': ['family', 'friends', 'identity', 'school', 'work', 'lifestyle', 'health'],
            'Communication and the world around us': ['travel', 'environment', 'weather', 'location', 'transport', 'holiday'],
            'Popular culture': ['animals', 'culture', 'entertainment', 'technology', 'modern']
          };
          
          const sentenceThemeKeywords = themeKeywords[sentence.theme] || [];
          const requestThemeWords = theme.toLowerCase().split(/\s+/);
          
          return sentenceThemeKeywords.some((keyword: string) => 
            requestThemeWords.some((word: string) => 
              keyword.includes(word) || word.includes(keyword)
            )
          );
        });
        console.log('Broader theme matching found:', availableSentences.length, 'sentences');
      }

      // Shuffle and take requested count
      const shuffled = availableSentences.sort(() => Math.random() - 0.5);
      
      sentences = shuffled.slice(0, count).map((sentence, index) => ({
        id: `freeplay-${Date.now()}-${index}`,
        text: sentence.spanish,
        originalText: sentence.english,
        translatedText: sentence.spanish,
        language: 'es',
        difficulty: difficulty,
        curriculum: {
          tier,
          theme: sentence.theme,
          topic: sentence.topic,
          grammarFocus: sentence.grammar
        },
        explanation: `This sentence practices ${sentence.grammar.replace('-', ' ')}`,
        vocabularyWords: vocabulary || []
      }));
    }

    if (sentences.length === 0) {
      // Fallback to a basic sentence if no matches found
      console.log('No sentences found after filtering, using fallback. Request was:', { mode, theme, topic, tier, grammarFocus });
      sentences = [{
        id: 'fallback-1',
        text: 'Hola me llamo Pedro',
        originalText: 'Hello my name is Pedro',
        translatedText: 'Hola me llamo Pedro',
        language: 'es',
        difficulty: 'easy',
        curriculum: {
          tier: 'Foundation',
          theme: 'People and lifestyle',
          topic: 'Identity and relationships',
          grammarFocus: 'introductions'
        },
        explanation: 'This sentence practices basic introductions',
        vocabularyWords: []
      }];
    } else {
      console.log(`Returning ${sentences.length} sentences for request:`, { mode, theme, topic, tier });
    }

    return NextResponse.json({ sentences });

  } catch (error) {
    console.error('Error generating sentences:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 