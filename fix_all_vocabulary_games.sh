#!/bin/bash

# Script to fix all vocabulary games to use unified architecture
# Removes legacy systems and implements EnhancedGameSessionService pattern

echo "🔧 Starting vocabulary tracking system consolidation..."

# List of games to fix
GAMES=(
  "src/app/games/vocab-blast/components/VocabBlastGame.tsx"
  "src/app/games/conjugation-duel/components/BattleArena.tsx"
  "src/app/games/vocabulary-mining/components/VocabularyMiningGame.tsx"
  "src/app/games/word-blast/components/WordBlastGame.tsx"
  "src/app/games/sentence-towers/components/SentenceTowersMainGame.tsx"
  "src/app/games/verb-quest/components/Battle.tsx"
  "src/app/games/lava-temple-word-restore/components/TempleRestoration.tsx"
  "src/app/games/case-file-translator/components/TranslatorRoom.tsx"
  "src/app/games/memory-game/components/MemoryGameMain.tsx"
  "src/app/games/speed-builder/components/GemSpeedBuilder.tsx"
  "src/app/games/speed-builder/components/EnhancedSpeedBuilder.tsx"
)

# Remove legacy imports from all games
echo "📝 Removing legacy imports..."
for game in "${GAMES[@]}"; do
  if [ -f "$game" ]; then
    echo "  Processing: $game"
    
    # Remove useUnifiedSpacedRepetition import
    sed -i '' '/import.*useUnifiedSpacedRepetition/d' "$game"
    
    # Remove recordWordPractice usage (comment out for now)
    sed -i '' 's/const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition/\/\/ REMOVED: const { recordWordPractice, algorithm } = useUnifiedSpacedRepetition/g' "$game"
    
    # Add EnhancedGameSessionService import if not present
    if ! grep -q "EnhancedGameSessionService" "$game"; then
      # Find the last import line and add after it
      sed -i '' '/^import.*from.*$/a\
import { EnhancedGameSessionService } from '\''../../../../services/rewards/EnhancedGameSessionService'\'';
' "$game"
    fi
    
    echo "    ✅ Updated imports in $game"
  else
    echo "    ⚠️  File not found: $game"
  fi
done

echo ""
echo "🎯 MANUAL STEPS REQUIRED:"
echo "1. Replace all recordWordPractice() calls with:"
echo "   const sessionService = new EnhancedGameSessionService();"
echo "   await sessionService.recordWordAttempt(gameSessionId, 'game-name', {...});"
echo ""
echo "2. Ensure all games receive gameSessionId prop"
echo "3. Remove any remaining FSRS service calls"
echo "4. Test each game to verify vocabulary tracking works"
echo ""
echo "✅ Automated fixes complete. Manual fixes required for full consolidation."
