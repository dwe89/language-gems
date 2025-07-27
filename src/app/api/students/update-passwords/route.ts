import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { studentIds } = await request.json();
    
    if (!studentIds || !Array.isArray(studentIds)) {
      return NextResponse.json({ error: 'Student IDs array is required' }, { status: 400 });
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

    const results = [];
    const errors = [];

    for (const studentId of studentIds) {
      try {
        // Generate new gem-based password
        const { data: newPassword, error: passwordError } = await adminClient.rpc('generate_student_password');
        
        if (passwordError) {
          errors.push({ studentId, error: 'Failed to generate password' });
          continue;
        }

        // Update auth user password
        const { error: authError } = await adminClient.auth.admin.updateUserById(
          studentId,
          { password: newPassword }
        );

        if (authError) {
          errors.push({ studentId, error: authError.message });
          continue;
        }

        // Update user_profiles with new password
        const { error: profileError } = await adminClient
          .from('user_profiles')
          .update({ initial_password: newPassword })
          .eq('user_id', studentId);

        if (profileError) {
          errors.push({ studentId, error: profileError.message });
          continue;
        }

        results.push({ studentId, newPassword });

      } catch (error: any) {
        errors.push({ studentId, error: error.message });
      }
    }

    return NextResponse.json({
      success: true,
      results,
      errors,
      message: `Updated ${results.length} student passwords`
    });

  } catch (error: any) {
    console.error('Update passwords error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
