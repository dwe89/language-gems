const PerfectWorksheetGenerator = require('./perfect-worksheet-generator');

class FrenchWorksheetGenerator extends PerfectWorksheetGenerator {
    constructor() {
        super();
        
        // Override for A4 size (8.27" x 11.69")
        this.page = {
            width: 8.27,     // inches (A4)
            height: 11.69,   // inches (A4)
            margin: 0.5,     // inches
            contentWidth: 7.27,   // 8.27 - 1.0 margins
            contentHeight: 10.69, // 11.69 - 1.0 margins
            dpi: 96         // pixels per inch
        };
        
        // Adjusted zones for A4
        this.zones = {
            header: { start: 0, height: 1.1 },
            studentInfo: { start: 1.1, height: 0.4 },
            content: { start: 1.5, height: 9.9 }, // More content space for A4
            footer: { start: 11.4, height: 0.29 }
        };
        
        // French verb reference data
        this.verbTypes = {
            er: {
                name: "-ER Verbs",
                example: "parler (to speak)",
                endings: ["e", "es", "e", "ons", "ez", "ent"],
                conjugations: ["parle", "parles", "parle", "parlons", "parlez", "parlent"]
            },
            re: {
                name: "-RE Verbs", 
                example: "vendre (to sell)",
                endings: ["s", "s", "", "ons", "ez", "ent"],
                conjugations: ["vends", "vends", "vend", "vendons", "vendez", "vendent"]
            },
            ir: {
                name: "-IR Verbs",
                example: "finir (to finish)",
                endings: ["is", "is", "it", "issons", "issez", "issent"],
                conjugations: ["finis", "finis", "finit", "finissons", "finissez", "finissent"]
            }
        };
        
        this.pronouns = ["je", "tu", "il/elle", "nous", "vous", "ils/elles"];
    }

    generateReferenceTable() {
        return `
        <div class="reference-table">
            <h4>📚 French Present Tense Reference</h4>
            <div class="verb-types-grid">
                ${Object.values(this.verbTypes).map(verbType => `
                    <div class="verb-type-card">
                        <div class="verb-type-header">
                            <h5>${verbType.name}</h5>
                            <div class="example-verb">${verbType.example}</div>
                        </div>
                        <div class="conjugation-mini-table">
                            ${this.pronouns.map((pronoun, index) => `
                                <div class="conj-mini-row">
                                    <span class="pronoun">${pronoun}</span>
                                    <span class="conjugation">${verbType.conjugations[index]}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    generateFillBlanksAdvanced(items) {
        return `
        <div class="fill-blanks-advanced">
            <div class="instructions">Complete each sentence with the correct present tense form:</div>
            <div class="blanks-grid">
                ${items.map((item, index) => `
                    <div class="blank-item">
                        <span class="item-number">${index + 1}.</span>
                        <span class="sentence">${item.sentence}</span>
                        <span class="verb-hint">(${item.verb})</span>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    generateMatching(items) {
        return `
        <div class="matching-exercise">
            <div class="instructions">Match the subject pronoun with the correct verb form:</div>
            <div class="matching-columns">
                <div class="column-a">
                    <h6>Subject Pronouns</h6>
                    ${items.pronouns.map((pronoun, index) => `
                        <div class="match-item">
                            <span class="match-letter">${String.fromCharCode(65 + index)}.</span>
                            <span>${pronoun}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="column-b">
                    <h6>Verb Forms</h6>
                    ${items.verbs.map((verb, index) => `
                        <div class="match-item">
                            <span class="match-number">${index + 1}.</span>
                            <span>${verb}</span>
                        </div>
                    `).join('')}
                </div>
                <div class="answer-column">
                    <h6>Answers</h6>
                    ${items.pronouns.map((_, index) => `
                        <div class="answer-line">
                            ${String.fromCharCode(65 + index)} → ____
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>`;
    }

    generateTranslationFrench(items) {
        return `
        <div class="translation-french">
            <div class="instructions">Translate these sentences into French using present tense:</div>
            <div class="translation-items">
                ${items.map((item, index) => `
                    <div class="trans-item">
                        <div class="trans-prompt">
                            <span class="trans-num">${index + 1}.</span>
                            <span class="english-text">${item.english}</span>
                        </div>
                        <div class="french-line">
                            <span class="french-label">Français:</span>
                            <div class="answer-line-long">_________________________________</div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>`;
    }

    generateVerbPuzzle(puzzle) {
        return `
        <div class="verb-puzzle">
            <div class="puzzle-header">
                <h5>🧩 Verb Challenge</h5>
                <div class="instructions">${puzzle.instructions}</div>
            </div>
            <div class="puzzle-content">
                ${puzzle.type === 'crossword' ? this.generateMiniCrossword(puzzle.data) : 
                  puzzle.type === 'endings' ? this.generateEndingsChallenge(puzzle.data) :
                  this.generateWordScramble(puzzle.data)}
            </div>
        </div>`;
    }

    generateEndingsChallenge(data) {
        return `
        <div class="endings-challenge">
            <div class="challenge-grid">
                ${data.items.map((item, index) => `
                    <div class="challenge-item">
                        <span class="challenge-num">${index + 1}.</span>
                        <span class="verb-stem">${item.stem}</span>
                        <span class="plus">+</span>
                        <div class="ending-blank">____</div>
                        <span class="equals">=</span>
                        <span class="pronoun-hint">(${item.pronoun})</span>
                    </div>
                `).join('')}
            </div>
            <div class="endings-bank">
                <strong>Endings Bank:</strong> ${data.endings.join(', ')}
            </div>
        </div>`;
    }

    // Override the CSS to include French-specific styling
    getCSS() {
        const baseCSS = super.getCSS();
        return baseCSS + `
        
        /* French Worksheet Specific Styles */
        .reference-table {
            background: linear-gradient(135deg, #F0F9FF 0%, #E0F2FE 100%);
            border: 2px solid #0284C7;
            border-radius: 12px;
            padding: 16px;
            margin-bottom: 12px;
        }
        
        .reference-table h4 {
            color: #0284C7;
            font-size: 16px;
            font-weight: 700;
            margin-bottom: 12px;
            text-align: center;
        }
        
        .verb-types-grid {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 12px;
        }
        
        .verb-type-card {
            background: white;
            border: 1px solid #0284C7;
            border-radius: 8px;
            padding: 10px;
        }
        
        .verb-type-header h5 {
            color: #0284C7;
            font-size: 12px;
            font-weight: 700;
            margin-bottom: 3px;
        }
        
        .example-verb {
            font-size: 10px;
            color: #6B7280;
            font-style: italic;
            margin-bottom: 6px;
        }
        
        .conjugation-mini-table {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }
        
        .conj-mini-row {
            display: flex;
            justify-content: space-between;
            font-size: 9px;
        }
        
        .pronoun {
            color: #374151;
            font-weight: 600;
        }
        
        .conjugation {
            color: #0284C7;
            font-weight: 600;
        }
        
        .fill-blanks-advanced .instructions,
        .matching-exercise .instructions,
        .translation-french .instructions {
            font-size: 11px;
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            padding: 6px 0;
            border-bottom: 1px solid #E5E7EB;
        }
        
        .blanks-grid {
            display: flex;
            flex-direction: column;
            gap: 6px;
        }
        
        .blank-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
        }
        
        .item-number {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 20px;
        }
        
        .sentence {
            flex: 1;
        }
        
        .verb-hint {
            color: #6B7280;
            font-style: italic;
            font-size: 10px;
        }
        
        .matching-columns {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 15px;
        }
        
        .column-a h6, .column-b h6, .answer-column h6 {
            font-size: 10px;
            font-weight: 700;
            color: #0284C7;
            margin-bottom: 6px;
            text-align: center;
        }
        
        .match-item, .answer-line {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 10px;
            margin-bottom: 4px;
        }
        
        .match-letter, .match-number {
            font-weight: 700;
            color: #8B5CF6;
            min-width: 20px;
        }
        
        .answer-line {
            justify-content: center;
            font-weight: 600;
        }
        
        .translation-items {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }
        
        .trans-item {
            border-left: 3px solid #0284C7;
            padding-left: 10px;
        }
        
        .trans-prompt {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }
        
        .trans-num {
            font-weight: 600;
            color: #8B5CF6;
            min-width: 20px;
        }
        
        .english-text {
            font-size: 11px;
            color: #374151;
        }
        
        .french-line {
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .french-label {
            font-size: 10px;
            font-weight: 600;
            color: #0284C7;
            min-width: 50px;
        }
        
        .answer-line-long {
            border-bottom: 1px solid #374151;
            flex: 1;
            height: 16px;
        }
        
        .verb-puzzle {
            background: linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%);
            border: 2px solid #D97706;
            border-radius: 12px;
            padding: 12px;
        }
        
        .puzzle-header h5 {
            color: #D97706;
            font-size: 14px;
            font-weight: 700;
            margin-bottom: 6px;
        }
        
        .puzzle-header .instructions {
            font-size: 10px;
            color: #92400E;
            margin-bottom: 8px;
        }
        
        .challenge-grid {
            display: flex;
            flex-direction: column;
            gap: 6px;
            margin-bottom: 8px;
        }
        
        .challenge-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 11px;
        }
        
        .challenge-num {
            font-weight: 600;
            color: #D97706;
            min-width: 20px;
        }
        
        .verb-stem {
            font-weight: 600;
            color: #374151;
        }
        
        .plus, .equals {
            color: #D97706;
            font-weight: bold;
        }
        
        .ending-blank {
            border-bottom: 2px solid #374151;
            width: 40px;
            height: 16px;
        }
        
        .pronoun-hint {
            color: #6B7280;
            font-style: italic;
            font-size: 10px;
        }
        
        .endings-bank {
            font-size: 10px;
            color: #92400E;
            background: rgba(255, 255, 255, 0.7);
            padding: 6px;
            border-radius: 6px;
        }
        `;
    }

    // Override generateSectionContent to handle French-specific content types
    generateSectionContent(type, content) {
        switch (type) {
            case 'referenceTable':
                return this.generateReferenceTable();
            case 'fillBlanksAdvanced':
                return this.generateFillBlanksAdvanced(content);
            case 'matching':
                return this.generateMatching(content);
            case 'translationFrench':
                return this.generateTranslationFrench(content);
            case 'verbPuzzle':
                return this.generateVerbPuzzle(content);
            default:
                return super.generateSectionContent(type, content);
        }
    }
}

module.exports = FrenchWorksheetGenerator; 