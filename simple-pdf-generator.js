const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateWorksheetPDF() {
    console.log('🚀 Starting improved worksheet PDF generation...');
    
    try {
        // Read the HTML file
        const htmlPath = path.join(__dirname, 'improved-worksheet-template.html');
        
        if (!fs.existsSync(htmlPath)) {
            throw new Error(`HTML file not found: ${htmlPath}`);
        }
        
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        console.log('📄 HTML template loaded successfully');
        
        // Launch browser with simplified settings
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox'],
            timeout: 60000
        });
        
        console.log('🌐 Browser launched successfully');
        
        const page = await browser.newPage();
        
        // Set a reasonable timeout
        page.setDefaultTimeout(30000);
        
        // Load the content
        await page.setContent(htmlContent, { 
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        
        console.log('📝 Content loaded in browser');
        
        // Wait a bit for fonts to load
        await page.waitForTimeout(2000);
        
        // Generate PDF
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
        const timestamp = new Date().toISOString().slice(0, 10);
        const outputPath = path.join(__dirname, `Language-Gems-Improved-Worksheet-${timestamp}.pdf`);
        fs.writeFileSync(outputPath, pdfBuffer);
        
        console.log(`✅ PDF saved to: ${outputPath}`);
        
        await browser.close();
        console.log('🎉 Browser closed successfully');
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating PDF:', error.message);
        console.error('Stack trace:', error.stack);
        throw error;
    }
}

// Run the function
generateWorksheetPDF()
    .then((outputPath) => {
        console.log('\n🎉 Improved Language Gems worksheet PDF created!');
        console.log(`📁 File location: ${outputPath}`);
        console.log('\n✨ Key improvements made:');
        console.log('• Enhanced Language Gems branding with gem icons');
        console.log('• Added slogan: "Unlock the Gems of Language Learning"');
        console.log('• Better spacing and layout management');
        console.log('• Improved footer positioning on all pages');
        console.log('• Professional section breaks and writing areas');
        console.log('• Consistent typography and color scheme');
        console.log('• Student info section with NAME, DATE, CLASS fields');
        console.log('• Print-optimized formatting');
    })
    .catch((error) => {
        console.error('💥 Failed to generate improved worksheet PDF');
        process.exit(1);
    }); 