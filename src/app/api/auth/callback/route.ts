import { NextRequest, NextResponse } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value,
              ...options,
            });
          },
          remove(name: string, options: CookieOptions) {
            cookieStore.set({
              name,
              value: '',
              ...options,
              maxAge: 0,
            });
          },
        },
      }
    );

    try {
      // Exchange the code for a session
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('❌ Error exchanging code for session:', error);
        return NextResponse.redirect(`${origin}/auth/login?error=verification_failed`);
      }

      if (data.user) {
        console.log('✅ Email verification successful for user:', data.user.email, 'ID:', data.user.id);

        // Process pending invitation after email verification
        const supabaseAdmin = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        // Wait for user_profiles trigger to complete (retry up to 3 times)
        let userProfileExists = false;
        for (let i = 0; i < 3; i++) {
          await new Promise(resolve => setTimeout(resolve, 500 * (i + 1)));
          const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id')
            .eq('user_id', data.user.id)
            .single();
          
          if (profile) {
            userProfileExists = true;
            console.log(`✅ User profile exists (attempt ${i + 1})`);
            break;
          }
          console.log(`⏳ Waiting for user profile creation (attempt ${i + 1})...`);
        }

        if (!userProfileExists) {
          console.error('❌ User profile not created after 3 retries');
        }

        console.log('🔍 Checking for pending invitation...');
        const { data: invitation, error: invitationError } = await supabaseAdmin
          .from('pending_teacher_invitations')
          .select('*')
          .eq('teacher_email', data.user.email?.toLowerCase())
          .eq('status', 'pending')
          .single();

        if (invitationError && invitationError.code !== 'PGRST116') {
          console.error('❌ Error fetching invitation:', invitationError);
        }

        if (invitation) {
          console.log('📧 Found pending invitation:', {
            id: invitation.id,
            school_code: invitation.school_code,
            school_name: invitation.school_name
          });

          // Get school owner info
          console.log('🔍 Fetching school owner for code:', invitation.school_code.toUpperCase());
          const { data: ownerProfile, error: ownerError } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id, subscription_status')
            .eq('school_code', invitation.school_code.toUpperCase())
            .eq('is_school_owner', true)
            .single();

          if (ownerError) {
            console.error('❌ Error fetching school owner:', ownerError);
          }

          if (ownerProfile) {
            console.log('✅ Found school owner:', ownerProfile.user_id);

            // Get full owner profile with trial info
            const { data: fullOwnerProfile, error: ownerProfileError } = await supabaseAdmin
              .from('user_profiles')
              .select('user_id, subscription_status, subscription_type, trial_status, trial_starts_at, trial_ends_at')
              .eq('user_id', ownerProfile.user_id)
              .single();

            if (ownerProfileError) {
              console.error('❌ Error fetching full owner profile:', ownerProfileError);
            }

            // Check if school membership already exists
            const { data: existingMembership, error: checkError } = await supabaseAdmin
              .from('school_memberships')
              .select('id')
              .eq('member_user_id', data.user.id)
              .eq('owner_user_id', ownerProfile.user_id)
              .single();

            if (checkError && checkError.code !== 'PGRST116') {
              console.error('❌ Error checking membership:', checkError);
            }

            if (!existingMembership) {
              console.log('📝 Creating school membership...');
              const { error: membershipError } = await supabaseAdmin
                .from('school_memberships')
                .insert({
                  school_code: invitation.school_code.toUpperCase(),
                  school_name: invitation.school_name || invitation.school_code,
                  owner_user_id: ownerProfile.user_id,
                  member_user_id: data.user.id,
                  role: 'member',
                  status: 'active',
                  invited_at: invitation.invitation_sent_at,
                  joined_at: new Date().toISOString()
                });

              if (membershipError) {
                console.error('❌ FAILED to create school membership:', membershipError);
              } else {
                console.log('✅ School membership created successfully');
              }
            } else {
              console.log('ℹ️ School membership already exists');
            }

            // Update user profile with inherited trial info from school owner
            console.log('📝 Updating user profile with inherited trial data...');
            const profileUpdate: any = {
              school_code: invitation.school_code.toUpperCase(),
              school_owner_id: fullOwnerProfile?.user_id || ownerProfile.user_id,
              subscription_status: fullOwnerProfile?.subscription_status || ownerProfile.subscription_status || 'trialing'
            };

            // Inherit trial information and subscription_type from school owner
            if (fullOwnerProfile) {
              if (fullOwnerProfile.subscription_type) {
                profileUpdate.subscription_type = fullOwnerProfile.subscription_type;
              }
              if (fullOwnerProfile.trial_status) {
                profileUpdate.trial_status = fullOwnerProfile.trial_status;
              }
              if (fullOwnerProfile.trial_starts_at) {
                profileUpdate.trial_starts_at = fullOwnerProfile.trial_starts_at;
              }
              if (fullOwnerProfile.trial_ends_at) {
                profileUpdate.trial_ends_at = fullOwnerProfile.trial_ends_at;
              }
              console.log('✅ Inheriting trial data:', {
                subscription_type: profileUpdate.subscription_type,
                trial_status: profileUpdate.trial_status,
                trial_ends_at: profileUpdate.trial_ends_at
              });
            }

            const { error: profileError } = await supabaseAdmin
              .from('user_profiles')
              .update(profileUpdate)
              .eq('user_id', data.user.id);

            if (profileError) {
              console.error('❌ FAILED to update profile:', profileError);
            } else {
              console.log('✅ Profile updated successfully with inherited data');
            }

            // Mark invitation as accepted
            console.log('📝 Marking invitation as accepted...');
            const { error: invitationUpdateError } = await supabaseAdmin
              .from('pending_teacher_invitations')
              .update({ 
                status: 'accepted',
                updated_at: new Date().toISOString()
              })
              .eq('id', invitation.id);

            if (invitationUpdateError) {
              console.error('❌ FAILED to update invitation status:', invitationUpdateError);
            } else {
              console.log('✅ Invitation marked as accepted');
            }

            console.log('🎉 Invitation processing COMPLETE');
          } else {
            console.error('❌ School owner profile NOT FOUND for code:', invitation.school_code);
          }
        } else {
          console.log('ℹ️ No pending invitation found for user:', data.user.email);
        }

        // Check user metadata to determine redirect destination
        const userMetadata = data.user.user_metadata || {};
        const userType = userMetadata.user_type;
        const role = userMetadata.role;

        console.log('User metadata:', { userType, role, userMetadata });

        // Redirect based on user type or role
        if (role === 'learner' || userType === 'b2c') {
          console.log('Redirecting learner to learner dashboard');
          return NextResponse.redirect(`${origin}/learner-dashboard`);
        } else if (role === 'teacher' || userType === 'b2b') {
          console.log('Redirecting teacher to account page');
          return NextResponse.redirect(`${origin}/account`);
        } else {
          // Default to confirmation page if user type is unclear
          console.log('User type unclear, redirecting to confirmation page');
          return NextResponse.redirect(`${origin}/auth/confirmed`);
        }
      }
    } catch (error) {
      console.error('Exception during code exchange:', error);
    }
  }

  // If no code or exchange failed, redirect to login
  return NextResponse.redirect(`${origin}/auth/login?error=invalid_verification_link`);
} 