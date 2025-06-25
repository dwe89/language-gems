import { NextRequest, NextResponse } from 'next/server';
// Removing Supabase dependency for now - will add back when database is ready
// import { createClient } from '@supabase/supabase-js';

// const supabase = createClient(
//   process.env.NEXT_PUBLIC_SUPABASE_URL!,
//   process.env.SUPABASE_SERVICE_ROLE_KEY!
// );

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language');
    const keyStage = searchParams.get('keyStage');
    const topic = searchParams.get('topic');

    if (!language || !keyStage || !topic) {
      return NextResponse.json(
        { error: 'Missing required parameters: language, keyStage, topic' },
        { status: 400 }
      );
    }

    // For now, return mock data. Later this will query the actual database
    const mockResources = generateMockResources(language, keyStage, topic);

    return NextResponse.json({
      success: true,
      resources: mockResources,
      totalCount: mockResources.length
    });

  } catch (error) {
    console.error('Error fetching freebies resources:', error);
    return NextResponse.json(
      { error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}

function generateMockResources(language: string, keyStage: string, topic: string) {
  const topicName = topic.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase());
  
  const baseResources = [
    {
      id: `${topic}-vocab-1`,
      title: `${topicName} Vocabulary Builder`,
      description: `Essential vocabulary for ${topic.replace('-', ' ')} with practical exercises and examples.`,
      type: 'worksheet',
      level: 'Beginner',
      featured: true,
      fileType: 'PDF',
      pages: Math.floor(Math.random() * 5) + 3,
      skills: ['Vocabulary', 'Reading', 'Writing'],
      downloadUrl: `/resources/downloads/${topic}-vocabulary-${language}.pdf`,
      previewUrl: `/resources/preview/${topic}-vocabulary-${language}`,
      language,
      keyStage,
      topic
    },
    {
      id: `${topic}-grammar-1`,
      title: `${topicName} Grammar Guide`,
      description: `Grammar structures and patterns for ${topic.replace('-', ' ')} with clear explanations and practice.`,
      type: 'worksheet',
      level: keyStage === 'ks3' ? 'Beginner' : 'Intermediate',
      featured: false,
      fileType: 'PDF',
      pages: Math.floor(Math.random() * 4) + 4,
      skills: ['Grammar', 'Writing', 'Speaking'],
      downloadUrl: `/resources/downloads/${topic}-grammar-${language}.pdf`,
      language,
      keyStage,
      topic
    },
    {
      id: `${topic}-listening-1`,
      title: `${topicName} Listening Practice`,
      description: `Audio exercises with native speakers discussing ${topic.replace('-', ' ')} topics.`,
      type: 'audio',
      level: keyStage === 'ks5' ? 'Advanced' : 'Intermediate',
      featured: keyStage === 'ks4',
      fileType: 'MP3 + PDF',
      duration: `${Math.floor(Math.random() * 15) + 10} mins`,
      skills: ['Listening', 'Comprehension'],
      downloadUrl: `/resources/downloads/${topic}-listening-${language}.zip`,
      language,
      keyStage,
      topic
    }
  ];

  // Add assessment pack for advanced levels
  if (keyStage !== 'ks3' || ['identity', 'school', 'free-time'].includes(topic)) {
    baseResources.push({
      id: `${topic}-assessment-1`,
      title: `${topicName} Assessment Pack`,
      description: `Comprehensive assessment materials including tests and marking schemes for ${topic.replace('-', ' ')}.`,
      type: 'assessment',
      level: keyStage === 'ks3' ? 'Beginner' : keyStage === 'ks4' ? 'Intermediate' : 'Advanced',
      featured: false,
      fileType: 'PDF Pack',
      pages: Math.floor(Math.random() * 6) + 6,
      skills: ['Assessment', 'All Skills'],
      downloadUrl: `/resources/downloads/${topic}-assessment-${language}.pdf`,
      language,
      keyStage,
      topic
    });
  }

  return baseResources;
} 