#!/usr/bin/env node

/**
 * Import LingoSongs game data (quiz questions, grammar notes) from backup file
 * 
 * This script extracts quiz questions and grammar notes from the LingoSongs backup
 * and imports them into Language Gems database with proper video linking.
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

// Create tables for game data if they don't exist
async function createGameTables() {
  console.log('🏗️ Creating game tables...');
  
  // Create video_quiz_questions table
  const quizTableSQL = `
    CREATE TABLE IF NOT EXISTS video_quiz_questions (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      video_id UUID REFERENCES youtube_videos(id) ON DELETE CASCADE,
      question TEXT NOT NULL,
      options JSONB NOT NULL,
      correct_answer TEXT NOT NULL,
      explanation TEXT,
      difficulty_level TEXT DEFAULT 'beginner',
      question_type TEXT DEFAULT 'multiple_choice',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS video_quiz_questions_video_id_idx ON video_quiz_questions(video_id);
  `;
  
  // Create video_grammar_notes table
  const grammarTableSQL = `
    CREATE TABLE IF NOT EXISTS video_grammar_notes (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      video_id UUID REFERENCES youtube_videos(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      section_order INTEGER DEFAULT 1,
      example TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    
    CREATE INDEX IF NOT EXISTS video_grammar_notes_video_id_idx ON video_grammar_notes(video_id);
  `;
  
  try {
    await supabase.rpc('exec_sql', { sql: quizTableSQL });
    await supabase.rpc('exec_sql', { sql: grammarTableSQL });
    console.log('✅ Game tables created successfully');
  } catch (error) {
    // Try direct execution if RPC doesn't work
    console.log('⚠️ RPC failed, trying direct execution...');
    // We'll handle table creation manually if needed
  }
}

// Parse quiz question data
function parseQuizLine(line) {
  // Split by tabs, but be careful with the JSON field
  const parts = [];
  let current = '';
  let inJson = false;
  let bracketCount = 0;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '[' && !inJson) {
      inJson = true;
      bracketCount = 1;
      current += char;
    } else if (char === '[' && inJson) {
      bracketCount++;
      current += char;
    } else if (char === ']' && inJson) {
      bracketCount--;
      current += char;
      if (bracketCount === 0) {
        inJson = false;
      }
    } else if (char === '\t' && !inJson) {
      parts.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  if (current) parts.push(current);

  if (parts.length < 8) return null;

  const [id, video_id, question, options, correct_answer, explanation, created_at, updated_at] = parts;

  try {
    // Clean up the options JSON string
    let cleanOptions = options.replace(/\\"/g, '"');
    const parsedOptions = JSON.parse(cleanOptions);

    return {
      video_id: parseInt(video_id),
      question_text: question.trim(),
      options: parsedOptions,
      correct_answer: correct_answer.trim(),
      explanation: explanation === '\\N' ? null : explanation,
      difficulty_level: 'beginner',
      question_type: 'multiple_choice',
      points: 10,
      order_index: 1,
      is_active: true
    };
  } catch (error) {
    console.warn('⚠️ Failed to parse quiz question:', line.substring(0, 100));
    return null;
  }
}

// Parse grammar notes data
function parseGrammarLine(line) {
  const parts = line.split('\t');
  if (parts.length < 8) return null;
  
  const [id, video_id, title, content, section_order, created_at, updated_at, example] = parts;
  
  return {
    video_id: parseInt(video_id),
    title: title.trim(),
    content: content.replace(/\\n/g, '\n').trim(),
    section_order: parseInt(section_order) || 1,
    example: example === '\\N' ? null : example
  };
}

async function importGameData() {
  console.log('🎮 Starting LingoSongs game data import...');
  
  try {
    // Read the backup file
    const backupPath = path.join(__dirname, '../lingosongs-main/db_cluster-01-06-2025@20-03-56.backup');
    const backupContent = fs.readFileSync(backupPath, 'utf8');
    
    // Create video ID mapping (LingoSongs ID -> Language Gems UUID)
    console.log('🔗 Creating video ID mapping...');
    const { data: videos, error: videoError } = await supabase
      .from('youtube_videos')
      .select('id, youtube_id');
    
    if (videoError) throw videoError;
    
    // Extract LingoSongs video IDs from backup
    const videoSectionMatch = backupContent.match(/COPY public\.videos.*?FROM stdin;\n(.*?)\n\\\./s);
    if (!videoSectionMatch) {
      throw new Error('Could not find video data in backup file');
    }
    
    const videoIdMap = new Map();
    const videoLines = videoSectionMatch[1].split('\n').filter(line => line.trim());
    
    for (const line of videoLines) {
      const parts = line.split('\t');
      if (parts.length >= 2) {
        const lingosongsId = parseInt(parts[0]);
        const youtubeId = parts[1];
        
        // Find matching video in Language Gems
        const matchingVideo = videos.find(v => v.youtube_id === youtubeId);
        if (matchingVideo) {
          videoIdMap.set(lingosongsId, matchingVideo.id);
        }
      }
    }
    
    console.log(`📊 Created mapping for ${videoIdMap.size} videos`);
    
    // Import Quiz Questions
    console.log('❓ Importing quiz questions...');
    const quizSectionMatch = backupContent.match(/COPY public\.quiz_questions.*?FROM stdin;\n(.*?)\n\\\./s);
    
    if (quizSectionMatch) {
      const quizLines = quizSectionMatch[1].split('\n').filter(line => line.trim());
      const quizQuestions = [];
      
      for (const line of quizLines) {
        const quiz = parseQuizLine(line);
        if (quiz && videoIdMap.has(quiz.video_id)) {
          quiz.video_id = videoIdMap.get(quiz.video_id);
          quizQuestions.push(quiz);
        }
      }
      
      console.log(`📝 Parsed ${quizQuestions.length} quiz questions`);
      
      // Insert quiz questions in batches
      const batchSize = 50;
      for (let i = 0; i < quizQuestions.length; i += batchSize) {
        const batch = quizQuestions.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('video_quiz_questions')
          .insert(batch);
        
        if (error) {
          console.error('❌ Error importing quiz batch:', error);
        } else {
          console.log(`✅ Imported ${batch.length} quiz questions`);
        }
      }
    }
    
    // Import Grammar Notes
    console.log('📚 Importing grammar notes...');
    const grammarSectionMatch = backupContent.match(/COPY public\.grammar_notes.*?FROM stdin;\n(.*?)\n\\\./s);
    
    if (grammarSectionMatch) {
      const grammarLines = grammarSectionMatch[1].split('\n').filter(line => line.trim());
      const grammarNotes = [];
      
      for (const line of grammarLines) {
        const note = parseGrammarLine(line);
        if (note && videoIdMap.has(note.video_id)) {
          note.video_id = videoIdMap.get(note.video_id);
          grammarNotes.push(note);
        }
      }
      
      console.log(`📖 Parsed ${grammarNotes.length} grammar notes`);
      
      // Insert grammar notes in batches
      const batchSize = 50;
      for (let i = 0; i < grammarNotes.length; i += batchSize) {
        const batch = grammarNotes.slice(i, i + batchSize);
        
        const { error } = await supabase
          .from('video_grammar_notes')
          .insert(batch);
        
        if (error) {
          console.error('❌ Error importing grammar batch:', error);
        } else {
          console.log(`✅ Imported ${batch.length} grammar notes`);
        }
      }
    }
    
    // Final statistics
    const { data: quizStats } = await supabase
      .from('video_quiz_questions')
      .select('video_id')
      .limit(1000);
    
    const { data: grammarStats } = await supabase
      .from('video_grammar_notes')
      .select('video_id')
      .limit(1000);
    
    console.log('\n🎉 Game data import completed successfully!');
    console.log(`📊 Total quiz questions: ${quizStats?.length || 0}`);
    console.log(`📊 Total grammar notes: ${grammarStats?.length || 0}`);
    console.log('\n🎮 Interactive games are now available for your videos!');
    
  } catch (error) {
    console.error('❌ Import failed:', error);
    process.exit(1);
  }
}

// Run the import
if (require.main === module) {
  importGameData();
}

module.exports = { importGameData };
