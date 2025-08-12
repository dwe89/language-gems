# Gems-First Reward System Implementation Guide

## Overview

This implementation transforms LanguageGems from an inconsistent XP-based system to a unified **Gems-first** reward system where:

- **1 Gem = 1 Correct Action** (transparent and fair)
- **Gem Rarity** determines XP value (10, 25, 50, 100, 200 XP)
- **Performance** determines rarity (speed + streak + mode bonuses)
- **Mastery Level** caps maximum rarity (prevents grinding)
- **SRS Integration** intelligently selects words to optimize learning

## Key Benefits

✅ **Brand Alignment**: "Language Gems" currency matches platform name  
✅ **Consistent Rewards**: Same logic across all 13+ games  
✅ **Anti-Grinding**: Mastery-based caps prevent XP farming  
✅ **Learning Optimization**: SRS-driven word selection  
✅ **Teacher Control**: Assignments override SRS for curriculum needs  
✅ **Assessment Integrity**: Separate reward logic for evaluations  

## Architecture Components

### 1. Database Schema (`20250810000000_gems_first_reward_system.sql`)
- Adds `gems_total`, `gems_by_rarity` to `enhanced_game_sessions`
- Creates `gem_events` audit table for detailed tracking
- Adds `max_gem_rarity` to `vocabulary_gem_collection` for anti-grinding
- Includes triggers to auto-update session totals from events

### 2. RewardEngine (`src/services/rewards/RewardEngine.ts`)
- **Unified gem rarity calculation** based on performance metrics
- **Game-specific configurations** (different speed thresholds per game)
- **Anti-grinding mechanics** (mastery level caps, hint penalties)
- **Mode bonuses** (typing +1 tier, dictation +1 tier)

### 3. Word Selection Service (`src/services/srs/UnifiedWordSelectionService.ts`)
- **SRS-driven selection** prioritizes due reviews and struggling words
- **Assignment mode** uses teacher-specified vocabulary
- **Assessment mode** uses balanced selection (no SRS bias)
- **Anti-grinding** prevents repeated easy word selection

### 4. Session Management (`src/services/rewards/EnhancedGameSessionService.ts`)
- **Real-time gem tracking** during gameplay
- **Automatic XP calculation** from gem rarity values
- **SRS integration** updates spaced repetition data
- **Bonus gem awards** for milestones and achievements

### 5. Analytics & Dashboards
- **GemsProgressCard** shows gem collection and rarity breakdown
- **GemsAnalyticsService** provides comprehensive gems metrics
- **Student/Teacher dashboards** display both gems and XP levels

## Implementation Phases

### Phase 1: Core Infrastructure ✅
- [x] Database migration
- [x] RewardEngine utility
- [x] Word selection service
- [x] Session management service

### Phase 2: Game Integration ✅
- [x] VocabMaster updated to use RewardEngine
- [x] GemsGameWrapper for easy integration
- [x] Global session service availability

### Phase 3: Analytics & UI ✅
- [x] Gems progress components
- [x] Analytics service
- [x] Dashboard integration points

### Phase 4: Testing ✅
- [x] RewardEngine unit tests
- [x] Session service integration tests
- [x] Word selection service tests

## Migration Strategy

### 1. Database Migration
```bash
# Apply the schema changes
supabase db push

# Run the migration
psql -d your_db -f supabase/migrations/20250810000000_gems_first_reward_system.sql
```

### 2. Backfill Existing Data
```sql
-- Estimate gems for existing sessions (conservative approach)
UPDATE enhanced_game_sessions 
SET 
  gems_total = COALESCE(words_correct, 0),
  gems_by_rarity = jsonb_build_object(
    'common', COALESCE(words_correct, 0),
    'uncommon', 0, 'rare', 0, 'epic', 0, 'legendary', 0
  )
WHERE gems_total IS NULL;

-- Update max_gem_rarity based on current mastery levels
UPDATE vocabulary_gem_collection 
SET max_gem_rarity = 
  CASE 
    WHEN mastery_level <= 1 THEN 'rare'
    WHEN mastery_level <= 3 THEN 'epic'
    ELSE 'legendary'
  END
WHERE max_gem_rarity IS NULL;
```

### 3. Game Integration Rollout

**Immediate (Pilot Games):**
- VocabMaster ✅
- Vocabulary Mining (update similar to VocabMaster)

**Phase 2 (Core Games):**
- Memory Game
- Word/Sentence Towers  
- Lava Temple Word Restore

**Phase 3 (Remaining Games):**
- Pirate Ship games
- Case File Translator
- TicTacToe
- Word Blast
- Verb Quest

### 4. Dashboard Updates
- Replace XP-only displays with Gems + XP
- Add gem rarity breakdowns
- Update teacher analytics

## Game Integration Pattern

For each game, follow this pattern:

```typescript
// 1. Import new services
import { RewardEngine } from '../../../services/rewards/RewardEngine';
import { GemsGameWrapper } from '../../../components/games/GemsGameWrapper';

// 2. Wrap game component
<GemsGameWrapper 
  gameType="your-game-type"
  sessionMode="free_play"
  language="spanish"
  onSessionStart={(sessionId) => setSessionId(sessionId)}
>
  {({ selectedWords, sessionId }) => (
    <YourGameComponent 
      words={selectedWords}
      sessionId={sessionId}
    />
  )}
</GemsGameWrapper>

// 3. Award gems on correct answers
const handleCorrectAnswer = async (word, responseTime, hintUsed) => {
  if (window.gameSessionService && window.currentSessionId) {
    await window.gameSessionService.recordWordAttempt(
      window.currentSessionId,
      'your-game-type',
      {
        vocabularyId: word.id,
        wordText: word.word,
        translationText: word.translation,
        responseTimeMs: responseTime,
        wasCorrect: true,
        hintUsed,
        streakCount: currentStreak,
        masteryLevel: word.masteryLevel,
        maxGemRarity: word.maxGemRarity,
        gameMode: currentMode
      }
    );
  }
};

// 4. End session with final stats
const endGame = async () => {
  if (window.endGameSession) {
    await window.endGameSession({
      final_score: score,
      accuracy_percentage: accuracy,
      completion_percentage: 100,
      words_attempted: totalAttempts,
      words_correct: correctAnswers,
      unique_words_practiced: uniqueWords,
      duration_seconds: gameDuration
    });
  }
};
```

## Testing Strategy

### Unit Tests
- RewardEngine gem rarity calculations
- Anti-grinding mechanics
- Game-specific configurations

### Integration Tests  
- Session management flow
- Database triggers and updates
- SRS integration

### End-to-End Tests
- Complete game sessions
- Dashboard data accuracy
- Assignment vs free-play differences

## Monitoring & Validation

### Key Metrics to Track
- **Gem Distribution**: Ensure healthy rarity spread
- **XP Consistency**: Verify XP matches gem values
- **Learning Effectiveness**: Monitor SRS-driven improvements
- **Engagement**: Compare session lengths and return rates

### Validation Queries
```sql
-- Verify gem totals match XP
SELECT 
  session_id,
  gems_total,
  xp_earned,
  (SELECT SUM(xp_value) FROM gem_events WHERE session_id = s.id) as calculated_xp
FROM enhanced_game_sessions s
WHERE gems_total > 0 AND xp_earned != calculated_xp;

-- Check gem rarity distribution
SELECT 
  gem_rarity,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM gem_events 
GROUP BY gem_rarity
ORDER BY count DESC;

-- Monitor anti-grinding effectiveness
SELECT 
  v.mastery_level,
  AVG(CASE ge.gem_rarity 
    WHEN 'common' THEN 1
    WHEN 'uncommon' THEN 2  
    WHEN 'rare' THEN 3
    WHEN 'epic' THEN 4
    WHEN 'legendary' THEN 5
  END) as avg_rarity_score
FROM gem_events ge
JOIN vocabulary_gem_collection v ON ge.vocabulary_id = v.vocabulary_item_id
GROUP BY v.mastery_level
ORDER BY v.mastery_level;
```

## Rollback Plan

If issues arise, the system can be rolled back:

1. **Disable new gem logic** in games (use legacy XP calculations)
2. **Revert to old word selection** (remove SRS prioritization)  
3. **Hide gem displays** in dashboards (show XP only)
4. **Database rollback** (drop new columns, restore from backup)

The migration is designed to be **additive** - existing XP data remains intact.

## Success Criteria

- ✅ All games use consistent gem reward logic
- ✅ Student engagement metrics improve or maintain
- ✅ Teacher feedback is positive on assignment control
- ✅ No significant performance degradation
- ✅ Analytics show healthy learning progression
- ✅ Anti-grinding mechanics prevent XP farming

## Next Steps

1. **Deploy Phase 1** (database + core services)
2. **Update remaining games** following the integration pattern
3. **Launch teacher training** on new assignment features  
4. **Monitor metrics** and gather feedback
5. **Iterate based on data** and user feedback

This implementation provides a solid foundation for scalable, fair, and educationally effective gamification that aligns with the LanguageGems brand while preventing common pitfalls of reward systems.
