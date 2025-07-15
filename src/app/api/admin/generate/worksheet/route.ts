import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
// Removed puppeteer/chromium - using client-side html2pdf.js instead

// Initialize OpenAI with project-based API key support
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional: for organization-scoped keys
  project: process.env.OPENAI_PROJECT_ID, // Optional: for project-scoped keys
  dangerouslyAllowBrowser: false,
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
  introductoryExplanation?: {
    title: string;
    content: string;
  };
  referenceSection?: {
    title: string;
    conjugationTables?: Array<{
      verb: string;
      type: string;
      english: string;
    }>;
    content?: string;
  };
  sections: Array<{
    title: string;
    type: string;
    instructions: string;
    exercises: Array<{
      question: string;
      options?: string[];
      answer?: string;
      type: 'fill-blank' | 'multiple-choice' | 'translation' | 'conjugation' | 'short-answer' | 'error-correction' | 'conjugation-tables';
    }>;
  }>;
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

Create a comprehensive ${language} grammar worksheet for ${level} level students on the topic of "${topic}".

CRITICAL REQUIREMENTS - FOLLOW THIS EXACT STRUCTURE:

1. **Target Student**: ${level} level - structured for clear progression
2. **Worksheet Type**: Grammar (${topic})

**MANDATORY STRUCTURE FOR ALL GRAMMAR WORKSHEETS:**

🟩 **1. Introductory Explanation** (Include this as a reference section)
- Short, friendly grammar explanation in English
- When and why this grammar point is used
- Simple examples with translations
- Keep to 2-3 sentences max, very beginner-friendly

🟨 **2. Reference Conjugation Tables** (If applicable to grammar topic)
- Show complete conjugation examples 
- Include English translations
- Use regular verbs as examples (hablar, comer, vivir for Spanish)

🔡 **3. Practice Activities** (Create exactly these 4 sections):

**Section A: Multiple Choice - Select the Correct Form (6 items)**
- Focus on form recognition and pattern awareness
- Clear, simple questions with 3-4 options each
- MUST include exactly 6 exercises with question and options array

**Section B: Fill in the Gaps - Apply in Context (8 items)**  
- Students complete sentences with correct forms
- Include English hints in brackets for vocabulary
- Use predictable, frequent vocabulary
- MUST include exactly 8 exercises with complete sentences

**Section C: Error Correction - Fix the Mistakes (6 items)**
- Present sentences with grammar errors to correct
- Focus on common mistakes for this level
- Provide blank space for corrections
- MUST include exactly 6 exercises with incorrect sentences

**Section D: Complete the Conjugation Tables (2-3 tables)**
- Students fill in full conjugation patterns
- Include English translations for reference
- Focus on regular patterns for this level
- MUST include 2-3 exercises with verb names as questions

CRITICAL FORMATTING REQUIREMENTS:
- Title must be clear and specific to the grammar point
- Each section MUST be labeled exactly as specified above (A, B, C, D)
- Instructions must be clear and beginner-friendly
- Include vocabulary hints in English when needed
- NO answer keys included in worksheet

RESPOND ONLY WITH VALID JSON. Generate a JSON response with this exact structure:
{
  "title": "Spanish Present Tense: Regular Verbs",
  "studentInfo": {
    "nameField": true,
    "dateField": true,
    "classField": true
  },
  "introductoryExplanation": {
    "title": "What is the Present Tense?",
    "content": "Short explanation of when and why this grammar is used, with simple examples"
  },
  "referenceSection": {
    "title": "Reference Guide",
    "conjugationTables": [
      {
        "verb": "hablar",
        "type": "AR",
        "english": "to speak"
      }
    ]
  },
  "sections": [
    {
      "title": "A. Multiple Choice - Select the Correct Form",
      "type": "multiple-choice",
      "instructions": "Choose the correct form for each sentence",
      "exercises": [
        {
          "question": "Yo _____ (hablar) español",
          "options": ["a) hablo", "b) hablas", "c) habla"],
          "type": "multiple-choice"
        }
      ]
    },
    {
      "title": "B. Fill in the Gaps - Apply in Context", 
      "type": "fill-blank",
      "instructions": "Complete each sentence with the correct form of the verb in brackets",
      "exercises": [
        {
          "question": "Nosotros _____ (comer) pizza",
          "type": "fill-blank"
        }
      ]
    },
    {
      "title": "C. Error Correction - Fix the Mistakes",
      "type": "error-correction", 
      "instructions": "Each sentence contains one error. Write the correct form in the blank",
      "exercises": [
        {
          "question": "Yo comen tacos todos los días",
          "type": "error-correction"
        }
      ]
    },
    {
      "title": "D. Complete the Conjugation Tables",
      "type": "conjugation-tables",
      "instructions": "Fill in all the missing verb forms", 
      "exercises": [
        {
          "question": "VIVIR (to live)",
          "answer": "live",
          "type": "conjugation-tables"
        }
      ]
    }
  ]
}`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the worksheet now. Follow the exact structure specified. Return ONLY valid JSON with no additional text or explanations.` }
        ],
        temperature: 0.7,
        max_tokens: 10000
      });
    } catch (apiError: any) {
      console.error('OpenAI API Error Details:', {
        status: apiError.status,
        code: apiError.code,
        type: apiError.type,
        message: apiError.message
      });
      
      if (apiError.status === 401) {
        return NextResponse.json({ 
          error: 'OpenAI API authentication failed. Please check your API key configuration.',
          details: 'This appears to be a project-based API key. Ensure it has the correct permissions and is not expired.'
        }, { status: 500 });
      }
      
      throw apiError; // Re-throw for other errors
    }

    let worksheetContent: WorksheetContent;
    try {
      const responseText = completion.choices[0].message.content || '';
      console.log('OpenAI Response Text:', responseText.substring(0, 500), '...');
      
      // Try to find JSON block more carefully
      let jsonText = '';
      const jsonStartMatch = responseText.match(/\{/);
      if (jsonStartMatch) {
        const startIndex = jsonStartMatch.index!;
        let braceCount = 0;
        let endIndex = startIndex;
        
        for (let i = startIndex; i < responseText.length; i++) {
          const char = responseText[i];
          if (char === '{') braceCount++;
          if (char === '}') braceCount--;
          if (braceCount === 0) {
            endIndex = i;
            break;
          }
        }
        
        jsonText = responseText.substring(startIndex, endIndex + 1);
      }
      
      if (!jsonText) {
        // Fallback: try the original regex approach
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON found in response');
        }
        jsonText = jsonMatch[0];
      }
      
      console.log('Extracted JSON:', jsonText.substring(0, 200), '...');
      worksheetContent = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Response length:', completion.choices[0].message.content?.length);
      console.error('First 1000 chars:', completion.choices[0].message.content?.substring(0, 1000));
      
      return NextResponse.json({ 
        error: 'Failed to generate worksheet content',
        details: `JSON Parse Error: ${parseError.message}`,
        responsePreview: completion.choices[0].message.content?.substring(0, 500)
      }, { status: 500 });
    }

    // Generate HTML using our beautiful template
    const html = generateWorksheetHTML(worksheetContent);

    // Return HTML for client-side PDF generation using html2pdf.js
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${worksheetContent.title.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}`;

    return NextResponse.json({
      success: true,
      worksheet: worksheetContent,
      html: html,
      filename: filename
    });

  } catch (error) {
    console.error('Worksheet generation error:', error);
    
    // Ensure we always return proper JSON
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('Full error details:', errorMessage);
    
    return NextResponse.json({ 
      success: false,
      error: 'Failed to generate worksheet',
      details: process.env.NODE_ENV === 'development' ? errorMessage : 'Internal server error'
    }, { status: 500 });
  }
}

function generateWorksheetHTML(content: WorksheetContent): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title} - Language Gems</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&family=Poppins:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: white;
            color: #333;
            line-height: 1.5;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.6in;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        /* Header with branding */
        .header {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            text-align: center;
            padding: 25px 20px;
            margin: -0.6in -0.6in 25px -0.6in;
            border-bottom: 4px solid #F59E0B;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="gems" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse"><polygon points="10,2 18,8 14,18 6,18 2,8" fill="rgba(245,158,11,0.1)" /></pattern></defs><rect width="100" height="100" fill="url(%23gems)" /></svg>') repeat;
            opacity: 0.3;
        }
        
        .logo-area {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .gem-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .brand-name {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 28px;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 2.2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 2px;
            position: relative;
            z-index: 1;
        }
        
        /* Student info section */
        .student-info {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 30px;
            margin-bottom: 25px;
            padding: 15px;
            background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
            border: 2px solid #8B5CF6;
            border-radius: 12px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .info-field {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-field span {
            border-bottom: 2px solid #374151;
            padding-bottom: 3px;
            min-width: 120px;
            flex: 1;
        }
        
        /* Content area */
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
        }
        
        /* Introductory Explanation */
        .intro-explanation {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 2px solid #F59E0B;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
            position: relative;
        }
        
        .intro-explanation h3 {
            color: #92400E;
            font-weight: 700;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .intro-explanation p {
            color: #78350F;
            line-height: 1.6;
            font-size: 14px;
        }
        
        /* Reference section */
        .reference-section {
            background: linear-gradient(135deg, #EBF8FF 0%, #BFE6FF 100%);
            border: 2px solid #3B82F6;
            border-radius: 12px;
            padding: 20px;
            margin-bottom: 20px;
        }
        
        .reference-section h3 {
            color: #1E40AF;
            font-weight: 700;
            margin-bottom: 15px;
            font-size: 16px;
            text-align: center;
        }
        
        /* Sections */
        .section {
            border: 2px solid #8B5CF6;
            margin: 15px 0;
            padding: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 3px 10px rgba(139, 92, 246, 0.15);
            position: relative;
            break-inside: avoid;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E5E7EB;
        }
        
        .section-number {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            margin-right: 15px;
            box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
            border: 3px solid white;
        }
        
        .section-title {
            font-weight: 700;
            color: #374151;
            font-size: 16px;
            flex: 1;
        }
        
        .instructions {
            font-style: italic;
            color: #6B7280;
            margin-bottom: 15px;
            font-size: 14px;
            background: #F8FAFC;
            padding: 10px 15px;
            border-radius: 8px;
            border-left: 4px solid #8B5CF6;
        }
        
        /* Exercise layouts */
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
        }
        
        .exercise-item {
            margin: 10px 0;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .exercise-number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 25px;
        }
        
        .blank {
            border-bottom: 2px solid #374151;
            display: inline-block;
            min-width: 100px;
            margin: 0 5px;
            padding: 2px 5px;
        }
        
        /* Tables */
        .table-container {
            margin: 20px 0;
            break-inside: avoid;
        }
        
        .table-title {
            text-align: center;
            color: #8B5CF6;
            margin: 15px 0;
            font-weight: 700;
            font-size: 16px;
            background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
            padding: 10px;
            border-radius: 8px;
            border: 2px solid #8B5CF6;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
        }
        
        th, td {
            border: 2px solid #8B5CF6;
            padding: 15px 12px;
            text-align: center;
            font-size: 14px;
        }
        
        th {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        td {
            background: #FAFBFC;
            min-height: 35px;
        }
        
        /* Footer */
        .footer {
            margin-top: auto;
            text-align: center;
            padding: 15px 0;
            border-top: 2px solid #E5E7EB;
            background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
            margin-left: -0.6in;
            margin-right: -0.6in;
            margin-bottom: -0.6in;
            position: relative;
        }
        
        .footer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 14px;
        }
        
        .footer .gem-icon {
            width: 20px;
            height: 20px;
        }
        
        .slogan {
            font-style: italic;
            color: #6B7280;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 400;
        }
        
        /* Print optimizations */
        @media print {
            body {
                background: white;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .page {
                margin: 0;
                box-shadow: none;
            }
            
            .section {
                break-inside: avoid;
            }
        }
    </style>
</head>
<body>
    <div class="page">
        <div class="header">
            <div class="logo-area">
                <div class="gem-icon"></div>
                <div class="brand-name">LANGUAGE GEMS</div>
                <div class="gem-icon"></div>
            </div>
            <h1>${content.title.toUpperCase()}</h1>
        </div>
        
        <div class="student-info">
            <div class="info-field">
                <strong>NAME:</strong> <span></span>
            </div>
            <div class="info-field">
                <strong>DATE:</strong> <span></span>
            </div>
            <div class="info-field">
                <strong>CLASS:</strong> <span></span>
            </div>
        </div>
        
        <div class="content">
            ${content.introductoryExplanation ? `
            <div class="intro-explanation">
                <h3>${content.introductoryExplanation.title}</h3>
                <p>${content.introductoryExplanation.content}</p>
            </div>
            ` : ''}
            
            ${content.referenceSection && content.referenceSection.conjugationTables ? `
            <div class="reference-section">
                <h3>${content.referenceSection.title}</h3>
                ${content.referenceSection.conjugationTables.map(table => `
                <div class="table-container">
                    <div class="table-title">${table.type} VERBS (${table.verb.toUpperCase()} - ${table.english})</div>
                    <table>
                        <tr>
                            <th>PRONOUN</th>
                            <th>VERB FORM</th>
                            <th>ENGLISH</th>
                        </tr>
                        <tr><td><strong>Yo</strong></td><td>${getVerbForm(table.verb, table.type, 'yo')}</td><td>I ${table.english.replace('to ', '')}</td></tr>
                        <tr><td><strong>Tú</strong></td><td>${getVerbForm(table.verb, table.type, 'tu')}</td><td>You ${table.english.replace('to ', '')}</td></tr>
                        <tr><td><strong>Él/Ella/Usted</strong></td><td>${getVerbForm(table.verb, table.type, 'el')}</td><td>He/She ${table.english.replace('to ', '')}s</td></tr>
                        <tr><td><strong>Nosotros/as</strong></td><td>${getVerbForm(table.verb, table.type, 'nosotros')}</td><td>We ${table.english.replace('to ', '')}</td></tr>
                        <tr><td><strong>Vosotros/as</strong></td><td>${getVerbForm(table.verb, table.type, 'vosotros')}</td><td>You all ${table.english.replace('to ', '')}</td></tr>
                        <tr><td><strong>Ellos/Ellas/Ustedes</strong></td><td>${getVerbForm(table.verb, table.type, 'ellos')}</td><td>They ${table.english.replace('to ', '')}</td></tr>
                    </table>
                </div>
                `).join('')}
            </div>
            ` : ''}
            
            ${content.sections.map((section, sectionIndex) => `
            <div class="section">
                <div class="section-header">
                    <div class="section-number">${sectionIndex + 1}</div>
                    <div class="section-title">${section.title}</div>
                </div>
                <div class="instructions">${section.instructions}</div>
                
                ${(section.type === 'multiple-choice' || section.type === 'fill-blank') && section.exercises.length <= 8 ? `
                <div class="two-column">
                    <div>
                        ${section.exercises.slice(0, Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="exercise-number">${index + 1}.</span>
                            <div>
                                ${exercise.question}
                                ${exercise.type === 'fill-blank' ? '<span class="blank"></span>' : ''}
                                ${exercise.type === 'multiple-choice' && exercise.options ? 
                                    '<div style="margin-top: 5px;">' + exercise.options.map(opt => `<div style="margin-left: 0px; font-size: 13px;">${opt}</div>`).join('') + '</div>' : ''
                                }
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    <div>
                        ${section.exercises.slice(Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="exercise-number">${Math.ceil(section.exercises.length / 2) + index + 1}.</span>
                            <div>
                                ${exercise.question}
                                ${exercise.type === 'fill-blank' ? '<span class="blank"></span>' : ''}
                                ${exercise.type === 'multiple-choice' && exercise.options ? 
                                    '<div style="margin-top: 5px;">' + exercise.options.map(opt => `<div style="margin-left: 0px; font-size: 13px;">${opt}</div>`).join('') + '</div>' : ''
                                }
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : section.type === 'error-correction' ? `
                <div class="two-column">
                    <div>
                        ${section.exercises.slice(0, Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="exercise-number">${index + 1}.</span>
                            <div>
                                ${exercise.question} <span class="blank"></span>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                    <div>
                        ${section.exercises.slice(Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="exercise-number">${Math.ceil(section.exercises.length / 2) + index + 1}.</span>
                            <div>
                                ${exercise.question} <span class="blank"></span>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : section.type === 'conjugation-tables' ? 
                section.exercises.map((exercise, index) => `
                <div class="table-container">
                    <div class="table-title">${exercise.question}</div>
                    <table>
                        <tr>
                            <th>PRONOUN</th>
                            <th>VERB FORM</th>
                            <th>ENGLISH</th>
                        </tr>
                        <tr><td><strong>Yo</strong></td><td></td><td>I ${exercise.answer || 'verb'}</td></tr>
                        <tr><td><strong>Tú</strong></td><td></td><td>You ${exercise.answer || 'verb'}</td></tr>
                        <tr><td><strong>Él/Ella/Usted</strong></td><td></td><td>He/She ${exercise.answer || 'verb'}s</td></tr>
                        <tr><td><strong>Nosotros/as</strong></td><td></td><td>We ${exercise.answer || 'verb'}</td></tr>
                        <tr><td><strong>Vosotros/as</strong></td><td></td><td>You all ${exercise.answer || 'verb'}</td></tr>
                        <tr><td><strong>Ellos/Ellas/Ustedes</strong></td><td></td><td>They ${exercise.answer || 'verb'}</td></tr>
                    </table>
                </div>
                `).join('') : 
                section.exercises.map((exercise, index) => `
                <div class="exercise-item">
                    <span class="exercise-number">${index + 1}.</span>
                    <div>
                        ${exercise.question} <span class="blank" style="min-width: 280px;"></span>
                    </div>
                </div>
                `).join('')}
            </div>
            `).join('')}
        </div>
        
        <div class="footer">
            <div class="footer-content">
                <div class="gem-icon"></div>
                <span><strong>www.languagegems.com</strong></span>
                <div class="gem-icon"></div>
            </div>
            <div class="slogan">Unlock the Gems of Language Learning</div>
        </div>
    </div>
</body>
</html>`;

function getVerbForm(verb: string, type: string, pronoun: string): string {
  const stem = verb.slice(0, -2);
  
  if (type === 'AR') {
    switch (pronoun) {
      case 'yo': return stem + 'o';
      case 'tu': return stem + 'as';
      case 'el': return stem + 'a';
      case 'nosotros': return stem + 'amos';
      case 'vosotros': return stem + 'áis';
      case 'ellos': return stem + 'an';
      default: return '';
    }
  } else if (type === 'ER') {
    switch (pronoun) {
      case 'yo': return stem + 'o';
      case 'tu': return stem + 'es';
      case 'el': return stem + 'e';
      case 'nosotros': return stem + 'emos';
      case 'vosotros': return stem + 'éis';
      case 'ellos': return stem + 'en';
      default: return '';
    }
  } else if (type === 'IR') {
    switch (pronoun) {
      case 'yo': return stem + 'o';
      case 'tu': return stem + 'es';
      case 'el': return stem + 'e';
      case 'nosotros': return stem + 'imos';
      case 'vosotros': return stem + 'ís';
      case 'ellos': return stem + 'en';
      default: return '';
    }
  }
  return '';
}
} 