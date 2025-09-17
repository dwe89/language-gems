# LingoSongs → Language Gems Focused Migration

## 🎯 LingoSongs Analysis Summary

**Core Functionality**: YouTube-based language learning with vocabulary tracking and spaced repetition
**Key Features to Migrate**:
- YouTube video integration with vocabulary overlay
- Spaced repetition system (SRS) for vocabulary
- Video progress tracking
- Vocabulary flashcards
- Quiz system based on video content

**Database Tables** (from migrations):
- `user_stats` - User learning statistics
- `user_progress` - Video progress and achievements  
- `user_vocabulary` - Vocabulary items with SRS data
- `youtube_videos` - Video metadata and content

## 🗂️ Files to Keep vs Delete

### ✅ KEEP - Core Learning Components
```
lingosongs-main/
├── src/components/
│   ├── VideoPlayer.tsx              # YouTube player with progress tracking
│   ├── VideoLyricsOverlay.tsx       # Vocabulary overlay on videos
│   ├── VideoQuizOverlay.tsx         # Quiz functionality
│   ├── YoutubeVideoQuiz.tsx         # Quiz component
│   └── vocabulary/
│       ├── VocabularyTracker.tsx    # SRS vocabulary system
│       ├── Flashcards.tsx           # Flashcard component
│       ├── VocabularyBuilder.tsx    # Add vocabulary functionality
│       └── VocabularyWordButton.tsx # Interactive word buttons
├── src/hooks/
│   ├── useVocabulary.ts             # Vocabulary management with SRS
│   └── useProgress.ts               # Progress tracking
├── src/app/
│   ├── video/[id]/page.tsx          # Video player page
│   ├── youtube-quiz/[id]/page.tsx   # Quiz page
│   ├── youtube-videos/page.tsx      # Video library
│   ├── vocabulary/page.tsx          # Vocabulary management
│   └── flashcards/page.tsx          # Flashcard practice
├── supabase/migrations/             # Database schema
└── db_cluster-01-06-2025@20-03-56.backup # Database backup
```

### ❌ DELETE - Redundant with Language Gems
```
lingosongs-main/
├── src/app/
│   ├── about/                       # Have in Language Gems
│   ├── blog/                        # Have in Language Gems  
│   ├── contact/                     # Have in Language Gems
│   ├── login/                       # Have in Language Gems
│   ├── premium/                     # Have in Language Gems
│   ├── profile/                     # Have in Language Gems
│   ├── settings/                    # Have in Language Gems
│   ├── auth/                        # Have in Language Gems
│   ├── payment-success/             # Have in Language Gems
│   ├── page.tsx                     # Homepage - use Language Gems
│   ├── layout.tsx                   # Use Language Gems layout
│   └── api/                         # Most APIs redundant
├── src/components/
│   ├── Navigation.tsx               # Use Language Gems navigation
│   ├── Footer.tsx                   # Use Language Gems footer
│   ├── auth/                        # Use Language Gems auth
│   └── premium/                     # Use Language Gems premium
└── public/                          # Use Language Gems assets
```

## 🔄 Migration Strategy

### Phase 1: Cleanup LingoSongs (Current)
1. Remove redundant pages and components
2. Keep only video/vocabulary learning core
3. Preserve database backup

### Phase 2: Database Integration
1. Create YouTube video tables in Language Gems
2. Extend vocabulary system for video context
3. Migrate user data from backup

### Phase 3: Component Integration
1. Move video components to Language Gems
2. Integrate with existing game framework
3. Add to unified navigation

### Phase 4: Feature Enhancement
1. Add YouTube videos to assignment system
2. Integrate with gems reward system
3. Add to teacher dashboard

## 🎮 Integration with Language Gems

### Video-Based Games to Add:
1. **Video Vocabulary Match** - Match words from video context
2. **Lyric Completion** - Fill in missing words from video lyrics
3. **Video Quiz** - Comprehension questions based on video content
4. **Flashcard Review** - SRS-based vocabulary review from videos

### Database Schema Extensions:
```sql
-- YouTube videos table
CREATE TABLE youtube_videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    youtube_id TEXT UNIQUE NOT NULL,
    language TEXT NOT NULL CHECK (language IN ('es', 'fr', 'de')),
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    description TEXT,
    thumbnail_url TEXT,
    duration_seconds INTEGER,
    is_premium BOOLEAN DEFAULT false,
    vocabulary_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Video vocabulary mapping
CREATE TABLE video_vocabulary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    vocabulary_id UUID NOT NULL REFERENCES centralized_vocabulary(id) ON DELETE CASCADE,
    timestamp_seconds INTEGER, -- When word appears in video
    context_text TEXT, -- Surrounding text/lyrics
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(video_id, vocabulary_id)
);

-- Video progress tracking
CREATE TABLE video_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    video_id UUID NOT NULL REFERENCES youtube_videos(id) ON DELETE CASCADE,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    completed BOOLEAN DEFAULT false,
    last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    total_watch_time_seconds INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, video_id)
);
```

## 🎯 Next Steps

1. **Clean up LingoSongs folder** - Remove redundant files
2. **Create migration scripts** - Database and content migration
3. **Integrate components** - Move video components to Language Gems
4. **Test integration** - Ensure everything works together
5. **Deploy** - Gradual rollout with teacher feedback

This focused approach will give Language Gems powerful video-based learning capabilities while maintaining the existing robust architecture.
