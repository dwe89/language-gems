const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.log('❌ Missing env vars');
  console.log('NEXT_PUBLIC_SUPABASE_URL:', supabaseUrl ? 'Set' : 'Missing');
  console.log('SUPABASE_SERVICE_ROLE_KEY:', supabaseKey ? 'Set' : 'Missing');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

(async () => {
  console.log('Checking Supabase buckets...\n');
  
  const { data, error } = await supabase.storage.listBuckets();
  
  if (error) {
    console.log('❌ Error:', error);
    process.exit(1);
  }
  
  console.log('📦 Available buckets:', data.map(b => b.name).join(', '));
  
  const bucket = data.find(b => b.name === 'assessment-images');
  if (bucket) {
    console.log('\n✅ assessment-images bucket found');
    console.log('Bucket details:', JSON.stringify(bucket, null, 2));
    
    // Test file list
    const { data: files, error: listError } = await supabase.storage
      .from('assessment-images')
      .list('aqa-writing', { limit: 5 });
    
    if (listError) {
      console.log('\n❌ Error listing files:', listError);
    } else {
      console.log(`\n📄 Files in aqa-writing folder: ${files.length}`);
      if (files.length > 0) {
        files.forEach(f => console.log(`  - ${f.name}`));
      }
    }
  } else {
    console.log('\n❌ assessment-images bucket NOT FOUND');
    console.log('Available buckets:', data.map(b => b.name));
  }
})();
