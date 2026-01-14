import { NextRequest, NextResponse } from 'next/server';
import { createServiceRoleClient } from '@/utils/supabase/client';
import Groq from 'groq-sdk';

export const dynamic = 'force-dynamic';

// Use Groq with GPT OSS 20B for professional-grade writing assessment
// Catches subtle errors (A-Level subjunctive, German word-order) that smaller models miss
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

// AQA Writing mark scheme criteria
const FOUNDATION_CRITERIA = {
    'photo-description': {
        maxMarks: 10,
        criteria: {
            communication: { max: 10, description: 'Communication of valid sentences (2 marks per sentence)' }
        }
    },
    'short-message': {
        maxMarks: 16,
        criteria: {
            content: { max: 8, description: 'Communication of message and conveying opinions' },
            languageRange: { max: 4, description: 'Range and variety of language' },
            accuracy: { max: 4, description: 'Grammatical accuracy and spelling' }
        }
    },
    'translation': {
        maxMarks: 10,
        criteria: {
            accuracy: { max: 10, description: 'Accurate translation with correct grammar' }
        }
    },
    'extended-writing': {
        maxMarks: 15,
        criteria: {
            communication: { max: 10, description: 'Communication and development of ideas (AO2)' },
            quality: { max: 5, description: 'Knowledge of vocabulary and grammar (AO3)' }
        }
    }
};

interface GradingResult {
    totalScore: number;
    maxScore: number;
    breakdown: Record<string, number>;
    feedback: string;
    suggestions: string[];
}

async function gradeWithAI(
    questionType: string,
    studentResponse: string,
    questionData: any,
    targetLanguage: string = 'Spanish'
): Promise<GradingResult> {
    const criteria = FOUNDATION_CRITERIA[questionType as keyof typeof FOUNDATION_CRITERIA] || FOUNDATION_CRITERIA['short-message'];

    const systemPrompt = `You are an expert GCSE ${targetLanguage} examiner for AQA. Grade the following student response according to the mark scheme criteria.

Question Type: ${questionType}
Maximum Marks: ${criteria.maxMarks}

Marking Criteria:
${Object.entries(criteria.criteria).map(([key, val]: [string, any]) =>
        `- ${key} (max ${val.max} marks): ${val.description}`
    ).join('\n')}

Provide your response in JSON format with:
{
  "breakdown": { ${Object.keys(criteria.criteria).map(k => `"${k}": <score>`).join(', ')} },
  "feedback": "<2-3 sentence summary of performance>",
  "suggestions": ["<improvement suggestion 1>", "<improvement suggestion 2>"]
}

Be fair but realistic. Award partial marks where appropriate. Foundation tier students should be marked according to Foundation tier expectations.`;

    const userPrompt = `Question: ${JSON.stringify(questionData.prompt || questionData.instructions || questionData)}

Student Response:
${studentResponse}

Grade this response:`;

    try {
        const completion = await groq.chat.completions.create({
            model: 'openai/gpt-oss-20b',
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ],
            temperature: 0.3, // Lower temperature for more consistent grading
            max_tokens: 1024,
            response_format: { type: 'json_object' }
        });

        const response = completion.choices[0]?.message?.content;
        if (!response) {
            throw new Error('No response from AI');
        }

        // Clean response of markdown code blocks if present
        let jsonStr = response;
        const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
        if (jsonMatch) {
            jsonStr = jsonMatch[1];
        }

        // GPT OSS 20B sometimes returns Python-style single-quoted JSON - convert to valid JSON
        jsonStr = jsonStr.trim()
            .replace(/'/g, '"')  // Convert all single quotes to double quotes
            .replace(/(\w)"(\w)/g, "$1'$2");  // Restore apostrophes within words (e.g., don't, it's)

        const parsed = JSON.parse(jsonStr);
        const breakdown = parsed.breakdown || {};

        // Calculate total ensuring we don't exceed max marks
        let totalScore = 0;
        Object.entries(breakdown).forEach(([key, val]: [string, any]) => {
            const criterionMax = (criteria.criteria as any)[key]?.max || 0;
            const clampedScore = Math.min(Math.max(0, val), criterionMax);
            breakdown[key] = clampedScore;
            totalScore += clampedScore;
        });

        return {
            totalScore: Math.min(totalScore, criteria.maxMarks),
            maxScore: criteria.maxMarks,
            breakdown,
            feedback: parsed.feedback || 'No feedback provided',
            suggestions: parsed.suggestions || []
        };

    } catch (error) {
        console.error('AI grading error:', error);
        // Fallback: return pending marks requiring teacher review
        return {
            totalScore: 0,
            maxScore: criteria.maxMarks,
            breakdown: Object.fromEntries(Object.keys(criteria.criteria).map(k => [k, 0])),
            feedback: 'Automated grading failed. Please review manually.',
            suggestions: ['AI grading encountered an error']
        };
    }
}

export async function POST(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();
        const body = await request.json();
        const { resultId, questionId, studentId } = body;

        console.log('[AI Grading] Request:', { resultId, questionId, studentId });

        if (!resultId || !questionId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Get the question response
        const { data: response, error: fetchError } = await supabase
            .from('aqa_writing_question_responses')
            .select('id, response_data, score, max_score')
            .eq('result_id', resultId)
            .eq('question_id', questionId)
            .single();

        if (fetchError || !response) {
            console.error('[AI Grading] Fetch error:', fetchError);
            return NextResponse.json({ error: 'Response not found', details: fetchError }, { status: 404 });
        }

        // Get the question details
        const { data: question } = await supabase
            .from('aqa_writing_questions')
            .select('question_type, question_data, instructions')
            .eq('id', questionId)
            .single();

        if (!question) {
            return NextResponse.json({ error: 'Question not found' }, { status: 404 });
        }

        // Extract student's written response
        let studentResponse = '';
        if (typeof response.response_data === 'string') {
            studentResponse = response.response_data;
        } else if (response.response_data?.text) {
            studentResponse = response.response_data.text;
        } else if (response.response_data?.response) {
            studentResponse = response.response_data.response;
        } else {
            studentResponse = JSON.stringify(response.response_data);
        }

        // Grade with AI
        const gradingResult = await gradeWithAI(
            question.question_type,
            studentResponse,
            { prompt: question.instructions, ...question.question_data }
        );

        // Update the response with AI grades
        await supabase
            .from('aqa_writing_question_responses')
            .update({
                score: gradingResult.totalScore,
                max_score: gradingResult.maxScore,
                feedback: gradingResult.feedback,
                is_correct: gradingResult.totalScore >= gradingResult.maxScore * 0.5,
                ai_grading: {
                    breakdown: gradingResult.breakdown,
                    suggestions: gradingResult.suggestions,
                    graded_at: new Date().toISOString(),
                    model: 'openai/gpt-oss-20b'
                }
            })
            .eq('id', response.id);

        // Recalculate total for the result
        const { data: allResponses } = await supabase
            .from('aqa_writing_question_responses')
            .select('score, max_score')
            .eq('result_id', resultId);

        const totalScore = allResponses?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) || 0;
        const maxScore = allResponses?.reduce((sum: number, r: any) => sum + (r.max_score || 0), 0) || 1;
        const percentageScore = (totalScore / maxScore) * 100;

        await supabase
            .from('aqa_writing_results')
            .update({ total_score: totalScore, percentage_score: percentageScore })
            .eq('id', resultId);

        console.log(`[AI Grading] Success: ${gradingResult.totalScore}/${gradingResult.maxScore}`);

        return NextResponse.json({
            success: true,
            grading: gradingResult,
            totalScore,
            maxScore,
            percentageScore: Math.round(percentageScore)
        });

    } catch (error: any) {
        console.error('[AI Grading] Exception:', error);
        return NextResponse.json({ error: 'Server error', message: error?.message }, { status: 500 });
    }
}

// GET endpoint to grade all pending responses for a result
export async function GET(request: NextRequest) {
    try {
        const supabase = createServiceRoleClient();
        const searchParams = request.nextUrl.searchParams;
        const resultId = searchParams.get('resultId');

        if (!resultId) {
            return NextResponse.json({ error: 'Missing resultId' }, { status: 400 });
        }

        // Get all ungraded responses for this result
        const { data: responses } = await supabase
            .from('aqa_writing_question_responses')
            .select('id, question_id, response_data, score')
            .eq('result_id', resultId)
            .or('score.is.null,score.eq.0');

        if (!responses || responses.length === 0) {
            return NextResponse.json({ message: 'No pending responses to grade', graded: 0 });
        }

        let gradedCount = 0;
        const results = [];

        for (const response of responses) {
            // Get question details
            const { data: question } = await supabase
                .from('aqa_writing_questions')
                .select('question_type, question_data, instructions')
                .eq('id', response.question_id)
                .single();

            if (!question) continue;

            // Extract student response
            let studentResponse = '';
            if (typeof response.response_data === 'string') {
                studentResponse = response.response_data;
            } else if (response.response_data?.text) {
                studentResponse = response.response_data.text;
            } else if (response.response_data?.response) {
                studentResponse = response.response_data.response;
            } else {
                studentResponse = JSON.stringify(response.response_data);
            }

            // Grade with AI
            const gradingResult = await gradeWithAI(
                question.question_type,
                studentResponse,
                { prompt: question.instructions, ...question.question_data }
            );

            // Update response
            await supabase
                .from('aqa_writing_question_responses')
                .update({
                    score: gradingResult.totalScore,
                    max_score: gradingResult.maxScore,
                    feedback: gradingResult.feedback,
                    is_correct: gradingResult.totalScore >= gradingResult.maxScore * 0.5,
                    ai_grading: {
                        breakdown: gradingResult.breakdown,
                        suggestions: gradingResult.suggestions,
                        graded_at: new Date().toISOString(),
                        model: 'openai/gpt-oss-20b'
                    }
                })
                .eq('id', response.id);

            gradedCount++;
            results.push({
                questionId: response.question_id,
                score: gradingResult.totalScore,
                maxScore: gradingResult.maxScore
            });
        }

        // Recalculate total
        const { data: allResponses } = await supabase
            .from('aqa_writing_question_responses')
            .select('score, max_score')
            .eq('result_id', resultId);

        const totalScore = allResponses?.reduce((sum: number, r: any) => sum + (r.score || 0), 0) || 0;
        const maxScore = allResponses?.reduce((sum: number, r: any) => sum + (r.max_score || 0), 0) || 1;
        const percentageScore = (totalScore / maxScore) * 100;

        await supabase
            .from('aqa_writing_results')
            .update({ total_score: totalScore, percentage_score: percentageScore })
            .eq('id', resultId);

        return NextResponse.json({
            success: true,
            graded: gradedCount,
            results,
            totalScore,
            maxScore,
            percentageScore: Math.round(percentageScore)
        });

    } catch (error: any) {
        console.error('[AI Grading Batch] Exception:', error);
        return NextResponse.json({ error: 'Server error', message: error?.message }, { status: 500 });
    }
}
