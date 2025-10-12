/**
 * AQA GCSE Spanish Workbook Generator
 * Generates complete workbook HTML from structured data
 */

import {
  generateCoverPage,
  generateSectionDivider,
  generateInstructionPage,
  generatePracticePage,
  generateModelAnswerPage,
  generateAnswerKeyPage,
  generateCompleteHTML,
  getSectionColor,
  getSectionTitle,
  type CoverPageData,
  type SectionDividerData,
  type PracticePageData,
  type ModelAnswerData,
  type AnswerKeyData,
} from './components';

export interface WorkbookData {
  cover: CoverPageData;
  sections: WorkbookSection[];
}

export interface WorkbookSection {
  number: number;
  title: string;
  subtitle?: string;
  pageRange?: string;
  pages: WorkbookPage[];
}

export type WorkbookPage =
  | { type: 'instruction'; heading: string; content: string; tips?: string[] }
  | { type: 'practice'; questionTitle: string; bullets: string[]; wordCount?: string; lineCount?: number }
  | { type: 'model'; modelNumber: number; context: string; answer: string; analysis: string }
  | { type: 'answer-key'; blocks: Array<{ title: string; answers: Array<{ number: number; text: string }> }> };

/**
 * Generate complete AQA GCSE Spanish Workbook HTML
 */
export function generateWorkbook(data: WorkbookData): string {
  const pages: string[] = [];
  let currentPageNumber = 1;

  // 1. Cover Page
  pages.push(generateCoverPage(data.cover));

  // 2. Generate each section
  for (const section of data.sections) {
    // Section Divider
    pages.push(
      generateSectionDivider({
        sectionNumber: section.number,
        title: section.title,
        subtitle: section.subtitle,
        pageRange: section.pageRange,
      })
    );

    // Section Pages
    const sectionColor = getSectionColor(section.number);
    const sectionTitle = section.title;

    for (const page of section.pages) {
      currentPageNumber++;

      switch (page.type) {
        case 'instruction':
          pages.push(
            generateInstructionPage(
              sectionColor,
              sectionTitle,
              currentPageNumber,
              page.heading,
              page.content,
              page.tips
            )
          );
          break;

        case 'practice':
          pages.push(
            generatePracticePage({
              sectionColor,
              sectionTitle,
              pageNumber: currentPageNumber,
              questionTitle: page.questionTitle,
              bullets: page.bullets,
              wordCount: page.wordCount,
              lineCount: page.lineCount,
            })
          );
          break;

        case 'model':
          pages.push(
            generateModelAnswerPage({
              sectionColor,
              sectionTitle,
              pageNumber: currentPageNumber,
              modelNumber: page.modelNumber,
              context: page.context,
              answer: page.answer,
              analysis: page.analysis,
            })
          );
          break;

        case 'answer-key':
          pages.push(
            generateAnswerKeyPage({
              pageNumber: currentPageNumber,
              blocks: page.blocks,
            })
          );
          break;
      }
    }
  }

  // 3. Combine all pages into complete HTML
  const content = pages.join('\n');
  return generateCompleteHTML(content, data.cover.title);
}

/**
 * Generate AQA GCSE Spanish Writing Exam Kit (Foundation Tier)
 * This is the specific implementation for the 50-page workbook
 */
export function generateAQASpanishWorkbook(): string {
  const workbookData: WorkbookData = {
    cover: {
      branding: 'LanguageGems Premium Resource',
      title: 'AQA GCSE Spanish Writing Exam Kit',
      subtitle: 'Foundation Tier (Paper 4) - Complete 50-Page Teacher & Student Workbook',
      examCode: 'AQA 8698/WF',
      pageCount: 50,
      price: '8.99',
      targetAudience: 'GCSE Spanish Teachers and Foundation Tier Students',
    },
    sections: [
      // SECTION 1: Introduction & Exam Strategy
      {
        number: 1,
        title: 'Introduction & Exam Strategy',
        subtitle: 'Pages 1-8',
        pageRange: 'Pages 1-8',
        pages: [
          {
            type: 'instruction',
            heading: 'Introduction',
            content: `
              <p>Welcome to the LanguageGems AQA GCSE Spanish Writing Exam Kit for Foundation Tier. This comprehensive 50-page workbook is designed to help teachers and students master the Foundation Writing Paper (Paper 4) of the AQA 8698 specification.</p>
              <h3>How to Use This Kit:</h3>
              <ul>
                <li><strong>Printable Workbook:</strong> Print double-sided for classroom use</li>
                <li><strong>Digital Access:</strong> Scan the QR code on page 50 for online resources</li>
                <li><strong>Teacher Resources:</strong> Answer keys and additional materials included</li>
              </ul>
            `,
          },
          {
            type: 'instruction',
            heading: 'Exam Blueprint',
            content: `
              <h3>Foundation Writing Paper: 60 minutes total</h3>
              <ul>
                <li><strong>Question 1:</strong> Photo Card Description (8 marks) - 5-6 sentences</li>
                <li><strong>Question 2:</strong> 40/50 Word Response (16 marks) - Address 4 bullet points</li>
                <li><strong>Question 3:</strong> English to Spanish Translation (10 marks) - 5 sentences</li>
                <li><strong>Question 4:</strong> 90-Word Structured Response (16 marks) - Choice of 2 questions</li>
              </ul>
            `,
          },
          {
            type: 'instruction',
            heading: 'The Foundation Mark Scheme (Q4 Focus)',
            content: `
              <h3>16-mark 90-word question breakdown:</h3>
              <ul>
                <li><strong>Content (10 marks):</strong> Must cover all 4 bullet points</li>
                <li><strong>Quality of Language (6 marks):</strong> Use of tenses, opinions, justification</li>
              </ul>
              <p><strong>Bullet point requirements:</strong> Past experiences, Present situation, Opinion with justification, Future plans</p>
            `,
          },
          {
            type: 'instruction',
            heading: 'Tense Toolkit for Foundation',
            content: `
              <h3>Key verbs for Present:</h3>
              <p>ser, estar, tener, ir, hacer</p>
              <h3>Preterite:</h3>
              <p>fui, estuve, tuve, fui, hice</p>
              <h3>Near Future:</h3>
              <p>voy a + infinitive</p>
            `,
            tips: [
              'Master these high-frequency verbs first - they appear in almost every exam question',
              'Practice conjugating in all three tenses until it becomes automatic',
            ],
          },
          {
            type: 'instruction',
            heading: 'Success Acronyms',
            content: `
              <h3>P.P.O.F. (Past, Present, Opinion, Future)</h3>
              <ul>
                <li><strong>Past:</strong> Describe experiences</li>
                <li><strong>Present:</strong> Current situation</li>
                <li><strong>Opinion:</strong> Give opinion with justification</li>
                <li><strong>Future:</strong> Future plans</li>
              </ul>
              <h3>J.O.E. (Justify Opinion with Example)</h3>
              <ul>
                <li><strong>Justify:</strong> Explain why</li>
                <li><strong>Opinion:</strong> State opinion</li>
                <li><strong>Example:</strong> Give example</li>
              </ul>
              <p><strong>Spanish starters:</strong> Creo que..., Pienso que..., Me gusta porque...</p>
            `,
            tips: [
              'Use P.P.O.F. for Question 4 to ensure you cover all time frames',
              'J.O.E. helps you add depth and justification to your opinions',
            ],
          },
        ],
      },

      // SECTION 2: Question 1 - Photo Card
      {
        number: 2,
        title: 'Question 1 - Photo Card (8 Marks)',
        subtitle: 'Describe & Opine',
        pages: [
          {
            type: 'instruction',
            heading: 'Q1 Walkthrough: Describe & Opine',
            content: `
              <p><strong>Task:</strong> 4 simple sentences describing the image + 1 sentence giving opinion on the topic.</p>
              <p><strong>Key vocabulary:</strong> hay, veo, colores, números</p>
            `,
            tips: [
              'Start with "En la foto hay..." or "En la foto veo..."',
              'Use numbers and colors to add detail',
              'End with an opinion: "Me gusta... porque..."',
            ],
          },
          {
            type: 'model',
            modelNumber: 1,
            context: 'Family gathering',
            answer: 'En la foto hay una familia grande. Veo a los abuelos, padres y tres hijos. Están en el jardín. Me gusta pasar tiempo con mi familia porque es divertido.',
            analysis: "Uses 'hay' for 'there is/are', 'veo' for 'I see', adjective agreement (familia grande), opinion with justification",
          },
          {
            type: 'practice',
            questionTitle: 'Practice 1: Una familia en el parque',
            bullets: [
              'Describe what you see in the photo',
              'Mention how many people',
              'Say where they are',
              'Give your opinion about families',
            ],
            lineCount: 6,
          },
        ],
      },

      // SECTION 3: Question 2 - 40-Word Response
      {
        number: 3,
        title: 'Question 2 - The 40-Word Response (16 Marks)',
        subtitle: 'Bullet Point Relay',
        pages: [
          {
            type: 'instruction',
            heading: 'Q2 Walkthrough: Bullet Point Relay',
            content: `
              <p><strong>Task:</strong> Address all 4 bullet points in 4-5 linked sentences (40-50 words)</p>
              <h3>Grammar Focus: Present Tense Mastery</h3>
              <p><strong>Regular verbs:</strong> hablar - hablo, comer - como, vivir - vivo</p>
              <p><strong>Irregular:</strong> ir - voy, hacer - hago, jugar - juego</p>
            `,
            tips: [
              'Address each bullet point in order',
              'Use connectors: y, pero, también, porque',
              'Aim for 10-12 words per bullet point',
            ],
          },
          {
            type: 'practice',
            questionTitle: 'Email to a friend about your town',
            bullets: [
              'Mention what there is in your town',
              'Say what you do there',
              'Ask about their town',
              'Invite them to visit',
            ],
            wordCount: '40-50 palabras',
            lineCount: 8,
          },
        ],
      },

      // SECTION 6: Answer Key (simplified for now)
      {
        number: 6,
        title: 'Answer Key & Teacher Resources',
        subtitle: 'Page 50',
        pageRange: 'Page 50',
        pages: [
          {
            type: 'answer-key',
            blocks: [
              {
                title: 'Section 2: Photo Card - Sample Answers',
                answers: [
                  { number: 1, text: 'En la foto hay una familia en el parque. Veo a un padre, una madre y dos hijos. La familia está feliz. Me gusta pasar tiempo en familia.' },
                ],
              },
            ],
          },
        ],
      },
    ],
  };

  return generateWorkbook(workbookData);
}

