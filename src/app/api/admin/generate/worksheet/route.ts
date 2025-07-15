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
    type: 'fill_in_blanks' | 'multiple_choice' | 'error_correction' | 'translation' | 'matching' | 'word_order' | 'translation_both_ways';
    title: string;
    instructions: string;
    questions: Array<{
      number?: number;
      sentence?: string;
      verb?: string;
      options?: string[];
      answer?: string;
      english?: string;
      spanish?: string;
      incorrect?: string;
      correct?: string;
      scrambled?: string;
      section?: string;
      items?: Array<{
        spanish?: string;
        english?: string;
        sentence?: string;
      }>;
      original?: string; // For error correction
      error?: string; // For error correction
      text?: string; // For error correction
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

Return ONLY valid JSON. Use "${topic}" tense consistently throughout.

Structure:
{
  "title": "${topic} in ${language}",
  "studentInfo": {"nameField": true, "dateField": true, "classField": true},
  "introductoryExplanation": {
    "title": "Grammar Explanation",
    "content": "Brief explanation of ${topic} with examples"
  },
  "referenceSection": {
    "title": "Quick Reference",
    "content": "Key patterns for ${topic}"
  },
  "exercises": [
    {
      "type": "fill_in_blanks",
      "title": "Fill in the Blanks", 
      "instructions": "Complete with the correct ${topic} form.",
      "questions": [
        {"sentence": "Yo ___ (hablar) español."},
        {"sentence": "Tú ___ (comer) pan."},
        {"sentence": "Él ___ (vivir) aquí."},
        {"sentence": "Nosotros ___ (leer) libros."},
        {"sentence": "Vosotros ___ (correr) rápido."},
        {"sentence": "Ellos ___ (bailar) salsa."},
        {"sentence": "Ella ___ (trabajar) mucho."},
        {"sentence": "Tú ___ (escribir) una carta."},
        {"sentence": "Nosotros ___ (beber) agua."},
        {"sentence": "Ellas ___ (cantar) bien."}
      ]
    },
    {
      "type": "multiple_choice",
      "title": "Multiple Choice",
      "instructions": "Choose the correct ${topic} form.",
      "questions": [
        {"sentence": "Yo ___ español.", "options": ["hablo", "habla", "hablan"]},
        {"sentence": "Tú ___ pan.", "options": ["comes", "come", "comemos"]},
        {"sentence": "Él ___ aquí.", "options": ["vive", "vivo", "viven"]},
        {"sentence": "Nosotros ___ libros.", "options": ["leemos", "lee", "leen"]},
        {"sentence": "Vosotros ___ rápido.", "options": ["corréis", "corre", "corren"]},
        {"sentence": "Ellos ___ salsa.", "options": ["bailan", "baila", "bailas"]},
        {"sentence": "Ella ___ mucho.", "options": ["trabaja", "trabajo", "trabajas"]},
        {"sentence": "Tú ___ una carta.", "options": ["escribes", "escribo", "escriben"]},
        {"sentence": "Nosotros ___ agua.", "options": ["bebemos", "bebo", "beben"]},
        {"sentence": "Ellas ___ bien.", "options": ["cantan", "canto", "cantas"]}
      ]
    },
    {
      "type": "error_correction", 
      "title": "Error Correction",
      "instructions": "Fix the error - write the correct ${topic} form.",
      "questions": [
        {"incorrect": "Yo comen arroz todos los días."},
        {"incorrect": "Tú habla muy rápido."},
        {"incorrect": "Nosotros vivís en una casa grande."},
        {"incorrect": "Ellos estudia en la universidad."},
        {"incorrect": "Ella trabajan en una oficina."},
        {"incorrect": "Vosotros corre en el parque."},
        {"incorrect": "Ustedes lee muchos libros."},
        {"incorrect": "Mi hermano bailas salsa."},
        {"incorrect": "Tú escribimos una carta."},
        {"incorrect": "Yo bebes agua con limón."}
      ]
    },
    {
      "type": "matching",
      "title": "Match the Words",
      "instructions": "Match the Spanish and English forms.",
      "questions": [
        {"spanish": "hablo", "english": "I speak"},
        {"spanish": "comes", "english": "you eat"},
        {"spanish": "vive", "english": "he/she lives"},
        {"spanish": "leemos", "english": "we read"},
        {"spanish": "corréis", "english": "you all run"},
        {"spanish": "bailan", "english": "they dance"},
        {"spanish": "trabaja", "english": "she works"},
        {"spanish": "escribes", "english": "you write"},
        {"spanish": "bebemos", "english": "we drink"},
        {"spanish": "cantan", "english": "they sing"}
      ]
    },
    {
      "type": "word_order",
      "title": "Put the Words in Correct Order",
      "instructions": "Rearrange to make correct sentences.",
      "questions": [
        {"scrambled": "español / hablo / yo"},
        {"scrambled": "come / ella / pan"},
        {"scrambled": "libros / leemos / nosotros"},
        {"scrambled": "rápido / vosotros / corréis"},
        {"scrambled": "salsa / ellos / bailan"},
        {"scrambled": "mucho / trabaja / ella"},
        {"scrambled": "una carta / tú / escribes"},
        {"scrambled": "agua / bebemos / nosotros"},
        {"scrambled": "bien / ellas / cantan"},
        {"scrambled": "trabajo / yo / hago"}
      ]
    },
    {
      "type": "translation_both_ways",
      "title": "Translation Practice", 
      "instructions": "Translate between Spanish and English.",
      "questions": [
        {"section": "spanish_to_english", "items": [
          {"spanish": "Hablo español."},
          {"spanish": "Come pan."},
          {"spanish": "Vivimos en Madrid."},
          {"spanish": "Leemos libros."},
          {"spanish": "Ellos bailan salsa."},
          {"spanish": "Ella trabaja mucho."},
          {"spanish": "Tú escribes una carta."},
          {"spanish": "Nosotros bebemos agua."},
          {"spanish": "Ellas cantan bien."},
          {"spanish": "Yo hago trabajo."}
        ]},
        {"section": "english_to_spanish", "items": [
          {"english": "I speak Spanish."},
          {"english": "You eat bread."},
          {"english": "We live in Madrid."},
          {"english": "We read books."},
          {"english": "They dance salsa."},
          {"english": "She works a lot."},
          {"english": "You write a letter."},
          {"english": "We drink water."},
          {"english": "They sing well."},
          {"english": "I do work."}
        ]}
      ]
    }
  ]
}`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the worksheet now. Follow the exact structure specified. Return ONLY valid JSON with no additional text or explanations.` }
        ],
        temperature: 0.7,
        max_tokens: 15000
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
      console.log('OpenAI Response Text Length:', responseText.length);
      console.log('OpenAI Response Text Preview:', responseText.substring(0, 500), '...');
      console.log('OpenAI Response Text End:', responseText.substring(responseText.length - 200));
      
      // Check if response was truncated
      if (completion.choices[0].finish_reason === 'length') {
        console.warn('OpenAI response was truncated due to max_tokens limit');
        return NextResponse.json({ 
          error: 'Response was truncated. Try reducing complexity or increasing max_tokens.',
          details: 'The OpenAI response was cut off due to token limits.',
          responsePreview: responseText.substring(0, 1000)
        }, { status: 500 });
      }
      
      // Clean the response text and extract JSON
      let jsonText = responseText.trim();
      
      // Log the cleaning process
      console.log('Original response starts with:', jsonText.substring(0, 50));
      console.log('Original response ends with:', jsonText.substring(jsonText.length - 50));
      
      // Remove any markdown code blocks if present
      if (jsonText.startsWith('```json')) {
        jsonText = jsonText.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (jsonText.startsWith('```')) {
        jsonText = jsonText.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      
      // Find the main JSON object (first { to last })
      const firstBrace = jsonText.indexOf('{');
      const lastBrace = jsonText.lastIndexOf('}');
      
      console.log('First brace at:', firstBrace, 'Last brace at:', lastBrace);
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonText = jsonText.substring(firstBrace, lastBrace + 1);
      } else {
        throw new Error('No valid JSON structure found in response');
      }
      
      console.log('Extracted JSON:', jsonText.substring(0, 200), '...');
      console.log('Extracted JSON length:', jsonText.length);
      
      worksheetContent = JSON.parse(jsonText);
      
      // Validate that we have exercises
      if (!worksheetContent.exercises || worksheetContent.exercises.length === 0) {
        throw new Error('No exercises found in generated content');
      }
      
      console.log('Successfully parsed worksheet with', worksheetContent.exercises.length, 'exercises');
    } catch (parseError: any) {
      console.error('Failed to parse OpenAI response:', parseError);
      console.error('Response length:', completion.choices[0].message.content?.length);
      console.error('Finish reason:', completion.choices[0].finish_reason);
      console.error('Raw response:', completion.choices[0].message.content);
      
      return NextResponse.json({ 
        error: 'Failed to generate worksheet content',
        details: `JSON Parse Error: ${parseError.message}`,
        responsePreview: completion.choices[0].message.content?.substring(0, 1000),
        finishReason: completion.choices[0].finish_reason,
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
    // Helper function to get correct verb endings based on topic
    const getVerbEndings = (topic: string) => {
        const topicLower = topic.toLowerCase();
        
        if (topicLower.includes('future') || topicLower.includes('futuro')) {
            return {
                ar: ['-é', '-ás', '-á', '-emos', '-éis', '-án'],
                er: ['-é', '-ás', '-á', '-emos', '-éis', '-án'], 
                ir: ['-é', '-ás', '-á', '-emos', '-éis', '-án']
            };
        } else if (topicLower.includes('past') || topicLower.includes('preterite') || topicLower.includes('pasado')) {
            return {
                ar: ['-é', '-aste', '-ó', '-amos', '-asteis', '-aron'],
                er: ['-í', '-iste', '-ió', '-imos', '-isteis', '-ieron'],
                ir: ['-í', '-iste', '-ió', '-imos', '-isteis', '-ieron']
            };
        } else if (topicLower.includes('imperfect') || topicLower.includes('imperfecto')) {
            return {
                ar: ['-aba', '-abas', '-aba', '-ábamos', '-abais', '-aban'],
                er: ['-ía', '-ías', '-ía', '-íamos', '-íais', '-ían'],
                ir: ['-ía', '-ías', '-ía', '-íamos', '-íais', '-ían']
            };
        } else {
            // Default to present tense
            return {
                ar: ['-o', '-as', '-a', '-amos', '-áis', '-an'],
                er: ['-o', '-es', '-e', '-emos', '-éis', '-en'],
                ir: ['-o', '-es', '-e', '-imos', '-ís', '-en']
            };
        }
    };

    const endings = getVerbEndings(content.title);

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
            min-width: 320px;
        }

        .content {
            flex: 1;
        }

        .intro-section {
            margin-bottom: 15px;
            padding: 15px;
            background: #F8FAFC;
            border: 2px dashed #8B5CF6;
            border-radius: 8px;
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
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .exercise-item .number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 25px;
        }
        
        .blank {
            border-bottom: 2px solid #333;
            display: inline-block;
            min-width: 120px;
            margin: 0 5px;
            padding: 2px 5px;
        }

        .reference-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
            margin: 15px 0;
            text-align: center;
        }

        .reference-card {
            padding: 15px;
            border-radius: 8px;
            border: 2px solid;
            font-size: 14px;
            box-shadow: 0 3px 8px rgba(0,0,0,0.1);
        }

        .ar-verbs {
            background: #FEF3C7;
            border-color: #F59E0B;
            color: #92400E;
        }

        .er-verbs {
            background: #DBEAFE;
            border-color: #3B82F6;
            color: #1E40AF;
        }

        .ir-verbs {
            background: #D1FAE5;
            border-color: #10B981;
            color: #047857;
        }

        .reference-card h4 {
            font-weight: 700;
            margin-bottom: 8px;
            font-size: 15px;
        }
        
        .footer {
            margin-top: auto;
            text-align: center;
            padding: 15px 0;
            border-top: 2px solid #E5E7EB;
            background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
            margin-left: -0.4in;
            margin-right: -0.4in;
            margin-bottom: -0.4in;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 14px;
        }
        
        .gem-accent {
            color: #F59E0B;
            font-weight: 700;
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

        .gem-icon {
            width: 20px;
            height: 20px;
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }

        .slogan {
            font-style: italic;
            color: #6B7280;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 400;
        }

        .matching-table {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin: 15px 0;
        }

        .matching-column {
            border: 2px solid #8B5CF6;
            border-radius: 8px;
            padding: 15px;
            background: #F8FAFC;
        }

        .matching-item {
            margin: 8px 0;
            font-size: 13px;
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .word-order-item {
            margin: 15px 0;
            padding: 10px;
            background: #F3F4F6;
            border-radius: 6px;
            border-left: 4px solid #8B5CF6;
        }

        .scrambled-words {
            font-weight: 600;
            color: #8B5CF6;
            margin-bottom: 5px;
        }

        .answer-line {
            border-bottom: 2px solid #374151;
            height: 25px;
            margin: 8px 0;
            position: relative;
        }

        .answer-line::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            width: 3px;
            height: 3px;
            background: #8B5CF6;
            border-radius: 50%;
            transform: translateY(-50%);
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

        <div class="content">
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
                    <div>${endings.ar.slice(0, 3).join(', ')}</div>
                    <div>${endings.ar.slice(3).join(', ')}</div>
                </div>
                <div class="reference-card er-verbs">
                    <h4>-ER Verbs</h4>
                    <div>${endings.er.slice(0, 3).join(', ')}</div>
                    <div>${endings.er.slice(3).join(', ')}</div>
                </div>
                <div class="reference-card ir-verbs">
                    <h4>-IR Verbs</h4>
                    <div>${endings.ir.slice(0, 3).join(', ')}</div>
                    <div>${endings.ir.slice(3).join(', ')}</div>
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
                ${exercise.questions.map((q, qIndex) => `
                <div class="exercise-item">
                    <span class="number">${qIndex + 1}.</span> 
                                         ${exercise.type === 'multiple_choice' ? 
                         `${q.sentence || ''} (${q.options ? q.options.join(' / ') : 'a / b / c'})` :
                     exercise.type === 'error_correction' ?
                         `${q.incorrect || q.original || q.error || q.sentence || q.text || ''} <span class="blank"></span>` :
                     (exercise.type === 'translation' || exercise.type.includes('translation')) ?
                         `${q.english || q.sentence || ''} <span class="blank"></span>` :
                         `${(q.sentence || '').replace(/\[.*?\]/g, '<span class="blank"></span>')}`
                     }
                </div>
                `).join('')}
            </div>
            `).join('')}
        </div>
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
    
    <!-- PAGE 2 -->
    <div class="page">
        <div class="header">
            <h1>MORE PRACTICE</h1>
        </div>
        
        <div class="name-date">
            <div>NAME: <span></span></div>
            <div>DATE: <span></span></div>
        </div>
        
        <div class="content">
        ${content.exercises.slice(2).map((exercise, index) => {
            if (exercise.type === 'matching') {
                return `
                <div class="section">
                    <div class="section-number">${index + 3}</div>
                    <h3>${exercise.title}</h3>
                    <div class="instructions">${exercise.instructions}</div>
                    <div class="matching-table">
                        <div class="matching-column">
                            <h4>Spanish</h4>
                            ${exercise.questions.slice(0, 10).map((q, qIndex) => `
                            <div class="matching-item">
                                <span class="number">${String.fromCharCode(65 + qIndex)}.</span>
                                <span>${q.spanish || q.sentence || ''}</span>
                            </div>
                            `).join('')}
                        </div>
                        <div class="matching-column">
                            <h4>English</h4>
                            ${(() => { const shuffledEng = [...exercise.questions.slice(0, 10)].sort(() => 0.5 - Math.random()); return shuffledEng; })().map((q, qIndex) => `
                            <div class="matching-item">
                                <span class="number">${qIndex + 1}.</span>
                                <span>${q.english || q.answer || ''}</span>
                            </div>
                            `).join('')}
                        </div>
                    </div>
                </div>`;
            } else if (exercise.type === 'word_order') {
                return `
                <div class="section">
                    <div class="section-number">${index + 3}</div>
                    <h3>${exercise.title}</h3>
                    <div class="instructions">${exercise.instructions}</div>
                    ${exercise.questions.slice(0, 8).map((q, qIndex) => `
                    <div class="word-order-item">
                        <div class="scrambled-words">${String.fromCharCode(65 + qIndex)}. ${q.scrambled || q.sentence || ''}</div>
                        <div class="answer-line"></div>
                    </div>
                    `).join('')}
                </div>`;
            } else if (exercise.type === 'translation_both_ways') {
                return `
                <div class="section">
                    <div class="section-number">${index + 3}</div>
                    <h3>${exercise.title}</h3>
                    <div class="instructions">${exercise.instructions}</div>
                    <div class="two-column">
                        <div>
                            <h4>Spanish to English</h4>
                            ${exercise.questions[0]?.items?.slice(0, 6).map((q, qIndex) => `
                            <div class="exercise-item">
                                <span class="number">${qIndex + 1}.</span>
                                ${q.spanish || q.sentence || ''} <span class="blank"></span>
                            </div>
                            `).join('') || ''}
                        </div>
                        <div>
                            <h4>English to Spanish</h4>
                            ${exercise.questions[1]?.items?.slice(0, 6).map((q, qIndex) => `
                            <div class="exercise-item">
                                <span class="number">${qIndex + 1}.</span>
                                ${q.english || q.sentence || ''} <span class="blank"></span>
                            </div>
                            `).join('') || ''}
                        </div>
                    </div>
                </div>`;
            } else {
                return `
                <div class="section">
                    <div class="section-number">${index + 3}</div>
                    <h3>${exercise.title}</h3>
                    <div class="instructions">${exercise.instructions}</div>
                    ${exercise.questions.map((q, qIndex) => `
                    <div class="exercise-item">
                        <span class="number">${qIndex + 1}.</span> 
                        ${exercise.type === 'multiple_choice' ? 
                             `${q.sentence || ''} (${q.options ? q.options.join(' / ') : 'a / b / c'})` :
                         exercise.type === 'error_correction' ?
                             `${q.incorrect || q.original || q.error || q.sentence || q.text || ''} <span class="blank"></span>` :
                         (exercise.type === 'translation' || exercise.type.includes('translation')) ?
                             `${q.english || q.sentence || ''} <span class="blank"></span>` :
                             `${(q.sentence || '').replace(/\[.*?\]/g, '<span class="blank"></span>')}`
                         }
                    </div>
                    `).join('')}
                </div>`;
            }
        }).join('')}
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