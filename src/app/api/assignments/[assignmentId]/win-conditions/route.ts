/**
 * API Route: Get Assignment Win Conditions
 * 
 * GET /api/assignments/[assignmentId]/win-conditions
 * 
 * Returns the win conditions for displaying in the intro modal:
 * - Per-game thresholds
 * - Assignment threshold (70% coverage)
 * - Tips
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GameCompletionService } from '../../../../../services/assignments/GameCompletionService';

export async function GET(
    request: NextRequest,
    { params }: { params: { assignmentId: string } }
) {
    try {
        const { assignmentId } = params;

        if (!assignmentId) {
            return NextResponse.json(
                { error: 'assignmentId is required' },
                { status: 400 }
            );
        }

        // Create Supabase client
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        const completionService = new GameCompletionService(supabase);
        const winConditions = await completionService.getAssignmentWinConditions(assignmentId);

        return NextResponse.json({
            success: true,
            ...winConditions
        });

    } catch (error) {
        console.error('Error getting win conditions:', error);
        return NextResponse.json(
            { error: 'Failed to get win conditions' },
            { status: 500 }
        );
    }
}
