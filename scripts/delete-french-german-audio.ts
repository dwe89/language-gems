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

async function deleteFrenchGermanAudio() {
  console.log('🗑️ Starting deletion of French and German audio files...');

  try {
    // Get all French and German questions with audio URLs
    const { data: questions, error } = await supabase
      .from('aqa_listening_questions')
      .select(`
        id, title, audio_url, assessment_id,
        aqa_listening_assessments!inner(language)
      `)
      .in('aqa_listening_assessments.language', ['fr', 'de'])
      .not('audio_url', 'is', null);

    if (error) {
      throw error;
    }

    if (!questions || questions.length === 0) {
      console.log('✅ No French or German audio files found to delete');
      return;
    }

    console.log(`📊 Found ${questions.length} audio files to delete`);

    let successCount = 0;
    let errorCount = 0;

    for (const question of questions) {
      try {
        const language = (question as any).aqa_listening_assessments?.language;
        console.log(`\n🗑️ Deleting audio for: ${question.title} (${language})`);
        console.log(`🔗 Audio URL: ${question.audio_url}`);

        // Extract the file path from the URL
        // URL format: https://xetsvpfunazwkontdpdh.supabase.co/storage/v1/object/public/audio/exam-audio/filename
        const audioUrl = question.audio_url as string;
        const urlParts = audioUrl.split('/');
        const fileName = urlParts[urlParts.length - 1];
        const filePath = `exam-audio/${fileName}`;

        console.log(`📁 File path: ${filePath}`);

        // Delete the file from Supabase storage
        const { error: deleteError } = await supabase.storage
          .from('audio')
          .remove([filePath]);

        if (deleteError) {
          console.warn(`⚠️ Warning: Could not delete file from storage: ${deleteError.message}`);
          // Continue anyway to clear the database reference
        } else {
          console.log(`✅ Deleted file from storage: ${filePath}`);
        }

        // Clear the audio_url from the database
        const { error: updateError } = await supabase
          .from('aqa_listening_questions')
          .update({ audio_url: null })
          .eq('id', question.id);

        if (updateError) {
          throw updateError;
        }

        console.log(`✅ Cleared audio_url from database for question: ${question.title}`);
        successCount++;

        // Add a small delay to avoid overwhelming the API
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (error) {
        console.error(`❌ Error deleting audio for question ${question.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Deletion summary:');
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log(`📝 Total processed: ${questions.length}`);

  } catch (error) {
    console.error('❌ Fatal error during deletion:', error);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  deleteFrenchGermanAudio()
    .then(() => {
      console.log('🎉 Audio deletion completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Script failed:', error);
      process.exit(1);
    });
}

export { deleteFrenchGermanAudio };
