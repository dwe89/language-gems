import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import fs from 'fs';
import path from 'path';

export async function GET(req: NextRequest) {
  try {
    // Admin-only endpoint
    const supabase = createServerSupabaseClient();
    
    // Get user from session
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Check if user is admin
    const { data: user } = await supabase
      .from('users')
      .select('role')
      .eq('id', session.user.id)
      .single();
      
    const isAdmin = user?.role === 'admin';
    
    // For security, only allow if this is:
    // 1. An admin user, or 
    // 2. A call from our own application (not external), or
    // 3. Running in development mode
    const isLocalCall = req.headers.get('host')?.includes('localhost') || 
                      req.headers.get('referer')?.includes(req.headers.get('host') || '');
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    if (!isAdmin && !isLocalCall && !isDevelopment) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    
    // Path to migration files
    const migrationsDir = path.join(process.cwd(), 'supabase', 'migrations');
    
    // Read migration files
    const files = fs.readdirSync(migrationsDir);
    
    // Sort files by name (which includes date in format YYYYMMDDhhmmss)
    const sortedFiles = files.sort();
    
    // Get most recent migration
    const latestMigration = sortedFiles[sortedFiles.length - 1];
    
    if (!latestMigration) {
      return NextResponse.json({ message: 'No migrations found' });
    }
    
    // Read migration file content
    const migrationContent = fs.readFileSync(
      path.join(migrationsDir, latestMigration), 
      'utf8'
    );
    
    // Execute migration
    const { error } = await supabase.rpc('run_sql', { 
      sql_query: migrationContent
    });
    
    if (error) {
      console.error('Migration error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      success: true, 
      message: `Migration ${latestMigration} applied successfully` 
    });
  } catch (error) {
    console.error('Error in migration route:', error);
    const message = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
} 