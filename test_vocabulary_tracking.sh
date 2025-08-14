#!/bin/bash

# Script to test vocabulary tracking across all games
# Checks for common errors and validates the unified architecture

echo "🧪 Testing vocabulary tracking system across all games..."

# Function to check a game file for potential issues
check_game_file() {
    local file="$1"
    local game_name=$(basename $(dirname "$file"))
    local issues=0
    
    echo "  🎮 Testing: $game_name"
    
    # Check for remaining legacy systems
    if grep -q "useUnifiedSpacedRepetition" "$file"; then
        echo "    ❌ Still imports useUnifiedSpacedRepetition"
        issues=$((issues + 1))
    fi
    
    if grep -q "recordWordPractice(" "$file"; then
        echo "    ❌ Still has recordWordPractice calls"
        issues=$((issues + 1))
    fi
    
    # Check for undefined variable references
    if grep -q "gameStats\." "$file"; then
        echo "    ❌ Still references gameStats object"
        issues=$((issues + 1))
    fi
    
    if grep -q "userAnswer" "$file" && ! grep -q "const userAnswer\|let userAnswer\|var userAnswer" "$file"; then
        echo "    ❌ References undefined userAnswer"
        issues=$((issues + 1))
    fi
    
    # Check for proper unified architecture
    if grep -q "EnhancedGameSessionService" "$file"; then
        if grep -q "recordWordAttempt" "$file"; then
            echo "    ✅ Uses unified EnhancedGameSessionService.recordWordAttempt"
        else
            echo "    ⚠️  Imports EnhancedGameSessionService but doesn't use recordWordAttempt"
            issues=$((issues + 1))
        fi
        
        if ! grep -q "gameSessionId" "$file"; then
            echo "    ❌ Uses EnhancedGameSessionService but missing gameSessionId"
            issues=$((issues + 1))
        fi
    fi
    
    if [ $issues -eq 0 ]; then
        echo "    ✅ No issues found"
    else
        echo "    ⚠️  Found $issues potential issues"
    fi
    
    return $issues
}

# Test key vocabulary games
CRITICAL_GAMES=(
    "src/app/games/noughts-and-crosses/components/TicTacToeGameThemed.tsx"
    "src/app/games/detective-listening/components/DetectiveRoom.tsx"
    "src/app/games/vocab-master/components/VocabMasterGameEngine.tsx"
    "src/app/games/word-scramble/components/ImprovedWordScrambleGame.tsx"
    "src/app/games/hangman/components/HangmanGame.tsx"
)

echo "🎯 Testing critical vocabulary games..."
total_issues=0

for game in "${CRITICAL_GAMES[@]}"; do
    if [ -f "$game" ]; then
        check_game_file "$game"
        total_issues=$((total_issues + $?))
    else
        echo "  ❌ File not found: $game"
        total_issues=$((total_issues + 1))
    fi
done

echo ""
echo "📊 SUMMARY:"
if [ $total_issues -eq 0 ]; then
    echo "✅ All critical games passed vocabulary tracking tests!"
    echo "🎉 Unified architecture successfully implemented"
else
    echo "⚠️  Found $total_issues total issues across games"
    echo "🔧 Manual fixes needed for remaining issues"
fi

echo ""
echo "🧪 MANUAL TESTING CHECKLIST:"
echo "For each game, verify:"
echo "1. ✅ Game loads without console errors"
echo "2. ✅ Vocabulary questions appear correctly"
echo "3. ✅ Correct answers are recorded as correct in database"
echo "4. ✅ Incorrect answers are recorded as incorrect in database"
echo "5. ✅ Gems are awarded for correct answers only"
echo "6. ✅ No duplicate database records per answer"
echo ""
echo "🔍 DATABASE VERIFICATION:"
echo "Run this query to check recent vocabulary attempts:"
echo "SELECT cv.word, vgc.total_encounters, vgc.correct_encounters, vgc.incorrect_encounters"
echo "FROM vocabulary_gem_collection vgc"
echo "JOIN centralized_vocabulary cv ON vgc.centralized_vocabulary_id = cv.id"
echo "WHERE vgc.updated_at > NOW() - INTERVAL '1 hour'"
echo "ORDER BY vgc.updated_at DESC;"
echo ""
echo "✅ Testing complete!"
