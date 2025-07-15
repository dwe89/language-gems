import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html } = body;

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Inject print-specific CSS just before </head> in the provided HTML
    const printStyles = `
    <style>
      @media print {
        html, body { background: white !important; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        .print-instructions { display: none !important; }
        .page { box-shadow: none !important; margin: 0 !important; border: none !important; }
        .section, .intro-section, .reference-card, .matching-column { break-inside: avoid; page-break-inside: avoid; }
      }
      .print-instructions {
        position: fixed; top: 10px; right: 10px; background: #10B981; color: white; padding: 10px 15px; border-radius: 8px; font-weight: 600; z-index: 1000; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
    </style>
    <div class="print-instructions">Press Ctrl+P (Cmd+P on Mac) to save as PDF</div>
    `;
    let printHTML = html;
    if (/<\/head>/i.test(html)) {
      printHTML = html.replace(/<\/head>/i, printStyles + '</head>');
    } else {
      printHTML = printStyles + html;
    }
    return new NextResponse(printHTML, {
      headers: {
        'Content-Type': 'text/html',
      },
    });
  } catch (error) {
    console.error('Error generating print view:', error);
    return NextResponse.json({ error: 'Failed to generate print view' }, { status: 500 });
  }
} 