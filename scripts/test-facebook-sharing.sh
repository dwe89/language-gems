#!/bin/bash

# Facebook Open Graph Testing Script
# This script helps test Open Graph meta tags for social sharing

echo "🔍 Testing Open Graph Meta Tags for Language Gems Blog"
echo "=================================================="

# Test the blog post URL
BLOG_URL="http://localhost:3000/blog/aqa-gcse-speaking-photocard-guide"

echo ""
echo "📝 Blog Post URL: $BLOG_URL"
echo ""

echo "🌐 To test Facebook sharing:"
echo "1. Start your development server: npm run dev"
echo "2. Use Facebook's Sharing Debugger: https://developers.facebook.com/tools/debug/"
echo "3. Enter your URL: $BLOG_URL"
echo ""

echo "🔧 Alternative testing methods:"
echo "1. Use curl to check meta tags:"
echo "   curl -s $BLOG_URL | grep -i \"og:\|twitter:\""
echo ""
echo "2. Use Open Graph testing tools:"
echo "   - https://www.opengraph.xyz/"
echo "   - https://cards-dev.twitter.com/validator"
echo ""

echo "✅ Expected Open Graph tags:"
echo "- og:title: AQA GCSE Speaking: Complete Photocard Guide"
echo "- og:description: Master the AQA GCSE Speaking exam photocard task..."
echo "- og:image: https://languagegems.com/images/blog/aqa-gcse-speaking-photocard-og.svg"
echo "- og:url: https://languagegems.com/blog/aqa-gcse-speaking-photocard-guide"
echo "- og:type: article"
echo ""

echo "🚨 Common Facebook sharing issues and solutions:"
echo ""
echo "1. IMAGE NOT SHOWING:"
echo "   - Facebook prefers JPG/PNG over SVG"
echo "   - Image should be at least 1200x630 pixels"
echo "   - Image URL must be accessible (no localhost for production)"
echo ""
echo "2. TITLE/DESCRIPTION NOT UPDATING:"
echo "   - Use Facebook's URL debugger to refresh cache"
echo "   - Clear Facebook's cache for your URL"
echo ""
echo "3. LOCALHOST TESTING:"
echo "   - Facebook cannot access localhost URLs"
echo "   - Use ngrok for local testing: npx ngrok http 3000"
echo "   - Or deploy to staging environment"
echo ""

echo "🔧 Quick fixes applied:"
echo "✅ Added comprehensive Open Graph tags"
echo "✅ Added Twitter Card tags"
echo "✅ Added structured data (JSON-LD)"
echo "✅ Created reusable blog SEO utility"
echo "✅ Added proper images with correct dimensions"
echo ""

echo "📋 Next steps:"
echo "1. Convert SVG images to JPG/PNG for better Facebook support"
echo "2. Test with actual domain (not localhost)"
echo "3. Use Facebook debugger to validate"
echo "4. Apply the same SEO improvements to other blog posts"