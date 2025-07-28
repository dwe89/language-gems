// Reading Comprehension Content Database
// Organized by category/subcategory with age-appropriate KS3 texts

export interface ReadingText {
  id: string;
  title: string;
  content: string;
  language: 'es' | 'fr' | 'de' | 'it';
  level: 'KS3' | 'KS4';
  category: string;
  subcategory: string;
  wordCount: number;
  estimatedReadingTime: number; // minutes
  difficulty: 'foundation' | 'intermediate' | 'higher';
  vocabulary: string[]; // Key vocabulary used
  grammarFocus: string[]; // Grammar points featured
}

export interface ComprehensionQuestion {
  id: string;
  textId: string;
  type: 'true-false' | 'multiple-choice' | 'matching' | 'short-answer' | 'gap-fill';
  question: string;
  options?: string[]; // For multiple choice
  correctAnswer: string | string[];
  points: number;
  explanation?: string;
  skillFocus: 'literal' | 'inferential' | 'evaluative';
}

// Spanish Reading Texts
export const spanishReadingTexts: ReadingText[] = [
  // Food & Drink Category
  {
    id: 'es-food-cafe-1',
    title: 'En el Café Central',
    content: `María y sus amigos van al Café Central después del colegio. Es un café muy popular entre los estudiantes porque está cerca del instituto y los precios son buenos.

"¿Qué vas a tomar?" pregunta el camarero.
"Yo quiero un bocadillo de jamón y queso, por favor," dice María.
"Para mí, una ensalada mixta y un zumo de naranja," añade Carlos.
"Yo prefiero algo dulce. ¿Tienen tarta de chocolate?" pregunta Ana.

El camarero sonríe. "Sí, tenemos tarta de chocolate casera. Es muy rica."

Los tres amigos pasan una hora charlando y comiendo. María paga la cuenta porque es su cumpleaños y quiere invitar a sus amigos. La cuenta total es de quince euros.

"Gracias, María. ¡Feliz cumpleaños!" dicen Carlos y Ana.`,
    language: 'es',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'ordering_cafes_restaurants',
    wordCount: 142,
    estimatedReadingTime: 3,
    difficulty: 'foundation',
    vocabulary: ['café', 'camarero', 'bocadillo', 'ensalada', 'tarta', 'cuenta', 'cumpleaños'],
    grammarFocus: ['present tense', 'question formation', 'food vocabulary']
  },
  {
    id: 'es-food-restaurant-1',
    title: 'Cena en Familia',
    content: `Los domingos, la familia González siempre cena en el restaurante "El Rincón Español". Es una tradición que comenzó cuando los abuelos vinieron a vivir con ellos.

Esta noche, el abuelo pide paella valenciana para compartir. "Es el plato más típico de España," explica a sus nietos. La abuela prefiere pescado a la plancha con verduras porque está a dieta.

Los padres eligen carne asada con patatas fritas. "Trabajamos mucho durante la semana y los domingos nos gusta comer bien," dice el padre.

Los niños, como siempre, quieren pizza y hamburguesas. "En un restaurante español deberíais probar comida española," les dice la madre, pero al final les permite elegir lo que quieren.

El camarero trae las bebidas: vino tinto para los adultos, agua con gas para los abuelos y refrescos para los niños. Toda la familia está contenta y disfruta de la cena juntos.`,
    language: 'es',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'meals',
    wordCount: 168,
    estimatedReadingTime: 4,
    difficulty: 'intermediate',
    vocabulary: ['restaurante', 'paella', 'pescado', 'verduras', 'carne', 'patatas', 'camarero'],
    grammarFocus: ['present tense', 'family vocabulary', 'food preferences']
  },

  // Home & Local Area Category
  {
    id: 'es-town-landmarks-1',
    title: 'Mi Pueblo: Santillana del Mar',
    content: `Vivo en Santillana del Mar, un pueblo muy bonito en el norte de España. Es famoso por su arquitectura medieval y sus calles empedradas.

En el centro del pueblo está la Colegiata de Santa Juliana, una iglesia muy antigua del siglo XII. Muchos turistas vienen a visitarla porque es muy importante históricamente.

Mi lugar favorito es la Plaza Mayor. Allí hay muchas casas con balcones de madera y flores. En verano, mis amigos y yo nos sentamos en los bancos para charlar y tomar helados.

Cerca de mi casa está el Museo de Altamira, donde se pueden ver reproducciones de las famosas pinturas prehistóricas. Mi profesora de historia siempre lleva a los estudiantes de intercambio allí.

Los fines de semana, mi familia y yo paseamos por las calles antiguas. Me gusta vivir aquí porque es tranquilo pero también muy interesante para los visitantes.`,
    language: 'es',
    level: 'KS3',
    category: 'home_local_area',
    subcategory: 'places_in_town',
    wordCount: 156,
    estimatedReadingTime: 3,
    difficulty: 'intermediate',
    vocabulary: ['pueblo', 'iglesia', 'plaza', 'museo', 'calles', 'turistas', 'balcones'],
    grammarFocus: ['descriptive adjectives', 'location prepositions', 'present tense']
  },

  // School Life Category
  {
    id: 'es-school-day-1',
    title: 'Un Día en el Instituto',
    content: `Me llamo Pablo y tengo catorce años. Voy al Instituto San Miguel en Madrid. Mi día escolar empieza a las ocho y media de la mañana.

La primera clase es matemáticas con el señor López. No me gustan mucho las matemáticas porque son difíciles, pero el profesor es muy simpático y siempre nos ayuda.

Después tenemos inglés con la señora García. Esta clase me gusta mucho porque quiero viajar a Inglaterra el año que viene. Hoy hemos estudiado los verbos irregulares.

A las once hay un recreo de veinte minutos. Mis amigos y yo jugamos al fútbol en el patio o compramos bocadillos en la cafetería.

Por la tarde tenemos educación física, mi asignatura favorita. Jugamos al baloncesto y al voleibol. El profesor de gimnasia dice que soy muy bueno en deportes.

Las clases terminan a las tres y media. Después voy a casa para comer con mi familia y hacer los deberes.`,
    language: 'es',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_life',
    wordCount: 178,
    estimatedReadingTime: 4,
    difficulty: 'foundation',
    vocabulary: ['instituto', 'matemáticas', 'inglés', 'recreo', 'patio', 'cafetería', 'deberes'],
    grammarFocus: ['time expressions', 'school subjects', 'likes/dislikes', 'daily routine']
  },

  // Identity & Personal Life Category
  {
    id: 'es-family-celebration-1',
    title: 'La Boda de mi Prima',
    content: `El sábado pasado fue la boda de mi prima Elena. Toda la familia se reunió para celebrar este día tan especial.

La ceremonia fue en la iglesia del pueblo donde viven mis tíos. Elena llevaba un vestido blanco precioso y su novio, Miguel, estaba muy elegante con su traje negro.

Después de la ceremonia, fuimos al restaurante "Los Olivos" para la celebración. Había más de cien invitados: familiares, amigos del colegio y compañeros de trabajo.

La comida fue excelente. Primero sirvieron jamón ibérico y queso manchego. Después, paella de mariscos y carne asada. De postre, había tarta nupcial de tres pisos con fresas y chocolate.

Mi abuelo hizo un discurso muy emotivo sobre Elena cuando era pequeña. Todos lloramos un poco porque fue muy bonito.

Bailamos hasta muy tarde. La música era una mezcla de canciones tradicionales españolas y música moderna. ¡Fue una fiesta increíble!`,
    language: 'es',
    level: 'KS3',
    category: 'identity_personal_life',
    subcategory: 'family_friends',
    wordCount: 186,
    estimatedReadingTime: 4,
    difficulty: 'intermediate',
    vocabulary: ['boda', 'ceremonia', 'vestido', 'invitados', 'jamón', 'discurso', 'bailamos'],
    grammarFocus: ['past tense (preterite)', 'family vocabulary', 'celebrations', 'descriptive language']
  }
];

// French Reading Texts
export const frenchReadingTexts: ReadingText[] = [
  {
    id: 'fr-food-market-1',
    title: 'Au Marché du Samedi',
    content: `Tous les samedis matin, je vais au marché avec ma grand-mère. C'est une tradition dans notre famille depuis des années.

"Bonjour madame Dubois," dit le marchand de légumes. "Qu'est-ce que vous désirez aujourd'hui?"

"Je voudrais deux kilos de pommes de terre, un kilo de carottes et des haricots verts, s'il vous plaît," répond ma grand-mère.

Ensuite, nous allons chez le boulanger. L'odeur du pain frais est délicieuse. Ma grand-mère achète toujours une baguette et des croissants pour le petit-déjeuner de dimanche.

Au stand de fromages, nous choisissons du camembert et du roquefort. "Le fromage français est le meilleur du monde," dit fièrement ma grand-mère.

Avant de rentrer à la maison, nous prenons un café à la terrasse du café. J'adore ces moments avec ma grand-mère.`,
    language: 'fr',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'food_drink_vocabulary',
    wordCount: 152,
    estimatedReadingTime: 3,
    difficulty: 'foundation',
    vocabulary: ['marché', 'légumes', 'boulanger', 'baguette', 'fromage', 'terrasse'],
    grammarFocus: ['present tense', 'quantities', 'shopping vocabulary', 'family relationships']
  },

  {
    id: 'fr-school-exchange-1',
    title: 'Mon Correspondant Anglais',
    content: `Cette semaine, nous avons un correspondant anglais dans notre classe. Il s'appelle James et il a quinze ans. Il vient de Londres pour améliorer son français.

James habite chez mon ami Pierre pendant son séjour. Au début, il était très timide et ne parlait pas beaucoup en français. Maintenant, après trois jours, il commence à être plus confiant.

Hier, notre professeur de français, Madame Martin, a organisé une visite du château de Versailles. James était fasciné par l'histoire et l'architecture. Il a pris beaucoup de photos avec son appareil numérique.

"La France est très différente de l'Angleterre," nous a dit James. "Les repas durent plus longtemps et les gens parlent plus fort dans les restaurants."

Nous lui avons expliqué que c'est normal en France. Nous aimons prendre notre temps pour manger et discuter avec la famille et les amis.

James retourne en Angleterre dimanche prochain. Nous espérons le revoir bientôt!`,
    language: 'fr',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_life',
    wordCount: 174,
    estimatedReadingTime: 4,
    difficulty: 'intermediate',
    vocabulary: ['correspondant', 'séjour', 'château', 'appareil', 'repas', 'discuter'],
    grammarFocus: ['present tense', 'past tense (passé composé)', 'cultural comparisons', 'expressing opinions']
  }
];

// German Reading Texts
export const germanReadingTexts: ReadingText[] = [
  {
    id: 'de-food-restaurant-1',
    title: 'Im Restaurant',
    content: `Heute gehen meine Familie und ich ins Restaurant "Zur Alten Post". Es ist ein traditionelles deutsches Restaurant in der Stadtmitte.

Der Kellner bringt uns die Speisekarte. Mein Vater bestellt Schnitzel mit Kartoffeln und Salat. Meine Mutter möchte Fisch mit Gemüse. "Ich bin auf Diät," sagt sie lächelnd.

Mein Bruder und ich bestellen beide Bratwurst mit Sauerkraut und Brot. "Das ist typisch deutsch," erklärt der Kellner einem amerikanischen Touristen am Nebentisch.

Zum Trinken nehmen wir Apfelschorle und meine Eltern trinken Bier. Das Essen schmeckt sehr gut und die Portionen sind groß.

Nach dem Essen bestellen wir noch Schwarzwälder Kirschtorte zum Dessert. "Das ist die beste Torte in der Stadt," sagt der Kellner stolz.

Wir bezahlen die Rechnung und geben dem Kellner ein Trinkgeld. Es war ein schöner Abend mit der Familie.`,
    language: 'de',
    level: 'KS3',
    category: 'food_drink',
    subcategory: 'ordering_cafes_restaurants',
    wordCount: 168,
    estimatedReadingTime: 4,
    difficulty: 'foundation',
    vocabulary: ['Restaurant', 'Kellner', 'Speisekarte', 'Schnitzel', 'Bratwurst', 'Rechnung'],
    grammarFocus: ['present tense', 'food vocabulary', 'family members', 'ordering food']
  },

  {
    id: 'de-school-day-1',
    title: 'Mein Schultag',
    content: `Ich heiße Anna und bin vierzehn Jahre alt. Ich gehe auf das Goethe-Gymnasium in München. Mein Schultag beginnt um acht Uhr morgens.

Die erste Stunde ist Mathematik bei Herrn Schmidt. Mathematik ist nicht mein Lieblingsfach, aber der Lehrer erklärt alles sehr gut. Danach haben wir Deutsch bei Frau Müller.

In der großen Pause treffe ich meine Freunde auf dem Schulhof. Wir reden über die Hausaufgaben und unsere Pläne für das Wochenende. Manchmal kaufen wir auch etwas in der Cafeteria.

Am Nachmittag haben wir Sport, mein Lieblingsfach. Wir spielen Volleyball und Basketball. Die Sportlehrerin sagt, dass ich sehr gut im Sport bin.

Der Unterricht endet um drei Uhr. Dann fahre ich mit dem Bus nach Hause. Zu Hause mache ich meine Hausaufgaben und helfe meiner Mutter beim Kochen.`,
    language: 'de',
    level: 'KS3',
    category: 'school_jobs_future',
    subcategory: 'school_life',
    wordCount: 156,
    estimatedReadingTime: 3,
    difficulty: 'foundation',
    vocabulary: ['Schule', 'Gymnasium', 'Mathematik', 'Pause', 'Schulhof', 'Hausaufgaben'],
    grammarFocus: ['present tense', 'school subjects', 'time expressions', 'daily routine']
  },

  {
    id: 'de-family-weekend-1',
    title: 'Wochenende mit der Familie',
    content: `Am Wochenende machen wir oft Ausflüge mit der ganzen Familie. Letzten Samstag sind wir zum Schloss Neuschwanstein gefahren. Es ist das berühmteste Schloss in Bayern.

Die Fahrt dauerte zwei Stunden mit dem Auto. Mein kleiner Bruder war sehr aufgeregt und hat die ganze Zeit Fragen gestellt. "Wohnt da wirklich ein König?" wollte er wissen.

Das Schloss ist wunderschön und steht auf einem hohen Berg. Von dort kann man die ganze Landschaft sehen. Wir haben viele Fotos gemacht und eine Führung durch die Räume gemacht.

Mittags haben wir in einem kleinen Restaurant in der Nähe gegessen. Es gab traditionelle bayerische Küche: Schweinebraten, Knödel und Rotkohl.

Am Abend waren wir alle müde, aber sehr glücklich. "Das war der beste Familienausflug dieses Jahr," sagte meine Mutter. Ich stimme ihr zu!`,
    language: 'de',
    level: 'KS3',
    category: 'identity_personal_life',
    subcategory: 'family_friends',
    wordCount: 174,
    estimatedReadingTime: 4,
    difficulty: 'intermediate',
    vocabulary: ['Wochenende', 'Ausflug', 'Schloss', 'Familie', 'Landschaft', 'Restaurant'],
    grammarFocus: ['past tense (Perfekt)', 'family vocabulary', 'travel vocabulary', 'adjectives']
  }
];

// Question Templates for Different Types
export const questionTemplates = {
  'true-false': [
    'According to the text, {statement}. True or False?',
    'Based on the passage, {statement}. True or False?',
    '{statement}. Is this statement true or false?'
  ],
  'multiple-choice': [
    'According to the text, {question}',
    'Based on the passage, {question}',
    'What does the text say about {topic}?'
  ],
  'short-answer': [
    'Answer the question using information from the text: {question}',
    'Explain briefly: {question}',
    'What does the text tell us about {topic}?'
  ],
  'gap-fill': [
    'Complete the sentences with words from the text:',
    'Fill in the blanks with appropriate words from the passage:'
  ]
};

// Sample Questions for Spanish Texts
export const spanishQuestions: ComprehensionQuestion[] = [
  // Questions for "En el Café Central"
  {
    id: 'es-food-cafe-1-q1',
    textId: 'es-food-cafe-1',
    type: 'multiple-choice',
    question: 'Why is Café Central popular among students?',
    options: [
      'Because the food is very expensive',
      'Because it is close to the school and the prices are good',
      'Because only teachers go there',
      'Because it is far from school'
    ],
    correctAnswer: 'Because it is close to the school and the prices are good',
    points: 2,
    skillFocus: 'literal'
  },
  {
    id: 'es-food-cafe-1-q2',
    textId: 'es-food-cafe-1',
    type: 'true-false',
    question: 'Carlos orders a ham and cheese sandwich.',
    correctAnswer: 'False',
    points: 1,
    explanation: 'Carlos orders a mixed salad and orange juice. María orders the sandwich.',
    skillFocus: 'literal'
  },
  {
    id: 'es-food-cafe-1-q3',
    textId: 'es-food-cafe-1',
    type: 'short-answer',
    question: 'Why does María pay the bill?',
    correctAnswer: 'Because it is her birthday and she wants to treat her friends',
    points: 3,
    skillFocus: 'literal'
  },
  {
    id: 'es-food-cafe-1-q4',
    textId: 'es-food-cafe-1',
    type: 'gap-fill',
    question: 'Complete: "I prefer something _____. Do you have _____ cake?"',
    correctAnswer: ['sweet', 'chocolate'],
    points: 2,
    skillFocus: 'literal'
  },

  // Questions for "Mi Pueblo: Santillana del Mar"
  {
    id: 'es-town-landmarks-1-q1',
    textId: 'es-town-landmarks-1',
    type: 'multiple-choice',
    question: 'What century is the Colegiata de Santa Juliana from?',
    options: ['11th century', '12th century', '13th century', '14th century'],
    correctAnswer: '12th century',
    points: 2,
    skillFocus: 'literal'
  },
  {
    id: 'es-town-landmarks-1-q2',
    textId: 'es-town-landmarks-1',
    type: 'true-false',
    question: 'The Altamira Museum has original prehistoric paintings.',
    correctAnswer: 'False',
    points: 1,
    explanation: 'The museum has reproductions of the paintings, not the originals.',
    skillFocus: 'literal'
  },
  {
    id: 'es-town-landmarks-1-q3',
    textId: 'es-town-landmarks-1',
    type: 'short-answer',
    question: 'Why does the narrator like living in Santillana del Mar?',
    correctAnswer: 'Because it is peaceful but also very interesting for visitors',
    points: 3,
    skillFocus: 'inferential'
  }
];

// French Questions
export const frenchQuestions: ComprehensionQuestion[] = [
  {
    id: 'fr-food-market-1-q1',
    textId: 'fr-food-market-1',
    type: 'multiple-choice',
    question: 'When does the narrator go to the market?',
    options: [
      'Every Sunday morning',
      'Every Saturday morning', 
      'Every Friday evening',
      'Every day'
    ],
    correctAnswer: 'Every Saturday morning',
    points: 2,
    skillFocus: 'literal'
  },
  {
    id: 'fr-food-market-1-q2',
    textId: 'fr-food-market-1',
    type: 'true-false',
    question: 'The grandmother buys bread and croissants for Monday breakfast.',
    correctAnswer: 'False',
    points: 1,
    explanation: 'She buys them for Sunday breakfast.',
    skillFocus: 'literal'
  },
  {
    id: 'fr-food-market-1-q3',
    textId: 'fr-food-market-1',
    type: 'short-answer',
    question: 'What does the grandmother say about French cheese?',
    correctAnswer: 'French cheese is the best in the world',
    points: 2,
    skillFocus: 'literal'
  }
];

// German Questions
export const germanQuestions: ComprehensionQuestion[] = [
  {
    id: 'de-food-restaurant-1-q1',
    textId: 'de-food-restaurant-1',
    type: 'multiple-choice',
    question: 'What does the father order at the restaurant?',
    options: [
      'Fish with vegetables',
      'Schnitzel with potatoes and salad',
      'Bratwurst with sauerkraut',
      'Black Forest cake'
    ],
    correctAnswer: 'Schnitzel with potatoes and salad',
    points: 2,
    skillFocus: 'literal'
  },
  {
    id: 'de-food-restaurant-1-q2',
    textId: 'de-food-restaurant-1',
    type: 'true-false',
    question: 'The mother orders bratwurst with sauerkraut.',
    correctAnswer: 'False',
    points: 1,
    explanation: 'The mother orders fish with vegetables because she is on a diet.',
    skillFocus: 'literal'
  },
  {
    id: 'de-school-day-1-q1',
    textId: 'de-school-day-1',
    type: 'short-answer',
    question: 'What is Anna\'s favorite subject?',
    correctAnswer: 'Sport',
    points: 2,
    skillFocus: 'literal'
  }
];

// Export all content
export const readingComprehensionContent = {
  texts: {
    spanish: spanishReadingTexts,
    french: frenchReadingTexts,
    german: germanReadingTexts
  },
  questions: {
    spanish: spanishQuestions,
    french: frenchQuestions,
    german: germanQuestions
  },
  templates: questionTemplates
};
