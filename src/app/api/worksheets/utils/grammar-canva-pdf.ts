import PDFDocument from 'pdfkit';

interface GrammarWorksheet {
  title?: string;
  subject?: string;
  topic?: string;
  instructions?: string | string[];
  difficulty?: string;
  language?: string;
  metadata?: Record<string, any> | null;
  rawContent?: any;
  content?: any;
}

interface GrammarExerciseItem {
  verb?: string;
  infinitive?: string;
  pronouns?: string[];
  sentence?: string;
  text?: string;
  instruction?: string;
  items?: GrammarExerciseItem[];
  original?: string;
  incorrect?: string;
}

const PAGE_WIDTH = 595.28; // A4 width in points
const PAGE_HEIGHT = 841.89; // A4 height in points
const MARGIN = 50;

const SECTION_SPACING = 18;
const SMALL_SPACING = 10;
const LINE_HEIGHT = 16;

const EMPTY_LINE = '__________________________';

const sanitize = (value: unknown): string => {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.map((item) => sanitize(item)).join('\n');
  }
  const text = String(value)
    .replace(/<br\s*\/?>(\r?\n)?/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
  return text.trim();
};

const ensureSpace = (doc: PDFKit.PDFDocument, spaceNeeded: number) => {
  const pageHeight = PAGE_HEIGHT;
  const bottomMargin = MARGIN;
  if (doc.y + spaceNeeded > pageHeight - bottomMargin) {
    doc.addPage();
    doc.y = MARGIN;
  }
};

const drawStudentInfo = (doc: PDFKit.PDFDocument, y: number): number => {
  const boxWidth = 150;
  const boxHeight = 20;
  const spacing = 10;
  const startX = MARGIN;

  doc.rect(startX, y, boxWidth, boxHeight).stroke();
  doc.fontSize(9).text('Name:', startX + 5, y + 5, { width: boxWidth - 10 });

  doc.rect(startX + boxWidth + spacing, y, boxWidth, boxHeight).stroke();
  doc.text('Class:', startX + boxWidth + spacing + 5, y + 5, { width: boxWidth - 10 });

  doc.rect(startX + 2 * (boxWidth + spacing), y, boxWidth, boxHeight).stroke();
  doc.text('Teacher:', startX + 2 * (boxWidth + spacing) + 5, y + 5, { width: boxWidth - 10 });

  return y + boxHeight + SECTION_SPACING;
};

const drawFocusChips = (
  doc: PDFKit.PDFDocument,
  y: number,
  topic: string,
  language: string,
): number => {
  const chipHeight = 18;
  const chipPadding = 8;
  const spacing = 10;

  doc.fontSize(9);
  const topicWidth = doc.widthOfString(`Grammar Focus: ${topic}`) + chipPadding * 2;
  const languageWidth = doc.widthOfString(`Language: ${language}`) + chipPadding * 2;

  doc.rect(MARGIN, y, topicWidth, chipHeight).stroke();
  doc.text(`Grammar Focus: ${topic}`, MARGIN + chipPadding, y + 4);

  doc.rect(MARGIN + topicWidth + spacing, y, languageWidth, chipHeight).stroke();
  doc.text(`Language: ${language}`, MARGIN + topicWidth + spacing + chipPadding, y + 4);

  return y + chipHeight + SECTION_SPACING;
};

const drawInstructionBox = (doc: PDFKit.PDFDocument, y: number, instructions: string): number => {
  const boxWidth = PAGE_WIDTH - 2 * MARGIN;
  const padding = 10;
  const titleHeight = 16;
  
  // Calculate content height
  const contentWidth = boxWidth - 2 * padding;
  doc.fontSize(10);
  const textHeight = doc.heightOfString(instructions, { width: contentWidth });
  const boxHeight = titleHeight + textHeight + padding;

  doc.rect(MARGIN, y, boxWidth, boxHeight).stroke();
  
  doc.fontSize(11).fillColor('#000000').text('Instructions', MARGIN + padding, y + padding / 2);
  
  doc.moveTo(MARGIN, y + titleHeight).lineTo(MARGIN + boxWidth, y + titleHeight).stroke();
  
  doc.fontSize(10).text(instructions, MARGIN + padding, y + titleHeight + padding / 2, {
    width: contentWidth,
  });

  return y + boxHeight + SECTION_SPACING;
};

const drawExplanation = (doc: PDFKit.PDFDocument, explanation: string): void => {
  ensureSpace(doc, 60);
  doc.fontSize(12).fillColor('#000000').text('Grammar Explanation', MARGIN, doc.y);
  doc.moveDown(0.3);
  doc.fontSize(10).text(explanation, MARGIN, doc.y, {
    width: PAGE_WIDTH - 2 * MARGIN,
  });
  doc.moveDown(1);
};

const drawExamples = (doc: PDFKit.PDFDocument, examples: string[] = []): void => {
  if (!examples || examples.length === 0) return;

  ensureSpace(doc, 60);
  doc.fontSize(12).fillColor('#000000').text('Examples', MARGIN, doc.y);
  doc.moveDown(0.3);
  
  examples.forEach((example) => {
    doc.fontSize(10).text(`• ${sanitize(example)}`, MARGIN + 10, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN - 15,
    });
    doc.moveDown(0.3);
  });
  
  doc.moveDown(0.5);
};

const drawConjugationExercise = (doc: PDFKit.PDFDocument, items: GrammarExerciseItem[] = []) => {
  items.forEach((item, index) => {
    ensureSpace(doc, 80);
    const verb = sanitize(item.infinitive || item.verb);
    doc.fontSize(11).fillColor('#000000').text(`${index + 1}. ${verb}`, MARGIN, doc.y);
    doc.moveDown(0.3);

    (item.pronouns || []).forEach((pronoun) => {
      doc.fontSize(10).text(`${pronoun}: ${EMPTY_LINE}`, MARGIN + 20, doc.y, {
        width: PAGE_WIDTH - 2 * MARGIN - 20,
      });
      doc.moveDown(0.3);
    });
    doc.moveDown(0.5);
  });
};

const drawSentenceCompletion = (doc: PDFKit.PDFDocument, items: GrammarExerciseItem[] = []) => {
  items.forEach((item, index) => {
    ensureSpace(doc, 40);
    const sentence = sanitize(item.sentence || item.text);
    doc.fontSize(10).fillColor('#000000').text(`${index + 1}. ${sentence}`, MARGIN, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN,
    });
    doc.moveDown(0.5);
  });
};

const drawTransformation = (doc: PDFKit.PDFDocument, items: GrammarExerciseItem[] = []) => {
  items.forEach((item, index) => {
    ensureSpace(doc, 60);
    const instruction = sanitize(item.instruction);
    const original = sanitize(item.original || item.sentence);

    doc.rect(MARGIN, doc.y, PAGE_WIDTH - 2 * MARGIN, 2).fill('#CCCCCC');
    doc.moveDown(0.3);

    doc.fontSize(10).fillColor('#666666').text(`${index + 1}. ${instruction}`, MARGIN, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN,
    });
    doc.moveDown(0.2);
    doc.fontSize(10).fillColor('#000000').text(`Original: ${original}`, MARGIN + 10, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN - 20,
    });
    doc.moveDown(0.2);
    doc.text(`Transformed: ${EMPTY_LINE}`, MARGIN + 10, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN - 20,
    });
    doc.moveDown(0.7);
  });
};

const drawErrorCorrection = (doc: PDFKit.PDFDocument, items: GrammarExerciseItem[] = []) => {
  items.forEach((item, index) => {
    ensureSpace(doc, 50);
    const incorrect = sanitize(item.incorrect || item.sentence);

    doc.rect(MARGIN, doc.y, 18, 18).stroke();
    doc.fontSize(10).fillColor('#000000').text(`${index + 1}.`, MARGIN + 4, doc.y + 3);

    doc.fontSize(10).text(incorrect, MARGIN + 24, doc.y - 12, {
      width: PAGE_WIDTH - 2 * MARGIN - 20,
    });
    doc.fontSize(11).fillColor('#000000').text(`Correction: ${EMPTY_LINE}`, MARGIN + 24, doc.y);
    doc.moveDown(0.5);
  });
};

const drawExercises = (
  doc: PDFKit.PDFDocument,
  exercises: any[] = [],
) => {
  exercises.forEach((exercise, index) => {
    ensureSpace(doc, 100);
    const exerciseNumber = index + 1;
    const title = sanitize(exercise.title) || defaultExerciseTitle(exercise.type, exerciseNumber);
    const instructions = sanitize(exercise.instructions || defaultExerciseDescription(exercise.type));

    doc.fontSize(14).fillColor('#000000').text(`Exercise ${exerciseNumber}: ${title}`, MARGIN, doc.y);
    doc.moveDown(0.2);
    doc.fontSize(11).text(instructions, MARGIN, doc.y, {
      width: PAGE_WIDTH - 2 * MARGIN,
    });
    doc.moveDown(0.5);

    switch (exercise.type) {
      case 'conjugation':
        drawConjugationExercise(doc, exercise.items);
        break;
      case 'sentence-completion':
      case 'sentenceCompletion':
      case 'fill_in_the_blank':
        drawSentenceCompletion(doc, exercise.items);
        break;
      case 'transformation':
        drawTransformation(doc, exercise.items);
        break;
      case 'error-correction':
      case 'errorCorrection':
        drawErrorCorrection(doc, exercise.items);
        break;
      default:
        doc.fontSize(10).text('Exercise content not available.', MARGIN, doc.y);
    }

    doc.moveDown(1);
  });
};

const defaultExerciseTitle = (type: string, number: number): string => {
  switch (type) {
    case 'conjugation':
      return 'Verb Conjugation';
    case 'sentence-completion':
    case 'sentenceCompletion':
      return 'Sentence Completion';
    case 'transformation':
      return 'Sentence Transformation';
    case 'error-correction':
      return 'Error Correction';
    default:
      return `Exercise ${number}`;
  }
};

const defaultExerciseDescription = (type: string): string => {
  switch (type) {
    case 'conjugation':
      return 'Conjugate each verb for the pronouns provided.';
    case 'sentence-completion':
    case 'sentenceCompletion':
      return 'Complete each sentence carefully using the correct form.';
    case 'transformation':
      return 'Rewrite each sentence following the instructions.';
    case 'error-correction':
      return 'Identify and correct the mistakes in each sentence.';
    default:
      return 'Complete the tasks below.';
  }
};

export async function generateGrammarCanvaPdf(worksheet: GrammarWorksheet): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({
      size: 'A4',
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    });

    const buffers: Buffer[] = [];
    doc.on('data', buffers.push.bind(buffers));
    doc.on('end', () => resolve(Buffer.concat(buffers)));
    doc.on('error', reject);

    // Use Courier which is always embedded, no file system access needed
    doc.font('Courier').fontSize(10);
    doc.lineWidth(1);

    const page = {
      y: MARGIN,
      width: PAGE_WIDTH - 2 * MARGIN,
      height: PAGE_HEIGHT,
      margins: { top: MARGIN, bottom: MARGIN, left: MARGIN, right: MARGIN },
    };

    // Title
    const title = sanitize(worksheet.title) || 'Grammar Worksheet';
    const subject = sanitize(worksheet.subject) || '';
    const topic = sanitize(worksheet.topic) || '';
    const language = sanitize(worksheet.language) || 'French';
    const subtitle = [subject, topic].filter(Boolean).join(' • ');

    doc.fontSize(18).text(title, MARGIN, page.y, { align: 'center' });
    page.y = doc.y + 5;

    if (subtitle) {
      doc.fontSize(12).text(subtitle, MARGIN, page.y, { align: 'center' });
      page.y = doc.y + SECTION_SPACING;
    }

    // Student info
    page.y = drawStudentInfo(doc, page.y);

    // Focus chips
    if (topic) {
      page.y = drawFocusChips(doc, page.y, topic, language);
    }

    // Instructions
    const instructions = Array.isArray(worksheet.instructions)
      ? worksheet.instructions.map(sanitize).join('\n')
      : sanitize(worksheet.instructions || 'Complete all exercises carefully.');

    page.y = drawInstructionBox(doc, page.y, instructions);
    doc.y = page.y;

    // Explanation
    const rawContent = worksheet.rawContent || worksheet.content?.rawContent || {};
    const explanation = sanitize(rawContent.explanation || rawContent.grammar_explanation);
    if (explanation) {
      drawExplanation(doc, explanation);
    }

    // Examples
    const examples = rawContent.examples || [];
    if (examples.length > 0) {
      drawExamples(doc, examples);
    }

    // Exercises
    const exercises = rawContent.exercises || [];
    if (exercises.length > 0) {
      drawExercises(doc, exercises);
    }

    doc.end();
  });
}
