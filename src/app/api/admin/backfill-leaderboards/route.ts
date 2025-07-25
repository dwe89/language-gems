import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameService } from '../../../../services/enhancedGameService';

export async function POST(request: Request) {
  try {
    console.log('=== BACKFILL LEADERBOARDS API CALLED ===');

    // Get the service role key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!serviceRoleKey) {
      return NextResponse.json({ error: 'Service configuration error' }, { status: 500 });
    }

    // Create admin client
    const adminClient = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    );

    // Initialize Enhanced Game Service
    const enhancedGameService = new EnhancedGameService(adminClient);

    // Get all enhanced_game_sessions that need to be processed
    const { data: sessions, error: sessionsError } = await adminClient
      .from('enhanced_game_sessions')
      .select('*')
      .not('ended_at', 'is', null)
      .order('ended_at', { ascending: true });

    if (sessionsError) {
      console.error('Error fetching sessions:', sessionsError);
      return NextResponse.json({ error: 'Failed to fetch sessions' }, { status: 500 });
    }

    console.log(`Found ${sessions?.length || 0} sessions to process`);

    let processedCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Process each session
    for (const session of sessions || []) {
      try {
        console.log(`Processing session ${session.id} for student ${session.student_id}`);
        
        // Update leaderboards for this session
        await enhancedGameService.updateLeaderboards(session);
        
        // Update student profile
        await enhancedGameService.updateStudentProfile(session.student_id, session);
        
        processedCount++;
        console.log(`✓ Processed session ${session.id}`);
      } catch (error: any) {
        errorCount++;
        const errorMsg = `Failed to process session ${session.id}: ${error.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    // Recalculate all leaderboard ranks
    try {
      console.log('Recalculating leaderboard ranks...');
      
      // Get all unique game types and leaderboard types
      const { data: gameTypes } = await adminClient
        .from('enhanced_game_sessions')
        .select('game_type')
        .not('ended_at', 'is', null);

      const uniqueGameTypes = [...new Set(gameTypes?.map(g => g.game_type) || [])];
      const leaderboardTypes = ['daily', 'weekly', 'monthly', 'all_time'];

      for (const gameType of uniqueGameTypes) {
        for (const leaderboardType of leaderboardTypes) {
          try {
            // Calculate period start for rank recalculation
            const now = new Date();
            let periodStart = new Date();
            
            switch (leaderboardType) {
              case 'daily':
                periodStart.setHours(0, 0, 0, 0);
                break;
              case 'weekly':
                const dayOfWeek = now.getDay();
                periodStart.setDate(now.getDate() - dayOfWeek);
                periodStart.setHours(0, 0, 0, 0);
                break;
              case 'monthly':
                periodStart.setDate(1);
                periodStart.setHours(0, 0, 0, 0);
                break;
              case 'all_time':
                periodStart = new Date('2020-01-01');
                break;
            }

            await enhancedGameService.recalculateLeaderboardRanks(
              gameType, 
              leaderboardType as any, 
              periodStart
            );
            
            console.log(`✓ Recalculated ranks for ${gameType} ${leaderboardType}`);
          } catch (rankError: any) {
            console.error(`Error recalculating ranks for ${gameType} ${leaderboardType}:`, rankError);
          }
        }
      }
    } catch (rankError: any) {
      console.error('Error during rank recalculation:', rankError);
    }

    return NextResponse.json({
      success: true,
      message: 'Leaderboard backfill completed',
      stats: {
        totalSessions: sessions?.length || 0,
        processedCount,
        errorCount,
        errors: errors.slice(0, 10) // Limit error list
      }
    });

  } catch (error: any) {
    console.error('Error in backfill leaderboards:', error);
    return NextResponse.json({
      error: 'Failed to backfill leaderboards',
      details: error.message
    }, { status: 500 });
  }
}
