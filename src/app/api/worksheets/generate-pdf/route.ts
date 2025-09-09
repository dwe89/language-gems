import { NextRequest, NextResponse } from 'next/server';
import puppeteer from 'puppeteer';

export async function POST(request: NextRequest) {
  let browser;
  
  try {
    const { html, filename } = await request.json();

    if (!html) {
      return NextResponse.json(
        { error: 'HTML content is required' },
        { status: 400 }
      );
    }

    // Launch puppeteer
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-accelerated-2d-canvas',
        '--no-first-run',
        '--no-zygote',
        '--single-process',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();
    
    // Set viewport for better rendering
    await page.setViewport({ width: 1200, height: 800 });
    
    // Set content and wait for it to load
    console.log('Setting HTML content for PDF generation...');
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 30000 
    });
    console.log('HTML content set, waiting for icons...');

    // Wait for Lucide icons to load and render
    try {
      await page.waitForFunction(() => {
        return (window as any).lucide !== undefined && (window as any).lucide.createIcons;
      }, { timeout: 5000 });
      
      // Execute the icon creation
      await page.evaluate(() => {
        if ((window as any).lucide && (window as any).lucide.createIcons) {
          (window as any).lucide.createIcons();
        }
      });
      
      // Wait a bit more for icons to render
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Lucide icons loaded successfully');
    } catch (iconError) {
      console.warn('Lucide icons failed to load, continuing with PDF generation:', iconError);
    }

    // Generate PDF
    console.log('Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });
    console.log('PDF generated successfully, size:', pdfBuffer.length);

    await browser.close();

    // Return PDF as response
    return new NextResponse(Buffer.from(pdfBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename || 'worksheet'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString(),
      },
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
