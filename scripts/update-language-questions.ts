import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function updateLanguageQuestions() {
  try {
    console.log('🚀 Starting language-specific question updates...');

    // Get all assessments
    const { data: assessments, error: assessmentError } = await supabase
      .from('aqa_reading_assessments')
      .select('id, language, level');

    if (assessmentError) {
      console.error('Error fetching assessments:', assessmentError);
      return;
    }

    console.log('Found assessments:', assessments);

    // Update French assessments
    const frenchAssessments = assessments?.filter(a => a.language === 'fr') || [];
    for (const assessment of frenchAssessments) {
      console.log(`\n🇫🇷 Updating French ${assessment.level} questions...`);
      
      // Delete existing questions
      await supabase
        .from('aqa_reading_questions')
        .delete()
        .eq('assessment_id', assessment.id);

      // Insert complete French questions (all 40 questions)
      const frenchQuestions = [
        // Questions 1-4: Letter Matching - Hobbies (4 marks)
        {
          question_number: 1,
          question_type: 'letter-matching',
          title: 'Questions 1-4: Hobbies and interests',
          instructions: 'Some French teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
          marks: 4,
          theme: 'Theme 2: Popular culture',
          topic: 'Free-time activities',
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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

      const { error: insertError } = await supabase
        .from('aqa_reading_questions')
        .insert(frenchQuestions);

      if (insertError) {
        console.error(`Error inserting French questions:`, insertError);
      } else {
        console.log(`✅ Updated French ${assessment.level} questions`);
      }
    }

    // Update German assessments
    const germanAssessments = assessments?.filter(a => a.language === 'de') || [];
    for (const assessment of germanAssessments) {
      console.log(`\n🇩🇪 Updating German ${assessment.level} questions...`);
      
      // Delete existing questions
      await supabase
        .from('aqa_reading_questions')
        .delete()
        .eq('assessment_id', assessment.id);

      // Insert complete German questions (all 40 questions)
      const germanQuestions = [
        // Questions 1-4: Letter Matching - Hobbies (4 marks)
        {
          question_number: 1,
          question_type: 'letter-matching',
          title: 'Questions 1-4: Hobbies and interests',
          instructions: 'Some German teenagers are talking about their hobbies. Which hobby does each person mention? Write the correct letter in each box.',
          marks: 4,
          theme: 'Theme 2: Popular culture',
          topic: 'Free-time activities',
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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
          assessment_id: assessment.id,
          difficulty_rating: assessment.level === 'foundation' ? 3 : 4,
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

      const { error: insertError } = await supabase
        .from('aqa_reading_questions')
        .insert(germanQuestions);

      if (insertError) {
        console.error(`Error inserting German questions:`, insertError);
      } else {
        console.log(`✅ Updated German ${assessment.level} questions`);
      }
    }

    console.log('\n🎉 Language-specific question updates completed!');

  } catch (error) {
    console.error('❌ Error updating questions:', error);
  }
}

// Run the update
updateLanguageQuestions();
