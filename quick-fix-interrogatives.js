// Quick fix for interrogatives practice page
const practiceItems = [
  {
    id: '1',
    type: 'fill_blank',
    question: '_____ te llamas? (What\'s your name?)',
    answer: 'Cómo',
    options: ['Qué', 'Cómo', 'Dónde', 'Cuándo'],
    hint: "'Cómo' is used to ask for names: '¿Cómo te llamas?' (What's your name?)",
    difficulty: 'beginner',
    category: 'Question Words'
  },
  {
    id: '2',
    type: 'fill_blank',
    question: '_____ vives? (Where do you live?)',
    answer: 'Dónde',
    options: ['Qué', 'Quién', 'Dónde', 'Cómo'],
    hint: "'Dónde' asks for location: '¿Dónde vives?' (Where do you live?)",
    difficulty: 'beginner',
    category: 'Question Words'
  },
  {
    id: '3',
    type: 'fill_blank',
    question: '_____ años tienes? (How old are you?)',
    answer: 'Cuántos',
    options: ['Cuántos', 'Cuántas', 'Cuánto', 'Cuál'],
    hint: "'Cuántos' agrees with masculine plural 'años'.",
    difficulty: 'beginner',
    category: 'Question Words'
  },
  {
    id: '4',
    type: 'fill_blank',
    question: '_____ es tu color favorito? (What is your favorite color?)',
    answer: 'Cuál',
    options: ['Qué', 'Cuál', 'Cómo', 'Dónde'],
    hint: "'Cuál' is used when asking for selection: 'Which is your favorite color?'",
    difficulty: 'intermediate',
    category: 'Question Words'
  },
  {
    id: '5',
    type: 'fill_blank',
    question: '¿_____ hora es? (What time is it?)',
    answer: 'Qué',
    options: ['Qué', 'Cuál', 'Cómo', 'Dónde'],
    hint: "What time is it?",
    difficulty: 'beginner',
    category: 'Time Questions'
  },
  {
    id: '6',
    type: 'fill_blank',
    question: '¿_____ estudias español? (Why do you study Spanish?)',
    answer: 'Por qué',
    options: ['Por qué', 'Para qué', 'Cómo', 'Cuándo'],
    hint: "Why do you study Spanish?",
    difficulty: 'intermediate',
    category: 'Reason Questions'
  },
  {
    id: '7',
    type: 'fill_blank',
    question: '¿_____ personas hay en tu familia? (How many people are in your family?)',
    answer: 'Cuántas',
    options: ['Cuántas', 'Cuántos', 'Cuánto', 'Cuánta'],
    hint: "How many people are in your family?",
    difficulty: 'intermediate',
    category: 'Quantity Questions'
  },
  {
    id: '8',
    type: 'fill_blank',
    question: '¿_____ quién hablas? (Who are you talking to?)',
    answer: 'Con',
    options: ['Con', 'De', 'Para', 'Sin'],
    hint: "Who are you talking to?",
    difficulty: 'intermediate',
    category: 'Preposition Questions'
  },
  {
    id: '9',
    type: 'translation',
    question: 'What are you doing?',
    answer: '¿Qué haces?',
    hint: "Alternative: ¿Qué estás haciendo?",
    difficulty: 'beginner',
    category: 'Translation Practice'
  },
  {
    id: '10',
    type: 'translation',
    question: 'Who is that woman?',
    answer: '¿Quién es esa mujer?',
    hint: "Alternative: ¿Quién es esa señora?",
    difficulty: 'beginner',
    category: 'Translation Practice'
  },
  {
    id: '11',
    type: 'translation',
    question: 'How much water do you need?',
    answer: '¿Cuánta agua necesitas?',
    hint: "Alternative: ¿Cuánta agua necesita usted?",
    difficulty: 'intermediate',
    category: 'Translation Practice'
  },
  {
    id: '12',
    type: 'translation',
    question: 'Where are you from?',
    answer: '¿De dónde eres?',
    hint: "Alternative: ¿De dónde es usted?",
    difficulty: 'beginner',
    category: 'Translation Practice'
  }
];

console.log(JSON.stringify(practiceItems, null, 2));
