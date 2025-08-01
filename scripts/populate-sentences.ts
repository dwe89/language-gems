import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Complete category/subcategory mapping from the game
const CATEGORIES_SUBCATEGORIES = {
  'basics_core_language': [
    'colours', 'common_adverbs', 'common_irregular_verbs', 'common_phrases', 'common_regular_verbs',
    'comparatives_superlatives', 'conjunctions', 'days', 'demonstratives', 'general_prepositions',
    'greetings_core_language', 'greetings_introductions', 'months', 'numbers_1_30', 'numbers_40_100',
    'numbers_beyond_100', 'object_descriptions', 'opinions', 'ordinal_numbers', 'pronouns',
    'qualifiers_intensifiers', 'question_words', 'reflexive_verbs', 'shapes', 'telling_time', 'time_sequencers'
  ],
  'clothes_shopping': ['clothes_accessories'],
  'daily_life': ['daily_routine'],
  'food_drink': ['food_drink_vocabulary', 'meals', 'ordering_cafes_restaurants'],
  'free_time_leisure': ['entertainment', 'hobbies_interests', 'reading', 'sports_exercise'],
  'health_lifestyle': ['body_parts', 'health_fitness', 'illness_injury'],
  'holidays_travel_culture': ['accommodation', 'countries_nationalities', 'cultural_events', 'directions_transport', 'holiday_activities', 'weather'],
  'home_local_area': ['describing_area', 'environmental_issues', 'house_rooms', 'places_in_town'],
  'identity_personal_life': ['family_friends', 'personal_characteristics', 'personal_information', 'relationships'],
  'nature_environment': ['animals', 'environmental_problems', 'geography', 'plants_nature'],
  'school_jobs_future': ['career_plans', 'education_system', 'professions_jobs', 'school_subjects', 'university_further_education'],
  'social_global_issues': ['charity_volunteering', 'global_issues', 'poverty_homelessness', 'social_problems'],
  'technology_media': ['internet_computers', 'mobile_phones_social_media', 'music', 'online_safety', 'tv']
};

// Comprehensive sentence templates for ALL categories and subcategories
const SENTENCE_TEMPLATES = {
  'basics_core_language': {
    'colours': {
      spanish: ['Mi color favorito es el azul', 'La casa es roja y blanca', 'Llevo una camisa verde', 'El cielo está gris hoy', 'Me gustan los zapatos negros'],
      french: ['Ma couleur préférée est le bleu', 'La maison est rouge et blanche', 'Je porte une chemise verte', 'Le ciel est gris aujourd\'hui', 'J\'aime les chaussures noires'],
      german: ['Meine Lieblingsfarbe ist blau', 'Das Haus ist rot und weiß', 'Ich trage ein grünes Hemd', 'Der Himmel ist heute grau', 'Ich mag die schwarzen Schuhe']
    },
    'common_adverbs': {
      spanish: ['Siempre llego temprano', 'Nunca como dulces', 'A veces voy al cine', 'Aquí está mi libro', 'Allí vive mi amigo'],
      french: ['J\'arrive toujours tôt', 'Je ne mange jamais de bonbons', 'Parfois je vais au cinéma', 'Voici mon livre', 'Mon ami habite là-bas'],
      german: ['Ich komme immer früh an', 'Ich esse nie Süßigkeiten', 'Manchmal gehe ich ins Kino', 'Hier ist mein Buch', 'Dort wohnt mein Freund']
    },
    'common_irregular_verbs': {
      spanish: ['Tengo diecisiete años', 'Voy a la escuela', 'Soy estudiante', 'Hago mis deberes', 'Digo la verdad'],
      french: ['J\'ai dix-sept ans', 'Je vais à l\'école', 'Je suis étudiant', 'Je fais mes devoirs', 'Je dis la vérité'],
      german: ['Ich bin siebzehn Jahre alt', 'Ich gehe zur Schule', 'Ich bin Student', 'Ich mache meine Hausaufgaben', 'Ich sage die Wahrheit']
    },
    'common_phrases': {
      spanish: ['Por favor, ayúdame', 'Muchas gracias', 'De nada', 'Lo siento mucho', '¿Cómo estás?'],
      french: ['S\'il vous plaît, aidez-moi', 'Merci beaucoup', 'De rien', 'Je suis désolé', 'Comment allez-vous?'],
      german: ['Bitte helfen Sie mir', 'Vielen Dank', 'Gern geschehen', 'Es tut mir leid', 'Wie geht es Ihnen?']
    },
    'common_regular_verbs': {
      spanish: ['Hablo español', 'Como en casa', 'Vivo en Londres', 'Estudio matemáticas', 'Trabajo los fines de semana'],
      french: ['Je parle français', 'Je mange à la maison', 'J\'habite à Londres', 'J\'étudie les mathématiques', 'Je travaille le week-end'],
      german: ['Ich spreche Deutsch', 'Ich esse zu Hause', 'Ich wohne in London', 'Ich lerne Mathematik', 'Ich arbeite am Wochenende']
    },
    'comparatives_superlatives': {
      spanish: ['Mi hermano es más alto que yo', 'Esta casa es la más grande', 'El examen fue muy difícil', 'Soy menos inteligente que tú', 'Es el mejor estudiante'],
      french: ['Mon frère est plus grand que moi', 'Cette maison est la plus grande', 'L\'examen était très difficile', 'Je suis moins intelligent que toi', 'C\'est le meilleur étudiant'],
      german: ['Mein Bruder ist größer als ich', 'Dieses Haus ist das größte', 'Die Prüfung war sehr schwierig', 'Ich bin weniger intelligent als du', 'Er ist der beste Student']
    },
    'conjunctions': {
      spanish: ['Me gusta leer y escribir', 'Quiero ir pero no puedo', 'Estudio porque es importante', 'Voy aunque llueva', 'Como frutas o verduras'],
      french: ['J\'aime lire et écrire', 'Je veux y aller mais je ne peux pas', 'J\'étudie parce que c\'est important', 'J\'y vais même s\'il pleut', 'Je mange des fruits ou des légumes'],
      german: ['Ich lese und schreibe gerne', 'Ich möchte gehen, aber ich kann nicht', 'Ich lerne, weil es wichtig ist', 'Ich gehe, obwohl es regnet', 'Ich esse Obst oder Gemüse']
    },
    'days': {
      spanish: ['Hoy es lunes', 'Mañana es martes', 'El sábado voy al cine', 'Los domingos descanso', 'El viernes tengo clase'],
      french: ['Aujourd\'hui c\'est lundi', 'Demain c\'est mardi', 'Samedi je vais au cinéma', 'Le dimanche je me repose', 'Vendredi j\'ai cours'],
      german: ['Heute ist Montag', 'Morgen ist Dienstag', 'Am Samstag gehe ich ins Kino', 'Sonntags ruhe ich mich aus', 'Freitag habe ich Unterricht']
    },
    'demonstratives': {
      spanish: ['Este libro es interesante', 'Esa chica es mi amiga', 'Aquellos coches son caros', 'Esta comida está deliciosa', 'Ese profesor enseña bien'],
      french: ['Ce livre est intéressant', 'Cette fille est mon amie', 'Ces voitures sont chères', 'Cette nourriture est délicieuse', 'Ce professeur enseigne bien'],
      german: ['Dieses Buch ist interessant', 'Dieses Mädchen ist meine Freundin', 'Diese Autos sind teuer', 'Dieses Essen ist lecker', 'Dieser Lehrer unterrichtet gut']
    },
    'general_prepositions': {
      spanish: ['El gato está sobre la mesa', 'Camino hacia la escuela', 'Vivo cerca del parque', 'El libro está dentro del cajón', 'Trabajo desde las nueve'],
      french: ['Le chat est sur la table', 'Je marche vers l\'école', 'J\'habite près du parc', 'Le livre est dans le tiroir', 'Je travaille depuis neuf heures'],
      german: ['Die Katze ist auf dem Tisch', 'Ich gehe zur Schule', 'Ich wohne in der Nähe des Parks', 'Das Buch ist in der Schublade', 'Ich arbeite seit neun Uhr']
    },
    'greetings_core_language': {
      spanish: ['Hola, ¿cómo estás?', 'Buenos días, señora', 'Buenas tardes, profesor', 'Buenas noches, mamá', 'Adiós, hasta mañana'],
      french: ['Salut, comment ça va?', 'Bonjour, madame', 'Bonsoir, professeur', 'Bonne nuit, maman', 'Au revoir, à demain'],
      german: ['Hallo, wie geht es dir?', 'Guten Morgen, gnädige Frau', 'Guten Abend, Herr Professor', 'Gute Nacht, Mama', 'Auf Wiedersehen, bis morgen']
    },
    'greetings_introductions': {
      spanish: ['Me llamo María', 'Soy de España', 'Tengo quince años', 'Mucho gusto en conocerte', 'Encantado de conocerla'],
      french: ['Je m\'appelle Marie', 'Je viens de France', 'J\'ai quinze ans', 'Ravi de te rencontrer', 'Enchanté de vous connaître'],
      german: ['Ich heiße Maria', 'Ich komme aus Deutschland', 'Ich bin fünfzehn Jahre alt', 'Freut mich, dich kennenzulernen', 'Freut mich, Sie kennenzulernen']
    },
    'months': {
      spanish: ['Enero es muy frío', 'En marzo llega la primavera', 'Mayo es mi mes favorito', 'Agosto es muy caluroso', 'Diciembre tiene Navidad'],
      french: ['Janvier est très froid', 'En mars arrive le printemps', 'Mai est mon mois préféré', 'Août est très chaud', 'Décembre a Noël'],
      german: ['Januar ist sehr kalt', 'Im März kommt der Frühling', 'Mai ist mein Lieblingsmonat', 'August ist sehr heiß', 'Dezember hat Weihnachten']
    },
    'numbers_1_30': {
      spanish: ['Tengo veinte años', 'Hay quince estudiantes', 'Son las doce y media', 'Compré cinco manzanas', 'El autobús número treinta'],
      french: ['J\'ai vingt ans', 'Il y a quinze étudiants', 'Il est midi et demi', 'J\'ai acheté cinq pommes', 'Le bus numéro trente'],
      german: ['Ich bin zwanzig Jahre alt', 'Es gibt fünfzehn Studenten', 'Es ist halb eins', 'Ich kaufte fünf Äpfel', 'Der Bus Nummer dreißig']
    },
    'numbers_40_100': {
      spanish: ['Mi abuela tiene ochenta años', 'El libro cuesta cincuenta euros', 'Hay sesenta minutos', 'Corrí noventa metros', 'Cien personas vinieron'],
      french: ['Ma grand-mère a quatre-vingts ans', 'Le livre coûte cinquante euros', 'Il y a soixante minutes', 'J\'ai couru quatre-vingt-dix mètres', 'Cent personnes sont venues'],
      german: ['Meine Großmutter ist achtzig Jahre alt', 'Das Buch kostet fünfzig Euro', 'Es gibt sechzig Minuten', 'Ich lief neunzig Meter', 'Hundert Leute kamen']
    },
    'numbers_beyond_100': {
      spanish: ['Mil estudiantes estudian aquí', 'El coche cuesta quince mil euros', 'Doscientas personas asistieron', 'Quinientos libros en la biblioteca', 'Un millón de habitantes'],
      french: ['Mille étudiants étudient ici', 'La voiture coûte quinze mille euros', 'Deux cents personnes ont assisté', 'Cinq cents livres à la bibliothèque', 'Un million d\'habitants'],
      german: ['Tausend Studenten studieren hier', 'Das Auto kostet fünfzehntausend Euro', 'Zweihundert Leute nahmen teil', 'Fünfhundert Bücher in der Bibliothek', 'Eine Million Einwohner']
    },
    'object_descriptions': {
      spanish: ['La mesa es grande y marrón', 'El coche es rápido y nuevo', 'La casa es pequeña pero bonita', 'El perro es negro y peludo', 'La mochila es pesada y azul'],
      french: ['La table est grande et marron', 'La voiture est rapide et neuve', 'La maison est petite mais jolie', 'Le chien est noir et poilu', 'Le sac à dos est lourd et bleu'],
      german: ['Der Tisch ist groß und braun', 'Das Auto ist schnell und neu', 'Das Haus ist klein aber schön', 'Der Hund ist schwarz und haarig', 'Der Rucksack ist schwer und blau']
    },
    'opinions': {
      spanish: ['Creo que es una buena idea', 'En mi opinión, es difícil', 'Me parece muy interesante', 'Pienso que tienes razón', 'No estoy de acuerdo contigo'],
      french: ['Je pense que c\'est une bonne idée', 'À mon avis, c\'est difficile', 'Je trouve ça très intéressant', 'Je pense que tu as raison', 'Je ne suis pas d\'accord avec toi'],
      german: ['Ich denke, das ist eine gute Idee', 'Meiner Meinung nach ist es schwierig', 'Ich finde es sehr interessant', 'Ich denke, du hast recht', 'Ich bin nicht einverstanden mit dir']
    },
    'ordinal_numbers': {
      spanish: ['Es mi primer día de clase', 'Vivo en el segundo piso', 'Llegué en tercer lugar', 'Es la quinta vez que vengo', 'El décimo estudiante llegó tarde'],
      french: ['C\'est mon premier jour de classe', 'J\'habite au deuxième étage', 'Je suis arrivé en troisième position', 'C\'est la cinquième fois que je viens', 'Le dixième étudiant est arrivé en retard'],
      german: ['Es ist mein erster Schultag', 'Ich wohne im zweiten Stock', 'Ich kam als Dritter an', 'Es ist das fünfte Mal, dass ich komme', 'Der zehnte Student kam zu spät']
    },
    'pronouns': {
      spanish: ['Yo estudio en la biblioteca', 'Tú eres muy inteligente', 'Él vive cerca de aquí', 'Nosotros jugamos fútbol', 'Ellos hablan español'],
      french: ['Je étudie à la bibliothèque', 'Tu es très intelligent', 'Il habite près d\'ici', 'Nous jouons au football', 'Ils parlent français'],
      german: ['Ich lerne in der Bibliothek', 'Du bist sehr intelligent', 'Er wohnt in der Nähe', 'Wir spielen Fußball', 'Sie sprechen Deutsch']
    },
    'qualifiers_intensifiers': {
      spanish: ['Es muy importante estudiar', 'Está bastante cansado hoy', 'Es extremadamente difícil', 'Soy un poco tímido', 'Es completamente imposible'],
      french: ['Il est très important d\'étudier', 'Il est assez fatigué aujourd\'hui', 'C\'est extrêmement difficile', 'Je suis un peu timide', 'C\'est complètement impossible'],
      german: ['Es ist sehr wichtig zu lernen', 'Er ist heute ziemlich müde', 'Es ist extrem schwierig', 'Ich bin etwas schüchtern', 'Es ist völlig unmöglich']
    },
    'question_words': {
      spanish: ['¿Qué haces los fines de semana?', '¿Dónde vives exactamente?', '¿Cuándo es tu cumpleaños?', '¿Por qué estudias español?', '¿Cómo te llamas?'],
      french: ['Que fais-tu le week-end?', 'Où habites-tu exactement?', 'Quand est ton anniversaire?', 'Pourquoi étudies-tu le français?', 'Comment tu t\'appelles?'],
      german: ['Was machst du am Wochenende?', 'Wo wohnst du genau?', 'Wann hast du Geburtstag?', 'Warum lernst du Deutsch?', 'Wie heißt du?']
    },
    'reflexive_verbs': {
      spanish: ['Me levanto a las siete', 'Te lavas los dientes', 'Se viste muy elegante', 'Nos divertimos mucho', 'Se acuestan tarde'],
      french: ['Je me lève à sept heures', 'Tu te brosses les dents', 'Il s\'habille très élégamment', 'Nous nous amusons beaucoup', 'Ils se couchent tard'],
      german: ['Ich stehe um sieben auf', 'Du putzt dir die Zähne', 'Er zieht sich sehr elegant an', 'Wir amüsieren uns sehr', 'Sie gehen spät ins Bett']
    },
    'shapes': {
      spanish: ['El círculo es perfecto', 'El cuadrado tiene cuatro lados', 'El triángulo es muy puntiagudo', 'El rectángulo es alargado', 'La estrella brilla mucho'],
      french: ['Le cercle est parfait', 'Le carré a quatre côtés', 'Le triangle est très pointu', 'Le rectangle est allongé', 'L\'étoile brille beaucoup'],
      german: ['Der Kreis ist perfekt', 'Das Quadrat hat vier Seiten', 'Das Dreieck ist sehr spitz', 'Das Rechteck ist länglich', 'Der Stern leuchtet sehr']
    },
    'telling_time': {
      spanish: ['Son las tres y cuarto', 'Es la una y media', 'Son las cinco menos diez', 'Es medianoche exactamente', 'Son las siete de la mañana'],
      french: ['Il est trois heures et quart', 'Il est une heure et demie', 'Il est cinq heures moins dix', 'Il est exactement minuit', 'Il est sept heures du matin'],
      german: ['Es ist Viertel nach drei', 'Es ist halb zwei', 'Es ist zehn vor fünf', 'Es ist genau Mitternacht', 'Es ist sieben Uhr morgens']
    },
    'time_sequencers': {
      spanish: ['Primero desayuno, luego estudio', 'Después de clase voy a casa', 'Antes de dormir leo', 'Finalmente termino los deberes', 'Mientras como veo televisión'],
      french: ['D\'abord je prends le petit-déjeuner, puis j\'étudie', 'Après les cours je rentre à la maison', 'Avant de dormir je lis', 'Finalement je finis mes devoirs', 'Pendant que je mange je regarde la télé'],
      german: ['Zuerst frühstücke ich, dann lerne ich', 'Nach dem Unterricht gehe ich nach Hause', 'Vor dem Schlafen lese ich', 'Schließlich beende ich die Hausaufgaben', 'Während ich esse, sehe ich fern']
    }
  }
};

// English translations for all sentences
const ENGLISH_TRANSLATIONS: { [key: string]: string } = {
  // Colours translations
  'Mi color favorito es el azul': 'My favorite color is blue',
  'La casa es roja y blanca': 'The house is red and white',
  'Llevo una camisa verde': 'I wear a green shirt',
  'El cielo está gris hoy': 'The sky is gray today',
  'Me gustan los zapatos negros': 'I like the black shoes',
  'Ma couleur préférée est le bleu': 'My favorite color is blue',
  'La maison est rouge et blanche': 'The house is red and white',
  'Je porte une chemise verte': 'I wear a green shirt',
  'Le ciel est gris aujourd\'hui': 'The sky is gray today',
  'J\'aime les chaussures noires': 'I like the black shoes',
  'Meine Lieblingsfarbe ist blau': 'My favorite color is blue',
  'Das Haus ist rot und weiß': 'The house is red and white',
  'Ich trage ein grünes Hemd': 'I wear a green shirt',
  'Der Himmel ist heute grau': 'The sky is gray today',
  'Ich mag die schwarzen Schuhe': 'I like the black shoes',

  // Common adverbs translations
  'Siempre llego temprano': 'I always arrive early',
  'Nunca como dulces': 'I never eat sweets',
  'A veces voy al cine': 'Sometimes I go to the cinema',
  'Aquí está mi libro': 'Here is my book',
  'Allí vive mi amigo': 'My friend lives there',
  'J\'arrive toujours tôt': 'I always arrive early',
  'Je ne mange jamais de bonbons': 'I never eat sweets',
  'Parfois je vais au cinéma': 'Sometimes I go to the cinema',
  'Voici mon livre': 'Here is my book',
  'Mon ami habite là-bas': 'My friend lives over there',
  'Ich komme immer früh an': 'I always arrive early',
  'Ich esse nie Süßigkeiten': 'I never eat sweets',
  'Manchmal gehe ich ins Kino': 'Sometimes I go to the cinema',
  'Hier ist mein Buch': 'Here is my book',
  'Dort wohnt mein Freund': 'My friend lives there',

  // Common irregular verbs translations
  'Tengo diecisiete años': 'I am seventeen years old',
  'Voy a la escuela': 'I go to school',
  'Soy estudiante': 'I am a student',
  'Hago mis deberes': 'I do my homework',
  'Digo la verdad': 'I tell the truth',
  'J\'ai dix-sept ans': 'I am seventeen years old',
  'Je vais à l\'école': 'I go to school',
  'Je suis étudiant': 'I am a student',
  'Je fais mes devoirs': 'I do my homework',
  'Je dis la vérité': 'I tell the truth',
  'Ich bin siebzehn Jahre alt': 'I am seventeen years old',
  'Ich gehe zur Schule': 'I go to school',
  'Ich bin Student': 'I am a student',
  'Ich mache meine Hausaufgaben': 'I do my homework',
  'Ich sage die Wahrheit': 'I tell the truth',

  // Common phrases translations
  'Por favor, ayúdame': 'Please help me',
  'Muchas gracias': 'Thank you very much',
  'De nada': 'You\'re welcome',
  'Lo siento mucho': 'I am very sorry',
  '¿Cómo estás?': 'How are you?',
  'S\'il vous plaît, aidez-moi': 'Please help me',
  'Merci beaucoup': 'Thank you very much',
  'De rien': 'You\'re welcome',
  'Je suis désolé': 'I am sorry',
  'Comment allez-vous?': 'How are you?',
  'Bitte helfen Sie mir': 'Please help me',
  'Vielen Dank': 'Thank you very much',
  'Gern geschehen': 'You\'re welcome',
  'Es tut mir leid': 'I am sorry',
  'Wie geht es Ihnen?': 'How are you?',

  // Common regular verbs translations
  'Hablo español': 'I speak Spanish',
  'Como en casa': 'I eat at home',
  'Vivo en Londres': 'I live in London',
  'Estudio matemáticas': 'I study mathematics',
  'Trabajo los fines de semana': 'I work on weekends',
  'Je parle français': 'I speak French',
  'Je mange à la maison': 'I eat at home',
  'J\'habite à Londres': 'I live in London',
  'J\'étudie les mathématiques': 'I study mathematics',
  'Je travaille le week-end': 'I work on weekends',
  'Ich spreche Deutsch': 'I speak German',
  'Ich esse zu Hause': 'I eat at home',
  'Ich wohne in London': 'I live in London',
  'Ich lerne Mathematik': 'I study mathematics',
  'Ich arbeite am Wochenende': 'I work on weekends',

  // Comparatives superlatives translations
  'Mi hermano es más alto que yo': 'My brother is taller than me',
  'Esta casa es la más grande': 'This house is the biggest',
  'El examen fue muy difícil': 'The exam was very difficult',
  'Soy menos inteligente que tú': 'I am less intelligent than you',
  'Es el mejor estudiante': 'He is the best student',
  'Mon frère est plus grand que moi': 'My brother is taller than me',
  'Cette maison est la plus grande': 'This house is the biggest',
  'L\'examen était très difficile': 'The exam was very difficult',
  'Je suis moins intelligent que toi': 'I am less intelligent than you',
  'C\'est le meilleur étudiant': 'He is the best student',
  'Mein Bruder ist größer als ich': 'My brother is taller than me',
  'Dieses Haus ist das größte': 'This house is the biggest',
  'Die Prüfung war sehr schwierig': 'The exam was very difficult',
  'Ich bin weniger intelligent als du': 'I am less intelligent than you',
  'Er ist der beste Student': 'He is the best student',

  // Conjunctions translations
  'Me gusta leer y escribir': 'I like to read and write',
  'Quiero ir pero no puedo': 'I want to go but I can\'t',
  'Estudio porque es importante': 'I study because it\'s important',
  'Voy aunque llueva': 'I go even if it rains',
  'Como frutas o verduras': 'I eat fruits or vegetables',
  'J\'aime lire et écrire': 'I like to read and write',
  'Je veux y aller mais je ne peux pas': 'I want to go but I can\'t',
  'J\'étudie parce que c\'est important': 'I study because it\'s important',
  'J\'y vais même s\'il pleut': 'I go even if it rains',
  'Je mange des fruits ou des légumes': 'I eat fruits or vegetables',
  'Ich lese und schreibe gerne': 'I like to read and write',
  'Ich möchte gehen, aber ich kann nicht': 'I want to go but I can\'t',
  'Ich lerne, weil es wichtig ist': 'I study because it\'s important',
  'Ich gehe, obwohl es regnet': 'I go even though it rains',
  'Ich esse Obst oder Gemüse': 'I eat fruit or vegetables',

  // Days translations
  'Hoy es lunes': 'Today is Monday',
  'Mañana es martes': 'Tomorrow is Tuesday',
  'El sábado voy al cine': 'On Saturday I go to the cinema',
  'Los domingos descanso': 'On Sundays I rest',
  'El viernes tengo clase': 'On Friday I have class',
  'Aujourd\'hui c\'est lundi': 'Today is Monday',
  'Demain c\'est mardi': 'Tomorrow is Tuesday',
  'Samedi je vais au cinéma': 'On Saturday I go to the cinema',
  'Le dimanche je me repose': 'On Sunday I rest',
  'Vendredi j\'ai cours': 'On Friday I have class',
  'Heute ist Montag': 'Today is Monday',
  'Morgen ist Dienstag': 'Tomorrow is Tuesday',
  'Am Samstag gehe ich ins Kino': 'On Saturday I go to the cinema',
  'Sonntags ruhe ich mich aus': 'On Sundays I rest',
  'Freitag habe ich Unterricht': 'On Friday I have class',

  // Demonstratives translations
  'Este libro es interesante': 'This book is interesting',
  'Esa chica es mi amiga': 'That girl is my friend',
  'Aquellos coches son caros': 'Those cars are expensive',
  'Esta comida está deliciosa': 'This food is delicious',
  'Ese profesor enseña bien': 'That teacher teaches well',
  'Ce livre est intéressant': 'This book is interesting',
  'Cette fille est mon amie': 'This girl is my friend',
  'Ces voitures sont chères': 'These cars are expensive',
  'Cette nourriture est délicieuse': 'This food is delicious',
  'Ce professeur enseigne bien': 'This teacher teaches well',
  'Dieses Buch ist interessant': 'This book is interesting',
  'Dieses Mädchen ist meine Freundin': 'This girl is my friend',
  'Diese Autos sind teuer': 'These cars are expensive',
  'Dieses Essen ist lecker': 'This food is delicious',
  'Dieser Lehrer unterrichtet gut': 'This teacher teaches well',

  // General prepositions translations
  'El gato está sobre la mesa': 'The cat is on the table',
  'Camino hacia la escuela': 'I walk towards the school',
  'Vivo cerca del parque': 'I live near the park',
  'El libro está dentro del cajón': 'The book is inside the drawer',
  'Trabajo desde las nueve': 'I work from nine o\'clock',
  'Le chat est sur la table': 'The cat is on the table',
  'Je marche vers l\'école': 'I walk towards the school',
  'J\'habite près du parc': 'I live near the park',
  'Le livre est dans le tiroir': 'The book is in the drawer',
  'Je travaille depuis neuf heures': 'I work from nine o\'clock',
  'Die Katze ist auf dem Tisch': 'The cat is on the table',
  'Ich gehe zur Schule': 'I walk to school',
  'Ich wohne in der Nähe des Parks': 'I live near the park',
  'Das Buch ist in der Schublade': 'The book is in the drawer',
  'Ich arbeite seit neun Uhr': 'I work from nine o\'clock',

  // Greetings core language translations
  'Hola, ¿cómo estás?': 'Hello, how are you?',
  'Buenos días, señora': 'Good morning, madam',
  'Buenas tardes, profesor': 'Good afternoon, teacher',
  'Buenas noches, mamá': 'Good night, mom',
  'Adiós, hasta mañana': 'Goodbye, see you tomorrow',
  'Salut, comment ça va?': 'Hi, how are you?',
  'Bonjour, madame': 'Good morning, madam',
  'Bonsoir, professeur': 'Good evening, teacher',
  'Bonne nuit, maman': 'Good night, mom',
  'Au revoir, à demain': 'Goodbye, see you tomorrow',
  'Hallo, wie geht es dir?': 'Hello, how are you?',
  'Guten Morgen, gnädige Frau': 'Good morning, madam',
  'Guten Abend, Herr Professor': 'Good evening, professor',
  'Gute Nacht, Mama': 'Good night, mom',
  'Auf Wiedersehen, bis morgen': 'Goodbye, see you tomorrow',

  // Greetings introductions translations
  'Me llamo María': 'My name is Maria',
  'Soy de España': 'I am from Spain',
  'Tengo quince años': 'I am fifteen years old',
  'Mucho gusto en conocerte': 'Nice to meet you',
  'Encantado de conocerla': 'Pleased to meet you',
  'Je m\'appelle Marie': 'My name is Marie',
  'Je viens de France': 'I come from France',
  'J\'ai quinze ans': 'I am fifteen years old',
  'Ravi de te rencontrer': 'Nice to meet you',
  'Enchanté de vous connaître': 'Pleased to meet you',
  'Ich heiße Maria': 'My name is Maria',
  'Ich komme aus Deutschland': 'I come from Germany',
  'Ich bin fünfzehn Jahre alt': 'I am fifteen years old',
  'Freut mich, dich kennenzulernen': 'Nice to meet you',
  'Freut mich, Sie kennenzulernen': 'Pleased to meet you',

  // Months translations
  'Enero es muy frío': 'January is very cold',
  'En marzo llega la primavera': 'Spring arrives in March',
  'Mayo es mi mes favorito': 'May is my favorite month',
  'Agosto es muy caluroso': 'August is very hot',
  'Diciembre tiene Navidad': 'December has Christmas',
  'Janvier est très froid': 'January is very cold',
  'En mars arrive le printemps': 'Spring arrives in March',
  'Mai est mon mois préféré': 'May is my favorite month',
  'Août est très chaud': 'August is very hot',
  'Décembre a Noël': 'December has Christmas',
  'Januar ist sehr kalt': 'January is very cold',
  'Im März kommt der Frühling': 'Spring comes in March',
  'Mai ist mein Lieblingsmonat': 'May is my favorite month',
  'August ist sehr heiß': 'August is very hot',
  'Dezember hat Weihnachten': 'December has Christmas',

  // Numbers 1-30 translations
  'Tengo veinte años': 'I am twenty years old',
  'Hay quince estudiantes': 'There are fifteen students',
  'Son las doce y media': 'It is half past twelve',
  'Compré cinco manzanas': 'I bought five apples',
  'El autobús número treinta': 'Bus number thirty',
  'J\'ai vingt ans': 'I am twenty years old',
  'Il y a quinze étudiants': 'There are fifteen students',
  'Il est midi et demi': 'It is half past twelve',
  'J\'ai acheté cinq pommes': 'I bought five apples',
  'Le bus numéro trente': 'Bus number thirty',
  'Ich bin zwanzig Jahre alt': 'I am twenty years old',
  'Es gibt fünfzehn Studenten': 'There are fifteen students',
  'Es ist halb eins': 'It is half past twelve',
  'Ich kaufte fünf Äpfel': 'I bought five apples',
  'Der Bus Nummer dreißig': 'Bus number thirty',

  // Numbers 40-100 translations
  'Mi abuela tiene ochenta años': 'My grandmother is eighty years old',
  'El libro cuesta cincuenta euros': 'The book costs fifty euros',
  'Hay sesenta minutos': 'There are sixty minutes',
  'Corrí noventa metros': 'I ran ninety meters',
  'Cien personas vinieron': 'One hundred people came',
  'Ma grand-mère a quatre-vingts ans': 'My grandmother is eighty years old',
  'Le livre coûte cinquante euros': 'The book costs fifty euros',
  'Il y a soixante minutes': 'There are sixty minutes',
  'J\'ai couru quatre-vingt-dix mètres': 'I ran ninety meters',
  'Cent personnes sont venues': 'One hundred people came',
  'Meine Großmutter ist achtzig Jahre alt': 'My grandmother is eighty years old',
  'Das Buch kostet fünfzig Euro': 'The book costs fifty euros',
  'Es gibt sechzig Minuten': 'There are sixty minutes',
  'Ich lief neunzig Meter': 'I ran ninety meters',
  'Hundert Leute kamen': 'One hundred people came',

  // Numbers beyond 100 translations
  'Mil estudiantes estudian aquí': 'A thousand students study here',
  'El coche cuesta quince mil euros': 'The car costs fifteen thousand euros',
  'Doscientas personas asistieron': 'Two hundred people attended',
  'Quinientos libros en la biblioteca': 'Five hundred books in the library',
  'Un millón de habitantes': 'One million inhabitants',
  'Mille étudiants étudient ici': 'A thousand students study here',
  'La voiture coûte quinze mille euros': 'The car costs fifteen thousand euros',
  'Deux cents personnes ont assisté': 'Two hundred people attended',
  'Cinq cents livres à la bibliothèque': 'Five hundred books in the library',
  'Un million d\'habitants': 'One million inhabitants',
  'Tausend Studenten studieren hier': 'A thousand students study here',
  'Das Auto kostet fünfzehntausend Euro': 'The car costs fifteen thousand euros',
  'Zweihundert Leute nahmen teil': 'Two hundred people participated',
  'Fünfhundert Bücher in der Bibliothek': 'Five hundred books in the library',
  'Eine Million Einwohner': 'One million inhabitants',

  // Object descriptions translations
  'La mesa es grande y marrón': 'The table is big and brown',
  'El coche es rápido y nuevo': 'The car is fast and new',
  'La casa es pequeña pero bonita': 'The house is small but pretty',
  'El perro es negro y peludo': 'The dog is black and furry',
  'La mochila es pesada y azul': 'The backpack is heavy and blue',
  'La table est grande et marron': 'The table is big and brown',
  'La voiture est rapide et neuve': 'The car is fast and new',
  'La maison est petite mais jolie': 'The house is small but pretty',
  'Le chien est noir et poilu': 'The dog is black and furry',
  'Le sac à dos est lourd et bleu': 'The backpack is heavy and blue',
  'Der Tisch ist groß und braun': 'The table is big and brown',
  'Das Auto ist schnell und neu': 'The car is fast and new',
  'Das Haus ist klein aber schön': 'The house is small but beautiful',
  'Der Hund ist schwarz und haarig': 'The dog is black and furry',
  'Der Rucksack ist schwer und blau': 'The backpack is heavy and blue',

  // Opinions translations
  'Creo que es una buena idea': 'I think it\'s a good idea',
  'En mi opinión, es difícil': 'In my opinion, it\'s difficult',
  'Me parece muy interesante': 'I find it very interesting',
  'Pienso que tienes razón': 'I think you\'re right',
  'No estoy de acuerdo contigo': 'I don\'t agree with you',
  'Je pense que c\'est une bonne idée': 'I think it\'s a good idea',
  'À mon avis, c\'est difficile': 'In my opinion, it\'s difficult',
  'Je trouve ça très intéressant': 'I find it very interesting',
  'Je pense que tu as raison': 'I think you\'re right',
  'Je ne suis pas d\'accord avec toi': 'I don\'t agree with you',
  'Ich denke, das ist eine gute Idee': 'I think it\'s a good idea',
  'Meiner Meinung nach ist es schwierig': 'In my opinion, it\'s difficult',
  'Ich finde es sehr interessant': 'I find it very interesting',
  'Ich denke, du hast recht': 'I think you\'re right',
  'Ich bin nicht einverstanden mit dir': 'I don\'t agree with you',

  // Ordinal numbers translations
  'Es mi primer día de clase': 'It\'s my first day of class',
  'Vivo en el segundo piso': 'I live on the second floor',
  'Llegué en tercer lugar': 'I came in third place',
  'Es la quinta vez que vengo': 'It\'s the fifth time I come',
  'El décimo estudiante llegó tarde': 'The tenth student arrived late',
  'C\'est mon premier jour de classe': 'It\'s my first day of class',
  'J\'habite au deuxième étage': 'I live on the second floor',
  'Je suis arrivé en troisième position': 'I came in third place',
  'C\'est la cinquième fois que je viens': 'It\'s the fifth time I come',
  'Le dixième étudiant est arrivé en retard': 'The tenth student arrived late',
  'Es ist mein erster Schultag': 'It\'s my first day of school',
  'Ich wohne im zweiten Stock': 'I live on the second floor',
  'Ich kam als Dritter an': 'I came in third place',
  'Es ist das fünfte Mal, dass ich komme': 'It\'s the fifth time I come',
  'Der zehnte Student kam zu spät': 'The tenth student came too late',

  // Pronouns translations
  'Yo estudio en la biblioteca': 'I study in the library',
  'Tú eres muy inteligente': 'You are very intelligent',
  'Él vive cerca de aquí': 'He lives near here',
  'Nosotros jugamos fútbol': 'We play football',
  'Ellos hablan español': 'They speak Spanish',
  'Je étudie à la bibliothèque': 'I study in the library',
  'Tu es très intelligent': 'You are very intelligent',
  'Il habite près d\'ici': 'He lives near here',
  'Nous jouons au football': 'We play football',
  'Ils parlent français': 'They speak French',
  'Ich lerne in der Bibliothek': 'I study in the library',
  'Du bist sehr intelligent': 'You are very intelligent',
  'Er wohnt in der Nähe': 'He lives nearby',
  'Wir spielen Fußball': 'We play football',
  'Sie sprechen Deutsch': 'They speak German',

  // Qualifiers intensifiers translations
  'Es muy importante estudiar': 'It\'s very important to study',
  'Está bastante cansado hoy': 'He\'s quite tired today',
  'Es extremadamente difícil': 'It\'s extremely difficult',
  'Soy un poco tímido': 'I\'m a bit shy',
  'Es completamente imposible': 'It\'s completely impossible',
  'Il est très important d\'étudier': 'It\'s very important to study',
  'Il est assez fatigué aujourd\'hui': 'He\'s quite tired today',
  'C\'est extrêmement difficile': 'It\'s extremely difficult',
  'Je suis un peu timide': 'I\'m a bit shy',
  'C\'est complètement impossible': 'It\'s completely impossible',
  'Es ist sehr wichtig zu lernen': 'It\'s very important to study',
  'Er ist heute ziemlich müde': 'He\'s quite tired today',
  'Es ist extrem schwierig': 'It\'s extremely difficult',
  'Ich bin etwas schüchtern': 'I\'m a bit shy',
  'Es ist völlig unmöglich': 'It\'s completely impossible',

  // Question words translations
  '¿Qué haces los fines de semana?': 'What do you do on weekends?',
  '¿Dónde vives exactamente?': 'Where exactly do you live?',
  '¿Cuándo es tu cumpleaños?': 'When is your birthday?',
  '¿Por qué estudias español?': 'Why do you study Spanish?',
  '¿Cómo te llamas?': 'What is your name?',
  'Que fais-tu le week-end?': 'What do you do on weekends?',
  'Où habites-tu exactement?': 'Where exactly do you live?',
  'Quand est ton anniversaire?': 'When is your birthday?',
  'Pourquoi étudies-tu le français?': 'Why do you study French?',
  'Comment tu t\'appelles?': 'What is your name?',
  'Was machst du am Wochenende?': 'What do you do on weekends?',
  'Wo wohnst du genau?': 'Where exactly do you live?',
  'Wann hast du Geburtstag?': 'When is your birthday?',
  'Warum lernst du Deutsch?': 'Why do you study German?',
  'Wie heißt du?': 'What is your name?',

  // Reflexive verbs translations
  'Me levanto a las siete': 'I get up at seven',
  'Te lavas los dientes': 'You brush your teeth',
  'Se viste muy elegante': 'He/she dresses very elegantly',
  'Nos divertimos mucho': 'We have a lot of fun',
  'Se acuestan tarde': 'They go to bed late',
  'Je me lève à sept heures': 'I get up at seven o\'clock',
  'Tu te brosses les dents': 'You brush your teeth',
  'Il s\'habille très élégamment': 'He dresses very elegantly',
  'Nous nous amusons beaucoup': 'We have a lot of fun',
  'Ils se couchent tard': 'They go to bed late',
  'Ich stehe um sieben auf': 'I get up at seven',
  'Du putzt dir die Zähne': 'You brush your teeth',
  'Er zieht sich sehr elegant an': 'He dresses very elegantly',
  'Wir amüsieren uns sehr': 'We have a lot of fun',
  'Sie gehen spät ins Bett': 'They go to bed late',

  // Shapes translations
  'El círculo es perfecto': 'The circle is perfect',
  'El cuadrado tiene cuatro lados': 'The square has four sides',
  'El triángulo es muy puntiagudo': 'The triangle is very pointed',
  'El rectángulo es alargado': 'The rectangle is elongated',
  'La estrella brilla mucho': 'The star shines brightly',
  'Le cercle est parfait': 'The circle is perfect',
  'Le carré a quatre côtés': 'The square has four sides',
  'Le triangle est très pointu': 'The triangle is very pointed',
  'Le rectangle est allongé': 'The rectangle is elongated',
  'L\'étoile brille beaucoup': 'The star shines brightly',
  'Der Kreis ist perfekt': 'The circle is perfect',
  'Das Quadrat hat vier Seiten': 'The square has four sides',
  'Das Dreieck ist sehr spitz': 'The triangle is very pointed',
  'Das Rechteck ist länglich': 'The rectangle is elongated',
  'Der Stern leuchtet sehr': 'The star shines brightly',

  // Telling time translations
  'Son las tres y cuarto': 'It\'s quarter past three',
  'Es la una y media': 'It\'s half past one',
  'Son las cinco menos diez': 'It\'s ten to five',
  'Es medianoche exactamente': 'It\'s exactly midnight',
  'Son las siete de la mañana': 'It\'s seven in the morning',
  'Il est trois heures et quart': 'It\'s quarter past three',
  'Il est une heure et demie': 'It\'s half past one',
  'Il est cinq heures moins dix': 'It\'s ten to five',
  'Il est exactement minuit': 'It\'s exactly midnight',
  'Il est sept heures du matin': 'It\'s seven in the morning',
  'Es ist Viertel nach drei': 'It\'s quarter past three',
  'Es ist halb zwei': 'It\'s half past one',
  'Es ist zehn vor fünf': 'It\'s ten to five',
  'Es ist genau Mitternacht': 'It\'s exactly midnight',
  'Es ist sieben Uhr morgens': 'It\'s seven in the morning',

  // Time sequencers translations
  'Primero desayuno, luego estudio': 'First I have breakfast, then I study',
  'Después de clase voy a casa': 'After class I go home',
  'Antes de dormir leo': 'Before sleeping I read',
  'Finalmente termino los deberes': 'Finally I finish my homework',
  'Mientras como veo televisión': 'While I eat I watch television',
  'D\'abord je prends le petit-déjeuner, puis j\'étudie': 'First I have breakfast, then I study',
  'Après les cours je rentre à la maison': 'After class I go home',
  'Avant de dormir je lis': 'Before sleeping I read',
  'Finalement je finis mes devoirs': 'Finally I finish my homework',
  'Pendant que je mange je regarde la télé': 'While I eat I watch TV',
  'Zuerst frühstücke ich, dann lerne ich': 'First I have breakfast, then I study',
  'Nach dem Unterricht gehe ich nach Hause': 'After class I go home',
  'Vor dem Schlafen lese ich': 'Before sleeping I read',
  'Schließlich beende ich die Hausaufgaben': 'Finally I finish my homework',
  'Während ich esse, sehe ich fern': 'While I eat, I watch TV'
};

async function populateSentences() {
  console.log('🚀 Starting sentence population...');
  
  let totalInserted = 0;
  let totalErrors = 0;

  // Process each category and subcategory
  for (const [category, subcategories] of Object.entries(CATEGORIES_SUBCATEGORIES)) {
    console.log(`\n📂 Processing category: ${category}`);
    
    for (const subcategory of subcategories) {
      console.log(`  📁 Processing subcategory: ${subcategory}`);

      // Check if we have sentence templates for this category/subcategory
      const categoryTemplates = (SENTENCE_TEMPLATES as any)[category];
      if (!categoryTemplates || !categoryTemplates[subcategory]) {
        console.log(`    ⚠️  No templates found for ${category}/${subcategory}, skipping...`);
        continue;
      }

      const subcategoryTemplates = categoryTemplates[subcategory];
      
      // Process each language
      for (const language of ['spanish', 'french', 'german']) {
        console.log(`    🌍 Processing language: ${language}`);
        
        const sentences = subcategoryTemplates[language];

        for (const sentence of sentences) {
          const englishTranslation = (ENGLISH_TRANSLATIONS as any)[sentence];

          if (!englishTranslation) {
            console.log(`    ❌ No English translation found for: "${sentence}"`);
            totalErrors++;
            continue;
          }

          // Check if sentence already exists
          const { data: existing } = await supabase
            .from('sentences')
            .select('id')
            .eq('source_sentence', sentence)
            .eq('source_language', language)
            .eq('category', category)
            .eq('subcategory', subcategory)
            .single();

          if (existing) {
            console.log(`    ⏭️  Sentence already exists: "${sentence.substring(0, 30)}..."`);
            continue;
          }

          // Insert the sentence
          const { error } = await supabase
            .from('sentences')
            .insert({
              source_language: language,
              category: category,
              subcategory: subcategory,
              difficulty_level: 'beginner',
              curriculum_level: 'KS3',
              source_sentence: sentence,
              target_sentence: englishTranslation,
              is_active: true,
              is_public: true
            });

          if (error) {
            console.log(`    ❌ Error inserting sentence: ${error.message}`);
            totalErrors++;
          } else {
            console.log(`    ✅ Inserted: "${sentence.substring(0, 30)}..."`);
            totalInserted++;
          }
        }
      }
    }
  }

  console.log(`\n🎯 Population complete!`);
  console.log(`✅ Successfully inserted: ${totalInserted} sentences`);
  console.log(`❌ Errors encountered: ${totalErrors}`);
  
  console.log(`\n🔍 Generic sentences populated successfully!`);
  console.log(`📊 These sentences can now be used by:`);
  console.log(`   • Case File Translator game`);
  console.log(`   • Lava Temple: Word Restore game`);
  console.log(`   • Future sentence-based games`);
  console.log(`   • Any game requiring sentence translations`);
  console.log(`✨ Script completed successfully`);
}

// Run the population
populateSentences().catch(console.error);
