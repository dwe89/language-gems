import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function GET(request: NextRequest) {
  try {
    // Get authentication from cookies
    const cookieStore = await cookies();
    const session = cookieStore.get('session');
    
    // For now, return structured GCSE curriculum data
    // This could be enhanced to fetch from MCP Supabase in the future
    const gcseCurriculum = {
      Foundation: {
        'Identity and Culture': [
          'Family and Friends',
          'Personal Relationships', 
          'Marriage and Partnership',
          'Social Media and Technology',
          'Festivals and Traditions'
        ],
        'Local Area, Holiday and Travel': [
          'Tourist Information and Directions',
          'Weather',
          'Transport',
          'Accommodation',
          'Holiday Activities and Experiences'
        ],
        'School': [
          'School Types and School System',
          'School Subjects',
          'School Day and Routine',
          'Rules and Regulations',
          'Problems at School'
        ],
        'Future Aspirations, Study and Work': [
          'Further Education and Training',
          'Career Choices and Ambitions',
          'Jobs and Employment',
          'Volunteering and Work Experience'
        ],
        'International and Global Dimension': [
          'Environmental Issues',
          'Poverty and Homelessness',
          'Healthy Living',
          'Life in Other Countries'
        ]
      },
      Higher: {
        'Identity and Culture': [
          'Regional Identity',
          'National Identity', 
          'International Identity',
          'Cultural Life',
          'Multiculturalism',
          'Equality and Discrimination'
        ],
        'Local Area, Holiday and Travel': [
          'Advantages and Disadvantages of Tourism',
          'Holiday Disasters',
          'Travel and Tourist Information',
          'Town or Region',
          'Natural and Built Environment'
        ],
        'School': [
          'Achievement and Underachievement',
          'Getting the Best from School',
          'Primary vs Secondary Education',
          'Specialist Schools',
          'Extra-curricular Activities'
        ],
        'Future Aspirations, Study and Work': [
          'Communication Technology',
          'Part-time Jobs',
          'Studying and Working Abroad',
          'Skills and Personal Qualities',
          'Unemployment',
          'Enterprise and Entrepreneurship'
        ],
        'International and Global Dimension': [
          'Current Social Issues',
          'Global Problems',
          'Environmental Problems',
          'Solutions to Environmental Problems',
          'Contributing to Society'
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