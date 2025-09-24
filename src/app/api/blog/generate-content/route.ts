import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

interface BlogGenerationRequest {
  topic: string;
  targetAudience: 'teachers' | 'students' | 'parents' | 'general';
  contentType: 'guide' | 'tips' | 'research' | 'news' | 'opinion';
  keywords: string[];
  tone: 'professional' | 'friendly' | 'academic' | 'conversational';
  length: 'short' | 'medium' | 'long'; // 500-800, 800-1200, 1200+ words
}

/**
 * AI-powered blog content generation
 * Uses OpenAI GPT to create high-quality blog posts
 */
export async function POST(request: NextRequest) {
  try {
    const {
      topic,
      targetAudience,
      contentType,
      keywords = [],
      tone = 'professional',
      length = 'medium'
    }: BlogGenerationRequest = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
    
    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'AI content generation not configured' },
        { status: 503 }
      );
    }

    // Generate content using OpenAI
    const generatedContent = await generateBlogContent({
      topic,
      targetAudience,
      contentType,
      keywords,
      tone,
      length
    });

    return NextResponse.json({
      success: true,
      content: generatedContent
    });

  } catch (error) {
    console.error('Blog generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog content' },
      { status: 500 }
    );
  }
}

async function generateBlogContent(params: BlogGenerationRequest) {
  const {
    topic,
    targetAudience,
    contentType,
    keywords,
    tone,
    length
  } = params;

  const wordCounts = {
    short: '500-800',
    medium: '800-1200',
    long: '1200-1500'
  };

  const prompt = `
Write a comprehensive blog post for Language Gems, an educational platform for language learning.

REQUIREMENTS:
- Topic: ${topic}
- Target Audience: ${targetAudience}
- Content Type: ${contentType}
- Tone: ${tone}
- Length: ${wordCounts[length]} words
- Keywords to include: ${keywords.join(', ')}

STRUCTURE:
1. Compelling headline that includes primary keyword
2. Engaging introduction with hook
3. Well-organized main content with subheadings
4. Practical examples and actionable tips
5. Conclusion with clear takeaways
6. SEO-optimized meta description (150-160 characters)

CONTEXT:
Language Gems is a platform that helps teachers and students with:
- GCSE language preparation (Spanish, French, German)
- Vocabulary learning games
- Interactive educational tools
- Teaching resources and strategies
- Gamification in education

STYLE GUIDELINES:
- Use clear, accessible language
- Include specific examples and case studies
- Add practical tips teachers can implement
- Reference current educational research when relevant
- Maintain expertise and authority
- Include calls-to-action for Language Gems features

OUTPUT FORMAT:
Return a JSON object with:
{
  "title": "SEO-optimized title",
  "slug": "url-friendly-slug",
  "content": "Full HTML content with proper headings and formatting",
  "excerpt": "Compelling 150-200 character summary",
  "seo_title": "SEO title (60 characters max)",
  "seo_description": "Meta description (150-160 characters)",
  "keywords": ["keyword1", "keyword2", "keyword3"],
  "reading_time_minutes": estimated_reading_time,
  "featured_image_prompt": "Description for AI image generation"
}

Write the blog post now:
`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'You are an expert educational content writer specializing in language learning and teaching strategies. You write engaging, informative blog posts that help teachers and students succeed.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 3000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0]?.message?.content;

    if (!generatedText) {
      throw new Error('No content generated');
    }

    // Parse the JSON response from GPT
    try {
      const parsedContent = JSON.parse(generatedText);
      
      // Validate required fields
      const requiredFields = ['title', 'slug', 'content', 'excerpt'];
      for (const field of requiredFields) {
        if (!parsedContent[field]) {
          throw new Error(`Missing required field: ${field}`);
        }
      }

      return parsedContent;
    } catch (parseError) {
      // If JSON parsing fails, create a structured response
      return {
        title: `${topic}: A Comprehensive Guide`,
        slug: topic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
        content: `<h1>${topic}</h1>\n\n${generatedText}`,
        excerpt: `Discover everything you need to know about ${topic} in this comprehensive guide.`,
        seo_title: topic.substring(0, 60),
        seo_description: `Learn about ${topic} with practical tips and strategies for language learning success.`,
        keywords: keywords,
        reading_time_minutes: Math.ceil(generatedText.split(' ').length / 200),
        featured_image_prompt: `Educational illustration about ${topic} for language learning`
      };
    }

  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate content with AI');
  }
}

/**
 * GET endpoint to retrieve generation templates and options
 */
export async function GET() {
  return NextResponse.json({
    targetAudiences: [
      { value: 'teachers', label: 'Teachers & Educators' },
      { value: 'students', label: 'Students & Learners' },
      { value: 'parents', label: 'Parents & Guardians' },
      { value: 'general', label: 'General Audience' }
    ],
    contentTypes: [
      { value: 'guide', label: 'How-to Guide' },
      { value: 'tips', label: 'Tips & Strategies' },
      { value: 'research', label: 'Research & Analysis' },
      { value: 'news', label: 'News & Updates' },
      { value: 'opinion', label: 'Opinion & Commentary' }
    ],
    tones: [
      { value: 'professional', label: 'Professional' },
      { value: 'friendly', label: 'Friendly & Approachable' },
      { value: 'academic', label: 'Academic & Scholarly' },
      { value: 'conversational', label: 'Conversational' }
    ],
    lengths: [
      { value: 'short', label: 'Short (500-800 words)' },
      { value: 'medium', label: 'Medium (800-1200 words)' },
      { value: 'long', label: 'Long (1200+ words)' }
    ],
    suggestedTopics: [
      'GCSE Spanish Vocabulary Strategies',
      'Gamification in Language Learning',
      'Effective Pronunciation Teaching Methods',
      'Digital Tools for Modern Language Classrooms',
      'Assessment Strategies for Language Skills',
      'Cultural Integration in Language Education',
      'Motivation Techniques for Language Learners',
      'Technology-Enhanced Language Learning'
    ]
  });
}
