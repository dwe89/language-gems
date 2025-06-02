import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const requestData = await request.json();
    const { identifier, password, role, schoolCode } = requestData;
    const email = requestData.email; // For backward compatibility
    
    console.log('API login attempt with identifier:', identifier || email || role, 'schoolCode:', schoolCode);
    
    // Create a Supabase client
    const supabase = createRouteHandlerClient({ cookies });

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
        
        // If schoolCode is provided, validate it first
        if (schoolCode) {
          const { data: schoolCodeData, error: schoolCodeError } = await supabase
            .from('school_codes')
            .select('code, school_name, school_initials, is_active, expires_at')
            .eq('school_initials', schoolCode)
            .eq('is_active', true)
            .single();
          
          if (schoolCodeError || !schoolCodeData) {
            console.log('Invalid school code provided:', schoolCode);
            return NextResponse.json({ 
              success: false, 
              error: 'Invalid school code. Please check with your teacher.' 
            }, { status: 401 });
          }
          
          // Check if code has expired
          if (schoolCodeData.expires_at && new Date(schoolCodeData.expires_at) < new Date()) {
            console.log('Expired school code provided:', schoolCode);
            return NextResponse.json({ 
              success: false, 
              error: 'School code has expired. Please contact your teacher for a new code.' 
            }, { status: 401 });
          }
          
          console.log('Valid school code:', schoolCode, 'for school:', schoolCodeData.school_name);
        }
        
        // Try to find the user by username in user_profiles (scoped by school if provided)
        let userProfileQuery = supabase
          .from('user_profiles')
          .select('email, username, role, user_id, school_initials')
          .eq('username', identifier);
        
        // If school code provided, scope the search to that school
        if (schoolCode) {
          userProfileQuery = userProfileQuery.eq('school_initials', schoolCode);
        }
        
        const { data: userProfileData, error: profileError } = await userProfileQuery.single();
        
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
          if (!userWithUsername.email) {
            console.error('User found but no email in metadata');
            return NextResponse.json({ 
              success: false, 
              error: 'User account is incomplete' 
            }, { status: 500 });
          }
          
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