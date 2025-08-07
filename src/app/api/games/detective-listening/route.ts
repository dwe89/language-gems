import { NextRequest, NextResponse } from 'next/server';
import { generateGameData, getAvailableCaseTypes } from '../../../games/detective-listening/data/databaseGameData';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseType = searchParams.get('caseType') || 'animals';
    const language = searchParams.get('language') || 'spanish';
    const count = parseInt(searchParams.get('count') || '10');

    // Generate game data using the centralized vocabulary service
    const gameData = await generateGameData(caseType, language, count);

    return NextResponse.json({
      success: true,
      data: gameData,
      caseType,
      language,
      count
    });

  } catch (error) {
    console.error('Error generating detective listening game data:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to generate game data',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get available case types
    const availableCaseTypes = await getAvailableCaseTypes();

    return NextResponse.json({
      success: true,
      caseTypes: availableCaseTypes
    });

  } catch (error) {
    console.error('Error getting available case types:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get case types',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
