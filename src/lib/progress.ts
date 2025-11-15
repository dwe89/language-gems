// Progress tracking system for worksheet generation
// This module handles job progress tracking for async operations

export type GenerationStep = 
  | 'validating'
  | 'fetchSubject' 
  | 'promptGeneration'
  | 'aiProcessing'
  | 'parsing'
  | 'formatting'
  | 'completed'
  | 'failed';

export interface JobProgress {
  jobId: string;
  status: GenerationStep;
  progress: number; // 0-100
  message: string;
  result?: any;
  error?: string;
  createdAt: Date;
  updatedAt: Date;
}

// In-memory storage for job progress (fallback only)
const jobProgressMap = new Map<string, JobProgress>();

// Import Supabase client for database storage
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client for server-side operations with validation
let supabase: ReturnType<typeof createClient> | null = null;
let supabaseInitError: string | null = null;

try {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    supabaseInitError = `Missing Supabase credentials: URL=${!!supabaseUrl}, KEY=${!!supabaseKey}`;
    console.error(`[Progress] ${supabaseInitError}`);
    console.warn('[Progress] Falling back to in-memory progress tracking only');
  } else {
    supabase = createClient(supabaseUrl, supabaseKey);
    console.log('[Progress] Supabase client initialized successfully');
  }
} catch (error) {
  supabaseInitError = `Supabase initialization failed: ${error}`;
  console.error(`[Progress] ${supabaseInitError}`);
  console.warn('[Progress] Falling back to in-memory progress tracking only');
}

/**
 * Create a new progress job
 */
export async function createProgressJob(jobId: string): Promise<void> {
  const job: JobProgress = {
    jobId,
    status: 'validating',
    progress: 0,
    message: 'Starting worksheet generation...',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  // Always store in memory first
  jobProgressMap.set(jobId, job);

  if (!supabase) {
    console.warn(`[Progress] No Supabase client available (${supabaseInitError}), using in-memory only for job ${jobId}`);
    return;
  }

  try {
    // Store in database
    const { error } = await supabase
      .from('worksheet_generation_jobs')
      .insert({
        id: jobId,
        status: job.status,
        progress: job.progress,
        message: job.message,
        created_at: job.createdAt.toISOString(),
        updated_at: job.updatedAt.toISOString()
      } as any);

    if (error) {
      console.error(`[Progress] Failed to create job in database: ${error.message}`);
    } else {
      console.log(`[Progress] Created job in database: ${jobId}`);
    }
  } catch (error) {
    console.error(`[Progress] Database error creating job:`, error);
  }
}

/**
 * Update progress for a job
 */
export async function updateProgress(
  jobId: string,
  status: GenerationStep,
  progress: number,
  message: string
): Promise<void> {
  const normalizedProgress = Math.min(100, Math.max(0, progress));
  const updatedAt = new Date();

  // Always update in-memory first
  const job = jobProgressMap.get(jobId);
  if (job) {
    job.status = status;
    job.progress = normalizedProgress;
    job.message = message;
    job.updatedAt = updatedAt;
    jobProgressMap.set(jobId, job);
  }

  console.log(`[Progress] Updated job ${jobId}: ${progress}% - ${message}`);

  if (!supabase) {
    // Silently skip database update if no Supabase client
    return;
  }

  try {
    // Update in database (async, non-blocking)
    const { error } = await supabase!
      .from('worksheet_generation_jobs')
      .update({
        status,
        progress: normalizedProgress,
        message,
        updated_at: updatedAt.toISOString()
      } as any)
      .eq('id', jobId);

    if (error) {
      console.error(`[Progress] Failed to update job in database: ${error.message}`);
    }
  } catch (error) {
    console.error(`[Progress] Database error updating job:`, error);
  }
}

/**
 * Mark a job as completed with result
 */
export async function markJobComplete(jobId: string, result: any): Promise<void> {
  const updatedAt = new Date();

  try {
    // Update in database first
    const { error } = await supabase!
      .from('worksheet_generation_jobs')
      .update({
        status: 'completed',
        progress: 100,
        message: 'Worksheet generation completed successfully',
        result: JSON.stringify(result),
        updated_at: updatedAt.toISOString()
      } as any)
      .eq('id', jobId);

    if (error) {
      console.error(`[Progress] Failed to mark job complete in database: ${error.message}`);
      // Fall back to in-memory update
      const job = jobProgressMap.get(jobId);
      if (!job) {
        const completedJob: JobProgress = {
          jobId,
          status: 'completed',
          progress: 100,
          message: 'Worksheet generation completed successfully',
          result,
          createdAt: new Date(),
          updatedAt
        };
        jobProgressMap.set(jobId, completedJob);
        console.log(`[Progress] Created completed job entry: ${jobId}`);
      } else {
        job.status = 'completed';
        job.progress = 100;
        job.message = 'Worksheet generation completed successfully';
        job.result = result;
        job.updatedAt = updatedAt;
        jobProgressMap.set(jobId, job);
      }
    } else {
      console.log(`[Progress] Completed job: ${jobId}`);
    }
  } catch (error) {
    console.error(`[Progress] Database error marking job complete:`, error);
    // Fall back to in-memory update
    const job = jobProgressMap.get(jobId);
    if (!job) {
      const completedJob: JobProgress = {
        jobId,
        status: 'completed',
        progress: 100,
        message: 'Worksheet generation completed successfully',
        result,
        createdAt: new Date(),
        updatedAt
      };
      jobProgressMap.set(jobId, completedJob);
      console.log(`[Progress] Created completed job entry: ${jobId}`);
    } else {
      job.status = 'completed';
      job.progress = 100;
      job.message = 'Worksheet generation completed successfully';
      job.result = result;
      job.updatedAt = updatedAt;
      jobProgressMap.set(jobId, job);
    }
  }
}

/**
 * Mark a job as failed with error
 */
export async function markJobFailed(jobId: string, error: string): Promise<void> {
  const updatedAt = new Date();

  try {
    // Update in database first
    const { error: dbError } = await supabase!
      .from('worksheet_generation_jobs')
      .update({
        status: 'failed',
        progress: 0,
        message: 'Worksheet generation failed',
        error_message: error,
        updated_at: updatedAt.toISOString()
      } as any)
      .eq('id', jobId);

    if (dbError) {
      console.error(`[Progress] Failed to mark job failed in database: ${dbError.message}`);
      // Fall back to in-memory update
      const job = jobProgressMap.get(jobId);
      if (job) {
        job.status = 'failed';
        job.message = 'Worksheet generation failed';
        job.error = error;
        job.updatedAt = updatedAt;
        jobProgressMap.set(jobId, job);
      }
    } else {
      console.log(`[Progress] Failed job ${jobId}: ${error}`);
    }
  } catch (err) {
    console.error(`[Progress] Database error marking job failed:`, err);
    // Fall back to in-memory update
    const job = jobProgressMap.get(jobId);
    if (job) {
      job.status = 'failed';
      job.message = 'Worksheet generation failed';
      job.error = error;
      job.updatedAt = updatedAt;
      jobProgressMap.set(jobId, job);
    }
  }
}

/**
 * Get progress for a job
 */
export async function getJobProgress(jobId: string): Promise<JobProgress | undefined> {
  try {
    // Try database first
    const { data, error } = await supabase
      .from('worksheet_generation_jobs')
      .select('*')
      .eq('id', jobId)
      .single();

    if (error) {
      console.log(`[Progress] Job not found in database: ${jobId}, checking memory`);
      // Fall back to in-memory storage
      const memoryJob = jobProgressMap.get(jobId);
      console.log(`[Progress] Looking for job ${jobId}, total jobs in memory: ${jobProgressMap.size}`);
      console.log(`[Progress] Jobs in memory:`, Array.from(jobProgressMap.keys()));
      return memoryJob;
    }

    // Convert database record to JobProgress format
    const job: JobProgress = {
      jobId: data.id,
      status: data.status as GenerationStep,
      progress: data.progress,
      message: data.message,
      result: data.result ? JSON.parse(data.result) : undefined,
      error: data.error_message,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at)
    };

    console.log(`[Progress] Found job in database: ${jobId}, status: ${job.status}, progress: ${job.progress}%`);
    return job;
  } catch (err) {
    console.error(`[Progress] Database error getting job progress:`, err);
    // Fall back to in-memory storage
    const memoryJob = jobProgressMap.get(jobId);
    console.log(`[Progress] Looking for job ${jobId}, total jobs in memory: ${jobProgressMap.size}`);
    console.log(`[Progress] Jobs in memory:`, Array.from(jobProgressMap.keys()));
    return memoryJob;
  }
}

/**
 * Get all jobs (for debugging/admin purposes)
 */
export function getAllJobs(): JobProgress[] {
  return Array.from(jobProgressMap.values());
}

/**
 * Clean up old jobs (call periodically to prevent memory leaks)
 * Keep completed jobs for longer to avoid 404s during polling
 */
export function cleanupOldJobs(maxAgeHours: number = 24): void {
  const cutoffTime = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);
  // Keep completed jobs for much longer (4 hours) to avoid polling issues
  const completedJobCutoff = new Date(Date.now() - 4 * 60 * 60 * 1000);
  
  let cleanedCount = 0;
  for (const [jobId, job] of jobProgressMap.entries()) {
    const cutoffForThisJob = (job.status === 'completed' || job.status === 'failed') 
      ? completedJobCutoff 
      : cutoffTime;
      
    if (job.updatedAt < cutoffForThisJob) {
      jobProgressMap.delete(jobId);
      cleanedCount++;
      console.log(`[Progress] Cleaned up old job: ${jobId} (status: ${job.status})`);
    }
  }
  
  if (cleanedCount > 0) {
    console.log(`[Progress] Cleanup complete: removed ${cleanedCount} old jobs, ${jobProgressMap.size} remaining`);
  }
}

// Clean up old jobs every hour
if (typeof window === 'undefined') { // Only run on server
  setInterval(() => cleanupOldJobs(), 60 * 60 * 1000);
}
