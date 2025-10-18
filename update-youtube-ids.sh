#!/bin/bash

# Script to replace placeholder YouTube video IDs with the actual video ID

# The target YouTube video ID
TARGET_VIDEO_ID="EGaSgIRswcI"

# Find all .tsx files and replace placeholder YouTube video IDs
find src/app -name "*.tsx" -type f -exec grep -l "youtubeVideoId=" {} \; | while read file; do
    # Skip files that already have the correct video ID or undefined
    if grep -q "youtubeVideoId=\"${TARGET_VIDEO_ID}\"" "$file" || grep -q "youtubeVideoId={undefined}" "$file"; then
        echo "Skipping $file (already has correct ID or undefined)"
        continue
    fi
    
    # Check if file has a placeholder YouTube video ID (not starting with "EG" and not "EGaSgIRswcI")
    if grep -q "youtubeVideoId=\"[^E][^G]" "$file" && ! grep -q "youtubeVideoId=\"EGaSgIRswcI\"" "$file"; then
        echo "Updating $file"
        # Use sed to replace any quoted YouTube video ID that doesn't start with "EG"
        sed -i '' 's/youtubeVideoId="[^"]*-spanish"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-verbs"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-patterns"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-constructions"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-periphrases"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-serialization"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-agreement"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-complementation"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-government"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
        sed -i '' 's/youtubeVideoId="[^"]*-valency"/youtubeVideoId="'${TARGET_VIDEO_ID}'"/g' "$file"
    fi
done

echo "YouTube video ID replacement complete!"