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
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 45000, // 45 second timeout for OpenAI API calls
    maxRetries: 2, // Retry failed requests twice
  });
}

// Create a new router instance for each request to avoid shared state
function createWorksheetRouter() {
  const openai = initOpenAI();
  return new WorksheetRouter(openai);
}

export const dynamic = 'force-dynamic';
export const maxDuration = 60; // 60 seconds timeout for worksheet generation

export async function POST(req: Request) {
  const startTime = Date.now();
  console.log(`[WORKSHEET GEN] Request started at ${new Date().toISOString()}`);
  
  try {
    const body = await req.json();
    console.log(`[WORKSHEET GEN] Request body parsed in ${Date.now() - startTime}ms`);

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
    
    // Use getUser() instead of getSession() for security - authenticates with Supabase Auth server
    const { data: { user } } = await supabase.auth.getUser();

    // Create a consistent anonymousId for guest users
    let anonymousId = cookieStore.get('worksheet_guest_id')?.value;
    if (!anonymousId) {
      anonymousId = `guest-${crypto.randomUUID()}`;
    }
    
    // Use the user ID if authenticated, otherwise use the anonymousId
    const userId = user?.id || anonymousId;
    const isGuest = !user;

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
      advancedOptions: {
        ...(body.advancedOptions || {}),
        // Pedagogical parameters for reading comprehension and other templates
        textType: body.textType,
        tenseFocus: body.tenseFocus,
        personFocus: body.personFocus,
        yearLevel: body.yearLevel,
      },
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
  if (
    request.template !== 'reading_comprehension' &&
    request.template !== 'vocabulary_practice' &&
    request.template !== 'grammar_exercises'
  ) {
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

  // For reading comprehension, vocabulary practice, and grammar exercises, include the raw content and metadata
  if ((request.template === 'reading_comprehension' || request.template === 'vocabulary_practice' || request.template === 'grammar_exercises') && (worksheet as any).rawContent) {
    console.log(`[Database] Including rawContent for ${request.template} template`);
    console.log(`[Database] rawContent keys:`, Object.keys((worksheet as any).rawContent || {}));
    console.log(`[Database] rawContent.exercises length:`, ((worksheet as any).rawContent?.exercises || []).length);
    if ((worksheet as any).rawContent?.exercises?.length > 0) {
      console.log(`[Database] First exercise:`, JSON.stringify((worksheet as any).rawContent.exercises[0], null, 2));
    }
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

  // Max items per server-generated sub-section to avoid page overflow when
  // converting HTML -> PDF in the browser. Tune these values as needed.
  const maxItemsByType: Record<string, number> = {
    matching: 10,
    fill_in_blank: 10,
    multiple_choice: 6,
    error_correction: 8,
    translation: 6,
    translation_both_ways: 5,
    word_order: 6,
  };

  function chunk(arr: any[], size: number) {
    const out: any[] = [];
    for (let i = 0; i < arr.length; i += size) out.push(arr.slice(i, i + size));
    return out;
  }

  function renderQuestion(q: any, qIndex: number, exerciseType?: string) {
    const qNum = qIndex + 1;
    if (exerciseType === 'multiple_choice') {
      return `
        <div class="question">
          <div class="question-number">${qNum}.</div>
          <div class="question-text">${q.question || q.text || q.sentence || ''}</div>
          ${q.options && q.options.length ? `
            <ul class="options">
              ${q.options.map((opt: string, oi: number) => `<li>${String.fromCharCode(65 + oi)}. ${opt}</li>`).join('')}
            </ul>
          ` : ''}
        </div>
      `;
    }

    if (exerciseType === 'matching') {
      return `
        <div class="matching-item">
          <span>${q.left || q.spanish || q.term || q.question || ''}</span>
          <span>__________</span>
        </div>
      `;
    }

    // Default: show sentence and an answer line
    return `
      <div class="question">
        <div class="question-number">${qNum}.</div>
        <div class="question-text">${q.question || q.text || q.sentence || ''}</div>
        <div class="answer-space"></div>
      </div>
    `;
  }

  // Build body sections, splitting large exercise lists into smaller "sub-sections"
  const bodySections: string[] = [];
  sections.forEach((section: any, sIndex: number) => {
    const exType = section.type || section.template || 'generic';
    // Use slightly more conservative defaults to reduce page overflow
    const max = maxItemsByType[exType] || 6;
    const questions = section.questions || [];
    const chunks = chunk(questions, max);

    chunks.forEach((qChunk, chunkIndex) => {
      bodySections.push(`
        <div class="section">
          <div class="section-title">Section ${sIndex + 1}${chunkIndex > 0 ? ` — continued (${chunkIndex})` : ''}: ${section.title || exType}</div>
          ${section.instructions ? `<p><em>${section.instructions}</em></p>` : ''}
          ${qChunk.map((q: any, qi: number) => renderQuestion(q, qi + (chunkIndex * max), exType)).join('')}
        </div>
      `);
    });
  });

  // If an answerKey exists on the worksheet, render a hidden teacher answers section
  let answersSection = '';
  if ((worksheet as any).answerKey) {
    const ak = (worksheet as any).answerKey;
    const answersHtml = Object.keys(ak).map(k => {
      const item = ak[k];
      const answerText = typeof item.answer === 'string' ? item.answer : (Array.isArray(item.answer) ? item.answer.join(', ') : String(item.answer));
      const explanation = item.explanation ? `<div class="explanation">${item.explanation}</div>` : '';
      return `<div class="answer-row"><strong>${k}</strong>: ${answerText}${explanation}</div>`;
    }).join('');

    answersSection = `
      <div class="section teacher-answers" id="answers">
        <div class="section-title">Teacher Answer Key (hidden)</div>
        <div class="instruction">This section is for teachers. It can be revealed in the editor or printed separately.</div>
        ${answersHtml}
      </div>
    `;
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${worksheet.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; }
        body {
          font-family: 'Open Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          color: #1f2937;
          background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
          margin: 0;
          padding: 20px;
          line-height: 1.6;
        }
        .container {
          max-width: 8.5in;
          margin: 0 auto;
          background: #ffffff;
          padding: 32px;
          border-radius: 16px;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
          border: 1px solid #e5e7eb;
        }
        .header {
          text-align: center;
          padding-bottom: 24px;
          border-bottom: 3px solid linear-gradient(90deg, #3b82f6, #8b5cf6);
          border-bottom-style: solid;
          margin-bottom: 32px;
        }
        .title {
          font-family: 'Fredoka One', cursive;
          font-size: 36px;
          color: #1e40af;
          margin: 0 0 8px 0;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          background: linear-gradient(135deg, #3b82f6, #8b5cf6);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .meta {
          color: #6b7280;
          font-size: 14px;
          margin-top: 8px;
          font-weight: 500;
        }
        .instructions {
          background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
          border: 2px solid #f59e0b;
          border-left: 6px solid #f59e0b;
          padding: 20px 24px;
          margin: 24px 0 32px 0;
          border-radius: 12px;
          font-weight: 600;
          color: #92400e;
          box-shadow: 0 4px 6px -1px rgba(245, 158, 11, 0.1);
        }
        .instructions strong {
          color: #78350f;
          font-size: 18px;
          display: block;
          margin-bottom: 8px;
        }
        .section {
          margin-bottom: 28px;
          padding: 24px;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          border-radius: 12px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
          border: 1px solid #e5e7eb;
          page-break-inside: avoid;
          break-inside: avoid;
          transition: transform 0.2s ease;
        }
        .section:hover {
          transform: translateY(-1px);
          box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .section-title {
          font-size: 18px;
          color: #1f2937;
          font-weight: 700;
          margin-bottom: 16px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          align-items: center;
        }
        .section-title:before {
          content: '📝';
          margin-right: 8px;
          font-size: 20px;
        }
        .question {
          margin-bottom: 16px;
          padding: 16px 20px;
          border-radius: 8px;
          background: linear-gradient(135deg, #f8fafc 0%, #ffffff 100%);
          border: 1px solid #e2e8f0;
          transition: all 0.2s ease;
        }
        .question:hover {
          background: linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%);
          border-color: #cbd5e1;
        }
        .question-number {
          font-weight: 700;
          color: #3b82f6;
          margin-bottom: 6px;
          font-size: 16px;
        }
        .question-text {
          margin-bottom: 10px;
          font-weight: 500;
          color: #374151;
        }
        .options {
          list-style: none;
          padding: 0;
          margin: 12px 0;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
        }
        .options li {
          padding: 10px 14px;
          background: #ffffff;
          border-radius: 6px;
          border: 2px solid #e2e8f0;
          font-weight: 500;
          color: #475569;
          transition: all 0.2s ease;
        }
        .options li:hover {
          border-color: #3b82f6;
          background: #eff6ff;
        }
        .answer-space {
          min-height: 32px;
          border-bottom: 3px solid #3b82f6;
          margin-top: 8px;
          border-radius: 2px;
          background: linear-gradient(90deg, transparent 0%, #eff6ff 50%, transparent 100%);
        }
        .matching-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px 16px;
          background: #ffffff;
          border-radius: 8px;
          border: 2px solid #e2e8f0;
          margin-bottom: 8px;
          transition: all 0.2s ease;
        }
        .matching-item:hover {
          border-color: #8b5cf6;
          background: #faf5ff;
        }
        .matching-item span:first-child {
          font-weight: 600;
          color: #7c3aed;
        }
        .matching-item span:last-child {
          font-weight: 500;
          color: #6b7280;
          border-bottom: 2px dashed #cbd5e1;
          padding-bottom: 2px;
          min-width: 120px;
          text-align: center;
        }
        .teacher-answers {
          display: none;
          margin-top: 40px;
          padding: 24px;
          background: #fef3c7;
          border: 2px solid #f59e0b;
          border-radius: 12px;
        }
        .answer-row {
          padding: 8px 12px;
          background: #ffffff;
          border-radius: 6px;
          border: 1px dashed #d97706;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
        }
        .explanation {
          font-size: 12px;
          color: #92400e;
          margin-top: 4px;
          font-style: italic;
        }
        @media print {
          body {
            background: #fff;
            padding: 0;
          }
          .container {
            box-shadow: none;
            border: none;
            padding: 20px;
            border-radius: 0;
          }
          .section {
            page-break-inside: avoid;
            break-inside: avoid;
            margin-bottom: 20px;
          }
          .teacher-answers {
            display: block;
            page-break-before: always;
          }
        }
        @media (max-width: 768px) {
          .container {
            padding: 20px;
          }
          .title {
            font-size: 28px;
          }
          .options {
            grid-template-columns: 1fr;
          }
          .matching-item {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .matching-item span:last-child {
            min-width: auto;
            text-align: left;
          }
        }
    </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="title">${worksheet.title}</div>
      <div class="meta">${worksheet.subject || ''}${worksheet.topic ? ` • ${worksheet.topic}` : ''} — Difficulty: ${worksheet.difficulty || 'N/A'} — Time: ${worksheet.estimatedTimeMinutes || '—'} mins</div>
    </div>

    <div class="instructions"><strong>Instructions:</strong> ${instructions}</div>

    ${bodySections.join('')}

  ${answersSection}

  </div>
</body>
</html>`;
}
