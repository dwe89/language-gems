const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateWorksheetPDF() {
    console.log('🚀 Starting PDF generation...');
    
    try {
        // Read the HTML file
        const htmlPath = path.join(__dirname, 'spanish-present-tense-worksheet.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        console.log('📄 HTML file loaded successfully');
        
        // Launch Puppeteer
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        console.log('🌐 Browser launched');
        
        const page = await browser.newPage();
        
        // Set content and wait for fonts to load
        await page.setContent(htmlContent, { 
            waitUntil: 'networkidle0' 
        });
        
        console.log('📝 Content loaded in browser');
        
        // Generate PDF with high quality settings
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '0.5in',
                right: '0.5in',
                bottom: '0.5in',
                left: '0.5in'
            },
            preferCSSPageSize: true,
            displayHeaderFooter: false
        });
        
        console.log('📄 PDF generated successfully');
        
        // Save the PDF
        const outputPath = path.join(__dirname, 'Spanish-Present-Tense-Worksheet.pdf');
        fs.writeFileSync(outputPath, pdfBuffer);
        
        console.log(`✅ PDF saved to: ${outputPath}`);
        
        await browser.close();
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error);
        throw error;
    }
}

// Run the function
generateWorksheetPDF()
    .then((outputPath) => {
        console.log('🎉 Worksheet PDF generation complete!');
        console.log(`📁 File location: ${outputPath}`);
    })
    .catch((error) => {
        console.error('💥 Failed to generate PDF:', error);
        process.exit(1);
    }); 