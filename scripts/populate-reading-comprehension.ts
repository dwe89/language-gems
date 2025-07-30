#!/usr/bin-env node

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// ===== REFERENCE LISTS (Keep as is) =====
// ... (Your reference lists for categories remain unchanged) ...

const sampleTasks = [
  // --- SPANISH TASKS (3) ---
  {
    title: 'Mis Tareas Semanales',
    language: 'spanish',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `En mi casa, yo ayudo mucho. Cada mañana, tengo que hacer la cama. Después del instituto, tengo que pasear al perro. Por la noche, mi tarea es poner la mesa para la cena. Los fines de semana, tengo más responsabilidades. El sábado por la mañana, ayudo a mi madre a limpiar la casa. Yo paso la aspiradora. El domingo, a veces lavo el coche con mi padre.`,
    questions: [
      {
        question: 'What chore must the speaker do every morning?',
        type: 'short-answer',
        correct_answer: ['make the bed'],
        explanation: 'The text says "Cada mañana, tengo que hacer la cama."',
        points: 1,
      },
      {
        question: 'When do they have to walk the dog?',
        type: 'short-answer',
        correct_answer: ['after school'],
        explanation: 'The text says "Después del instituto, tengo que pasear al perro."',
        points: 1,
      },
      {
        question: 'What is their chore in the evening?',
        type: 'short-answer',
        correct_answer: ['to set the table'],
        explanation: 'The text says "mi tarea es poner la mesa para la cena."',
        points: 1,
      },
      {
        question: 'When does the speaker have more responsibilities?',
        type: 'short-answer',
        correct_answer: ['on the weekends'],
        explanation: 'The text says "Los fines de semana, tengo más responsabilidades."',
        points: 1,
      },
      {
        question: 'Who do they help clean the house?',
        type: 'short-answer',
        correct_answer: ['their mother'],
        explanation: 'The text says "ayudo a mi madre a limpiar la casa."',
        points: 1,
      },
      {
        question: 'What specific cleaning chore do they do?',
        type: 'short-answer',
        correct_answer: ['vacuum'],
        explanation: 'The text says "Yo paso la aspiradora."',
        points: 1,
      },
      {
        question: 'What chore do they sometimes do on Sunday?',
        type: 'short-answer',
        correct_answer: ['wash the car'],
        explanation: 'The text says "a veces lavo el coche".',
        points: 1,
      },
      {
        question: 'What does "ayudar en casa" mean?',
        type: 'short-answer',
        correct_answer: ['to help at home'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "hacer la cama" mean?',
        type: 'short-answer',
        correct_answer: ['to make the bed'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "poner la mesa" mean?',
        type: 'short-answer',
        correct_answer: ['to set the table'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Mi Familia y las Tareas',
    language: 'spanish',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `En mi familia, todos ayudamos en casa. Mi padre saca la basura todas las noches. Mi madre es la que normalmente plancha la ropa. Mi hermana mayor barre el suelo de la cocina. Después de cenar, yo tengo que fregar los platos y mi hermana tiene que quitar la mesa. Mi hermano pequeño no tiene muchas tareas, solo tiene que dar de comer al perro.`,
    questions: [
      {
        question: 'Who helps out at home in the speaker\'s family?',
        type: 'short-answer',
        correct_answer: ['everyone'],
        explanation: 'The text says "todos ayudamos en casa."',
        points: 1,
      },
      {
        question: 'What is the father\'s chore?',
        type: 'short-answer',
        correct_answer: ['takes out the trash'],
        explanation: 'The text says "saca la basura todas las noches."',
        points: 1,
      },
      {
        question: 'Who normally irons the clothes?',
        type: 'short-answer',
        correct_answer: ['the mother'],
        explanation: 'The text says "Mi madre es la que normalmente plancha la ropa."',
        points: 1,
      },
      {
        question: 'What does the older sister sweep?',
        type: 'short-answer',
        correct_answer: ['the kitchen floor'],
        explanation: 'The text says "barre el suelo de la cocina."',
        points: 1,
      },
      {
        question: 'What is the speaker\'s chore after dinner?',
        type: 'short-answer',
        correct_answer: ['to wash the dishes'],
        explanation: 'The text says "yo tengo que fregar los platos".',
        points: 1,
      },
      {
        question: 'What is the sister\'s chore after dinner?',
        type: 'short-answer',
        correct_answer: ['to clear the table'],
        explanation: 'The text says "mi hermana tiene que quitar la mesa."',
        points: 1,
      },
      {
        question: 'What is the little brother\'s only chore?',
        type: 'short-answer',
        correct_answer: ['to feed the dog'],
        explanation: 'The text says "solo tiene que dar de comer al perro."',
        points: 1,
      },
      {
        question: 'What does "sacar la basura" mean?',
        type: 'short-answer',
        correct_answer: ['to take out the trash'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "planchar la ropa" mean?',
        type: 'short-answer',
        correct_answer: ['to iron the clothes'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "barrer el suelo" mean?',
        type: 'short-answer',
        correct_answer: ['to sweep the floor'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Mi Hermana Perezosa',
    language: 'spanish',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `¡Estoy tan enfadado! Mi hermana es muy perezosa. Yo tengo que hacer muchas tareas, pero ella no hace nada. Hoy, he tenido que tender la ropa y después doblar la ropa. También he tenido que pasear al perro. ¿Y mi hermana? Ella no hizo nada. Solo vio la televisión. No es justo. Yo ayudo en casa pero ella nunca ayuda.`,
    questions: [
      {
        question: 'How is the speaker feeling?',
        type: 'short-answer',
        correct_answer: ['very angry'],
        explanation: 'The text says "¡Estoy tan enfadado!"',
        points: 1,
      },
      {
        question: 'Why are they angry?',
        type: 'short-answer',
        correct_answer: ['because their sister is very lazy'],
        explanation: 'The text says "Mi hermana es muy perezosa."',
        points: 1,
      },
      {
        question: 'What does the sister do?',
        type: 'short-answer',
        correct_answer: ['nothing'],
        explanation: 'The text says "ella no hace nada."',
        points: 1,
      },
      {
        question: 'What was the speaker\'s first laundry-related chore?',
        type: 'short-answer',
        correct_answer: ['hang out the laundry'],
        explanation: 'The text says "he tenido que tender la ropa".',
        points: 1,
      },
      {
        question: 'What did they have to do after hanging out the laundry?',
        type: 'short-answer',
        correct_answer: ['fold the clothes'],
        explanation: 'The text says "después doblar la ropa."',
        points: 1,
      },
      {
        question: 'What other chore did they have to do?',
        type: 'short-answer',
        correct_answer: ['walk the dog'],
        explanation: 'The text says "he tenido que pasear al perro."',
        points: 1,
      },
      {
        question: 'What did the sister do instead of helping?',
        type: 'short-answer',
        correct_answer: ['she just watched television'],
        explanation: 'The text says "Ella no hizo nada. Solo vio la televisión."',
        points: 1,
      },
      {
        question: 'How does the speaker feel about the situation?',
        type: 'short-answer',
        correct_answer: ['it\'s not fair'],
        explanation: 'The text says "No es justo."',
        points: 1,
      },
      {
        question: 'What does "no hacer nada" mean?',
        type: 'short-answer',
        correct_answer: ['to do nothing'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "doblar la ropa" mean?',
        type: 'short-answer',
        correct_answer: ['to fold the clothes'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },

  // --- FRENCH TASKS (3) ---
  {
    title: 'Mes Tâches à la Maison',
    language: 'french',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `Chaque jour, je dois aider à la maison. Le matin, je dois faire le lit avant de partir à l'école. Après le dîner, je dois faire la vaisselle. Mon frère, lui, doit sortir la poubelle. Le week-end, je dois passer l'aspirateur dans ma chambre. Parfois, je dois aussi promener le chien. Je n'aime pas beaucoup les tâches, mais c'est important d'aider.`,
    questions: [
      {
        question: 'What must the speaker do every day?',
        type: 'short-answer',
        correct_answer: ['help at home'],
        explanation: 'The text says "je dois aider à la maison."',
        points: 1,
      },
      {
        question: 'What chore must they do in the morning?',
        type: 'short-answer',
        correct_answer: ['make the bed'],
        explanation: 'The text says "je dois faire le lit".',
        points: 1,
      },
      {
        question: 'What do they have to do after dinner?',
        type: 'short-answer',
        correct_answer: ['wash the dishes'],
        explanation: 'The text says "je dois faire la vaisselle."',
        points: 1,
      },
      {
        question: 'What is the brother\'s chore?',
        type: 'short-answer',
        correct_answer: ['to take out the trash'],
        explanation: 'The text says "doit sortir la poubelle."',
        points: 1,
      },
      {
        question: 'What do they have to do in their room on the weekend?',
        type: 'short-answer',
        correct_answer: ['vacuum'],
        explanation: 'The text says "je dois passer l\'aspirateur dans ma chambre."',
        points: 1,
      },
      {
        question: 'What chore do they also have to do sometimes?',
        type: 'short-answer',
        correct_answer: ['walk the dog'],
        explanation: 'The text says "je dois aussi promener le chien."',
        points: 1,
      },
      {
        question: 'How does the speaker feel about chores?',
        type: 'short-answer',
        correct_answer: ['they don\'t like them much'],
        explanation: 'The text says "Je n\'aime pas beaucoup les tâches".',
        points: 1,
      },
      {
        question: 'What does "aider à la maison" mean?',
        type: 'short-answer',
        correct_answer: ['to help at home'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "faire le lit" mean?',
        type: 'short-answer',
        correct_answer: ['to make the bed'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "faire la vaisselle" mean?',
        type: 'short-answer',
        correct_answer: ['to wash the dishes'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Les Tâches en Famille',
    language: 'french',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `Dans ma famille, nous partageons les tâches. Mon père lave la voiture le samedi. Ma mère repasse les vêtements. Moi, je mets la table avant le dîner. Ma sœur débarrasse la table après le dîner. Mon petit frère doit donner à manger au chien. Le seul qui ne fait rien, c'est le chat !`,
    questions: [
      {
        question: 'What do they do in the speaker\'s family?',
        type: 'short-answer',
        correct_answer: ['share the chores'],
        explanation: 'The text says "nous partageons les tâches."',
        points: 1,
      },
      {
        question: 'What does the father do on Saturdays?',
        type: 'short-answer',
        correct_answer: ['washes the car'],
        explanation: 'The text says "Mon père lave la voiture le samedi."',
        points: 1,
      },
      {
        question: 'What is the mother\'s chore?',
        type: 'short-answer',
        correct_answer: ['irons the clothes'],
        explanation: 'The text says "Ma mère repasse les vêtements."',
        points: 1,
      },
      {
        question: 'What does the speaker do before dinner?',
        type: 'short-answer',
        correct_answer: ['sets the table'],
        explanation: 'The text says "je mets la table avant le dîner."',
        points: 1,
      },
      {
        question: 'What does the sister do after dinner?',
        type: 'short-answer',
        correct_answer: ['clears the table'],
        explanation: 'The text says "Ma sœur débarrasse la table après le dîner."',
        points: 1,
      },
      {
        question: 'What is the little brother\'s chore?',
        type: 'short-answer',
        correct_answer: ['to feed the dog'],
        explanation: 'The text says "doit donner à manger au chien."',
        points: 1,
      },
      {
        question: 'Who is the only one that does nothing?',
        type: 'short-answer',
        correct_answer: ['the cat'],
        explanation: 'The text says "Le seul qui ne fait rien, c\'est le chat !"',
        points: 1,
      },
      {
        question: 'What does "laver la voiture" mean?',
        type: 'short-answer',
        correct_answer: ['to wash the car'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "mettre la table" mean?',
        type: 'short-answer',
        correct_answer: ['to set the table'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "ne rien faire" mean?',
        type: 'short-answer',
        correct_answer: ['to do nothing'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Le Jour du Nettoyage',
    language: 'french',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `Le samedi, c'est le jour du nettoyage. Toute la famille doit nettoyer la maison. Je dois balayer le sol dans la cuisine. Ma sœur doit passer l'aspirateur. Après le nettoyage, ma mère lave le linge. Je dois étendre le linge dehors. Plus tard, je dois plier le linge propre. C'est beaucoup de travail, mais après, la maison est très propre.`,
    questions: [
      {
        question: 'When is cleaning day?',
        type: 'short-answer',
        correct_answer: ['Saturday'],
        explanation: 'The text says "Le samedi, c\'est le jour du nettoyage."',
        points: 1,
      },
      {
        question: 'Who has to clean the house?',
        type: 'short-answer',
        correct_answer: ['the whole family'],
        explanation: 'The text says "Toute la famille doit nettoyer la maison."',
        points: 1,
      },
      {
        question: 'What is the speaker\'s chore in the kitchen?',
        type: 'short-answer',
        correct_answer: ['to sweep the floor'],
        explanation: 'The text says "Je dois balayer le sol dans la cuisine."',
        points: 1,
      },
      {
        question: 'What is the sister\'s chore?',
        type: 'short-answer',
        correct_answer: ['to vacuum'],
        explanation: 'The text says "Ma sœur doit passer l\'aspirateur."',
        points: 1,
      },
      {
        question: 'What does the mother do after the cleaning?',
        type: 'short-answer',
        correct_answer: ['washes the laundry'],
        explanation: 'The text says "ma mère lave le linge."',
        points: 1,
      },
      {
        question: 'What must the speaker do with the laundry?',
        type: 'short-answer',
        correct_answer: ['hang it out'],
        explanation: 'The text says "Je dois étendre le linge dehors."',
        points: 1,
      },
      {
        question: 'What do they have to do with the clean laundry later?',
        type: 'short-answer',
        correct_answer: ['fold it'],
        explanation: 'The text says "je dois plier le linge propre."',
        points: 1,
      },
      {
        question: 'What does "nettoyer la maison" mean?',
        type: 'short-answer',
        correct_answer: ['to clean the house'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "balayer le sol" mean?',
        type: 'short-answer',
        correct_answer: ['to sweep the floor'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "plier le linge" mean?',
        type: 'short-answer',
        correct_answer: ['to fold the clothes/laundry'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },

  // --- GERMAN TASKS (3) ---
  {
    title: 'Meine Aufgaben zu Hause',
    language: 'german',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `Ich muss im Haushalt helfen. Jeden Morgen muss ich mein Bett machen. Nach der Schule muss ich den Hund ausführen. Abends muss ich den Tisch decken. Mein Bruder muss nach dem Essen den Tisch abräumen. Am Wochenende muss ich mein Zimmer putzen und manchmal staubsaugen. Ich finde, das ist fair.`,
    questions: [
      {
        question: 'What must the speaker do?',
        type: 'short-answer',
        correct_answer: ['help at home'],
        explanation: 'The text says "Ich muss im Haushalt helfen."',
        points: 1,
      },
      {
        question: 'What is their chore every morning?',
        type: 'short-answer',
        correct_answer: ['make their bed'],
        explanation: 'The text says "muss ich mein Bett machen."',
        points: 1,
      },
      {
        question: 'What do they do after school?',
        type: 'short-answer',
        correct_answer: ['walk the dog'],
        explanation: 'The text says "muss ich den Hund ausführen."',
        points: 1,
      },
      {
        question: 'What is their chore in the evening?',
        type: 'short-answer',
        correct_answer: ['set the table'],
        explanation: 'The text says "muss ich den Tisch decken."',
        points: 1,
      },
      {
        question: 'What is the brother\'s chore?',
        type: 'short-answer',
        correct_answer: ['to clear the table after the meal'],
        explanation: 'The text says "muss nach dem Essen den Tisch abräumen."',
        points: 1,
      },
      {
        question: 'What two chores do they do on the weekend?',
        type: 'gap-fill',
        correct_answer: ['clean their room', 'sometimes vacuum'],
        explanation: 'The text says "muss ich mein Zimmer putzen und manchmal staubsaugen."',
        points: 2,
      },
      {
        question: 'What is the speaker\'s opinion on the chores?',
        type: 'short-answer',
        correct_answer: ['they find it fair'],
        explanation: 'The text says "Ich finde, das ist fair."',
        points: 1,
      },
      {
        question: 'What does "das Bett machen" mean?',
        type: 'short-answer',
        correct_answer: ['to make the bed'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "den Tisch decken" mean?',
        type: 'short-answer',
        correct_answer: ['to set the table'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "staubsaugen" mean?',
        type: 'short-answer',
        correct_answer: ['to vacuum'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Familienarbeit',
    language: 'german',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `In unserer Familie müssen alle helfen. Mein Vater muss am Samstag das Auto waschen. Meine Mutter muss die Wäsche aufhängen und später die Wäsche zusammenlegen. Meine Schwester muss den Müll rausbringen. Ich muss den Hund füttern und Geschirr spülen. Der einzige, der nichts tun muss, ist unser kleiner Bruder. Er ist erst zwei Jahre alt.`,
    questions: [
      {
        question: 'What must everyone in the family do?',
        type: 'short-answer',
        correct_answer: ['help'],
        explanation: 'The text says "müssen alle helfen."',
        points: 1,
      },
      {
        question: 'What is the father\'s chore?',
        type: 'short-answer',
        correct_answer: ['wash the car'],
        explanation: 'The text says "muss am Samstag das Auto waschen."',
        points: 1,
      },
      {
        question: 'What are the mother\'s two laundry chores?',
        type: 'gap-fill',
        correct_answer: ['hang out the laundry', 'fold the clothes'],
        explanation: 'The text says "die Wäsche aufhängen und später die Wäsche zusammenlegen."',
        points: 2,
      },
      {
        question: 'What must the sister do?',
        type: 'short-answer',
        correct_answer: ['take out the trash'],
        explanation: 'The text says "muss den Müll rausbringen."',
        points: 1,
      },
      {
        question: 'What are the speaker\'s two chores?',
        type: 'gap-fill',
        correct_answer: ['feed the dog', 'wash the dishes'],
        explanation: 'The text says "muss den Hund füttern und Geschirr spülen."',
        points: 2,
      },
      {
        question: 'Who is the only one who has to do nothing?',
        type: 'short-answer',
        correct_answer: ['the little brother'],
        explanation: 'The text says "der einzige, der nichts tun muss, ist unser kleiner Bruder."',
        points: 1,
      },
      {
        question: 'Why doesn\'t the little brother have chores?',
        type: 'short-answer',
        correct_answer: ['he is only two years old'],
        explanation: 'The text says "Er ist erst zwei Jahre alt."',
        points: 1,
      },
      {
        question: 'What does "das Auto waschen" mean?',
        type: 'short-answer',
        correct_answer: ['to wash the car'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "nichts tun" mean?',
        type: 'short-answer',
        correct_answer: ['to do nothing'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "Geschirr spülen" mean?',
        type: 'short-answer',
        correct_answer: ['to wash the dishes'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  },
  {
    title: 'Mein Bruder Tut Nichts',
    language: 'german',
    curriculum_level: 'ks3',
    category: 'home_local_area',
    subcategory: 'chores',
    difficulty: 'foundation',
    content: `Ich muss so viel im Haushalt helfen, aber mein Bruder tut nichts. Gestern musste ich den Boden fegen. Danach musste ich staubsaugen. Ich musste auch den Hund füttern. Meine Mutter bat mich, die Kleidung zu bügeln. Und was hat mein Bruder gemacht? Nichts! Er hat nur Videospiele gespielt. Das ist nicht fair. Ich helfe immer, er hilft nie.`,
    questions: [
      {
        question: 'What does the speaker have to do a lot of?',
        type: 'short-answer',
        correct_answer: ['help at home'],
        explanation: 'The text says "muss so viel im Haushalt helfen".',
        points: 1,
      },
      {
        question: 'What does the brother do?',
        type: 'short-answer',
        correct_answer: ['nothing'],
        explanation: 'The text says "mein Bruder tut nichts."',
        points: 1,
      },
      {
        question: 'What was the speaker\'s first chore yesterday?',
        type: 'short-answer',
        correct_answer: ['sweep the floor'],
        explanation: 'The text says "musste ich den Boden fegen."',
        points: 1,
      },
      {
        question: 'What did they have to do after that?',
        type: 'short-answer',
        correct_answer: ['vacuum'],
        explanation: 'The text says "Danach musste ich staubsaugen."',
        points: 1,
      },
      {
        question: 'What was their other chore?',
        type: 'short-answer',
        correct_answer: ['feed the dog'],
        explanation: 'The text says "musste auch den Hund füttern."',
        points: 1,
      },
      {
        question: 'What did their mother ask them to do?',
        type: 'short-answer',
        correct_answer: ['to iron the clothes'],
        explanation: 'The text says "bat mich, die Kleidung zu bügeln."',
        points: 1,
      },
      {
        question: 'What did the brother do instead of helping?',
        type: 'short-answer',
        correct_answer: ['played video games'],
        explanation: 'The text says "Er hat nur Videospiele gespielt."',
        points: 1,
      },
      {
        question: 'How does the speaker feel about the situation?',
        type: 'short-answer',
        correct_answer: ['it\'s not fair'],
        explanation: 'The text says "Das ist nicht fair."',
        points: 1,
      },
      {
        question: 'What does "den Boden fegen" mean?',
        type: 'short-answer',
        correct_answer: ['to sweep the floor'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      },
      {
        question: 'What does "die Kleidung bügeln" mean?',
        type: 'short-answer',
        correct_answer: ['to iron the clothes'],
        explanation: 'Vocabulary from the text.',
        points: 1,
      }
    ]
  }
];

async function populateReadingComprehension() {
  console.log('🚀 Starting to populate reading comprehension tasks...');

  try {
    for (const taskData of sampleTasks) {
      console.log(`📝 Creating task: ${taskData.title}`);

      // Create the task
      const { data: task, error: taskError } = await supabase
        .from('reading_comprehension_tasks')
        .insert({
          title: taskData.title,
          language: taskData.language,
          curriculum_level: taskData.curriculum_level,
          exam_board: taskData.exam_board,
          theme_topic: taskData.theme_topic,
          category: taskData.category,
          subcategory: taskData.subcategory,
          difficulty: taskData.difficulty,
          content: taskData.content,
          word_count: taskData.content.split(' ').length,
          estimated_reading_time: Math.ceil(taskData.content.split(' ').length / 200),
        })
        .select()
        .single();

      if (taskError) {
        console.error(`❌ Error creating task ${taskData.title}:`, taskError);
        continue;
      }

      console.log(`✅ Created task: ${task.id}`);

      // Create questions
      const questionsWithTaskId = taskData.questions.map((q, index) => ({
        task_id: task.id,
        question_number: index + 1,
        question: q.question,
        type: q.type,
        options: q.options || null,
        correct_answer: q.correct_answer,
        points: q.points,
        explanation: q.explanation,
      }));

      const { data: questions, error: questionsError } = await supabase
        .from('reading_comprehension_questions')
        .insert(questionsWithTaskId)
        .select();

      if (questionsError) {
        console.error(`❌ Error creating questions for ${taskData.title}:`, questionsError);
        continue;
      }

      console.log(`✅ Created ${questions.length} questions for ${taskData.title}`);
    }

    console.log('🎉 Successfully populated reading comprehension tasks!');
  } catch (error) {
    console.error('❌ Error populating reading comprehension:', error);
  }
}

// Run the population script
populateReadingComprehension();