#!/bin/bash

# Beta Feedback System Upgrade - Setup Script
# Run this after deploying the new code to set up database and storage

set -e

echo "🚀 Beta Feedback System Upgrade Setup"
echo "======================================"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found. Install it first:"
    echo "   npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI found"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "⚠️  Project not linked to Supabase."
    echo "   Run: supabase link --project-ref YOUR_PROJECT_REF"
    exit 1
fi

echo "✅ Project linked to Supabase"
echo ""

# Run migrations
echo "📦 Running database migrations..."
echo ""

# Migration 1: Table columns
echo "1️⃣  Adding new columns to beta_feedback table..."
supabase db push --include-all

if [ $? -eq 0 ]; then
    echo "   ✅ Database schema updated"
else
    echo "   ❌ Migration failed. Check errors above."
    exit 1
fi

echo ""

# Storage setup
echo "2️⃣  Setting up storage bucket..."
echo "   Please run this SQL in your Supabase SQL Editor:"
echo ""
echo "   📄 File: supabase/migrations/20260110_feedback_storage_bucket.sql"
echo ""
echo "   Or paste this command:"
echo ""
cat << 'EOF'
INSERT INTO storage.buckets (id, name, public)
VALUES ('feedback-attachments', 'feedback-attachments', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload feedback screenshots"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'feedback-attachments');

CREATE POLICY "Public read access for feedback screenshots"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'feedback-attachments');

UPDATE storage.buckets
SET file_size_limit = 10485760,
    allowed_mime_types = ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp']
WHERE id = 'feedback-attachments';
EOF

echo ""
echo ""

# Final instructions
echo "✨ Setup Complete!"
echo ""
echo "📋 Next Steps:"
echo "   1. Verify storage bucket in Supabase Dashboard → Storage"
echo "   2. Deploy frontend: npm run build && vercel deploy"
echo "   3. Test feedback widget at /dashboard"
echo "   4. Submit test bug report with screenshot"
echo ""
echo "📖 Full documentation: BETA_FEEDBACK_UPGRADE_2026.md"
echo ""
echo "🎉 Your feedback system is now upgraded!"
