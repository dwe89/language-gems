import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function DELETE(request: NextRequest) {
  try {
    const { userId, userType } = await request.json();
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Create admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log(`Deleting ${userType || 'user'}: ${userId}`);

    // Step 1: Delete from all tables that reference auth.users
    const tablesToClean = [
      // Student-specific tables
      'student_vocabulary_practice',
      'vocabulary_gem_collection', 
      'enhanced_game_sessions',
      'student_achievements',
      'student_game_profiles',
      'daily_challenges',
      'student_challenge_progress',
      'assignment_progress',
      'class_enrollments',
      'game_sessions',
      'student_vocabulary_assignment_progress',
      'assignment_game_sessions',
      'reading_assessment_results',
      'user_reading_stats',
      'user_four_skills_stats',
      'four_skills_assessment_results',
      'reading_comprehension_results',
      'user_reading_comprehension_stats',
      'gem_events',
      'conjugations',
      'listening_assessment_results',
      'user_listening_stats',
      'student_ranking_history',
      
      // Teacher-specific tables (if deleting teacher)
      'classes',
      'assignments',
      'vocabulary_assignment_lists',
      'enhanced_vocabulary_lists',
      'competitions',
      
      // General user tables
      'user_profiles'
    ];

    const results = [];
    
    for (const table of tablesToClean) {
      try {
        // Try different possible column names
        const possibleColumns = ['user_id', 'student_id', 'teacher_id'];
        
        for (const column of possibleColumns) {
          const { error, count } = await adminClient
            .from(table)
            .delete({ count: 'exact' })
            .eq(column, userId);
          
          if (!error && count && count > 0) {
            results.push(`✅ Deleted ${count} records from ${table}.${column}`);
          }
        }
      } catch (error) {
        // Table might not exist or column doesn't exist - that's fine
        console.log(`Info: Could not clean ${table}: ${error}`);
      }
    }

    // Step 2: Handle special cases for teacher deletion
    if (userType === 'teacher') {
      // Delete students created by this teacher
      const { data: teacherStudents } = await adminClient
        .from('user_profiles')
        .select('user_id')
        .eq('teacher_id', userId)
        .eq('role', 'student');

      if (teacherStudents && teacherStudents.length > 0) {
        for (const student of teacherStudents) {
          // Recursively delete each student
          for (const table of tablesToClean) {
            try {
              const { error } = await adminClient
                .from(table)
                .delete()
                .eq('user_id', student.user_id);
              
              if (!error) {
                results.push(`✅ Cleaned student ${student.user_id} from ${table}`);
              }
            } catch (error) {
              // Ignore errors for non-existent tables/columns
            }
          }

          // Delete student auth user
          try {
            await adminClient.auth.admin.deleteUser(student.user_id);
            results.push(`✅ Deleted student auth user: ${student.user_id}`);
          } catch (error: any) {
            results.push(`⚠️ Could not delete student auth user ${student.user_id}: ${error?.message || 'Unknown error'}`);
          }
        }
      }
    }

    // Step 3: Delete the main auth user
    const { error: deleteError } = await adminClient.auth.admin.deleteUser(userId);
    
    if (deleteError) {
      return NextResponse.json({ 
        error: `Failed to delete auth user: ${deleteError.message}`,
        cleanupResults: results
      }, { status: 500 });
    }

    results.push(`✅ Successfully deleted auth user: ${userId}`);

    return NextResponse.json({ 
      success: true, 
      message: `Successfully deleted ${userType || 'user'} account`,
      cleanupResults: results
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred during account deletion' },
      { status: 500 }
    );
  }
}
