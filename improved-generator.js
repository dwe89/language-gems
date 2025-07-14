const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

async function generateImprovedWorksheet() {
    console.log('🚀 Generating improved Language Gems worksheet...');
    
    try {
        // Read the improved HTML template
        const htmlPath = path.join(__dirname, 'improved-worksheet-template.html');
        const htmlContent = fs.readFileSync(htmlPath, 'utf8');
        
        console.log('📄 Improved template loaded successfully');
        
        // Launch Puppeteer with optimized settings
        const browser = await puppeteer.launch({
            headless: "new",
            args: [
                '--no-sandbox', 
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-accelerated-2d-canvas',
                '--no-first-run',
                '--disable-default-apps'
            ]
        });
        
        console.log('🌐 Browser launched');
        
        const page = await browser.newPage();
        
        // Set viewport for consistent rendering
        await page.setViewport({ width: 1200, height: 1600 });
        
        // Set content and wait for all resources
        await page.setContent(htmlContent, { 
            waitUntil: ['networkidle0', 'domcontentloaded'],
            timeout: 30000
        });
        
        // Wait for fonts to load
        await page.evaluateHandle('document.fonts.ready');
        
        console.log('📝 Content loaded and fonts ready');
        
        // Generate PDF with optimized settings for professional output
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            preferCSSPageSize: false,
            margin: {
                top: '0.4in',
                right: '0.4in',
                bottom: '0.4in',
                left: '0.4in'
            },
            displayHeaderFooter: false,
            scale: 0.95 // Slightly reduce scale to ensure good spacing
        });
        
        console.log('📄 High-quality PDF generated');
        
        // Save the PDF with timestamp
        const timestamp = new Date().toISOString().slice(0, 10);
        const outputPath = path.join(__dirname, `Language-Gems-Spanish-Present-Tense-${timestamp}.pdf`);
        fs.writeFileSync(outputPath, pdfBuffer);
        
        console.log(`✅ PDF saved to: ${outputPath}`);
        
        await browser.close();
        
        return outputPath;
        
    } catch (error) {
        console.error('❌ Error generating improved worksheet:', error);
        throw error;
    }
}

// Class for creating custom worksheets with improved layout
class ImprovedWorksheetGenerator {
    constructor() {
        this.brandingElements = {
            website: 'www.languagegems.com',
            slogan: 'Unlock the Gems of Language Learning',
            colors: {
                primary: '#8B5CF6',
                secondary: '#F59E0B',
                accent: '#7C3AED'
            }
        };
    }

    // Generate a custom worksheet with improved layout and branding
    async createCustomWorksheet(config) {
        const {
            title,
            subtitle = '',
            subject = 'Spanish',
            pages,
            filename = 'custom-worksheet'
        } = config;

        console.log(`🎨 Creating custom ${subject} worksheet: ${title}`);

        let htmlContent = this.getBaseTemplate();
        let pagesHTML = '';

        pages.forEach((pageConfig, index) => {
            pagesHTML += this.generatePage(pageConfig, index + 1, title);
        });

        htmlContent = htmlContent
            .replace('{{TITLE}}', title)
            .replace('{{SUBTITLE}}', subtitle)
            .replace('{{PAGES}}', pagesHTML);

        // Save HTML for preview
        const htmlPath = path.join(__dirname, `${filename}.html`);
        fs.writeFileSync(htmlPath, htmlContent);
        console.log(`📄 HTML preview saved: ${htmlPath}`);

        // Generate PDF
        const pdfPath = await this.generatePDF(htmlContent, filename);

        return {
            html: htmlPath,
            pdf: pdfPath
        };
    }

    getBaseTemplate() {
        // Return the improved template structure
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}} - Language Gems</title>
    ${this.getImprovedCSS()}
</head>
<body>
    {{PAGES}}
</body>
</html>`;
    }

    getImprovedCSS() {
        return `<style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&family=Poppins:wght@300;400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: white;
            color: #333;
            line-height: 1.5;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.6in;
            page-break-after: always;
            position: relative;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            background: linear-gradient(135deg, ${this.brandingElements.colors.primary} 0%, ${this.brandingElements.colors.accent} 100%);
            color: white;
            text-align: center;
            padding: 25px 20px;
            margin: -0.6in -0.6in 25px -0.6in;
            border-bottom: 4px solid ${this.brandingElements.colors.secondary};
            position: relative;
        }
        
        .logo-area {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 15px;
            margin-bottom: 10px;
            position: relative;
            z-index: 1;
        }
        
        .gem-icon {
            width: 40px;
            height: 40px;
            background: linear-gradient(135deg, ${this.brandingElements.colors.secondary} 0%, #D97706 100%);
            clip-path: polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%);
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
        }
        
        .brand-name {
            font-family: 'Poppins', sans-serif;
            font-weight: 700;
            font-size: 28px;
            letter-spacing: 2px;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }
        
        .footer {
            margin-top: auto;
            text-align: center;
            padding: 15px 0;
            border-top: 2px solid #E5E7EB;
            background: linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%);
            margin-left: -0.6in;
            margin-right: -0.6in;
            margin-bottom: -0.6in;
        }
        
        .footer-content {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
            font-weight: 600;
            color: ${this.brandingElements.colors.primary};
            font-size: 14px;
        }
        
        .slogan {
            font-style: italic;
            color: #6B7280;
            font-size: 12px;
            margin-top: 5px;
            font-weight: 400;
        }
        
        @media print {
            body { background: white; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page { margin: 0; box-shadow: none; }
        }
    </style>`;
    }

    generatePage(pageConfig, pageNumber, worksheetTitle) {
        return `
        <div class="page">
            <div class="header">
                <div class="logo-area">
                    <div class="gem-icon"></div>
                    <div class="brand-name">LANGUAGE GEMS</div>
                    <div class="gem-icon"></div>
                </div>
                <h1>${pageConfig.title || worksheetTitle}</h1>
            </div>
            
            <div class="student-info">
                <div class="info-field">
                    <strong>NAME:</strong> <span></span>
                </div>
                <div class="info-field">
                    <strong>DATE:</strong> <span></span>
                </div>
                <div class="info-field">
                    <strong>CLASS:</strong> <span></span>
                </div>
            </div>
            
            <div class="content">
                ${pageConfig.content || ''}
            </div>
            
            <div class="footer">
                <div class="footer-content">
                    <div class="gem-icon" style="width: 20px; height: 20px;"></div>
                    <span><strong>${this.brandingElements.website}</strong></span>
                    <div class="gem-icon" style="width: 20px; height: 20px;"></div>
                </div>
                <div class="slogan">${this.brandingElements.slogan}</div>
            </div>
        </div>`;
    }

    async generatePDF(htmlContent, filename) {
        console.log('🚀 Generating professional PDF...');
        
        try {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setViewport({ width: 1200, height: 1600 });
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            await page.evaluateHandle('document.fonts.ready');
            
            const pdfBuffer = await page.pdf({
                format: 'A4',
                printBackground: true,
                preferCSSPageSize: false,
                margin: {
                    top: '0.4in',
                    right: '0.4in',
                    bottom: '0.4in',
                    left: '0.4in'
                },
                scale: 0.95
            });
            
            await browser.close();
            
            const timestamp = new Date().toISOString().slice(0, 10);
            const outputPath = path.join(__dirname, `${filename}-${timestamp}.pdf`);
            fs.writeFileSync(outputPath, pdfBuffer);
            
            console.log(`✅ Professional PDF saved: ${outputPath}`);
            return outputPath;
            
        } catch (error) {
            console.error('❌ PDF generation failed:', error);
            throw error;
        }
    }
}

// Export the class and run the improved worksheet generation
module.exports = ImprovedWorksheetGenerator;

// If run directly, generate the improved worksheet
if (require.main === module) {
    generateImprovedWorksheet()
        .then((outputPath) => {
            console.log('🎉 Improved Language Gems worksheet created!');
            console.log(`📁 File location: ${outputPath}`);
            console.log('\n✨ Key improvements:');
            console.log('• Better spacing and layout management');
            console.log('• Enhanced Language Gems branding with slogan');
            console.log('• Improved footer positioning');
            console.log('• Professional print-ready formatting');
            console.log('• Consistent section breaks');
        })
        .catch((error) => {
            console.error('💥 Failed to generate improved worksheet:', error);
            process.exit(1);
        });
} 