import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import puppeteer from 'puppeteer';

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface WorksheetRequest {
  subject: string;
  language: string;
  level: string;
  topic: string;
  worksheetType: 'grammar' | 'vocabulary' | 'mixed';
  exerciseTypes: string[];
  customPrompt?: string;
}

interface WorksheetContent {
  title: string;
  studentInfo: {
    nameField: boolean;
    dateField: boolean;
    classField: boolean;
  };
  sections: Array<{
    title: string;
    type: string;
    instructions: string;
    exercises: Array<{
      question: string;
      options?: string[];
      answer?: string;
      type: 'fill-blank' | 'multiple-choice' | 'translation' | 'conjugation' | 'short-answer';
    }>;
  }>;
  referenceSection?: {
    title: string;
    content: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    // Check admin authentication
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    // Check if user is admin
    const { data: userProfile } = await supabase
      .from('user_profiles')
      .select('role')
      .eq('user_id', user.id)
      .single();

    if (userProfile?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    // Parse request
    const body: WorksheetRequest = await request.json();
    const { subject, language, level, topic, worksheetType, exerciseTypes, customPrompt } = body;

    // Validate required fields
    if (!subject || !language || !level || !topic || !worksheetType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Generate worksheet content using OpenAI
    const systemPrompt = `You are an expert language teacher creating professional worksheets for Language Gems.

Create a comprehensive ${language} ${worksheetType} worksheet for ${level} level students on the topic of "${topic}".

Requirements:
- Target level: ${level}
- Focus: ${worksheetType}
- Exercise types: ${exerciseTypes.join(', ')}
- Must include: Student info section (NAME, DATE, CLASS fields)
- Must include: Clear instructions for each section
- Must include: Answer key or reference section
${customPrompt ? `- Additional requirements: ${customPrompt}` : ''}

Generate a JSON response with this exact structure:
{
  "title": "Worksheet Title",
  "studentInfo": {
    "nameField": true,
    "dateField": true,
    "classField": true
  },
  "sections": [
    {
      "title": "Section Title",
      "type": "exercise_type",
      "instructions": "Clear instructions for students",
      "exercises": [
        {
          "question": "Question text",
          "options": ["A) Option 1", "B) Option 2", "C) Option 3", "D) Option 4"],
          "answer": "Correct answer",
          "type": "multiple-choice"
        }
      ]
    }
  ],
  "referenceSection": {
    "title": "Reference/Answer Key",
    "content": "Reference material or answers"
  }
}

Exercise types to use: fill-blank, multiple-choice, translation, conjugation, short-answer
Make it engaging, educational, and appropriate for ${level} level.`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Generate the worksheet now.` }
      ],
      temperature: 0.7,
      max_tokens: 3000
    });

    let worksheetContent: WorksheetContent;
    try {
      const responseText = completion.choices[0].message.content || '';
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }
      worksheetContent = JSON.parse(jsonMatch[0]);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', parseError);
      return NextResponse.json({ error: 'Failed to generate worksheet content' }, { status: 500 });
    }

    // Generate HTML using our intelligent template
    const html = generateWorksheetHTML(worksheetContent);

    // Generate PDF using Puppeteer
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      },
      printBackground: true
    });

    await browser.close();

    // Save PDF file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${worksheetContent.title.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.pdf`;
    const filepath = path.join(process.cwd(), 'public', 'worksheets', filename);

    // Ensure directory exists
    const fs = require('fs');
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await writeFile(filepath, pdfBuffer);

    return NextResponse.json({
      success: true,
      worksheet: worksheetContent,
      pdfUrl: `/worksheets/${filename}`,
      filename: filename
    });

  } catch (error) {
    console.error('Worksheet generation error:', error);
    return NextResponse.json({ 
      error: 'Failed to generate worksheet',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

function generateWorksheetHTML(content: WorksheetContent): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Fredoka+One&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            line-height: 1.6;
            color: #333;
            background: white;
        }
        
        .page {
            width: 8.5in;
            min-height: 11in;
            margin: 0 auto;
            background: white;
            display: flex;
            flex-direction: column;
            page-break-after: always;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Header */
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #F59E0B 100%);
            color: white;
            padding: 20px;
            text-align: center;
            position: relative;
            height: 1.5in;
            display: flex;
            flex-direction: column;
            justify-content: center;
        }
        
        .header::before {
            content: '💎';
            position: absolute;
            left: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
        }
        
        .header::after {
            content: '💎';
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 24px;
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 28px;
            margin-bottom: 8px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header .subtitle {
            font-size: 16px;
            font-weight: 600;
        }
        
        /* Student Info */
        .student-info {
            background: #F8FAFC;
            border: 2px solid #E2E8F0;
            border-radius: 8px;
            padding: 20px;
            margin: 20px;
            height: 0.8in;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .student-field {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .student-field label {
            font-weight: 600;
            color: #374151;
        }
        
        .student-field .line {
            border-bottom: 2px solid #6B7280;
            width: 150px;
            height: 2px;
        }
        
        /* Content */
        .content {
            flex: 1;
            padding: 0 20px;
            display: flex;
            flex-direction: column;
        }
        
        .section {
            margin-bottom: 30px;
            break-inside: avoid;
        }
        
        .section-title {
            background: linear-gradient(135deg, #8B5CF6, #F59E0B);
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .section-instructions {
            background: #F1F5F9;
            padding: 10px 15px;
            border-radius: 6px;
            margin-bottom: 15px;
            font-style: italic;
            color: #475569;
        }
        
        .exercise {
            margin-bottom: 20px;
            padding: 15px;
            border: 1px solid #E2E8F0;
            border-radius: 6px;
            background: white;
        }
        
        .exercise-question {
            font-weight: 600;
            margin-bottom: 10px;
            color: #374151;
        }
        
        .exercise-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-top: 10px;
        }
        
        .option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 5px 0;
        }
        
        .option-circle {
            width: 16px;
            height: 16px;
            border: 2px solid #6B7280;
            border-radius: 50%;
            flex-shrink: 0;
        }
        
        .answer-line {
            border-bottom: 2px dashed #6B7280;
            height: 24px;
            margin: 8px 0;
            min-width: 200px;
        }
        
        .reference-section {
            background: #EFF6FF;
            border: 2px solid #3B82F6;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .reference-title {
            color: #1E40AF;
            font-size: 18px;
            font-weight: 700;
            margin-bottom: 15px;
        }
        
        .reference-content {
            color: #374151;
            white-space: pre-line;
        }
        
        /* Footer */
        .footer {
            margin-top: auto;
            background: linear-gradient(135deg, #8B5CF6, #F59E0B);
            color: white;
            text-align: center;
            padding: 15px;
            font-size: 12px;
            height: 0.6in;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        @media print {
            .page {
                margin: 0;
                page-break-after: always;
            }
            
            .page:last-child {
                page-break-after: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <h1>LANGUAGE GEMS</h1>
            <div class="subtitle">${content.title}</div>
        </div>
        
        ${content.studentInfo ? `
        <div class="student-info">
            ${content.studentInfo.nameField ? `
            <div class="student-field">
                <label>NAME:</label>
                <div class="line"></div>
            </div>
            ` : ''}
            ${content.studentInfo.dateField ? `
            <div class="student-field">
                <label>DATE:</label>
                <div class="line"></div>
            </div>
            ` : ''}
            ${content.studentInfo.classField ? `
            <div class="student-field">
                <label>CLASS:</label>
                <div class="line"></div>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        <div class="content">
            ${content.sections.map(section => `
            <div class="section">
                <div class="section-title">${section.title}</div>
                ${section.instructions ? `<div class="section-instructions">${section.instructions}</div>` : ''}
                
                ${section.exercises.map((exercise, index) => `
                <div class="exercise">
                    <div class="exercise-question">${index + 1}. ${exercise.question}</div>
                    
                    ${exercise.type === 'multiple-choice' && exercise.options ? `
                    <div class="exercise-options">
                        ${exercise.options.map(option => `
                        <div class="option">
                            <div class="option-circle"></div>
                            <span>${option}</span>
                        </div>
                        `).join('')}
                    </div>
                    ` : `
                    <div class="answer-line"></div>
                    `}
                </div>
                `).join('')}
            </div>
            `).join('')}
            
            ${content.referenceSection ? `
            <div class="reference-section">
                <div class="reference-title">${content.referenceSection.title}</div>
                <div class="reference-content">${content.referenceSection.content}</div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            www.languagegems.com - Unlock the Gems of Language Learning
        </div>
    </div>
</body>
</html>`;
} 