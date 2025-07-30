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

// Translation mappings for question options to English
const optionTranslations: Record<string, string> = {
  // Q1 Carlos's week options
  'fue al gimnasio': 'went to the gym',
  'estudió en la biblioteca': 'studied at the library',
  'salió con amigos': 'went out with friends',
  'trabajó en casa': 'worked at home',
  'fue de compras': 'went shopping',
  'descansó en casa': 'rested at home',
  'visitó a los abuelos': 'visited grandparents',
  
  // Q3 Lifestyle aspects
  'ejercicio físico': 'physical exercise',
  'alimentación': 'diet/nutrition',
  'sueño': 'sleep',
  'hábitos nocivos': 'harmful habits',
  'hidratación': 'hydration',
  
  // Q6 Activities
  'ir de compras': 'go shopping',
  'ir al gimnasio': 'go to the gym',
  'visitar a los abuelos': 'visit grandparents',
  'ir al cine': 'go to the cinema',
  
  // Q6 Time options
  'sábado por la mañana': 'Saturday morning',
  'sábado por la tarde': 'Saturday afternoon',
  'domingo por la mañana': 'Sunday morning',
  'domingo por la tarde': 'Sunday afternoon',
  
  // Q7 University questions
  'Historia': 'History',
  'Matemáticas': 'Mathematics',
  'Ciencias': 'Science',
  'Literatura': 'Literature',
  'Los lunes': 'Mondays',
  'Los miércoles': 'Wednesdays',
  'Los viernes': 'Fridays',
  'Los domingos': 'Sundays'
};

// Question text translations
const questionTranslations: Record<string, string> = {
  '¿Cuál es el examen más difícil para el segundo estudiante?': 'Which is the most difficult exam for the second student?',
  '¿Cuándo viene el profesor particular?': 'When does the private tutor come?'
};

async function updateQuestionOptionsToEnglish() {
  console.log('🔄 Starting update of question options to English...');

  try {
    // Get all questions that need option updates
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select('id, title, question_data, question_number');

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No questions found');
      return;
    }

    console.log(`📊 Found ${questions.length} questions to check`);

    let successCount = 0;
    let errorCount = 0;

    for (const question of questions) {
      try {
        let questionData = question.question_data;
        let hasChanges = false;

        if (!questionData) {
          continue;
        }

        // Update options array if it exists
        if (questionData.options && Array.isArray(questionData.options)) {
          questionData.options = questionData.options.map((option: any) => {
            if (option.text && optionTranslations[option.text]) {
              console.log(`  🔄 Translating option: "${option.text}" → "${optionTranslations[option.text]}"`);
              hasChanges = true;
              return { ...option, text: optionTranslations[option.text] };
            }
            return option;
          });
        }

        // Update activities array if it exists (Q6)
        if (questionData.activities && Array.isArray(questionData.activities)) {
          questionData.activities = questionData.activities.map((activity: any) => {
            if (activity.text && optionTranslations[activity.text]) {
              console.log(`  🔄 Translating activity: "${activity.text}" → "${optionTranslations[activity.text]}"`);
              hasChanges = true;
              return { ...activity, text: optionTranslations[activity.text] };
            }
            return activity;
          });
        }

        // Update timeOptions array if it exists (Q6)
        if (questionData.timeOptions && Array.isArray(questionData.timeOptions)) {
          questionData.timeOptions = questionData.timeOptions.map((timeOption: any) => {
            if (timeOption.text && optionTranslations[timeOption.text]) {
              console.log(`  🔄 Translating time option: "${timeOption.text}" → "${optionTranslations[timeOption.text]}"`);
              hasChanges = true;
              return { ...timeOption, text: optionTranslations[timeOption.text] };
            }
            return timeOption;
          });
        }

        // Update parts array if it exists (Q7)
        if (questionData.parts && Array.isArray(questionData.parts)) {
          questionData.parts = questionData.parts.map((part: any) => {
            let partChanged = false;
            
            // Update question text
            if (part.question && questionTranslations[part.question]) {
              console.log(`  🔄 Translating question: "${part.question}" → "${questionTranslations[part.question]}"`);
              part.question = questionTranslations[part.question];
              partChanged = true;
            }
            
            // Update options
            if (part.options && Array.isArray(part.options)) {
              part.options = part.options.map((option: any) => {
                if (option.text && optionTranslations[option.text]) {
                  console.log(`  🔄 Translating part option: "${option.text}" → "${optionTranslations[option.text]}"`);
                  partChanged = true;
                  return { ...option, text: optionTranslations[option.text] };
                }
                return option;
              });
            }
            
            if (partChanged) hasChanges = true;
            return part;
          });
        }

        // Update the question if there were changes
        if (hasChanges) {
          console.log(`\n🔄 Updating question ${question.question_number}: ${question.title}`);
          
          const { error: updateError } = await supabase
            .from('aqa_listening_questions')
            .update({ question_data: questionData })
            .eq('id', question.id);

          if (updateError) {
            throw updateError;
          }

          console.log(`✅ Updated question ${question.question_number}`);
          successCount++;
        }

      } catch (error) {
        console.error(`❌ Error updating question ${question.question_number}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Update summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during update:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  updateQuestionOptionsToEnglish()
    .then(() => {
      console.log('🎉 Question options update completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { updateQuestionOptionsToEnglish };
