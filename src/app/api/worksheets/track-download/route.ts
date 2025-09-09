import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function POST(request: NextRequest) {
  try {
    const { worksheetId, fileName } = await request.json();
    const supabase = await createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();

    // Get client IP and user agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';

    // Track the download
    const { error } = await supabase
      .from('worksheet_downloads')
      .insert({
        user_id: user?.id || null,
        worksheet_id: worksheetId,
        file_name: fileName,
        ip_address: ip,
        user_agent: userAgent,
        downloaded_at: new Date().toISOString()
      });

    if (error) {
      console.error('Error tracking download:', error);
      // Don't fail the request if tracking fails
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in track-download:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
