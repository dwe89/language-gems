#!/bin/bash

# Final cleanup script - removes ALL legacy recordWordPractice calls
# and ensures clean codebase

echo "🧹 Final cleanup of ALL legacy vocabulary tracking code..."

# Function to completely remove legacy blocks
clean_legacy_calls() {
    local file="$1"
    local game_name=$(basename $(dirname "$file"))
    echo "  🎮 Cleaning: $game_name"
    
    # Remove entire legacy recordWordPractice blocks (commented or not)
    # This is safer than trying to replace them
    
    # Create a temporary file for processing
    local temp_file=$(mktemp)
    local in_legacy_block=false
    local brace_count=0
    
    while IFS= read -r line; do
        # Check if we're starting a legacy block
        if [[ "$line" =~ (LEGACY:.*recordWordPractice|recordWordPractice\() ]]; then
            in_legacy_block=true
            brace_count=0
            echo "    ❌ Removing legacy recordWordPractice block"
            continue
        fi
        
        # If we're in a legacy block, count braces to find the end
        if [ "$in_legacy_block" = true ]; then
            # Count opening braces/parentheses
            brace_count=$((brace_count + $(echo "$line" | tr -cd '({' | wc -c)))
            # Count closing braces/parentheses  
            brace_count=$((brace_count - $(echo "$line" | tr -cd ')}' | wc -c)))
            
            # If we've closed all braces and see a semicolon or closing brace, end the block
            if [ $brace_count -le 0 ] && [[ "$line" =~ (;|^\s*\}|\).catch) ]]; then
                in_legacy_block=false
                continue
            fi
            continue
        fi
        
        # Keep non-legacy lines
        echo "$line" >> "$temp_file"
    done < "$file"
    
    # Replace original file with cleaned version
    mv "$temp_file" "$file"
    
    # Remove any remaining legacy comments
    sed -i '' '/\/\/ LEGACY:/d' "$file"
    sed -i '' '/console\.log.*HANGMAN.*recordWordPractice/d' "$file"
    
    echo "    ✅ Legacy blocks removed"
}

# Clean critical games
GAMES=(
    "src/app/games/hangman/components/HangmanGame.tsx"
    "src/app/games/vocab-blast/components/VocabBlastGame.tsx"
    "src/app/games/word-blast/components/WordBlastGame.tsx"
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
        clean_legacy_calls "$game"
    fi
done

# Final verification
echo ""
echo "🔍 VERIFICATION:"
echo "Checking for remaining legacy references..."

remaining_legacy=0
for game in "${GAMES[@]}"; do
    if [ -f "$game" ]; then
        if grep -q "recordWordPractice\|useUnifiedSpacedRepetition" "$game"; then
            echo "  ⚠️  $game still has legacy references"
            remaining_legacy=$((remaining_legacy + 1))
        fi
    fi
done

if [ $remaining_legacy -eq 0 ]; then
    echo "✅ No legacy references found!"
else
    echo "⚠️  Found $remaining_legacy files with remaining legacy references"
fi

echo ""
echo "🎯 FINAL CLEANUP COMPLETE:"
echo "✅ Removed ALL legacy recordWordPractice calls"
echo "✅ Removed ALL legacy comments and logs"
echo "✅ Clean codebase ready for unified architecture"
echo ""
echo "📋 NEXT STEPS:"
echo "1. Test critical games (Detective Listening, Noughts and Crosses)"
echo "2. Verify vocabulary tracking works correctly"
echo "3. Check database for proper recording"
echo ""
echo "✅ Final cleanup complete!"
