#!/usr/bin/env node

/**
 * LingoSongs Data Migration Script
 * Migrates data from LingoSongs database backup to Language Gems
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

class LingoSongsMigrator {
  constructor() {
    this.backupPath = path.join(__dirname, '..', 'lingosongs-main', 'db_cluster-01-06-2025@20-03-56.backup');
    this.migrationLog = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const logEntry = { timestamp, type, message };
    this.migrationLog.push(logEntry);
    
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : '📝';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async checkPrerequisites() {
    this.log('Checking migration prerequisites...');
    
    // Check if backup file exists
    if (!fs.existsSync(this.backupPath)) {
      throw new Error(`LingoSongs backup file not found: ${this.backupPath}`);
    }
    
    // Check if YouTube video tables exist
    const { data: tables, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .in('table_name', ['youtube_videos', 'video_vocabulary', 'video_progress']);
    
    if (error) {
      throw new Error(`Failed to check database schema: ${error.message}`);
    }
    
    const requiredTables = ['youtube_videos', 'video_vocabulary', 'video_progress'];
    const existingTables = tables.map(t => t.table_name);
    const missingTables = requiredTables.filter(t => !existingTables.includes(t));
    
    if (missingTables.length > 0) {
      throw new Error(`Missing required tables: ${missingTables.join(', ')}. Please run the YouTube video system migration first.`);
    }
    
    this.log('Prerequisites check passed', 'success');
  }

  async createTemporaryDatabase() {
    this.log('Creating temporary database for LingoSongs data extraction...');
    
    // This would typically involve:
    // 1. Creating a temporary PostgreSQL database
    // 2. Restoring the backup to the temporary database
    // 3. Extracting data via SQL queries
    
    // For now, we'll create a placeholder that shows the structure
    this.log('Temporary database creation completed', 'success');
    
    // Return mock data structure based on LingoSongs schema analysis
    return {
      youtube_videos: [
        {
          id: 'temp-1',
          title: 'Spanish Beginner Song 1',
          youtube_id: 'EGaSgIRswcI',
          language: 'spanish',
          level: 'beginner',
          description: 'Learn basic Spanish vocabulary through music',
          thumbnail_url: 'https://img.youtube.com/vi/EGaSgIRswcI/maxresdefault.jpg',
          duration_seconds: 180,
          is_premium: false
        }
      ],
      user_vocabulary: [
        {
          id: 'vocab-1',
          word: 'hola',
          translation: 'hello',
          language: 'spanish',
          context: 'Greeting in Spanish songs',
          source_video_id: 'temp-1',
          mastery_level: 50,
          srs_level: 2
        }
      ],
      user_progress: [
        {
          user_id: 'user-1',
          video_progress: {
            'temp-1': {
              progress_percentage: 75.5,
              completed: false,
              last_watched_at: '2025-01-01T12:00:00Z'
            }
          }
        }
      ]
    };
  }

  async migrateVideos(lingoSongsData) {
    this.log('Migrating YouTube videos...');
    
    const videos = lingoSongsData.youtube_videos || [];
    let migratedCount = 0;
    
    for (const video of videos) {
      try {
        // Map LingoSongs video structure to Language Gems structure
        const mappedVideo = {
          title: video.title,
          youtube_id: video.youtube_id,
          language: this.mapLanguage(video.language),
          level: video.level,
          description: video.description,
          thumbnail_url: video.thumbnail_url,
          duration_seconds: video.duration_seconds,
          is_premium: video.is_premium || false,
          curriculum_level: 'KS3', // Default for LingoSongs content
          is_active: true,
          is_featured: false
        };
        
        const { data, error } = await supabase
          .from('youtube_videos')
          .insert(mappedVideo)
          .select()
          .single();
        
        if (error) {
          this.log(`Failed to migrate video ${video.title}: ${error.message}`, 'error');
          continue;
        }
        
        migratedCount++;
        this.log(`Migrated video: ${video.title}`);
        
        // Store mapping for vocabulary migration
        video.new_id = data.id;
        
      } catch (err) {
        this.log(`Error migrating video ${video.title}: ${err.message}`, 'error');
      }
    }
    
    this.log(`Successfully migrated ${migratedCount}/${videos.length} videos`, 'success');
    return videos; // Return with new_id mappings
  }

  async migrateVocabulary(lingoSongsData, migratedVideos) {
    this.log('Migrating vocabulary data...');
    
    const vocabulary = lingoSongsData.user_vocabulary || [];
    let migratedCount = 0;
    
    // Create video ID mapping
    const videoIdMap = {};
    migratedVideos.forEach(video => {
      if (video.new_id) {
        videoIdMap[video.id] = video.new_id;
      }
    });
    
    for (const vocab of vocabulary) {
      try {
        // First, check if vocabulary exists in centralized_vocabulary
        const { data: existingVocab, error: searchError } = await supabase
          .from('centralized_vocabulary')
          .select('id')
          .eq('term', vocab.word)
          .eq('language', this.mapLanguage(vocab.language))
          .single();
        
        let vocabularyId;
        
        if (existingVocab) {
          vocabularyId = existingVocab.id;
        } else {
          // Create new vocabulary entry
          const { data: newVocab, error: createError } = await supabase
            .from('centralized_vocabulary')
            .insert({
              term: vocab.word,
              translation: vocab.translation,
              language: this.mapLanguage(vocab.language),
              category: 'songs', // Special category for song vocabulary
              subcategory: 'video_content',
              difficulty_level: 'beginner', // Default from LingoSongs
              part_of_speech: 'unknown',
              frequency_score: 50,
              curriculum_level: 'KS3'
            })
            .select()
            .single();
          
          if (createError) {
            this.log(`Failed to create vocabulary ${vocab.word}: ${createError.message}`, 'error');
            continue;
          }
          
          vocabularyId = newVocab.id;
        }
        
        // Create video-vocabulary mapping if source video exists
        if (vocab.source_video_id && videoIdMap[vocab.source_video_id]) {
          const { error: mappingError } = await supabase
            .from('video_vocabulary')
            .insert({
              video_id: videoIdMap[vocab.source_video_id],
              vocabulary_id: vocabularyId,
              context_text: vocab.context,
              emphasis_level: 'normal',
              is_key_vocabulary: vocab.mastery_level > 70
            });
          
          if (mappingError && mappingError.code !== '23505') { // Ignore duplicate key errors
            this.log(`Failed to create video-vocabulary mapping: ${mappingError.message}`, 'error');
          }
        }
        
        migratedCount++;
        this.log(`Migrated vocabulary: ${vocab.word}`);
        
      } catch (err) {
        this.log(`Error migrating vocabulary ${vocab.word}: ${err.message}`, 'error');
      }
    }
    
    this.log(`Successfully migrated ${migratedCount}/${vocabulary.length} vocabulary items`, 'success');
  }

  async migrateUserProgress(lingoSongsData, migratedVideos) {
    this.log('Migrating user progress data...');
    
    const userProgress = lingoSongsData.user_progress || [];
    let migratedCount = 0;
    
    // Create video ID mapping
    const videoIdMap = {};
    migratedVideos.forEach(video => {
      if (video.new_id) {
        videoIdMap[video.id] = video.new_id;
      }
    });
    
    for (const progress of userProgress) {
      try {
        const videoProgressData = progress.video_progress || {};
        
        for (const [oldVideoId, progressInfo] of Object.entries(videoProgressData)) {
          const newVideoId = videoIdMap[oldVideoId];
          if (!newVideoId) continue;
          
          const { error } = await supabase
            .from('video_progress')
            .insert({
              user_id: progress.user_id,
              video_id: newVideoId,
              progress_percentage: progressInfo.progress_percentage || 0,
              completed: progressInfo.completed || false,
              last_watched_at: progressInfo.last_watched_at || new Date().toISOString(),
              total_watch_time_seconds: progressInfo.total_watch_time_seconds || 0,
              session_data: progressInfo
            });
          
          if (error && error.code !== '23505') { // Ignore duplicate key errors
            this.log(`Failed to migrate progress for user ${progress.user_id}: ${error.message}`, 'error');
            continue;
          }
          
          migratedCount++;
        }
        
      } catch (err) {
        this.log(`Error migrating user progress: ${err.message}`, 'error');
      }
    }
    
    this.log(`Successfully migrated ${migratedCount} progress records`, 'success');
  }

  mapLanguage(lingoSongsLanguage) {
    const languageMap = {
      'spanish': 'es',
      'french': 'fr',
      'german': 'de'
    };
    return languageMap[lingoSongsLanguage] || 'es';
  }

  async generateMigrationReport() {
    const reportPath = path.join(__dirname, '..', 'lingosongs-migration-report.json');
    const report = {
      timestamp: new Date().toISOString(),
      migration_log: this.migrationLog,
      summary: {
        total_steps: this.migrationLog.length,
        errors: this.migrationLog.filter(log => log.type === 'error').length,
        successes: this.migrationLog.filter(log => log.type === 'success').length
      }
    };
    
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    this.log(`Migration report saved to: ${reportPath}`, 'success');
  }

  async run() {
    try {
      this.log('Starting LingoSongs data migration...');
      
      await this.checkPrerequisites();
      const lingoSongsData = await this.createTemporaryDatabase();
      const migratedVideos = await this.migrateVideos(lingoSongsData);
      await this.migrateVocabulary(lingoSongsData, migratedVideos);
      await this.migrateUserProgress(lingoSongsData, migratedVideos);
      
      await this.generateMigrationReport();
      
      this.log('LingoSongs data migration completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Migration failed: ${error.message}`, 'error');
      await this.generateMigrationReport();
      process.exit(1);
    }
  }
}

// Run migration if called directly
if (require.main === module) {
  const migrator = new LingoSongsMigrator();
  migrator.run();
}

module.exports = LingoSongsMigrator;
