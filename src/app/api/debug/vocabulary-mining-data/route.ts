import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const classId = searchParams.get('classId') || '7565cca8-9c14-469f-961e-35decf890563'; // Default to 7F
    const reportMode = searchParams.get('reportMode') === 'true';

    // Get the service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
    }

    // Create admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    console.log('=== DEBUG VOCABULARY MINING DATA ===');
    console.log('Class ID:', classId);

    // Get students in the class
    const { data: enrollments, error: enrollmentsError } = await adminClient
      .from('class_enrollments')
      .select('student_id')
      .eq('class_id', classId);

    if (enrollmentsError) {
      console.error('Enrollments error:', enrollmentsError);
      return NextResponse.json({ error: 'Failed to fetch enrollments', details: enrollmentsError }, { status: 500 });
    }

    console.log('Enrollments found:', enrollments?.length || 0);

    // Get user profiles for these students
    const studentIds = enrollments?.map(e => e.student_id) || [];
    const { data: userProfiles, error: profilesError } = await adminClient
      .from('user_profiles')
      .select('user_id, display_name, email, username')
      .in('user_id', studentIds);

    if (profilesError) {
      console.error('Profiles error:', profilesError);
      return NextResponse.json({ error: 'Failed to fetch profiles', details: profilesError }, { status: 500 });
    }

    console.log('User profiles found:', userProfiles?.length || 0);

    // Create a map for quick lookup
    const profileMap = new Map();
    userProfiles?.forEach(profile => {
      profileMap.set(profile.user_id, profile);
    });

    // Get progress for each student
    const studentProgressData = await Promise.all(
      (enrollments || []).map(async (enrollment) => {
        const studentId = enrollment.student_id;
        const profile = profileMap.get(studentId);

        console.log(`Processing student: ${profile?.username || studentId}`);

        // Get gem collection data for this student
        const { data: gemData, error: gemError } = await adminClient
          .from('vocabulary_gem_collection')
          .select('mastery_level, correct_encounters, total_encounters, current_streak, last_encountered_at')
          .eq('student_id', studentId);

        if (gemError) {
          console.error(`Gem data error for ${profile?.username}:`, gemError);
          return {
            id: studentId,
            name: profile?.display_name || 'Unknown',
            email: profile?.email || '',
            username: profile?.username || '',
            error: gemError.message,
            totalGems: 0,
            masteredGems: 0,
            currentStreak: 0,
            averageAccuracy: 0,
            lastActive: null
          };
        }

        console.log(`Gem data for ${profile?.username}:`, gemData?.length || 0, 'gems');

        // Calculate statistics
        const totalGems = gemData?.length || 0;
        const masteredGems = gemData?.filter(gem => gem.mastery_level >= 3).length || 0;
        const currentStreak = Math.max(...(gemData?.map(gem => gem.current_streak || 0) || [0]));

        // Calculate average accuracy
        const totalCorrect = gemData?.reduce((sum, gem) => sum + (gem.correct_encounters || 0), 0) || 0;
        const totalAttempts = gemData?.reduce((sum, gem) => sum + (gem.total_encounters || 0), 0) || 0;
        const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

        // Find last active date
        const lastActiveDates = gemData?.map(gem => gem.last_encountered_at).filter(Boolean) || [];
        const lastActive = lastActiveDates.length > 0 ? new Date(Math.max(...lastActiveDates.map(d => new Date(d).getTime()))) : null;

        const result = {
          id: studentId,
          name: profile?.display_name || 'Unknown',
          email: profile?.email || '',
          username: profile?.username || '',
          totalGems,
          masteredGems,
          currentStreak,
          averageAccuracy,
          lastActive,
          rawGemData: gemData?.slice(0, 3) // Include first 3 gems for debugging
        };

        console.log(`Calculated stats for ${profile?.username}:`, {
          totalGems,
          masteredGems,
          currentStreak,
          averageAccuracy
        });

        return result;
      })
    );

    // If report mode, also calculate analytics data
    let analyticsData = null;
    if (reportMode) {
      // Get all gem data for analytics
      const { data: allGemData } = await adminClient
        .from('vocabulary_gem_collection')
        .select('*')
        .in('student_id', studentIds);

      const totalGems = allGemData?.length || 0;
      const masteredGems = allGemData?.filter(gem => gem.mastery_level >= 3).length || 0;
      const totalCorrect = allGemData?.reduce((sum, gem) => sum + (gem.correct_encounters || 0), 0) || 0;
      const totalAttempts = allGemData?.reduce((sum, gem) => sum + (gem.total_encounters || 0), 0) || 0;
      const averageAccuracy = totalAttempts > 0 ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

      analyticsData = {
        totalStudents: studentIds.length,
        totalGems,
        masteredGems,
        averageAccuracy,
        totalCorrect,
        totalAttempts,
        gemDataSample: allGemData?.slice(0, 5)
      };
    }

    return NextResponse.json({
      success: true,
      classId,
      reportMode,
      enrollmentsCount: enrollments?.length || 0,
      profilesCount: userProfiles?.length || 0,
      studentProgress: studentProgressData,
      analytics: analyticsData
    });

  } catch (error: any) {
    console.error('Error in debug endpoint:', error);
    return NextResponse.json({
      error: 'Failed to debug vocabulary mining data',
      details: error.message
    }, { status: 500 });
  }
}
