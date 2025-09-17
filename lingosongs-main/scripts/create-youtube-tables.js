// Script to create YouTube tables in Supabase
require('dotenv').config({ path: './.env.local' });
const { createClient } = require('@supabase/supabase-js');

// Create a Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure .env.local has NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Read the SQL files
const fs = require('fs');
const path = require('path');

async function createTables() {
  try {
    console.log('Creating YouTube tables...');
    
    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'db', 'youtube_video_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema
    const { error: schemaError } = await supabase.rpc('pgclient', { 
      query: schemaSql 
    });
    
    if (schemaError) {
      console.error('Error creating schema:', schemaError);
      return;
    }
    
    console.log('Schema created successfully!');
    
    // Read sample data SQL file
    const sampleDataPath = path.join(__dirname, 'db', 'sample_youtube_data.sql');
    const sampleDataSql = fs.readFileSync(sampleDataPath, 'utf8');
    
    // Execute sample data
    const { error: dataError } = await supabase.rpc('pgclient', { 
      query: sampleDataSql 
    });
    
    if (dataError) {
      console.error('Error inserting sample data:', dataError);
      return;
    }
    
    console.log('Sample data inserted successfully!');
    console.log('Setup completed successfully!');
    
  } catch (error) {
    console.error('Error setting up YouTube tables:', error);
  }
}

createTables(); 