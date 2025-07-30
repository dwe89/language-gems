import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Interface Definitions ---
export interface AQATopicAssessmentDefinition {
  id?: string; // Optional for creation, Supabase generates it
  title: string;
  description?: string;
  level: 'foundation' | 'higher';
  language: string;
  identifier: string;
  theme: string;
  topic: string;
  version: string;
  total_questions: number;
  time_limit_minutes: number;
  is_active: boolean;
  created_at?: string; // Optional, Supabase handles timestamp
  updated_at?: string; // Optional, Supabase handles timestamp
}

export interface AQATopicQuestionDefinition {
  id?: string; // Optional for creation, Supabase generates it
  assessment_id: string;
  question_number: number;
  question_type: string;
  title: string;
  instructions: string;
  reading_text?: string;
  marks: number;
  theme: string;
  topic: string;
  difficulty_rating: number;
  question_data: any; // Flexible for different question types
  created_at?: string; // Optional, Supabase handles timestamp
  updated_at?: string; // Optional, Supabase handles timestamp
}

// --- Language and Tier Configurations ---
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 45 },
  { level: 'higher', timeLimit: 60 }
];

// --- AQA Themes and Topics (full list, but we'll filter below) ---
const AQA_THEMES = [
  {
    id: 'Theme 1: People and lifestyle',
    topics: [
      'Identity and relationships with others',
      'Healthy living and lifestyle',
      'Education and work'
    ]
  },
  {
    id: 'Theme 2: Popular culture',
    topics: [
      'Free-time activities',
      'Customs, festivals and celebrations',
      'Celebrity culture'
    ]
  },
  {
    id: 'Theme 3: Communication and the world around us',
    topics: [
      'Travel and tourism, including places of interest',
      'Media and technology',
      'The environment and where people live'
    ]
  }
];

// --- Supabase Service Class (Re-integrated) ---
export class AQATopicAssessmentService {
  /**
   * Get all topic assessments by filters
   */
  async getAssessmentsByFilters(
    level: 'foundation' | 'higher',
    language: string,
    theme: string,
    topic: string
  ): Promise<AQATopicAssessmentDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('topic', topic)
        .eq('is_active', true)
        .order('identifier', { ascending: true });

      if (error) {
        console.error('Error fetching topic assessments:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByFilters:', error);
      return [];
    }
  }

  /**
   * Get a specific topic assessment by ID
   */
  async getAssessmentById(id: string): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('id', id)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching topic assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessmentById:', error);
      return null;
    }
  }

  /**
   * Get questions for a specific topic assessment
   */
  async getQuestionsByAssessmentId(assessmentId: string): Promise<AQATopicQuestionDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_questions')
        .select('*')
        .eq('assessment_id', assessmentId)
        .order('question_number', { ascending: true });

      if (error) {
        console.error('Error fetching topic questions:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getQuestionsByAssessmentId:', error);
      return [];
    }
  }

  /**
   * Get assessment by language, level, theme, topic, and identifier
   */
  async getAssessmentByIdentifier(
    language: string,
    level: 'foundation' | 'higher',
    theme: string,
    topic: string,
    identifier: string
  ): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('language', language)
        .eq('level', level)
        .eq('theme', theme)
        .eq('topic', topic)
        .eq('identifier', identifier)
        .eq('is_active', true)
        .single();

      if (error) {
        console.error('Error fetching topic assessment by identifier:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in getAssessmentByIdentifier:', error);
      return null;
    }
  }

  /**
   * Get all assessments for a specific theme
   */
  async getAssessmentsByTheme(
    level: 'foundation' | 'higher',
    language: string,
    theme: string
  ): Promise<AQATopicAssessmentDefinition[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('*')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('is_active', true)
        .order('topic', { ascending: true })
        .order('identifier', { ascending: true });

      if (error) {
        console.error('Error fetching assessments by theme:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getAssessmentsByTheme:', error);
      return [];
    }
  }

  /**
   * Get all available topics for a theme
   */
  async getTopicsForTheme(
    level: 'foundation' | 'higher',
    language: string,
    theme: string
  ): Promise<string[]> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .select('topic')
        .eq('level', level)
        .eq('language', language)
        .eq('theme', theme)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching topics for theme:', error);
        return [];
      }

      // Get unique topics
      const topics = [...new Set(data?.map(item => item.topic) || [])];
      return topics.sort();
    } catch (error) {
      console.error('Error in getTopicsForTheme:', error);
      return [];
    }
  }

  /**
   * Create a new topic assessment
   */
  async createAssessment(assessment: Omit<AQATopicAssessmentDefinition, 'id' | 'created_at' | 'updated_at'>): Promise<AQATopicAssessmentDefinition | null> {
    try {
      const { data, error } = await supabase
        .from('aqa_topic_assessments')
        .insert([assessment])
        .select()
        .single();

      if (error) {
        console.error('Error creating topic assessment:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createAssessment:', error);
      return null;
    }
  }

  /**
   * Create questions for a topic assessment
   */
  async createQuestions(questions: Omit<AQATopicQuestionDefinition, 'id' | 'created_at' | 'updated_at'>[]): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('aqa_topic_questions')
        .insert(questions);

      if (error) {
        console.error('Error creating topic questions:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in createQuestions:', error);
      return false;
    }
  }
}

const assessmentService = new AQATopicAssessmentService();

/**
 * Gets the next assessment number for a given language, level, theme, and topic.
 * @param {string} language - The language code (e.g., 'es', 'fr', 'de').
 * @param {'foundation' | 'higher'} level - The difficulty level (e.g., 'foundation', 'higher').
 * @param {string} theme - The AQA theme ID.
 * @param {string} topic - The AQA topic name.
 * @returns {Promise<number>} The next available assessment number.
 */
async function getNextAssessmentNumber(language: string, level: 'foundation' | 'higher', theme: string, topic: string): Promise<number> {
  const { data: existingAssessments } = await supabase
    .from('aqa_topic_assessments')
    .select('identifier')
    .eq('language', language)
    .eq('level', level)
    .eq('theme', theme)
    .eq('topic', topic)
    .like('identifier', 'assessment-%');

  if (!existingAssessments || existingAssessments.length === 0) {
    return 1;
  }

  // Extract assessment numbers and find the highest
  const assessmentNumbers = existingAssessments
    .map(assessment => {
      const match = assessment.identifier.match(/assessment-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);

  return assessmentNumbers.length > 0 ? Math.max(...assessmentNumbers) + 1 : 1;
}

// --- Specific Content Variations for Spanish ---
function getSpanishTopicVariations(theme: string, topic: string) {
  const variations: Record<string, Record<string, any>> = {
    'Theme 1: People and lifestyle': {
      'Identity and relationships with others': { // Existing content, unchanged
        letterMatching: [
          'Me encanta pasar tiempo con mi familia. Siempre organizamos reuniones familiares los domingos.',
          'Tengo muchos amigos de diferentes países. Me gusta aprender sobre sus culturas y tradiciones.',
          'Mi hermana menor y yo compartimos muchos secretos. Ella es mi mejor confidente.',
          'Mis abuelos viven cerca de nosotros. Los visitamos todas las semanas para almorzar juntos.'
        ],
        options: ['Family time', 'Cultural exchange', 'Sibling bonds', 'Grandparent visits', 'Friendship', 'Community'],
        mainText: 'Las relaciones familiares son fundamentales en la cultura española. En mi familia, tenemos tradiciones muy importantes como las comidas dominicales donde toda la familia se reúne. Mi abuela siempre prepara paella valenciana y mis primos vienen desde Valencia para estar con nosotros. Durante estas reuniones, hablamos de nuestras vidas, compartimos noticias y fortalecemos nuestros lazos familiares. Los jóvenes españoles valoramos mucho estas tradiciones porque nos ayudan a mantener nuestra identidad cultural.',
        multipleChoice: [
          { question: 'What is fundamental in Spanish culture?', options: ['A. Work relationships', 'B. Family relationships', 'C. School relationships'], correct: 'B' },
          { question: 'When does the family meet?', options: ['A. Sunday meals', 'B. Saturday evenings', 'C. Friday afternoons'], correct: 'A' },
          { question: 'What does the grandmother prepare?', options: ['A. Gazpacho', 'B. Tortilla española', 'C. Paella valenciana'], correct: 'C' },
          { question: 'Where do the cousins come from?', options: ['A. Madrid', 'B. Valencia', 'C. Barcelona'], correct: 'B' },
          { question: 'Why do young Spaniards value these traditions?', options: ['A. They are fun', 'B. They maintain cultural identity', 'C. They are required'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Luis', text: 'En mi familia somos muy unidos. Tengo tres hermanos y siempre nos apoyamos mutuamente. Cuando tengo problemas, hablo con mi hermana mayor porque me da buenos consejos. Los fines de semana hacemos actividades juntos como ir al cine o jugar al fútbol en el parque.' },
          { name: 'Marta', text: 'Mis padres se divorciaron cuando era pequeña, pero mantenemos una buena relación. Vivo con mi madre durante la semana y con mi padre los fines de semana. Al principio fue difícil, pero ahora estoy acostumbrada. Lo importante es que ambos me quieren mucho.' },
          { name: 'Javier', text: 'Soy hijo único, pero no me siento solo porque tengo muchos primos. Mis tíos viven en la misma ciudad y nos vemos frecuentemente. Durante las vacaciones de verano, vamos todos juntos a la playa en Málaga. Es como tener hermanos.' }
        ],
        gridQuestions: [
          { question: 'Who has three siblings?', correct: 'L' },
          { question: 'Who talks to their older sister for advice?', correct: 'L' },
          { question: 'Whose parents are divorced?', correct: 'M' },
          { question: 'Who is an only child?', correct: 'J' },
          { question: 'Who has many cousins?', correct: 'J' },
          { question: 'Who goes to Málaga during summer holidays?', correct: 'J' }
        ],
        openResponseText: 'La estructura familiar en España ha cambiado mucho en las últimas décadas. Tradicionalmente, las familias españolas eran muy grandes, con muchos hijos y varias generaciones viviendo en la misma casa. Hoy en día, las familias son más pequeñas, con uno o dos hijos como máximo. Muchos jóvenes viven con sus padres hasta los treinta años debido a la situación económica. Sin embargo, los lazos familiares siguen siendo muy fuertes y las reuniones familiares continúan siendo importantes en la cultura española.',
        openQuestions: [
          { question: 'How has the Spanish family structure changed?', expectedWords: 3, acceptableAnswers: ['families are smaller', 'fewer children now', 'smaller families today'] },
          { question: 'How many children do families have today?', expectedWords: 3, acceptableAnswers: ['one or two', 'maximum two children', 'one two maximum'] },
          { question: 'Until what age do young people live with parents?', expectedWords: 2, acceptableAnswers: ['thirty years', 'age thirty'] },
          { question: 'Why do young people stay with parents longer?', expectedWords: 3, acceptableAnswers: ['economic situation', 'financial reasons', 'economic problems'] },
          { question: 'What remains important in Spanish culture?', expectedWords: 3, acceptableAnswers: ['family meetings', 'family reunions', 'family gatherings'] }
        ],
        timeSequenceText: 'Cuando era niño, vivía con mis abuelos en un pueblo pequeño de Andalucía. Ahora vivo en Madrid con mis padres y estudio en la universidad. Mi relación con mi familia ha cambiado mucho desde entonces. Antes dependía completamente de mis abuelos para todo. Actualmente soy más independiente pero sigo valorando mucho el tiempo que paso con mi familia. El próximo año planeo mudarme a mi propio apartamento, pero quiero mantener el contacto frecuente con todos. En el futuro, cuando tenga mi propia familia, espero transmitir los mismos valores que aprendí de mis abuelos.',
        timeEvents: [
          { event: 'Living in Madrid and studying', correct: 'N' },
          { event: 'Living with grandparents in Andalusia', correct: 'P' },
          { event: 'Being completely dependent on grandparents', correct: 'P' },
          { event: 'Planning to move to own apartment', correct: 'F' },
          { event: 'Having own family and transmitting values', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'Spanish families celebrate traditional Sunday meals' },
          { letter: 'B', text: 'Young adults living with parents longer due to economy' },
          { letter: 'C', text: 'Grandparents play important role in childcare' },
          { letter: 'D', text: 'Divorce rates increase but family bonds remain strong' },
          { letter: 'E', text: 'Spanish youth value cultural identity through family' },
          { letter: 'F', text: 'Multi-generational homes becoming less common' }
        ],
        articles: [
          { text: 'Los jóvenes españoles permanecen en casa de sus padres hasta edades más avanzadas debido a la crisis económica y la falta de empleo estable.', correct: 'B' },
          { text: 'Las familias españolas mantienen la tradición de las comidas dominicales como forma de fortalecer los lazos familiares y transmitir valores culturales.', correct: 'A' },
          { text: 'Aunque las tasas de divorcio han aumentado en España, los vínculos familiares siguen siendo fuertes y las familias encuentran nuevas formas de mantenerse unidas.', correct: 'D' },
          { text: 'Los abuelos españoles desempeñan un papel crucial en el cuidado de los nietos, especialmente cuando ambos padres trabajan fuera del hogar.', correct: 'C' },
          { text: 'Los jóvenes españoles consideran que mantener las tradiciones familiares es esencial para preservar su identidad cultural en un mundo globalizado.', correct: 'E' }
        ],
        completionText: 'La identidad personal se forma a través de las relaciones que establecemos con otros. En España, la familia extendida juega un papel fundamental en el desarrollo de la personalidad de los jóvenes. Los abuelos transmiten historias y tradiciones, los padres proporcionan apoyo emocional y económico, y los hermanos ofrecen compañía y comprensión. Estas relaciones múltiples ayudan a crear una identidad sólida y un sentido de pertenencia a la comunidad.',
        completionSentences: [
          { incomplete: 'Personal identity is formed through _____ with others.', correct: 'relationships' },
          { incomplete: 'Extended family plays a _____ role in development.', correct: 'fundamental' },
          { incomplete: 'Grandparents transmit _____ and traditions.', correct: 'stories' },
          { incomplete: 'Parents provide emotional and _____ support.', correct: 'economic' },
          { incomplete: 'These relationships help create a sense of _____.', correct: 'belonging' }
        ],
        lifestyleText: 'El equilibrio entre la vida familiar y personal es muy importante para los españoles. Muchas personas dedican tiempo específico cada semana para estar con la familia, pero también mantienen sus propias aficiones e intereses. Es común que los jóvenes salgan con amigos por las tardes pero regresen a casa para cenar con la familia. Esta combinación de independencia y conexión familiar caracteriza el estilo de vida español moderno.',
        lifestyleQuestions: [
          { question: 'What is important for Spaniards?', options: ['A. Work-life balance', 'B. Family-personal life balance', 'C. Study-leisure balance'], correct: 'B' },
          { question: 'How much time do people dedicate to family?', options: ['A. Specific time each week', 'B. All their free time', 'C. Only weekends'], correct: 'A' },
          { question: 'When do young people go out with friends?', options: ['A. In the afternoons', 'B. In the evenings', 'C. At night only'], correct: 'B' },
          { question: 'What characterizes modern Spanish lifestyle?', options: ['A. Complete independence', 'B. Only family focus', 'C. Independence and family connection'], correct: 'C' }
        ],
        translations: [
          { es: 'Mi familia es muy unida y nos apoyamos siempre.', fr: 'Ma famille est très unie et nous nous soutenons toujours.', de: 'Meine Familie ist sehr eng verbunden und wir unterstützen uns immer.', marks: 2, questionNumber: '40.1' },
          { es: 'Tengo una relación muy especial con mis abuelos maternos.', fr: 'J\'ai une relation très spéciale avec mes grands-parents maternels.', de: 'Ich habe eine sehr besondere Beziehung zu meinen Großeltern mütterlicherseits.', marks: 2, questionNumber: '40.2' },
          { es: 'Los domingos toda la familia se reúne para almorzar juntos.', fr: 'Le dimanche toute la famille se réunit pour déjeuner ensemble.', de: 'Sonntags versammelt sich die ganze Familie zum gemeinsamen Mittagessen.', marks: 2, questionNumber: '40.3' },
          { es: 'Mis padres me enseñaron la importancia de los valores familiares.', fr: 'Mes parents m\'ont enseigné l\'importance des valeurs familiales.', de: 'Meine Eltern haben mir die Wichtigkeit von Familienwerten beigebracht.', marks: 2, questionNumber: '40.4' },
          { es: 'Aunque vivo lejos, mantengo contacto diario con mi hermana.', fr: 'Bien que je vive loin, je maintiens un contact quotidien avec ma sœur.', de: 'Obwohl ich weit weg lebe, halte ich täglichen Kontakt mit meiner Schwester.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Healthy living and lifestyle': { // Existing content, unchanged
        letterMatching: [
          'Para mantenerme en forma, hago deporte tres veces por semana. Me encanta correr en el parque.',
          'Intento comer cinco porciones de fruta y verdura al día. Mi favorita es la manzana.',
          'Es importante dormir ocho horas cada noche para tener energía y buen humor.',
          'Bebo mucha agua para mantenerme hidratado, especialmente después de hacer ejercicio.'
        ],
        options: ['Sports', 'Healthy Eating', 'Sleep', 'Hydration', 'Mindfulness', 'Relaxation'],
        mainText: 'Llevar una vida sana es esencial para los jóvenes de hoy. Muchos adolescentes españoles practican deportes como el fútbol, el baloncesto o la natación para mantenerse activos. La dieta mediterránea es muy popular y se basa en el consumo de frutas, verduras, aceite de oliva y pescado. Evitar las bebidas azucaradas y la comida rápida es clave. Además, el bienestar mental es tan importante como la salud física, por lo que actividades como leer o pasar tiempo con amigos son fundamentales para reducir el estrés.',
        multipleChoice: [
          { question: 'What is essential for young people today?', options: ['A. Playing video games', 'B. Having a healthy life', 'C. Eating fast food'], correct: 'B' },
          { question: 'Which sports are popular among Spanish teenagers?', options: ['A. Cricket and rugby', 'B. Football, basketball, and swimming', 'C. Golf and tennis'], correct: 'B' },
          { question: 'What is the Mediterranean diet based on?', options: ['A. Meat and potatoes', 'B. Sugary drinks and fast food', 'C. Fruits, vegetables, olive oil, and fish'], correct: 'C' },
          { question: 'What is important to avoid for a healthy diet?', options: ['A. Fruits and vegetables', 'B. Sugary drinks and fast food', 'C. Fish and olive oil'], correct: 'B' },
          { question: 'Why are activities like reading or spending time with friends important?', options: ['A. To get good grades', 'B. To reduce stress', 'C. To learn new languages'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Elena', text: 'Para tener una vida equilibrada, me aseguro de estudiar y también de hacer actividades extraescolares. Juego al tenis dos veces por semana y me ayuda a relajarme. Intento no pasar demasiado tiempo en las redes sociales.' },
          { name: 'Pablo', text: 'Mi desafío es comer de forma más sana. Me encanta la comida rápida, pero sé que no es buena. Mis padres están intentando que comamos más verduras en casa y estoy aprendiendo a cocinar platos saludables.' },
          { name: 'Sofía', text: 'El estrés por los exámenes es real. Para gestionarlo, hago yoga y escucho música tranquila. También es fundamental hablar con mis amigos y familia si me siento agobiada. La salud mental es una prioridad para mí.' }
        ],
        gridQuestions: [
          { question: 'Who plays tennis to relax?', correct: 'E' },
          { question: 'Who is trying to eat more healthily?', correct: 'P' },
          { question: 'Who likes fast food?', correct: 'P' },
          { question: 'Who manages exam stress with yoga?', correct: 'S' },
          { question: 'Who prioritises mental health?', correct: 'S' },
          { question: 'Who tries to limit time on social media?', correct: 'E' }
        ],
        openResponseText: 'El ejercicio físico es crucial para la salud. La Organización Mundial de la Salud recomienda que los adolescentes hagan al menos 60 minutos de actividad física moderada a intensa cada día. Esto puede incluir deportes, caminar rápido, bailar o montar en bicicleta. La falta de actividad física puede llevar a problemas de salud como la obesidad y enfermedades cardiovasculares en el futuro. Es importante encontrar una actividad que te guste para que sea más fácil mantenerla a largo plazo.',
        openQuestions: [
          { question: 'How many minutes of physical activity are recommended daily for teenagers?', expectedWords: 2, acceptableAnswers: ['60 minutes', 'sixty minutes', 'at least 60 minutes'] },
          { question: 'Name two activities that count as physical activity.', expectedWords: 4, acceptableAnswers: ['sports and walking', 'dancing and cycling', 'sports dancing', 'walking cycling'] },
          { question: 'What health problem can lack of physical activity lead to?', expectedWords: 1, acceptableAnswers: ['obesity', 'heart disease'] },
          { question: 'Why is it important to find an activity you like?', expectedWords: 5, acceptableAnswers: ['easier to maintain long-term', 'to maintain it longer', 'easier to keep it'] },
          { question: 'What kind of physical activity is recommended?', expectedWords: 4, acceptableAnswers: ['moderate to intense', 'moderate intense'] }
        ],
        timeSequenceText: 'Cuando era pequeño, pasaba horas jugando a videojuegos y comía muchas golosinas. Era bastante sedentario. Ahora, en la adolescencia, he cambiado mis hábitos. Voy al gimnasio tres veces por semana y como de forma más equilibrada. Mis padres me animaron a ser más activo y me ayudaron a entender la importancia de la salud. El próximo año, quiero participar en una carrera solidaria de 5 km. En el futuro, espero poder inspirar a otros a adoptar un estilo de vida saludable.',
        timeEvents: [
          { event: 'Spending hours playing video games', correct: 'P' },
          { event: 'Going to the gym three times a week', correct: 'N' },
          { event: 'Planning to participate in a 5km charity run', correct: 'F' },
          { event: 'Being quite sedentary', correct: 'P' },
          { event: 'Hoping to inspire others to adopt a healthy lifestyle', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'The importance of balanced meals for teenagers' },
          { letter: 'B', text: 'Mental well-being: A priority for young people' },
          { letter: 'C', text: 'How technology influences adolescent sleep patterns' },
          { letter: 'D', text: 'Teenagers opting for outdoor activities over screens' },
          { letter: 'E', text: 'Government campaigns promote healthy habits in schools' },
          { letter: 'F', text: 'The rise of plant-based diets among Spanish youth' }
        ],
        articles: [
          { text: 'Un estudio reciente muestra que más jóvenes españoles eligen pasar su tiempo libre haciendo senderismo y ciclismo en lugar de usar dispositivos electrónicos. Esto contribuye a un estilo de vida más activo.', correct: 'D' },
          { text: 'Las nuevas iniciativas gubernamentales buscan educar a los estudiantes sobre la importancia de la nutrición y el ejercicio a través de talleres y programas deportivos en los colegios.', correct: 'E' },
          { text: 'Muchos adolescentes españoles están adoptando dietas vegetarianas y veganas, lo que se considera un paso positivo hacia una alimentación más consciente y sostenible.', correct: 'F' },
          { text: 'Expertos en salud mental subrayan la necesidad de abordar el estrés y la ansiedad en los jóvenes, promoviendo actividades que fomenten la relajación y el equilibrio emocional.', correct: 'B' },
          { text: 'La calidad del sueño en adolescentes se ve afectada por el uso excesivo de teléfonos móviles antes de dormir, lo que impacta negativamente su rendimiento académico y su estado de ánimo.', correct: 'C' }
        ],
        completionText: 'Una alimentación equilibrada es fundamental para el crecimiento y desarrollo de los adolescentes. Incluir una variedad de frutas, verduras, proteínas y cereales integrales proporciona la energía necesaria para el estudio y el deporte. Evitar los alimentos ultraprocesados y las bebidas con alto contenido de azúcar es clave para prevenir problemas de salud a largo plazo como la diabetes tipo 2. Es importante que los jóvenes aprendan a tomar decisiones saludables para su bienestar futuro.',
        completionSentences: [
          { incomplete: 'A balanced diet is _____ for growth and development.', correct: 'fundamental' },
          { incomplete: 'It provides the necessary _____ for studying and sports.', correct: 'energy' },
          { incomplete: 'Avoiding ultra-processed foods helps _____ long-term health issues.', correct: 'prevent' },
          { incomplete: 'Sugary drinks can lead to problems like Type 2 _____.', correct: 'diabetes' },
          { incomplete: 'Young people should learn to make _____ choices.', correct: 'healthy' }
        ],
        lifestyleText: 'El estilo de vida saludable no solo se trata de la alimentación y el ejercicio, sino también del bienestar mental. En España, los jóvenes están cada vez más conscientes de la importancia de cuidar su salud mental. Actividades como la meditación, pasar tiempo en la naturaleza o practicar un hobby ayudan a reducir el estrés. Es un enfoque holístico que combina la buena alimentación, la actividad física y la salud emocional para una vida plena.',
        lifestyleQuestions: [
          { question: 'What does a healthy lifestyle include besides diet and exercise?', options: ['A. Financial stability', 'B. Mental well-being', 'C. Career success'], correct: 'B' },
          { question: 'What are Spanish youth increasingly aware of?', options: ['A. The latest fashion trends', 'B. The importance of mental health', 'C. New technologies'], correct: 'B' },
          { question: 'Name one activity that helps reduce stress.', options: ['A. Playing violent video games', 'B. Meditation', 'C. Eating unhealthy snacks'], correct: 'B' },
          { question: 'What kind of approach is it for a full life?', options: ['A. A physical approach', 'B. A financial approach', 'C. A holistic approach'], correct: 'C' },
          { question: 'How can teenagers find balance between study and leisure?', options: ['A. By only focusing on academics', 'B. By combining both effectively', 'C. By ignoring extracurriculars'], correct: 'B' } // Added question
        ],
        translations: [
          { es: 'Para mantenerme sano, hago deporte regularmente.', fr: 'Pour rester en bonne santé, je fais du sport régulièrement.', de: 'Um gesund zu bleiben, treibe ich regelmäßig Sport.', marks: 2, questionNumber: '40.1' },
          { es: 'Comer frutas y verduras es muy importante.', fr: 'Manger des fruits et légumes est très important.', de: 'Obst und Gemüse zu essen ist sehr wichtig.', marks: 2, questionNumber: '40.2' },
          { es: 'Duermo ocho horas cada noche para tener energía.', fr: 'Je dors huit horas chaque nuit pour avoir de l\'énergie.', de: 'Ich schlafe acht Stunden pro Nacht, um Energie zu haben.', marks: 2, questionNumber: '40.3' },
          { es: 'Evito la comida rápida y las bebidas azucaradas.', fr: 'J\'évite la restauration rapide et les boissons sucrées.', de: 'Ich vermeide Fast Food und zuckerhaltige Getränke.', marks: 2, questionNumber: '40.4' },
          { es: 'La salud mental es tan importante como la física.', fr: 'La santé mentale es tan importante como la salud física.', de: 'Mentale Gesundheit ist genauso wichtig wie körperliche Gesundheit.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Education and work': { // NEW CONTENT FOR EDUCATION AND WORK
        letterMatching: [
          'Estoy en el último año de secundaria y estoy pensando en ir a la universidad para estudiar ingeniería.',
          'Mi hermano mayor decidió no ir a la universidad; él está haciendo un aprendizaje para ser electricista.',
          'Después de clase, tengo un trabajo a tiempo parcial en una cafetería para ganar algo de dinero extra.',
          'Los exámenes finales de este año son muy importantes para mi futuro académico y profesional.'
        ],
        options: ['University', 'Apprenticeship', 'Part-time job', 'Exams', 'Career choices', 'Studying abroad'],
        mainText: 'En España, la educación secundaria obligatoria termina a los 16 años. Después, los estudiantes pueden elegir entre el Bachillerato, que los prepara para la universidad, o la Formación Profesional, que ofrece habilidades para un oficio específico. Muchos jóvenes también combinan sus estudios con trabajos a tiempo parcial para ganar experiencia y dinero. La elección de una carrera es una decisión importante, influenciada por intereses personales y oportunidades laborales. El mercado de trabajo en España valora cada vez más las habilidades prácticas y los idiomas.',
        multipleChoice: [
          { question: 'What age does compulsory secondary education end in Spain?', options: ['A. 14', 'B. 16', 'C. 18'], correct: 'B' },
          { question: 'What does Bachillerato prepare students for?', options: ['A. A specific trade', 'B. University', 'C. A part-time job'], correct: 'B' },
          { question: 'Why do many young people combine studies with part-time jobs?', options: ['A. To avoid studying', 'B. To gain experience and money', 'C. To meet new friends'], correct: 'B' },
          { question: 'What influences career choice?', options: ['A. Only job opportunities', 'B. Only personal interests', 'C. Personal interests and job opportunities'], correct: 'C' },
          { question: 'What does the Spanish job market increasingly value?', options: ['A. Only academic degrees', 'B. Practical skills and languages', 'C. Only family connections'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Andrea', text: 'Terminé el Bachillerato el año pasado y ahora estoy estudiando ADE en la universidad. Es difícil pero muy interesante. Además, hago prácticas en una empresa por las mañanas.' },
          { name: 'Marco', text: 'No me gustaba mucho estudiar, así que después de la ESO empecé un grado medio de mecánica. Me encanta aprender cosas prácticas y ya tengo una oferta de trabajo para cuando termine.' },
          { name: 'Laura', text: 'Todavía estoy en el instituto. Mis padres quieren que vaya a la universidad, pero yo no estoy segura. Me gustaría tomarme un año sabático para viajar y luego decidir qué hacer.' }
        ],
        gridQuestions: [
          { question: 'Who is doing an internship?', correct: 'A' },
          { question: 'Who prefers practical learning?', correct: 'M' },
          { question: 'Who is thinking about taking a gap year?', correct: 'L' },
          { question: 'Who has a job offer after finishing their studies?', correct: 'M' },
          { question: 'Who is studying at university?', correct: 'A' },
          { question: 'Whose parents want them to go to university?', correct: 'L' }
        ],
        openResponseText: 'El desempleo juvenil es un desafío importante en España. Muchos jóvenes tienen dificultades para encontrar su primer trabajo después de terminar los estudios. El gobierno y varias organizaciones están creando programas de formación y prácticas para ayudar a los jóvenes a adquirir la experiencia necesaria. También se promueve el emprendimiento como una opción viable. Adaptarse a las nuevas tecnologías y ser flexible son habilidades clave para el éxito en el mercado laboral actual.',
        openQuestions: [
          { question: 'What is a significant challenge for young people in Spain?', expectedWords: 3, acceptableAnswers: ['youth unemployment', 'youth unemployment is a challenge', 'unemployment is a challenge'] },
          { question: 'What are governments and organizations creating to help young people?', expectedWords: 5, acceptableAnswers: ['training and internship programs', 'programs for training and internships', 'training programs and internships'] },
          { question: 'What is also promoted as a viable option?', expectedWords: 1, acceptableAnswers: ['entrepreneurship'] },
          { question: 'Name two key skills for success in today\'s job market.', expectedWords: 4, acceptableAnswers: ['new technologies and flexibility', 'adapting to new technologies being flexible', 'flexibility and new technologies'] },
          { question: 'What do many young people struggle to find after finishing studies?', expectedWords: 3, acceptableAnswers: ['their first job', 'a first job'] }
        ],
        timeSequenceText: 'Cuando era niño, siempre soñaba con ser futbolista profesional, pero no era muy bueno. En la escuela primaria, me encantaban las matemáticas y la informática. Ahora, estoy en mi último año de instituto y estoy solicitando plaza en varias universidades para estudiar desarrollo de software. Me han ofrecido una beca para estudiar en Alemania el próximo año, lo cual es muy emocionante. En el futuro, espero trabajar en una gran empresa tecnológica y crear aplicaciones innovadoras.',
        timeEvents: [
          { event: 'Dreaming of being a professional footballer', correct: 'P' },
          { event: 'Applying for university places', correct: 'N' },
          { event: 'Being offered a scholarship to study in Germany', correct: 'N' },
          { event: 'Hoping to work in a big tech company', correct: 'F' },
          { event: 'Loving maths and IT in primary school', correct: 'P' }
        ],
        headlines: [
          { letter: 'A', text: 'New vocational training programs for young Spaniards' },
          { letter: 'B', text: 'Digital skills key for employment in Spain' },
          { letter: 'C', text: 'Youth unemployment remains a challenge' },
          { letter: 'D', text: 'Spanish students choose abroad for higher education' },
          { letter: 'E', text: 'Importance of internships for career development' },
          { letter: 'F', text: 'Entrepreneurship gaining popularity among youth' }
        ],
        articles: [
          { text: 'El número de jóvenes españoles que optan por programas de formación profesional ha aumentado significativamente, buscando inserción laboral rápida.', correct: 'A' },
          { text: 'A pesar de los esfuerzos, la tasa de desempleo entre los menores de 25 años sigue siendo una preocupación principal para el gobierno.', correct: 'C' },
          { text: 'Cada vez más estudiantes españoles consideran ir al extranjero para sus estudios universitarios, buscando nuevas experiencias y oportunidades.', correct: 'D' },
          { text: 'La capacidad de adaptarse a las nuevas tecnologías y poseer habilidades digitales avanzadas son requisitos indispensables en el mercado laboral actual.', correct: 'B' },
          { text: 'Las prácticas en empresas se consideran esenciales para que los recién graduados adquieran experiencia y aumenten sus posibilidades de encontrar un buen empleo.', correct: 'E' }
        ],
        completionText: 'La tecnología ha transformado el mundo del trabajo y la educación. El aprendizaje en línea se ha vuelto más accesible, permitiendo a los estudiantes adquirir nuevas habilidades desde casa. Sin embargo, también presenta desafíos, como la necesidad de autodisciplina. En el futuro, la inteligencia artificial podría cambiar aún más las profesiones, haciendo que la adaptación continua y la formación a lo largo de toda la vida sean esenciales para todos los trabajadores.',
        completionSentences: [
          { incomplete: 'Technology has transformed the world of work and _____.', correct: 'education' },
          { incomplete: 'Online learning has become more _____.', correct: 'accessible' },
          { incomplete: 'It allows students to acquire new skills from _____.', correct: 'home' },
          { incomplete: 'Continuous _____ and lifelong learning will be essential.', correct: 'adaptation' },
          { incomplete: 'Artificial intelligence could change _____ even more.', correct: 'professions' }
        ],
        lifestyleText: 'La orientación profesional es una etapa clave para los jóvenes. Elegir la buena vía requiere conocerse bien y informarse sobre las diferentes oportunidades. Los salones estudiantiles y los consejeros de orientación juegan un papel importante para guiar a los alumnos. También es beneficioso hablar con profesionales para entender la realidad de los oficios. Un proyecto profesional bien definido aumenta las posibilidades de éxito en el recorrido educativo y la carrera.',
        lifestyleQuestions: [
          { question: 'What is a key step for young people?', options: ['A. Traveling', 'B. Career guidance', 'C. Learning to drive'], correct: 'B' },
          { question: 'What is important when choosing the right path?', options: ['A. Knowing many people', 'B. Knowing yourself and getting informed', 'C. Having a lot of money'], correct: 'B' },
          { question: 'Who plays an important role in guiding students?', options: ['A. Famous celebrities', 'B. Student fairs and career counselors', 'C. Sports coaches'], correct: 'B' },
          { question: 'What does talking with professionals help to understand?', options: ['A. Their personal lives', 'B. The reality of jobs', 'C. How to make friends'], correct: 'B' },
          { question: 'What increases chances of success in education and career?', options: ['A. A rich family', 'B. A well-defined career plan', 'C. Only good luck'], correct: 'B' }
        ],
        translations: [
          { es: 'Para ir a la universidad, necesito buenas notas.', fr: 'Pour aller à l\'université, j\'ai besoin de bonnes notes.', de: 'Um an die Universität zu gehen, brauche ich gute Noten.', marks: 2, questionNumber: '41.1' },
          { es: 'Quiero hacer un aprendizaje después del instituto.', fr: 'Je veux faire un apprentissage après le lycée.', de: 'Ich möchte nach der Schule eine Ausbildung machen.', marks: 2, questionNumber: '41.2' },
          { es: 'Mi trabajo a tiempo parcial es en una tienda.', fr: 'Mon travail à temps partiel est dans un magasin.', de: 'Mein Nebenjob ist in einem Geschäft.', marks: 2, questionNumber: '41.3' },
          { es: 'Los idiomas son muy importantes para mi futura carrera.', fr: 'Les langues sont muy importantes pour ma future carrière.', de: 'Sprachen sind sehr wichtig für meine zukünftige Karriere.', marks: 2, questionNumber: '41.4' },
          { es: 'El desempleo juvenil es un problema serio.', fr: 'Le chômage des jeunes est un problème sérieux.', de: 'Jugendarbeitslosigkeit ist ein ernstes Problem.', marks: 2, questionNumber: '41.5' }
        ]
      }
    }
  };

  const themeData = variations[theme];
  if (!themeData) {
    console.warn(`No specific variations found for theme: ${theme} - using default Spanish.`);
    return getDefaultSpanishVariations();
  }
  const topicData = themeData[topic];
  if (!topicData) {
    console.warn(`No specific variations found for topic: ${topic} under theme ${theme} - using default Spanish.`);
    return getDefaultSpanishVariations();
  }
  return topicData;
}

// --- Default Spanish Content for Fallback ---
function getDefaultSpanishVariations() {
  return {
    letterMatching: [
      'Me gusta hacer actividades diferentes en mi tiempo libre.',
      'Practico deportes con mis amigos los fines de semana.',
      'Leo libros interesantes en la biblioteca municipal.',
      'Escucho música mientras hago mis tareas escolares.'
    ],
    options: ['Sports', 'Reading', 'Music', 'Art', 'Gaming', 'Cooking'],
    mainText: 'Este es un texto de ejemplo para evaluaciones temáticas.',
    multipleChoice: [
      { question: 'Sample question?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    studentGrid: [
      { name: 'Student1', text: 'Sample text 1' },
      { name: 'Student2', text: 'Sample text 2' },
      { name: 'Student3', text: 'Sample text 3' }
    ],
    gridQuestions: [
      { question: 'Sample question?', correct: 'A' }
    ],
    openResponseText: 'Sample open response text.',
    openQuestions: [
      { question: 'Sample question?', expectedWords: 2, acceptableAnswers: ['sample answer'] }
    ],
    timeSequenceText: 'Sample time sequence text.',
    timeEvents: [
      { event: 'Sample event', correct: 'P' }
    ],
    headlines: [
      { letter: 'A', text: 'Sample headline' }
    ],
    articles: [
      { text: 'Sample article text.', correct: 'A' }
    ],
    completionText: 'Sample completion text.',
    completionSentences: [
      { incomplete: 'Sample _____ sentence.', correct: 'completion' }
    ],
    lifestyleText: 'Sample lifestyle text.',
    lifestyleQuestions: [
      { question: 'Sample question?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    translations: [
      { es: 'Ejemplo de traducción.', fr: 'Exemple de traducción.', de: 'Beispiel für Übersetzung.', marks: 2, questionNumber: '40.1' }
    ]
  };
}

/**
 * Generates Spanish topic questions for a specific topic - ALL 40 QUESTIONS
 * @param {string} theme - The AQA theme ID.
 * @param {string} topic - The AQA topic name.
 * @param {string} assessmentId - The ID of the assessment this question belongs to.
 * @param {'foundation' | 'higher'} level - The difficulty level ('foundation' or 'higher').
 * @returns {Array<AQATopicQuestionDefinition>} An array of question objects.
 */
function generateSpanishTopicQuestions(theme: string, topic: string, assessmentId: string, level: 'foundation' | 'higher'): AQATopicQuestionDefinition[] {
  // Topic-specific content variations
  const topicVariations = getSpanishTopicVariations(theme, topic);

  return [
    // Questions 1-4: Letter Matching - Topic-focused hobbies (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: `Questions 1-4: ${topic} - Activities and interests`,
      instructions: `Some Spanish teenagers are talking about activities related to ${topic.toLowerCase()}. Which activity does each person mention? Write the correct letter in each box.`,
      marks: 4,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Ana', text: topicVariations.letterMatching[0] },
          { name: 'Carlos', text: topicVariations.letterMatching[1] },
          { name: 'María', text: topicVariations.letterMatching[2] },
          { name: 'Diego', text: topicVariations.letterMatching[3] }

        ],
        options: [
          { letter: 'A', subject: topicVariations.options[0] }, // Matches letterMatching[0]
          { letter: 'B', subject: topicVariations.options[1] }, // Matches letterMatching[1]
          { letter: 'C', subject: topicVariations.options[2] }, // Matches letterMatching[2]
          { letter: 'D', subject: topicVariations.options[3] }, // Matches letterMatching[3]
          { letter: 'E', subject: topicVariations.options[4] },
          { letter: 'F', subject: topicVariations.options[5] }
        ],
        // Shuffled answers
        correctAnswers: { 'Ana': 'A', 'Carlos': 'D', 'María': 'B', 'Diego': 'C' }
      }
    },

    // Questions 5-9: Multiple Choice - Topic-focused reading (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: ${topic}`,
      instructions: `You read this extract about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.mainText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.multipleChoice
      }
    },

    // Questions 10-15: Student Grid - Topic-focused activities (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: `Questions 10-15: ${topic} - Student experiences`,
      instructions: `You see an online forum. Some Spanish students are discussing ${topic.toLowerCase()}. Answer the following questions. Write E for Elena, P for Pablo, S for Sofía.`, // Updated names
      marks: 6,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['E', 'P', 'S'], // Updated names
        studentTexts: topicVariations.studentGrid,
        questions: topicVariations.gridQuestions
      }
    },

    // Questions 16-20: Open Response - Topic-focused article (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: `Questions 16-20: ${topic} in Spain`,
      instructions: `You read this extract from an article about ${topic.toLowerCase()} in Spain. Answer the following questions in English.`,
      reading_text: topicVariations.openResponseText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.openQuestions
      }
    },

    // Questions 21-25: Time Sequence - Topic-focused interview (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: `Questions 21-25: Interview about ${topic}`,
      instructions: `A Spanish person talks about their experience with ${topic.toLowerCase()}. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.`,
      reading_text: topicVariations.timeSequenceText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: topicVariations.timeEvents
      }
    },

    // Questions 26-30: Headline Matching - Topic-focused news (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: `Questions 26-30: News headlines about ${topic}`,
      instructions: `Match each news article extract with the correct headline. Write the correct letter in each box.`,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: topicVariations.headlines,
        articles: topicVariations.articles
      }
    },

    // Questions 31-35: Sentence Completion - Topic-focused article (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: `Questions 31-35: ${topic}`,
      instructions: `Complete the sentences based on the text. Write the missing words in English.`,
      reading_text: topicVariations.completionText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: topicVariations.completionSentences
      }
    },

    // Questions 36-40: Multiple Choice - Topic-focused lifestyle (5 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: `Questions 36-40: ${topic} and lifestyle`,
      instructions: `Read this article about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.lifestyleText,
      marks: 5, // Changed from 4 to 5 marks
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.lifestyleQuestions
      }
    },

    // Question 41: Translation - Topic-focused sentences (10 marks)
    {
      question_number: 41, // Changed from 40 to 41
      question_type: 'translation',
      title: `Question 41: Translation about ${topic}`, // Changed from 40 to 41
      instructions: `Translate these sentences about ${topic.toLowerCase()} into English.`,
      marks: 10,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        // Updated to use spread operator
        sentences: topicVariations.translations.map((t: any, i: number) => ({
          ...t, // This ensures all language properties (es, fr, de) are included
          questionNumber: `41.${i + 1}` // Changed from 40 to 41
        }))
      }
    }
  ];
}

// --- Specific Content Variations for French ---
function getFrenchTopicVariations(theme: string, topic: string) {
  const variations: Record<string, Record<string, any>> = {
    'Theme 1: People and lifestyle': {
      'Identity and relationships with others': { // Existing content, unchanged
        letterMatching: [
          'J\'adore passer du temps avec ma famille. Nous organisons toujours des réunions familiales le dimanche.',
          'J\'ai beaucoup d\'amis de différents pays. J\'aime apprendre sur leurs cultures et traditions.',
          'Ma petite sœur et moi partageons beaucoup de secrets. Elle est ma meilleure confidente.',
          'Mes grands-parents habitent près de chez nous. Nous leur rendons visite chaque semaine pour déjeuner ensemble.'
        ],
        options: ['Family time', 'Cultural exchange', 'Sibling bonds', 'Grandparent visits', 'Friendship', 'Community'],
        mainText: 'Les relations familiales sont fondamentales dans la culture française. Dans ma famille, nous avons des traditions très importantes comme les repas dominicaux où toute la famille se réunit. Ma grand-mère prépare toujours un pot-au-feu traditionnel et mes cousins viennent de Lyon pour être avec nous. Pendant ces réunions, nous parlons de nos vies, partageons des nouvelles et renforçons nos liens familiaux. Les jeunes Français valorisent beaucoup ces traditions car elles nous aident à maintenir notre identité culturelle.',
        multipleChoice: [
          { question: 'What is fundamental in French culture?', options: ['A. Work relationships', 'B. Family relationships', 'C. School relationships'], correct: 'B' },
          { question: 'When does the family meet?', options: ['A. Sunday meals', 'B. Saturday evenings', 'C. Friday afternoons'], correct: 'A' },
          { question: 'What does the grandmother prepare?', options: ['A. Ratatouille', 'B. Pot-au-feu', 'C. Bouillabaisse'], correct: 'B' },
          { question: 'Where do the cousins come from?', options: ['A. Paris', 'B. Lyon', 'C. Marseille'], correct: 'B' },
          { question: 'Why do young French people value these traditions?', options: ['A. They are fun', 'B. They maintain cultural identity', 'C. They are required'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Lucie', text: 'Dans ma famille nous sommes très unis. J\'ai trois frères et nous nous soutenons toujours mutuellement. Quand j\'ai des problèmes, je parle avec mon frère aîné car il me donne de bons conseils. Les week-ends nous faisons des activités ensemble comme aller au cinéma ou jouer au football dans le parc.' },
          { name: 'Marc', text: 'Mes parents ont divorcé quand j\'étais petit, mais nous maintenons une bonne relation. Je vis avec ma mère pendant la semaine et avec mon père les week-ends. Au début c\'était difficile, mais maintenant je suis habitué. L\'important c\'est qu\'ils m\'aiment tous les deux beaucoup.' },
          { name: 'Isabelle', text: 'Je suis fille unique, mais je ne me sens pas seule car j\'ai beaucoup de cousins. Mes oncles et tantes habitent dans la même ville et nous nous voyons fréquemment. Pendant les vacances d\'été, nous allons tous ensemble à la plage à Nice. C\'est comme avoir des frères et sœurs.' }
        ],
        gridQuestions: [
          { question: 'Who has three brothers?', correct: 'L' },
          { question: 'Who talks to their older brother for advice?', correct: 'L' },
          { question: 'Whose parents are divorced?', correct: 'M' },
          { question: 'Who is an only child?', correct: 'I' },
          { question: 'Who has many cousins?', correct: 'I' },
          { question: 'Who goes to Nice during summer holidays?', correct: 'I' }
        ],
        openResponseText: 'La structure familiale en France a beaucoup changé au cours des dernières décennies. Traditionnellement, les familles françaises étaient assez grandes, avec plusieurs enfants et parfois plusieurs générations vivant dans la même maison. Aujourd\'hui, les familles sont plus petites, avec un ou deux enfants au maximum. Beaucoup de jeunes vivent chez leurs parents jusqu\'à vingt-cinq ans en raison de la situation économique. Cependant, les liens familiaux restent très forts et les réunions familiales continuent d\'être importantes dans la culture française.',
        openQuestions: [
          { question: 'How has the French family structure changed?', expectedWords: 3, acceptableAnswers: ['families are smaller', 'fewer children now', 'smaller families today'] },
          { question: 'How many children do families have today?', expectedWords: 3, acceptableAnswers: ['one or two', 'maximum two children', 'one two maximum'] },
          { question: 'Until what age do young people live with parents?', expectedWords: 3, acceptableAnswers: ['twenty-five years', 'age twenty-five', 'until 25'] },
          { question: 'Why do young people stay with parents longer?', expectedWords: 3, acceptableAnswers: ['economic situation', 'financial reasons', 'economic problems'] },
          { question: 'What remains important in French culture?', expectedWords: 3, acceptableAnswers: ['family meetings', 'family reunions', 'family gatherings'] }
        ],
        timeSequenceText: 'Quand j\'étais enfant, je vivais avec mes grands-parents dans un petit village de Provence. Maintenant je vis à Paris avec mes parents et j\'étudie à l\'université. Ma relation avec ma famille a beaucoup changé depuis. Avant je dépendais complètement de mes grands-parents pour tout. Actuellement je suis plus indépendant mais je continue à valoriser beaucoup le temps que je passe avec ma famille. L\'année prochaine je prévois de déménager dans mon propre appartement, mais je veux maintenir un contact fréquent avec tous. À l\'avenir, quand j\'aurai ma propre famille, j\'espère transmettre les mêmes valeurs que j\'ai apprises de mes grands-parents.',
        timeEvents: [
          { event: 'Living in Paris and studying', correct: 'N' },
          { event: 'Living with grandparents in Provence', correct: 'P' },
          { event: 'Being completely dependent on grandparents', correct: 'P' },
          { event: 'Planning to move to own apartment', correct: 'F' },
          { event: 'Having own family and transmitting values', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'French families celebrate traditional Sunday meals' },
          { letter: 'B', text: 'Young adults living with parents longer due to economy' },
          { letter: 'C', text: 'Grandparents play important role in childcare' },
          { letter: 'D', text: 'Divorce rates increase but family bonds remain strong' },
          { letter: 'E', text: 'French youth value cultural identity through family' },
          { letter: 'F', text: 'Multi-generational homes becoming less common' }
        ],
        articles: [
          { text: 'Les jeunes Français restent chez leurs parents jusqu\'à des âges plus avancés en raison de la crise économique et du manque d\'emploi stable.', correct: 'B' },
          { text: 'Les familles françaises maintiennent la tradition des repas dominicaux comme moyen de renforcer les liens familiaux et de transmettre les valeurs culturelles.', correct: 'A' },
          { text: 'Bien que les taux de divorce aient augmenté en France, les liens familiaux restent forts et les familles trouvent de nouvelles façons de rester unies.', correct: 'D' },
          { text: 'Les grands-parents français jouent un rôle crucial dans la garde des petits-enfants, surtout quand les deux parents travaillent à l\'extérieur.', correct: 'C' },
          { text: 'Les jeunes Français considèrent que maintenir les traditions familiales est essentiel pour préserver leur identité culturelle dans un monde globalisé.', correct: 'E' }
        ],
        completionText: 'L\'identité personnelle se forme à travers les relations que nous établissons avec les autres. En France, la famille élargie joue un rôle fondamental dans le développement de la personnalité des jeunes. Les grands-parents transmettent des histoires et des traditions, les parents fournissent un soutien émotionnel et économique, et les frères et sœurs offrent de la compagnie et de la compréhension. Ces relations multiples aident à créer une identité solide et un sentiment d\'appartenance à la communauté.',
        completionSentences: [
          { incomplete: 'Personal identity is formed through _____ with others.', correct: 'relationships' },
          { incomplete: 'Extended family plays a _____ role in development.', correct: 'fundamental' },
          { incomplete: 'Grandparents transmit _____ and traditions.', correct: 'stories' },
          { incomplete: 'Parents provide emotional and _____ support.', correct: 'economic' },
          { incomplete: 'These relationships help create a sense of _____.', correct: 'belonging' }
        ],
        lifestyleText: 'L\'équilibre entre la vie familiale et personnelle est très important pour les Français. Beaucoup de personnes consacrent du temps spécifique chaque semaine pour être avec la famille, mais maintiennent aussi leurs propres loisirs et intérêts. Il est courant que les jeunes sortent avec des amis dans l\'après-midi mais rentrent à la maison pour dîner avec la famille. Cette combinaison d\'indépendance et de connexion familiale caractérise le style de vie français moderne.',
        lifestyleQuestions: [
          { question: 'What is important for French people?', options: ['A. Work-life balance', 'B. Family-personal life balance', 'C. Study-leisure balance'], correct: 'B' },
          { question: 'How much time do people dedicate to family?', options: ['A. Specific time each week', 'B. All their free time', 'C. Only weekends'], correct: 'A' },
          { question: 'When do young people go out with friends?', options: ['A. In the mornings', 'B. In the afternoons', 'C. At night only'], correct: 'B' },
          { question: 'What characterizes modern French lifestyle?', options: ['A. Complete independence', 'B. Only family focus', 'C. Independence and family connection'], correct: 'C' }
        ],
        translations: [
          { es: 'Mi familia es muy unida y nos apoyamos siempre.', fr: 'Ma famille est très unie et nous nous soutenons toujours.', de: 'Meine Familie ist sehr eng verbunden und wir unterstützen uns immer.', marks: 2, questionNumber: '40.1' },
          { es: 'Tengo una relación muy especial con mis abuelos maternos.', fr: 'J\'ai une relation très spéciale avec mes grands-parents maternels.', de: 'Ich habe eine sehr besondere Beziehung zu meinen Großeltern mütterlicherseits.', marks: 2, questionNumber: '40.2' },
          { es: 'Los domingos toda la familia se reúne para almorzar juntos.', fr: 'Le dimanche toute la familia se réunit pour déjeuner ensemble.', de: 'Sonntags versammelt sich die ganze Familie zum gemeinsamen Mittagessen.', marks: 2, questionNumber: '40.3' },
          { es: 'Mis padres me enseñaron la importancia de los valores familiares.', fr: 'Mes parents m\'ont enseigné l\'importance des valeurs familiales.', de: 'Meine Eltern haben mir die Wichtigkeit von Familienwerten beigebracht.', marks: 2, questionNumber: '40.4' },
          { es: 'Aunque vivo lejos, mantengo contacto diario con mi hermana.', fr: 'Bien que je vive loin, je maintiens un contact quotidien avec ma sœur.', de: 'Obwohl ich weit weg lebe, halte ich täglichen Kontakt mit meiner Schwester.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Healthy living and lifestyle': { // Existing content, unchanged
        letterMatching: [
          'Pour rester en forme, je fais du sport trois fois par semaine. J\'adore courir au parc.',
          'J\'essaie de manger cinq portions de fruits et légumes par jour. Mon préféré est la pomme.',
          'Il est important de dormir huit heures chaque nuit pour avoir de l\'énergie et être de bonne humeur.',
          'Je bois beaucoup d\'eau pour rester hydraté, surtout après avoir fait de l\'exercice.'
        ],
        options: ['Sports', 'Healthy Eating', 'Sleep', 'Hydration', 'Mindfulness', 'Relaxation'],
        mainText: 'Adopter un mode de vie sain est essentiel pour les jeunes d\'aujourd\'hui. De nombreux adolescents français pratiquent des sports comme le football, le basketball ou la natation pour rester actifs. La cuisine française, bien que réputée pour ses plats riches, intègre aussi beaucoup de légumes et de produits frais. Il est crucial d\'éviter les boissons sucrées et la restauration rapide. De plus, le bien-être mental est tout aussi important que la santé physique, c\'est pourquoi des activités comme la lecture ou passer du temps avec des amis sont fondamentales pour réduire le stress.',
        multipleChoice: [
          { question: 'What is essential for young people today?', options: ['A. Playing video games', 'B. Having a healthy life', 'C. Eating fast food'], correct: 'B' },
          { question: 'Which sports are popular among French teenagers?', options: ['A. Cricket and rugby', 'B. Football, basketball, and swimming', 'C. Golf and tennis'], correct: 'B' },
          { question: 'What is important to avoid for a healthy diet?', options: ['A. Fruits and vegetables', 'B. Sugary drinks and fast food', 'C. Fish and olive oil'], correct: 'B' },
          { question: 'Why are activities like reading or spending time with friends important?', options: ['A. To get good grades', 'B. To reduce stress', 'C. To learn new languages'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Chloé', text: 'Pour avoir une vie équilibrée, je m\'assure d\'étudier et aussi de faire des activités parascolaires. Je joue au handball deux fois par semaine et cela m\'aide à me détendre. J\'essaie de ne pas passer trop de temps sur les réseaux sociaux.' },
          { name: 'Lucas', text: 'Mon défi est de manger plus sainement. J\'adore la restauration rapide, mais je sais que ce n\'est pas bon. Mes parents essaient de nous faire manger plus de légumes à la maison et j\'apprends à cuisiner des plats sains.' },
          { name: 'Manon', text: 'Le stress des examens est bien réel. Pour le gérer, je fais du jogging et j\'écoute de la musique relaxante. Il est aussi essentiel de parler à mes amis et à ma famille si je me sens dépassée. La santé mentale est une priorité pour moi.' }
        ],
        gridQuestions: [
          { question: 'Who plays handball to relax?', correct: 'C' },
          { question: 'Who is trying to eat more healthily?', correct: 'L' },
          { question: 'Who likes fast food?', correct: 'L' },
          { question: 'Who manages exam stress with jogging?', correct: 'M' },
          { question: 'Who prioritises mental health?', correct: 'M' },
          { question: 'Who tries to limit time on social media?', correct: 'C' }
        ],
        openResponseText: 'L\'activité physique est cruciale pour la santé. L\'Organisation Mondiale de la Santé recommande que les adolescents fassent au moins 60 minutes d\'activité physique modérée à intense chaque jour. Cela peut inclure des sports, de la marche rapide, de la danse ou du vélo. Le manque d\'activité physique peut entraîner des problèmes de santé comme l\'obésité et des maladies cardiovasculaires à l\'avenir. Il est important de trouver une activité que vous aimez pour qu\'il soit plus facile de la maintenir à long terme.',
        openQuestions: [
          { question: 'How many minutes of physical activity are recommended daily for teenagers?', expectedWords: 2, acceptableAnswers: ['60 minutes', 'sixty minutes', 'at least 60 minutes'] },
          { question: 'Name two activities that count as physical activity.', expectedWords: 4, acceptableAnswers: ['sports and walking', 'dancing and cycling', 'sports dancing', 'walking cycling'] },
          { question: 'What health problem can lack of physical activity lead to?', expectedWords: 1, acceptableAnswers: ['obesity', 'heart disease'] },
          { question: 'Why is it important to find an activity you like?', expectedWords: 5, acceptableAnswers: ['easier to maintain long-term', 'to maintain it longer', 'easier to keep it'] },
          { question: 'What kind of physical activity is recommended?', expectedWords: 4, acceptableAnswers: ['moderate to intense', 'moderate intense'] }
        ],
        timeSequenceText: 'Quand j\'étais enfant, je passais des heures à jouer à des jeux vidéo et à manger beaucoup de sucreries. J\'étais assez sédentaire. Maintenant, à l\'adolescence, j\'ai changé mes habitudes. Je vais à la piscine trois fois par semaine et je mange de manière plus équilibrée. Mes parents m\'ont encouragé à être plus actif et m\'ont aidé à comprendre l\'importance de la santé. L\'année prochaine, je veux participer à un marathon. À l\'avenir, j\'espère pouvoir inspirer d\'autres personnes à adopter un mode de vie sain.',
        timeEvents: [
          { event: 'Spending hours playing video games', correct: 'P' },
          { event: 'Going to the pool three times a week', correct: 'N' },
          { event: 'Planning to participate in a marathon', correct: 'F' },
          { event: 'Being quite sedentary', correct: 'P' },
          { event: 'Hoping to inspire others to adopt a healthy lifestyle', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'The importance of balanced meals for teenagers' },
          { letter: 'B', text: 'Mental well-being: A priority for young people' },
          { letter: 'C', text: 'How technology influences adolescent sleep patterns' },
          { letter: 'D', text: 'Teenagers opting for outdoor activities over screens' },
          { letter: 'E', text: 'Government campaigns promote healthy habits in schools' },
          { letter: 'F', text: 'The rise of plant-based diets among French youth' }
        ],
        articles: [
          { text: 'Une étude récente montre que plus de jeunes Français choisissent de passer leur temps libre à faire de la randonnée et du vélo plutôt que d\'utiliser des appareils électroniques. Cela contribue à un mode de vie plus actif.', correct: 'D' },
          { text: 'Les nouvelles initiatives gouvernementales visent à éduquer les étudiants sur l\'importance de la nutrition et de l\'exercice à travers des ateliers et des programmes sportifs dans les écoles.', correct: 'E' },
          { text: 'Beaucoup d\'adolescents français adoptent des régimes végétariens et végétaliens, ce qui est considéré comme un pas positif vers une alimentation plus consciente et durable.', correct: 'F' },
          { text: 'Les experts en santé mentale soulignent la nécessité d\'aborder le stress et l\'anxiété chez les jeunes, en promouvant des activités qui favorisent la relaxation et l\'équilibre émotionnel.', correct: 'B' },
          { text: 'La qualité du sommeil chez les adolescents est affectée par l\'utilisation excessive de téléphones portables avant de dormir, ce qui a un impact négatif sur leurs performances scolaires et leur humeur.', correct: 'C' }
        ],
        completionText: 'Une alimentation équilibrée est fondamentale pour la croissance et le développement des adolescents. Inclure une variété de fruits, légumes, protéines et céréales complètes fournit l\'énergie nécessaire pour les études et le sport. Éviter les aliments ultra-transformés et les boissons à forte teneur en sucre est essentiel pour prévenir les problèmes de santé à long terme comme le diabète de type 2. Il est important que les jeunes apprennent à prendre des décisions saines pour leur bien-être futur.',
        completionSentences: [
          { incomplete: 'A balanced diet is _____ for growth and development.', correct: 'fundamental' },
          { incomplete: 'It provides the necessary _____ for studying and sports.', correct: 'energy' },
          { incomplete: 'Avoiding ultra-processed foods helps _____ long-term health issues.', correct: 'prevent' },
          { incomplete: 'Sugary drinks can lead to problems like Type 2 _____.', correct: 'diabetes' },
          { incomplete: 'Young people should learn to make _____ choices.', correct: 'healthy' }
        ],
        lifestyleText: 'Le mode de vie sain ne concerne pas seulement l\'alimentation et l\'exercice, mais aussi le bien-être mental. En France, les jeunes sont de plus en plus conscients de l\'importance de prendre soin de leur santé mentale. Des activités comme la méditation, passer du temps dans la nature ou pratiquer un hobby aident à réduire le stress. C\'est une approche holistique qui combine la bonne alimentation, l\'activité physique et la santé émotionnelle pour une vie épanouie.',
        lifestyleQuestions: [
          { question: 'What does a healthy lifestyle include besides diet and exercise?', options: ['A. Financial stability', 'B. Mental well-being', 'C. Career success'], correct: 'B' },
          { question: 'What are French youth increasingly aware of?', options: ['A. The latest fashion trends', 'B. The importance of mental health', 'C. New technologies'], correct: 'B' },
          { question: 'Name one activity that helps reduce stress.', options: ['A. Playing violent video games', 'B. Meditation', 'C. Eating unhealthy snacks'], correct: 'B' },
          { question: 'What kind of approach is it for a full life?', options: ['A. A physical approach', 'B. A financial approach', 'C. A holistic approach'], correct: 'C' },
          { question: 'How can teenagers find balance between study and leisure?', options: ['A. By only focusing on academics', 'B. By combining both effectively', 'C. By ignoring extracurriculars'], correct: 'B' } // Added question
        ],
        translations: [
          { es: 'Para mantenerme sano, hago deporte regularmente.', fr: 'Pour rester en bonne santé, je fais du sport régulièrement.', de: 'Um gesund zu bleiben, treibe ich regelmäßig Sport.', marks: 2, questionNumber: '40.1' },
          { es: 'Comer frutas y verduras es muy importante.', fr: 'Manger des fruits et légumes est très important.', de: 'Obst und Gemüse zu essen ist sehr wichtig.', marks: 2, questionNumber: '40.2' },
          { es: 'Duermo ocho heures chaque nuit pour avoir de l\'énergie.', fr: 'Je dors huit heures chaque nuit pour avoir de l\'énergie.', de: 'Ich schlafe acht Stunden pro Nacht, um Energie zu haben.', marks: 2, questionNumber: '40.3' },
          { es: 'Evito la restauration rapide et les boissons sucrées.', fr: 'J\'évite la restauration rapide et les boissons sucrées.', de: 'Ich vermeide Fast Food und zuckerhaltige Getränke.', marks: 2, questionNumber: '40.4' },
          { es: 'La santé mentale est aussi importante que la santé physique.', fr: 'La santé mentale est aussi importante que la santé physique.', de: 'Mentale Gesundheit ist genauso wichtig wie körperliche Gesundheit.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Education and work': { // NEW CONTENT FOR EDUCATION AND WORK
        letterMatching: [
          'Je suis en terminale et je pense aller à l\'université pour étudier le droit.',
          'Ma sœur aînée n\'est pas allée à l\'université; elle fait un apprentissage pour être pâtissière.',
          'Après les cours, j\'ai un petit boulot dans un supermarché pour gagner un peu d\'argent.',
          'Les examens du baccalauréat cette année sont très stressants mais importants pour mon avenir.'
        ],
        options: ['University', 'Apprenticeship', 'Part-time job', 'Exams', 'Career choices', 'Studying abroad'],
        mainText: 'En France, l\'enseignement secondaire se termine par le baccalauréat, qui est essentiel pour accéder à l\'université. Les étudiants peuvent choisir entre des filières générales, technologiques ou professionnelles. De plus en plus de jeunes optent pour l\'alternance, combinant études et expérience professionnelle en entreprise. La recherche d\'emploi pour les jeunes est un sujet important, et le gouvernement met en place des aides pour faciliter leur insertion professionnelle. Les compétences numériques et linguistiques sont très recherchées sur le marché du travail français.',
        multipleChoice: [
          { question: 'What is essential for accessing university in France?', options: ['A. A driver\'s license', 'B. The baccalauréat', 'C. A part-time job'], correct: 'B' },
          { question: 'Which types of streams can students choose for secondary education?', options: ['A. Only general', 'B. General, technological, or professional', 'C. Only professional'], correct: 'B' },
          { question: 'What does \'alternance\' combine?', options: ['A. Study and travel', 'B. Study and professional experience', 'C. Study and hobbies'], correct: 'B' },
          { question: 'What is a highly sought-after skill in the French job market?', options: ['A. Cooking skills', 'B. Digital and linguistic skills', 'C. Driving skills'], correct: 'B' },
          { question: 'What is the French government putting in place to help young people find jobs?', options: ['A. New taxes', 'B. Aid to facilitate professional integration', 'C. More exams'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Léa', text: 'Je suis en première année de fac de médecine. C\'est très exigeant, mais je suis motivée. Je travaille aussi comme bénévole à l\'hôpital un soir par semaine pour avoir une première idée du métier.' },
          { name: 'Tom', text: 'J\'ai arrêté l\'école après le brevet. Maintenant je fais un CAP de cuisine en apprentissage. J\'adore cuisiner et j\'espère ouvrir mon propre restaurant un jour.' },
          { name: 'Clara', text: 'Je suis encore au lycée. Je ne sais pas encore si je veux faire des études longues ou courtes. Mes parents me conseillent de bien réfléchir à mes choix d\'orientation.' }
        ],
        gridQuestions: [
          { question: 'Who is volunteering in a hospital?', correct: 'L' },
          { question: 'Who hopes to open their own restaurant?', correct: 'T' },
          { question: 'Who is doing an apprenticeship?', correct: 'T' },
          { question: 'Who is unsure about long or short studies?', correct: 'C' },
          { question: 'Who is studying medicine?', correct: 'L' },
          { question: 'Whose parents advise them on career choices?', correct: 'C' }
        ],
        openResponseText: 'Le taux de chômage des jeunes en France est une préoccupation majeure. Pour y remédier, des initiatives comme le Service Civique ou des contrats aidés sont proposés. Les entreprises sont encouragées à recruter des jeunes et à leur offrir des formations. L\'accent est mis sur le développement de compétences transversales, comme le travail en équipe et la résolution de problèmes, en plus des compétences techniques. La mobilité professionnelle, y compris à l\'international, est aussi un facteur important pour la réussite des jeunes.',
        openQuestions: [
          { question: 'What is a major concern in France regarding young people?', expectedWords: 4, acceptableAnswers: ['youth unemployment rate', 'the youth unemployment rate', 'unemployment rate of young people'] },
          { question: 'Name one initiative proposed to address youth unemployment.', expectedWords: 3, acceptableAnswers: ['Service Civique', 'aided contracts', 'service civique or aided contracts'] },
          { question: 'What are companies encouraged to do for young people?', expectedWords: 5, acceptableAnswers: ['recruit them and offer training', 'recruit and offer training', 'to recruit them and offer training'] },
          { question: 'Name two transversal skills that are emphasized.', expectedWords: 5, acceptableAnswers: ['teamwork and problem-solving', 'working in a team solving problems', 'problem-solving and teamwork'] },
          { question: 'What is also an important factor for youth success?', expectedWords: 3, acceptableAnswers: ['professional mobility', 'international mobility', 'professional and international mobility'] }
        ],
        timeSequenceText: 'Quand j\'étais enfant, je rêvais de devenir astronaute, même si j\'étais nul en sciences. Au collège, j\'ai découvert ma passion pour l\'informatique. Actuellement, je suis en BTS (Brevet de Technicien Supérieur) en informatique et je fais un stage dans une startup. L\'année prochaine, j\'aimerais continuer mes études en licence professionnelle. Dans le futur, j\'espère travailler dans la cybersécurité et contribuer à protéger les données importantes.',
        timeEvents: [
          { event: 'Dreaming of becoming an astronaut', correct: 'P' },
          { event: 'Discovering a passion for IT in middle school', correct: 'P' },
          { event: 'Doing an internship in a startup', correct: 'N' },
          { event: 'Planning to continue studies next year', correct: 'F' },
          { event: 'Hoping to work in cybersecurity', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'New apprenticeship contracts for young people' },
          { letter: 'B', text: 'Digital skills in high demand in the job market' },
          { letter: 'C', text: 'Youth unemployment: Government initiatives' },
          { letter: 'D', text: 'Gap year trend grows among French students' },
          { letter: 'E', text: 'Importance of soft skills for professional integration' },
          { letter: 'F', text: 'Vocational training: A path to quick employment' }
        ],
        articles: [
          { text: 'Le gouvernement annonce de nouveaux dispositifs pour faciliter l\'accès des jeunes à l\'apprentissage et à des contrats de professionnalisation.', correct: 'A' },
          { text: 'La capacité à travailler en équipe et à s\'adapter sont désormais aussi importantes que les diplômes pour trouver un emploi en France.', correct: 'E' },
          { text: 'De plus en plus de lycéens français envisagent de prendre une année sabbatique avant d\'entamer leurs études supérieures.', correct: 'D' },
          { text: 'Face à un marché du travail en évolution, les compétences numériques sont devenues indispensables pour la plupart des postes.', correct: 'B' },
          { text: 'Malgré des améliorations, la lutte contre le chômage des jeunes reste une priorité pour les pouvoirs publics français.', correct: 'C' }
        ],
        completionText: 'L\'orientation professionnelle est une étape clé pour les jeunes. Choisir la bonne voie nécessite de bien se connaître et de s\'informer sur les différentes opportunités. Les salons étudiants et les conseillers d\'orientation jouent un rôle important pour guider les élèves. Il est également bénéfique de parler avec des professionnels pour comprendre la réalité des métiers. Un projet professionnel bien défini augmente les chances de réussite dans le parcours éducatif et la carrière.',
        completionSentences: [
          { incomplete: 'Career guidance is a _____ step for young people.', correct: 'key' },
          { incomplete: 'Choosing the right path requires knowing yourself and getting _____ about opportunities.', correct: 'informed' },
          { incomplete: 'Student fairs and career counselors play an important _____ to guide students.', correct: 'role' },
          { incomplete: 'It is beneficial to talk with _____ to understand the reality of jobs.', correct: 'professionals' },
          { incomplete: 'A well-defined career plan increases chances of _____ in education and career.', correct: 'success' }
        ],
        lifestyleText: 'Le mode de vie sain ne concerne pas seulement l\'alimentation et l\'exercice, mais aussi le bien-être mental. En France, les jeunes sont de plus en plus conscients de l\'importance de prendre soin de leur santé mentale. Des activités comme la méditation, passer du temps dans la nature ou pratiquer un hobby aident à réduire le stress. C\'est une approche holistique qui combine la bonne alimentation, l\'activité physique et la santé émotionnelle pour une vie épanouie.',
        lifestyleQuestions: [
          { question: 'What is a key step for young people?', options: ['A. Traveling', 'B. Career guidance', 'C. Learning to drive'], correct: 'B' },
          { question: 'What is important when choosing the right path?', options: ['A. Knowing many people', 'B. Knowing yourself and getting informed', 'C. Having a lot of money'], correct: 'B' },
          { question: 'Who plays an important role in guiding students?', options: ['A. Famous celebrities', 'B. Student fairs and career counselors', 'C. Sports coaches'], correct: 'B' },
          { question: 'What does talking with professionals help to understand?', options: ['A. Their personal lives', 'B. The reality of jobs', 'C. How to make friends'], correct: 'B' },
          { question: 'What increases chances of success in education and career?', options: ['A. A rich family', 'B. A well-defined career plan', 'C. Only good luck'], correct: 'B' }
        ],
        translations: [
          { es: 'J\'étudie pour le baccalauréat cette année.', fr: 'J\'étudie pour le baccalauréat cette année.', de: 'Ich lerne dieses Jahr für das Abitur.', marks: 2, questionNumber: '41.1' },
          { es: 'Je voudrais faire un stage dans une entreprise.', fr: 'Je voudrais faire un stage dans une entreprise.', de: 'Ich möchte ein Praktikum in einer Firma machen.', marks: 2, questionNumber: '41.2' },
          { es: 'Le travail à temps partiel m\'aide à être indépendant.', fr: 'Le travail à temps partiel m\'aide à être indépendant.', de: 'Mein Teilzeitjob hilft mir, unabhängig zu sein.', marks: 2, questionNumber: '41.3' },
          { es: 'Les langues étrangères sont utiles pour ma future profession.', fr: 'Les langues étrangères sont utiles pour ma future profession.', de: 'Fremdsprachen sind nützlich für meinen zukünftigen Beruf.', marks: 2, questionNumber: '41.4' },
          { es: 'Le chômage des jeunes est un grand défi.', fr: 'Le chômage des jeunes est un grand défi.', de: 'Jugendarbeitslosigkeit ist eine große Herausforderung.', marks: 2, questionNumber: '41.5' }
        ]
      }
    }
  };

  const themeData = variations[theme];
  if (!themeData) {
    console.warn(`No specific variations found for theme: ${theme} - using default French.`);
    return getDefaultFrenchVariations();
  }
  const topicData = themeData[topic];
  if (!topicData) {
    console.warn(`No specific variations found for topic: ${topic} under theme ${theme} - using default French.`);
    return getDefaultFrenchVariations();
  }
  return topicData;
}

// --- Default French Content for Fallback ---
function getDefaultFrenchVariations() {
  return {
    letterMatching: [
      'J\'aime faire des activités différentes pendant mon temps libre.',
      'Je pratique des sports avec mes amis les week-ends.',
      'Je lis des livres intéressants à la bibliothèque municipale.',
      'J\'écoute de la musique en faisant mes devoirs.'
    ],
    options: ['Sports', 'Reading', 'Music', 'Art', 'Gaming', 'Cooking'],
    mainText: 'Ceci est un texte d\'exemple pour les évaluations thématiques.',
    multipleChoice: [
      { question: 'Question d\'exemple?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    studentGrid: [
      { name: 'Étudiant1', text: 'Texte d\'exemple 1' },
      { name: 'Étudiant2', text: 'Texte d\'exemple 2' },
      { name: 'Étudiant3', text: 'Texte d\'exemple 3' }
    ],
    gridQuestions: [
      { question: 'Question d\'exemple?', correct: 'A' }
    ],
    openResponseText: 'Texte de réponse ouverte d\'exemple.',
    openQuestions: [
      { question: 'Question d\'exemple?', expectedWords: 2, acceptableAnswers: ['réponse exemple'] }
    ],
    timeSequenceText: 'Texte de séquence temporelle d\'exemple.',
    timeEvents: [
      { event: 'Événement d\'exemple', correct: 'P' }
    ],
    headlines: [
      { letter: 'A', text: 'Titre d\'exemple' }
    ],
    articles: [
      { text: 'Texte d\'article d\'exemple.', correct: 'A' }
    ],
    completionText: 'Texte de complétion d\'exemple.',
    completionSentences: [
      { incomplete: 'Phrase _____ d\'exemple.', correct: 'complète' }
    ],
    lifestyleText: 'Texte de style de vie d\'exemple.',
    lifestyleQuestions: [
      { question: 'Question d\'exemple?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    translations: [
      { es: 'Ejemplo de traducción.', fr: 'Exemple de traducción.', de: 'Beispiel für Übersetzung.', marks: 2, questionNumber: '40.1' }
    ]
  };
}

/**
 * Generates French topic questions for a specific topic - ALL 40 QUESTIONS
 * @param {string} theme - The AQA theme ID.
 * @param {string} topic - The AQA topic name.
 * @param {string} assessmentId - The ID of the assessment this question belongs to.
 * @param {'foundation' | 'higher'} level - The difficulty level ('foundation' or 'higher').
 * @returns {Array<AQATopicQuestionDefinition>} An array of question objects.
 */
function generateFrenchTopicQuestions(theme: string, topic: string, assessmentId: string, level: 'foundation' | 'higher'): AQATopicQuestionDefinition[] {
  // Topic-specific content variations
  const topicVariations = getFrenchTopicVariations(theme, topic);

  return [
    // Questions 1-4: Letter Matching - Topic-focused activities (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: `Questions 1-4: ${topic} - Activities and interests`,
      instructions: `Some French teenagers are talking about activities related to ${topic.toLowerCase()}. Which activity does each person mention? Write the correct letter in each box.`,
      marks: 4,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Amélie', text: topicVariations.letterMatching[0] },
          { name: 'Pierre', text: topicVariations.letterMatching[1] },
          { name: 'Camille', text: topicVariations.letterMatching[2] },
          { name: 'Julien', text: topicVariations.letterMatching[3] }
        ],
        options: [
          { letter: 'A', subject: topicVariations.options[0] }, // Matches letterMatching[0]
          { letter: 'B', subject: topicVariations.options[1] }, // Matches letterMatching[1]
          { letter: 'C', subject: topicVariations.options[2] }, // Matches letterMatching[2]
          { letter: 'D', subject: topicVariations.options[3] }, // Matches letterMatching[3]
          { letter: 'E', subject: topicVariations.options[4] },
          { letter: 'F', subject: topicVariations.options[5] }
        ],
        // Shuffled answers
        correctAnswers: { 'Amélie': 'A', 'Pierre': 'D', 'Camille': 'B', 'Julien': 'C' }
      }
    },

    // Questions 5-9: Multiple Choice - Topic-focused reading (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: ${topic}`,
      instructions: `You read this extract about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.mainText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.multipleChoice
      }
    },

    // Questions 10-15: Student Grid - Topic-focused activities (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: `Questions 10-15: ${topic} - Student experiences`,
      instructions: `You see an online forum. Some French students are discussing ${topic.toLowerCase()}. Answer the following questions. Write C for Chloé, L for Lucas, M for Manon.`, // Updated names
      marks: 6,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['C', 'L', 'M'], // Updated names
        studentTexts: topicVariations.studentGrid,
        questions: topicVariations.gridQuestions
      }
    },

    // Questions 16-20: Open Response - Topic-focused article (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: `Questions 16-20: ${topic} in France`,
      instructions: `You read this extract from an article about ${topic.toLowerCase()} in France. Answer the following questions in English.`,
      reading_text: topicVariations.openResponseText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.openQuestions
      }
    },

    // Questions 21-25: Time Sequence - Topic-focused interview (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: `Questions 21-25: Interview about ${topic}`,
      instructions: `A French person talks about their experience with ${topic.toLowerCase()}. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.`,
      reading_text: topicVariations.timeSequenceText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: topicVariations.timeEvents
      }
    },

    // Questions 26-30: Headline Matching - Topic-focused news (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: `Questions 26-30: News headlines about ${topic}`,
      instructions: `Match each news article extract with the correct headline. Write the correct letter in each box.`,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: topicVariations.headlines,
        articles: topicVariations.articles
      }
    },

    // Questions 31-35: Sentence Completion - Topic-focused article (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: `Questions 31-35: ${topic}`,
      instructions: `Complete the sentences based on the text. Write the missing words in English.`,
      reading_text: topicVariations.completionText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: topicVariations.completionSentences
      }
    },

    // Questions 36-40: Multiple Choice - Topic-focused lifestyle (5 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: `Questions 36-40: ${topic} and lifestyle`,
      instructions: `Read this article about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.lifestyleText,
      marks: 5, // Changed from 4 to 5 marks
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.lifestyleQuestions
      }
    },

    // Question 41: Translation - Topic-focused sentences (10 marks)
    {
      question_number: 41, // Changed from 40 to 41
      question_type: 'translation',
      title: `Question 41: Translation about ${topic}`, // Changed from 40 to 41
      instructions: `Translate these sentences about ${topic.toLowerCase()} into English.`,
      marks: 10,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        // Updated to use spread operator
        sentences: topicVariations.translations.map((t: any, i: number) => ({
          ...t, // This ensures all language properties (es, fr, de) are included
          questionNumber: `41.${i + 1}` // Changed from 40 to 41
        }))
      }
    }
  ];
}

// --- Specific Content Variations for German ---
function getGermanTopicVariations(theme: string, topic: string) {
  const variations: Record<string, Record<string, any>> = {
    'Theme 1: People and lifestyle': {
      'Identity and relationships with others': { // Existing content, unchanged
        letterMatching: [
          'Ich verbringe gerne Zeit mit meiner Familie. Wir organisieren immer Familientreffen am Sonntag.',
          'Ich habe viele Freunde aus verschiedenen Ländern. Ich lerne gerne über ihre Kulturen und Traditionen.',
          'Meine kleine Schwester und ich teilen viele Geheimnisse. Sie ist meine beste Vertraute.',
          'Meine Großeltern wohnen in unserer Nähe. Wir besuchen sie jede Woche zum gemeinsamen Mittagessen.'
        ],
        options: ['Family time', 'Cultural exchange', 'Sibling bonds', 'Grandparent visits', 'Friendship', 'Community'],
        mainText: 'Familienbeziehungen sind grundlegend in der deutschen Kultur. In meiner Familie haben wir sehr wichtige Traditionen wie das Sonntagsessen, bei dem sich die ganze Familie versammelt. Meine Großmutter bereitet immer Sauerbraten zu und meine Cousins kommen aus München, um bei uns zu sein. Während dieser Treffen sprechen wir über unser Leben, teilen Neuigkeiten und stärken unsere Familienbande. Deutsche Jugendliche schätzen diese Traditionen sehr, weil sie uns helfen, unsere kulturelle Identität zu bewahren.',
        multipleChoice: [
          { question: 'What is fundamental in German culture?', options: ['A. Work relationships', 'B. Family relationships', 'C. School relationships'], correct: 'B' },
          { question: 'When does the family meet?', options: ['A. Sunday meals', 'B. Saturday evenings', 'C. Friday afternoons'], correct: 'A' },
          { question: 'What does the grandmother prepare?', options: ['A. Schnitzel', 'B. Sauerbraten', 'C. Bratwurst'], correct: 'B' },
          { question: 'Where do the cousins come from?', options: ['A. Berlin', 'B. München', 'C. Hamburg'], correct: 'B' },
          { question: 'Why do German youth value these traditions?', options: ['A. They are fun', 'B. They maintain cultural identity', 'C. They are required'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Lukas', text: 'In meiner Familie sind wir sehr eng verbunden. Ich habe drei Brüder und wir unterstützen uns immer gegenseitig. Wenn ich Probleme habe, spreche ich mit meinem älteren Bruder, weil er mir gute Ratschläge gibt. Am Wochenende machen wir Aktivitäten zusammen wie ins Kino gehen oder Fußball im Park spielen.' },
          { name: 'Sarah', text: 'Meine Eltern haben sich scheiden lassen, als ich klein war, aber wir haben eine gute Beziehung. Ich lebe unter der Woche bei meiner Mutter und am Wochenende bei meinem Vater. Am Anfang war es schwierig, aber jetzt bin ich daran gewöhnt. Das Wichtige ist, dass beide mich sehr lieben.' },
          { name: 'Moritz', text: 'Ich bin Einzelkind, aber ich fühle mich nicht einsam, weil ich viele Cousins habe. Meine Onkel und Tanten leben in derselben Stadt und wir sehen uns häufig. Während der Sommerferien fahren wir alle zusammen an die Ostsee. Es ist wie Geschwister zu haben.' }
        ],
        gridQuestions: [
          { question: 'Who has three brothers?', correct: 'L' },
          { question: 'Who talks to their older brother for advice?', correct: 'L' },
          { question: 'Whose parents are divorced?', correct: 'S' },
          { question: 'Who is an only child?', correct: 'M' },
          { question: 'Who has many cousins?', correct: 'M' },
          { question: 'Who goes to the Baltic Sea during summer holidays?', correct: 'M' }
        ],
        openResponseText: 'Die Familienstruktur in Deutschland hat sich in den letzten Jahrzehnten stark verändert. Traditionell waren deutsche Familien ziemlich groß, mit mehreren Kindern und manchmal mehreren Generationen, die im selben Haus lebten. Heute sind Familien kleiner, mit höchstens ein oder zwei Kindern. Viele junge Menschen leben bis zum Alter von achtundzwanzig Jahren bei ihren Eltern aufgrund der wirtschaftlichen Situation. Dennoch bleiben die Familienbande sehr stark und Familientreffen sind weiterhin wichtig in der deutschen Kultur.',
        openQuestions: [
          { question: 'How has the German family structure changed?', expectedWords: 3, acceptableAnswers: ['families are smaller', 'fewer children now', 'smaller families today'] },
          { question: 'How many children do families have today?', expectedWords: 3, acceptableAnswers: ['one or two', 'maximum two children', 'one two maximum'] },
          { question: 'Until what age do young people live with parents?', expectedWords: 3, acceptableAnswers: ['twenty-eight years', 'age twenty-eight', 'until 28'] },
          { question: 'Why do young people stay with parents longer?', expectedWords: 3, acceptableAnswers: ['economic situation', 'financial reasons', 'economic problems'] },
          { question: 'What remains important in German culture?', expectedWords: 3, acceptableAnswers: ['family meetings', 'family reunions', 'family gatherings'] }
        ],
        timeSequenceText: 'Als ich Kind war, lebte ich bei meinen Großeltern in einem kleinen Dorf in Bayern. Jetzt lebe ich in Berlin bei meinen Eltern und studiere an der Universität. Meine Beziehung zu meiner Familie hat sich seitdem sehr verändert. Früher war ich völlig abhängig von meinen Großeltern für alles. Derzeit bin ich unabhängiger, aber ich schätze immer noch die Zeit, die ich mit meiner Familie verbringe. Nächstes Jahr plane ich, in meine eigene Wohnung zu ziehen, aber ich möchte häufigen Kontakt mit allen halten. In der Zukunft, wenn ich meine eigene Familie habe, hoffe ich, die gleichen Werte zu vermitteln, die ich von meinen Großeltern gelernt habe.',
        timeEvents: [
          { event: 'Living in Berlin and studying', correct: 'N' },
          { event: 'Living with grandparents in Bavaria', correct: 'P' },
          { event: 'Being completely dependent on grandparents', correct: 'P' },
          { event: 'Planning to move to own apartment', correct: 'F' },
          { event: 'Having own family and transmitting values', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'German families celebrate traditional Sunday meals' },
          { letter: 'B', text: 'Young adults living with parents longer due to economy' },
          { letter: 'C', text: 'Grandparents play important role in childcare' },
          { letter: 'D', text: 'Divorce rates increase but family bonds remain strong' },
          { letter: 'E', text: 'German youth value cultural identity through family' },
          { letter: 'F', text: 'Multi-generational homes becoming less common' }
        ],
        articles: [
          { text: 'Deutsche Jugendliche bleiben länger bei ihren Eltern aufgrund der Wirtschaftskrise und des Mangels an stabilen Arbeitsplätzen.', correct: 'B' },
          { text: 'Deutsche Familien halten an der Tradition der Sonntagsessen fest, um Familienbande zu stärken und kulturelle Werte zu vermitteln.', correct: 'A' },
          { text: 'Obwohl die Scheidungsraten in Deutschland gestiegen sind, bleiben die Familienbande stark und Familien finden neue Wege, zusammenzubleiben.', correct: 'D' },
          { text: 'Deutsche Großeltern spielen eine entscheidende Rolle bei der Kinderbetreuung, besonders wenn beide Eltern außer Haus arbeiten.', correct: 'C' },
          { text: 'Deutsche Jugendliche betrachten die Aufrechterhaltung von Familientraditionen als wesentlich für die Bewahrung ihrer kulturellen Identität in einem globalisierten Welt.', correct: 'E' }
        ],
        completionText: 'Die persönliche Identität bildet sich durch die Beziehungen, die wir zu anderen aufbauen. In Deutschland spielt die erweiterte Familie eine grundlegende Rolle in der Entwicklung der Persönlichkeit junger Menschen. Großeltern übertragen Geschichten und Traditionen, Eltern bieten emotionale und wirtschaftliche Unterstützung, und Geschwister bieten Gesellschaft und Verständnis. Diese vielfältigen Beziehungen helfen dabei, eine solide Identität und ein Gefühl der Zugehörigkeit zur Gemeinschaft zu schaffen.',
        completionSentences: [
          { incomplete: 'Personal identity is formed through _____ with others.', correct: 'relationships' },
          { incomplete: 'Extended family plays a _____ role in development.', correct: 'fundamental' },
          { incomplete: 'Grandparents transmit _____ and traditions.', correct: 'stories' },
          { incomplete: 'Parents provide emotional and _____ support.', correct: 'economic' },
          { incomplete: 'These relationships help create a sense of _____.', correct: 'belonging' }
        ],
        lifestyleText: 'Das Gleichgewicht zwischen Familien- und Privatleben ist für Deutsche sehr wichtig. Viele Menschen widmen jede Woche spezielle Zeit der Familie, behalten aber auch ihre eigenen Hobbys und Interessen bei. Es ist üblich, dass junge Leute nachmittags mit Freunden ausgehen, aber zum Abendessen mit der Familie nach Hause kommen. Diese Kombination aus Unabhängigkeit und familiärer Verbindung charakterisiert den modernen deutschen Lebensstil.',
        lifestyleQuestions: [
          { question: 'What is important for Germans?', options: ['A. Work-life balance', 'B. Family-personal life balance', 'C. Study-leisure balance'], correct: 'B' },
          { question: 'How much time do people dedicate to family?', options: ['A. Specific time each week', 'B. All their free time', 'C. Only weekends'], correct: 'A' },
          { question: 'When do young people go out with friends?', options: ['A. In the mornings', 'B. In the afternoons', 'C. At night only'], correct: 'B' },
          { question: 'What characterizes modern German lifestyle?', options: ['A. Complete independence', 'B. Only family focus', 'C. Independence and family connection'], correct: 'C' }
        ],
        translations: [
          { es: 'Mi familia es muy unida y nos apoyamos siempre.', fr: 'Ma famille est très unie et nous nous soutenons toujours.', de: 'Meine Familie ist sehr eng verbunden und wir unterstützen uns immer.', marks: 2, questionNumber: '40.1' },
          { es: 'Tengo una relación muy especial con mis abuelos maternos.', fr: 'J\'ai une relation très spéciale avec mes grands-parents maternels.', de: 'Ich habe eine sehr besondere Beziehung zu meinen Großeltern mütterlicherseits.', marks: 2, questionNumber: '40.2' },
          { es: 'Los domingos toda la familia se reúne para almorzar juntos.', fr: 'Le dimanche toute la familia se réunit pour déjeuner ensemble.', de: 'Sonntags versammelt sich die ganze Familie zum gemeinsamen Mittagessen.', marks: 2, questionNumber: '40.3' },
          { es: 'Mis padres me enseñaron la importancia de los valores familiares.', fr: 'Mes parents m\'ont enseigné l\'importance des valeurs familiales.', de: 'Meine Eltern haben mir die Wichtigkeit von Familienwerten beigebracht.', marks: 2, questionNumber: '40.4' },
          { es: 'Aunque vivo lejos, mantengo contacto diario con mi hermana.', fr: 'Bien que je vive loin, je maintiens un contact quotidien avec ma sœur.', de: 'Obwohl ich weit weg lebe, halte ich täglichen Kontakt mit meiner Schwester.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Healthy living and lifestyle': { // Existing content, unchanged
        letterMatching: [
          'Um fit zu bleiben, mache ich dreimal pro Woche Sport. Ich liebe es, im Park zu joggen.',
          'Ich versuche, fünf Portionen Obst und Gemüse pro Tag zu essen. Mein Lieblingsgemüse ist Karotte.',
          'Es ist wichtig, acht Stunden pro Nacht zu schlafen, um Energie und gute Laune zu haben.',
          'Ich trinke viel Wasser, um hydriert zu bleiben, besonders nach dem Sport.'
        ],
        options: ['Sports', 'Healthy Eating', 'Sleep', 'Hydration', 'Mindfulness', 'Relaxation'],
        mainText: 'Ein gesunder Lebensstil ist für die Jugendlichen von heute unerlässlich. Viele deutsche Teenager treiben Sport wie Fußball, Handball oder Schwimmen, um aktiv zu bleiben. Die deutsche Küche, obwohl oft mit deftigen Gerichten assoziiert, bietet auch viele gesunde Optionen mit viel Gemüse und frischen Produkten. Es ist entscheidend, zuckerhaltige Getränke und Fast Food zu vermeiden. Darüber hinaus ist mentales Wohlbefinden genauso wichtig wie körperliche Gesundheit, weshalb Aktivitäten wie Lesen oder Zeit mit Freunden verbringen entscheidend sind, um Stress abzubauen.',
        multipleChoice: [
          { question: 'What is essential for young people today?', options: ['A. Playing video games', 'B. Having a healthy life', 'C. Eating fast food'], correct: 'B' },
          { question: 'Which sports are popular among German teenagers?', options: ['A. Cricket and rugby', 'B. Football, handball, and swimming', 'C. Golf and tennis'], correct: 'B' },
          { question: 'What is important to avoid for a healthy diet?', options: ['A. Fruits and vegetables', 'B. Sugary drinks and fast food', 'C. Fish and olive oil'], correct: 'B' },
          { question: 'Why are activities like reading or spending time with friends important?', options: ['A. To get good grades', 'B. To reduce stress', 'C. To learn new languages'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Finn', text: 'Um ein ausgewogenes Leben zu führen, achte ich darauf, zu lernen und auch außerschulische Aktivitäten zu machen. Ich spiele Volleyball zweimal pro Woche und das hilft mir, mich zu entspannen. Ich versuche, nicht zu viel Zeit in sozialen Medien zu verbringen.' },
          { name: 'Lena', text: 'Meine Herausforderung ist es, gesünder zu essen. Ich liebe Fast Food, aber ich weiß, dass es nicht gut ist. Meine Eltern versuchen, dass wir zu Hause mehr Gemüse essen, und ich lerne, gesunde Gerichte zu kochen.' },
          { name: 'Julian', text: 'Der Prüfungsstress ist real. Um damit umzugehen, mache ich Achtsamkeitsübungen und höre entspannende Musik. Es ist auch wichtig, mit meinen Freunden und meiner Familie zu sprechen, wenn ich mich überfordert fühle. Mentale Gesundheit ist für mich eine Priorität.' }
        ],
        gridQuestions: [
          { question: 'Who plays volleyball to relax?', correct: 'F' },
          { question: 'Who is trying to eat more healthily?', correct: 'L' },
          { question: 'Who likes fast food?', correct: 'L' },
          { question: 'Who manages exam stress with mindfulness exercises?', correct: 'J' },
          { question: 'Who prioritises mental health?', correct: 'J' },
          { question: 'Who tries to limit time on social media?', correct: 'F' }
        ],
        openResponseText: 'Körperliche Aktivität ist entscheidend für die Gesundheit. Die Weltgesundheitsorganisation empfiehlt, dass Jugendliche täglich mindestens 60 Minuten moderate bis intensive körperliche Aktivität ausüben. Dies kann Sport, schnelles Gehen, Tanzen oder Radfahren umfassen. Mangelnde körperliche Aktivität kann zukünftig zu Gesundheitsproblemen wie Fettleibigkeit und Herz-Kreislauf-Erkrankungen führen. Es ist wichtig, eine Aktivität zu finden, die Ihnen Spaß macht, damit es einfacher ist, sie langfristig beizubehalten.',
        openQuestions: [
          { question: 'How many minutes of physical activity are recommended daily for teenagers?', expectedWords: 2, acceptableAnswers: ['60 minutes', 'sixty minutes', 'at least 60 minutes'] },
          { question: 'Name two activities that count as physical activity.', expectedWords: 4, acceptableAnswers: ['sports and walking', 'dancing and cycling', 'sports dancing', 'walking cycling'] },
          { question: 'What health problem can lack of physical activity lead to?', expectedWords: 1, acceptableAnswers: ['obesity', 'heart disease'] },
          { question: 'Why is it important to find an activity you like?', expectedWords: 5, acceptableAnswers: ['easier to maintain long-term', 'to maintain it longer', 'easier to keep it'] },
          { question: 'What kind of physical activity is recommended?', expectedWords: 4, acceptableAnswers: ['moderate to intense', 'moderate intense'] }
        ],
        timeSequenceText: 'Als ich Kind war, verbrachte ich Stunden mit Videospielen und aß viele Süßigkeiten. Ich war ziemlich sesshaft. Jetzt, in der Jugend, habe ich meine Gewohnheiten geändert. Ich gehe dreimal pro Woche ins Schwimmbad und ernähre mich ausgewogener. Meine Eltern ermutigten mich, aktiver zu sein, und halfen mir, die Bedeutung von Gesundheit zu verstehen. Nächstes Jahr möchte ich an einem 10-km-Lauf teilnehmen. In Zukunft hoffe ich, andere dazu inspirieren zu können, einen gesunden Lebensstil anzunehmen.',
        timeEvents: [
          { event: 'Spending hours playing video games', correct: 'P' },
          { event: 'Going to the swimming pool three times to week', correct: 'N' },
          { event: 'Planning to participate in a 10km run', correct: 'F' },
          { event: 'Being quite sedentary', correct: 'P' },
          { event: 'Hoping to inspire others to adopt a healthy lifestyle', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'The importance of balanced meals for teenagers' },
          { letter: 'B', text: 'Mental well-being: A priority for young people' },
          { letter: 'C', text: 'How technology influences adolescent sleep patterns' },
          { letter: 'D', text: 'Teenagers opting for outdoor activities over screens' },
          { letter: 'E', text: 'Government campaigns promote healthy habits in schools' },
          { letter: 'F', text: 'The rise of plant-based diets among German youth' }
        ],
        articles: [
          { text: 'Eine neue Studie zeigt, dass mehr deutsche Jugendliche ihre Freizeit lieber mit Wandern und Radfahren verbringen, anstatt elektronische Geräte zu nutzen. Dies trägt zu einem aktiveren Lebensstil bei.', correct: 'D' },
          { text: 'Neue staatliche Initiativen zielen darauf ab, Schüler durch Workshops und Sportprogramme in Schulen über die Bedeutung von Ernährung und Bewegung aufzuklären.', correct: 'E' },
          { text: 'Viele deutsche Jugendliche nehmen vegetarische und vegane Ernährungsweisen an, was als positiver Schritt zu einer bewussteren und nachhaltigeren Ernährung angesehen wird.', correct: 'F' },
          { text: 'Mentalexperten betonen die Notwendigkeit, Stress und Angst bei Jugendlichen anzugehen, indem sie Aktivitäten fördern, die Entspannung und emotionales Gleichgewicht unterstützen.', correct: 'B' },
          { text: 'Die Schlafqualität bei Jugendlichen wird durch übermäßigen Gebrauch von Mobiltelefonen vor dem Schlafengehen beeinträchtigt, was sich negativ auf ihre schulischen Leistungen und ihre Stimmung auswirkt.', correct: 'C' }
        ],
        completionText: 'Eine ausgewogene Ernährung ist für das Wachstum und die Entwicklung von Jugendlichen unerlässlich. Eine Vielfalt an Obst, Gemüse, Proteinen und Vollkornprodukten liefert die nötige Energie für das Lernen und den Sport. Das Vermeiden von ultra-verarbeiteten Lebensmitteln und zuckerhaltigen Getränken ist entscheidend, um langfristige Gesundheitsprobleme wie Typ-2-Diabetes zu verhindern. Es ist wichtig, dass junge Menschen lernen, gesunde Entscheidungen für ihr zukünftiges Wohlbefinden zu treffen.',
        completionSentences: [
          { incomplete: 'A balanced diet is _____ for growth and development.', correct: 'fundamental' },
          { incomplete: 'It provides the necessary _____ for studying and sports.', correct: 'energy' },
          { incomplete: 'Avoiding ultra-processed foods helps _____ long-term health issues.', correct: 'prevent' },
          { incomplete: 'Sugary drinks can lead to problems like Type 2 _____.', correct: 'diabetes' },
          { incomplete: 'Young people should learn to make _____ choices.', correct: 'healthy' }
        ],
        lifestyleText: 'Ein gesunder Lebensstil umfasst nicht nur Ernährung und Bewegung, sondern auch das mentale Wohlbefinden. In Deutschland sind sich junge Menschen zunehmend der Bedeutung bewusst, auf ihre mentale Gesundheit zu achten. Aktivitäten wie Meditation, Zeit in der Natur verbringen oder ein Hobby ausüben helfen, Stress abzubauen. Es ist ein ganzheitlicher Ansatz, der gute Ernährung, körperliche Aktivität und emotionale Gesundheit für ein erfülltes Leben kombiniert.',
        lifestyleQuestions: [
          { question: 'What does a healthy lifestyle include besides diet and exercise?', options: ['A. Financial stability', 'B. Mental well-being', 'C. Career success'], correct: 'B' },
          { question: 'What are German youth increasingly aware of?', options: ['A. The latest fashion trends', 'B. The importance of mental health', 'C. New technologies'], correct: 'B' },
          { question: 'Name one activity that helps reduce stress.', options: ['A. Playing violent video games', 'B. Meditation', 'C. Eating unhealthy snacks'], correct: 'B' },
          { question: 'What kind of approach is it for a full life?', options: ['A. A physical approach', 'B. A financial approach', 'C. A holistic approach'], correct: 'C' },
          { question: 'How can teenagers find balance between study and leisure?', options: ['A. By only focusing on academics', 'B. By combining both effectively', 'C. By ignoring extracurriculars'], correct: 'B' } // Added question
        ],
        translations: [
          { es: 'Para mantenerme sano, hago deporte regularmente.', fr: 'Pour rester en bonne santé, je fais du sport régulièrement.', de: 'Um gesund zu bleiben, treibe ich regelmäßig Sport.', marks: 2, questionNumber: '40.1' },
          { es: 'Comer frutas y verduras es muy importante.', fr: 'Manger des fruits et légumes est très important.', de: 'Obst und Gemüse zu essen ist sehr wichtig.', marks: 2, questionNumber: '40.2' },
          { es: 'Duermo ocho Stunden pro Nacht, um Energie zu haben.', fr: 'Je dors huit heures chaque nuit pour avoir de l\'énergie.', de: 'Ich schlafe acht Stunden pro Nacht, um Energie zu haben.', marks: 2, questionNumber: '40.3' },
          { es: 'Evito la comida rápida y zuckerhaltige Getränke.', fr: 'J\'évite la restauration rapide et les boissons sucrées.', de: 'Ich vermeide Fast Food und zuckerhaltige Getränke.', marks: 2, questionNumber: '40.4' },
          { es: 'La salud mental es tan importante como la física.', fr: 'La salud mental ist genauso wichtig wie die körperliche Gesundheit.', de: 'Mentale Gesundheit ist genauso wichtig wie körperliche Gesundheit.', marks: 2, questionNumber: '40.5' }
        ]
      },
      'Education and work': { // NEW CONTENT FOR EDUCATION AND WORK
        letterMatching: [
          'Ich bin im letzten Schuljahr und überlege, an die Universität zu gehen, um Medizin zu studieren.',
          'Mein älterer Bruder hat sich gegen die Uni entschieden; er macht eine Ausbildung zum Kfz-Mechatroniker.',
          'Nach der Schule habe ich einen Nebenjob in einem Café, um mir etwas dazuzuverdienen.',
          'Die Abiturprüfungen dieses Jahr sind entscheidend für meinen weiteren Bildungsweg.'
        ],
        options: ['University', 'Apprenticeship', 'Part-time job', 'Exams', 'Career choices', 'Studying abroad'],
        mainText: 'In Deutschland endet die Schulpflicht nach neun oder zehn Jahren. Danach können Schüler entweder das Gymnasium besuchen, um das Abitur zu machen und an die Universität zu gehen, oder eine berufliche Ausbildung beginnen. Viele Jugendliche kombinieren auch Schule oder Studium mit Nebenjobs, um praktische Erfahrungen zu sammeln. Die Wahl des richtigen Berufes ist eine wichtige Entscheidung, die oft von persönlichen Interessen und dem Arbeitsmarkt beeinflusst wird. Digitale Kompetenzen und Fremdsprachenkenntnisse sind auf dem deutschen Arbeitsmarkt sehr gefragt.',
        multipleChoice: [
          { question: 'When does compulsory schooling end in Germany?', options: ['A. After 7 years', 'B. After 9 or 10 years', 'C. After 12 years'], correct: 'B' },
          { question: 'What does Gymnasium prepare students for?', options: ['A. A specific trade', 'B. University', 'C. A part-time job'], correct: 'B' },
          { question: 'Why do many young people combine studies with part-time jobs?', options: ['A. To avoid studying', 'B. To gain practical experience', 'C. To meet new friends'], correct: 'B' },
          { question: 'What influences career choice in Germany?', options: ['A. Only job opportunities', 'B. Only personal interests', 'C. Personal interests and the job market'], correct: 'C' },
          { question: 'What skills are highly sought after in the German job market?', options: ['A. Cooking skills', 'B. Digital skills and foreign languages', 'C. Driving skills'], correct: 'B' }
        ],
        studentGrid: [
          { name: 'Mia', text: 'Ich habe letztes Jahr mein Abitur gemacht und studiere jetzt BWL in Köln. Es ist anspruchsvoll, aber ich finde es super. Nebenbei arbeite ich in einem Büro, um mir das Studium zu finanzieren.' },
          { name: 'Tim', text: 'Ich war nicht so der Typ für die Schule. Nach der Realschule habe ich eine Ausbildung zum Koch angefangen. Ich bin oft im Restaurant und lerne viel von erfahrenen Köchen. Das ist viel besser als im Klassenzimmer zu sitzen!' },
          { name: 'Lena', text: 'Ich bin noch in der Oberstufe. Ich überlege, ob ich nach dem Abitur ein FSJ (Freiwilliges Soziales Jahr) mache oder direkt eine duale Ausbildung beginne. Es gibt so viele Möglichkeiten.' }
        ],
        gridQuestions: [
          { question: 'Who is working in an office to finance their studies?', correct: 'M' },
          { question: 'Who prefers practical learning over classroom learning?', correct: 'T' },
          { question: 'Who is considering a voluntary social year?', correct: 'L' },
          { question: 'Who is doing an apprenticeship to become a chef?', correct: 'T' },
          { question: 'Who is studying business administration?', correct: 'M' },
          { question: 'Who finds many options after school?', correct: 'L' }
        ],
        openResponseText: 'Die Jugendarbeitslosigkeit ist auch in Deutschland ein Thema, wenn auch nicht so ausgeprägt wie in anderen Ländern. Der duale Ausbildungssystem ist weltweit bekannt und sehr erfolgreich, da es Theorie und Praxis optimal verbindet. Dies hilft Jugendlichen, direkt nach der Ausbildung einen Job zu finden. Die Digitalisierung verändert viele Berufe, und lebenslanges Lernen wird immer wichtiger. Programme zur Berufsorientierung unterstützen Schüler bei der Entscheidungsfindung für ihre Zukunft.',
        openQuestions: [
          { question: 'What system is well-known and successful in Germany for combining theory and practice?', expectedWords: 5, acceptableAnswers: ['dual apprenticeship system', 'dual training system', 'the dual apprenticeship system'] },
          { question: 'What helps young people find a job directly after training?', expectedWords: 6, acceptableAnswers: ['dual apprenticeship system helps', 'combining theory and practice helps', 'the dual training system helps'] },
          { question: 'What is changing many professions?', expectedWords: 1, acceptableAnswers: ['digitalization'] },
          { question: 'What is becoming increasingly important?', expectedWords: 2, acceptableAnswers: ['lifelong learning'] },
          { question: 'What helps students with their future career decisions?', expectedWords: 4, acceptableAnswers: ['career guidance programs', 'vocational orientation programs', 'programs for career guidance'] }
        ],
        timeSequenceText: 'Als ich Kind war, wollte ich Tierarzt werden, obwohl ich Angst vor großen Hunden hatte. In der Grundschule mochte ich Sport und Erdkunde am liebsten. Jetzt bin ich in der 10. Klasse und bereite mich auf die Realschulprüfung vor. Danach möchte ich die Fachoberschule besuchen, um mein Fachabitur zu machen. In zwei Jahren plane ich, ein duales Studium im Bereich Informatik zu beginnen. In der Zukunft sehe ich mich als Softwareentwickler in einem internationalen Unternehmen.',
        timeEvents: [
          { event: 'Wanting to become a vet as a child', correct: 'P' },
          { event: 'Preparing for Realschule exams', correct: 'N' },
          { event: 'Planning to attend Fachoberschule', correct: 'F' },
          { event: 'Liking sports and geography best in primary school', correct: 'P' },
          { event: 'Seeing myself as a software developer in an international company', correct: 'F' }
        ],
        headlines: [
          { letter: 'A', text: 'Dual education system remains successful' },
          { letter: 'B', text: 'Digital skills gap in German workforce' },
          { letter: 'C', text: 'Career guidance essential for young people' },
          { letter: 'D', text: 'Rise in international internships for students' },
          { letter: 'E', text: 'Challenges of youth employment in rural areas' },
          { letter: 'F', text: 'Lifelong learning key for future job market' }
        ],
        articles: [
          { text: 'Das duale Ausbildungssystem in Deutschland wird weiterhin als Erfolgsmodell gefeiert, das jungen Menschen den direkten Berufseinstieg ermöglicht.', correct: 'A' },
          { text: 'Viele Unternehmen in ländlichen Regionen kämpfen damit, qualifizierte junge Fachkräfte zu finden und zu halten.', correct: 'E' },
          { text: 'Die Nachfrage nach digitalen Kompetenzen übersteigt oft das Angebot an Fachkräften, was zu einer digitalen Qualifikationslücke führt.', correct: 'B' },
          { text: 'Immer mehr deutsche Studierende entscheiden sich für Praktika im Ausland, um internationale Erfahrungen zu sammeln.', correct: 'D' },
          { text: 'Experten betonen, dass eine frühzeitige und umfassende Berufsorientierung entscheidend ist, um Jugendlichen den Übergang ins Berufsleben zu erleichtern.', correct: 'C' }
        ],
        completionText: 'Bildung und Arbeit sind eng miteinander verbunden. Eine gute Ausbildung ist die Grundlage für eine erfolgreiche Karriere. Aber der Arbeitsmarkt entwickelt sich ständig weiter, und neue Berufe entstehen. Deshalb ist es wichtig, flexibel zu bleiben und sich ständig weiterzubilden. Arbeitgeber suchen nicht nur nach Qualifikationen, sondern auch nach Soft Skills wie Kreativität und Kommunikationsfähigkeit. Die Fähigkeit zur Zusammenarbeit und zum lebenslangen Lernen sind daher für die berufliche Zukunft unerlässlich.',
        completionSentences: [
          { incomplete: 'Education and work are closely _____.', correct: 'connected' },
          { incomplete: 'Good education is the _____ for a successful career. (foundation)', correct: 'foundation' },
          { incomplete: 'The job market is constantly _____.', correct: 'evolving' },
          { incomplete: 'Employers look for _____ skills like creativity and communication.', correct: 'soft' },
          { incomplete: 'Lifelong learning is _____ for the professional future.', correct: 'essential' }
        ],
        lifestyleText: 'Ein gesunder Lebensstil umfasst nicht nur Ernährung und Bewegung, sondern auch das mentale Wohlbefinden. In Deutschland sind sich junge Menschen zunehmend der Bedeutung bewusst, auf ihre mentale Gesundheit zu achten. Aktivitäten wie Meditation, Zeit in der Natur verbringen oder ein Hobby ausüben helfen, Stress abzubauen. Es ist ein ganzheitlicher Ansatz, der gute Ernährung, körperliche Aktivität und emotionale Gesundheit für ein erfülltes Leben kombiniert.',
        lifestyleQuestions: [
          { question: 'What is the foundation for a successful career?', options: ['A. Good connections', 'B. Good education', 'C. Luck'], correct: 'B' },
          { question: 'What is important due to the constantly evolving job market?', options: ['A. To stay in one job', 'B. To remain flexible and constantly educate oneself', 'C. To avoid new technologies'], correct: 'B' },
          { question: 'What kind of skills are employers looking for besides qualifications?', options: ['A. Only hard skills', 'B. Soft skills', 'C. Physical skills'], correct: 'B' },
          { question: 'Name one soft skill mentioned.', options: ['A. Strength', 'B. Creativity', 'C. Speed'], correct: 'B' },
          { question: 'What are essential for the professional future?', options: ['A. High income', 'B. Ability to collaborate and lifelong learning', 'C. Retirement'], correct: 'B' }
        ],
        translations: [
          { es: 'Ich mache dieses Jahr mein Abitur.', fr: 'Je passe mon baccalauréat cette année.', de: 'Ich mache dieses Jahr mein Abitur.', marks: 2, questionNumber: '41.1' },
          { es: 'Ich möchte eine Ausbildung machen.', fr: 'Je voudrais faire un apprentissage.', de: 'Ich möchte eine Ausbildung machen.', marks: 2, questionNumber: '41.2' },
          { es: 'Mein Nebenjob ist im Supermarkt.', fr: 'Mon petit boulot est au supermarché.', de: 'Mein Nebenjob ist im Supermarkt.', marks: 2, questionNumber: '41.3' },
          { es: 'Digitale Kompetenzen sind sehr gefragt.', fr: 'Les compétences numériques sont très demandées.', de: 'Digitale Kompetenzen sind sehr gefragt.', marks: 2, questionNumber: '41.4' },
          { es: 'Lebenslanges Lernen ist wichtig.', fr: 'L\'apprentissage tout au long de la vie est important.', de: 'Lebenslanges Lernen ist wichtig.', marks: 2, questionNumber: '41.5' }
        ]
      }
    }
  };

  const themeData = variations[theme];
  if (!themeData) {
    console.warn(`No specific variations found for theme: ${theme} - using default German.`);
    return getDefaultGermanVariations();
  }
  const topicData = themeData[topic];
  if (!topicData) {
    console.warn(`No specific variations found for topic: ${topic} under theme ${theme} - using default German.`);
    return getDefaultGermanVariations();
  }
  return topicData;
}

// --- Default German Content for Fallback ---
function getDefaultGermanVariations() {
  return {
    letterMatching: [
      'Ich mache gerne verschiedene Aktivitäten in meiner Freizeit.',
      'Ich treibe Sport mit meinen Freunden am Wochenende.',
      'Ich lese interessante Bücher in der Stadtbibliothek.',
      'Ich höre Musik, während ich meine Hausaufgaben mache.'
    ],
    options: ['Sports', 'Reading', 'Music', 'Art', 'Gaming', 'Cooking'],
    mainText: 'Dies ist ein Beispieltext für thematische Bewertungen.',
    multipleChoice: [
      { question: 'Beispielfrage?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    studentGrid: [
      { name: 'Student1', text: 'Beispieltext 1' },
      { name: 'Student2', text: 'Beispieltext 2' },
      { name: 'Student3', text: 'Beispieltext 3' }
    ],
    gridQuestions: [
      { question: 'Beispielfrage?', correct: 'A' }
    ],
    openResponseText: 'Beispiel für offene Antwort.',
    openQuestions: [
      { question: 'Beispielfrage?', expectedWords: 2, acceptableAnswers: ['Beispielantwort'] }
    ],
    timeSequenceText: 'Beispiel für Zeitsequenz.',
    timeEvents: [
      { event: 'Beispielereignis', correct: 'P' }
    ],
    headlines: [
      { letter: 'A', text: 'Beispielschlagzeile' }
    ],
    articles: [
      { text: 'Beispielartikeltext.', correct: 'A' }
    ],
    completionText: 'Beispiel für Vervollständigung.',
    completionSentences: [
      { incomplete: 'Beispiel _____ Satz.', correct: 'vollständiger' }
    ],
    lifestyleText: 'Beispiel für Lebensstil.',
    lifestyleQuestions: [
      { question: 'Beispielfrage?', options: ['A. Option 1', 'B. Option 2', 'C. Option 3'], correct: 'A' }
    ],
    translations: [
      { es: 'Ejemplo de traducción.', fr: 'Exemple de traducción.', de: 'Beispiel für Übersetzung.', marks: 2, questionNumber: '40.1' }
    ]
  };
}


/**
 * Generates German topic questions for a specific topic - ALL 40 QUESTIONS
 * @param {string} theme - The AQA theme ID.
 * @param {string} topic - The AQA topic name.
 * @param {string} assessmentId - The ID of the assessment this question belongs to.
 * @param {'foundation' | 'higher'} level - The difficulty level ('foundation' or 'higher').
 * @returns {Array<AQATopicQuestionDefinition>} An array of question objects.
 */
function generateGermanTopicQuestions(theme: string, topic: string, assessmentId: string, level: 'foundation' | 'higher'): AQATopicQuestionDefinition[] {
  // Topic-specific content variations
  const topicVariations = getGermanTopicVariations(theme, topic);

  return [
    // Questions 1-4: Letter Matching - Topic-focused activities (4 marks)
    {
      question_number: 1,
      question_type: 'letter-matching',
      title: `Questions 1-4: ${topic} - Activities and interests`,
      instructions: `Some German teenagers are talking about activities related to ${topic.toLowerCase()}. Which activity does each person mention? Write the correct letter in each box.`,
      marks: 4,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: [
          { name: 'Anna', text: topicVariations.letterMatching[0] },
          { name: 'Max', text: topicVariations.letterMatching[1] },
          { name: 'Lisa', text: topicVariations.letterMatching[2] },
          { name: 'Tom', text: topicVariations.letterMatching[3] }
        ],
        options: [
          { letter: 'A', subject: topicVariations.options[0] }, // Matches letterMatching[0]
          { letter: 'B', subject: topicVariations.options[1] }, // Matches letterMatching[1]
          { letter: 'C', subject: topicVariations.options[2] }, // Matches letterMatching[2]
          { letter: 'D', subject: topicVariations.options[3] }, // Matches letterMatching[3]
          { letter: 'E', subject: topicVariations.options[4] },
          { letter: 'F', subject: topicVariations.options[5] }
        ],
        // Shuffled answers
        correctAnswers: { 'Anna': 'A', 'Max': 'D', 'Lisa': 'B', 'Tom': 'C' }
      }
    },

    // Questions 5-9: Multiple Choice - Topic-focused reading (5 marks)
    {
      question_number: 5,
      question_type: 'multiple-choice',
      title: `Questions 5-9: ${topic}`,
      instructions: `You read this extract about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.mainText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.multipleChoice
      }
    },

    // Questions 10-15: Student Grid - Topic-focused activities (6 marks)
    {
      question_number: 10,
      question_type: 'student-grid',
      title: `Questions 10-15: ${topic} - Student experiences`,
      instructions: `You see an online forum. Some German students are discussing ${topic.toLowerCase()}. Answer the following questions. Write F for Finn, L for Lena, J for Julian.`, // Updated names
      marks: 6,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        students: ['F', 'L', 'J'], // Updated names
        studentTexts: topicVariations.studentGrid,
        questions: topicVariations.gridQuestions
      }
    },

    // Questions 16-20: Open Response - Topic-focused article (5 marks)
    {
      question_number: 16,
      question_type: 'open-response',
      title: `Questions 16-20: ${topic} in Germany`,
      instructions: `You read this extract from an article about ${topic.toLowerCase()} in Germany. Answer the following questions in English.`,
      reading_text: topicVariations.openResponseText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.openQuestions
      }
    },

    // Questions 21-25: Time Sequence - Topic-focused interview (5 marks)
    {
      question_number: 21,
      question_type: 'time-sequence',
      title: `Questions 21-25: Interview about ${topic}`,
      instructions: `A German person talks about their experience with ${topic.toLowerCase()}. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.`,
      reading_text: topicVariations.timeSequenceText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        events: topicVariations.timeEvents
      }
    },

    // Questions 26-30: Headline Matching - Topic-focused news (5 marks)
    {
      question_number: 26,
      question_type: 'headline-matching',
      title: `Questions 26-30: News headlines about ${topic}`,
      instructions: `Match each news article extract with the correct headline. Write the correct letter in each box.`,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        headlines: topicVariations.headlines,
        articles: topicVariations.articles
      }
    },

    // Questions 31-35: Sentence Completion - Topic-focused article (5 marks)
    {
      question_number: 31,
      question_type: 'sentence-completion',
      title: `Questions 31-35: ${topic}`,
      instructions: `Complete the sentences based on the text. Write the missing words in English.`,
      reading_text: topicVariations.completionText,
      marks: 5,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        sentences: topicVariations.completionSentences
      }
    },

    // Questions 36-40: Multiple Choice - Topic-focused lifestyle (5 marks)
    {
      question_number: 36,
      question_type: 'multiple-choice',
      title: `Questions 36-40: ${topic} and lifestyle`,
      instructions: `Read this article about ${topic.toLowerCase()}. Answer the questions by selecting the correct option.`,
      reading_text: topicVariations.lifestyleText,
      marks: 5, // Changed from 4 to 5 marks
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        questions: topicVariations.lifestyleQuestions
      }
    },

    // Question 41: Translation - Topic-focused sentences (10 marks)
    {
      question_number: 41, // Changed from 40 to 41
      question_type: 'translation',
      title: `Question 41: Translation about ${topic}`, // Changed from 40 to 41
      instructions: `Translate these sentences about ${topic.toLowerCase()} into English.`,
      marks: 10,
      theme: theme,
      topic: topic,
      assessment_id: assessmentId,
      difficulty_rating: level === 'foundation' ? 3 : 4,
      question_data: {
        // Updated to use spread operator
        sentences: topicVariations.translations.map((t: any, i: number) => ({
          ...t, // This ensures all language properties (es, fr, de) are included
          questionNumber: `41.${i + 1}` // Changed from 40 to 41
        }))
      }
    }
  ];
}


// --- Main Function to Generate Topic Assessments ---
async function generateTopicAssessments() {
  try {
    console.log('🚀 Starting topic assessment generation...');

    // Filter to only Theme 1: People and lifestyle and Topic: Education and work
    const filteredThemes = AQA_THEMES.filter(theme => theme.id === 'Theme 1: People and lifestyle');

    for (const language of languages) {
      for (const tier of tiers) {
        for (const theme of filteredThemes) { // Use filtered themes
          // Filter to the specific topic 'Education and work'
          const filteredTopics = theme.topics.filter(topic => topic === 'Education and work');
          for (const topic of filteredTopics) {
            console.log(`\n📝 Processing ${language.name} ${tier.level} - ${theme.id} - ${topic}...`);

            // Get the next assessment number dynamically
            const nextAssessmentNumber = await getNextAssessmentNumber(language.code, tier.level, theme.id, topic);
            const identifier = `assessment-${nextAssessmentNumber}`;

            console.log(`  Next assessment: ${identifier}`);

            // Create the assessment
            const assessmentData: Omit<AQATopicAssessmentDefinition, 'id' | 'created_at' | 'updated_at'> = {
              title: `AQA GCSE ${language.name} Topic Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} ${topic} ${nextAssessmentNumber}`,
              description: `Complete AQA-style ${tier.level} topic assessment focused on ${topic} with 40 questions covering all question types.`,
              level: tier.level,
              language: language.code,
              identifier: identifier,
              theme: theme.id,
              topic: topic,
              version: '1.0',
              total_questions: 9, // 9 question groups covering 50 marks
              time_limit_minutes: tier.timeLimit,
              is_active: true
            };

            const newAssessment = await assessmentService.createAssessment(assessmentData);

            if (!newAssessment) {
              console.error(`❌ Failed to create ${language.name} ${tier.level} assessment.`);
              continue; // Skip to next iteration if assessment creation failed
            }

            console.log(`  ✅ Created assessment: ${newAssessment.id}`);

            // Generate questions based on language
            let questions: AQATopicQuestionDefinition[] = [];
            switch (language.code) {
              case 'es':
                questions = generateSpanishTopicQuestions(theme.id, topic, newAssessment.id, tier.level);
                break;
              case 'fr':
                questions = generateFrenchTopicQuestions(theme.id, topic, newAssessment.id, tier.level);
                break;
              case 'de':
                questions = generateGermanTopicQuestions(theme.id, topic, newAssessment.id, tier.level);
                break;
              default:
                console.error(`❌ Unknown language: ${language.code}`);
                // Clean up the assessment if questions cannot be generated
                await supabase.from('aqa_topic_assessments').delete().eq('id', newAssessment.id);
                continue;
            }

            // Ensure assessment_id is correctly set for each question
            questions = questions.map(q => ({ ...q, assessment_id: newAssessment.id! }));


            const questionsCreated = await assessmentService.createQuestions(questions);

            if (!questionsCreated) {
              console.error(`❌ Error inserting questions for ${language.name} ${tier.level}.`);
              // Clean up the assessment if questions failed
              await supabase.from('aqa_topic_assessments').delete().eq('id', newAssessment.id);
              continue;
            }

            console.log(`  ✅ Inserted ${questions.length} question groups (50 total marks)`);
            console.log(`  🎯 ${language.name} ${tier.level} ${topic} ${identifier} completed successfully!`);
          }
        }
      }
    }

    console.log('\n🎉 Topic assessment generation completed!');
    console.log('\n📊 Summary:');

    // Show final count
    for (const language of languages) {
      for (const tier of tiers) {
        const assessments = await assessmentService.getAssessmentsByFilters(tier.level, language.code, 'Theme 1: People and lifestyle', 'Education and work');
        console.log(`  ${language.name} ${tier.level}: ${assessments?.length || 0} topic assessments available for 'Education and work'`);
      }
    }

  } catch (error) {
    console.error('❌ Error generating topic assessments:', error);
  }
}

// Run the script
generateTopicAssessments()
  .then(() => {
    console.log('✅ Generation process finished.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Generation process failed with an unhandled error:', error);
    process.exit(1);
  });