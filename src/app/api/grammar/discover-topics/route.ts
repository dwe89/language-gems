import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

interface DiscoveredTopic {
  name: string;
  slug: string;
  category: string;
  path: string;
  hasQuiz: boolean;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const language = searchParams.get('language') || 'spanish';

    // Map language to directory name
    const languageMap: { [key: string]: string } = {
      'spanish': 'spanish',
      'french': 'french', 
      'german': 'german'
    };

    const languageDir = languageMap[language];
    if (!languageDir) {
      return NextResponse.json(
        { error: 'Unsupported language' },
        { status: 400 }
      );
    }

    const grammarPath = path.join(process.cwd(), 'src', 'app', 'grammar', languageDir);
    
    // Check if directory exists
    try {
      await fs.access(grammarPath);
    } catch {
      return NextResponse.json(
        { error: 'Grammar directory not found' },
        { status: 404 }
      );
    }

    const topics = await discoverTopicsRecursively(grammarPath, languageDir);

    return NextResponse.json({
      success: true,
      data: topics,
      count: topics.length
    });

  } catch (error) {
    console.error('Error discovering grammar topics:', error);
    return NextResponse.json(
      { error: 'Failed to discover grammar topics' },
      { status: 500 }
    );
  }
}

async function discoverTopicsRecursively(
  dirPath: string, 
  language: string, 
  category: string = '',
  topics: DiscoveredTopic[] = []
): Promise<DiscoveredTopic[]> {
  
  try {
    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        // Skip certain directories
        if (['components', 'api', 'node_modules', '.next'].includes(entry.name)) {
          continue;
        }

        // Determine category from directory structure
        let currentCategory = category;
        if (!category && !['spanish', 'french', 'german'].includes(entry.name)) {
          currentCategory = entry.name;
        }

        // Recursively explore subdirectories
        await discoverTopicsRecursively(fullPath, language, currentCategory, topics);

      } else if (entry.name === 'page.tsx') {
        // Found a topic page
        const relativePath = path.relative(
          path.join(process.cwd(), 'src', 'app', 'grammar', language),
          dirPath
        );

        // Skip root page and category pages
        if (!relativePath || relativePath.split(path.sep).length === 1) {
          continue;
        }

        const pathParts = relativePath.split(path.sep);
        const topicCategory = pathParts[0];
        const topicSlug = pathParts[pathParts.length - 1];

        // Skip quiz subdirectories - we'll detect them separately
        if (topicSlug === 'quiz') {
          continue;
        }

        // Check if there's a quiz subdirectory
        const quizPath = path.join(dirPath, 'quiz', 'page.tsx');
        let hasQuiz = false;
        try {
          await fs.access(quizPath);
          hasQuiz = true;
        } catch {
          // No quiz available
        }

        topics.push({
          name: formatTopicName(topicSlug),
          slug: topicSlug,
          category: topicCategory,
          path: relativePath,
          hasQuiz
        });
      }
    }

    return topics;

  } catch (error) {
    console.error(`Error reading directory ${dirPath}:`, error);
    return topics;
  }
}

function formatTopicName(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
