/**
 * API Route: Evaluate Game Completion
 * 
 * POST /api/assignments/[assignmentId]/games/[gameId]/evaluate-completion
 * 
 * Called by games at session end to evaluate and persist completion status.
 * Uses the hybrid completion rules:
 * - Rule A: All words seen + 70% average accuracy
 * - Rule B: 3+ sessions with 80%+ accuracy
 */

import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { GameCompletionEvaluator } from '../../../../../../../services/GameCompletionEvaluator';

export async function POST(
    request: NextRequest,
    { params }: { params: { assignmentId: string; gameId: string } }
) {
    try {
        const { assignmentId, gameId } = params;

        // Get the student ID from the request body
        const body = await request.json();
        const { studentId } = body;

        if (!studentId) {
            return NextResponse.json(
                { error: 'studentId is required' },
                { status: 400 }
            );
        }

        if (!assignmentId || !gameId) {
            return NextResponse.json(
                { error: 'assignmentId and gameId are required' },
                { status: 400 }
            );
        }

        // Create Supabase client with service role for DB access
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

        // Evaluate and persist completion
        const evaluator = new GameCompletionEvaluator(supabase);
        const result = await evaluator.evaluateAndPersist(assignmentId, studentId, gameId);

        console.log(`📊 [API] Completion evaluated for ${gameId}:`, {
            assignmentId,
            studentId,
            isCompleted: result.isCompleted,
            completedVia: result.completedVia
        });

        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error evaluating game completion:', error);
        return NextResponse.json(
            { error: 'Failed to evaluate game completion' },
            { status: 500 }
        );
    }
}

// Also support GET to check current completion status
export async function GET(
    request: NextRequest,
    { params }: { params: { assignmentId: string; gameId: string } }
) {
    try {
        const { assignmentId, gameId } = params;
        const searchParams = request.nextUrl.searchParams;
        const studentId = searchParams.get('studentId');

        if (!studentId) {
            return NextResponse.json(
                { error: 'studentId query parameter is required' },
                { status: 400 }
            );
        }

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

        // Just evaluate without persisting
        const evaluator = new GameCompletionEvaluator(supabase);
        const result = await evaluator.evaluateCompletion(assignmentId, studentId, gameId);

        return NextResponse.json({
            success: true,
            ...result
        });

    } catch (error) {
        console.error('Error checking game completion:', error);
        return NextResponse.json(
            { error: 'Failed to check game completion' },
            { status: 500 }
        );
    }
}
