#!/bin/bash

# Comprehensive script to fix ALL legacy vocabulary tracking references
# Fixes incorrect variable references and removes ALL legacy systems

echo "🔧 Comprehensive fix for ALL legacy vocabulary tracking references..."

# Function to intelligently fix variable references
fix_game_variables() {
    local file="$1"
    local game_name=$(basename $(dirname "$file"))
    echo "  🎮 Fixing: $game_name"
    
    # Check if file has gameStats state variable defined
    if grep -q "useState.*gameStats\|const \[gameStats" "$file"; then
        echo "    ✅ Has gameStats state - reverting incorrect fixes"
        
        # Revert incorrect gameStats.score -> score changes
        sed -i '' 's/\bscore\b\([^A-Za-z0-9_]\)/gameStats.score\1/g' "$file"
        sed -i '' 's/Score: {score}/Score: {gameStats.score}/g' "$file"
        sed -i '' 's/if (score </if (gameStats.score </g' "$file"
        
        # Revert incorrect gameStats.streak -> streak changes  
        sed -i '' 's/\bstreak\b\([^A-Za-z0-9_]\)/gameStats.streak\1/g' "$file"
        sed -i '' 's/Streak: {streak}/Streak: {gameStats.streak}/g' "$file"
        
        echo "    ✅ Reverted incorrect gameStats fixes"
    else
        echo "    ℹ️  No gameStats state found - keeping simple variables"
    fi
    
    # Remove ALL legacy FSRS imports and calls
    if grep -q "useUnifiedSpacedRepetition" "$file"; then
        echo "    ❌ Removing useUnifiedSpacedRepetition import"
        sed -i '' '/import.*useUnifiedSpacedRepetition/d' "$file"
    fi
    
    if grep -q "recordWordPractice" "$file"; then
        echo "    ❌ Found recordWordPractice calls - needs manual replacement"
        # Comment out recordWordPractice calls for safety
        sed -i '' 's/recordWordPractice(/\/\/ LEGACY: recordWordPractice(/g' "$file"
        sed -i '' 's/await recordWordPractice(/\/\/ LEGACY: await recordWordPractice(/g' "$file"
    fi
    
    # Remove legacy hook initializations
    if grep -q "const { recordWordPractice" "$file"; then
        echo "    ❌ Removing legacy hook initialization"
        sed -i '' '/const { recordWordPractice.*useUnifiedSpacedRepetition/d' "$file"
    fi
    
    # Add EnhancedGameSessionService import if missing and needed
    if grep -q "recordWordAttempt\|EnhancedGameSessionService" "$file" && ! grep -q "import.*EnhancedGameSessionService" "$file"; then
        echo "    ✅ Adding EnhancedGameSessionService import"
        # Add import after the last existing import
        sed -i '' '/^import.*from.*$/a\
import { EnhancedGameSessionService } from '\''../../../../services/rewards/EnhancedGameSessionService'\'';
' "$file"
    fi
}

# Function to completely remove legacy files
remove_legacy_files() {
    echo "🗑️  Removing ALL legacy files..."
    
    # Remove any remaining legacy service files
    find src -name "*spacedRepetition*" -type f -delete 2>/dev/null || true
    find src -name "*SpacedRepetition*" -type f -delete 2>/dev/null || true
    find src -name "*useUnifiedSpacedRepetition*" -type f -delete 2>/dev/null || true
    
    echo "    ✅ Legacy files removed"
}

# Fix all vocabulary games
echo "📁 Processing all vocabulary games..."

# Critical games that need fixing
GAMES=(
    "src/app/games/vocab-blast/components/VocabBlastGame.tsx"
    "src/app/games/word-blast/components/WordBlastGame.tsx"
    "src/app/games/word-scramble/components/ImprovedWordScrambleGame.tsx"
    "src/app/games/hangman/components/HangmanGame.tsx"
    "src/app/games/vocab-master/components/VocabMasterGameEngine.tsx"
    "src/app/games/noughts-and-crosses/components/TicTacToeGameThemed.tsx"
    "src/app/games/detective-listening/components/DetectiveRoom.tsx"
    "src/app/games/conjugation-duel/components/BattleArena.tsx"
    "src/app/games/vocabulary-mining/components/VocabularyMiningGame.tsx"
    "src/app/games/sentence-towers/components/SentenceTowersMainGame.tsx"
    "src/app/games/verb-quest/components/Battle.tsx"
    "src/app/games/lava-temple-word-restore/components/TempleRestoration.tsx"
    "src/app/games/case-file-translator/components/TranslatorRoom.tsx"
    "src/app/games/memory-game/components/MemoryGameMain.tsx"
    "src/app/games/speed-builder/components/GemSpeedBuilder.tsx"
    "src/app/games/speed-builder/components/EnhancedSpeedBuilder.tsx"
)

for game in "${GAMES[@]}"; do
    if [ -f "$game" ]; then
        fix_game_variables "$game"
    else
        echo "  ⚠️  File not found: $game"
    fi
done

# Remove legacy files
remove_legacy_files

echo ""
echo "🎯 COMPREHENSIVE FIXES APPLIED:"
echo "✅ Fixed incorrect gameStats variable references"
echo "✅ Reverted gameStats.score -> score where gameStats exists"
echo "✅ Commented out legacy recordWordPractice calls"
echo "✅ Removed useUnifiedSpacedRepetition imports"
echo "✅ Added EnhancedGameSessionService imports where needed"
echo "✅ Removed all legacy files"
echo ""
echo "⚠️  MANUAL STEPS STILL NEEDED:"
echo "1. Replace commented recordWordPractice calls with EnhancedGameSessionService.recordWordAttempt"
echo "2. Ensure all games have gameSessionId parameter"
echo "3. Test each game for console errors"
echo ""
echo "✅ Comprehensive legacy cleanup complete!"
