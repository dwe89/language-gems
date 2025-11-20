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

    // Generate password reset token (generateLink will return an error if user doesn't exist)
    logDebug('[PASSWORD RESET] Generating reset link for email:', email);
    const { data, error } = await supabaseAdmin.auth.admin.generateLink({
      type: 'recovery',
      email: email,
      options: {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/reset-password`
      }
    });

    if (error) {
      logDebug('[PASSWORD RESET] Error generating reset link:', error);
      // Don't reveal if email exists for security reasons - return success anyway
      return NextResponse.json({
        success: true,
        message: 'If an account with that email exists, we have sent a password reset link.'
      });
    }

    logDebug('[PASSWORD RESET] Reset link generated successfully');

    // Send email via Brevo
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    
    logDebug('[PASSWORD RESET] BREVO_API_KEY exists:', !!BREVO_API_KEY);
    
    if (!BREVO_API_KEY) {
      logDebug('[PASSWORD RESET] ERROR: BREVO_API_KEY not configured');
      return NextResponse.json(
        { success: false, error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resetUrl = data.properties?.action_link;
    
    logDebug('[PASSWORD RESET] Reset URL generated:', !!resetUrl);
    
    if (!resetUrl) {
      logDebug('[PASSWORD RESET] ERROR: No reset URL generated');
      return NextResponse.json(
        { success: false, error: 'Failed to generate reset URL' },
        { status: 500 }
      );
    }

    // Get user profile for display name
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('display_name')
      .eq('email', email)
      .single();

    const displayName = profile?.display_name || email.split('@')[0];

    logDebug('[PASSWORD RESET] Sending email via Brevo to:', email);
    logDebug('[PASSWORD RESET] Reset URL:', resetUrl);

    // Send email via Brevo
    const brevoResponse = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': BREVO_API_KEY,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: {
          name: 'Language Gems',
          email: 'noreply@languagegems.com'
        },
        to: [
          {
            email: email,
            name: displayName
          }
        ],
        subject: 'Reset Your Password - Language Gems',
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reset Your Password</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
            <table cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color: #f4f7fa; padding: 40px 0;">
              <tr>
                <td align="center">
                  <table cellpadding="0" cellspacing="0" border="0" width="600" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center;">
                        <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 600;">Language Gems</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px 30px;">
                        <h2 style="margin: 0 0 20px 0; color: #1a202c; font-size: 24px; font-weight: 600;">Reset Your Password</h2>
                        
                        <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Hi ${displayName},
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          We received a request to reset your password for your Language Gems account. Click the button below to create a new password:
                        </p>
                        
                        <!-- CTA Button -->
                        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="margin: 30px 0;">
                          <tr>
                            <td align="center">
                              <a href="${resetUrl}" style="display: inline-block; padding: 16px 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 6px rgba(102, 126, 234, 0.25);">
                                Reset Password
                              </a>
                            </td>
                          </tr>
                        </table>
                        
                        <p style="margin: 0 0 20px 0; color: #4a5568; font-size: 16px; line-height: 1.6;">
                          Or copy and paste this link into your browser:
                        </p>
                        
                        <p style="margin: 0 0 20px 0; padding: 12px; background-color: #f7fafc; border-radius: 4px; color: #667eea; font-size: 14px; word-break: break-all;">
                          ${resetUrl}
                        </p>
                        
                        <p style="margin: 0 0 20px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          This link will expire in 1 hour for security reasons.
                        </p>
                        
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px; line-height: 1.6;">
                          If you didn't request a password reset, you can safely ignore this email. Your password will remain unchanged.
                        </p>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f7fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
                        <p style="margin: 0 0 10px 0; color: #718096; font-size: 14px;">
                          © ${new Date().getFullYear()} Language Gems. All rights reserved.
                        </p>
                        <p style="margin: 0; color: #a0aec0; font-size: 12px;">
                          If you need help, please contact us at <a href="mailto:support@languagegems.com" style="color: #667eea; text-decoration: none;">support@languagegems.com</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
        `
      })
    });

    if (!brevoResponse.ok) {
      const errorText = await brevoResponse.text();
      logDebug('[PASSWORD RESET] Brevo API error:', { status: brevoResponse.status, error: errorText });
      return NextResponse.json(
        { success: false, error: 'Failed to send email' },
        { status: 500 }
      );
    }

    const brevoData = await brevoResponse.json();
    logDebug('[PASSWORD RESET] Brevo response SUCCESS:', brevoData);

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
