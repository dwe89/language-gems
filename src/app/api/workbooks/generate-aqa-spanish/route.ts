import { NextRequest, NextResponse } from 'next/server';
import { generateAQASpanishWorkbook } from '@/lib/workbook-templates/generator';

/**
 * API Route: Generate AQA GCSE Spanish Writing Exam Kit PDF
 * 
 * This endpoint generates the complete 50-page workbook HTML
 * which can then be converted to PDF using the existing PDF generation system
 */
export async function GET(request: NextRequest) {
  try {
    console.log('🚀 Generating AQA GCSE Spanish Workbook...');

    // Generate the complete HTML workbook
    const html = generateAQASpanishWorkbook();

    console.log('✅ Workbook HTML generated successfully');
    console.log(`📄 HTML length: ${html.length} characters`);

    // Return HTML for preview or PDF generation
    const format = request.nextUrl.searchParams.get('format') || 'html';

    if (format === 'pdf') {
      // Generate PDF using existing PDF generation system
      const pdfResponse = await fetch(`${request.nextUrl.origin}/api/worksheets/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: html,
          filename: 'AQA_GCSE_Spanish_Writing_Exam_Kit_Foundation',
        }),
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      // Return the PDF
      const pdfBuffer = await pdfResponse.arrayBuffer();
      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="AQA_GCSE_Spanish_Writing_Exam_Kit_Foundation.pdf"',
        },
      });
    }

    // Return HTML for preview
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('❌ Error generating workbook:', error);
    return NextResponse.json(
      { error: 'Failed to generate workbook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

/**
 * POST endpoint for custom workbook generation
 * Allows passing custom workbook data
 */
export async function POST(request: NextRequest) {
  try {
    const { workbookData, format = 'html' } = await request.json();

    console.log('🚀 Generating custom workbook...');

    // Import the generator function
    const { generateWorkbook } = await import('@/lib/workbook-templates/generator');

    // Generate HTML from custom data
    const html = generateWorkbook(workbookData);

    console.log('✅ Custom workbook HTML generated successfully');

    if (format === 'pdf') {
      // Generate PDF
      const pdfResponse = await fetch(`${request.nextUrl.origin}/api/worksheets/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          html: html,
          filename: workbookData.cover.title.replace(/[^a-zA-Z0-9]/g, '-'),
        }),
      });

      if (!pdfResponse.ok) {
        throw new Error('Failed to generate PDF');
      }

      const pdfBuffer = await pdfResponse.arrayBuffer();
      return new NextResponse(Buffer.from(pdfBuffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="${workbookData.cover.title.replace(/[^a-zA-Z0-9]/g, '-')}.pdf"`,
        },
      });
    }

    // Return HTML
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('❌ Error generating custom workbook:', error);
    return NextResponse.json(
      { error: 'Failed to generate custom workbook', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

