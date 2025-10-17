import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Use service role client to bypass RLS and check if user exists
    const supabaseAdmin = createServiceRoleClient();

    // Check if user exists in user_profiles
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('email, role')
      .eq('email', email.toLowerCase())
      .single();

    console.log('🔍 Check user result:', { email: email.toLowerCase(), exists: !!data, error });

    if (error && error.code !== 'PGRST116') {
      // PGRST116 is "not found" error, which is fine
      console.error('Error checking user:', error);
      return NextResponse.json({ error: 'Failed to check user' }, { status: 500 });
    }

    return NextResponse.json({
      exists: !!data,
      role: data?.role || null
    });
  } catch (error) {
    console.error('Check user error:', error);
    return NextResponse.json(
      { error: 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

