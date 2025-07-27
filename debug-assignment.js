#!/usr/bin/env node

// Simple debug script to check assignment data
const { createClient } = require('@supabase/supabase-js');

// You'll need to set these environment variables or replace with actual values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'your-supabase-url';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-supabase-key';

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAssignment(assignmentId) {
  try {
    console.log('Fetching assignment:', assignmentId);
    
    const { data, error } = await supabase
      .from('assignments')
      .select('*')
      .eq('id', assignmentId)
      .single();
      
    if (error) {
      console.error('Error:', error);
      return;
    }
    
    console.log('Assignment data:');
    console.log('- ID:', data.id);
    console.log('- Title:', data.title);
    console.log('- Game Type:', data.game_type);
    console.log('- Type:', data.type);
    console.log('- Game Config:', JSON.stringify(data.game_config, null, 2));
    console.log('- Status:', data.status);
    
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run with the assignment ID from the URL
const assignmentId = 'd6ef3b1f-b39f-483f-9a00-bc82ee87fd89';
debugAssignment(assignmentId);
