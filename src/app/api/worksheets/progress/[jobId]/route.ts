import { NextRequest, NextResponse } from 'next/server';
import { getJobProgress } from '@/lib/progress';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const { jobId } = params;
    console.log(`[Progress API] Looking for job: ${jobId}`);

    if (!jobId) {
      return NextResponse.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }

    const progress = await getJobProgress(jobId);
    console.log(`[Progress API] Found job: ${!!progress}`);

    if (!progress) {
      console.log(`[Progress API] Job ${jobId} not found in database or memory`);
      
      // Check if this might be a very recent job that completed quickly
      // In this case, assume it completed successfully and direct user to check their worksheets
      return NextResponse.json({
        status: 'completed',
        progress: 100,
        message: 'Worksheet generation may have completed. Please check your generated worksheets or refresh the page.',
        jobId,
        assumedComplete: true
      });
    }

    return NextResponse.json({
      jobId: progress.jobId,
      status: progress.status,
      progress: progress.progress,
      message: progress.message,
      result: progress.result,
      error: progress.error,
      createdAt: progress.createdAt,
      updatedAt: progress.updatedAt
    });
  } catch (error: any) {
    console.error('Error getting job progress:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
