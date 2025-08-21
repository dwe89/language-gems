require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function deleteUser() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  console.log('URL exists:', !!supabaseUrl);
  console.log('Key exists:', !!serviceKey);
  
  if (!supabaseUrl || !serviceKey) {
    console.error('Missing environment variables');
    return;
  }

  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  console.log('Cleaning up user data for 1015a1fb-8c80-41e3-8f7c-f01c7f6c490c...');
  
  const userId = '1015a1fb-8c80-41e3-8f7c-f01c7f6c490c';
  
  // Clean up all related tables
  const tables = [
    'class_enrollments',
    'assignment_progress',
    'student_vocabulary_practice',
    'game_sessions',
    'vocabulary_gem_collection',
    'enhanced_game_sessions',
    'student_achievements',
    'student_game_profiles',
    'daily_challenges',
    'student_challenge_progress',
    'user_profiles'
  ];
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('student_id', userId);
      
      if (!error) {
        console.log(`✅ Cleaned ${table}`);
      }
      
      // Also try user_id column
      const { error: error2 } = await supabase
        .from(table)
        .delete()
        .eq('user_id', userId);
        
      if (!error2) {
        console.log(`✅ Cleaned ${table} (user_id)`);
      }
    } catch (e) {
      // Ignore errors for tables that don't exist or don't have these columns
    }
  }
  
  // Now delete auth user
  const { error } = await supabase.auth.admin.deleteUser(userId);
  
  if (error) {
    console.error('Failed to delete auth user:', error);
  } else {
    console.log('✅ Auth user deleted successfully');
  }
}

deleteUser().catch(console.error);
