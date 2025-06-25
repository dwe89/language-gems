import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import path from 'path';
import fs from 'fs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const worksheetId = searchParams.get('id');
    const fileName = searchParams.get('fileName');

    if (!worksheetId || !fileName) {
      return NextResponse.json(
        { error: 'Worksheet ID and filename are required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Define premium worksheets that require authentication
    const premiumWorksheets = [
      'past-tense',
      'future-tense', 
      'gcse-speaking-practice',
      'french-cuisine'
    ];

    // Check if this is a premium worksheet
    const isPremium = premiumWorksheets.includes(worksheetId);

    if (isPremium) {
      // Check authentication for premium content
      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        return NextResponse.json(
          { error: 'Authentication required for premium worksheets' },
          { status: 401 }
        );
      }

      // Log the download for analytics
      await supabase.from('worksheet_downloads').insert({
        user_id: user.id,
        worksheet_id: worksheetId,
        file_name: fileName,
        downloaded_at: new Date().toISOString()
      });
    }

    // In production, you would serve the actual PDF file
    // For demo purposes, we'll return information about the file
    const filePath = path.join(process.cwd(), 'public', 'freebies', 'downloads', fileName);
    
    // Check if file exists (in production you'd actually serve the file)
    if (!fs.existsSync(filePath)) {
      // Return a placeholder response for demo
      return NextResponse.json({
        message: 'Download would start here',
        worksheetId,
        fileName,
        isPremium,
        note: 'In production, this would serve the actual PDF file'
      });
    }

    // In production, you would:
    // 1. Read the file
    // 2. Set appropriate headers
    // 3. Return the file stream
    
    return NextResponse.json({
      message: 'File found and would be downloaded',
      worksheetId,
      fileName,
      isPremium
    });

  } catch (error) {
    console.error('Error in freebies download API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { worksheetId, email } = body;

    if (!worksheetId) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    // Create Supabase client
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    // Log anonymous download for analytics (for free worksheets)
    await supabase.from('worksheet_downloads').insert({
      worksheet_id: worksheetId,
      anonymous_email: email,
      downloaded_at: new Date().toISOString()
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error logging worksheet download:', error);
    return NextResponse.json(
      { error: 'Failed to log download' },
      { status: 500 }
    );
  }
} 