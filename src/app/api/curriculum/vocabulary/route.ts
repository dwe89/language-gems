import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get authentication from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    // Try to fetch real data from the database
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/vocabulary?select=theme,topic`, {
        headers: {
          'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        // Group the real data by theme and topic
        const themeGroups: { [key: string]: string[] } = {};
        
        data.forEach((item: { theme: string; topic: string }) => {
          if (item.theme && item.topic) {
            if (!themeGroups[item.theme]) {
              themeGroups[item.theme] = [];
            }
            if (!themeGroups[item.theme].includes(item.topic)) {
              themeGroups[item.theme].push(item.topic);
            }
          }
        });

        // Structure as GCSE curriculum - both Foundation and Higher use same topics
        const gcseCurriculum = {
          Foundation: themeGroups,
          Higher: themeGroups
        };

        return NextResponse.json(gcseCurriculum);
      }
    } catch (error) {
      console.error('Error fetching from Supabase:', error);
    }
    
    // Fallback to structured GCSE curriculum with real topics
    const gcseCurriculum = {
      Foundation: {
        'People and lifestyle': [
          'Identity and relationships',
          'Healthy living and lifestyle', 
          'Education and work'
        ],
        'Communication and the world around us': [
          'Environment and where people live',
          'Media and technology',
          'Travel and tourism'
        ],
        'Popular culture': [
          'Free time activities',
          'Celebrity culture',
          'Customs, festivals and celebrations'
        ]
      },
      Higher: {
        'People and lifestyle': [
          'Identity and relationships',
          'Healthy living and lifestyle', 
          'Education and work'
        ],
        'Communication and the world around us': [
          'Environment and where people live',
          'Media and technology',
          'Travel and tourism'
        ],
        'Popular culture': [
          'Free time activities',
          'Celebrity culture',
          'Customs, festivals and celebrations'
        ]
      }
    };

    return NextResponse.json(gcseCurriculum);
  } catch (error) {
    console.error('Error fetching curriculum data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch curriculum data' },
      { status: 500 }
    );
  }
} 