import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const worksheetId = params.id;
    console.log('Generating PDF for sentence builder worksheet:', worksheetId);

    // Fetch the worksheet from database
    const { data: worksheet, error } = await supabase
      .from('worksheets')
      .select('*')
      .eq('id', worksheetId)
      .eq('template_id', 'sentence_builder')
      .single();

    if (error || !worksheet) {
      console.error('Worksheet not found:', error);
      return NextResponse.json({ error: 'Worksheet not found' }, { status: 404 });
    }

    console.log('Found sentence builder worksheet:', worksheet.title);

    // Extract the worksheet data
    const worksheetData = worksheet.content?.worksheet_data || worksheet.content;
    
    if (!worksheetData || !worksheetData.columns) {
      return NextResponse.json({ error: 'Invalid worksheet data' }, { status: 400 });
    }

    // Generate HTML content for PDF
    const htmlContent = generatePDFHTML(worksheetData, worksheet);

    // Return HTML content that can be converted to PDF on the client side
    return new NextResponse(htmlContent, {
      headers: {
        'Content-Type': 'text/html',
        'Content-Disposition': `inline; filename="${worksheet.title.replace(/\s+/g, '_')}.html"`
      }
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json({ error: 'Failed to generate PDF' }, { status: 500 });
  }
}

function getGenderClass(group: string): string {
  switch (group) {
    case 'MASCULINE_SINGULAR':
    case 'MASCULINE_PLURAL':
      return 'gender-masculine';
    case 'FEMININE_SINGULAR':
    case 'FEMININE_PLURAL':
      return 'gender-feminine';
    case 'INVARIABLE':
    case 'PLURAL':
    default:
      return 'gender-invariable';
  }
}

function generatePDFHTML(worksheetData: any, worksheet: any): string {
  const columns = worksheetData.columns || [];
  const exampleSentences = worksheetData.exampleSentences || [];

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${worksheetData.title || 'Sentence Builder Worksheet'}</title>
    <style>
        @page {
            margin: 20mm;
            size: A4;
        }
        
        body {
            font-family: 'Arial', sans-serif;
            line-height: 1.4;
            color: #333;
            margin: 0;
            padding: 0;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #6366f1;
            padding-bottom: 20px;
        }
        
        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 5px;
        }
        
        .instructions {
            background: #f8fafc;
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            font-size: 14px;
            color: #475569;
        }

        .gender-legend {
            background: #fefce8;
            border: 2px solid #facc15;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
        }

        .legend-title {
            font-weight: bold;
            font-size: 14px;
            color: #92400e;
            margin-bottom: 10px;
        }

        .legend-items {
            display: flex;
            gap: 20px;
            flex-wrap: wrap;
        }

        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
        }

        .legend-color {
            width: 20px;
            height: 20px;
            border-radius: 4px;
            border: 2px solid #d1d5db;
        }
        
        .grid-container {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 20px;
            margin: 30px 0;
        }
        
        .column {
            border: 2px solid #e2e8f0;
            border-radius: 8px;
            overflow: hidden;
            background: white;
        }
        
        .column-header {
            background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
            color: white;
            padding: 12px;
            font-weight: bold;
            font-size: 14px;
            text-align: center;
        }
        
        .column-content {
            padding: 15px;
        }
        
        .column-item {
            margin-bottom: 12px;
            padding: 8px;
            border-radius: 4px;
            background: #f8fafc;
            border-left: 3px solid #6366f1;
        }
        
        .column-item:last-child {
            margin-bottom: 0;
        }
        
        .item-text {
            font-weight: 600;
            color: #1e293b;
            font-size: 13px;
        }
        
        .item-translation {
            color: #64748b;
            font-style: italic;
            font-size: 12px;
            margin-top: 2px;
        }

        .item-group {
            font-size: 10px;
            color: #64748b;
            text-transform: capitalize;
            margin-top: 2px;
        }

        /* Gender-specific styling */
        .gender-masculine {
            background: #dbeafe !important;
            border-left-color: #3b82f6 !important;
        }

        .gender-masculine .item-text {
            color: #1e40af;
        }

        .gender-feminine {
            background: #fce7f3 !important;
            border-left-color: #ec4899 !important;
        }

        .gender-feminine .item-text {
            color: #be185d;
        }

        .gender-invariable {
            background: #f3f4f6 !important;
            border-left-color: #6b7280 !important;
        }

        .gender-invariable .item-text {
            color: #374151;
        }
        
        .examples-section {
            margin-top: 40px;
            page-break-inside: avoid;
        }
        
        .examples-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
            border-bottom: 2px solid #6366f1;
            padding-bottom: 5px;
        }
        
        .example-sentence {
            background: #f0f9ff;
            border: 1px solid #bae6fd;
            border-radius: 6px;
            padding: 12px;
            margin-bottom: 10px;
            font-size: 14px;
            color: #0c4a6e;
        }
        
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
            padding-top: 15px;
        }
        
        @media print {
            body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
            }
            
            .grid-container {
                grid-template-columns: repeat(2, 1fr);
                gap: 15px;
            }
            
            .column {
                break-inside: avoid;
                margin-bottom: 15px;
            }
            
            .examples-section {
                page-break-before: auto;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="title">${worksheetData.title || 'Sentence Builder Worksheet'}</div>
        <div class="subtitle">Subject: ${worksheetData.subject || 'Spanish'} | Topic: ${worksheetData.topic || 'General'}</div>
        <div class="subtitle">Level: ${worksheetData.difficulty || 'Intermediate'} | Time: ${worksheetData.estimatedTime || '30-45 minutes'}</div>
    </div>
    
    <div class="instructions">
        <strong>Instructions:</strong> ${worksheetData.instructions || 'Use the words and phrases from each column to build complete sentences.'}
    </div>

    <div class="gender-legend">
        <div class="legend-title">Gender Agreement Guide:</div>
        <div class="legend-items">
            <div class="legend-item">
                <div class="legend-color gender-masculine"></div>
                <span>Masculine (el/los)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color gender-feminine"></div>
                <span>Feminine (la/las)</span>
            </div>
            <div class="legend-item">
                <div class="legend-color gender-invariable"></div>
                <span>Invariable (same for all)</span>
            </div>
        </div>
    </div>
    
    <div class="grid-container">
        ${columns.map((column: any) => `
            <div class="column">
                <div class="column-header">
                    ${column.title}
                </div>
                <div class="column-content">
                    ${column.items.map((item: any) => {
                        const group = item.group || 'INVARIABLE';
                        const genderClass = getGenderClass(group);
                        return `
                        <div class="column-item ${genderClass}">
                            <div class="item-text">${item.text}</div>
                            <div class="item-translation">(${item.translation})</div>
                            <div class="item-group">${group.toLowerCase().replace('_', ' ')}</div>
                        </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `).join('')}
    </div>
    
    ${exampleSentences.length > 0 ? `
        <div class="examples-section">
            <div class="examples-title">Example Sentences</div>
            ${exampleSentences.map((sentence: string) => `
                <div class="example-sentence">${sentence}</div>
            `).join('')}
        </div>
    ` : ''}
    
    <div class="footer">
        Generated by LanguageGems • ${new Date().toLocaleDateString()}
    </div>
</body>
</html>`;
}
