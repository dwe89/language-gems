import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Complete Spanish Foundation Assessment - 40 Questions
const spanishFoundationQuestions = [
  // Questions 1-4: Letter Matching - Hobbies (4 marks)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some Spanish teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Sofía', text: 'Me fascina crear dibujos y pinturas en mi tiempo libre. Siempre llevo mi cuaderno de bocetos.' },
        { name: 'Raúl', text: 'Paso horas tocando la guitarra y componiendo canciones nuevas para mi banda.' },
        { name: 'Elena', text: 'Colecciono monedas antiguas de diferentes países. Tengo más de doscientas.' },
        { name: 'Pablo', text: 'Cultivo tomates y flores en el jardín de mi abuela todos los fines de semana.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Sofía': 'A', 'Raúl': 'E', 'Elena': 'B', 'Pablo': 'D' }
    }
  },

  // Questions 5-9: Multiple Choice - Valencia (5 marks)
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Valencia',
    instructions: 'You read this extract from a travel guide about Valencia. Answer the questions by selecting the correct option.',
    reading_text: 'Valencia es famosa por su impresionante Ciudad de las Artes y las Ciencias, un complejo arquitectónico moderno. Durante el verano, las temperaturas pueden ser muy altas, así que es recomendable visitar los museos con aire acondicionado. La especialidad culinaria más conocida es la paella valenciana, que se prepara tradicionalmente con pollo y verduras. Los restaurantes locales sirven la comida principal entre las dos y las cuatro de la tarde. Para los turistas jóvenes, la playa de la Malvarrosa ofrece deportes acuáticos y discotecas nocturnas.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        { question: 'What is Valencia famous for?', options: ['A. Ancient castles', 'B. City of Arts and Sciences', 'C. Mountain views'], correct: 'B' },
        { question: 'What should you do during hot summer weather?', options: ['A. Visit air-conditioned museums', 'B. Stay at the beach all day', 'C. Eat more paella'], correct: 'A' },
        { question: 'What is traditional Valencian paella made with?', options: ['A. Seafood and rice', 'B. Chicken and vegetables', 'C. Beef and potatoes'], correct: 'B' },
        { question: 'When do local restaurants serve the main meal?', options: ['A. Between 12-2pm', 'B. Between 2-4pm', 'C. Between 6-8pm'], correct: 'B' },
        { question: 'What does Malvarrosa beach offer young tourists?', options: ['A. Quiet relaxation', 'B. Family restaurants', 'C. Water sports and nightlife'], correct: 'C' }
      ]
    }
  },

  // Questions 10-15: Student Grid - Weekend Activities (6 marks)
  {
    question_number: 10,
    question_type: 'student-grid',
    title: 'Questions 10-15: Weekend activities',
    instructions: 'You see an online forum. Some Spanish students are describing their weekend activities. Answer the following questions. Write L for Lucía, D for Diego, I for Isabel.',
    marks: 6,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: ['L', 'D', 'I'],
      studentTexts: [
        { name: 'Lucía', text: 'Los fines de semana me levanto temprano para ir al gimnasio. Después voy al centro comercial con mis amigas para comprar ropa nueva. Por la noche, prefiero quedarme en casa viendo series en Netflix.' },
        { name: 'Diego', text: 'No me gusta hacer ejercicio los sábados. Prefiero dormir hasta tarde y luego cocinar algo especial para mi familia. También me encanta leer novelas de aventuras en mi habitación.' },
        { name: 'Isabel', text: 'Los domingos siempre voy a la piscina municipal para nadar. Es mi deporte favorito desde pequeña. Después ayudo a mi madre en el jardín plantando flores y verduras.' }
      ],
      questions: [
        { question: 'Who dislikes exercising on weekends?', correct: 'D' },
        { question: 'Who gets up early on weekends?', correct: 'L' },
        { question: 'Who likes shopping for clothes?', correct: 'L' },
        { question: 'Who enjoys cooking for family?', correct: 'D' },
        { question: 'Who likes swimming?', correct: 'I' },
        { question: 'Who helps with gardening?', correct: 'I' }
      ]
    }
  },

  // Questions 16-20: Open Response - School Life (5 marks)
  {
    question_number: 16,
    question_type: 'open-response',
    title: 'Questions 16-20: School life in Spain',
    instructions: 'You read this extract from an article about Spanish schools. Answer the following questions in English.',
    reading_text: 'En España, los estudiantes van al instituto desde los doce hasta los dieciocho años. Las clases empiezan a las ocho y media de la mañana y terminan a las dos y media de la tarde. Después del almuerzo, muchos estudiantes participan en actividades extraescolares como deportes, música o teatro. Los exámenes más importantes son los de bachillerato, que determinan si pueden ir a la universidad. Durante las vacaciones de verano, que duran tres meses, algunos estudiantes trabajan para ganar dinero.',
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Education and work',
    question_data: {
      questions: [
        { question: 'At what age do Spanish students start secondary school?', expectedWords: 2, acceptableAnswers: ['twelve years old', 'age twelve', '12 years old'] },
        { question: 'What time do classes finish?', expectedWords: 3, acceptableAnswers: ['half past two', '2:30 pm', 'two thirty'] },
        { question: 'Name two extracurricular activities mentioned.', expectedWords: 4, acceptableAnswers: ['sports and music', 'music and theatre', 'sports and theatre'] },
        { question: 'What determines university entrance?', expectedWords: 3, acceptableAnswers: ['bachillerato exams', 'baccalaureate exams', 'final exams'] },
        { question: 'How long are summer holidays?', expectedWords: 2, acceptableAnswers: ['three months', '3 months'] }
      ]
    }
  },

  // Questions 21-25: Time Sequence - Celebrity Interview (5 marks)
  {
    question_number: 21,
    question_type: 'time-sequence',
    title: 'Questions 21-25: Interview with a celebrity',
    instructions: 'A Spanish actress talks about her life. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
    reading_text: 'Actualmente estoy haciendo una película muy interesante sobre la historia de España. Disfruto este trabajo porque la otra actriz principal es mi mejor amiga. Cuando era más joven, recibía un buen salario en la empresa de mi familia, pero después decidí que esta carrera no era algo que quisiera hacer el resto de mi vida. Mi amiga y yo tenemos la intención de viajar por el sur de España durante un mes. Quiero cenar en un restaurante famoso en Cádiz porque he escuchado que preparan un buenísimo cazón.',
    marks: 5,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    question_data: {
      events: [
        { event: 'Working with a friend on a film', correct: 'N' },
        { event: 'Working in the family business', correct: 'P' },
        { event: 'Making a career decision', correct: 'P' },
        { event: 'Travelling with a friend', correct: 'F' },
        { event: 'Eating in a famous restaurant', correct: 'F' }
      ]
    }
  },

  // Questions 26-30: Headline Matching - News Articles (5 marks)
  {
    question_number: 26,
    question_type: 'headline-matching',
    title: 'Questions 26-30: News headlines',
    instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    question_data: {
      headlines: [
        { letter: 'A', text: 'New recycling program launched in Madrid' },
        { letter: 'B', text: 'Spanish football team wins championship' },
        { letter: 'C', text: 'Technology festival attracts thousands' },
        { letter: 'D', text: 'Weather warning issued for coastal areas' },
        { letter: 'E', text: 'University students protest education cuts' },
        { letter: 'F', text: 'Famous chef opens new restaurant' }
      ],
      articles: [
        { text: 'Miles de jóvenes se manifestaron ayer en las calles de Barcelona para protestar contra los recortes en educación superior.', correct: 'E' },
        { text: 'El famoso cocinero José Andrés ha abierto su nuevo restaurante en el centro de Sevilla, especializado en tapas modernas.', correct: 'F' },
        { text: 'La selección española de fútbol ganó el torneo internacional después de vencer a Italia por 2-1 en la final.', correct: 'B' },
        { text: 'Las autoridades han emitido una alerta meteorológica para las provincias costeras debido a fuertes vientos y lluvia.', correct: 'D' },
        { text: 'El festival de tecnología de Valencia ha atraído a más de cincuenta mil visitantes este año.', correct: 'C' }
      ]
    }
  },

  // Questions 31-35: Sentence Completion - Environmental Article (5 marks)
  {
    question_number: 31,
    question_type: 'sentence-completion',
    title: 'Questions 31-35: Environmental protection',
    instructions: 'Complete the sentences based on the text. Write the missing words in English.',
    reading_text: 'La protección del medio ambiente es muy importante para las generaciones futuras. En España, muchas ciudades han implementado programas de reciclaje para reducir la cantidad de basura. Los ciudadanos pueden separar el papel, el plástico y el vidrio en contenedores diferentes. Además, el gobierno ha creado más parques naturales para proteger la flora y la fauna. Es esencial que todos participemos en la conservación del planeta.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'The environment and where people live',
    question_data: {
      sentences: [
        { incomplete: 'Environmental protection is important for future _____.', correct: 'generations' },
        { incomplete: 'Spanish cities have implemented _____ programs.', correct: 'recycling' },
        { incomplete: 'Citizens can separate paper, plastic and _____.', correct: 'glass' },
        { incomplete: 'The government has created more _____ parks.', correct: 'natural' },
        { incomplete: 'Everyone must participate in _____ conservation.', correct: 'planet' }
      ]
    }
  },

  // Questions 36-39: Multiple Choice - Health and Lifestyle (4 marks)
  {
    question_number: 36,
    question_type: 'multiple-choice',
    title: 'Questions 36-39: Healthy living',
    instructions: 'Read this article about healthy living. Answer the questions by selecting the correct option.',
    reading_text: 'Para mantener una vida saludable, es importante hacer ejercicio regularmente y comer una dieta equilibrada. Los médicos recomiendan caminar al menos treinta minutos al día y consumir cinco porciones de frutas y verduras. También es fundamental dormir ocho horas cada noche y beber mucha agua. El estrés puede afectar negativamente la salud, por eso es importante encontrar tiempo para relajarse y disfrutar de actividades que nos gusten.',
    marks: 4,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    question_data: {
      questions: [
        { question: 'How long should you walk each day?', options: ['A. 20 minutes', 'B. 30 minutes', 'C. 45 minutes'], correct: 'B' },
        { question: 'How many portions of fruit and vegetables are recommended?', options: ['A. Three', 'B. Four', 'C. Five'], correct: 'C' },
        { question: 'How many hours of sleep are recommended?', options: ['A. Seven', 'B. Eight', 'C. Nine'], correct: 'B' },
        { question: 'What can negatively affect health?', options: ['A. Exercise', 'B. Water', 'C. Stress'], correct: 'C' }
      ]
    }
  },

  // Question 40: Translation (10 marks)
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { spanish: 'Mi hermana pequeña tiene ocho años y le gusta bailar.', marks: 2, questionNumber: '40.1' },
        { spanish: 'Ayer comimos pizza en un restaurante italiano muy bueno.', marks: 2, questionNumber: '40.2' },
        { spanish: 'El próximo verano vamos a visitar a nuestros primos en Madrid.', marks: 2, questionNumber: '40.3' },
        { spanish: 'Me duele la cabeza porque estudié muy tarde anoche.', marks: 2, questionNumber: '40.4' },
        { spanish: 'Si llueve mañana, no podremos ir a la playa con nuestros amigos.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

// French Foundation Assessment Questions Data - Complete 40 Question Set
const frenchFoundationQuestions = [
  // Questions 1-4: Letter Matching - Hobbies (4 marks)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some French teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Sophie', text: 'J\'adore créer des dessins et des peintures pendant mon temps libre. Je porte toujours mon carnet de croquis.' },
        { name: 'Raoul', text: 'Je passe des heures à jouer de la guitare et à composer de nouvelles chansons pour mon groupe.' },
        { name: 'Élène', text: 'Je collectionne les pièces anciennes de différents pays. J\'en ai plus de deux cents.' },
        { name: 'Paul', text: 'Je cultive des tomates et des fleurs dans le jardin de ma grand-mère tous les week-ends.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Sophie': 'A', 'Raoul': 'E', 'Élène': 'B', 'Paul': 'D' }
    }
  },

  // Questions 5-9: Multiple Choice - Lyon Travel Guide (5 marks)
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Lyon',
    instructions: 'You read this extract from a travel guide about Lyon. Answer the questions by selecting the correct option.',
    reading_text: 'Lyon est célèbre pour sa magnifique Vieille Ville, un quartier historique classé au patrimoine mondial de l\'UNESCO. Pendant l\'été, les températures peuvent être très élevées, il est donc recommandé de visiter les musées climatisés. La spécialité culinaire la plus connue sont les quenelles lyonnaises, qui se préparent traditionnellement avec du brochet et de la sauce Nantua. Les restaurants locaux servent le repas principal entre midi et quatorze heures. Pour les jeunes touristes, le parc de la Tête d\'Or offre des activités nautiques et des concerts en plein air.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        { question: 'What is Lyon famous for?', options: ['A. Modern architecture', 'B. Historic Old Town', 'C. Mountain views'], correct: 'B' },
        { question: 'What should you do during hot summer weather?', options: ['A. Visit air-conditioned museums', 'B. Stay at the park all day', 'C. Eat more quenelles'], correct: 'A' },
        { question: 'What are traditional Lyon quenelles made with?', options: ['A. Chicken and cream', 'B. Pike and Nantua sauce', 'C. Beef and potatoes'], correct: 'B' },
        { question: 'When do local restaurants serve the main meal?', options: ['A. Between 12-2pm', 'B. Between 2-4pm', 'C. Between 6-8pm'], correct: 'A' },
        { question: 'What does Parc de la Tête d\'Or offer young tourists?', options: ['A. Quiet relaxation', 'B. Family restaurants', 'C. Water activities and concerts'], correct: 'C' }
      ]
    }
  },

  // Questions 10-15: Student Grid - Weekend Activities (6 marks)
  {
    question_number: 10,
    question_type: 'student-grid',
    title: 'Questions 10-15: Weekend activities',
    instructions: 'You see an online forum. Some French students are describing their weekend activities. Answer the following questions. Write L for Lucie, D for Diego, I for Isabelle.',
    marks: 6,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: ['L', 'D', 'I'],
      studentTexts: [
        { name: 'Lucie', text: 'Les week-ends je me lève tôt pour aller à la salle de sport. Après je vais au centre commercial avec mes amies pour acheter de nouveaux vêtements. Le soir, je préfère rester à la maison en regardant des séries sur Netflix.' },
        { name: 'Diego', text: 'Je n\'aime pas faire du sport le samedi. Je préfère dormir tard puis cuisiner quelque chose de spécial pour ma famille. J\'adore aussi lire des romans d\'aventure dans ma chambre.' },
        { name: 'Isabelle', text: 'Le dimanche je vais toujours à la piscine municipale pour nager. C\'est mon sport préféré depuis que je suis petite. Après j\'aide ma mère dans le jardin à planter des fleurs et des légumes.' }
      ],
      questions: [
        { question: 'Who dislikes exercising on weekends?', correct: 'D' },
        { question: 'Who gets up early on weekends?', correct: 'L' },
        { question: 'Who likes shopping for clothes?', correct: 'L' },
        { question: 'Who enjoys cooking for family?', correct: 'D' },
        { question: 'Who likes swimming?', correct: 'I' },
        { question: 'Who helps with gardening?', correct: 'I' }
      ]
    }
  },

  // Questions 16-20: Open Response - School Life (5 marks)
  {
    question_number: 16,
    question_type: 'open-response',
    title: 'Questions 16-20: School life in France',
    instructions: 'You read this extract from an article about French schools. Answer the following questions in English.',
    reading_text: 'En France, les élèves vont au collège de onze à quinze ans, puis au lycée jusqu\'à dix-huit ans. Les cours commencent à huit heures du matin et finissent à dix-sept heures. Après le déjeuner, beaucoup d\'élèves participent à des activités périscolaires comme le sport, la musique ou le théâtre. Les examens les plus importants sont le brevet et le baccalauréat, qui déterminent s\'ils peuvent aller à l\'université. Pendant les grandes vacances, qui durent deux mois, certains élèves travaillent pour gagner de l\'argent.',
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Education and work',
    question_data: {
      questions: [
        { question: 'At what age do French students start secondary school?', expectedWords: 2, acceptableAnswers: ['eleven years old', 'age eleven', '11 years old'] },
        { question: 'What time do classes finish?', expectedWords: 3, acceptableAnswers: ['five o\'clock', '5:00 pm', 'seventeen hundred'] },
        { question: 'Name two extracurricular activities mentioned.', expectedWords: 4, acceptableAnswers: ['sport and music', 'music and theatre', 'sport and theatre'] },
        { question: 'What determines university entrance?', expectedWords: 3, acceptableAnswers: ['brevet and baccalauréat', 'baccalaureate exams', 'final exams'] },
        { question: 'How long are summer holidays?', expectedWords: 2, acceptableAnswers: ['two months', '2 months'] }
      ]
    }
  },

  // Questions 21-25: Time Sequence - Celebrity Interview (5 marks)
  {
    question_number: 21,
    question_type: 'time-sequence',
    title: 'Questions 21-25: Interview with a celebrity',
    instructions: 'A French actress talks about her life. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
    reading_text: 'Actuellement je tourne un film très intéressant sur l\'histoire de France. J\'apprécie ce travail parce que l\'autre actrice principale est ma meilleure amie. Quand j\'étais plus jeune, je recevais un bon salaire dans l\'entreprise de ma famille, mais après j\'ai décidé que cette carrière n\'était pas ce que je voulais faire le reste de ma vie. Mon amie et moi avons l\'intention de voyager dans le sud de la France pendant un mois. Je veux dîner dans un restaurant célèbre à Cannes parce que j\'ai entendu dire qu\'ils préparent une excellente bouillabaisse.',
    marks: 5,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    question_data: {
      events: [
        { event: 'Working with a friend on a film', correct: 'N' },
        { event: 'Working in the family business', correct: 'P' },
        { event: 'Making a career decision', correct: 'P' },
        { event: 'Travelling with a friend', correct: 'F' },
        { event: 'Eating in a famous restaurant', correct: 'F' }
      ]
    }
  },

  // Questions 26-30: Headline Matching - News Articles (5 marks)
  {
    question_number: 26,
    question_type: 'headline-matching',
    title: 'Questions 26-30: News headlines',
    instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    question_data: {
      headlines: [
        { letter: 'A', text: 'New recycling program launched in Paris' },
        { letter: 'B', text: 'French football team wins championship' },
        { letter: 'C', text: 'Technology festival attracts thousands' },
        { letter: 'D', text: 'Weather warning issued for coastal areas' },
        { letter: 'E', text: 'University students protest education cuts' },
        { letter: 'F', text: 'Famous chef opens new restaurant' }
      ],
      articles: [
        { text: 'Des milliers de jeunes ont manifesté hier dans les rues de Paris pour protester contre les réductions budgétaires dans l\'enseignement supérieur.', correct: 'E' },
        { text: 'Le célèbre cuisinier Alain Ducasse a ouvert son nouveau restaurant au centre de Marseille, spécialisé dans la cuisine provençale moderne.', correct: 'F' },
        { text: 'L\'équipe de France de football a remporté le tournoi international après avoir battu l\'Italie 2-1 en finale.', correct: 'B' },
        { text: 'Les autorités ont émis une alerte météorologique pour les départements côtiers en raison de vents forts et de pluie.', correct: 'D' },
        { text: 'Le festival de technologie de Nice a attiré plus de cinquante mille visiteurs cette année.', correct: 'C' }
      ]
    }
  },

  // Questions 31-35: Sentence Completion - Environmental Article (5 marks)
  {
    question_number: 31,
    question_type: 'sentence-completion',
    title: 'Questions 31-35: Environmental protection',
    instructions: 'Complete the sentences based on the text. Write the missing words in English.',
    reading_text: 'La protection de l\'environnement est très importante pour les générations futures. En France, beaucoup de villes ont mis en place des programmes de recyclage pour réduire la quantité de déchets. Les citoyens peuvent séparer le papier, le plastique et le verre dans des conteneurs différents. De plus, le gouvernement a créé plus de parcs naturels pour protéger la flore et la faune. Il est essentiel que tous participent à la conservation de la planète.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'The environment and where people live',
    question_data: {
      sentences: [
        { incomplete: 'Environmental protection is important for future _____.', correct: 'generations' },
        { incomplete: 'French cities have implemented _____ programs.', correct: 'recycling' },
        { incomplete: 'Citizens can separate paper, plastic and _____.', correct: 'glass' },
        { incomplete: 'The government has created more _____ parks.', correct: 'natural' },
        { incomplete: 'Everyone must participate in _____ conservation.', correct: 'planet' }
      ]
    }
  },

  // Questions 36-39: Multiple Choice - Health and Lifestyle (4 marks)
  {
    question_number: 36,
    question_type: 'multiple-choice',
    title: 'Questions 36-39: Healthy living',
    instructions: 'Read this article about healthy living. Answer the questions by selecting the correct option.',
    reading_text: 'Pour maintenir une vie saine, il est important de faire de l\'exercice régulièrement et de manger un régime équilibré. Les médecins recommandent de marcher au moins trente minutes par jour et de consommer cinq portions de fruits et légumes. Il est aussi fondamental de dormir huit heures chaque nuit et de boire beaucoup d\'eau. Le stress peut affecter négativement la santé, c\'est pourquoi il est important de trouver du temps pour se détendre et profiter d\'activités qu\'on aime.',
    marks: 4,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    question_data: {
      questions: [
        { question: 'How long should you walk each day?', options: ['A. 20 minutes', 'B. 30 minutes', 'C. 45 minutes'], correct: 'B' },
        { question: 'How many portions of fruit and vegetables are recommended?', options: ['A. Three', 'B. Four', 'C. Five'], correct: 'C' },
        { question: 'How many hours of sleep are recommended?', options: ['A. Seven', 'B. Eight', 'C. Nine'], correct: 'B' },
        { question: 'What can negatively affect health?', options: ['A. Exercise', 'B. Water', 'C. Stress'], correct: 'C' }
      ]
    }
  },

  // Question 40: Translation (10 marks)
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { french: 'Ma petite sœur a huit ans et elle aime danser.', marks: 2, questionNumber: '40.1' },
        { french: 'Hier nous avons mangé une pizza dans un très bon restaurant italien.', marks: 2, questionNumber: '40.2' },
        { french: 'L\'été prochain nous allons rendre visite à nos cousins à Paris.', marks: 2, questionNumber: '40.3' },
        { french: 'J\'ai mal à la tête parce que j\'ai étudié très tard hier soir.', marks: 2, questionNumber: '40.4' },
        { french: 'S\'il pleut demain, nous ne pourrons pas aller à la plage avec nos amis.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

// German Foundation Assessment Questions Data - Complete 40 Question Set
const germanFoundationQuestions = [
  // Questions 1-4: Letter Matching - Hobbies (4 marks)
  {
    question_number: 1,
    question_type: 'letter-matching',
    title: 'Questions 1-4: Hobbies and interests',
    instructions: 'Some German teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
    marks: 4,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: [
        { name: 'Sofia', text: 'Ich liebe es, Zeichnungen und Gemälde in meiner Freizeit zu erstellen. Ich trage immer mein Skizzenbuch bei mir.' },
        { name: 'Raul', text: 'Ich verbringe Stunden damit, Gitarre zu spielen und neue Lieder für meine Band zu komponieren.' },
        { name: 'Elena', text: 'Ich sammle alte Münzen aus verschiedenen Ländern. Ich habe mehr als zweihundert.' },
        { name: 'Paul', text: 'Ich baue Tomaten und Blumen im Garten meiner Großmutter an, jeden Wochenende.' }
      ],
      options: [
        { letter: 'A', subject: 'Art' },
        { letter: 'B', subject: 'Collecting' },
        { letter: 'C', subject: 'Cooking' },
        { letter: 'D', subject: 'Gardening' },
        { letter: 'E', subject: 'Music' },
        { letter: 'F', subject: 'Reading' }
      ],
      correctAnswers: { 'Sofia': 'A', 'Raul': 'E', 'Elena': 'B', 'Paul': 'D' }
    }
  },

  // Questions 5-9: Multiple Choice - Munich Travel Guide (5 marks)
  {
    question_number: 5,
    question_type: 'multiple-choice',
    title: 'Questions 5-9: Travel guide to Munich',
    instructions: 'You read this extract from a travel guide about Munich. Answer the questions by selecting the correct option.',
    reading_text: 'München ist berühmt für sein beeindruckendes Oktoberfest, das größte Volksfest der Welt. Während des Sommers können die Temperaturen sehr hoch sein, daher ist es empfehlenswert, die klimatisierten Museen zu besuchen. Die bekannteste kulinarische Spezialität ist die Weißwurst, die traditionell mit süßem Senf und Brezeln serviert wird. Die örtlichen Restaurants servieren das Hauptessen zwischen zwölf und vierzehn Uhr. Für junge Touristen bietet der Englische Garten Wassersport und Biergärten.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Travel and tourism, including places of interest',
    question_data: {
      questions: [
        { question: 'What is Munich famous for?', options: ['A. Christmas markets', 'B. Oktoberfest', 'C. Mountain skiing'], correct: 'B' },
        { question: 'What should you do during hot summer weather?', options: ['A. Visit air-conditioned museums', 'B. Stay in beer gardens all day', 'C. Eat more Weißwurst'], correct: 'A' },
        { question: 'What is traditional Weißwurst served with?', options: ['A. Sauerkraut and potatoes', 'B. Sweet mustard and pretzels', 'C. Beer and cheese'], correct: 'B' },
        { question: 'When do local restaurants serve the main meal?', options: ['A. Between 12-2pm', 'B. Between 2-4pm', 'C. Between 6-8pm'], correct: 'A' },
        { question: 'What does the English Garden offer young tourists?', options: ['A. Quiet relaxation', 'B. Shopping centers', 'C. Water sports and beer gardens'], correct: 'C' }
      ]
    }
  },

  // Questions 10-15: Student Grid - Weekend Activities (6 marks)
  {
    question_number: 10,
    question_type: 'student-grid',
    title: 'Questions 10-15: Weekend activities',
    instructions: 'You see an online forum. Some German students are describing their weekend activities. Answer the following questions. Write L for Lukas, D for Diana, I for Ingrid.',
    marks: 6,
    theme: 'Theme 2: Popular culture',
    topic: 'Free-time activities',
    question_data: {
      students: ['L', 'D', 'I'],
      studentTexts: [
        { name: 'Lukas', text: 'Am Wochenende stehe ich früh auf, um ins Fitnessstudio zu gehen. Danach gehe ich mit meinen Freunden ins Einkaufszentrum, um neue Kleidung zu kaufen. Abends bleibe ich lieber zu Hause und schaue Serien auf Netflix.' },
        { name: 'Diana', text: 'Ich mag es nicht, am Samstag Sport zu treiben. Ich schlafe lieber lange und koche dann etwas Besonderes für meine Familie. Ich lese auch gerne Abenteuerromane in meinem Zimmer.' },
        { name: 'Ingrid', text: 'Sonntags gehe ich immer ins städtische Schwimmbad zum Schwimmen. Das ist mein Lieblingssport seit ich klein bin. Danach helfe ich meiner Mutter im Garten beim Pflanzen von Blumen und Gemüse.' }
      ],
      questions: [
        { question: 'Who dislikes exercising on weekends?', correct: 'D' },
        { question: 'Who gets up early on weekends?', correct: 'L' },
        { question: 'Who likes shopping for clothes?', correct: 'L' },
        { question: 'Who enjoys cooking for family?', correct: 'D' },
        { question: 'Who likes swimming?', correct: 'I' },
        { question: 'Who helps with gardening?', correct: 'I' }
      ]
    }
  },

  // Questions 16-20: Open Response - School Life (5 marks)
  {
    question_number: 16,
    question_type: 'open-response',
    title: 'Questions 16-20: School life in Germany',
    instructions: 'You read this extract from an article about German schools. Answer the following questions in English.',
    reading_text: 'In Deutschland gehen die Schüler von zehn bis sechzehn Jahren auf die Realschule oder das Gymnasium. Der Unterricht beginnt um acht Uhr morgens und endet um fünfzehn Uhr. Nach dem Mittagessen nehmen viele Schüler an außerschulischen Aktivitäten wie Sport, Musik oder Theater teil. Die wichtigsten Prüfungen sind das Abitur, das bestimmt, ob sie zur Universität gehen können. Während der Sommerferien, die sechs Wochen dauern, arbeiten einige Schüler, um Geld zu verdienen.',
    marks: 5,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Education and work',
    question_data: {
      questions: [
        { question: 'At what age do German students start secondary school?', expectedWords: 2, acceptableAnswers: ['ten years old', 'age ten', '10 years old'] },
        { question: 'What time do classes finish?', expectedWords: 3, acceptableAnswers: ['three o\'clock', '3:00 pm', 'fifteen hundred'] },
        { question: 'Name two extracurricular activities mentioned.', expectedWords: 4, acceptableAnswers: ['sport and music', 'music and theatre', 'sport and theatre'] },
        { question: 'What determines university entrance?', expectedWords: 2, acceptableAnswers: ['Abitur exams', 'the Abitur'] },
        { question: 'How long are summer holidays?', expectedWords: 2, acceptableAnswers: ['six weeks', '6 weeks'] }
      ]
    }
  },

  // Questions 21-25: Time Sequence - Celebrity Interview (5 marks)
  {
    question_number: 21,
    question_type: 'time-sequence',
    title: 'Questions 21-25: Interview with a celebrity',
    instructions: 'A German actress talks about her life. When do these events happen according to the article? Write P for something that happened in the past, N for something that is happening now, F for something that is going to happen in the future.',
    reading_text: 'Zurzeit drehe ich einen sehr interessanten Film über die deutsche Geschichte. Ich genieße diese Arbeit, weil die andere Hauptdarstellerin meine beste Freundin ist. Als ich jünger war, erhielt ich ein gutes Gehalt im Unternehmen meiner Familie, aber danach entschied ich, dass diese Karriere nicht das war, was ich den Rest meines Lebens machen wollte. Meine Freundin und ich haben vor, einen Monat lang durch Süddeutschland zu reisen. Ich möchte in einem berühmten Restaurant in München essen, weil ich gehört habe, dass sie ausgezeichnete Sauerbraten zubereiten.',
    marks: 5,
    theme: 'Theme 2: Popular culture',
    topic: 'Celebrity culture',
    question_data: {
      events: [
        { event: 'Working with a friend on a film', correct: 'N' },
        { event: 'Working in the family business', correct: 'P' },
        { event: 'Making a career decision', correct: 'P' },
        { event: 'Travelling with a friend', correct: 'F' },
        { event: 'Eating in a famous restaurant', correct: 'F' }
      ]
    }
  },

  // Questions 26-30: Headline Matching - News Articles (5 marks)
  {
    question_number: 26,
    question_type: 'headline-matching',
    title: 'Questions 26-30: News headlines',
    instructions: 'Match each news article extract with the correct headline. Write the correct letter in each box.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'Media and technology',
    question_data: {
      headlines: [
        { letter: 'A', text: 'New recycling program launched in Berlin' },
        { letter: 'B', text: 'German football team wins championship' },
        { letter: 'C', text: 'Technology festival attracts thousands' },
        { letter: 'D', text: 'Weather warning issued for coastal areas' },
        { letter: 'E', text: 'University students protest education cuts' },
        { letter: 'F', text: 'Famous chef opens new restaurant' }
      ],
      articles: [
        { text: 'Tausende von jungen Menschen demonstrierten gestern in den Straßen von Berlin, um gegen Kürzungen in der Hochschulbildung zu protestieren.', correct: 'E' },
        { text: 'Der berühmte Koch Tim Mälzer hat sein neues Restaurant im Zentrum von Hamburg eröffnet, spezialisiert auf moderne deutsche Küche.', correct: 'F' },
        { text: 'Die deutsche Fußballnationalmannschaft gewann das internationale Turnier, nachdem sie Italien 2-1 im Finale besiegte.', correct: 'B' },
        { text: 'Die Behörden haben eine Wetterwarnung für die Küstengebiete wegen starker Winde und Regen herausgegeben.', correct: 'D' },
        { text: 'Das Technologiefestival in München hat dieses Jahr mehr als fünfzigtausend Besucher angezogen.', correct: 'C' }
      ]
    }
  },

  // Questions 31-35: Sentence Completion - Environmental Article (5 marks)
  {
    question_number: 31,
    question_type: 'sentence-completion',
    title: 'Questions 31-35: Environmental protection',
    instructions: 'Complete the sentences based on the text. Write the missing words in English.',
    reading_text: 'Der Umweltschutz ist sehr wichtig für zukünftige Generationen. In Deutschland haben viele Städte Recyclingprogramme eingeführt, um die Menge an Müll zu reduzieren. Die Bürger können Papier, Plastik und Glas in verschiedenen Containern trennen. Außerdem hat die Regierung mehr Naturparks geschaffen, um Flora und Fauna zu schützen. Es ist wichtig, dass alle an der Erhaltung des Planeten teilnehmen.',
    marks: 5,
    theme: 'Theme 3: Communication and the world around us',
    topic: 'The environment and where people live',
    question_data: {
      sentences: [
        { incomplete: 'Environmental protection is important for future _____.', correct: 'generations' },
        { incomplete: 'German cities have introduced _____ programs.', correct: 'recycling' },
        { incomplete: 'Citizens can separate paper, plastic and _____.', correct: 'glass' },
        { incomplete: 'The government has created more _____ parks.', correct: 'natural' },
        { incomplete: 'Everyone must participate in _____ conservation.', correct: 'planet' }
      ]
    }
  },

  // Questions 36-39: Multiple Choice - Health and Lifestyle (4 marks)
  {
    question_number: 36,
    question_type: 'multiple-choice',
    title: 'Questions 36-39: Healthy living',
    instructions: 'Read this article about healthy living. Answer the questions by selecting the correct option.',
    reading_text: 'Um ein gesundes Leben zu führen, ist es wichtig, regelmäßig Sport zu treiben und sich ausgewogen zu ernähren. Ärzte empfehlen, mindestens dreißig Minuten pro Tag zu gehen und fünf Portionen Obst und Gemüse zu konsumieren. Es ist auch wichtig, jede Nacht acht Stunden zu schlafen und viel Wasser zu trinken. Stress kann die Gesundheit negativ beeinflussen, deshalb ist es wichtig, Zeit zum Entspannen zu finden und Aktivitäten zu genießen, die man mag.',
    marks: 4,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Healthy living and lifestyle',
    question_data: {
      questions: [
        { question: 'How long should you walk each day?', options: ['A. 20 minutes', 'B. 30 minutes', 'C. 45 minutes'], correct: 'B' },
        { question: 'How many portions of fruit and vegetables are recommended?', options: ['A. Three', 'B. Four', 'C. Five'], correct: 'C' },
        { question: 'How many hours of sleep are recommended?', options: ['A. Seven', 'B. Eight', 'C. Nine'], correct: 'B' },
        { question: 'What can negatively affect health?', options: ['A. Exercise', 'B. Water', 'C. Stress'], correct: 'C' }
      ]
    }
  },

  // Question 40: Translation (10 marks)
  {
    question_number: 40,
    question_type: 'translation',
    title: 'Question 40: Translation',
    instructions: 'Translate these sentences into English.',
    marks: 10,
    theme: 'Theme 1: People and lifestyle',
    topic: 'Identity and relationships with others',
    question_data: {
      sentences: [
        { german: 'Meine kleine Schwester ist acht Jahre alt und sie tanzt gerne.', marks: 2, questionNumber: '40.1' },
        { german: 'Gestern haben wir Pizza in einem sehr guten italienischen Restaurant gegessen.', marks: 2, questionNumber: '40.2' },
        { german: 'Nächsten Sommer werden wir unsere Cousins in Berlin besuchen.', marks: 2, questionNumber: '40.3' },
        { german: 'Mir tut der Kopf weh, weil ich gestern Abend sehr spät gelernt habe.', marks: 2, questionNumber: '40.4' },
        { german: 'Wenn es morgen regnet, können wir nicht mit unseren Freunden an den Strand gehen.', marks: 2, questionNumber: '40.5' }
      ]
    }
  }
];

async function populateCompleteAssessments() {
  try {
    console.log('🚀 Starting Complete AQA Reading Assessment population...');

    // Define all language/tier combinations
    const languages = [
      { code: 'es', name: 'Spanish' },
      { code: 'fr', name: 'French' },
      { code: 'de', name: 'German' }
    ];

    const tiers = [
      { level: 'foundation', timeLimit: 45 },
      { level: 'higher', timeLimit: 60 }
    ];

    // Clear existing data (but keep Spanish Foundation if it exists)
    console.log('🧹 Clearing existing data...');
    await supabase.from('aqa_reading_question_responses').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aqa_reading_results').delete().neq('id', '00000000-0000-0000-0000-000000000000');
    await supabase.from('aqa_reading_assignments').delete().neq('id', '00000000-0000-0000-0000-000000000000');

    // Delete questions and assessments except Spanish Foundation
    await supabase.from('aqa_reading_questions').delete().not('assessment_id', 'in',
      `(SELECT id FROM aqa_reading_assessments WHERE language = 'es' AND level = 'foundation')`);
    await supabase.from('aqa_reading_assessments').delete().not('language', 'eq', 'es').not('level', 'eq', 'foundation');

    console.log('✅ Cleared existing data (kept Spanish Foundation)');

    // Create all language/tier combinations
    for (const lang of languages) {
      for (const tier of tiers) {
        // Skip Spanish Foundation as it already exists
        if (lang.code === 'es' && tier.level === 'foundation') {
          console.log(`⏭️  Skipping Spanish Foundation (already exists)`);
          continue;
        }

        console.log(`\n📚 Creating ${lang.name} ${tier.level} assessment...`);

        const assessment = {
          title: `AQA Reading Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Paper 1 (${lang.name})`,
          description: `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level AQA-style ${lang.name} reading assessment with 40 questions covering all GCSE themes`,
          level: tier.level,
          language: lang.code,
          identifier: 'paper-1',
          version: '1.0',
          total_questions: 40,
          time_limit_minutes: tier.timeLimit,
          is_active: true
        };

        const { data: assessmentData, error: assessmentError } = await supabase
          .from('aqa_reading_assessments')
          .insert(assessment)
          .select('id')
          .single();

        if (assessmentError) {
          console.error(`❌ Error creating ${lang.name} ${tier.level} assessment:`, assessmentError);
          continue;
        }

        console.log(`✅ Created ${lang.name} ${tier.level} assessment:`, assessmentData.id);

        // Use language-specific questions
        let questionsToUse;
        switch (lang.code) {
          case 'es':
            questionsToUse = spanishFoundationQuestions;
            break;
          case 'fr':
            questionsToUse = frenchFoundationQuestions;
            break;
          case 'de':
            questionsToUse = germanFoundationQuestions;
            break;
          default:
            questionsToUse = spanishFoundationQuestions;
        }

        const questionsWithAssessmentId = questionsToUse.map(q => ({
          ...q,
          assessment_id: assessmentData.id,
          difficulty_rating: tier.level === 'foundation' ? 3 : 4
        }));

        const { error: questionsError } = await supabase
          .from('aqa_reading_questions')
          .insert(questionsWithAssessmentId);

        if (questionsError) {
          console.error(`❌ Error inserting ${lang.name} ${tier.level} questions:`, questionsError);
          continue;
        }

        console.log(`✅ Inserted ${lang.name} ${tier.level} questions`);
      }
    }

    console.log('\n🎉 Complete AQA Reading Assessment population completed successfully!');

    // Verify all assessments were created
    const { data: allAssessments } = await supabase
      .from('aqa_reading_assessments')
      .select('language, level, identifier, title')
      .order('language, level');

    console.log('\n📋 Final assessment list:');
    allAssessments?.forEach(assessment => {
      console.log(`   ${assessment.language.toUpperCase()} ${assessment.level} - ${assessment.title}`);
    });

  } catch (error) {
    console.error('❌ Error populating assessments:', error);
  }
}

// Run the population
populateCompleteAssessments();
