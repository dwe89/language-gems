import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { identifier, password, role } = requestData;
    const email = requestData.email; // For backward compatibility
    
    console.log('API login attempt with identifier:', identifier || email || role);
    
    // Create a Supabase client with proper await
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    let loginResult;
    
    // First, check if we're using test/demo accounts
    if (role === 'teacher' || role === 'student') {
      loginResult = await supabase.auth.signInWithPassword({
        email: role === 'teacher' ? 'teacher@example.com' : 'student@example.com',
        password: password || 'password123'
      });
    } else {
      // Determine if the identifier is an email or username
      const isEmail = (identifier || email || '').includes('@');
      
      if (isEmail) {
        // Login with email
        console.log('Attempting to log in with email:', identifier || email);
        loginResult = await supabase.auth.signInWithPassword({
          email: identifier || email,
          password
        });
      } else {
        // Login with username
        // First, look up the user in user_profiles
        console.log('Attempting to log in with username:', identifier);
        
        // Try to find the user by username in user_profiles
        const { data: userProfileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('email, username, role, user_id')
          .eq('username', identifier)
          .single();
        
        // If not found or error, try to find by username in auth.users metadata
        if (profileError || !userProfileData?.email) {
          console.log('Username not found in user_profiles, checking auth.users metadata');
          
          // Get all users and filter by username in metadata
          const { data: { users }, error: usersError } = await supabase.auth.admin.listUsers();
          
          if (usersError) {
            console.error('Error listing users:', usersError);
            return NextResponse.json({ 
              success: false, 
              error: 'An error occurred when looking up the username' 
            }, { status: 500 });
          }
          
          // Find user with matching username in metadata
          const userWithUsername = users?.find(user => {
            const metadataUsername = user.user_metadata?.username;
            return typeof metadataUsername === 'string' && 
                   typeof identifier === 'string' && 
                   metadataUsername.toLowerCase() === identifier.toLowerCase();
          });
          
          if (!userWithUsername) {
            console.error('Username not found in metadata either');
            return NextResponse.json({ 
              success: false, 
              error: 'User not found with this username' 
            }, { status: 401 });
          }
          
          console.log('Found user in metadata with username:', identifier, 'email:', userWithUsername.email);
          
          // Login with the email from the metadata
          loginResult = await supabase.auth.signInWithPassword({
            email: userWithUsername.email,
            password
          });
          
          // If login succeeded, include username in the response
          if (!loginResult.error) {
            console.log('Username login successful for:', identifier);
            
            return NextResponse.json({ 
              success: true, 
              redirectUrl: '/dashboard',
              user: {
                id: userWithUsername.id,
                email: userWithUsername.email,
                username: userWithUsername.user_metadata?.username || '',
                role: userWithUsername.user_metadata?.role || 'student'
              }
            });
          }
        } else {
          // User found in user_profiles
          console.log('Found user profile for username:', identifier, 'email:', userProfileData.email);
          
          // Login with the email from the profile
          loginResult = await supabase.auth.signInWithPassword({
            email: userProfileData.email,
            password
          });
          
          // If login succeeded, include username in the response
          if (!loginResult.error) {
            console.log('Username login successful for:', identifier);
            
            return NextResponse.json({ 
              success: true, 
              redirectUrl: '/dashboard',
              user: {
                id: userProfileData.user_id,
                email: userProfileData.email,
                username: userProfileData.username,
                role: userProfileData.role
              }
            });
          }
        }
      }
    }
    
    const { data, error } = loginResult;
    
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