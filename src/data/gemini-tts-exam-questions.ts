import { AQAListeningQuestion } from '../components/assessments/AQAListeningAssessment';

// Example AQA-style listening questions using Gemini TTS
export const geminiTTSExamQuestions: Record<string, AQAListeningQuestion[]> = {
  spanish: [
    {
      id: 'es_q1',
      type: 'multiple-choice',
      title: 'Conversación en el restaurante',
      instructions: 'Escucha la conversación y elige la respuesta correcta.',
      audioText: `Camarero: Buenas tardes, ¿qué van a tomar?
                  Cliente: Hola, queremos dos menús del día, por favor.
                  Camarero: Perfecto. ¿Y para beber?
                  Cliente: Dos aguas con gas, gracias.`,
      timeLimit: 120,
      ttsConfig: {
        multiSpeaker: true,
        speakers: [
          { name: 'Camarero', voiceName: 'Kore' },
          { name: 'Cliente', voiceName: 'Puck' }
        ]
      },
      data: {
        question: '¿Qué piden los clientes para beber?',
        options: [
          'Agua sin gas',
          'Agua con gas',
          'Refrescos',
          'Vino'
        ],
        correctAnswer: 'Agua con gas'
      }
    },
    {
      id: 'es_q2',
      type: 'dictation',
      title: 'Dictado: Información personal',
      instructions: 'Escucha y escribe exactamente lo que oyes.',
      audioText: 'Me llamo María García. Tengo veinticinco años y vivo en Madrid con mi familia.',
      timeLimit: 90,
      ttsConfig: {
        voiceName: 'Aoede',
        style: 'clearly and slowly'
      },
      data: {
        correctText: 'Me llamo María García. Tengo veinticinco años y vivo en Madrid con mi familia.',
        acceptableVariations: [
          'Me llamo Maria Garcia. Tengo 25 años y vivo en Madrid con mi familia.',
          'Me llamo María García. Tengo 25 años y vivo en Madrid con mi familia.'
        ]
      }
    },
    {
      id: 'es_q3',
      type: 'open-response',
      title: 'Descripción del tiempo',
      instructions: 'Escucha el pronóstico del tiempo y responde en inglés.',
      audioText: 'Mañana será un día soleado con temperaturas máximas de veintiocho grados. Por la tarde habrá algunas nubes pero no se espera lluvia.',
      timeLimit: 150,
      ttsConfig: {
        voiceName: 'Charon',
        style: 'like a weather presenter'
      },
      data: {
        question: 'What will the weather be like tomorrow? (Answer in English)',
        sampleAnswer: 'Tomorrow will be sunny with maximum temperatures of 28 degrees. There will be some clouds in the afternoon but no rain is expected.',
        markingCriteria: [
          'Mentions sunny weather (2 points)',
          'States temperature (28 degrees) (2 points)',
          'Mentions afternoon clouds (1 point)',
          'States no rain expected (1 point)'
        ]
      }
    }
  ],

  french: [
    {
      id: 'fr_q1',
      type: 'multiple-choice',
      title: 'À la gare',
      instructions: 'Écoutez l\'annonce et choisissez la bonne réponse.',
      audioText: 'Attention voyageurs. Le train à destination de Lyon partira du quai numéro trois à quinze heures trente. Nous nous excusons pour le retard de dix minutes.',
      timeLimit: 120,
      ttsConfig: {
        voiceName: 'Rasalgethi',
        style: 'like a train station announcement'
      },
      data: {
        question: 'À quelle heure part le train pour Lyon?',
        options: [
          '15h20',
          '15h30',
          '15h40',
          '16h30'
        ],
        correctAnswer: '15h40'
      }
    },
    {
      id: 'fr_q2',
      type: 'activity-timing',
      title: 'Programme de la journée',
      instructions: 'Écoutez le programme et notez les heures.',
      audioText: `Voici le programme de demain:
                  À neuf heures, petit-déjeuner à l'hôtel.
                  À dix heures trente, visite du musée.
                  À douze heures trente, déjeuner au restaurant.
                  À quatorze heures, temps libre pour faire du shopping.
                  À dix-huit heures, retour à l'hôtel.`,
      timeLimit: 180,
      ttsConfig: {
        voiceName: 'Laomedeia',
        style: 'like a tour guide'
      },
      data: {
        activities: [
          { activity: 'Petit-déjeuner', correctTime: '09:00' },
          { activity: 'Visite du musée', correctTime: '10:30' },
          { activity: 'Déjeuner', correctTime: '12:30' },
          { activity: 'Shopping', correctTime: '14:00' },
          { activity: 'Retour à l\'hôtel', correctTime: '18:00' }
        ]
      }
    }
  ],

  german: [
    {
      id: 'de_q1',
      type: 'multiple-choice',
      title: 'Im Supermarkt',
      instructions: 'Hören Sie das Gespräch und wählen Sie die richtige Antwort.',
      audioText: `Verkäufer: Guten Tag! Kann ich Ihnen helfen?
                  Kunde: Ja, ich suche frisches Obst. Haben Sie Äpfel?
                  Verkäufer: Ja, wir haben sehr gute Äpfel aus Deutschland. Sie kosten zwei Euro pro Kilo.
                  Kunde: Das ist gut. Ich nehme zwei Kilo, bitte.`,
      timeLimit: 120,
      ttsConfig: {
        multiSpeaker: true,
        speakers: [
          { name: 'Verkäufer', voiceName: 'Iapetus' },
          { name: 'Kunde', voiceName: 'Enceladus' }
        ]
      },
      data: {
        question: 'Wie viel kosten die Äpfel?',
        options: [
          '1 Euro pro Kilo',
          '2 Euro pro Kilo',
          '3 Euro pro Kilo',
          '2 Euro für zwei Kilo'
        ],
        correctAnswer: '2 Euro pro Kilo'
      }
    },
    {
      id: 'de_q2',
      type: 'opinion-rating',
      title: 'Meinungen über Hobbys',
      instructions: 'Hören Sie die Meinungen und bewerten Sie sie als positiv (P), negativ (N) oder positiv und negativ (P+N).',
      audioText: `Person 1: Ich finde Fußball fantastisch! Es macht so viel Spaß und man bleibt fit.
                  Person 2: Lesen ist okay, aber manchmal ist es langweilig. Ich bevorzuge Filme.
                  Person 3: Kochen ist schrecklich! Es dauert zu lange und macht viel Arbeit.`,
      timeLimit: 150,
      ttsConfig: {
        multiSpeaker: true,
        speakers: [
          { name: 'Person 1', voiceName: 'Fenrir' },
          { name: 'Person 2', voiceName: 'Umbriel' },
          { name: 'Person 3', voiceName: 'Algenib' }
        ]
      },
      data: {
        statements: [
          { person: 'Person 1', topic: 'Fußball', correctRating: 'P' },
          { person: 'Person 2', topic: 'Lesen', correctRating: 'P+N' },
          { person: 'Person 3', topic: 'Kochen', correctRating: 'N' }
        ]
      }
    }
  ]
};

// Voice recommendations for different question types
export const questionTypeVoiceMapping = {
  'multiple-choice': ['Puck', 'Kore', 'Charon'],
  'dictation': ['Aoede', 'Iapetus', 'Schedar'], // Clear, precise voices
  'open-response': ['Rasalgethi', 'Laomedeia', 'Achernar'], // Informative voices
  'activity-timing': ['Laomedeia', 'Achird', 'Vindemiatrix'], // Friendly, clear voices
  'opinion-rating': ['Fenrir', 'Puck', 'Algenib'], // Expressive voices
  'letter-matching': ['Iapetus', 'Schedar', 'Despina'], // Clear voices
  'lifestyle-grid': ['Callirrhoe', 'Autonoe', 'Umbriel'], // Easy-going voices
  'multi-part': ['Charon', 'Rasalgethi', 'Sadaltager'] // Informative voices
};

// Language-specific voice preferences
export const languageVoicePreferences = {
  spanish: {
    formal: ['Kore', 'Charon', 'Iapetus'],
    casual: ['Puck', 'Aoede', 'Laomedeia'],
    narrative: ['Rasalgethi', 'Achernar', 'Vindemiatrix']
  },
  french: {
    formal: ['Schedar', 'Despina', 'Sadaltager'],
    casual: ['Aoede', 'Callirrhoe', 'Achird'],
    narrative: ['Laomedeia', 'Umbriel', 'Sulafat']
  },
  german: {
    formal: ['Iapetus', 'Algieba', 'Gacrux'],
    casual: ['Enceladus', 'Autonoe', 'Zubenelgenubi'],
    narrative: ['Charon', 'Rasalgethi', 'Sadachbia']
  }
};
