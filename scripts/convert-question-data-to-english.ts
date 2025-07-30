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

// Translation mappings
const dayTranslations: Record<string, string> = {
  'Lunes': 'Monday',
  'Martes': 'Tuesday',
  'Miércoles': 'Wednesday',
  'Jueves': 'Thursday',
  'Viernes': 'Friday',
  'Sábado': 'Saturday',
  'Domingo': 'Sunday'
};

const questionTranslations: Record<string, string> = {
  '¿Qué come la familia en Nochebuena?': 'What does the family eat on Christmas Eve?',
  '¿Cuándo encuentran regalos los niños en la segunda familia?': 'When do the children in the second family find presents?',
  '¿Cuándo decoran el árbol en la tercera familia?': 'When does the third family decorate the tree?'
};

const aspectTranslations: Record<string, string> = {
  'Comunicación con otros': 'Communication with others',
  'Adicción y tiempo perdido': 'Addiction and wasted time',
  'Uso educativo': 'Educational use',
  'Privacidad personal': 'Personal privacy'
};

async function convertQuestionDataToEnglish() {
  console.log('🔄 Converting question data to English...');
  
  try {
    // Get all questions
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select('id, title, question_type, question_data')
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
        console.log(`\n🎯 Processing: ${question.title} (${question.question_type})`);
        
        let questionData = { ...question.question_data };
        let hasChanges = false;

        // Process based on question type
        switch (question.question_type) {
          case 'letter-matching':
            // Convert day labels to English
            if (questionData.questions) {
              questionData.questions = questionData.questions.map((q: any) => {
                if (dayTranslations[q.label]) {
                  console.log(`  📝 Converting day: ${q.label} → ${dayTranslations[q.label]}`);
                  hasChanges = true;
                  return { ...q, label: dayTranslations[q.label] };
                }
                return q;
              });
            }
            break;

          case 'multiple-choice':
            // Convert question text to English (but keep answer options in Spanish)
            if (questionData.questions) {
              questionData.questions = questionData.questions.map((q: any) => {
                if (questionTranslations[q.question]) {
                  console.log(`  📝 Converting question: ${q.question} → ${questionTranslations[q.question]}`);
                  hasChanges = true;
                  return { ...q, question: questionTranslations[q.question] };
                }
                return q;
              });
            }
            break;

          case 'opinion-rating':
            // Convert aspect labels to English
            if (questionData.aspects) {
              questionData.aspects = questionData.aspects.map((aspect: any) => {
                if (aspectTranslations[aspect.label]) {
                  console.log(`  📝 Converting aspect: ${aspect.label} → ${aspectTranslations[aspect.label]}`);
                  hasChanges = true;
                  return { ...aspect, label: aspectTranslations[aspect.label] };
                }
                return aspect;
              });
            }
            break;

          case 'lifestyle-grid':
            // No changes needed - speaker names and options can stay as they are
            console.log('  ℹ️ No changes needed for lifestyle-grid');
            break;

          case 'open-response':
          case 'activity-timing':
          case 'multi-part':
          case 'dictation':
            // These types typically don't have translatable elements in question_data
            console.log(`  ℹ️ No changes needed for ${question.question_type}`);
            break;

          default:
            console.log(`  ⚠️ Unknown question type: ${question.question_type}`);
        }

        if (hasChanges) {
          // Update the database
          const { error: updateError } = await supabase
            .from('aqa_listening_questions')
            .update({ question_data: questionData })
            .eq('id', question.id);

          if (updateError) {
            throw updateError;
          }

          console.log(`  ✅ Successfully updated: ${question.title}`);
          successCount++;
        } else {
          console.log(`  ⏭️ No changes needed for: ${question.title}`);
          skippedCount++;
        }

      } catch (error) {
        console.error(`❌ Error processing question ${question.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Question data conversion summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`⏭️ Skipped: ${skippedCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during question data conversion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  convertQuestionDataToEnglish()
    .then(() => {
      console.log('🎉 Question data conversion completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { convertQuestionDataToEnglish };
