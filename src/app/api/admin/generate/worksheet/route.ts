import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { writeFile, readFile } from 'fs/promises';
import path from 'path';
import fs from 'fs';
import PDFDocument from 'pdfkit';

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

CRITICAL REQUIREMENTS:
- Target level: ${level}
- Focus: ${worksheetType}
- ONLY include these exercise types: ${exerciseTypes.join(', ')}
- DO NOT include any exercise types not in this list: ${exerciseTypes.join(', ')}
- Number of questions per exercise type:
  * fill-blank: 8 questions
  * multiple-choice: 6 questions  
  * conjugation: 5 conjugation tables
  * translation: 6 translation exercises
  * short-answer: 5 short answer questions
- Must include: Student info section (NAME, DATE fields only)
- Must include: Clear instructions for each section
- DO NOT include answer key or reference section unless specifically requested
${customPrompt ? `- Additional requirements: ${customPrompt}` : ''}

Generate a JSON response with this exact structure:
{
  "title": "Worksheet Title",
  "studentInfo": {
    "nameField": true,
    "dateField": true,
    "classField": false
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
          "answer": "Correct answer for conjugation reference only",
          "type": "multiple-choice"
        }
      ]
    }
  ]
}

Exercise types to use: fill-blank, multiple-choice, translation, conjugation, short-answer
IMPORTANT: Only create sections for the exercise types specified: ${exerciseTypes.join(', ')}
Make it engaging, educational, and appropriate for ${level} level.`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the worksheet now.` }
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

    // Generate PDF using PDFKit (much lighter than Puppeteer)
    const doc = new PDFDocument();
    const buffers: Buffer[] = [];
    
    // Collect the PDF data
    doc.on('data', (buffer: Buffer) => buffers.push(buffer));
    
    // Create the PDF content from worksheet data
    doc.fontSize(20).text(worksheetContent.title, 100, 100);
    
    let yPosition = 140;
    
    // Add student info fields if enabled
    if (worksheetContent.studentInfo.nameField) {
      doc.fontSize(12).text('Name: ___________________', 100, yPosition);
      yPosition += 20;
    }
    if (worksheetContent.studentInfo.dateField) {
      doc.fontSize(12).text('Date: ___________________', 100, yPosition);
      yPosition += 20;
    }
    if (worksheetContent.studentInfo.classField) {
      doc.fontSize(12).text('Class: ___________________', 100, yPosition);
      yPosition += 20;
    }
    
    yPosition += 20;
    
    // Add sections
    worksheetContent.sections.forEach((section, sectionIndex) => {
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(16).text(section.title, 100, yPosition);
      yPosition += 25;
      
      if (section.instructions) {
        doc.fontSize(10).text(section.instructions, 100, yPosition);
        yPosition += 20;
      }
      
      section.exercises.forEach((exercise, exerciseIndex) => {
        if (yPosition > 700) {
          doc.addPage();
          yPosition = 50;
        }
        
        doc.fontSize(11).text(`${exerciseIndex + 1}. ${exercise.question}`, 120, yPosition);
        yPosition += 15;
        
        if (exercise.options) {
          exercise.options.forEach((option, optIndex) => {
            doc.fontSize(10).text(`   ${String.fromCharCode(97 + optIndex)}) ${option}`, 140, yPosition);
            yPosition += 12;
          });
        }
        yPosition += 8;
      });
      
      yPosition += 20;
    });
    
    // Add reference section if it exists
    if (worksheetContent.referenceSection) {
      if (yPosition > 600) {
        doc.addPage();
        yPosition = 50;
      }
      
      doc.fontSize(14).text(worksheetContent.referenceSection.title, 100, yPosition);
      yPosition += 20;
      doc.fontSize(10).text(worksheetContent.referenceSection.content, 100, yPosition);
    }
    
    // Finalize the PDF
    doc.end();
    
    // Wait for PDF generation to complete
    const pdfBuffer = await new Promise<Buffer>((resolve) => {
      doc.on('end', () => {
        resolve(Buffer.concat(buffers));
      });
    });

    // Save PDF file
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `${worksheetContent.title.replace(/[^a-zA-Z0-9]/g, '-')}-${timestamp}.pdf`;
    const filepath = path.join(process.cwd(), 'public', 'worksheets', filename);

    // Ensure directory exists
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
            line-height: 1.5;
            font-size: 16px;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            page-break-after: always;
            border: 3px solid #8B5CF6;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            text-align: center;
            padding: 20px;
            margin: -0.5in -0.5in 20px -0.5in;
            border-bottom: 3px solid #8B5CF6;
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 2.8em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 3px;
        }
        
        .header .subtitle {
            font-size: 1.2em;
            font-weight: 600;
            margin-top: 8px;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.2);
        }
        
        .name-date {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 16px;
        }
        
        .name-date span {
            border-bottom: 2px solid #333;
            padding-bottom: 2px;
            min-width: 300px;
        }
        
        .content {
            flex: 1;
        }
        
        .section {
            border: 2px dashed #666;
            margin: 20px 0;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            break-inside: avoid;
        }
        
        .section-number {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 20px;
            float: left;
            margin-right: 15px;
            margin-top: -5px;
            box-shadow: 0 3px 6px rgba(139, 92, 246, 0.3);
        }
        
        .section h3 {
            font-weight: 700;
            margin-bottom: 10px;
            color: #374151;
            font-size: 18px;
        }
        
        .section-instructions {
            font-style: italic;
            color: #6B7280;
            margin-bottom: 15px;
            font-size: 16px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .exercise-item {
            margin: 12px 0;
            font-size: 16px;
        }
        
        .exercise-item .number {
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .blank {
            border-bottom: 2px solid #333;
            display: inline-block;
            min-width: 100px;
            margin: 0 5px;
        }
        
        .table-container {
            overflow-x: auto;
            margin: 15px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 2px solid #8B5CF6;
            padding: 15px;
            text-align: center;
            font-size: 16px;
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
            position: relative;
        }
        
        .conjugation-line {
            border-bottom: 1px solid #666;
            height: 25px;
            margin: 5px 0;
            width: 100%;
        }
        
        .challenge-area {
            background: #F3F4F6;
            border: 2px solid #D1D5DB;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .challenge-line {
            border-bottom: 1px solid #6B7280;
            height: 30px;
            margin: 15px 0;
        }
        
        .footer {
            position: absolute;
            bottom: 0.3in;
            left: 0.5in;
            right: 0.5in;
            text-align: center;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 16px;
            margin-top: auto;
        }
        
        .gem-accent {
            color: #F59E0B;
            font-weight: 700;
        }
        
        .option {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 0;
            font-size: 16px;
        }
        
        .option-circle {
            width: 18px;
            height: 18px;
            border: 2px solid #6B7280;
            border-radius: 50%;
            flex-shrink: 0;
        }
        
        .exercise-options {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 10px;
            margin-top: 10px;
        }
        
        .reference-section {
            background: #EFF6FF;
            border: 2px solid #3B82F6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
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
    <div class="page">
        <div class="header">
            <h1>${content.title.toUpperCase()}</h1>
            <div class="subtitle">Language Gems Professional Worksheet</div>
        </div>
        
        <div class="name-date">
            <div>NAME: <span></span></div>
            <div>DATE: <span></span></div>
        </div>
        
        <div class="content">
            ${content.sections.map((section, sectionIndex) => `
            <div class="section">
                <div class="section-number">${sectionIndex + 1}</div>
                <h3>${section.title}</h3>
                ${section.instructions ? `<div class="section-instructions">${section.instructions}</div>` : ''}
                
                ${section.exercises.length <= 10 && section.exercises.every(ex => ex.type === 'fill-blank' || ex.type === 'multiple-choice') ? `
                <div class="two-column">
                    <div>
                        ${section.exercises.slice(0, Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="number">${index + 1}.</span> 
                            ${exercise.question}
                            ${exercise.type === 'fill-blank' ? '<span class="blank"></span>' : ''}
                            ${exercise.type === 'multiple-choice' && exercise.options ? 
                                exercise.options.map(opt => `<div>${opt}</div>`).join('') : ''
                            }
                        </div>
                        `).join('')}
                    </div>
                    <div>
                        ${section.exercises.slice(Math.ceil(section.exercises.length / 2)).map((exercise, index) => `
                        <div class="exercise-item">
                            <span class="number">${Math.ceil(section.exercises.length / 2) + index + 1}.</span> 
                            ${exercise.question}
                            ${exercise.type === 'fill-blank' ? '<span class="blank"></span>' : ''}
                            ${exercise.type === 'multiple-choice' && exercise.options ? 
                                exercise.options.map(opt => `<div>${opt}</div>`).join('') : ''
                            }
                        </div>
                        `).join('')}
                    </div>
                </div>
                ` : `
                ${section.exercises.map((exercise, index) => `
                <div class="exercise-item">
                    <span class="number">${index + 1}.</span> 
                    ${exercise.question}
                    ${exercise.type === 'fill-blank' ? '<span class="blank"></span>' : ''}
                    ${exercise.type === 'multiple-choice' && exercise.options ? `
                    <div class="exercise-options">
                        ${exercise.options.map(option => `
                        <div class="option">
                            <div class="option-circle"></div>
                            <span>${option}</span>
                        </div>
                        `).join('')}
                    </div>
                    ` : ''}
                    ${exercise.type === 'conjugation' ? `
                    <div class="table-container">
                        <table>
                            <tr>
                                <th>PRONOUN</th>
                                <th>VERB FORM</th>
                                <th>ENGLISH</th>
                            </tr>
                            <tr><td><strong>Yo</strong></td><td><div class="conjugation-line"></div></td><td>I ${exercise.answer || 'verb'}</td></tr>
                            <tr><td><strong>Tú</strong></td><td><div class="conjugation-line"></div></td><td>You ${exercise.answer || 'verb'}</td></tr>
                            <tr><td><strong>Él/Ella</strong></td><td><div class="conjugation-line"></div></td><td>He/She ${exercise.answer || 'verb'}s</td></tr>
                            <tr><td><strong>Nosotros</strong></td><td><div class="conjugation-line"></div></td><td>We ${exercise.answer || 'verb'}</td></tr>
                            <tr><td><strong>Vosotros</strong></td><td><div class="conjugation-line"></div></td><td>You all ${exercise.answer || 'verb'}</td></tr>
                            <tr><td><strong>Ellos</strong></td><td><div class="conjugation-line"></div></td><td>They ${exercise.answer || 'verb'}</td></tr>
                        </table>
                    </div>
                    ` : ''}
                    ${exercise.type === 'translation' || exercise.type === 'short-answer' ? `
                    <div class="conjugation-line"></div>
                    ` : ''}
                </div>
                `).join('')}
                `}
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