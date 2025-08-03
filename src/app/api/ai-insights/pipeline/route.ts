import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { AIInsightsPipelineService } from '@/services/aiInsightsPipelineService';
import { PerformancePredictionService } from '@/services/performancePredictionService';

// Global pipeline instance
let pipelineService: AIInsightsPipelineService | null = null;
let predictionService: PerformancePredictionService | null = null;

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { action, config } = await request.json();

    switch (action) {
      case 'start':
        if (!pipelineService) {
          pipelineService = new AIInsightsPipelineService();
        }
        
        await pipelineService.startPipeline(config);
        
        return NextResponse.json({
          success: true,
          message: 'AI Insights Pipeline started successfully',
          status: pipelineService.getStatus()
        });

      case 'stop':
        if (pipelineService) {
          pipelineService.stopPipeline();
        }
        
        return NextResponse.json({
          success: true,
          message: 'AI Insights Pipeline stopped successfully',
          status: pipelineService?.getStatus() || { isRunning: false }
        });

      case 'status':
        return NextResponse.json({
          success: true,
          status: pipelineService?.getStatus() || { isRunning: false },
          message: pipelineService?.getStatus().isRunning ? 'Pipeline is running' : 'Pipeline is stopped'
        });

      case 'run_once':
        if (!pipelineService) {
          pipelineService = new AIInsightsPipelineService();
        }
        
        // Run a single iteration without starting the recurring pipeline
        await pipelineService['runPipelineIteration'](config || pipelineService['getDefaultConfig']());
        
        return NextResponse.json({
          success: true,
          message: 'Pipeline iteration completed successfully'
        });

      case 'generate_predictions':
        const { classId, teacherId } = await request.json();
        
        if (!classId || !teacherId) {
          return NextResponse.json({
            success: false,
            error: 'classId and teacherId are required for predictions'
          }, { status: 400 });
        }

        if (!predictionService) {
          predictionService = new PerformancePredictionService();
        }

        const predictions = await predictionService.generateClassPredictions(classId, teacherId);
        
        return NextResponse.json({
          success: true,
          predictions,
          message: `Generated ${predictions.length} predictions for class ${classId}`
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: start, stop, status, run_once, generate_predictions'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in AI insights pipeline API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');

    switch (action) {
      case 'status':
        return NextResponse.json({
          success: true,
          status: pipelineService?.getStatus() || { isRunning: false },
          message: pipelineService?.getStatus().isRunning ? 'Pipeline is running' : 'Pipeline is stopped'
        });

      case 'insights':
        const teacherId = url.searchParams.get('teacherId');
        const classId = url.searchParams.get('classId');
        const limit = parseInt(url.searchParams.get('limit') || '10');

        if (!teacherId) {
          return NextResponse.json({
            success: false,
            error: 'teacherId is required'
          }, { status: 400 });
        }

        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        let query = supabase
          .from('ai_insights')
          .select('*')
          .eq('teacher_id', teacherId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (classId) {
          query = query.eq('class_id', classId);
        }

        const { data: insights, error } = await query;

        if (error) {
          throw new Error(`Failed to fetch insights: ${error.message}`);
        }

        return NextResponse.json({
          success: true,
          insights: insights || [],
          count: insights?.length || 0
        });

      case 'config':
        return NextResponse.json({
          success: true,
          config: {
            enabled: true,
            interval_minutes: 5,
            max_insights_per_teacher: 10,
            confidence_threshold: 0.7,
            priority_weights: {
              at_risk_student: 5,
              weakness_hotspot: 4,
              engagement_drop: 4,
              performance_decline: 3,
              achievement_opportunity: 2
            }
          }
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action. Supported actions: status, insights, config'
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Error in AI insights pipeline GET API:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { insightId, status, teacherId } = await request.json();

    if (!insightId || !status || !teacherId) {
      return NextResponse.json({
        success: false,
        error: 'insightId, status, and teacherId are required'
      }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { data, error } = await supabase
      .from('ai_insights')
      .update({ 
        status,
        updated_at: new Date().toISOString()
      })
      .eq('id', insightId)
      .eq('teacher_id', teacherId)
      .select();

    if (error) {
      throw new Error(`Failed to update insight: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      insight: data?.[0],
      message: `Insight status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating insight status:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const insightId = url.searchParams.get('insightId');
    const teacherId = url.searchParams.get('teacherId');

    if (!insightId || !teacherId) {
      return NextResponse.json({
        success: false,
        error: 'insightId and teacherId are required'
      }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const { error } = await supabase
      .from('ai_insights')
      .delete()
      .eq('id', insightId)
      .eq('teacher_id', teacherId);

    if (error) {
      throw new Error(`Failed to delete insight: ${error.message}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Insight deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting insight:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }, { status: 500 });
  }
}
