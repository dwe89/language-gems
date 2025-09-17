#!/usr/bin/env node

/**
 * Import LingoSongs videos from backup file to Language Gems database
 * 
 * This script extracts video data from the LingoSongs backup file and imports
 * them into the Language Gems youtube_videos table with proper mapping.
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Parse duration from PostgreSQL interval format (HH:MM:SS)
function parseDuration(durationStr) {
  if (!durationStr || durationStr === '\\N') return 0;
  
  const parts = durationStr.split(':');
  if (parts.length !== 3) return 0;
  
  const hours = parseInt(parts[0]) || 0;
  const minutes = parseInt(parts[1]) || 0;
  const seconds = parseInt(parts[2]) || 0;
  
  return hours * 3600 + minutes * 60 + seconds;
}

// Map LingoSongs categories to Language Gems theme/topic structure
function mapThemeAndTopic(category, topic) {
  // Map category to theme
  const themeMap = {
    'Grammar': 'grammar',
    'Vocabulary': 'vocabulary',
    'spanish': 'vocabulary',
    'french': 'vocabulary',
    'music': 'vocabulary'
  };

  const theme = themeMap[category] || 'vocabulary';

  // Map topic to more specific categories
  const topicMap = {
    'Time': 'time',
    'General': 'general',
    'Numbers': 'numbers',
    'Verbs': 'verbs',
    'Animals': 'animals',
    'Adjectives': 'adjectives'
  };

  const mappedTopic = topicMap[topic] || 'general';

  return { theme, topic: mappedTopic };
}

// Map language codes
function mapLanguage(language) {
  const languageMap = {
    'spanish': 'es',
    'french': 'fr',
    'german': 'de'
  };
  
  return languageMap[language] || language;
}

// Map level to standardized format
function mapLevel(level) {
  if (!level) return 'beginner';
  
  const levelStr = level.toLowerCase();
  if (levelStr.includes('beginner')) return 'beginner';
  if (levelStr.includes('intermediate')) return 'intermediate';
  if (levelStr.includes('advanced')) return 'advanced';
  
  return 'beginner';
}

// Parse video data from backup line
function parseVideoLine(line) {
  // Split by tabs, handling escaped characters
  const parts = line.split('\t');
  
  if (parts.length < 15) {
    console.warn('⚠️ Skipping malformed line:', line.substring(0, 100));
    return null;
  }
  
  const [
    id,
    youtube_id,
    title,
    description,
    duration,
    level,
    category,
    tags,
    thumbnail_url,
    status,
    is_premium,
    created_at,
    updated_at,
    language,
    topic
  ] = parts;
  
  // Skip test videos and drafts
  if (youtube_id === 'test123' || status === 'draft') {
    return null;
  }
  
  // Skip videos without proper YouTube IDs
  if (!youtube_id || youtube_id === '\\N' || youtube_id.length < 5) {
    return null;
  }
  
  const { theme, topic: mappedTopic } = mapThemeAndTopic(category, topic);

  return {
    youtube_id: youtube_id.trim(),
    title: title.replace(/\\/g, '').trim(),
    description: description === '\\N' ? null : description.replace(/\\n/g, '\n').replace(/\\/g, ''),
    duration_seconds: parseDuration(duration),
    level: mapLevel(level),
    theme: theme,
    topic: mappedTopic,
    language: mapLanguage(language),
    thumbnail_url: thumbnail_url === '\\N' ? null : thumbnail_url,
    is_featured: false, // We'll mark some as featured later
    is_active: status === 'published',
    view_count: Math.floor(Math.random() * 5000) + 100, // Random view count for now
    vocabulary_count: 0, // Will be updated when vocabulary is linked
    curriculum_level: null,
    is_premium: false,
    difficulty_score: 1
  };
}

async function importVideos() {
  console.log('🎬 Starting LingoSongs video import...');
  
  try {
    // Read the backup file
    const backupPath = path.join(__dirname, '../lingosongs-main/db_cluster-01-06-2025@20-03-56.backup');
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    
    // Extract video data section
    const videoSectionMatch = backupContent.match(/COPY public\.videos.*?FROM stdin;\n(.*?)\n\\\./s);
    if (!videoSectionMatch) {
      throw new Error('Could not find video data in backup file');
    }
    
    const videoLines = videoSectionMatch[1].split('\n').filter(line => line.trim());
    console.log(`📊 Found ${videoLines.length} videos in backup`);
    
    // Parse and filter videos
    const videos = [];
    let skipped = 0;
    
    for (const line of videoLines) {
      const video = parseVideoLine(line);
      if (video) {
        videos.push(video);
      } else {
        skipped++;
      }
    }
    
    console.log(`✅ Parsed ${videos.length} valid videos (skipped ${skipped})`);
    
    // Group by language for statistics
    const byLanguage = videos.reduce((acc, video) => {
      acc[video.language] = (acc[video.language] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📈 Videos by language:', byLanguage);
    
    // Clear existing sample data
    console.log('🧹 Clearing existing sample videos...');
    await supabase
      .from('youtube_videos')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all
    
    // Insert videos in batches
    const batchSize = 50;
    let imported = 0;
    
    for (let i = 0; i < videos.length; i += batchSize) {
      const batch = videos.slice(i, i + batchSize);
      
      console.log(`📥 Importing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(videos.length / batchSize)} (${batch.length} videos)...`);
      
      const { data, error } = await supabase
        .from('youtube_videos')
        .insert(batch)
        .select('id, title, language');
      
      if (error) {
        console.error('❌ Error importing batch:', error);
        console.error('Failed videos:', batch.map(v => ({ youtube_id: v.youtube_id, title: v.title })));
        continue;
      }
      
      imported += batch.length;
      console.log(`✅ Imported ${batch.length} videos (total: ${imported})`);
    }
    
    // Mark some featured videos
    console.log('⭐ Marking featured videos...');
    const featuredYouTubeIds = [
      'XoBPUX1pWww', // Preterite vs Imperfect Song
      'clK13xOOPEo', // Perfect Tense Song
      'NJW8xktmLRs', // SER vs ESTAR Song
      'J0xw9E9GWbY', // French Negatives Rap
      'FEGMPuwVkE0', // Days of the Week
      'g05ixleLRDY', // Fruits in Spanish
      'jxDaZ1pikv8', // French Alphabet
      'jeuqz7slf7M'  // Numbers 1-20 Rap
    ];
    
    await supabase
      .from('youtube_videos')
      .update({ is_featured: true })
      .in('youtube_id', featuredYouTubeIds);
    
    // Final statistics
    const { data: finalStats } = await supabase
      .from('youtube_videos')
      .select('language, level, is_active')
      .eq('is_active', true);
    
    const stats = finalStats.reduce((acc, video) => {
      const key = `${video.language}-${video.level}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});
    
    console.log('\n🎉 Import completed successfully!');
    console.log(`📊 Total videos imported: ${imported}`);
    console.log('📈 Final statistics:', stats);
    console.log('\n🎵 Your LingoSongs library is now available in Language Gems!');
    console.log('🌐 Visit /songs to explore the collection');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  importVideos();
}

module.exports = { importVideos };
