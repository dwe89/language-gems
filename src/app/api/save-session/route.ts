import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { EnhancedGameService } from '../../../services/enhancedGameService';

// This endpoint handles session saving from navigator.sendBeacon
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const { sessionId, sessionData } = JSON.parse(body);

    // Initialize Supabase client with service role key for server-side operations
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing Supabase configuration');
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const enhancedGameService = new EnhancedGameService(supabase);

    if (sessionId) {
      // Update existing session
      await enhancedGameService.updateGameSession(sessionId, sessionData);
      console.log('✅ Session updated via beacon:', sessionId);
    } else {
      // Create new session (shouldn't happen with beacon, but handle it)
      const newSessionId = await enhancedGameService.startGameSession({
        student_id: sessionData.student_id || 'unknown',
        game_type: 'vocabulary-mining',
        session_mode: 'free_play',
        ...sessionData
      });
      console.log('✅ New session created via beacon:', newSessionId);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Error saving session via beacon:', error);
    return NextResponse.json({ error: 'Failed to save session' }, { status: 500 });
  }
}
