const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class IntelligentWorksheetGenerator {
    constructor() {
        this.pageSettings = {
            width: '8.5in',
            height: '11in',
            margin: '0.5in',
            contentHeight: '10in', // 11in - 1in margins
            footerHeight: '0.4in'
        };
        
        this.sectionHeights = {
            header: '1.5in',
            studentInfo: '0.6in',
            section: '2.2in', // Fixed height per section
            footer: '0.4in'
        };
    }

    generateWorksheetHTML(config) {
        const {
            title = "Spanish Present Tense Worksheet",
            sections = [],
            pageBreaks = []
        } = config;

        let html = this.getBaseTemplate();
        let content = '';
        let currentPageHeight = 0;
        let pageNumber = 1;

        // Start first page
        content += this.startPage(title, pageNumber);
        currentPageHeight += this.convertToPixels(this.sectionHeights.header);
        currentPageHeight += this.convertToPixels(this.sectionHeights.studentInfo);

        sections.forEach((section, index) => {
            const sectionHeight = this.convertToPixels(this.sectionHeights.section);
            const footerHeight = this.convertToPixels(this.sectionHeights.footer);
            const remainingHeight = this.convertToPixels('10in') - currentPageHeight;

            // Check if section fits on current page
            if (remainingHeight < (sectionHeight + footerHeight + 50)) { // 50px buffer
                // Close current page and start new one
                content += this.endPage(pageNumber);
                pageNumber++;
                content += this.startPage(title, pageNumber);
                currentPageHeight = this.convertToPixels(this.sectionHeights.header);
            }

            content += this.generateSection(section, index + 1);
            currentPageHeight += sectionHeight;
        });

        // Close final page
        content += this.endPage(pageNumber);

        return html.replace('{{CONTENT}}', content).replace('{{TITLE}}', title);
    }

    convertToPixels(measurement) {
        // Convert inches to pixels (96 DPI)
        if (measurement.includes('in')) {
            return parseFloat(measurement) * 96;
        }
        return parseFloat(measurement);
    }

    startPage(title, pageNumber) {
        return `
        <div class="page" data-page="${pageNumber}">
            <div class="header">
                <div class="gem-icon">💎</div>
                <h1>LANGUAGE GEMS</h1>
                <h2>${title}</h2>
                <div class="gem-icon">💎</div>
            </div>
            
            <div class="student-info">
                <div class="info-field">
                    <label>NAME:</label>
                    <div class="underline"></div>
                </div>
                <div class="info-field">
                    <label>DATE:</label>
                    <div class="underline"></div>
                </div>
                <div class="info-field">
                    <label>CLASS:</label>
                    <div class="underline"></div>
                </div>
            </div>
            
            <div class="content-area">
        `;
    }

    endPage(pageNumber) {
        return `
            </div>
            <div class="footer">
                <div class="gem-icon-small">💎</div>
                www.languagegems.com - Unlock the Gems of Language Learning
                <div class="gem-icon-small">💎</div>
                <div class="page-number">Page ${pageNumber}</div>
            </div>
        </div>
        `;
    }

    generateSection(section, number) {
        const { title, type, content } = section;
        
        return `
        <div class="section" data-type="${type}">
            <div class="section-header">
                <div class="section-number">${number}</div>
                <h3>${title}</h3>
            </div>
            <div class="section-content">
                ${this.generateSectionContent(type, content)}
            </div>
        </div>
        `;
    }

    generateSectionContent(type, content) {
        switch (type) {
            case 'fillBlanks':
                return this.generateFillBlanks(content);
            case 'multipleChoice':
                return this.generateMultipleChoice(content);
            case 'conjugationTable':
                return this.generateConjugationTable(content);
            case 'translation':
                return this.generateTranslation(content);
            case 'writing':
                return this.generateWritingSection(content);
            default:
                return `<p>${content}</p>`;
        }
    }

    generateFillBlanks(items) {
        return items.map((item, index) => 
            `<div class="exercise-item">
                <span class="number">${index + 1}.</span> 
                ${item.sentence.replace(/___/g, '<span class="blank"></span>')}
            </div>`
        ).join('');
    }

    generateMultipleChoice(items) {
        return items.map((item, index) => 
            `<div class="exercise-item">
                <p><span class="number">${index + 1}.</span> ${item.question}</p>
                <div class="choices">
                    ${item.options.map(option => `<label><input type="radio" name="q${index}"> ${option}</label>`).join('')}
                </div>
            </div>`
        ).join('');
    }

    generateConjugationTable(verbs) {
        return verbs.map(verb => `
            <div class="conjugation-table">
                <h4>${verb.infinitive}</h4>
                <table>
                    <tr>
                        <th>Pronoun</th>
                        <th>Conjugation</th>
                    </tr>
                    ${verb.pronouns.map(pronoun => `
                        <tr>
                            <td>${pronoun}</td>
                            <td class="fill-in"></td>
                        </tr>
                    `).join('')}
                </table>
            </div>
        `).join('');
    }

    generateTranslation(items) {
        return `
        <div class="two-column">
            <div class="column">
                <h4>Spanish</h4>
                ${items.map((item, index) => `
                    <div class="exercise-item">
                        <span class="number">${index + 1}.</span> ${item.spanish}
                    </div>
                `).join('')}
            </div>
            <div class="column">
                <h4>English</h4>
                ${items.map((item, index) => `
                    <div class="exercise-item">
                        <span class="number">${index + 1}.</span> 
                        <span class="blank-line"></span>
                    </div>
                `).join('')}
            </div>
        </div>
        `;
    }

    generateWritingSection(prompts) {
        return prompts.map((prompt, index) => `
            <div class="writing-prompt">
                <p><span class="number">${index + 1}.</span> ${prompt}</p>
                <div class="writing-lines">
                    ${Array(4).fill('<div class="writing-line"></div>').join('')}
                </div>
            </div>
        `).join('');
    }

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
            background: white;
            color: #333;
            line-height: 1.4;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0;
            background: white;
            padding: 0.5in;
            position: relative;
            page-break-after: always;
            display: flex;
            flex-direction: column;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .header {
            height: 1.5in;
            background: linear-gradient(135deg, #8B5CF6 0%, #7C3AED 100%);
            color: white;
            text-align: center;
            padding: 15px;
            margin: -0.5in -0.5in 0 -0.5in;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .header h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 2.2em;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            letter-spacing: 2px;
            margin-bottom: 5px;
        }
        
        .header h2 {
            font-size: 1.1em;
            font-weight: 600;
            opacity: 0.95;
        }
        
        .gem-icon {
            position: absolute;
            font-size: 2em;
            top: 50%;
            transform: translateY(-50%);
        }
        
        .gem-icon:first-child {
            left: 20px;
        }
        
        .gem-icon:last-child {
            right: 20px;
        }
        
        .student-info {
            height: 0.6in;
            display: flex;
            justify-content: space-around;
            align-items: center;
            margin: 15px 0;
            padding: 10px 0;
            border-bottom: 2px solid #E5E7EB;
            flex-shrink: 0;
        }
        
        .info-field {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .info-field label {
            font-weight: 700;
            color: #8B5CF6;
            font-size: 14px;
        }
        
        .underline {
            border-bottom: 2px solid #333;
            width: 200px;
            height: 20px;
        }
        
        .content-area {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 15px;
            overflow: hidden;
        }
        
        .section {
            height: 2.2in;
            border: 2px solid #8B5CF6;
            border-radius: 12px;
            padding: 15px;
            background: #FAFBFF;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 12px;
            flex-shrink: 0;
        }
        
        .section-number {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            width: 32px;
            height: 32px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 16px;
            margin-right: 12px;
            box-shadow: 0 2px 4px rgba(245, 158, 11, 0.3);
            flex-shrink: 0;
        }
        
        .section h3 {
            font-weight: 700;
            color: #374151;
            font-size: 16px;
        }
        
        .section-content {
            flex: 1;
            overflow: hidden;
            display: flex;
            flex-direction: column;
        }
        
        .exercise-item {
            margin: 6px 0;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .exercise-item .number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 20px;
            flex-shrink: 0;
        }
        
        .blank {
            border-bottom: 2px solid #333;
            display: inline-block;
            min-width: 80px;
            height: 20px;
            margin: 0 3px;
        }
        
        .blank-line {
            border-bottom: 2px solid #333;
            display: inline-block;
            width: 200px;
            height: 20px;
        }
        
        .two-column {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            height: 100%;
        }
        
        .column h4 {
            color: #8B5CF6;
            font-weight: 700;
            margin-bottom: 10px;
            text-align: center;
            border-bottom: 2px solid #E5E7EB;
            padding-bottom: 5px;
        }
        
        .conjugation-table {
            margin: 10px 0;
        }
        
        .conjugation-table h4 {
            color: #F59E0B;
            font-weight: 700;
            text-align: center;
            margin-bottom: 8px;
        }
        
        .conjugation-table table {
            width: 100%;
            border-collapse: collapse;
            font-size: 13px;
        }
        
        .conjugation-table th,
        .conjugation-table td {
            border: 1px solid #D1D5DB;
            padding: 6px;
            text-align: center;
        }
        
        .conjugation-table th {
            background: #F3F4F6;
            font-weight: 600;
            color: #374151;
        }
        
        .fill-in {
            background: #F9FAFB;
            min-height: 25px;
        }
        
        .writing-prompt {
            margin: 8px 0;
        }
        
        .writing-lines {
            margin: 8px 0 0 25px;
        }
        
        .writing-line {
            border-bottom: 1px solid #D1D5DB;
            height: 24px;
            margin: 3px 0;
        }
        
        .choices {
            margin-left: 25px;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
        }
        
        .choices label {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 13px;
            cursor: pointer;
        }
        
        .footer {
            height: 0.4in;
            text-align: center;
            font-weight: 600;
            color: #8B5CF6;
            font-size: 12px;
            border-top: 2px solid #E5E7EB;
            padding-top: 8px;
            margin-top: auto;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            flex-shrink: 0;
        }
        
        .gem-icon-small {
            font-size: 1em;
            margin: 0 10px;
        }
        
        .page-number {
            position: absolute;
            right: 20px;
            font-size: 11px;
            color: #6B7280;
        }
        
        @media print {
            body { background: white; }
            .page { 
                box-shadow: none; 
                margin: 0; 
                border: none;
                page-break-inside: avoid;
            }
        }
    </style>
</head>
<body>
{{CONTENT}}
</body>
</html>`;
    }

    async generatePDF(worksheetConfig, outputPath) {
        const html = this.generateWorksheetHTML(worksheetConfig);
        
        // Save HTML for debugging
        await fs.writeFile('debug-worksheet.html', html);
        
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdf = await page.pdf({
            path: outputPath,
            format: 'Letter',
            margin: {
                top: '0',
                right: '0',
                bottom: '0',
                left: '0'
            },
            printBackground: true,
            preferCSSPageSize: true
        });
        
        await browser.close();
        return pdf;
    }
}

module.exports = IntelligentWorksheetGenerator; 