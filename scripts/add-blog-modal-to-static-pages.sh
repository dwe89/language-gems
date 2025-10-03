#!/bin/bash

# Script to add BlogPageWrapper to all static blog pages
# This adds the subscription modal and reading progress bar

echo "🔧 Adding BlogPageWrapper to static blog pages..."

# Find all page.tsx files in blog subdirectories (excluding the main blog page and [slug])
find src/app/blog -mindepth 2 -name "page.tsx" -type f | while read -r file; do
  echo "Processing: $file"
  
  # Check if already has BlogPageWrapper
  if grep -q "BlogPageWrapper" "$file"; then
    echo "  ✅ Already has BlogPageWrapper, skipping"
    continue
  fi
  
  # Check if it's a client component (has 'use client')
  if grep -q "'use client'" "$file"; then
    echo "  ⚠️  Client component detected, skipping (needs manual review)"
    continue
  fi
  
  # Add import after other imports (before export const metadata)
  if grep -q "import.*from.*lucide-react" "$file"; then
    # Add after lucide-react import
    sed -i.bak "/import.*from.*lucide-react/a\\
import BlogPageWrapper from '@/components/blog/BlogPageWrapper';
" "$file"
  elif grep -q "import.*from 'next'" "$file"; then
    # Add after next imports
    sed -i.bak "/import.*from 'next'/a\\
import BlogPageWrapper from '@/components/blog/BlogPageWrapper';
" "$file"
  else
    echo "  ⚠️  Could not find import location, skipping"
    continue
  fi
  
  # Find the return statement and add wrapper
  # This is tricky - we'll add it after "return (" and before the closing ");"
  
  # Add opening wrapper after "return ("
  sed -i.bak2 's/return (/return (\n    <BlogPageWrapper>/' "$file"
  
  # Add closing wrapper before final ");"
  # Find the last occurrence of ");" and add wrapper before it
  tac "$file" | sed '0,/);/{s/);/    <\/BlogPageWrapper>\n  );/}' | tac > "$file.tmp"
  mv "$file.tmp" "$file"
  
  # Clean up backup files
  rm -f "$file.bak" "$file.bak2"
  
  echo "  ✅ Added BlogPageWrapper"
done

echo ""
echo "✅ Done! All static blog pages now have the subscription modal."
echo ""
echo "📝 Note: Some pages may need manual review if they have complex structures."
echo "🧪 Test by visiting any static blog page and scrolling to 50% or moving mouse to top."

