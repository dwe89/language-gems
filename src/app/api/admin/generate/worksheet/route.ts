import { NextRequest, NextResponse } from 'next/server';
import 'server-only';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import OpenAI from 'openai';

import { renderWorksheetToHtml } from '@/lib/html/render';

// Removed puppeteer/chromium - using client-side html2pdf.js instead

// Initialize OpenAI with project-based API key support
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  organization: process.env.OPENAI_ORG_ID, // Optional: for organization-scoped keys
  project: process.env.OPENAI_PROJECT_ID, // Optional: for project-scoped keys
  dangerouslyAllowBrowser: false,
});
import type { WorksheetContent } from '@/types/worksheet';


interface WorksheetRequest {
  subject: string;
  language: string;
  level: string;
  topic: string;
  worksheetType: 'grammar' | 'vocabulary' | 'mixed';
  exerciseTypes: string[];
  customPrompt?: string;
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

CRITICAL: Return ONLY valid JSON. All quotes within string values MUST be properly escaped with backslashes. For example: "content": "This is a \\"quoted\\" word in the text."

Use "${topic}" tense consistently throughout.

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
}

IMPORTANT: Ensure all quotes in string values are properly escaped. For example, if you need to include quotes in explanations, use \\" instead of ".`;

    let completion;
    try {
      completion = await openai.chat.completions.create({
        model: 'gpt-4.1-nano',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Generate the worksheet now. Follow the exact structure specified. Return ONLY valid JSON with no additional text or explanations.` }
        ],

        max_completion_tokens: 20000
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

      // Try to parse JSON, with fallback for common issues
      try {
        worksheetContent = JSON.parse(jsonText);
      } catch (firstParseError) {
        console.log('First JSON parse failed, trying to fix common issues...');

        // Try to fix common JSON issues
        let fixedJson = jsonText
          // Remove trailing commas before closing braces/brackets
          .replace(/,(\s*[}\]])/g, '$1');

        try {
          worksheetContent = JSON.parse(fixedJson);
          console.log('JSON parsing succeeded with fixes');
        } catch (secondParseError) {
          console.error('JSON parsing failed even with fixes:', secondParseError);
          throw firstParseError; // Throw original error
        }
      }

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
    const html = renderWorksheetToHtml(worksheetContent);

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
        /* --- New $10x CSS --- */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&family=Roboto+Mono:wght@400;600&display=swap');

:root {
    --color-primary: #172554; /* Deep Navy Blue */
    --color-accent: #F59E0B; /* Vibrant Amber/Gold */
    --color-light: #F8FAFC; /* Lightest Gray */
    --color-text: #374151; /* Dark Gray Text */
    --color-border: #E5E7EB;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Poppins', sans-serif;
    color: var(--color-text);
    line-height: 1.6;
    background-color: #f0f0f0; /* Slight off-white background */
}

.page {
    width: 8.5in;
    height: 11in;
    margin: 0 auto;
    background: white;
    padding: 0.7in 0.8in 0.6in 0.8in;
    box-shadow: 0 0 30px rgba(0,0,0,0.1); /* Deeper shadow for premium feel */
    page-break-after: always;
    position: relative;
    border-top: 6px solid var(--color-primary); /* Strong top accent line */
}

/* --- HEADER / BRANDING --- */

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 20px;
    border-bottom: 2px solid var(--color-border);
    margin-bottom: 20px;
}

.title-block {
    text-align: left;
}

.title-block h1 {
    font-family: 'Poppins', sans-serif;
    font-weight: 700;
    font-size: 1.8em;
    color: var(--color-primary);
    line-height: 1.1;
}

.title-block h2 {
    font-size: 0.9em;
    font-weight: 400;
    color: var(--color-accent);
    text-transform: uppercase;
    letter-spacing: 1px;
    margin-top: 4px;
}

.logo-stamp {
    width: 40px;
    height: 40px;
    background: var(--color-accent);
    clip-path: polygon(50% 0%, 100% 35%, 100% 70%, 50% 100%, 0% 70%, 0% 35%); /* Gem Shape */
}

.name-date {
    display: flex;
    justify-content: space-between;
    margin-bottom: 30px;
    font-size: 13px;
    font-weight: 600;
    color: #4B5563;
}

.name-date div {
    flex-basis: 30%;
    display: flex;
    gap: 8px;
    align-items: center;
}

.name-date span {
    flex-grow: 1;
    border-bottom: 1px dashed var(--color-text); /* Dashed line for writing */
    height: 18px;
}

/* --- INTRO & REFERENCE SECTIONS --- */

.intro-section {
    margin-bottom: 25px;
    padding: 15px 20px;
    background: var(--color-light); /* Off-white card */
    border-radius: 8px;
    border: 1px solid var(--color-border);
    box-shadow: 0 4px 6px rgba(0,0,0,0.05); /* Subtle lift */
}

.intro-section h3 {
    color: var(--color-primary);
    margin-bottom: 8px;
    font-size: 1.1em;
    font-weight: 700;
    border-bottom: 1px solid var(--color-border);
    padding-bottom: 4px;
}

.intro-section p {
    font-family: 'Roboto Mono', monospace; /* Monospace for explanation clarity */
    font-size: 13px;
    line-height: 1.6;
}

/* --- EXERCISES --- */

.section {
    margin-bottom: 30px;
    padding-top: 10px;
}

.section-header {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
}

.section-number {
    background: var(--color-primary);
    color: white;
    width: 22px;
    height: 22px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 700;
    font-size: 13px;
    margin-right: 8px;
    flex-shrink: 0;
}

.section h3 {
    font-family: 'Poppins', sans-serif;
    font-weight: 600;
    font-size: 1.1em;
    color: var(--color-primary);
}

.instructions {
    font-style: italic;
    color: #6B7280;
    margin: 5px 0 15px 30px;
    font-size: 13px;
}

/* Grid for exercises (questions will be inside these) */
.exercise-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px 30px;
}

.exercise-item {
    font-family: 'Roboto Mono', monospace;
    font-size: 14px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 10px;
}

.exercise-item .number {
    font-weight: 600;
    color: var(--color-accent);
    min-width: 20px;
    text-align: right;
    flex-shrink: 0;
}

.question-content {
    line-height: 1.8; /* Increased line-height for better writing space */
    display: inline;
}

.blank {
    border-bottom: 1px solid var(--color-text);
    display: inline-block;
    min-width: 100px;
    height: 20px;
    padding: 0 5px;
    vertical-align: middle;
}

/* Multiple Choice Styling */
.options-list {
    display: block;
    margin-top: 5px;
    font-size: 0.9em;
    color: #6B7280;
}
.option {
    margin-right: 15px;
}

/* Word Order / Error Correction Input Line */
.answer-line {
    border: 1px solid var(--color-border);
    border-radius: 4px;
    height: 35px;
    margin-top: 8px;
    background: white;
    box-shadow: inset 0 1px 3px rgba(0,0,0,0.05);
}

/* --- FOOTER --- */

.footer {
    position: absolute;
    bottom: 0.3in;
    left: 0.8in;
    right: 0.8in;
    text-align: center;
    border-top: 1px solid var(--color-border);
    padding-top: 10px;
}

.footer-content {
    font-size: 12px;
    color: var(--color-primary);
}

.footer-content strong {
    font-weight: 600;
    color: var(--color-accent);
}

.footer-link {
    font-size: 11px;
    color: #9CA3AF;
    margin-top: 4px;
}

@media print {
    /* Optimization for printing */
    .page {
        box-shadow: none;
        border-top: 6px solid #000; /* Use black for max contrast on print */
        margin: 0;
        padding: 0.5in;
    }
    .header {
        margin-top: -0.2in;
    }
    .footer {
        position: fixed;
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
                            ${exercise.questions.slice(0, 10).map((q, qIndex) => `
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