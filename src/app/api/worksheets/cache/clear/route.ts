import { NextRequest, NextResponse } from 'next/server';
import { clearWorksheetCache, getCacheStats } from '@/lib/worksheets/cache';

export async function POST(request: NextRequest) {
  try {
    // Get cache stats before clearing
    const statsBefore = getCacheStats();
    
    // Clear the cache
    clearWorksheetCache();
    
    // Get cache stats after clearing
    const statsAfter = getCacheStats();
    
    return NextResponse.json({
      success: true,
      message: 'Worksheet cache cleared successfully',
      statsBefore,
      statsAfter
    });
  } catch (error: any) {
    console.error('Error clearing worksheet cache:', error);
    return NextResponse.json(
      { error: `Failed to clear cache: ${error.message}` },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = getCacheStats();
    
    return NextResponse.json({
      success: true,
      stats
    });
  } catch (error: any) {
    console.error('Error getting cache stats:', error);
    return NextResponse.json(
      { error: `Failed to get cache stats: ${error.message}` },
      { status: 500 }
    );
  }
}
