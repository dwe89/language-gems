# Mobile App Architecture - Full Native Rewrite

## Overview
Transform Language Gems into a true native mobile experience with offline-first architecture.

## Core Principles
1. **Offline-First**: All core functionality works without internet
2. **Guest-First**: No login barriers to play games
3. **Sync-Later**: Progress syncs to cloud when online + signed in
4. **Native Feel**: Touch-optimized, platform-aware UI

---

## Directory Structure

```
src/
├── app/
│   ├── mobile-home/          # ✅ Done - Native home screen
│   ├── mobile-profile/       # ✅ Done - Profile with guest support
│   ├── mobile-progress/      # ✅ Done - Progress with guest support
│   ├── mobile-games/         # ✅ Done - Native games hub
│   │   ├── page.tsx          # ✅ Done - Games list
│   │   ├── hangman/          # ✅ Done - Mobile hangman
│   │   ├── memory-match/     # ✅ Done - Mobile memory match
│   │   ├── word-towers/      # ✅ Done - Mobile word towers
│   │   └── vocab-blast/      # ✅ Done - Mobile vocab blast
│   └── mobile-settings/      # NEW - App settings
│
├── components/
│   └── capacitor/            # Mobile-specific components
│       ├── CapacitorProvider.tsx    # ✅ Done
│       ├── MobileAuthGate.tsx       # ✅ Done - Guest-first
│       ├── MobileTabBar.tsx         # ✅ Done - Works for guests
│       ├── MobilePageWrapper.tsx    # ✅ Done
│       └── games/                   # NEW - Mobile game components
│           ├── MobileGameLauncher.tsx
│           ├── MobileHangman.tsx
│           └── ...
│
├── lib/
│   └── mobile/               # NEW - Mobile-specific services
│       ├── VocabularyStore.ts       # ✅ Done - Load bundled vocab
│       ├── LocalProgressService.ts  # ✅ Done - Save progress locally
│       ├── SyncService.ts           # Pending - Sync to cloud
│       └── NetworkStatus.ts         # ✅ Done - Network status
│
└── data/
    └── vocabulary/           # NEW - Bundled vocabulary JSON
        ├── spanish/
        │   ├── foundation.json
        │   └── higher.json
        ├── french/
        └── german/
```

---

## Phase 1: Foundation (DONE)
- [x] MobileAuthGate - Guest-first flow
- [x] MobileTabBar - Works without auth
- [x] Mobile Home - Beautiful, game-focused
- [x] Mobile Profile - Guest-friendly
- [x] Mobile Progress - Guest-friendly
- [x] Fix remaining auth redirects (MobileAuthGate logic)
- [x] Bundle vocabulary JSON files (Scripts created & run)
- [x] Create VocabularyStore service

## Phase 2: Mobile Games Hub (DONE)
- [x] /mobile-games page - Touch-optimized games list
- [x] Mobile game launcher component (Integrated in hub)
- [x] Offline vocabulary loading

## Phase 3: Mobile-Optimized Games (DONE)

**Native Mobile Implementations** (Custom, touch-first):
- [x] Mobile Hangman - Web wrapper with bundled vocabulary
- [x] Mobile Word Towers - Native two-column matching game
- [x] Mobile Memory Match - Web wrapper with MemoryGameMain component
- [x] Mobile Vocab Blast - Native arcade bubble pop game
- [x] Mobile Sentence Towers - Native quiz-style tower builder
- [x] Mobile Verb Quest - Native RPG-style conjugation battles
- [x] Mobile Word Scramble - Web wrapper with WordScrambleFreePlayWrapper

**Web Component Wrappers** (Reusing existing game logic):
- [x] Mobile Speed Builder - Uses SpeedBuilderGameWrapper
- [x] Mobile Vocab Master - Uses UnifiedVocabMasterWrapper

All games support:
- Offline vocabulary (bundled JSON)
- Local progress saving via LocalProgressService
- Haptic feedback
- Guest users (no login required)

## Phase 4: Local Progress & Sync (IN PROGRESS)
- [x] LocalProgressService - Save to localStorage
- [x] NetworkStatus - Detect online/offline state
- [ ] SyncService - Background sync when online
- [ ] Conflict resolution

## Phase 5: Polish
- [ ] Push notifications
- [x] Haptic feedback throughout new games
- [ ] App Store / Play Store preparation

## Phase 6: Advanced Games (Offline Capable)
- [ ] **Sentence Sprint**: Build sentences against the clock.
    - *Source*: `src/components/games/SentenceGameExample.tsx` & `src/hooks/useSentenceGame.ts`
    - *Adaptation*: Create `useMobileSentenceGame` hook using local JSON data.
    - *Data Requirement*: Add `sentences.json` bundle containing sentence structures and translations.
- [ ] **Word Scramble**: Unscramble letters to form words.
    - *Source*: `src/app/activities/word-scramble/components/ImprovedWordScrambleGame.tsx`
    - *Adaptation*: Port component, replace `BufferedGameSessionService` with `LocalProgressService`.
    - *Data Requirement*: Uses existing `vocabulary.json`.
- [ ] **Conjugation Duel**: Battle mode for verb conjugations.
    - *Source*: `src/components/games/ConjugationDuelExample.tsx` & `src/hooks/useConjugationDuel.ts`
    - *Adaptation*: Create `useMobileConjugationDuel` hook.
    - *Data Requirement*: Create `verbs.json` bundle with conjugation tables (present, preterite, etc.).

## Phase 7: Vocab Master Mobile (Offline Capable)
- [ ] Port `VocabMasterGameEngine` to mobile.
- [ ] Adapt `EnhancedGameService` to use `LocalProgressService` when offline.
- [ ] Support offline modes:
    - Speed Round
    - Multiple Choice
    - Typing / Spelling
- [ ] Disable online-only modes (Listening/Dictation) when offline unless audio is cached.

## Phase 8: Rich Media & Online Features
- [ ] **LingoSongs Mobile**:
    - *Strategy*: Online-first for video playback.
    - *Offline Fallback*: Play vocabulary quizzes for cached songs without video.
- [ ] **Reading Comprehension**:
    - *Strategy*: Bundle reading texts in `reading.json`.
    - *Implementation*: Native reader view with tap-to-translate.
- [ ] **Dictation**:
    - *Strategy*: Requires high-quality audio. Download packs on demand?

---

## Bundled Vocabulary Format

```json
// public/data/vocabulary/spanish/foundation.json
{
  "language": "spanish",
  "tier": "foundation",
  "lastUpdated": "2024-01-17",
  "categories": [
    {
      "id": "family",
      "name": "Family",
      "subcategories": [
        {
          "id": "immediate-family",
          "name": "Immediate Family",
          "words": [
            { "word": "madre", "translation": "mother", "gender": "f" },
            { "word": "padre", "translation": "father", "gender": "m" }
          ]
        }
      ]
    }
  ]
}
```

---

## Local Progress Storage

```typescript
// Stored in localStorage/AsyncStorage
interface LocalProgress {
  odProgress: string; // Guest identifier (UUID)
  gamesPlayed: number;
  wordsLearned: string[]; // word IDs
  sessions: GameSession[];
  lastSync?: string; // ISO timestamp
  userId?: string; // If signed in
}
```

---

## Network-Aware Data Loading

The `VocabularyStore` handles loading data from the most appropriate source based on network availability and cache status.

```typescript
// src/lib/mobile/VocabularyStore.ts
export async function loadBundledVocabulary(
    language: SupportedLanguage,
    tier: 'foundation' | 'higher' | 'all' = 'all'
): Promise<VocabularyBundle | null> {
    const cacheKey = `${language}-${tier}`;

    // 1. Check in-memory cache first
    if (vocabularyCache.has(cacheKey)) {
        return vocabularyCache.get(cacheKey)!;
    }

    try {
        // 2. Load from bundled JSON file (always available offline)
        const response = await fetch(`/data/vocabulary/${language}/${tier}.json`);
        
        if (!response.ok) return null;

        const data: VocabularyBundle = await response.json();
        vocabularyCache.set(cacheKey, data);
        return data;
    } catch (error) {
        console.error(`[VocabularyStore] Failed to load bundled vocabulary:`, error);
        return null;
    }
}
```

---

## Sync Strategy (Planned)

### 1. Action Queue
When offline, user actions (completing a game, updating profile) are stored in a local queue instead of failing.

```typescript
interface QueuedAction {
  id: string;
  type: 'GAME_COMPLETE' | 'PROFILE_UPDATE' | 'SETTINGS_CHANGE';
  payload: any;
  timestamp: number;
  retryCount: number;
}
```

### 2. Background Sync
The `SyncService` listens to `NetworkStatus` changes. When connection is restored:

1.  **Detection**: `NetworkStatus` reports `isOnline: true`.
2.  **Auth Check**: Verify if user is logged in (Guest progress is kept local until login).
3.  **Process Queue**: Iterate through `QueuedAction` list.
4.  **Execute**: Send requests to Supabase API.
5.  **Cleanup**: Remove successful actions from queue.
6.  **Error Handling**: If an action fails (non-network error), move to a "dead letter" list or retry with backoff.

### 3. Conflict Resolution
- **Progress**: Merged. If local has 500 XP and remote has 600 XP, logic determines if they are additive (1100 XP) or if one supersedes. *Strategy: Additive for XP/Points, Union for "Words Learned".*
- **Settings**: Last write wins. The most recent timestamped change takes precedence.

---

## Building & Deployment

### Capacitor Commands

To sync web assets to native projects:
```bash
npm run build
npx cap sync
```

To open native IDEs:
```bash
npx cap open ios
npx cap open android
```

### iOS Specifics
- **Signing**: Requires Apple Developer Account.
- **Assets**: App icons and splash screens generated via `capacitor-assets`.
- **Permissions**: Check `Info.plist` for microphone (if used for pronunciation) or other permissions.

### Android Specifics
- **Gradle**: Ensure `minSdkVersion` is compatible (usually 22+).
- **Permissions**: Check `AndroidManifest.xml`.

---

## Testing Strategy

### 1. Mobile-Specific Tests
- **Touch Interaction**: Verify tap targets are at least 44x44pt.
- **Offline Mode**:
    1. Load app while online.
    2. Turn off WiFi/Data.
    3. Navigate to Games.
    4. Play a game.
    5. Verify progress saves locally.
- **Guest Mode**:
    1. Uninstall/Clear Data.
    2. Open app (do not log in).
    3. Play games.
    4. Force close and reopen.
    5. Verify progress persists.

### 2. Device Testing
- **Physical Devices**: Test on at least one iPhone and one Android device.
- **Responsiveness**: Verify layout on small screens (iPhone SE) and large screens (Pro Max / Tablets).
- **Notch/Safe Area**: Ensure UI doesn't clip behind the notch or dynamic island.
