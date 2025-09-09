import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { WorksheetRequest, WorksheetResponse, Worksheet } from '@/lib/worksheets/core/types';
import { WorksheetRouter } from '@/lib/worksheets/router';
import { findSubject, getParentSubject } from '@/lib/subjects';
import { OpenAI } from 'openai';
import { createProgressJob, updateProgress, markJobFailed, markJobComplete, getJobProgress } from '@/lib/progress';
import { generateCacheKey, getWorksheetCache, setWorksheetCache } from '@/lib/worksheets/cache';
import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';
import { enforceGenerationLimits, recordGenerationUsage } from '@/lib/limits/generation-limits';
import { ErrorLogger } from '@/lib/error-logger';

// Initialize OpenAI client
function initOpenAI() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

// Create a new router instance for each request to avoid shared state
function createWorksheetRouter() {
  const openai = initOpenAI();
  return new WorksheetRouter(openai);
}

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Get user ID from auth session
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
          set(name: string, value: string, options: any) {
            cookieStore.set(name, value, options);
          },
          remove(name: string, options: any) {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          },
        },
      }
    );
    const { data: { session } } = await supabase.auth.getSession();

    // Create a consistent anonymousId for guest users
    let anonymousId = cookieStore.get('worksheet_guest_id')?.value;
    if (!anonymousId) {
      anonymousId = `guest-${crypto.randomUUID()}`;
    }
    
    // Use the user ID if authenticated, otherwise use the anonymousId
    const userId = session?.user?.id || anonymousId;
    const isGuest = !session?.user;

    console.log(`User ID for worksheet generation: ${userId.substring(0, 8)}... (${isGuest ? 'guest' : 'authenticated'})`);

    // Check if user is premium (for now, everyone is free tier)
    const isUserPremium = false;

    // Apply generation limits (generous for free users)
    if (!isUserPremium) {
      const userType = isGuest ? 'guest' : 'registered';
      const limitCheck = await enforceGenerationLimits(userId, 'worksheet', userType);
      
      console.log(`[Worksheets] ${userType} user ${userId.substring(0,8)}... generation limit check: ${limitCheck.allowed ? 'Allowed' : 'Denied'} - ${limitCheck.remaining}/${limitCheck.limit} remaining`);
      
      if (!limitCheck.allowed) {
        return NextResponse.json(
          { error: limitCheck.message },
          { status: 403 }
        );
      }
    }

    // Validate required fields
    if (!body.subject) {
      return NextResponse.json(
        { error: 'Subject is required' },
        { status: 400 }
      );
    }

    const subjectFromInput = body.subject;
    const foundSubjectMeta = findSubject(subjectFromInput);

    if (!foundSubjectMeta) {
      // Log this error to the admin dashboard
      try {
        await ErrorLogger.worksheetGeneration(
          `Unsupported subject requested: ${subjectFromInput}`,
          userId,
          {
            requestedSubject: subjectFromInput,
            availableSubjects: 'User requested a subject not in our subjects list',
            timestamp: new Date().toISOString(),
            errorType: 'subject_not_found'
          }
        );
      } catch (logError) {
        console.error('Failed to log unsupported subject error:', logError);
      }
      
      return NextResponse.json(
        { error: `Unsupported subject: ${subjectFromInput}` },
        { status: 400 }
      );
    }

    let subjectForRouter = foundSubjectMeta.name;
    let topicForRouter = body.topic || '';
    let subtopicForRouter = body.subtopic || '';

    const parentInfo = getParentSubject(foundSubjectMeta.name);
    if (parentInfo) {
      subjectForRouter = parentInfo.name;
      subtopicForRouter = topicForRouter;
      topicForRouter = foundSubjectMeta.name;
    }

    console.log(`Original subject: "${subjectFromInput}", Resolved to: ${foundSubjectMeta.name}, Routing as subject: "${subjectForRouter}", topic: "${topicForRouter}", subtopic: "${subtopicForRouter}"`);

    const jobId = uuidv4();

    // Create a new progress job
    console.log(`[Progress] Created job: ${jobId}`);
    await createProgressJob(jobId);

    // Update progress to 5%
    await updateProgress(jobId, 'validating', 5, 'Validating worksheet parameters');

    // Prepare the worksheet request
    const worksheetRequest: WorksheetRequest = {
      // Template-specific fields
      template: body.template,

      // Core fields
      subject: subjectForRouter,
      topic: topicForRouter,
      subtopic: subtopicForRouter,
      difficulty: body.difficulty || 'medium',
      targetQuestionCount: body.targetQuestionCount || 10,
      questionTypes: body.questionTypes || ['multiple_choice'],
      theme: body.theme || 'standard',
      gradeLevel: body.gradeLevel || 7,
      curriculum: body.curriculum || '',
      examBoard: body.examBoard || '',
      language: body.language || 'English',
      customPrompt: body.customPrompt || '',
      targetLanguage: body.targetLanguage || subjectForRouter,
      advancedOptions: body.advancedOptions || {},
      originalSubject: subjectFromInput,
      jobId: jobId,
      generateSeoAndTags: true,
      userId: userId,
      customVocabulary: body.customVocabulary || '',
      languageSkillFocus: body.languageSkillFocus || [],

      // Vocabulary system integration
      curriculumLevel: body.curriculumLevel || 'KS3',
      tier: body.tier,
      category: body.category,
      subcategory: body.subcategory
    };

    console.log(`Full worksheet request:`, worksheetRequest);

    // Send immediate response with job ID
    const response = NextResponse.json({ jobId });

    // Start the worksheet generation process asynchronously
    console.log(`Starting async worksheet generation for job: ${jobId}`);

    // Don't await this - we want to return immediately while processing continues
    generateWorksheetAsync(worksheetRequest, userId, isGuest);

    return response;
  } catch (error: any) {
    console.error('Error in worksheet generation:', error);
    return NextResponse.json(
      { error: `Internal server error: ${error.message}` },
      { status: 500 }
    );
  }
}

// Asynchronous worksheet generation function
async function generateWorksheetAsync(request: WorksheetRequest, userId: string, isGuest: boolean) {
  const { jobId } = request;

  try {
    await updateProgress(jobId!, 'fetchSubject', 20, 'Fetching subject details');

    // Check cache first
    const cacheKey = generateCacheKey(request);
    const cachedWorksheet = getWorksheetCache(cacheKey);

    if (cachedWorksheet) {
      console.log(`[Cache] Using cached worksheet for job: ${jobId}`);
      await updateProgress(jobId!, 'completed', 100, 'Retrieved cached worksheet');
      await markJobComplete(jobId!, cachedWorksheet);
      return;
    }

    // Generate worksheet
    await updateProgress(jobId!, 'aiProcessing', 30, 'Generating worksheet with AI');
    const worksheetRouter = createWorksheetRouter(); // Create new instance for each request
    const result: WorksheetResponse = await worksheetRouter.generateWorksheet(request);

    await updateProgress(jobId!, 'parsing', 60, 'Parsing AI response');
    await updateProgress(jobId!, 'formatting', 70, 'Formatting worksheet content');

    // Ensure topic is set in the worksheet
    if (!result.worksheet.topic || result.worksheet.topic.trim() === '') {
      result.worksheet.topic = request.topic || request.subject || 'General Concepts';
    }

    // Add SEO Description and Tags if not present
    if (!result.worksheet.seo_description) {
      result.worksheet.seo_description = `A ${request.difficulty || 'medium'} difficulty ${request.subject} worksheet on ${result.worksheet.topic} for grade ${request.gradeLevel || 'school'} students.`;
    }

    if (!result.worksheet.tags) {
      result.worksheet.tags = [
        request.subject.toLowerCase(),
        result.worksheet.topic?.toLowerCase(),
        request.difficulty || 'medium'
      ].filter(Boolean);
    }

    // Cache the result
    setWorksheetCache(cacheKey, result);

    // Save worksheet to database
    let savedWorksheet = null;
    if (!isGuest) {
      try {
        savedWorksheet = await saveWorksheetToDatabase(result.worksheet, request, userId);
        console.log(`[Database] Saved worksheet with ID: ${savedWorksheet.id}`);
      } catch (saveError) {
        console.error('[Database] Failed to save worksheet:', saveError);
        // Don't fail the entire process if database save fails
      }
    }

    // Record usage
    await recordGenerationUsage(userId, 'worksheet');

    // Mark job as complete
    await updateProgress(jobId!, 'completed', 100, 'Worksheet generation complete');
    console.log(`Worksheet generation complete for job: ${jobId}`);

    // Include worksheet ID in the result if saved
    const finalResult = savedWorksheet ? {
      ...result,
      worksheetId: savedWorksheet.id
    } : result;

    await markJobComplete(jobId!, finalResult);

  } catch (error: any) {
    console.error(`Error generating worksheet for job ${jobId}:`, error);
    
    // Log error to admin dashboard
    try {
      await ErrorLogger.worksheetGeneration(
        `Worksheet generation failed for job ${jobId}: ${error.message || 'Unknown error'}`,
        request.userId,
        {
          jobId: jobId || 'unknown',
          requestDetails: {
            subject: request.subject,
            topic: request.topic,
            difficulty: request.difficulty,
            targetQuestionCount: request.targetQuestionCount,
            questionTypes: request.questionTypes
          },
          errorStack: error.stack,
          timestamp: new Date().toISOString()
        }
      );
    } catch (logError) {
      console.error('Failed to log error to admin dashboard:', logError);
    }
    
    await markJobFailed(jobId!, error.message || 'Unknown error');
  }
}

// Helper function to save worksheet to database
async function saveWorksheetToDatabase(worksheet: Worksheet, request: WorksheetRequest, userId: string) {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );

  // Generate HTML for the worksheet (skip for special templates that generate HTML on-demand)
  let html = null;
  if (request.template !== 'reading_comprehension' && request.template !== 'vocabulary_practice') {
    html = generateWorksheetHTML(worksheet);
    console.log('[Database] Generated HTML for standard worksheet');
  } else {
    console.log(`[Database] Skipping HTML generation for ${request.template} - will be generated on-demand`);
  }

  // Prepare content based on template type
  let content: any = {
    sections: worksheet.sections,
    instructions: worksheet.instructions,
    introduction: worksheet.introduction,
    answerKey: (worksheet as any).answerKey
  };

  // For reading comprehension and vocabulary practice, include the raw content and metadata
  if ((request.template === 'reading_comprehension' || request.template === 'vocabulary_practice') && (worksheet as any).rawContent) {
    console.log(`[Database] Including rawContent for ${request.template} template`);
    content = {
      ...content,
      rawContent: (worksheet as any).rawContent,
      metadata: (worksheet as any).metadata
    };
  }

  const { data, error } = await supabase
    .from('worksheets')
    .insert({
      title: worksheet.title,
      subject: worksheet.subject,
      topic: worksheet.topic,
      subtopic: request.subtopic,
      difficulty: worksheet.difficulty,
      template_id: request.template,
      content: content,
      html: html,
      user_id: userId,
      generation_params: {
        targetQuestionCount: request.targetQuestionCount,
        questionTypes: request.questionTypes,
        customVocabulary: request.customVocabulary,
        curriculumLevel: request.curriculumLevel,
        examBoard: request.examBoard,
        tier: request.tier
      },
      estimated_time_minutes: worksheet.estimatedTimeMinutes,
      question_count: request.targetQuestionCount || 10,
      seo_title: (worksheet as any).seo_title,
      seo_description: (worksheet as any).seo_description,
      seo_keywords: (worksheet as any).seo_keywords,
      tags: worksheet.tags || []
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to save worksheet: ${error.message}`);
  }

  return data;
}

// Helper function to generate HTML from worksheet
function generateWorksheetHTML(worksheet: Worksheet): string {
  const sections = worksheet.sections || [];
  const instructions = worksheet.instructions || 'Complete all sections carefully.';

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${worksheet.title}</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 15px;
        }

        .meta-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            font-size: 14px;
            color: #64748b;
        }

        .instructions {
            background: #f8fafc;
            border-left: 4px solid #4f46e5;
            padding: 15px 20px;
            margin-bottom: 30px;
            border-radius: 0 8px 8px 0;
        }

        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }

        .question {
            margin-bottom: 20px;
            padding: 15px;
            background: #fefefe;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }

        .question-number {
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 8px;
        }

        .question-text {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .options {
            list-style: none;
            padding: 0;
        }

        .options li {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: #f8fafc;
            border-radius: 4px;
            border-left: 3px solid #cbd5e1;
        }

        .answer-space {
            border-bottom: 1px solid #cbd5e1;
            min-height: 30px;
            margin: 10px 0;
        }

        .matching-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        @media print {
            body { margin: 0; padding: 15px; }
            .section { page-break-inside: avoid; }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${worksheet.title}</div>
        <div class="subtitle">${worksheet.subject}${worksheet.topic ? ` • ${worksheet.topic}` : ''}</div>
        <div class="meta-info">
            <span>Difficulty: <strong>${worksheet.difficulty}</strong></span>
            <span>Time: <strong>${worksheet.estimatedTimeMinutes} minutes</strong></span>
            <span>Date: <strong>_____________</strong></span>
        </div>
    </div>

    <div class="instructions">
        <strong>Instructions:</strong> ${instructions}
    </div>

    ${sections.map((section: any, index: number) => `
        <div class="section">
            <div class="section-title">Section ${index + 1}: ${section.title || section.type}</div>
            ${section.instructions ? `<p><em>${section.instructions}</em></p>` : ''}

            ${section.questions?.map((question: any, qIndex: number) => `
                <div class="question">
                    <div class="question-number">${qIndex + 1}.</div>
                    <div class="question-text">${question.question || question.text}</div>

                    ${question.type === 'multiple_choice' && question.options ? `
                        <ul class="options">
                            ${question.options.map((option: string, oIndex: number) => `
                                <li>${String.fromCharCode(65 + oIndex)}. ${option}</li>
                            `).join('')}
                        </ul>
                    ` : ''}

                    ${question.type === 'fill_in_blank' || question.type === 'translation' ? `
                        <div class="answer-space"></div>
                    ` : ''}

                    ${question.type === 'matching' ? `
                        <div class="matching-item">
                            <span>${question.left || question.term}</span>
                            <span>_____________</span>
                        </div>
                    ` : ''}
                </div>
            `).join('') || ''}
        </div>
    `).join('')}
</body>
</html>`;
}
