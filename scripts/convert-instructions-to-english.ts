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

// Mapping of Spanish instructions to English instructions
const instructionTranslations: Record<string, string> = {
  // Letter matching
  'Escucha lo que dice Carlos sobre su semana. Elige la letra correcta para cada día.': 
    'Listen to what Carlos says about his week. Choose the correct letter for each day.',
  
  // Multiple choice
  'Escucha las conversaciones sobre tradiciones navideñas y elige la respuesta correcta.': 
    'Listen to the conversations about Christmas traditions and choose the correct answer.',
  
  // Lifestyle grid
  'Escucha el podcast donde tres personas hablan de sus estilos de vida. Para cada persona, elige qué aspecto es bueno y cuál necesita mejorar.': 
    'Listen to the podcast where three people talk about their lifestyles. For each person, choose which aspect is good and which needs improvement.',
  
  // Opinion rating
  'Escucha el programa donde hablan sobre las redes sociales. Para cada aspecto, decide si la opinión es positiva (P), negativa (N), o ambas (P+N).': 
    'Listen to the programme where they talk about social media. For each aspect, decide if the opinion is positive (P), negative (N), or both (P+N).',
  
  // Open response
  'Escucha la entrevista y responde a las preguntas en inglés.': 
    'Listen to the interview and answer the questions in English.',
  
  // Activity timing
  'Escucha la conversación telefónica sobre planes para el fin de semana. Para cada actividad, escribe la hora.': 
    'Listen to the phone conversation about weekend plans. For each activity, write the time.',
  
  // Multi-part
  'Escucha la conversación en la universidad y responde a las dos partes de la pregunta.': 
    'Listen to the conversation at the university and answer both parts of the question.',
  
  // Dictation
  'Escucha las frases sobre el medio ambiente y escríbelas exactamente como las oyes.': 
    'Listen to the sentences about the environment and write them exactly as you hear them.',
  
  // Additional common patterns
  'Escucha': 'Listen to',
  'Elige la letra correcta': 'Choose the correct letter',
  'Elige la respuesta correcta': 'Choose the correct answer',
  'Responde a las preguntas': 'Answer the questions',
  'Para cada': 'For each',
  'Decide si': 'Decide if',
  'Escribe': 'Write'
};

async function convertInstructionsToEnglish() {
  console.log('🔄 Converting listening assessment instructions to English...');
  
  try {
    // Get all questions with Spanish instructions
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select('id, title, instructions, question_type')
      .order('question_number');

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No questions found');
      return;
    }

    console.log(`📊 Found ${questions.length} questions to process`);

    let successCount = 0;
    let errorCount = 0;
    let skippedCount = 0;

    for (const question of questions) {
      try {
        console.log(`\n🎯 Processing: ${question.title}`);
        console.log(`📝 Current instruction: ${question.instructions}`);

        // Check if we have a direct translation
        let englishInstruction = instructionTranslations[question.instructions];
        
        if (!englishInstruction) {
          // Try to find a partial match or create a generic translation
          if (question.instructions.includes('Escucha')) {
            // Create a generic English instruction based on question type
            switch (question.question_type) {
              case 'letter-matching':
                englishInstruction = 'Listen to the audio and choose the correct letter for each item.';
                break;
              case 'multiple-choice':
                englishInstruction = 'Listen to the audio and choose the correct answer.';
                break;
              case 'lifestyle-grid':
                englishInstruction = 'Listen to the audio and complete the grid with the appropriate information.';
                break;
              case 'opinion-rating':
                englishInstruction = 'Listen to the audio and decide if each opinion is positive (P), negative (N), or both (P+N).';
                break;
              case 'open-response':
                englishInstruction = 'Listen to the audio and answer the questions in English.';
                break;
              case 'activity-timing':
                englishInstruction = 'Listen to the audio and write the time for each activity.';
                break;
              case 'multi-part':
                englishInstruction = 'Listen to the audio and answer both parts of the question.';
                break;
              case 'dictation':
                englishInstruction = 'Listen to the sentences and write them exactly as you hear them.';
                break;
              default:
                englishInstruction = 'Listen to the audio and complete the task.';
            }
          } else {
            console.log('⚠️ No translation found, skipping...');
            skippedCount++;
            continue;
          }
        }

        console.log(`✅ New instruction: ${englishInstruction}`);

        // Update the database
        const { error: updateError } = await supabase
          .from('aqa_listening_questions')
          .update({ instructions: englishInstruction })
          .eq('id', question.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Successfully updated: ${question.title}`);
        successCount++;

      } catch (error) {
        console.error(`❌ Error processing question ${question.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Instruction conversion summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`⚠️ Skipped: ${skippedCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during instruction conversion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  convertInstructionsToEnglish()
    .then(() => {
      console.log('🎉 Instruction conversion completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { convertInstructionsToEnglish };
