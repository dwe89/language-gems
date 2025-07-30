import { NextRequest, NextResponse } from 'next/server';
import { AQAListeningAssessmentService } from '../../../services/aqaListeningAssessmentService';

export async function GET(request: NextRequest) {
  try {
    const service = new AQAListeningAssessmentService();
    
    console.log('Testing listening service...');
    
    // Test getAssessmentsByLevel
    const assessments = await service.getAssessmentsByLevel('foundation', 'es');
    console.log('Assessments found:', assessments);
    
    // Test getAssessmentByLevel
    const assessment = await service.getAssessmentByLevel('foundation', 'es', 'paper-1');
    console.log('Single assessment found:', assessment);
    
    if (assessment) {
      // Test getAssessmentQuestions
      const questions = await service.getAssessmentQuestions(assessment.id);
      console.log('Questions found:', questions?.length);
      
      return NextResponse.json({
        success: true,
        assessments: assessments,
        assessment: assessment,
        questionsCount: questions?.length || 0,
        firstQuestion: questions?.[0] || null
      });
    }
    
    return NextResponse.json({
      success: false,
      message: 'No assessment found',
      assessments: assessments
    });
    
  } catch (error) {
    console.error('Service test error:', error);
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
}
