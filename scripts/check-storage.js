#!/usr/bin/env node

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load env vars from .env.local
const envPath = path.join(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      if (key && value && !process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Checking Supabase Storage Configuration...\n');

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing environment variables');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? '✓' : '✗');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? '✓' : '✗');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  // List all buckets
  const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
  
  if (bucketsError) {
    console.log('❌ Error listing buckets:', bucketsError.message);
    process.exit(1);
  }
  
  console.log('📦 Available buckets:');
  buckets.forEach(b => {
    console.log(`   - ${b.name} (${b.public ? 'public' : 'private'})`);
  });
  
  const targetBucket = 'assessment-images';
  const bucket = buckets.find(b => b.name === targetBucket);
  
  if (!bucket) {
    console.log(`\n❌ Bucket '${targetBucket}' NOT FOUND`);
    console.log('\n🔧 Creating bucket...');
    
    const { data: newBucket, error: createError } = await supabase.storage.createBucket(targetBucket, {
      public: true,
      fileSizeLimit: 5242880, // 5MB
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    });
    
    if (createError) {
      console.log('❌ Failed to create bucket:', createError.message);
      process.exit(1);
    }
    
    console.log('✅ Bucket created successfully!');
  } else {
    console.log(`\n✅ Bucket '${targetBucket}' exists`);
    console.log(`   Public: ${bucket.public}`);
    console.log(`   File size limit: ${bucket.file_size_limit ? (bucket.file_size_limit / 1024 / 1024).toFixed(1) + 'MB' : 'unlimited'}`);
    
    // Check if aqa-writing folder exists
    const { data: files, error: listError } = await supabase.storage
      .from(targetBucket)
      .list('aqa-writing', { limit: 1 });
    
    if (listError) {
      console.log(`\n⚠️  Cannot list files in aqa-writing folder: ${listError.message}`);
    } else {
      console.log(`\n📁 Folder 'aqa-writing' accessible`);
      
      // Try to get a file count
      const { data: allFiles } = await supabase.storage
        .from(targetBucket)
        .list('aqa-writing');
      
      if (allFiles) {
        console.log(`   Files: ${allFiles.length}`);
      }
    }
  }
  
  console.log('\n✅ Storage check complete!');
})().catch(err => {
  console.error('❌ Unexpected error:', err);
  process.exit(1);
});
