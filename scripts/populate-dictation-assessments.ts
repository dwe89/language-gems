import { createClient } from '@supabase/supabase-js';
import { GeminiTTSService } from '../src/services/geminiTTS';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Sample dictation sentences for each language and tier
const DICTATION_SENTENCES = {
  es: {
    foundation: [
      {
        sentence: "Me gusta mucho la música española.",
        theme: "Theme 2: Popular culture",
        topic: "Free-time activities"
      },
      {
        sentence: "Mi familia vive en una casa grande con jardín.",
        theme: "Theme 1: People and lifestyle",
        topic: "Identity and relationships with others"
      },
      {
        sentence: "Todos los días desayuno cereales con leche.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "El año pasado fui de vacaciones a Barcelona.",
        theme: "Theme 2: Popular culture",
        topic: "Travel and tourism, including places of interest"
      }
    ],
    higher: [
      {
        sentence: "A pesar de las dificultades económicas, seguimos adelante con optimismo.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      },
      {
        sentence: "La tecnología moderna ha transformado completamente nuestra manera de comunicarnos.",
        theme: "Theme 3: Communication and the world around us",
        topic: "Media and technology"
      },
      {
        sentence: "Durante las fiestas navideñas, toda la familia se reúne para celebrar juntos.",
        theme: "Theme 2: Popular culture",
        topic: "Customs, festivals and celebrations"
      },
      {
        sentence: "Es fundamental que los jóvenes desarrollen hábitos saludables desde temprana edad.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "El cambio climático representa uno de los mayores desafíos de nuestra época.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      }
    ]
  },
  fr: {
    foundation: [
      {
        sentence: "J'aime beaucoup écouter de la musique française.",
        theme: "Theme 2: Popular culture",
        topic: "Free-time activities"
      },
      {
        sentence: "Ma famille habite dans une grande maison avec un jardin.",
        theme: "Theme 1: People and lifestyle",
        topic: "Identity and relationships with others"
      },
      {
        sentence: "Tous les matins je prends des céréales avec du lait.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "L'année dernière je suis allé en vacances à Paris.",
        theme: "Theme 2: Popular culture",
        topic: "Travel and tourism, including places of interest"
      }
    ],
    higher: [
      {
        sentence: "Malgré les difficultés économiques, nous continuons avec optimisme.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      },
      {
        sentence: "La technologie moderne a complètement transformé notre façon de communiquer.",
        theme: "Theme 3: Communication and the world around us",
        topic: "Media and technology"
      },
      {
        sentence: "Pendant les fêtes de Noël, toute la famille se réunit pour célébrer ensemble.",
        theme: "Theme 2: Popular culture",
        topic: "Customs, festivals and celebrations"
      },
      {
        sentence: "Il est essentiel que les jeunes développent des habitudes saines dès le plus jeune âge.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "Le changement climatique représente l'un des plus grands défis de notre époque.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      }
    ]
  },
  de: {
    foundation: [
      {
        sentence: "Ich höre sehr gerne deutsche Musik.",
        theme: "Theme 2: Popular culture",
        topic: "Free-time activities"
      },
      {
        sentence: "Meine Familie wohnt in einem großen Haus mit Garten.",
        theme: "Theme 1: People and lifestyle",
        topic: "Identity and relationships with others"
      },
      {
        sentence: "Jeden Morgen esse ich Müsli mit Milch zum Frühstück.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "Letztes Jahr bin ich nach Berlin in den Urlaub gefahren.",
        theme: "Theme 2: Popular culture",
        topic: "Travel and tourism, including places of interest"
      }
    ],
    higher: [
      {
        sentence: "Trotz der wirtschaftlichen Schwierigkeiten gehen wir optimistisch voran.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      },
      {
        sentence: "Die moderne Technologie hat unsere Art zu kommunizieren völlig verändert.",
        theme: "Theme 3: Communication and the world around us",
        topic: "Media and technology"
      },
      {
        sentence: "Während der Weihnachtsferien kommt die ganze Familie zusammen, um gemeinsam zu feiern.",
        theme: "Theme 2: Popular culture",
        topic: "Customs, festivals and celebrations"
      },
      {
        sentence: "Es ist wichtig, dass junge Menschen von klein auf gesunde Gewohnheiten entwickeln.",
        theme: "Theme 1: People and lifestyle",
        topic: "Healthy living and lifestyle"
      },
      {
        sentence: "Der Klimawandel stellt eine der größten Herausforderungen unserer Zeit dar.",
        theme: "Theme 3: Communication and the world around us",
        topic: "The environment and where people live"
      }
    ]
  }
};

async function createAssessment(language: string, level: 'foundation' | 'higher') {
  console.log(`Creating ${language} ${level} dictation assessment...`);

  const timeLimit = level === 'foundation' ? 15 : 20;
  const questionCount = level === 'foundation' ? 4 : 5;

  const { data: assessment, error: assessmentError } = await supabase
    .from('aqa_dictation_assessments')
    .insert({
      title: `${language.toUpperCase()} Dictation Assessment - ${level.charAt(0).toUpperCase() + level.slice(1)} Tier`,
      description: `GCSE-style dictation practice with ${questionCount} sentences in ${language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'German'}`,
      level,
      language,
      identifier: 'paper-1',
      version: '1.0',
      total_questions: questionCount,
      time_limit_minutes: timeLimit,
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

async function createQuestionsWithAudio(assessmentId: string, language: string, level: 'foundation' | 'higher') {
  console.log(`Creating questions with audio for ${language} ${level}...`);
  
  const sentences = DICTATION_SENTENCES[language as keyof typeof DICTATION_SENTENCES][level];
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
      } else {
        console.log(`✅ Question ${questionNumber} created successfully`);
      }
      
      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
      
    } catch (error) {
      console.error(`Error generating audio for question ${questionNumber}:`, error);
    }
  }
}

async function populateDictationAssessments() {
  console.log('🎯 Starting dictation assessment population...');
  
  const languages = ['es', 'fr', 'de'];
  const levels: ('foundation' | 'higher')[] = ['foundation', 'higher'];
  
  for (const language of languages) {
    for (const level of levels) {
      try {
        console.log(`\n📝 Processing ${language} ${level}...`);
        
        // Check if assessment already exists
        const { data: existing } = await supabase
          .from('aqa_dictation_assessments')
          .select('id')
          .eq('language', language)
          .eq('level', level)
          .eq('identifier', 'paper-1')
          .single();
        
        if (existing) {
          console.log(`⏭️  Assessment already exists for ${language} ${level}, skipping...`);
          continue;
        }
        
        // Create assessment
        const assessment = await createAssessment(language, level);
        if (!assessment) {
          console.error(`Failed to create assessment for ${language} ${level}`);
          continue;
        }
        
        // Create questions with audio
        await createQuestionsWithAudio(assessment.id, language, level);
        
        console.log(`✅ Completed ${language} ${level} assessment`);
        
      } catch (error) {
        console.error(`Error processing ${language} ${level}:`, error);
      }
    }
  }
  
  console.log('\n🎉 Dictation assessment population completed!');
}

// Run the script
if (require.main === module) {
  populateDictationAssessments()
    .then(() => {
      console.log('Script completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Script failed:', error);
      process.exit(1);
    });
}

export { populateDictationAssessments };
