import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface ReadingPassage {
  id: string;
  title: string;
  content: string;
  language: string;
  difficulty: 'foundation' | 'higher';
  theme: string;
  topic: string;
  wordCount: number;
  estimatedReadingTime: number;
}

interface ComprehensionQuestion {
  id: string;
  type: 'multiple-choice' | 'true-false' | 'short-answer' | 'matching' | 'gap-fill';
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
}

// Sample reading passages for different languages and difficulties
const samplePassages: Record<string, ReadingPassage[]> = {
  'es': [
    {
      id: 'es-foundation-1',
      title: 'Mi Familia',
      content: `Mi nombre es Carlos y tengo quince años. Vivo en Madrid con mi familia. Mi padre se llama José y trabaja en una oficina. Mi madre se llama María y es profesora en una escuela primaria.

Tengo una hermana mayor que se llama Ana. Ella tiene dieciocho años y estudia en la universidad. También tengo un hermano menor, Pablo, que tiene doce años y va al colegio.

Los fines de semana, mi familia y yo vamos al parque. A mi padre le gusta leer el periódico bajo un árbol. Mi madre prefiere caminar por el jardín. Ana siempre lleva un libro para estudiar, y Pablo juega al fútbol con otros niños.

Por las tardes, cenamos juntos y hablamos sobre nuestro día. Me gusta mucho mi familia porque siempre nos ayudamos unos a otros.`,
      language: 'es',
      difficulty: 'foundation',
      theme: 'family',
      topic: 'family_members',
      wordCount: 145,
      estimatedReadingTime: 3
    },
    {
      id: 'es-higher-1',
      title: 'El Cambio Climático en España',
      content: `España se enfrenta a desafíos significativos debido al cambio climático. Las temperaturas han aumentado considerablemente en las últimas décadas, especialmente durante los meses de verano. Este fenómeno ha provocado sequías más frecuentes e intensas, afectando particularmente a las regiones del sur y este del país.

La agricultura española, tradicionalmente dependiente de cultivos como el olivo, la vid y los cítricos, está experimentando transformaciones importantes. Los agricultores se ven obligados a adaptar sus métodos de cultivo, implementando sistemas de riego más eficientes y explorando variedades de plantas más resistentes a la sequía.

Las ciudades costeras también enfrentan riesgos crecientes. El aumento del nivel del mar amenaza infraestructuras turísticas vitales para la economía nacional. Barcelona, Valencia y las Islas Baleares han comenzado a desarrollar planes de adaptación para proteger sus costas.

El gobierno español ha respondido con políticas ambiciosas, incluyendo inversiones masivas en energías renovables. El país aspira a convertirse en líder europeo en energía solar y eólica, aprovechando sus condiciones geográficas favorables.`,
      language: 'es',
      difficulty: 'higher',
      theme: 'environment',
      topic: 'climate_change',
      wordCount: 198,
      estimatedReadingTime: 4
    }
  ],
  'fr': [
    {
      id: 'fr-foundation-1',
      title: 'Ma Journée à l\'École',
      content: `Je m'appelle Sophie et j'ai quatorze ans. Je vais au collège tous les jours sauf le weekend. Ma journée commence à sept heures du matin quand mon réveil sonne.

Après le petit-déjeuner, je prends le bus pour aller à l'école. Le trajet dure vingt minutes. J'aime regarder par la fenêtre et voir les magasins et les parcs.

À l'école, j'ai six cours par jour. Mon cours préféré est l'anglais parce que le professeur est très sympa. Je n'aime pas beaucoup les mathématiques car c'est difficile pour moi.

À midi, je mange à la cantine avec mes amis. Nous parlons de nos cours et de nos projets pour le weekend. Après le déjeuner, nous avons encore trois cours.

L'école finit à quatre heures. Je rentre à la maison en bus et je fais mes devoirs. Le soir, je regarde la télévision avec ma famille.`,
      language: 'fr',
      difficulty: 'foundation',
      theme: 'school',
      topic: 'daily_routine',
      wordCount: 156,
      estimatedReadingTime: 3
    }
  ]
};

// Sample questions for each passage
const sampleQuestions: Record<string, ComprehensionQuestion[]> = {
  'es-foundation-1': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: '¿Cuántos años tiene Carlos?',
      options: ['Doce años', 'Quince años', 'Dieciocho años', 'Veinte años'],
      correctAnswer: 'Quince años',
      points: 2
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: '¿Dónde trabaja el padre de Carlos?',
      options: ['En una escuela', 'En una oficina', 'En un hospital', 'En una tienda'],
      correctAnswer: 'En una oficina',
      points: 2
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Ana es la hermana menor de Carlos.',
      correctAnswer: 'False',
      points: 1,
      explanation: 'Ana tiene dieciocho años y es la hermana mayor de Carlos.'
    },
    {
      id: 'q4',
      type: 'short-answer',
      question: '¿Qué hace la familia de Carlos los fines de semana?',
      correctAnswer: 'Van al parque',
      points: 3
    }
  ],
  'es-higher-1': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: '¿Cuál es el principal desafío que enfrenta España según el texto?',
      options: [
        'La crisis económica',
        'El cambio climático',
        'La inmigración',
        'El desempleo'
      ],
      correctAnswer: 'El cambio climático',
      points: 2
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: '¿Qué sectores se mencionan como afectados por el cambio climático?',
      options: [
        'Solo la agricultura',
        'Solo el turismo',
        'La agricultura y el turismo',
        'La industria y los servicios'
      ],
      correctAnswer: 'La agricultura y el turismo',
      points: 3
    },
    {
      id: 'q3',
      type: 'short-answer',
      question: '¿Qué medidas han tomado los agricultores para adaptarse al cambio climático?',
      correctAnswer: 'Implementar sistemas de riego más eficientes y explorar variedades de plantas más resistentes a la sequía',
      points: 4
    },
    {
      id: 'q4',
      type: 'true-false',
      question: 'España quiere convertirse en líder europeo en energías renovables.',
      correctAnswer: 'True',
      points: 2
    }
  ],
  'fr-foundation-1': [
    {
      id: 'q1',
      type: 'multiple-choice',
      question: 'À quelle heure commence la journée de Sophie?',
      options: ['Six heures', 'Sept heures', 'Huit heures', 'Neuf heures'],
      correctAnswer: 'Sept heures',
      points: 2
    },
    {
      id: 'q2',
      type: 'multiple-choice',
      question: 'Quel est le cours préféré de Sophie?',
      options: ['Les mathématiques', 'L\'anglais', 'Le français', 'L\'histoire'],
      correctAnswer: 'L\'anglais',
      points: 2
    },
    {
      id: 'q3',
      type: 'true-false',
      question: 'Sophie aime beaucoup les mathématiques.',
      correctAnswer: 'False',
      points: 1
    },
    {
      id: 'q4',
      type: 'short-answer',
      question: 'Combien de temps dure le trajet en bus?',
      correctAnswer: 'Vingt minutes',
      points: 2
    }
  ]
};

export async function POST(request: NextRequest) {
  try {
    const { language, difficulty, theme, topic } = await request.json();

    // Validate input
    if (!language || !difficulty) {
      return NextResponse.json(
        { error: 'Language and difficulty are required' },
        { status: 400 }
      );
    }

    // Get available passages for the language
    const availablePassages = samplePassages[language] || [];
    
    if (availablePassages.length === 0) {
      return NextResponse.json(
        { error: `No passages available for language: ${language}` },
        { status: 404 }
      );
    }

    // Filter by difficulty and optionally by theme/topic
    let filteredPassages = availablePassages.filter(p => p.difficulty === difficulty);
    
    if (theme) {
      filteredPassages = filteredPassages.filter(p => p.theme === theme);
    }
    
    if (topic) {
      filteredPassages = filteredPassages.filter(p => p.topic === topic);
    }

    if (filteredPassages.length === 0) {
      // Fallback to any passage of the correct difficulty
      filteredPassages = availablePassages.filter(p => p.difficulty === difficulty);
    }

    // Select a random passage
    const selectedPassage = filteredPassages[Math.floor(Math.random() * filteredPassages.length)];
    
    // Get questions for the selected passage
    const questions = sampleQuestions[selectedPassage.id] || [];

    // Create assessment object
    const assessment = {
      id: `assessment-${Date.now()}`,
      passage: selectedPassage,
      questions: questions,
      timeLimit: difficulty === 'foundation' ? 30 : 45, // minutes
      passingScore: difficulty === 'foundation' ? 60 : 70 // percentage
    };

    return NextResponse.json(assessment);

  } catch (error) {
    console.error('Error generating reading assessment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const difficulty = searchParams.get('difficulty');

    // Return available themes and topics for the given language/difficulty
    const availablePassages = samplePassages[language || 'es'] || [];
    const filteredPassages = difficulty 
      ? availablePassages.filter(p => p.difficulty === difficulty)
      : availablePassages;

    const themes = [...new Set(filteredPassages.map(p => p.theme))];
    const topics = [...new Set(filteredPassages.map(p => p.topic))];

    return NextResponse.json({
      themes,
      topics,
      availablePassages: filteredPassages.length
    });

  } catch (error) {
    console.error('Error fetching assessment options:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
