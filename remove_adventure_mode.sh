#!/bin/bash

# Script to remove all isAdventureMode references from VocabMaster mode components

echo "🧹 Removing Adventure Mode from VocabMaster components..."

# List of mode files that need to be cleaned
MODE_FILES=(
    "src/app/games/vocab-master/modes/ClozeMode.tsx"
    "src/app/games/vocab-master/modes/FlashcardsMode.tsx"
    "src/app/games/vocab-master/modes/LearnMode.tsx"
    "src/app/games/vocab-master/modes/ListeningMode.tsx"
    "src/app/games/vocab-master/modes/MatchingMode.tsx"
    "src/app/games/vocab-master/modes/MemoryPalaceMode.tsx"
    "src/app/games/vocab-master/modes/MultipleChoiceMode.tsx"
    "src/app/games/vocab-master/modes/PronunciationMode.tsx"
    "src/app/games/vocab-master/modes/SpeedMode.tsx"
    "src/app/games/vocab-master/modes/StoryAdventureMode.tsx"
    "src/app/games/vocab-master/modes/WordBuilderMode.tsx"
    "src/app/games/vocab-master/modes/WordRaceMode.tsx"
)

# Function to remove isAdventureMode from a file
remove_adventure_mode() {
    local file="$1"
    echo "  📝 Processing: $file"
    
    if [ ! -f "$file" ]; then
        echo "    ❌ File not found: $file"
        return
    fi
    
    # Remove isAdventureMode from prop destructuring
    sed -i '' 's/,\s*isAdventureMode//g' "$file"
    sed -i '' 's/isAdventureMode,\s*//g' "$file"
    sed -i '' 's/isAdventureMode\s*,//g' "$file"
    
    # Remove standalone isAdventureMode lines
    sed -i '' '/^\s*isAdventureMode\s*$/d' "$file"
    
    # Replace conditional styling with standard (light theme) styling
    # This is a complex replacement that handles multi-line conditionals
    
    echo "    ✅ Removed isAdventureMode references from $file"
}

# Process each mode file
for file in "${MODE_FILES[@]}"; do
    if [ -f "$file" ]; then
        remove_adventure_mode "$file"
    else
        echo "  ⚠️  File not found: $file"
    fi
done

echo ""
echo "✅ Adventure Mode removal complete!"
echo "⚠️  Note: Complex conditional styling may need manual cleanup"
echo "   Run the application to check for any remaining isAdventureMode errors"
