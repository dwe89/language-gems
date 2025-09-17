# LingoSongs → Language Gems Migration Plan

## 🎯 Overview

This document outlines the comprehensive strategy for migrating LingoSongs content and functionality into the Language Gems platform, leveraging the existing robust architecture while adding song-based learning capabilities.

## 📊 Current Language Gems Architecture Analysis

### Strengths to Leverage:
- **Centralized Vocabulary System**: `centralized_vocabulary` table with UUID-based tracking
- **Gems-First Reward System**: Unified XP/gems tracking across all games
- **Enhanced Game Framework**: Modular game system with consistent APIs
- **Supabase Storage Integration**: Cloud-based audio/media storage
- **Assignment System**: Teacher-student workflow with progress tracking
- **Multi-language Support**: Spanish, French, German with extensible architecture
- **Analytics Dashboard**: Real-time progress tracking and reporting

### Integration Points:
1. **Vocabulary Integration**: Extend `centralized_vocabulary` with song-specific metadata
2. **Game System**: Add song-based games to existing game framework
3. **Audio System**: Migrate audio content to existing Supabase Storage
4. **User System**: Merge user accounts and progress data
5. **Assignment System**: Enable teachers to assign song-based activities

## 🗄️ Database Schema Extensions

### 1. Song Content Tables

```sql
-- Songs table for storing song metadata
CREATE TABLE songs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    artist TEXT,
    language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    difficulty_level TEXT NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    genre TEXT,
    theme TEXT, -- Links to existing vocabulary themes
    topic TEXT, -- Links to existing vocabulary topics
    duration_seconds INTEGER,
    audio_url TEXT, -- Supabase Storage URL
    lyrics TEXT,
    lyrics_translation TEXT,
    curriculum_level TEXT DEFAULT 'KS3' CHECK (curriculum_level IN ('KS3', 'KS4')),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Song vocabulary mapping
CREATE TABLE song_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES centralized_vocabulary(id) ON DELETE CASCADE,
    appears_at_timestamp INTEGER, -- Timestamp in song where word appears
    context_line TEXT, -- The lyric line containing the word
    emphasis_level TEXT DEFAULT 'normal' CHECK (emphasis_level IN ('low', 'normal', 'high')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(song_id, vocabulary_id)
);

-- Song-based game sessions
CREATE TABLE song_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    song_id UUID NOT NULL REFERENCES songs(id) ON DELETE CASCADE,
    game_type TEXT NOT NULL, -- 'lyric_completion', 'vocabulary_match', 'rhythm_vocab', etc.
    assignment_id UUID REFERENCES assignments(id) ON DELETE SET NULL,
    
    -- Performance metrics
    score INTEGER DEFAULT 0,
    max_score INTEGER DEFAULT 100,
    accuracy_percentage DECIMAL(5,2) DEFAULT 0.00,
    completion_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_seconds INTEGER DEFAULT 0,
    
    -- Gems integration
    gems_earned INTEGER DEFAULT 0,
    gems_by_rarity JSONB DEFAULT '{"common": 0, "uncommon": 0, "rare": 0, "epic": 0, "legendary": 0}',
    
    -- Session data
    session_data JSONB DEFAULT '{}',
    started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2. Song-Based Games Configuration

```sql
-- Song game types and their configurations
CREATE TABLE song_game_types (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_type TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    min_vocabulary_items INTEGER DEFAULT 5,
    max_vocabulary_items INTEGER DEFAULT 20,
    supports_audio BOOLEAN DEFAULT true,
    supports_lyrics BOOLEAN DEFAULT true,
    difficulty_levels TEXT[] DEFAULT ARRAY['beginner', 'intermediate', 'advanced'],
    game_config JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default song game types
INSERT INTO song_game_types (game_type, display_name, description, min_vocabulary_items, max_vocabulary_items) VALUES
('lyric_completion', 'Lyric Completion', 'Fill in missing words from song lyrics', 5, 15),
('vocabulary_match', 'Song Vocabulary Match', 'Match vocabulary words with their meanings from songs', 8, 20),
('rhythm_vocab', 'Rhythm Vocabulary', 'Learn vocabulary to the rhythm of songs', 6, 12),
('song_translation', 'Song Translation', 'Translate song lyrics and vocabulary', 5, 10),
('karaoke_vocab', 'Vocabulary Karaoke', 'Sing along while learning vocabulary', 8, 16);
```

## 🔄 Migration Process

### Phase 1: Data Analysis and Preparation (Day 1-2)
1. **LingoSongs Database Analysis**
   - Extract schema structure
   - Identify data relationships
   - Map to Language Gems equivalents

2. **Content Audit**
   - Catalog songs and audio files
   - Analyze vocabulary coverage
   - Identify unique content vs. overlaps

### Phase 2: Database Schema Extension (Day 2-3)
1. **Apply Schema Changes**
   - Create song-related tables
   - Add indexes and constraints
   - Set up RLS policies

2. **Data Migration Scripts**
   - User account migration
   - Song content migration
   - Vocabulary mapping

### Phase 3: Content Migration (Day 3-5)
1. **Audio Migration**
   - Upload songs to Supabase Storage
   - Update URLs in database
   - Verify audio quality and accessibility

2. **Vocabulary Integration**
   - Map LingoSongs vocabulary to `centralized_vocabulary`
   - Handle duplicates and conflicts
   - Preserve learning progress

### Phase 4: Game Integration (Day 5-7)
1. **Song Game Components**
   - Create React components for song-based games
   - Integrate with existing game framework
   - Add to unified game launcher

2. **Assignment System Integration**
   - Enable teachers to assign song-based activities
   - Add song games to assignment creator
   - Update progress tracking

## 🎮 Song-Based Games to Implement

### 1. Lyric Completion Game
- Students fill in missing vocabulary words from song lyrics
- Audio plays with gaps for target vocabulary
- Integrates with gems reward system

### 2. Vocabulary Match Game
- Match vocabulary from songs with translations
- Uses song context for better learning
- Adaptive difficulty based on student progress

### 3. Rhythm Vocabulary Game
- Learn vocabulary pronunciation with song rhythm
- Audio-visual feedback for correct pronunciation
- Gamified with beat-matching mechanics

### 4. Song Translation Challenge
- Translate song lyrics line by line
- Focus on vocabulary and grammar patterns
- Progressive difficulty with longer passages

## 📱 User Experience Integration

### Teacher Dashboard Enhancements
- **Song Library Management**: Browse and assign songs
- **Vocabulary Mapping**: See which vocabulary words are covered by each song
- **Progress Analytics**: Track student engagement with song-based learning

### Student Experience
- **Song Discovery**: Browse songs by difficulty, theme, or topic
- **Learning Modes**: Choose between different song-based activities
- **Progress Tracking**: See vocabulary mastered through songs

## 🔧 Technical Implementation

### API Endpoints
```typescript
// Song management
GET /api/songs - List available songs
GET /api/songs/[id] - Get song details
GET /api/songs/[id]/vocabulary - Get vocabulary for a song

// Song games
POST /api/games/song/[gameType] - Start song-based game session
PUT /api/games/song/sessions/[id] - Update game session
GET /api/games/song/sessions/[id]/results - Get session results
```

### Component Structure
```
src/components/songs/
├── SongLibrary.tsx          # Browse available songs
├── SongPlayer.tsx           # Audio player with lyrics
├── games/
│   ├── LyricCompletion.tsx  # Fill-in-the-blanks game
│   ├── VocabularyMatch.tsx  # Matching game
│   ├── RhythmVocab.tsx      # Rhythm-based learning
│   └── SongTranslation.tsx  # Translation challenges
└── SongAssignment.tsx       # Teacher assignment interface
```

## 📊 Success Metrics

### Engagement Metrics
- Song completion rates
- Time spent on song-based activities
- Vocabulary retention from songs vs. traditional methods

### Learning Outcomes
- Vocabulary acquisition speed
- Pronunciation improvement
- Cultural context understanding

### Platform Integration
- Teacher adoption of song-based assignments
- Student preference for song vs. traditional games
- Overall platform engagement increase

## 🚀 Next Steps

1. **Locate LingoSongs Files**: Identify and access LingoSongs database backup and source files
2. **Schema Implementation**: Apply database schema extensions
3. **Migration Scripts**: Create automated migration tools
4. **Component Development**: Build song-based game components
5. **Testing**: Comprehensive testing of migrated content
6. **Deployment**: Gradual rollout with teacher feedback

This migration will transform Language Gems into a comprehensive language learning platform that combines the best of traditional vocabulary learning with engaging, music-based education.
