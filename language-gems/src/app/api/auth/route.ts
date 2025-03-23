import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { email, password, role } = requestData;
    
    console.log('API login attempt with:', { email, role });
    
    // Create a Supabase client with proper await
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    
    // Try to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email || (role === 'teacher' ? 'teacher@example.com' : 'student@example.com'),
      password: password || 'password123'
    });
    
    if (error) {
      console.error('API login error:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 401 });
    }
    
    console.log('API login success, user:', data.user?.id);
    
    // Return success with redirect URL
    return NextResponse.json({ 
      success: true, 
      redirectUrl: '/dashboard',
      user: {
        id: data.user?.id,
        email: data.user?.email
      }
    });
  } catch (err) {
    console.error('API exception:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
} 