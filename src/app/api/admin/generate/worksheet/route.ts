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
      conjugations?: {
        [pronoun: string]: string;
      };
    }>;
    content?: string;
    endingPatterns?: Array<{
      type: string;
      endings: string[];
      color: 'yellow' | 'blue' | 'green';
    }>;
  };
  exercises: Array<{
    type: 'fill_in_blanks' | 'multiple_choice' | 'error_correction' | 'translation';
    title: string;
    instructions: string;
    questions: Array<{
      number: number;
      sentence?: string;
      verb?: string;
      options?: string[];
      answer?: string;
      english?: string;
      spanish?: string;
      incorrect?: string;
      correct?: string;
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
    const systemPrompt = `You are an expert ${language} teacher. Create a ${level} level worksheet on "${topic}".

Return ONLY valid JSON with this exact structure:

{
  "title": "Present Tense Irregular Verbs in ${language}",
  "studentInfo": {
    "nameField": true,
    "dateField": true,
    "classField": true
  },
  "introductoryExplanation": {
    "title": "Grammar Explanation",
    "content": "Brief explanation of ${topic} with 2 examples"
  },
  "referenceSection": {
    "title": "Quick Reference",
    "content": "Key patterns for ${topic}"
  },
  "exercises": [
    {
      "type": "fill_in_blanks",
      "title": "Fill in the Blanks",
      "instructions": "Complete with the correct form.",
      "questions": [
        {"number": 1, "sentence": "Yo ___ (hablar) español."},
        {"number": 2, "sentence": "Tú ___ (comer) pizza."}
      ]
    },
    {
      "type": "multiple_choice",
      "title": "Multiple Choice", 
      "instructions": "Choose the correct answer.",
      "questions": [
        {"number": 1, "sentence": "Yo ___ español.", "options": ["hablo", "habla", "hablan"]},
        {"number": 2, "sentence": "Tú ___ pizza.", "options": ["come", "comes", "comen"]}
      ]
    },
    {
      "type": "error_correction",
      "title": "Error Correction",
      "instructions": "Fix the error.",
      "questions": [
        {"number": 1, "incorrect": "Yo come pizza.", "correct": "como"},
        {"number": 2, "incorrect": "Tú habla español.", "correct": "hablas"}
      ]
    },
    {
      "type": "translation",
      "title": "Translation",
      "instructions": "Translate to ${language}.",
      "questions": [
        {"number": 1, "english": "I speak Spanish.", "spanish": "Yo hablo español."},
        {"number": 2, "english": "You eat pizza.", "spanish": "Tú comes pizza."}
      ]
    }
  ]
}

Create 15 fill-in-blanks, 15 multiple choice, 10 error correction, and 8 translation questions about ${topic} for ${level} students.`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the worksheet now. Follow the exact structure specified. Return ONLY valid JSON with no additional text or explanations.` }
        ],
        temperature: 0.7,
        max_tokens: 16000
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
      
      // Clean the response text and extract JSON
      let jsonText = responseText.trim();
      
      // Remove any markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Find the main JSON object (first { to last })
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      } else {
        throw new Error('No valid JSON structure found in response');
      }
      
      console.log('Extracted JSON:', jsonText.substring(0, 200), '...');
      worksheetContent = JSON.parse(jsonText);
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Response length:', completion.choices[0].message.content?.length);
      console.error('Raw response:', completion.choices[0].message.content);
      
      return NextResponse.json({ 
        error: 'Failed to generate worksheet content',
        details: `JSON Parse Error: ${parseError.message}`,
        responsePreview: completion.choices[0].message.content?.substring(0, 1000),
        fullResponse: process.env.NODE_ENV === 'development' ? completion.choices[0].message.content : undefined
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
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.title}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, #f5f3f0 0%, #ede8e3 100%);
            color: #333;
            line-height: 1.4;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.4in;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            page-break-after: always;
            border: 3px solid #8B5CF6;
            position: relative;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            text-align: center;
            padding: 15px;
            margin: -0.4in -0.4in 15px -0.4in;
            border-bottom: 3px solid #8B5CF6;
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 2px;
        }
        
        .name-date {
            display: flex;
            justify-content: space-between;
            margin-bottom: 15px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .name-date span {
            border-bottom: 2px solid #333;
            padding-bottom: 2px;
            min-width: 280px;
        }

        .intro-section {
            margin-bottom: 15px;
            padding: 12px;
            background: #F8FAFC;
            border-left: 4px solid #8B5CF6;
            border-radius: 6px;
        }

        .intro-section h3 {
            color: #8B5CF6;
            margin-bottom: 8px;
            font-size: 16px;
        }

        .intro-section p {
            font-size: 14px;
            line-height: 1.4;
        }
        
        .section {
            border: 2px dashed #666;
            margin: 15px 0;
            padding: 12px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .section-number {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            float: left;
            margin-right: 12px;
            margin-top: -3px;
            box-shadow: 0 3px 6px rgba(139, 92, 246, 0.3);
        }
        
        .section h3 {
            font-weight: 700;
            margin-bottom: 8px;
            color: #374151;
            font-size: 15px;
        }

        .instructions {
            font-style: italic;
            color: #6B7280;
            margin-bottom: 10px;
            font-size: 13px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .exercise-item {
            margin: 6px 0;
            font-size: 13px;
        }
        
        .exercise-item .number {
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .blank {
            border-bottom: 1px solid #333;
            display: inline-block;
            min-width: 70px;
            margin: 0 3px;
        }
        
        .table-container {
            overflow-x: auto;
            margin: 10px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 10px 0;
            background: white;
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 2px solid #8B5CF6;
            padding: 8px;
            text-align: center;
            font-size: 13px;
        }
        
        th {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        td {
            background: #F8FAFC;
        }

        .reference-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 12px;
            margin: 10px 0;
            text-align: center;
        }

        .reference-card {
            padding: 10px;
            border-radius: 6px;
            border: 2px solid;
            font-size: 13px;
        }

        .ar-verbs {
            background: #FEF3C7;
            border-color: #F59E0B;
            color: #D97706;
        }

        .er-verbs {
            background: #DBEAFE;
            border-color: #3B82F6;
            color: #1D4ED8;
        }

        .ir-verbs {
            background: #DCFCE7;
            border-color: #10B981;
            color: #047857;
        }

        .reference-card h4 {
            font-weight: 700;
            margin-bottom: 6px;
        }
        
        .footer {
            position: absolute;
            bottom: 0.4in;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 14px;
        }
        
        .gem-accent {
            color: #F59E0B;
            font-weight: 700;
        }
        
        @media print {
            body {
                background: white;
            }
            .page {
                box-shadow: none;
                margin: 0;
                border: none;
            }
        }
    </style>
</head>
<body>
    <!-- PAGE 1 -->
    <div class="page">
        <div class="header">
            <h1>${content.title.toUpperCase()}</h1>
        </div>
        
        <div class="name-date">
            <div>NAME: <span></span></div>
            <div>DATE: <span></span></div>
        </div>

        ${content.introductoryExplanation ? `
        <div class="intro-section">
            <h3>${content.introductoryExplanation.title}</h3>
            <p>${content.introductoryExplanation.content}</p>
        </div>
        ` : ''}

        ${content.referenceSection ? `
        <div class="intro-section">
            <h3>${content.referenceSection.title}</h3>
            <div class="reference-grid">
                <div class="reference-card ar-verbs">
                    <h4>-AR Verbs</h4>
                    <div>-o, -as, -a</div>
                    <div>-amos, -áis, -an</div>
                </div>
                <div class="reference-card er-verbs">
                    <h4>-ER Verbs</h4>
                    <div>-o, -es, -e</div>
                    <div>-emos, -éis, -en</div>
                </div>
                <div class="reference-card ir-verbs">
                    <h4>-IR Verbs</h4>
                    <div>-o, -es, -e</div>
                    <div>-imos, -ís, -en</div>
                </div>
            </div>
        </div>
        ` : ''}
        
        <div class="two-column">
            ${content.exercises.slice(0, 2).map((exercise, index) => `
            <div class="section">
                <div class="section-number">${index + 1}</div>
                <h3>${exercise.title}</h3>
                <div class="instructions">${exercise.instructions}</div>
                ${exercise.questions.slice(0, 10).map((q, qIndex) => `
                <div class="exercise-item">
                    <span class="number">${qIndex + 1}.</span> 
                                         ${exercise.type === 'multiple_choice' ? 
                         `${q.sentence || ''} (${q.options ? q.options.join(' / ') : 'a / b / c'})` :
                     exercise.type === 'error_correction' ?
                         `${q.incorrect || q.sentence || ''} <span class="blank"></span>` :
                     exercise.type === 'translation' ?
                         `${q.english || q.sentence || ''} <span class="blank" style="min-width: 120px;"></span>` :
                         `${(q.sentence || '').replace(/\[.*?\]/g, '<span class="blank"></span>')}`
                     }
                </div>
                `).join('')}
            </div>
            `).join('')}
        </div>
        
        <div class="footer">
            🌟 <span class="gem-accent">www.languagegems.com</span> 🌟
        </div>
    </div>
    
    <!-- PAGE 2 -->
    <div class="page">
        <div class="header">
            <h1>CONTINUED</h1>
        </div>
        
        <div class="name-date">
            <div>NAME: <span></span></div>
            <div>DATE: <span></span></div>
        </div>
        
        <div class="two-column">
            ${content.exercises.slice(2, 4).map((exercise, index) => `
            <div class="section">
                <div class="section-number">${index + 3}</div>
                <h3>${exercise.title}</h3>
                <div class="instructions">${exercise.instructions}</div>
                ${exercise.questions.slice(0, exercise.type === 'translation' ? 8 : 10).map((q, qIndex) => `
                <div class="exercise-item">
                    <span class="number">${qIndex + 1}.</span> 
                                         ${exercise.type === 'multiple_choice' ? 
                         `${q.sentence || ''} (${q.options ? q.options.join(' / ') : 'a / b / c'})` :
                     exercise.type === 'error_correction' ?
                         `${q.incorrect || q.sentence || ''} <span class="blank"></span>` :
                     exercise.type === 'translation' ?
                         `${q.english || q.sentence || ''} <span class="blank" style="min-width: 150px;"></span>` :
                         `${(q.sentence || '').replace(/\[.*?\]/g, '<span class="blank"></span>')}`
                     }
                </div>
                `).join('')}
            </div>
            `).join('')}
        </div>
        
        <div class="footer">
            🌟 <span class="gem-accent">www.languagegems.com</span> 🌟
        </div>
    </div>
</body>
</html>`;
}

// Helper function for getting verb endings (legacy support)
function getEndings(verbType: string): string {
    switch (verbType.toUpperCase()) {
        case 'AR': return '-o, -as, -a<br>-amos, -áis, -an';
        case 'ER': return '-o, -es, -e<br>-emos, -éis, -en';
        case 'IR': return '-o, -es, -e<br>-imos, -ís, -en';
        default: return '';
    }
}

function getConjugationTableHTML(verb: string, english: string): string {
    const pronouns = ['Yo', 'Tú', 'Él/Ella/Usted', 'Nosotros/as', 'Vosotros/as', 'Ellos/Ellas/Ustedes'];
    return `
        <div class="table-container">
            <div class="table-title">${verb.toUpperCase()} VERBS (${english})</div>
            <table>
                <tr>
                    <th>PRONOUN</th>
                    <th>VERB FORM</th>
                    <th>ENGLISH</th>
                </tr>
                ${pronouns.map(p => `
                    <tr>
                        <td><strong>${p}</strong></td>
                        <td></td>
                        <td>${getEnglishTranslation(p, english)}</td>
                    </tr>
                `).join('')}
            </table>
        </div>
    `;
}

function getEnglishTranslation(pronoun: string, verb: string): string {
    switch(pronoun) {
        case 'Yo': return `I ${verb}`;
        case 'Tú': return `You ${verb}`;
        case 'Él/Ella/Usted': return `He/She/You (formal) ${verb}`;
        case 'Nosotros/as': return `We ${verb}`;
        case 'Vosotros/as': return `You (pl.) ${verb}`;
        case 'Ellos/Ellas/Ustedes': return `They/You (pl.) ${verb}`;
        default: return '';
    }
}

async function saveAndGeneratePdf(worksheet: WorksheetContent, htmlContent: string) {
    // This function is no longer needed as PDF generation is handled by the browser.
    // Keeping it for now, but it will be removed in a future edit.
} 