const puppeteer = require('puppeteer');
const fs = require('fs').promises;

class MasterWorksheetGenerator {
    constructor() {
        // Universal settings that work perfectly every time
        this.pageSettings = {
            format: 'A4',
            margin: {
                top: '0.5in',
                bottom: '0.5in', 
                left: '0.5in',
                right: '0.5in'
            }
        };
    }

    async generateWorksheet(config) {
        const html = this.createHTML(config);
        
        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        
        await page.setContent(html, { waitUntil: 'networkidle0' });
        
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: this.pageSettings.margin
        });
        
        await browser.close();
        
        const filename = `${config.title.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date().toISOString().split('T')[0]}.pdf`;
        await fs.writeFile(filename, pdfBuffer);
        
        console.log(`✅ Worksheet generated: ${filename}`);
        return filename;
    }

    createHTML(config) {
        return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>${config.title}</title>
            <link href="https://fonts.googleapis.com/css2?family=Open+Sans:wght@400;600;700&family=Fredoka+One&display=swap" rel="stylesheet">
            <style>
                ${this.getUniversalCSS()}
            </style>
        </head>
        <body>
            ${this.generatePages(config)}
        </body>
        </html>`;
    }

    generatePages(config) {
        return `
        <div class="page">
            <!-- Header -->
            <div class="header">
                <div class="logo">💎 LANGUAGE GEMS 💎</div>
                <h1>${config.title}</h1>
            </div>
            
            <!-- Student Info -->
            <div class="student-info">
                <div class="field">NAME: _________________________</div>
                <div class="field">DATE: _________________________</div>
                <div class="field">CLASS: _________________________</div>
            </div>
            
            <!-- Content Sections -->
            <div class="content">
                ${config.sections.map((section, index) => this.generateSection(section, index + 1)).join('')}
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <span>💎 www.languagegems.com - Unlock the Gems of Language Learning 💎</span>
            </div>
        </div>`;
    }

    generateSection(section, number) {
        return `
        <div class="section">
            <div class="section-header">
                <span class="section-number">${number}</span>
                <h3>${section.title}</h3>
            </div>
            <div class="section-content">
                ${this.generateContent(section)}
            </div>
        </div>`;
    }

    generateContent(section) {
        switch (section.type) {
            case 'reference':
                return this.generateReference(section.content);
            case 'fillBlanks':
                return this.generateFillBlanks(section.content);
            case 'matching':
                return this.generateMatching(section.content);
            case 'translation':
                return this.generateTranslation(section.content);
            case 'challenge':
                return this.generateChallenge(section.content);
            default:
                return `<div class="custom">${section.content}</div>`;
        }
    }

    generateReference(content) {
        if (!content.verbTypes) return '';
        
        return `
        <div class="reference-grid">
            ${Object.entries(content.verbTypes).map(([key, verb]) => `
                <div class="verb-card">
                    <h4>${verb.name}</h4>
                    <div class="example">${verb.example}</div>
                    <div class="conjugations">
                        ${content.pronouns.map((pronoun, i) => `
                            <div class="conj-row">
                                <span class="pronoun">${pronoun}</span>
                                <span class="conjugation">${verb.conjugations[i]}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>`;
    }

    generateFillBlanks(items) {
        return `
        <div class="fill-blanks">
            <div class="instructions">Complete each sentence with the correct form:</div>
            ${items.map((item, i) => `
                <div class="blank-row">
                    <span class="number">${i + 1}.</span>
                    <span class="sentence">${item.sentence}</span>
                    ${item.verb ? `<span class="hint">(${item.verb})</span>` : ''}
                </div>
            `).join('')}
        </div>`;
    }

    generateMatching(content) {
        return `
        <div class="matching">
            <div class="instructions">Match the items:</div>
            <div class="match-grid">
                <div class="column">
                    <h5>Column A</h5>
                    ${content.left.map((item, i) => `
                        <div class="match-item">${String.fromCharCode(65 + i)}. ${item}</div>
                    `).join('')}
                </div>
                <div class="column">
                    <h5>Column B</h5>
                    ${content.right.map((item, i) => `
                        <div class="match-item">${i + 1}. ${item}</div>
                    `).join('')}
                </div>
                <div class="column">
                    <h5>Answers</h5>
                    ${content.left.map((_, i) => `
                        <div class="answer">${String.fromCharCode(65 + i)} → ___</div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    generateTranslation(items) {
        return `
        <div class="translation">
            <div class="instructions">Translate into ${items[0].target || 'the target language'}:</div>
            ${items.map((item, i) => `
                <div class="trans-row">
                    <div class="source">${i + 1}. ${item.source}</div>
                    <div class="target-line">_____________________________________________</div>
                </div>
            `).join('')}
        </div>`;
    }

    generateChallenge(content) {
        return `
        <div class="challenge">
            <div class="challenge-header">🧩 ${content.title}</div>
            <div class="instructions">${content.instructions}</div>
            <div class="challenge-content">
                ${content.items.map((item, i) => `
                    <div class="challenge-item">
                        <span class="number">${i + 1}.</span>
                        <span class="stem">${item.stem}</span>
                        <span class="plus">+</span>
                        <span class="blank">____</span>
                        <span class="equals">=</span>
                        <span class="hint">(${item.hint})</span>
                    </div>
                `).join('')}
            </div>
            ${content.bank ? `<div class="word-bank"><strong>Word Bank:</strong> ${content.bank.join(', ')}</div>` : ''}
        </div>`;
    }

    getUniversalCSS() {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Open Sans', sans-serif;
            font-size: 14px;
            line-height: 1.5;
            color: #1F2937;
            background: white;
        }
        
        .page {
            width: 100%;
            min-height: 100vh;
            padding: 20px;
            display: flex;
            flex-direction: column;
        }
        
        .header {
            text-align: center;
            border-bottom: 3px solid #8B5CF6;
            padding: 15px 0;
            margin-bottom: 20px;
            background: linear-gradient(135deg, #F8F4FF, #EDE9FE);
        }
        
        .logo {
            font-family: 'Fredoka One', cursive;
            font-size: 20px;
            color: #8B5CF6;
            margin-bottom: 8px;
        }
        
        .header h1 {
            font-size: 18px;
            color: #374151;
            font-weight: 600;
        }
        
        .student-info {
            display: flex;
            justify-content: space-around;
            margin: 15px 0 25px 0;
            padding: 12px;
            background: #FAFBFF;
            border: 1px solid #E5E7EB;
            border-radius: 8px;
        }
        
        .field {
            font-size: 13px;
            font-weight: 600;
            color: #8B5CF6;
        }
        
        .content {
            flex: 1;
            display: flex;
            flex-direction: column;
            gap: 20px;
        }
        
        .section {
            border: 2px solid #8B5CF6;
            border-radius: 12px;
            padding: 18px;
            background: #FAFBFF;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .section-number {
            background: linear-gradient(135deg, #F59E0B, #D97706);
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
        }
        
        .section h3 {
            font-size: 16px;
            color: #374151;
            font-weight: 700;
        }
        
        .reference-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 15px;
        }
        
        .verb-card {
            background: white;
            border: 2px solid #0284C7;
            border-radius: 8px;
            padding: 12px;
        }
        
        .verb-card h4 {
            color: #0284C7;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 4px;
        }
        
        .example {
            font-size: 12px;
            color: #6B7280;
            font-style: italic;
            margin-bottom: 8px;
        }
        
        .conj-row {
            display: flex;
            justify-content: space-between;
            font-size: 12px;
            margin-bottom: 2px;
        }
        
        .pronoun {
            color: #374151;
            font-weight: 600;
        }
        
        .conjugation {
            color: #0284C7;
            font-weight: 600;
        }
        
        .instructions {
            font-size: 13px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .fill-blanks .blank-row {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-bottom: 8px;
            font-size: 13px;
        }
        
        .number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 25px;
        }
        
        .sentence {
            flex: 1;
        }
        
        .hint {
            color: #6B7280;
            font-style: italic;
            font-size: 12px;
        }
        
        .match-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 20px;
        }
        
        .column h5 {
            font-size: 13px;
            font-weight: 700;
            color: #0284C7;
            margin-bottom: 8px;
            text-align: center;
        }
        
        .match-item, .answer {
            font-size: 12px;
            margin-bottom: 6px;
            padding: 4px 0;
        }
        
        .answer {
            text-align: center;
            font-weight: 600;
        }
        
        .translation .trans-row {
            margin-bottom: 12px;
        }
        
        .source {
            font-size: 13px;
            margin-bottom: 4px;
        }
        
        .target-line {
            border-bottom: 1px solid #374151;
            height: 20px;
        }
        
        .challenge {
            background: linear-gradient(135deg, #FEF3C7, #FDE68A);
            border: 2px solid #D97706;
            border-radius: 12px;
            padding: 15px;
        }
        
        .challenge-header {
            font-size: 16px;
            font-weight: 700;
            color: #D97706;
            margin-bottom: 8px;
        }
        
        .challenge-item {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
            font-size: 13px;
        }
        
        .stem {
            font-weight: 600;
            color: #374151;
        }
        
        .plus, .equals {
            color: #D97706;
            font-weight: bold;
        }
        
        .blank {
            border-bottom: 2px solid #374151;
            min-width: 50px;
            height: 18px;
            display: inline-block;
        }
        
        .word-bank {
            margin-top: 10px;
            font-size: 12px;
            background: rgba(255,255,255,0.8);
            padding: 8px;
            border-radius: 6px;
        }
        
        .footer {
            text-align: center;
            margin-top: 20px;
            padding: 10px;
            border-top: 2px solid #8B5CF6;
            background: linear-gradient(135deg, #F8F4FF, #EDE9FE);
            font-size: 11px;
            color: #6B7280;
            font-weight: 600;
        }
        
        @media print {
            .page {
                page-break-after: always;
            }
            
            .page:last-child {
                page-break-after: avoid;
            }
        }
        `;
    }
}

// Simple function to generate any worksheet
async function generateWorksheet(config) {
    const generator = new MasterWorksheetGenerator();
    return await generator.generateWorksheet(config);
}

module.exports = { MasterWorksheetGenerator, generateWorksheet }; 