import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Worksheet ID is required' },
        { status: 400 }
      );
    }

    // Validate UUID format
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      return NextResponse.json(
        { error: `Invalid worksheet ID format: "${id}". Expected a valid UUID.` },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get the worksheet from the database
    const { data: worksheet, error } = await supabase
      .from('worksheets')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching worksheet:', error);
      if (error.code === 'PGRST116') {
        // No rows returned - worksheet not found
        return NextResponse.json(
          { error: 'Worksheet not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { error: 'Database error occurred' },
        { status: 500 }
      );
    }

    if (!worksheet) {
      return NextResponse.json(
        { error: 'Worksheet not found' },
        { status: 404 }
      );
    }

    // Check if Canva-friendly mode is requested
    const canvaMode = request.nextUrl.searchParams.get('canva') === 'true';

    // Generate fresh HTML for the worksheet
    const htmlResponse = await fetch(`${request.nextUrl.origin}/api/worksheets/generate-html`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        worksheet,
        options: { canvaFriendly: canvaMode }
      })
    });

    if (!htmlResponse.ok) {
      throw new Error('Failed to generate HTML');
    }

    const htmlResult = await htmlResponse.json();
    const htmlContent = htmlResult.html;

    // Generate PDF
    const pdfResponse = await fetch(`${request.nextUrl.origin}/api/worksheets/generate-pdf`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        html: htmlContent,
        filename: `${worksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}`
      })
    });

    if (!pdfResponse.ok) {
      throw new Error('Failed to generate PDF');
    }

    // Get the PDF blob
    const pdfBuffer = await pdfResponse.arrayBuffer();

    // Track the download
    const { data: { user } } = await supabase.auth.getUser();
    
    try {
      await supabase
        .from('worksheet_downloads')
        .insert({
          user_id: user?.id || null,
          worksheet_id: id,
          file_name: `${worksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf`,
          ip_address: request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown',
          user_agent: request.headers.get('user-agent') || 'unknown',
          downloaded_at: new Date().toISOString()
        });
    } catch (trackingError) {
      console.error('Error tracking download:', trackingError);
      // Don't fail the request if tracking fails
    }

    // Return the PDF
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${worksheet.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`,
        'Content-Length': pdfBuffer.byteLength.toString(),
      },
    });

  } catch (error) {
    console.error('Error in worksheet download:', error);
    return NextResponse.json(
      { error: 'Failed to download worksheet' },
      { status: 500 }
    );
  }
}
