const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

class WorksheetGenerator {
    constructor() {
        this.baseTemplate = this.getBaseTemplate();
    }

    // Base HTML template with styling
    getBaseTemplate() {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{TITLE}}</title>
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&display=swap');
        
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            background: linear-gradient(135deg, #f5f3f0 0%, #ede8e3 100%);
            color: #333;
            line-height: 1.4;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0 auto;
            background: white;
            padding: 0.5in;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
            page-break-after: always;
            border: 3px solid #8B5CF6;
            position: relative;
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
        }
        
        td {
            background: #F8FAFC;
        }
        
        @media print {
            body { background: white; }
            .page { box-shadow: none; margin: 0; border: none; }
        }
    </style>
</head>
<body>
{{CONTENT}}
</body>
</html>`;
    }

    // Generate worksheet content
    generateWorksheet(config) {
        const {
            title,
            pages,
            filename = 'worksheet'
        } = config;

        let content = '';
        
        pages.forEach((page, pageIndex) => {
            content += `
    <div class="page">
        <div class="header">
            <h1>${page.title || title}</h1>
        </div>
        
        <div class="name-date">
            <div>NAME: <span></span></div>
            <div>DATE: <span></span></div>
        </div>
        
        ${this.generateSections(page.sections)}
        
        <div class="footer">
            🌟 <span class="gem-accent">www.languagegems.com</span> 🌟
        </div>
    </div>`;
        });

        return this.baseTemplate
            .replace('{{TITLE}}', title)
            .replace('{{CONTENT}}', content);
    }

    // Generate sections for a page
    generateSections(sections) {
        return sections.map((section, index) => {
            return `
        <div class="section">
            <div class="section-number">${section.number || index + 1}</div>
            <h3>${section.title}</h3>
            ${section.instructions ? `<div style="font-style: italic; color: #6B7280; margin-bottom: 15px;">${section.instructions}</div>` : ''}
            ${this.generateSectionContent(section)}
        </div>`;
        }).join('');
    }

    // Generate content based on section type
    generateSectionContent(section) {
        switch (section.type) {
            case 'fill-blanks':
                return this.generateFillBlanks(section.exercises);
            case 'multiple-choice':
                return this.generateMultipleChoice(section.exercises);
            case 'table':
                return this.generateTable(section.table);
            case 'translation':
                return this.generateTranslation(section.exercises);
            case 'custom':
                return section.content;
            default:
                return section.content || '';
        }
    }

    // Generate fill-in-the-blanks exercises
    generateFillBlanks(exercises) {
        return exercises.map((exercise, index) => 
            `<div class="exercise-item"><span class="number">${index + 1}.</span> ${exercise}</div>`
        ).join('');
    }

    // Generate multiple choice exercises
    generateMultipleChoice(exercises) {
        return exercises.map((exercise, index) => 
            `<div class="exercise-item"><span class="number">${index + 1}.</span> ${exercise}</div>`
        ).join('');
    }

    // Generate table
    generateTable(tableConfig) {
        const { headers, rows, title } = tableConfig;
        
        let tableHTML = title ? `<h4 style="text-align: center; color: #8B5CF6; margin: 20px 0;">${title}</h4>` : '';
        
        tableHTML += '<table><tr>';
        headers.forEach(header => {
            tableHTML += `<th>${header}</th>`;
        });
        tableHTML += '</tr>';
        
        rows.forEach(row => {
            tableHTML += '<tr>';
            row.forEach(cell => {
                tableHTML += `<td>${cell}</td>`;
            });
            tableHTML += '</tr>';
        });
        
        tableHTML += '</table>';
        return tableHTML;
    }

    // Generate translation exercises
    generateTranslation(exercises) {
        return exercises.map((exercise, index) => 
            `<div class="exercise-item"><span class="number">${index + 1}.</span> ${exercise} <span class="blank" style="min-width: 200px;"></span></div>`
        ).join('');
    }

    // Generate PDF from HTML
    async generatePDF(htmlContent, filename) {
        console.log('🚀 Starting PDF generation...');
        
        try {
            const browser = await puppeteer.launch({
                headless: "new",
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            });
            
            const page = await browser.newPage();
            await page.setContent(htmlContent, { waitUntil: 'networkidle0' });
            
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
            
            await browser.close();
            
            const outputPath = path.join(__dirname, `${filename}.pdf`);
            fs.writeFileSync(outputPath, pdfBuffer);
            
            console.log(`✅ PDF saved to: ${outputPath}`);
            return outputPath;
            
        } catch (error) {
            console.error('❌ Error generating PDF:', error);
            throw error;
        }
    }

    // Save HTML file
    saveHTML(htmlContent, filename) {
        const outputPath = path.join(__dirname, `${filename}.html`);
        fs.writeFileSync(outputPath, htmlContent);
        console.log(`📄 HTML saved to: ${outputPath}`);
        return outputPath;
    }

    // Main method to create worksheet
    async createWorksheet(config) {
        const htmlContent = this.generateWorksheet(config);
        const filename = config.filename || 'worksheet';
        
        // Save HTML
        this.saveHTML(htmlContent, filename);
        
        // Generate PDF
        const pdfPath = await this.generatePDF(htmlContent, filename);
        
        return {
            html: path.join(__dirname, `${filename}.html`),
            pdf: pdfPath
        };
    }
}

module.exports = WorksheetGenerator;

// Example usage
if (require.main === module) {
    const generator = new WorksheetGenerator();
    
    // Example worksheet configuration
    const worksheetConfig = {
        title: "SPANISH PRESENT TENSE",
        filename: "spanish-present-tense-advanced",
        pages: [
            {
                title: "PRESENT TENSE",
                sections: [
                    {
                        number: 1,
                        title: "Fill in the blanks with the correct present tense form",
                        type: "fill-blanks",
                        exercises: [
                            "Yo <span class='blank'></span> (hablar) español.",
                            "Tú <span class='blank'></span> (comer) una manzana.",
                            "Él <span class='blank'></span> (vivir) en Madrid."
                        ]
                    },
                    {
                        number: 2,
                        title: "Complete the conjugation table",
                        type: "table",
                        table: {
                            title: "-AR VERBS (HABLAR - to speak)",
                            headers: ["PRONOUN", "VERB FORM", "ENGLISH"],
                            rows: [
                                ["Yo", "", "I speak"],
                                ["Tú", "", "You speak"],
                                ["Él/Ella", "", "He/She speaks"]
                            ]
                        }
                    }
                ]
            }
        ]
    };
    
    generator.createWorksheet(worksheetConfig)
        .then((result) => {
            console.log('🎉 Worksheet created successfully!');
            console.log(`📄 HTML: ${result.html}`);
            console.log(`📁 PDF: ${result.pdf}`);
        })
        .catch(console.error);
} 