import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Debug logging function
const logDebug = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  const logMessage = `[${timestamp}] ${message}${data ? ' ' + JSON.stringify(data) : ''}\n`;
  
  console.log(logMessage.trim());
  
  try {
    const logFile = path.join(process.cwd(), 'password-reset-debug.log');
    fs.appendFileSync(logFile, logMessage);
  } catch (err) {
    console.error('Failed to write to log file:', err);
  }
};

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    logDebug('[PASSWORD RESET] Request received for email:', email);

    if (!email) {
      logDebug('[PASSWORD RESET] ERROR: No email provided');
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Use Supabase's built-in password reset email
    // This uses Supabase's email templates and handles token expiry properly
    logDebug('[PASSWORD RESET] Sending password reset email via Supabase...');
    
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
    });

    if (error) {
      logDebug('[PASSWORD RESET] Error from Supabase resetPasswordForEmail:', error);
    } else {
      logDebug('[PASSWORD RESET] Supabase password reset email sent successfully');
    }

    // Return success regardless - don't reveal if email exists for security
    return NextResponse.json({
      success: true,
      message: 'If an account with that email exists, we have sent a password reset link.'
    });

  } catch (error) {
    logDebug('[PASSWORD RESET] Unexpected error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
