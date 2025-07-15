import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { html } = body;

    if (!html) {
      return NextResponse.json({ error: 'HTML content is required' }, { status: 400 });
    }

    // Create a clean, print-optimized HTML document
    const printHTML = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Language Gems Worksheet</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        @page {
            size: A4;
            margin: 0.5in;
            @top-left { content: none; }
            @top-right { content: none; }
            @bottom-left { content: none; }
            @bottom-right { content: none; }
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: white;
            color: #333;
            line-height: 1.4;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }
        
        .page {
            width: 100%;
            min-height: calc(11in - 1in);
            margin: 0 auto;
            background: white;
            padding: 0.5in;
            page-break-after: always;
            border: 3px solid #8B5CF6;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            text-align: center;
            padding: 20px;
            margin: -0.5in -0.5in 20px -0.5in;
            border-bottom: 3px solid #8B5CF6;
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 2.5em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 3px;
        }
        
        .name-date {
            display: flex;
            justify-content: space-between;
            margin-bottom: 20px;
            font-weight: 600;
            font-size: 14px;
        }
        
        .name-date span {
            border-bottom: 2px solid #333;
            padding-bottom: 2px;
            min-width: 300px;
        }
        
        .section {
            border: 2px dashed #666;
            margin: 20px 0;
            padding: 15px;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            break-inside: avoid;
        }
        
        .section-number {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            width: 35px;
            height: 35px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 18px;
            float: left;
            margin-right: 15px;
            margin-top: -5px;
            box-shadow: 0 3px 6px rgba(139, 92, 246, 0.3);
        }
        
        .section h3 {
            font-weight: 700;
            margin-bottom: 10px;
            color: #374151;
            font-size: 16px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .exercise-item {
            margin: 8px 0;
            font-size: 14px;
        }
        
        .exercise-item .number {
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .blank {
            border-bottom: 1px solid #333;
            display: inline-block;
            min-width: 80px;
            margin: 0 3px;
        }
        
        .table-container {
            overflow-x: auto;
            margin: 15px 0;
        }
        
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
            background: white;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        th, td {
            border: 2px solid #8B5CF6;
            padding: 12px;
            text-align: center;
            font-size: 14px;
        }
        
        th {
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 1px;
        }
        
        td {
            background: #F8FAFC;
        }
        
        .challenge-area {
            background: #F3F4F6;
            border: 2px solid #D1D5DB;
            border-radius: 8px;
            padding: 15px;
            margin: 15px 0;
        }
        
        .challenge-line {
            border-bottom: 1px solid #6B7280;
            height: 25px;
            margin: 10px 0;
        }
        
        .footer {
            position: absolute;
            bottom: 0.5in;
            left: 0;
            right: 0;
            text-align: center;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 14px;
        }
        
        .gem-accent {
            color: #F59E0B;
            font-weight: 700;
        }
        
        .instructions {
            font-style: italic;
            color: #6B7280;
            margin-bottom: 15px;
            font-size: 14px;
        }
        
        /* Print-specific optimizations */
        @media print {
            @page { margin: 0.5in; }
            @page :first { margin-top: 0.3in; }
            
            body {
                background: white !important;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .page {
                box-shadow: none;
                margin: 0;
                border: 3px solid #8B5CF6;
                min-height: auto;
                page-break-after: always;
            }
            
            .page:last-child {
                page-break-after: avoid;
            }
            
            .section {
                break-inside: avoid;
                page-break-inside: avoid;
            }
            
            .header {
                background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%) !important;
                color: white !important;
            }
            
            .section-number {
                background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
                color: white !important;
            }
            
            th {
                background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%) !important;
                color: white !important;
            }
            
            /* Hide browser headers and footers */
            html {
                margin: 0 !important;
                padding: 0 !important;
            }
            
            body {
                margin: 0 !important;
                padding: 0 !important;
            }
        }
        
        /* Hide scrollbars and ensure clean printing */
        body {
            overflow-x: hidden;
        }
        
        /* Add a print instruction banner */
        .print-instructions {
            position: fixed;
            top: 10px;
            right: 10px;
            background: #10B981;
            color: white;
            padding: 10px 15px;
            border-radius: 8px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        
        @media print {
            .print-instructions {
                display: none;
            }
        }
    </style>
</head>
<body>
    <div class="print-instructions">
        Press Ctrl+P (Cmd+P on Mac) to save as PDF
    </div>
    ${html.replace(/<!DOCTYPE html>[\s\S]*?<body[^>]*>/, '').replace(/<\/body>[\s\S]*?<\/html>/, '')}
</body>
</html>`;

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