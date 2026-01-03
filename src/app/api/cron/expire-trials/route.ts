import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

/**
 * Cron job to automatically expire trials and send notifications
 * Runs daily to check for expired trials
 * 
 * Security: Protected by CRON_SECRET environment variable
 */
export async function GET(request: NextRequest) {
  try {
    // Verify cron secret to prevent unauthorized access
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const now = new Date();
    console.log('🔄 Running trial expiration check at:', now.toISOString());

    // Find all users with expired trials that haven't been marked as expired yet
    const { data: expiredTrials, error: fetchError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, email, trial_ends_at, subscription_type, is_school_owner')
      .eq('trial_status', 'active')
      .lt('trial_ends_at', now.toISOString())
      .order('trial_ends_at', { ascending: true });

    if (fetchError) {
      console.error('❌ Error fetching expired trials:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch expired trials' }, { status: 500 });
    }

    if (!expiredTrials || expiredTrials.length === 0) {
      console.log('✅ No expired trials found');
      return NextResponse.json({
        success: true,
        message: 'No expired trials found',
        checked_at: now.toISOString()
      });
    }

    console.log(`📋 Found ${expiredTrials.length} expired trials`);

    const results = {
      expired: [] as string[],
      errors: [] as string[],
      member_updates: [] as string[]
    };

    // Process each expired trial
    for (const user of expiredTrials) {
      try {
        console.log(`⏰ Expiring trial for: ${user.email} (Owner: ${user.is_school_owner})`);

        // Update the user's trial status to expired and subscription to free
        const { error: updateError } = await supabaseAdmin
          .from('user_profiles')
          .update({
            trial_status: 'expired',
            subscription_status: 'free',
            // Keep trial_ends_at for reference
          })
          .eq('user_id', user.user_id);

        if (updateError) {
          console.error(`❌ Failed to expire trial for ${user.email}:`, updateError);
          results.errors.push(user.email);
          continue;
        }

        results.expired.push(user.email);
        console.log(`✅ Expired trial for ${user.email}`);

        // If this is a school owner, also expire all invited members
        if (user.is_school_owner) {
          console.log(`👥 Expiring trials for members of school owner: ${user.email}`);

          const { data: members, error: membersError } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id, email')
            .eq('school_owner_id', user.user_id)
            .eq('trial_status', 'active');

          if (membersError) {
            console.error(`❌ Error fetching members for ${user.email}:`, membersError);
          } else if (members && members.length > 0) {
            console.log(`📝 Expiring ${members.length} member accounts...`);

            for (const member of members) {
              const { error: memberUpdateError } = await supabaseAdmin
                .from('user_profiles')
                .update({
                  trial_status: 'expired',
                  subscription_status: 'free'
                })
                .eq('user_id', member.user_id);

              if (memberUpdateError) {
                console.error(`❌ Failed to expire member ${member.email}:`, memberUpdateError);
                results.errors.push(member.email);
              } else {
                results.member_updates.push(member.email);
                console.log(`✅ Expired member trial: ${member.email}`);
              }
            }
          }
        }

        // TODO: Send trial expiration email
        // await sendTrialExpiredEmail(user.email, user.subscription_type);

      } catch (error) {
        console.error(`❌ Error processing ${user.email}:`, error);
        results.errors.push(user.email);
      }
    }

    console.log('🎉 Trial expiration process complete:', results);

    return NextResponse.json({
      success: true,
      expired_count: results.expired.length,
      member_updates_count: results.member_updates.length,
      error_count: results.errors.length,
      expired_users: results.expired,
      member_updates: results.member_updates,
      errors: results.errors,
      processed_at: now.toISOString()
    });

  } catch (error) {
    console.error('❌ Fatal error in trial expiration cron:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
