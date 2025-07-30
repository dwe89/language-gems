import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Translation mappings for each question type
const translations = {
  fr: {
    // Question titles
    'La semana de Carlos': 'La semaine de Charles',
    'Tradiciones navideñas': 'Traditions de Noël',
    'Podcast sobre estilos de vida': 'Podcast sur les modes de vie',
    'Programa de televisión sobre redes sociales': 'Émission télévisée sur les réseaux sociaux',
    'Entrevista con estrella de reality show': 'Interview avec une star de télé-réalité',
    'Conversación telefónica sobre planes': 'Conversation téléphonique sur les projets',
    'Conversación en la universidad': 'Conversation à l\'université',
    'Dictado sobre el medio ambiente': 'Dictée sur l\'environnement',

    // Audio content translations
    'La semana de Carlos - audio': `Lundi, je suis allé à la salle de sport le matin. Mardi, j'ai étudié à la bibliothèque tout l'après-midi. Mercredi, je suis sorti avec mes amis au cinéma. Jeudi, j'ai travaillé à la maison toute la journée. Vendredi, je suis allé faire du shopping au centre commercial. Samedi, je me suis reposé à la maison en regardant la télévision. Dimanche, j'ai rendu visite à mes grands-parents.`,

    'Tradiciones navideñas - audio': `Conversation 1: Dans ma famille, nous dînons toujours de la dinde le soir de Noël. Ma grand-mère prépare le dîner et tous les parents viennent à la maison. Après le dîner, nous ouvrons les cadeaux sous le sapin de Noël.

Conversation 2: Nous célébrons le jour des Rois. Les enfants laissent leurs chaussures devant la porte et le matin ils trouvent des bonbons et de petits cadeaux. C'est une très belle tradition.

Conversation 3: Chez nous, nous décorons le sapin de Noël le premier dimanche de décembre. Toute la famille participe et nous mettons des lumières, des boules colorées et une étoile au sommet.`,

    'Podcast sobre estilos de vida - audio': `Présentateur: Aujourd'hui nous parlons avec trois jeunes de leurs modes de vie.

Ana: Salut, je suis Ana. Je fais de l'exercice tous les jours et je mange sainement. Je bois beaucoup d'eau et je dors huit heures par nuit.

Carlos: Moi, c'est Carlos. J'avoue que je mange trop de fast-food et je ne fais pas assez de sport. Je passe trop de temps devant l'ordinateur.

Sofia: Je m'appelle Sofia. J'essaie de maintenir un équilibre. Je fais du yoga trois fois par semaine et je cuisine des repas sains à la maison.`,

    'Programa de televisión sobre redes sociales - audio': `Présentateur: Aujourd'hui nous parlons des réseaux sociaux. Sont-ils bons ou mauvais pour les jeunes?

Invité 1: Je pense qu'ils sont très utiles pour rester en contact avec les amis et la famille.

Invité 2: Mais ils peuvent créer une dépendance. Les jeunes passent trop de temps sur leurs téléphones.

Invité 3: Ils sont excellents pour l'éducation. On peut apprendre beaucoup de choses nouvelles.

Présentateur: Et qu'en est-il de la vie privée? C'est un problème important de nos jours.`,

    'Entrevista con estrella de reality show - audio': `Intervieweur: Nous sommes ici avec Carmen, la gagnante de l'émission de télé-réalité "La Maison". Carmen, parlez-nous de votre expérience.

Carmen: C'était incroyable! Vivre avec tant de personnes différentes était un défi, mais j'ai appris beaucoup sur moi-même. Le plus difficile était d'être loin de ma famille pendant si longtemps. Mais les défis étaient amusants et j'ai fait de très bons amis. Maintenant je veux utiliser cette expérience pour aider d'autres jeunes à poursuivre leurs rêves.`,

    'Conversación telefónica sobre planes - audio': `María: Salut Ana! Comment ça va? Je t'appelle pour te parler de mes projets pour le week-end.

Ana: Salut! Raconte-moi tout. Qu'est-ce que tu as prévu?

María: Samedi matin, je vais faire du shopping avec ma sœur. L'après-midi, nous irons au cinéma voir le nouveau film d'action. Et dimanche, nous avons prévu un pique-nique dans le parc si le temps le permet.

Ana: Ça sonne fantastique! J'aimerais me joindre à vous pour le pique-nique si c'est possible.`,

    'Conversación en la universidad - audio': `Étudiant 1: Salut! Comment ça se passe avec les examens?

Étudiant 2: Très stressée, pour être honnête. J'ai cinq examens cette semaine et je n'ai pas eu assez de temps pour étudier.

Étudiant 1: Je comprends. Moi aussi j'ai beaucoup d'examens. Veux-tu qu'on étudie ensemble à la bibliothèque cet après-midi?

Étudiant 2: Ce serait génial! On pourrait réviser les mathématiques et l'histoire ensemble.`,

    'Dictado sobre el medio ambiente - audio': `Le changement climatique est l'un des problèmes les plus graves de notre époque. Nous devons recycler davantage et utiliser moins de plastique. Il est important de protéger nos océans et nos forêts pour les générations futures.`,

    // Question options translations
    'fue al gimnasio': 'went to the gym',
    'estudió en la biblioteca': 'studied at the library',
    'salió con amigos': 'went out with friends',
    'trabajó en casa': 'worked at home',
    'fue de compras': 'went shopping',
    'descansó en casa': 'rested at home',
    'visitó a los abuelos': 'visited grandparents',
    'ejercicio físico': 'physical exercise',
    'alimentación': 'diet/nutrition',
    'sueño': 'sleep',
    'hábitos nocivos': 'harmful habits',
    'hidratación': 'hydration',
    'ir de compras': 'go shopping',
    'ir al gimnasio': 'go to the gym',
    'visitar a los abuelos': 'visit grandparents',
    'ir al cine': 'go to the cinema',
    'sábado por la mañana': 'Saturday morning',
    'sábado por la tarde': 'Saturday afternoon',
    'domingo por la mañana': 'Sunday morning',
    'domingo por la tarde': 'Sunday afternoon',
    '¿Cuál es el examen más difícil para el segundo estudiante?': 'Which is the most difficult exam for the second student?',
    '¿Cuándo viene el profesor particular?': 'When does the private tutor come?',
    'Historia': 'History',
    'Matemáticas': 'Mathematics',
    'Ciencias': 'Science',
    'Literatura': 'Literature',
    'Los lunes': 'Mondays',
    'Los miércoles': 'Wednesdays',
    'Los viernes': 'Fridays',
    'Los domingos': 'Sundays'
  },

  de: {
    // Question titles
    'La semana de Carlos': 'Carlos\' Woche',
    'Tradiciones navideñas': 'Weihnachtstraditionen',
    'Podcast sobre estilos de vida': 'Podcast über Lebensstile',
    'Programa de televisión sobre redes sociales': 'Fernsehsendung über soziale Netzwerke',
    'Entrevista con estrella de reality show': 'Interview mit Reality-Show-Star',
    'Conversación telefónica sobre planes': 'Telefongespräch über Pläne',
    'Conversación en la universidad': 'Gespräch an der Universität',
    'Dictado sobre el medio ambiente': 'Diktat über die Umwelt',

    // Audio content translations
    'La semana de Carlos - audio': `Montag bin ich morgens ins Fitnessstudio gegangen. Dienstag habe ich den ganzen Nachmittag in der Bibliothek studiert. Mittwoch bin ich mit meinen Freunden ins Kino gegangen. Donnerstag habe ich den ganzen Tag zu Hause gearbeitet. Freitag bin ich im Einkaufszentrum einkaufen gegangen. Samstag habe ich mich zu Hause ausgeruht und ferngesehen. Sonntag habe ich meine Großeltern besucht.`,

    'Tradiciones navideñas - audio': `Gespräch 1: In meiner Familie essen wir immer Truthahn an Heiligabend. Meine Großmutter bereitet das Abendessen vor und alle Verwandten kommen nach Hause. Nach dem Abendessen öffnen wir die Geschenke unter dem Weihnachtsbaum.

Gespräch 2: Wir feiern den Tag der Heiligen Drei Könige. Die Kinder stellen ihre Schuhe vor die Tür und am Morgen finden sie Süßigkeiten und kleine Geschenke. Es ist eine sehr schöne Tradition.

Gespräch 3: Bei uns schmücken wir den Weihnachtsbaum am ersten Sonntag im Dezember. Die ganze Familie macht mit und wir hängen Lichter, bunte Kugeln und einen Stern an die Spitze.`,

    'Podcast sobre estilos de vida - audio': `Moderator: Heute sprechen wir mit drei jungen Menschen über ihre Lebensstile.

Ana: Hallo, ich bin Ana. Ich treibe jeden Tag Sport und esse gesund. Ich trinke viel Wasser und schlafe acht Stunden pro Nacht.

Carlos: Ich bin Carlos. Ich gebe zu, dass ich zu viel Fast Food esse und nicht genug Sport treibe. Ich verbringe zu viel Zeit vor dem Computer.

Sofia: Ich heiße Sofia. Ich versuche, ein Gleichgewicht zu halten. Ich mache dreimal pro Woche Yoga und koche gesunde Mahlzeiten zu Hause.`,

    'Programa de televisión sobre redes sociales - audio': `Moderator: Heute sprechen wir über soziale Netzwerke. Sind sie gut oder schlecht für junge Menschen?

Gast 1: Ich denke, sie sind sehr nützlich, um mit Freunden und Familie in Kontakt zu bleiben.

Gast 2: Aber sie können süchtig machen. Junge Menschen verbringen zu viel Zeit mit ihren Handys.

Gast 3: Sie sind ausgezeichnet für die Bildung. Man kann viele neue Dinge lernen.

Moderator: Und was ist mit der Privatsphäre? Das ist heutzutage ein wichtiges Problem.`,

    'Entrevista con estrella de reality show - audio': `Interviewer: Wir sind hier mit Carmen, der Gewinnerin der Reality-Show "Das Haus". Carmen, erzählen Sie uns von Ihrer Erfahrung.

Carmen: Es war unglaublich! Mit so vielen verschiedenen Menschen zu leben war eine Herausforderung, aber ich habe viel über mich selbst gelernt. Das Schwierigste war, so lange von meiner Familie getrennt zu sein. Aber die Herausforderungen machten Spaß und ich habe sehr gute Freunde gefunden. Jetzt möchte ich diese Erfahrung nutzen, um anderen jungen Menschen zu helfen, ihre Träume zu verfolgen.`,

    'Conversación telefónica sobre planes - audio': `María: Hallo Ana! Wie geht's? Ich rufe an, um dir von meinen Plänen für das Wochenende zu erzählen.

Ana: Hallo! Erzähl mir alles. Was hast du vor?

María: Samstagmorgen gehe ich mit meiner Schwester einkaufen. Nachmittags gehen wir ins Kino, um den neuen Actionfilm zu sehen. Und Sonntag haben wir ein Picknick im Park geplant, wenn das Wetter mitspielt.

Ana: Das klingt fantastisch! Ich würde gerne zum Picknick dazukommen, wenn das möglich ist.`,

    'Conversación en la universidad - audio': `Student 1: Hallo! Wie läuft es mit den Prüfungen?

Student 2: Sehr stressig, ehrlich gesagt. Ich habe diese Woche fünf Prüfungen und hatte nicht genug Zeit zum Lernen.

Student 1: Ich verstehe. Ich habe auch viele Prüfungen. Möchtest du heute Nachmittag zusammen in der Bibliothek lernen?

Student 2: Das wäre toll! Wir könnten zusammen Mathematik und Geschichte wiederholen.`,

    'Dictado sobre el medio ambiente - audio': `Der Klimawandel ist eines der schwerwiegendsten Probleme unserer Zeit. Wir müssen mehr recyceln und weniger Plastik verwenden. Es ist wichtig, unsere Ozeane und Wälder für zukünftige Generationen zu schützen.`,

    // Question options translations (same as French - using English)
    'fue al gimnasio': 'went to the gym',
    'estudió en la biblioteca': 'studied at the library',
    'salió con amigos': 'went out with friends',
    'trabajó en casa': 'worked at home',
    'fue de compras': 'went shopping',
    'descansó en casa': 'rested at home',
    'visitó a los abuelos': 'visited grandparents',
    'ejercicio físico': 'physical exercise',
    'alimentación': 'diet/nutrition',
    'sueño': 'sleep',
    'hábitos nocivos': 'harmful habits',
    'hidratación': 'hydration',
    'ir de compras': 'go shopping',
    'ir al gimnasio': 'go to the gym',
    'visitar a los abuelos': 'visit grandparents',
    'ir al cine': 'go to the cinema',
    'sábado por la mañana': 'Saturday morning',
    'sábado por la tarde': 'Saturday afternoon',
    'domingo por la mañana': 'Sunday morning',
    'domingo por la tarde': 'Sunday afternoon',
    '¿Cuál es el examen más difícil para el segundo estudiante?': 'Which is the most difficult exam for the second student?',
    '¿Cuándo viene el profesor particular?': 'When does the private tutor come?',
    'Historia': 'History',
    'Matemáticas': 'Mathematics',
    'Ciencias': 'Science',
    'Literatura': 'Literature',
    'Los lunes': 'Mondays',
    'Los miércoles': 'Wednesdays',
    'Los viernes': 'Fridays',
    'Los domingos': 'Sundays'
  }
};

async function translateListeningAssessments() {
  console.log('🌍 Starting translation of listening assessments...');

  try {
    // Get all French and German questions that need translation
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select(`
        id, title, audio_text, assessment_id, question_number,
        aqa_listening_assessments!inner(language)
      `)
      .in('aqa_listening_assessments.language', ['fr', 'de']);

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No questions need translation');
      return;
    }

    console.log(`📊 Found ${questions.length} questions to translate`);

    let successCount = 0;
    let errorCount = 0;

    for (const question of questions) {
      try {
        const language = (question as any).aqa_listening_assessments?.language;
        const translationMap = translations[language as keyof typeof translations];

        if (!translationMap) {
          console.log(`⚠️ No translations available for language: ${language}`);
          continue;
        }

        console.log(`\n🔄 Translating question: ${question.title} (${language})`);

        // Translate title
        const translatedTitle = translationMap[question.title as keyof typeof translationMap] || question.title;
        
        // Translate audio content
        const audioKey = `${question.title} - audio` as keyof typeof translationMap;
        const translatedAudioText = translationMap[audioKey] || question.audio_text;

        // Update the question
        const { error: updateError } = await supabase
          .from('aqa_listening_questions')
          .update({
            title: translatedTitle,
            audio_text: translatedAudioText
          })
          .eq('id', question.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Translated: ${question.title} → ${translatedTitle}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error translating question ${question.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Translation summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during translation:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  translateListeningAssessments()
    .then(() => {
      console.log('🎉 Translation completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { translateListeningAssessments };
