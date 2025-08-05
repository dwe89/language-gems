import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { UnifiedVocabularyAnalytics, VocabularyFilters } from '../../../../services/unifiedVocabularyAnalytics';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');

    if (!studentId) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }

    // Parse filters from query parameters
    const filters: VocabularyFilters = {};
    
    const language = searchParams.get('language');
    if (language && language.trim() !== '') {
      filters.language = language;
    }

    const category = searchParams.get('category');
    if (category && category.trim() !== '') {
      filters.category = category;
    }

    const subcategory = searchParams.get('subcategory');
    if (subcategory && subcategory.trim() !== '') {
      filters.subcategory = subcategory;
    }

    const curriculumLevel = searchParams.get('curriculum_level');
    if (curriculumLevel && curriculumLevel.trim() !== '') {
      filters.curriculum_level = curriculumLevel;
    }

    const minAttempts = searchParams.get('min_attempts');
    if (minAttempts) {
      filters.minAttempts = parseInt(minAttempts, 10);
    }

    const accuracyMin = searchParams.get('accuracy_min');
    const accuracyMax = searchParams.get('accuracy_max');
    if (accuracyMin || accuracyMax) {
      filters.accuracyRange = [
        accuracyMin ? parseInt(accuracyMin, 10) : 0,
        accuracyMax ? parseInt(accuracyMax, 10) : 100
      ];
    }

    const dateFrom = searchParams.get('date_from');
    const dateTo = searchParams.get('date_to');
    if (dateFrom || dateTo) {
      filters.dateRange = [
        dateFrom ? new Date(dateFrom) : new Date(0),
        dateTo ? new Date(dateTo) : new Date()
      ];
    }

    // Initialize the unified analytics service
    const analytics = new UnifiedVocabularyAnalytics(supabase);

    // Get the requested data type
    const dataType = searchParams.get('type') || 'summary';
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    switch (dataType) {
      case 'summary':
        // Get comprehensive statistics
        const stats = await analytics.getVocabularyStats(studentId, filters);
        return NextResponse.json({ stats });

      case 'words':
        // Get detailed word list
        const words = await analytics.getVocabularyWords(studentId, filters);
        return NextResponse.json({ words });

      case 'weak-words':
        // Get weak words for targeted practice
        const weakWords = await analytics.getWeakWords(studentId, filters, limit);
        const weakStats = await analytics.getVocabularyStats(studentId, filters);
        return NextResponse.json({ 
          weakWords,
          summary: {
            totalWords: weakStats.totalWords,
            weakWordsCount: weakStats.weakWords,
            strongWordsCount: weakStats.strongWords,
            averageAccuracy: weakStats.averageAccuracy
          }
        });

      case 'strong-words':
        // Get strong words for review or challenge
        const strongWords = await analytics.getStrongWords(studentId, filters, limit);
        const strongStats = await analytics.getVocabularyStats(studentId, filters);
        return NextResponse.json({ 
          strongWords,
          summary: {
            totalWords: strongStats.totalWords,
            weakWordsCount: strongStats.weakWords,
            strongWordsCount: strongStats.strongWords,
            averageAccuracy: strongStats.averageAccuracy
          }
        });

      case 'review':
        // Get words needing review
        const reviewWords = await analytics.getWordsNeedingReview(studentId, filters);
        return NextResponse.json({ reviewWords });

      case 'recommendations':
        // Get AI-powered recommendations
        const recommendations = await analytics.getRecommendations(studentId, filters);
        return NextResponse.json({ recommendations });

      case 'analysis':
        // Get comprehensive analysis (what the dashboard needs)
        const [analysisStats, analysisWeakWords, analysisStrongWords, analysisRecommendations] = await Promise.all([
          analytics.getVocabularyStats(studentId, filters),
          analytics.getWeakWords(studentId, filters, 20),
          analytics.getStrongWords(studentId, filters, 20),
          analytics.getRecommendations(studentId, filters)
        ]);

        // Get available filter options
        const allWords = await analytics.getVocabularyWords(studentId);
        const availableFilters = {
          languages: [...new Set(allWords.map(w => w.language).filter(Boolean))].sort(),
          categories: [...new Set(allWords.map(w => w.category).filter(Boolean))].sort(),
          subcategories: [...new Set(allWords.map(w => w.subcategory).filter(Boolean))].sort(),
          curriculumLevels: [...new Set(allWords.map(w => w.curriculum_level).filter(Boolean))].sort()
        };

        return NextResponse.json({
          summary: {
            totalWords: analysisStats.totalWords,
            weakWordsCount: analysisStats.weakWords,
            strongWordsCount: analysisStats.strongWords,
            averageAccuracy: analysisStats.averageAccuracy
          },
          weakWords: analysisWeakWords,
          strongWords: analysisStrongWords,
          recommendations: analysisRecommendations,
          stats: analysisStats,
          availableFilters,
          appliedFilters: filters
        });

      default:
        return NextResponse.json({ error: 'Invalid data type' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in vocabulary analytics API:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

// POST endpoint for clearing cache
export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const action = searchParams.get('action');

    if (action === 'clear-cache') {
      const analytics = new UnifiedVocabularyAnalytics(supabase);
      
      if (studentId) {
        analytics.clearStudentCache(studentId);
        return NextResponse.json({ message: `Cache cleared for student ${studentId}` });
      } else {
        analytics.clearCache();
        return NextResponse.json({ message: 'All cache cleared' });
      }
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Error in vocabulary analytics POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
