const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class PerfectWorksheetGenerator {
    constructor() {
        // Exact measurements for Letter size (8.5" x 11")
        this.page = {
            width: 8.5,      // inches
            height: 11,      // inches
            margin: 0.5,     // inches
            contentWidth: 7.5,   // 8.5 - 1.0 margins
            contentHeight: 10,   // 11 - 1.0 margins
            dpi: 96         // pixels per inch
        };
        
        // Fixed layout zones (in inches from top)
        this.zones = {
            header: { start: 0, height: 1.2 },
            studentInfo: { start: 1.2, height: 0.5 },
            content: { start: 1.7, height: 8.0 }, // Main content area
            footer: { start: 9.7, height: 0.3 }
        };
        
        // Content distribution settings
        this.sectionsPerPage = {
            page1: 3,  // Fill blanks, Multiple choice, Conjugation
            page2: 2,  // Translation, Writing
            page3: 1   // Reference/answer key if needed
        };
    }

    async generateWorksheet(config) {
        const {
            title = "Spanish Present Tense Worksheet",
            sections = [],
            studentName = "",
            className = "",
            date = new Date().toLocaleDateString()
        } = config;

        // Distribute sections across pages intelligently
        const pages = this.distributeSections(sections);
        
        let html = this.getBaseHTML();
        let pageContent = '';
        
        pages.forEach((pageSections, pageIndex) => {
            pageContent += this.generatePage(
                title, 
                pageSections, 
                pageIndex + 1, 
                pages.length,
                { studentName, className, date }
            );
        });
        
        html = html.replace('{{PAGES}}', pageContent);
        
        // Generate PDF
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'Letter',
            printBackground: true,
            margin: {
                top: '0.5in',
                bottom: '0.5in',
                left: '0.5in',
                right: '0.5in'
            }
        });
        
        await browser.close();
        
        // Save PDF
        const filename = `Perfect-${title.replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
        await fs.writeFile(filename, pdfBuffer);
        
        console.log(`✅ Perfect worksheet generated: ${filename}`);
        return filename;
    }

    distributeSections(sections) {
        // Smart distribution: ensure each page has balanced content
        const pages = [];
        let currentPage = [];
        let sectionsOnPage = 0;
        
        sections.forEach((section, index) => {
            const maxSectionsForPage = pages.length === 0 ? 
                this.sectionsPerPage.page1 : 
                this.sectionsPerPage.page2;
                
            if (sectionsOnPage >= maxSectionsForPage) {
                pages.push([...currentPage]);
                currentPage = [];
                sectionsOnPage = 0;
            }
            
            currentPage.push(section);
            sectionsOnPage++;
        });
        
        if (currentPage.length > 0) {
            pages.push(currentPage);
        }
        
        return pages;
    }

    generatePage(title, sections, pageNum, totalPages, studentInfo) {
        const sectionHeight = this.zones.content.height / Math.max(sections.length, 1);
        
        return `
        <div class="page" data-page="${pageNum}">
            <!-- HEADER ZONE -->
            <div class="zone header-zone">
                <div class="gem-header">
                    <div class="gem-icon">💎</div>
                    <div class="header-text">
                        <h1>LANGUAGE GEMS</h1>
                        <h2>${title}</h2>
                    </div>
                    <div class="gem-icon">💎</div>
                </div>
            </div>
            
            <!-- STUDENT INFO ZONE -->
            <div class="zone student-zone">
                <div class="student-fields">
                    <div class="field">
                        <label>NAME:</label>
                        <div class="field-line">${studentInfo.studentName}</div>
                    </div>
                    <div class="field">
                        <label>DATE:</label>
                        <div class="field-line">${studentInfo.date}</div>
                    </div>
                    <div class="field">
                        <label>CLASS:</label>
                        <div class="field-line">${studentInfo.className}</div>
                    </div>
                </div>
            </div>
            
            <!-- CONTENT ZONE -->
            <div class="zone content-zone">
                ${sections.map((section, index) => 
                    this.generateSection(section, index + 1, sectionHeight)
                ).join('')}
            </div>
            
            <!-- FOOTER ZONE -->
            <div class="zone footer-zone">
                <div class="footer-content">
                    <div class="footer-left">
                        <span class="gem-small">💎</span>
                        www.languagegems.com - Unlock the Gems of Language Learning
                        <span class="gem-small">💎</span>
                    </div>
                    <div class="footer-right">
                        Page ${pageNum} of ${totalPages}
                    </div>
                </div>
            </div>
        </div>`;
    }

    generateSection(section, number, heightInches) {
        const { title, type, content } = section;
        
        return `
        <div class="section" style="height: ${heightInches}in;">
            <div class="section-header">
                <div class="section-number">${number}</div>
                <h3>${title}</h3>
            </div>
            <div class="section-body">
                ${this.generateSectionContent(type, content)}
            </div>
        </div>`;
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
                return this.generateWriting(content);
            default:
                return `<div class="custom-content">${content}</div>`;
        }
    }

    generateFillBlanks(items) {
        return `
        <div class="exercise-grid">
            ${items.map((item, index) => `
                <div class="exercise-row">
                    <span class="ex-number">${index + 1}.</span>
                    <span class="ex-text">${item.sentence.replace(/___/g, '<span class="blank-line">_______</span>')}</span>
                </div>
            `).join('')}
        </div>`;
    }

    generateMultipleChoice(items) {
        return `
        <div class="mc-grid">
            ${items.map((item, index) => `
                <div class="mc-question">
                    <div class="mc-prompt">${index + 1}. ${item.question}</div>
                    <div class="mc-options">
                        ${item.options.map(option => `
                            <div class="mc-option">
                                <span class="mc-circle">○</span> ${option}
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    generateConjugationTable(verbs) {
        return `
        <div class="conjugation-tables">
            ${verbs.map(verb => `
                <div class="conj-table">
                    <div class="verb-title">${verb.infinitive}</div>
                    <div class="conj-grid">
                        <div class="conj-row"><span>Yo</span><span class="conj-blank">_______</span></div>
                        <div class="conj-row"><span>Tú</span><span class="conj-blank">_______</span></div>
                        <div class="conj-row"><span>Él/Ella</span><span class="conj-blank">_______</span></div>
                        <div class="conj-row"><span>Nosotros</span><span class="conj-blank">_______</span></div>
                        <div class="conj-row"><span>Vosotros</span><span class="conj-blank">_______</span></div>
                        <div class="conj-row"><span>Ellos</span><span class="conj-blank">_______</span></div>
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    generateTranslation(items) {
        return `
        <div class="translation-grid">
            ${items.map((item, index) => `
                <div class="trans-row">
                    <div class="trans-number">${index + 1}.</div>
                    <div class="trans-source">${item.source}</div>
                    <div class="trans-arrow">→</div>
                    <div class="trans-target">_________________________</div>
                </div>
            `).join('')}
        </div>`;
    }

    generateWriting(prompts) {
        return `
        <div class="writing-section">
            ${prompts.map((prompt, index) => `
                <div class="writing-prompt">
                    <div class="prompt-text">${index + 1}. ${prompt}</div>
                    <div class="writing-lines">
                        ${Array(4).fill().map(() => '<div class="writing-line"></div>').join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    getBaseHTML() {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Perfect Language Gems Worksheet</title>
            <link href="https://fonts.googleapis.com/css2?family=Fredoka+One:wght@400&family=Open+Sans:wght@400;600;700&display=swap" rel="stylesheet">
            <style>
                ${this.getCSS()}
            </style>
        </head>
        <body>
            {{PAGES}}
        </body>
        </html>`;
    }

    getCSS() {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            font-size: 12px;
            line-height: 1.4;
            color: #1F2937;
            background: white;
        }
        
        .page {
            width: 8.5in;
            height: 11in;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            page-break-after: always;
            position: relative;
        }
        
        .page:last-child {
            page-break-after: avoid;
        }
        
        .zone {
            width: 100%;
            position: relative;
            flex-shrink: 0;
        }
        
        .header-zone {
            height: 1.2in;
            border-bottom: 3px solid #8B5CF6;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #F8F4FF 0%, #EDE9FE 100%);
        }
        
        .gem-header {
            display: flex;
            align-items: center;
            gap: 20px;
        }
        
        .gem-icon {
            font-size: 32px;
            filter: drop-shadow(2px 2px 4px rgba(139, 92, 246, 0.3));
        }
        
        .header-text h1 {
            font-family: 'Fredoka One', cursive;
            font-size: 28px;
            color: #8B5CF6;
            text-align: center;
            margin-bottom: 4px;
        }
        
        .header-text h2 {
            font-size: 16px;
            color: #6B7280;
            text-align: center;
            font-weight: 600;
        }
        
        .student-zone {
            height: 0.5in;
            background: #FAFBFF;
            border-bottom: 1px solid #E5E7EB;
            display: flex;
            align-items: center;
            padding: 0 20px;
        }
        
        .student-fields {
            display: flex;
            gap: 40px;
            width: 100%;
        }
        
        .field {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .field label {
            font-weight: 700;
            color: #8B5CF6;
            font-size: 11px;
        }
        
        .field-line {
            border-bottom: 1px solid #374151;
            min-width: 120px;
            height: 16px;
            font-size: 11px;
        }
        
        .content-zone {
            height: 8.0in;
            padding: 15px 20px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            overflow: hidden;
        }
        
        .section {
            border: 2px solid #8B5CF6;
            border-radius: 8px;
            padding: 12px;
            background: #FAFBFF;
            display: flex;
            flex-direction: column;
            overflow: hidden;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
            flex-shrink: 0;
        }
        
        .section-number {
            background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 12px;
            margin-right: 10px;
        }
        
        .section h3 {
            font-weight: 700;
            color: #374151;
            font-size: 14px;
        }
        
        .section-body {
            flex: 1;
            overflow: hidden;
        }
        
        .exercise-grid, .mc-grid, .translation-grid {
            display: flex;
            flex-direction: column;
            gap: 6px;
            height: 100%;
        }
        
        .exercise-row {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
        }
        
        .ex-number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 16px;
        }
        
        .blank-line {
            border-bottom: 1px solid #374151;
            display: inline-block;
            min-width: 60px;
            margin: 0 3px;
        }
        
        .mc-question {
            margin-bottom: 8px;
        }
        
        .mc-prompt {
            font-size: 11px;
            margin-bottom: 4px;
            font-weight: 600;
        }
        
        .mc-options {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .mc-option {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
        }
        
        .mc-circle {
            font-size: 12px;
            color: #8B5CF6;
        }
        
        .conjugation-tables {
            display: flex;
            gap: 15px;
            flex-wrap: wrap;
        }
        
        .conj-table {
            flex: 1;
            min-width: 120px;
        }
        
        .verb-title {
            font-weight: 700;
            color: #8B5CF6;
            text-align: center;
            margin-bottom: 6px;
            font-size: 12px;
        }
        
        .conj-grid {
            display: flex;
            flex-direction: column;
            gap: 3px;
        }
        
        .conj-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-size: 10px;
        }
        
        .conj-blank {
            border-bottom: 1px solid #374151;
            width: 60px;
            height: 14px;
        }
        
        .trans-row {
            display: grid;
            grid-template-columns: 20px 1fr 20px 1fr;
            gap: 8px;
            align-items: center;
            font-size: 11px;
        }
        
        .trans-number {
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .trans-arrow {
            text-align: center;
            color: #F59E0B;
            font-weight: bold;
        }
        
        .trans-target {
            border-bottom: 1px solid #374151;
            height: 16px;
        }
        
        .writing-section {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .writing-prompt {
            margin-bottom: 8px;
        }
        
        .prompt-text {
            font-size: 11px;
            font-weight: 600;
            margin-bottom: 4px;
        }
        
        .writing-lines {
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        
        .writing-line {
            border-bottom: 1px solid #D1D5DB;
            height: 16px;
        }
        
        .footer-zone {
            height: 0.3in;
            border-top: 2px solid #8B5CF6;
            background: linear-gradient(135deg, #F8F4FF 0%, #EDE9FE 100%);
            display: flex;
            align-items: center;
            padding: 0 20px;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
        }
        
        .footer-content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            font-size: 10px;
        }
        
        .footer-left {
            display: flex;
            align-items: center;
            gap: 6px;
            color: #6B7280;
            font-weight: 600;
        }
        
        .gem-small {
            font-size: 12px;
        }
        
        .footer-right {
            color: #8B5CF6;
            font-weight: 700;
        }
        
        @media print {
            .page {
                margin: 0;
                page-break-after: always;
            }
            
            .page:last-child {
                page-break-after: avoid;
            }
        }
        `;
    }
}

module.exports = PerfectWorksheetGenerator; 