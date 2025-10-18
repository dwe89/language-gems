/**
 * MIGRATION SCRIPT: Move all grammar page content to Supabase
 * This reads all page.tsx files and inserts their content into the grammar_pages table
 */

import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Supabase setup
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface GrammarPageData {
  language: string;
  category: string;
  topic_slug: string;
  title: string;
  description: string;
  difficulty?: string;
  estimated_time?: number;
  youtube_video_id?: string;
  sections: any[];
  related_topics?: any[];
  back_url?: string;
  practice_url?: string;
  quiz_url?: string;
  song_url?: string;
}

const GRAMMAR_BASE_PATH = path.join(process.cwd(), 'src/app/grammar');

function extractDataFromFile(filePath: string, language: string, category: string, topic: string): GrammarPageData | null {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    
    // Extract sections array
    const sectionsMatch = fileContent.match(/const sections\s*(?::\s*\w+\[\])?\s*=\s*(\[[\s\S]*?\]);/);
    if (!sectionsMatch) {
      console.warn(`⚠️  No sections found in ${language}/${category}/${topic}`);
      return null;
    }

    // Extract related topics
    const relatedTopicsMatch = fileContent.match(/const relatedTopics\s*(?::\s*\w+\[\])?\s*=\s*(\[[\s\S]*?\]);/);
    
    // Extract GrammarPageTemplate props
    const titleMatch = fileContent.match(/title=["']([^"']+)["']/);
    const descriptionMatch = fileContent.match(/description=["']([^"']+)["']/);
    const difficultyMatch = fileContent.match(/difficulty=["']([^"']+)["']/);
    const estimatedTimeMatch = fileContent.match(/estimatedTime=\{(\d+)\}/);
    const youtubeMatch = fileContent.match(/youtubeVideoId=["']([^"']+)["']/);
    const backUrlMatch = fileContent.match(/backUrl=["']([^"']+)["']/);
    const practiceUrlMatch = fileContent.match(/practiceUrl=["']([^"']+)["']/);
    const quizUrlMatch = fileContent.match(/quizUrl=["']([^"']+)["']/);
    const songUrlMatch = fileContent.match(/songUrl=["']([^"']+)["']/);

    // Parse sections (safely evaluate the array)
    let sections: any[] = [];
    try {
      // Use eval in a controlled way (we trust our own code)
      sections = eval(sectionsMatch[1]);
    } catch (error) {
      console.error(`❌ Error parsing sections for ${language}/${category}/${topic}:`, error);
      return null;
    }

    // Parse related topics
    let relatedTopics: any[] | undefined;
    if (relatedTopicsMatch) {
      try {
        relatedTopics = eval(relatedTopicsMatch[1]);
      } catch (error) {
        console.warn(`⚠️  Error parsing related topics for ${language}/${category}/${topic}`);
      }
    }

    return {
      language,
      category,
      topic_slug: topic,
      title: titleMatch?.[1] || `${topic} - ${language}`,
      description: descriptionMatch?.[1] || '',
      difficulty: difficultyMatch?.[1],
      estimated_time: estimatedTimeMatch ? parseInt(estimatedTimeMatch[1]) : undefined,
      youtube_video_id: youtubeMatch?.[1],
      sections,
      related_topics: relatedTopics,
      back_url: backUrlMatch?.[1],
      practice_url: practiceUrlMatch?.[1],
      quiz_url: quizUrlMatch?.[1],
      song_url: songUrlMatch?.[1]
    };
  } catch (error) {
    console.error(`❌ Error reading file ${filePath}:`, error);
    return null;
  }
}

async function migrateGrammarPages() {
  console.log('🔄 Starting grammar pages migration to database...\n');

  const languages = ['spanish', 'french', 'german'];
  const allPages: GrammarPageData[] = [];
  let skipped = 0;

  // Extract all pages
  for (const language of languages) {
    const languagePath = path.join(GRAMMAR_BASE_PATH, language);
    
    if (!fs.existsSync(languagePath)) {
      console.log(`⚠️  Language directory not found: ${language}`);
      continue;
    }

    const categories = fs.readdirSync(languagePath, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .filter(name => !name.startsWith('['));  // Skip dynamic routes

    for (const category of categories) {
      const categoryPath = path.join(languagePath, category);
      
      const topics = fs.readdirSync(categoryPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

      for (const topic of topics) {
        const pagePath = path.join(categoryPath, topic, 'page.tsx');
        
        if (!fs.existsSync(pagePath)) {
          skipped++;
          continue;
        }

        const pageData = extractDataFromFile(pagePath, language, category, topic);
        if (pageData) {
          allPages.push(pageData);
          console.log(`✅ Extracted: ${language}/${category}/${topic}`);
        } else {
          skipped++;
        }
      }
    }
  }

  console.log(`\n📊 Extraction complete:`);
  console.log(`   - Extracted: ${allPages.length} pages`);
  console.log(`   - Skipped: ${skipped} pages`);

  // Insert into database
  console.log(`\n🔄 Inserting into database...`);

  let inserted = 0;
  let errors = 0;

  for (const page of allPages) {
    try {
      const { error } = await supabase
        .from('grammar_pages')
        .insert(page);

      if (error) {
        console.error(`❌ Error inserting ${page.language}/${page.category}/${page.topic_slug}:`, error.message);
        errors++;
      } else {
        inserted++;
        if (inserted % 10 === 0) {
          console.log(`   ... ${inserted}/${allPages.length} inserted`);
        }
      }
    } catch (error) {
      console.error(`❌ Exception inserting ${page.language}/${page.category}/${page.topic_slug}:`, error);
      errors++;
    }
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`📊 Summary:`);
  console.log(`   - Successfully inserted: ${inserted} pages`);
  console.log(`   - Errors: ${errors} pages`);
  console.log(`   - Total in database: ${inserted} pages`);

  // Verify database
  const { count } = await supabase
    .from('grammar_pages')
    .select('*', { count: 'exact', head: true });

  console.log(`\n🔍 Database verification:`);
  console.log(`   - Total rows in grammar_pages: ${count}`);
}

migrateGrammarPages().catch(console.error);

