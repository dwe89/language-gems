import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Knowledge base about LanguageGems
const LANGUAGEGEMS_KNOWLEDGE = `
LanguageGems is a full-language learning and teaching platform that combines curriculum-aligned content, AI automation, analytics, and interactive games for Spanish, French, and German. The platform serves UK KS3/GCSE classrooms, independent learners, and school leadership teams.

## Learning Experiences
- Complete four-skill coverage (reading, writing, listening, speaking) with structured lesson paths
- AI-powered worksheet generation covering grammar, vocabulary, comprehension, cultural content, and assessments
- Interactive Phaser-powered games that reinforce grammar, vocabulary, listening comprehension, and pronunciation
- Vocabulary practice with spaced repetition, pronunciation playback, and custom lists
- Listening libraries with multi-accent recordings and comprehension checks
- Teacher-curated projects, challenges, and revision programmes

## Dashboards & Roles
- **Teachers:** Create assignments, differentiate by ability, auto-mark submissions, review analytics, and share feedback
- **Students:** Personalised to-do list, XP/achievement tracking, audio-enabled practice, and game-based revision
- **School Leaders:** Cross-class reporting, safeguarding-friendly oversight, and exportable attainment analytics

## Automation & AI
- Worksheet and assessment generator with templated outputs (reading comprehension, vocabulary practice, grammar drills, listening scripts)
- Automatic marking with feedback suggestions and misconception tagging
- Smart recommendations for follow-up activities based on performance data

## Audio & Media
- Multi-provider text-to-speech (AWS Polly, Google Cloud TTS, Gemini) with caching to minimise latency
- Pronunciation modelling, slow-playback, and phonetic hints
- Teacher voice-over upload workflow with Supabase storage

## Analytics & Reporting
- Real-time dashboards with class, group, and student drill-downs
- Mastery heatmaps, curriculum coverage tracking, and progress alerts
- Exportable PDF/CSV reports for parents, leadership, and inspections
- Console Ninja integration for live monitoring of engagement metrics

## Key Site Sections & URLs
- Marketing homepage: https://languagegems.com/
- Contact page: https://languagegems.com/contact
- Help centre: https://languagegems.com/help
- Pricing & plans: https://languagegems.com/pricing (includes Free, School Pro, Enterprise tiers)
- Games overview: https://languagegems.com/games (interactive catalogue of learning games)
- Teacher onboarding resources: https://languagegems.com/help/getting-started

## Support & Policies
- Email: support@languagegems.com (primary support)
- Additional addresses: sales@languagegems.com, billing@languagegems.com, press@languagegems.com (forward to support team)
- Comprehensive help articles covering onboarding, student management, feature walkthroughs, and billing

## Technical Foundations
- Frontend: Next.js 14, TypeScript, TailwindCSS
- Backend: Supabase (PostgreSQL, Auth, Storage, RLS)
- Real-time analytics via Console Ninja
- Audio rendering pipeline with multi-provider TTS and caching
- Interactive games developed with Phaser.js

## Educational Value
- Aligns with GCSE specifications and supports classroom differentiation
- Encourages communicative competence, not just grammar accuracy
- Combines teacher-led instruction with student self-guided practice
- Includes safeguarding-conscious design and accessibility features

## Typical Use Cases
- Teachers delivering weekly grammar, vocabulary, and skills lessons with auto-marked homework
- Departments planning schemes of work with built-in analytics and resource libraries
- Students revising exam topics with games, AI-generated worksheets, and pronunciation practice
- Schools reporting on attainment, engagement, and intervention impact

## Promise to Users
- Safe, inclusive learning ecosystem for teachers and learners
- Regularly updated content library with new games, assessments, and cultural modules
- Dedicated support team with response targets (general <24h, technical <4h, sales <2h)
`;

export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [] } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // System prompt with LanguageGems knowledge
  const systemPrompt = `You are the official LanguageGems assistant. Use the knowledge base below to answer with accurate, up-to-date information about the platform. If something is unknown, be honest and offer where the user can get help. 

${LANGUAGEGEMS_KNOWLEDGE}

Instructions:
- Answer only with verified LanguageGems information. Never invent features, pricing, or commitments that are not in the knowledge base.
- When referencing a resource, include an absolute Markdown link (e.g. [Help Centre](https://languagegems.com/help)).
- Highlight relevant product areas (assignments, analytics, games, audio, pricing tiers, onboarding) based on the user question.
- For account, billing, or security issues, direct people to support@languagegems.com and/or the Help Centre.
- Use a friendly, encouraging tone suitable for teachers and learners, and keep answers structured with short paragraphs or bullet lists.
- Ask a clarifying follow-up question when it helps you recommend the right feature or next step.
- If a question is outside LanguageGems’ scope, explain the limitation and suggest where to find more information.

Remember: LanguageGems is more than grammar practice—it's a full classroom ecosystem. Celebrate the breadth of tools when appropriate.`;

    // Prepare conversation history for context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })),
      { role: 'user', content: message }
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano-2025-04-14', // Required GPT-4.1 Nano deployment
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    const response = completion.choices[0]?.message?.content || 'I apologize, but I encountered an error. Please try again.';

    return NextResponse.json({
      response,
      success: true
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to process your message. Please try again or contact support@languagegems.com',
        success: false 
      },
      { status: 500 }
    );
  }
}