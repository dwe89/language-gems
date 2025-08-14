#!/bin/bash

# Script to fix common vocabulary tracking errors across all games
# Fixes undefined variable references and ensures unified architecture

echo "🔧 Fixing vocabulary tracking errors across all games..."

# Find all games with potential issues
GAMES_DIR="src/app/games"

# Function to fix common variable reference errors
fix_variable_references() {
    local file="$1"
    echo "  🔍 Checking: $file"
    
    # Fix gameStats.correctAnswers -> correctAnswers
    if grep -q "gameStats\.correctAnswers" "$file"; then
        echo "    ❌ Found gameStats.correctAnswers - fixing..."
        sed -i '' 's/gameStats\.correctAnswers/correctAnswers/g' "$file"
        echo "    ✅ Fixed gameStats.correctAnswers"
    fi
    
    # Fix gameStats.streak -> streak or appropriate variable
    if grep -q "gameStats\.streak" "$file"; then
        echo "    ❌ Found gameStats.streak - fixing..."
        sed -i '' 's/gameStats\.streak/streak/g' "$file"
        echo "    ✅ Fixed gameStats.streak"
    fi
    
    # Fix gameStats.score -> score
    if grep -q "gameStats\.score" "$file"; then
        echo "    ❌ Found gameStats.score - fixing..."
        sed -i '' 's/gameStats\.score/score/g' "$file"
        echo "    ✅ Fixed gameStats.score"
    fi
    
    # Fix userAnswer -> answer (common in Detective Listening style games)
    if grep -q "userAnswer:" "$file" && ! grep -q "const userAnswer" "$file"; then
        echo "    ❌ Found undefined userAnswer - fixing..."
        sed -i '' 's/userAnswer:/answer:/g' "$file"
        echo "    ✅ Fixed userAnswer reference"
    fi
    
    # Remove any remaining recordWordPractice calls that weren't caught
    if grep -q "recordWordPractice(" "$file"; then
        echo "    ⚠️  Found remaining recordWordPractice calls - needs manual review"
    fi
    
    # Check for missing gameSessionId parameter
    if grep -q "EnhancedGameSessionService" "$file" && ! grep -q "gameSessionId" "$file"; then
        echo "    ⚠️  Uses EnhancedGameSessionService but missing gameSessionId - needs manual review"
    fi
}

# Find all game component files
echo "📁 Scanning game directories..."
find "$GAMES_DIR" -name "*.tsx" -o -name "*.ts" | while read -r file; do
    # Skip test files and non-component files
    if [[ "$file" == *".test."* ]] || [[ "$file" == *".spec."* ]]; then
        continue
    fi
    
    # Only process files that likely contain vocabulary tracking
    if grep -q "EnhancedGameSessionService\|recordWordPractice\|gameStats\|vocabularyId" "$file"; then
        fix_variable_references "$file"
    fi
done

echo ""
echo "🎯 COMMON FIXES APPLIED:"
echo "✅ gameStats.correctAnswers → correctAnswers"
echo "✅ gameStats.streak → streak"  
echo "✅ gameStats.score → score"
echo "✅ userAnswer: → answer: (in logging)"
echo ""
echo "⚠️  MANUAL REVIEW NEEDED FOR:"
echo "- Games with remaining recordWordPractice calls"
echo "- Games using EnhancedGameSessionService without gameSessionId"
echo "- Games with custom variable names not covered by this script"
echo ""
echo "🧪 TEST EACH GAME:"
echo "1. Load the game"
echo "2. Answer a vocabulary question correctly"
echo "3. Check console for errors"
echo "4. Verify database records are created correctly"
echo ""
echo "✅ Automated fixes complete!"
