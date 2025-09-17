#!/bin/bash

# Set up variables
SUPABASE_PROJECT_ID="your-supabase-project-id"
SUPABASE_ACCESS_TOKEN="sbp_e6d81ad2c6ebb8de6fc5e2ac0a1d5b4cde244d9c"

# Check if the SUPABASE_PROJECT_ID is set
if [ "$SUPABASE_PROJECT_ID" == "your-supabase-project-id" ]; then
  echo "Error: Please set your SUPABASE_PROJECT_ID in the script"
  exit 1
fi

echo "Deploying YouTube video schema to Supabase..."

# Push the schema migration
echo "Pushing schema migration..."
npx supabase link --project-ref "$SUPABASE_PROJECT_ID" --password "$SUPABASE_ACCESS_TOKEN"
npx supabase db push

# Insert sample data
echo "Inserting sample data..."
npx supabase db execute -f ./scripts/db/sample_youtube_data.sql

echo "Deployment completed successfully!" 