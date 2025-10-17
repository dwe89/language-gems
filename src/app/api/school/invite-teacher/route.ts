import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '../../../../lib/supabase-server';
import { createServiceRoleClient } from '../../../../utils/supabase/client';

export const dynamic = 'force-dynamic';

/**
 * DELETE - Cancel a pending teacher invitation
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get invitation_id from query params
    const { searchParams } = new URL(request.url);
    const invitationId = searchParams.get('invitation_id');

    if (!invitationId) {
      return NextResponse.json({ error: 'Invitation ID is required' }, { status: 400 });
    }

    // Get user's school information and verify they're a school owner
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('school_code, is_school_owner')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile?.school_code) {
      return NextResponse.json({ error: 'No school associated with user' }, { status: 400 });
    }

    if (!userProfile.is_school_owner) {
      return NextResponse.json({ error: 'Only school owners can cancel invitations' }, { status: 403 });
    }

    // Delete the invitation (verify it belongs to this school)
    const { error: deleteError } = await supabase
      .from('pending_teacher_invitations')
      .delete()
      .eq('id', invitationId)
      .eq('school_code', userProfile.school_code);

    if (deleteError) {
      console.error('Error deleting invitation:', deleteError);
      return NextResponse.json({ error: 'Failed to cancel invitation' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      message: 'Invitation cancelled successfully'
    });

  } catch (error) {
    console.error('Error cancelling invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST - Send teacher invitation email via Brevo
 * 
 * This endpoint:
 * 1. Verifies the requesting user is a school owner
 * 2. Checks if the teacher email already exists in the system
 * 3. Sends an invitation email via Brevo with signup link
 * 4. Creates a pending invitation record
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    // Verify authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { teacher_email, teacher_name } = await request.json();

    if (!teacher_email) {
      return NextResponse.json({ error: 'Teacher email is required' }, { status: 400 });
    }

    // Get user's school information and verify they're a school owner
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('school_code, is_school_owner, subscription_status, display_name, email')
      .eq('user_id', user.id)
      .single();

    if (profileError || !userProfile?.school_code) {
      return NextResponse.json({ error: 'No school associated with user' }, { status: 400 });
    }

    if (!userProfile.is_school_owner) {
      return NextResponse.json({ error: 'Only school owners can invite teachers' }, { status: 403 });
    }

    if (userProfile.subscription_status !== 'active' && userProfile.subscription_status !== 'trialing') {
      return NextResponse.json({ error: 'Active subscription required to invite teachers' }, { status: 403 });
    }

    // Get school details
    const { data: schoolData, error: schoolError } = await supabase
      .from('school_codes')
      .select('school_name, code')
      .eq('code', userProfile.school_code)
      .single();

    if (schoolError || !schoolData) {
      return NextResponse.json({ error: 'School not found' }, { status: 404 });
    }

    // Use school_name if available, otherwise fall back to school code
    const displaySchoolName = schoolData.school_name || schoolData.code;

    // Check if teacher already exists
    const { data: existingTeacher } = await supabase
      .from('user_profiles')
      .select('id, email, role')
      .eq('email', teacher_email)
      .single();

    // If teacher exists and is already a teacher, add them directly to the school
    if (existingTeacher && existingTeacher.role === 'teacher') {
      const { data: result, error: addError } = await supabase
        .rpc('add_teacher_to_school', {
          p_school_code: userProfile.school_code,
          p_teacher_email: teacher_email,
          p_owner_user_id: user.id
        });

      if (addError) {
        console.error('Error adding existing teacher to school:', addError);
        return NextResponse.json({ error: 'Failed to add teacher to school' }, { status: 500 });
      }

      const parsedResult = typeof result === 'string' ? JSON.parse(result) : result;

      if (!parsedResult.success) {
        return NextResponse.json({ error: parsedResult.error }, { status: 400 });
      }

      // Send welcome email to existing teacher
      await sendWelcomeEmail({
        teacherEmail: teacher_email,
        teacherName: teacher_name || teacher_email,
        schoolName: displaySchoolName,
        schoolCode: schoolData.code,
        ownerName: userProfile.display_name || userProfile.email,
        isExistingUser: true
      });

      return NextResponse.json({
        success: true,
        message: 'Existing teacher added to school and notified',
        teacher_id: parsedResult.teacher_id
      });
    }

    // Teacher doesn't exist - send invitation email and track it
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.languagegems.com';
    const invitationLink = `${siteUrl}/auth/signup?school_code=${schoolData.code}&email=${encodeURIComponent(teacher_email)}&role=teacher`;

    // Create pending invitation record using service role client to bypass RLS
    const supabaseAdmin = createServiceRoleClient();
    const { error: invitationError } = await supabaseAdmin
      .from('pending_teacher_invitations')
      .upsert({
        school_code: userProfile.school_code,
        school_name: displaySchoolName, // Use display name with fallback
        teacher_email: teacher_email,
        teacher_name: teacher_name || teacher_email.split('@')[0],
        invited_by_user_id: user.id,
        status: 'pending',
        invitation_sent_at: new Date().toISOString(),
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
      }, {
        onConflict: 'school_code,teacher_email'
      });

    if (invitationError) {
      console.error('Error creating invitation record:', invitationError);
      // Don't fail the request, just log the error
    }

    await sendInvitationEmail({
      teacherEmail: teacher_email,
      teacherName: teacher_name || teacher_email,
      schoolName: displaySchoolName,
      schoolCode: schoolData.code,
      ownerName: userProfile.display_name || userProfile.email,
      invitationLink
    });

    return NextResponse.json({
      success: true,
      message: 'Invitation email sent successfully',
      invitation_sent: true
    });

  } catch (error) {
    console.error('Error in teacher invitation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * Send invitation email to new teacher via Brevo
 */
async function sendInvitationEmail(params: {
  teacherEmail: string;
  teacherName: string;
  schoolName: string;
  schoolCode: string;
  ownerName: string;
  invitationLink: string;
}) {
  const { teacherEmail, teacherName, schoolName, schoolCode, ownerName, invitationLink } = params;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || ''
      },
      body: JSON.stringify({
        sender: {
          name: 'Language Gems',
          email: 'noreply@languagegems.com'
        },
        to: [{
          email: teacherEmail,
          name: teacherName
        }],
        subject: `You've been invited to join ${schoolName} on Language Gems`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Language Gems</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Teacher Invitation</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #667eea; margin-top: 0;">Welcome to ${schoolName}!</h2>
              
              <p>Hi ${teacherName},</p>
              
              <p><strong>${ownerName}</strong> has invited you to join <strong>${schoolName}</strong> on Language Gems.</p>
              
              <p>Language Gems is a comprehensive language learning platform that helps teachers create engaging assignments, track student progress, and make language learning fun!</p>
              
              <div style="background: white; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #667eea;">
                <p style="margin: 0 0 10px 0;"><strong>School Code:</strong> <code style="background: #e9ecef; padding: 4px 8px; border-radius: 4px; font-size: 16px;">${schoolCode}</code></p>
                <p style="margin: 0;"><small style="color: #6c757d;">You'll need this code to complete your signup</small></p>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${invitationLink}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Accept Invitation & Sign Up
                </a>
              </div>
              
              <p style="color: #6c757d; font-size: 14px; margin-top: 30px;">
                If the button doesn't work, copy and paste this link into your browser:<br>
                <a href="${invitationLink}" style="color: #667eea; word-break: break-all;">${invitationLink}</a>
              </p>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
              
              <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
                This invitation was sent by ${ownerName} from ${schoolName}.<br>
                If you didn't expect this invitation, you can safely ignore this email.
              </p>
            </div>
          </body>
          </html>
        `,
        tags: ['teacher-invitation', 'school-management']
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send invitation email');
    }

    console.log('✅ Invitation email sent successfully to:', teacherEmail);
    return true;

  } catch (error) {
    console.error('Error sending invitation email:', error);
    throw error;
  }
}

/**
 * Send welcome email to existing teacher added to school
 */
async function sendWelcomeEmail(params: {
  teacherEmail: string;
  teacherName: string;
  schoolName: string;
  schoolCode: string;
  ownerName: string;
  isExistingUser: boolean;
}) {
  const { teacherEmail, teacherName, schoolName, schoolCode, ownerName } = params;

  try {
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': process.env.BREVO_API_KEY || ''
      },
      body: JSON.stringify({
        sender: {
          name: 'Language Gems',
          email: 'noreply@languagegems.com'
        },
        to: [{
          email: teacherEmail,
          name: teacherName
        }],
        subject: `You've been added to ${schoolName} on Language Gems`,
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">Language Gems</h1>
              <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">Welcome to ${schoolName}!</p>
            </div>
            
            <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
              <h2 style="color: #10b981; margin-top: 0;">You're now part of ${schoolName}!</h2>
              
              <p>Hi ${teacherName},</p>
              
              <p><strong>${ownerName}</strong> has added you to <strong>${schoolName}</strong> on Language Gems.</p>
              
              <p>You can now access your school's dashboard and start collaborating with your colleagues!</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.languagegems.com'}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px;">
                  Go to Dashboard
                </a>
              </div>
              
              <hr style="border: none; border-top: 1px solid #dee2e6; margin: 30px 0;">
              
              <p style="color: #6c757d; font-size: 12px; text-align: center; margin: 0;">
                Added by ${ownerName} from ${schoolName}
              </p>
            </div>
          </body>
          </html>
        `,
        tags: ['teacher-welcome', 'school-management']
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API error:', errorData);
      throw new Error('Failed to send welcome email');
    }

    console.log('✅ Welcome email sent successfully to:', teacherEmail);
    return true;

  } catch (error) {
    console.error('Error sending welcome email:', error);
    throw error;
  }
}

