import { createClient } from '@supabase/supabase-js';
import { GeminiTTSService } from '../src/services/geminiTTS';
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

// Language configurations
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 15, questionCount: 4 },
  { level: 'higher', timeLimit: 20, questionCount: 5 }
];

// Extended dictation sentences for generating multiple papers
const DICTATION_SENTENCES = {
  es: {
    foundation: [
      // Paper 1 sentences (existing)
      { sentence: "Me gusta mucho la música española.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mi familia vive en una casa grande con jardín.", theme: "Theme 1: People and lifestyle", topic: "Identity and relationships with others" },
      { sentence: "Todos los días desayuno cereales con leche.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "El año pasado fui de vacaciones a Barcelona.", theme: "Theme 2: Popular culture", topic: "Travel and tourism, including places of interest" },
      
      // Paper 2+ sentences (new)
      { sentence: "Los fines de semana juego al fútbol con mis amigos.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mi hermana mayor estudia medicina en la universidad.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Para mantenerme sano como frutas y verduras.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Durante las vacaciones de verano visitamos Madrid.", theme: "Theme 3: Communication and the world around us", topic: "Travel and tourism, including places of interest" },
      
      // Paper 3+ sentences
      { sentence: "Mi deporte favorito es la natación porque es divertido.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mis padres trabajan en una oficina del centro.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Es importante beber mucha agua todos los días.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Me encanta viajar y conocer lugares nuevos.", theme: "Theme 3: Communication and the world around us", topic: "Travel and tourism, including places of interest" },
      
      // Paper 4+ sentences
      { sentence: "Por las tardes veo películas en la televisión.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mi abuelo es muy simpático y cuenta historias divertidas.", theme: "Theme 1: People and lifestyle", topic: "Identity and relationships with others" },
      { sentence: "Hago ejercicio tres veces por semana en el gimnasio.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "El próximo año quiero visitar Valencia con mi familia.", theme: "Theme 3: Communication and the world around us", topic: "Travel and tourism, including places of interest" }
    ],
    higher: [
      // Paper 1 sentences (existing)
      { sentence: "A pesar de las dificultades económicas, seguimos adelante con optimismo.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "La tecnología moderna ha transformado completamente nuestra manera de comunicarnos.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "Durante las fiestas navideñas, toda la familia se reúne para celebrar juntos.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "Es fundamental que los jóvenes desarrollen hábitos saludables desde temprana edad.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "El cambio climático representa uno de los mayores desafíos de nuestra época.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      
      // Paper 2+ sentences (new)
      { sentence: "Las redes sociales han revolucionado la forma en que compartimos información.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "La educación superior requiere dedicación y esfuerzo constante para alcanzar el éxito.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Los festivales tradicionales mantienen vivas las costumbres culturales de cada región.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "La contaminación atmosférica afecta gravemente la calidad de vida urbana.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "Una alimentación equilibrada contribuye significativamente al bienestar físico y mental.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" }
    ]
  },
  fr: {
    foundation: [
      // Paper 1 sentences (existing)
      { sentence: "J'aime beaucoup écouter de la musique française.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Ma famille habite dans une grande maison avec un jardin.", theme: "Theme 1: People and lifestyle", topic: "Identity and relationships with others" },
      { sentence: "Tous les matins je prends des céréales avec du lait.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "L'année dernière je suis allé en vacances à Paris.", theme: "Theme 2: Popular culture", topic: "Travel and tourism, including places of interest" },
      
      // Paper 2+ sentences (new)
      { sentence: "Le weekend je joue au tennis avec mes copains.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mon frère aîné étudie l'informatique à l'université.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Pour rester en forme je mange beaucoup de légumes.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Pendant les vacances d'été nous visitons la Bretagne.", theme: "Theme 3: Communication and the world around us", topic: "Travel and tourism, including places of interest" }
    ],
    higher: [
      // Paper 1 sentences (existing)
      { sentence: "Malgré les difficultés économiques, nous continuons avec optimisme.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "La technologie moderne a complètement transformé notre façon de communiquer.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "Pendant les fêtes de Noël, toute la famille se réunit pour célébrer ensemble.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "Il est essentiel que les jeunes développent des habitudes saines dès le plus jeune âge.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Le changement climatique représente l'un des plus grands défis de notre époque.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      
      // Paper 2+ sentences (new)
      { sentence: "Les médias sociaux ont révolutionné notre manière de partager l'information.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "L'enseignement supérieur exige une discipline rigoureuse pour atteindre l'excellence académique.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Les traditions culturelles françaises se transmettent de génération en génération.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "La pollution urbaine constitue un défi majeur pour les villes modernes.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "Une alimentation équilibrée est fondamentale pour maintenir une bonne santé.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" }
    ]
  },
  de: {
    foundation: [
      // Paper 1 sentences (existing)
      { sentence: "Ich höre sehr gerne deutsche Musik.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Meine Familie wohnt in einem großen Haus mit Garten.", theme: "Theme 1: People and lifestyle", topic: "Identity and relationships with others" },
      { sentence: "Jeden Morgen esse ich Müsli mit Milch zum Frühstück.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Letztes Jahr bin ich nach Berlin in den Urlaub gefahren.", theme: "Theme 2: Popular culture", topic: "Travel and tourism, including places of interest" },
      
      // Paper 2+ sentences (new)
      { sentence: "Am Wochenende spiele ich Fußball mit meinen Freunden.", theme: "Theme 2: Popular culture", topic: "Free-time activities" },
      { sentence: "Mein älterer Bruder studiert Medizin an der Universität.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Um gesund zu bleiben esse ich viel Obst und Gemüse.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "In den Sommerferien besuchen wir München und die Alpen.", theme: "Theme 3: Communication and the world around us", topic: "Travel and tourism, including places of interest" }
    ],
    higher: [
      // Paper 1 sentences (existing)
      { sentence: "Trotz der wirtschaftlichen Schwierigkeiten gehen wir optimistisch voran.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "Die moderne Technologie hat unsere Art zu kommunizieren völlig verändert.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "Während der Weihnachtsferien kommt die ganze Familie zusammen, um gemeinsam zu feiern.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "Es ist wichtig, dass junge Menschen von klein auf gesunde Gewohnheiten entwickeln.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" },
      { sentence: "Der Klimawandel stellt eine der größten Herausforderungen unserer Zeit dar.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      
      // Paper 2+ sentences (new)
      { sentence: "Die sozialen Medien haben die Art revolutioniert, wie wir Informationen austauschen.", theme: "Theme 3: Communication and the world around us", topic: "Media and technology" },
      { sentence: "Die Hochschulbildung erfordert Disziplin und kontinuierliche Anstrengung für den Erfolg.", theme: "Theme 1: People and lifestyle", topic: "Education and work" },
      { sentence: "Deutsche Traditionen werden von Generation zu Generation weitergegeben.", theme: "Theme 2: Popular culture", topic: "Customs, festivals and celebrations" },
      { sentence: "Die Luftverschmutzung beeinträchtigt erheblich die Lebensqualität in Großstädten.", theme: "Theme 3: Communication and the world around us", topic: "The environment and where people live" },
      { sentence: "Eine ausgewogene Ernährung trägt wesentlich zum körperlichen und geistigen Wohlbefinden bei.", theme: "Theme 1: People and lifestyle", topic: "Healthy living and lifestyle" }
    ]
  }
};

async function getNextPaperNumber(language: string, level: string): Promise<number> {
  const { data: existingAssessments } = await supabase
    .from('aqa_dictation_assessments')
    .select('identifier')
    .eq('language', language)
    .eq('level', level)
    .like('identifier', 'paper-%');

  if (!existingAssessments || existingAssessments.length === 0) {
    return 1;
  }

  // Extract paper numbers and find the highest
  const paperNumbers = existingAssessments
    .map(assessment => {
      const match = assessment.identifier.match(/paper-(\d+)/);
      return match ? parseInt(match[1]) : 0;
    })
    .filter(num => num > 0);

  return Math.max(...paperNumbers) + 1;
}

async function createDictationAssessment(language: string, level: 'foundation' | 'higher', paperNumber: number) {
  console.log(`Creating ${language} ${level} dictation assessment paper-${paperNumber}...`);

  const tier = tiers.find(t => t.level === level)!;
  const languageName = languages.find(l => l.code === language)?.name || language;

  const { data: assessment, error: assessmentError } = await supabase
    .from('aqa_dictation_assessments')
    .insert({
      title: `${languageName} Dictation Assessment - ${level.charAt(0).toUpperCase() + level.slice(1)} Paper ${paperNumber}`,
      description: `GCSE-style dictation practice with ${tier.questionCount} sentences in ${languageName}`,
      level,
      language,
      identifier: `paper-${paperNumber}`,
      version: '1.0',
      total_questions: tier.questionCount,
      time_limit_minutes: tier.timeLimit,
      is_active: true
    })
    .select()
    .single();

  if (assessmentError) {
    console.error('Error creating assessment:', assessmentError);
    return null;
  }

  return assessment;
}

async function createQuestionsWithAudio(
  assessmentId: string, 
  language: string, 
  level: 'foundation' | 'higher', 
  paperNumber: number
) {
  console.log(`Creating questions with audio for ${language} ${level} paper-${paperNumber}...`);
  
  const allSentences = DICTATION_SENTENCES[language as keyof typeof DICTATION_SENTENCES][level];
  const tier = tiers.find(t => t.level === level)!;
  
  // Calculate starting index based on paper number
  const startIndex = (paperNumber - 1) * tier.questionCount;
  const sentences = allSentences.slice(startIndex, startIndex + tier.questionCount);
  
  if (sentences.length < tier.questionCount) {
    console.error(`❌ Not enough sentences for ${language} ${level} paper-${paperNumber}. Need ${tier.questionCount}, have ${sentences.length}`);
    return false;
  }
  
  const ttsService = new GeminiTTSService(false); // Use Flash model for cost efficiency
  
  for (let i = 0; i < sentences.length; i++) {
    const sentence = sentences[i];
    const questionNumber = i + 1;
    
    console.log(`Generating audio for question ${questionNumber}: "${sentence.sentence}"`);
    
    try {
      // Generate dual-speed audio
      const audioUrls = await ttsService.generateDictationAudio(
        sentence.sentence,
        language,
        `${assessmentId}_q${questionNumber}`,
        questionNumber
      );
      
      // Insert question with audio URLs
      const { error: questionError } = await supabase
        .from('aqa_dictation_questions')
        .insert({
          assessment_id: assessmentId,
          question_number: questionNumber,
          sentence_text: sentence.sentence,
          audio_url_normal: audioUrls.normalUrl,
          audio_url_very_slow: audioUrls.verySlowUrl,
          marks: 1,
          theme: sentence.theme,
          topic: sentence.topic,
          tts_config: {
            language,
            voiceName: language === 'es' ? 'Puck' : language === 'fr' ? 'Puck' : 'Puck',
            pace: 'slow'
          },
          difficulty_rating: level === 'foundation' ? 2 : 4
        });

      if (questionError) {
        console.error(`Error creating question ${questionNumber}:`, questionError);
        return false;
      } else {
        console.log(`✅ Question ${questionNumber} created successfully`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error generating audio for question ${questionNumber}:`, error);
      return false;
    }
  }
  
  return true;
}

// Main function to generate new dictation papers
async function generateDictationPapers() {
  try {
    console.log('🚀 Starting new dictation paper generation...');

    for (const language of languages) {
      for (const tier of tiers) {
        console.log(`\n📝 Processing ${language.name} ${tier.level}...`);

        // Get the next paper number
        const nextPaperNumber = await getNextPaperNumber(language.code, tier.level);
        const identifier = `paper-${nextPaperNumber}`;

        console.log(`   Next paper: ${identifier}`);

        // Create the assessment
        const assessment = await createDictationAssessment(language.code, tier.level as 'foundation' | 'higher', nextPaperNumber);
        if (!assessment) {
          console.error(`❌ Failed to create assessment for ${language.name} ${tier.level}`);
          continue;
        }

        console.log(`   ✅ Created assessment: ${assessment.id}`);

        // Create questions with audio
        const success = await createQuestionsWithAudio(assessment.id, language.code, tier.level as 'foundation' | 'higher', nextPaperNumber);
        
        if (!success) {
          console.error(`❌ Failed to create questions for ${language.name} ${tier.level}`);
          // Clean up the assessment if questions failed
          await supabase
            .from('aqa_dictation_assessments')
            .delete()
            .eq('id', assessment.id);
          continue;
        }

        console.log(`   ✅ Created ${tier.questionCount} questions with dual-speed audio`);
        console.log(`   🎯 ${language.name} ${tier.level} ${identifier} completed successfully!`);
      }
    }

    console.log('\n🎉 New dictation paper generation completed!');
    console.log('\n📊 Summary:');

    // Show final count
    for (const language of languages) {
      for (const tier of tiers) {
        const { data: assessments } = await supabase
          .from('aqa_dictation_assessments')
          .select('identifier')
          .eq('language', language.code)
          .eq('level', tier.level)
          .like('identifier', 'paper-%');

        console.log(`   ${language.name} ${tier.level}: ${assessments?.length || 0} papers available`);
      }
    }

  } catch (error) {
    console.error('❌ Error generating new dictation papers:', error);
  }
}

// Run the script
if (require.main === module) {
  generateDictationPapers()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { generateDictationPapers };
