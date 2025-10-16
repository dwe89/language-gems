import { jsPDF } from 'jspdf';
// jspdf-autotable is no longer used for this design.

// Re-export the interface for broader usability
export interface StudentCredential {
  name: string;
  username: string;
  password: string;
  joinedDate: string;
}

export interface PDFGenerationOptions {
  schoolCode?: string;
}

// --- CONSTANTS ---
// A4 Dimensions (approx) in mm: 210 x 297

const MARGIN_LEFT = 10;
const MARGIN_RIGHT = 10;
const MARGIN_TOP_START = 45; // Start cards below the title block
const MARGIN_BOTTOM = 15;

const PAGE_WIDTH = 210; // A4 Width in mm
const PAGE_HEIGHT = 297; // A4 Height in mm

// Desired layout: 2 columns x 4 rows = 8 cards
const CARDS_PER_ROW = 2;
const CARDS_PER_COLUMN = 4;
const CARDS_PER_PAGE = CARDS_PER_ROW * CARDS_PER_COLUMN; // 8 cards per page

const HORIZONTAL_SPACING = 5; // Spacing between columns
const VERTICAL_SPACING = 5; // Spacing between rows

// Available space for cards
const AVAILABLE_WIDTH = PAGE_WIDTH - MARGIN_LEFT - MARGIN_RIGHT;
const AVAILABLE_HEIGHT = PAGE_HEIGHT - MARGIN_TOP_START - MARGIN_BOTTOM;

// Calculate Card Dimensions (allowing for spacing)
const CARD_WIDTH = (AVAILABLE_WIDTH - HORIZONTAL_SPACING * (CARDS_PER_ROW - 1)) / CARDS_PER_ROW; // Approx 97.5mm
const CARD_HEIGHT = (AVAILABLE_HEIGHT - VERTICAL_SPACING * (CARDS_PER_COLUMN - 1)) / CARDS_PER_COLUMN; // Approx 65.5mm

// --- Brand Colors (Using LanguageGems Purple for accent) ---
const BRAND_PURPLE = [102, 63, 230];
const DARK_TEXT = [30, 30, 30];
const LIGHT_GRAY_BG = [250, 250, 250];

// --- Cut Line Styling (scissors-friendly dashed lines) ---
const CUT_LINE_COLOR = [100, 100, 100];
const CUT_LINE_WIDTH = 0.5;
const DASH_PATTERN = [3, 2]; // 3mm line, 2mm gap

/**
 * Draws a single student credential card onto the PDF document.
 */
function drawStudentCard(
  doc: jsPDF,
  student: StudentCredential,
  x: number,
  y: number,
  options?: PDFGenerationOptions
): void {
  const innerPadding = 5;
  const accentBarHeight = 4;

  // --- 1. Draw Dashed Cut Lines (First, for background coverage) ---
  doc.setDrawColor(CUT_LINE_COLOR[0], CUT_LINE_COLOR[1], CUT_LINE_COLOR[2]);
  doc.setLineWidth(CUT_LINE_WIDTH);
  doc.setLineDashPattern(DASH_PATTERN, 0);
  doc.rect(x, y, CARD_WIDTH, CARD_HEIGHT, 'S');
  doc.setLineDashPattern([], 0); // Reset to solid lines

  // --- 2. Card Background Fill ---
  doc.setFillColor(LIGHT_GRAY_BG[0], LIGHT_GRAY_BG[1], LIGHT_GRAY_BG[2]);
  doc.rect(x + CUT_LINE_WIDTH, y + CUT_LINE_WIDTH, CARD_WIDTH - 2 * CUT_LINE_WIDTH, CARD_HEIGHT - 2 * CUT_LINE_WIDTH, 'F');

  // --- 3. Brand Accent Line (Top of Card) ---
  doc.setFillColor(BRAND_PURPLE[0], BRAND_PURPLE[1], BRAND_PURPLE[2]);
  doc.rect(x, y, CARD_WIDTH, accentBarHeight, 'F');

  // --- 4. Add Student Info to the Card ---
  let cursorY = y + accentBarHeight + innerPadding;

  // Student Name (Prominent at top)
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(student.name, x + innerPadding, cursorY);
  cursorY += 8;

  // --- Credentials Block ---
  const labelX = x + innerPadding;
  const valueX = x + 35; // Aligns values nicely

  // Credential Labels
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);

  doc.text('Username:', labelX, cursorY);
  doc.text('Password:', labelX, cursorY + 7);

  // If School Code is present, insert it
  if (options?.schoolCode) {
    doc.text('School Code:', labelX, cursorY + 14);
  }

  // Actual Credentials (Larger and Highlighted)
  doc.setTextColor(BRAND_PURPLE[0], BRAND_PURPLE[1], BRAND_PURPLE[2]);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');

  doc.text(student.username, valueX, cursorY);
  doc.text(student.password, valueX, cursorY + 7);

  if (options?.schoolCode) {
    doc.text(options.schoolCode, valueX, cursorY + 14);
  }

  // --- Login Instructions (Bottom - Centered) ---
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);

  const instructionsY = y + CARD_HEIGHT - 8;
  doc.text('Go to: students.languagegems.com', x + CARD_WIDTH / 2, instructionsY, { align: 'center' });
  doc.text('Enter your credentials above to login', x + CARD_WIDTH / 2, instructionsY + 3.5, { align: 'center' });

  // Add scissors symbol for visual cut reference
  doc.setTextColor(CUT_LINE_COLOR[0], CUT_LINE_COLOR[1], CUT_LINE_COLOR[2]);
  doc.setFontSize(10);
  doc.text('✂', x - 3, y + 2); // Top Left
  doc.text('✂', x + CARD_WIDTH + 1, y + 2); // Top Right
  doc.text('✂', x - 3, y + CARD_HEIGHT + 1); // Bottom Left
  doc.text('✂', x + CARD_WIDTH + 1, y + CARD_HEIGHT + 1); // Bottom Right
}

/**
 * Generates a PDF document with individual "cards" for student login credentials.
 * The design is optimized for printing and cutting out, incorporating LanguageGems
 * branding and visual improvements for better readability and aesthetic.
 *
 * @param students - An array of StudentCredential objects.
 * @param className - The name of the class.
 * @param options - Optional PDF generation options (school code).
 * @returns A jsPDF document instance.
 */
export function generateStudentCredentialsPDF(
  students: StudentCredential[],
  className: string,
  options?: PDFGenerationOptions
): jsPDF {
  const doc = new jsPDF('p', 'mm', 'a4');

  // --- Header Section Setup ---
  const drawHeader = (doc: jsPDF, className: string, options?: PDFGenerationOptions) => {
    // Brand Title
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(BRAND_PURPLE[0], BRAND_PURPLE[1], BRAND_PURPLE[2]);
    doc.text(`LanguageGems Student Credentials`, MARGIN_LEFT, 20);

    // Class Name
    doc.setFontSize(14);
    doc.setTextColor(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]);
    doc.text(className, MARGIN_LEFT, 28);

    // School Code (if provided)
    if (options?.schoolCode) {
      doc.setFontSize(11);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(BRAND_PURPLE[0], BRAND_PURPLE[1], BRAND_PURPLE[2]);
      doc.text(`School Code: ${options.schoolCode}`, MARGIN_LEFT, 35);
    }

    // Generated Date
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')}`, MARGIN_LEFT, options?.schoolCode ? 40 : 35);
  };

  drawHeader(doc, className, options);

  // --- Student Credentials Cards Loop ---
  students.forEach((student, index) => {
    
    // CORRECTION: Check the global index to manage page breaks.
    // If this is not the first card (index > 0) AND it's the start of a new page block (index is a multiple of 8), add a new page.
    if (index > 0 && index % CARDS_PER_PAGE === 0) {
      doc.addPage();
      drawHeader(doc, className, options); // Redraw header on the new page
    }

    // Determine position on the current page
    const cardIndexOnPage = index % CARDS_PER_PAGE;
    const col = cardIndexOnPage % CARDS_PER_ROW;
    const row = Math.floor(cardIndexOnPage / CARDS_PER_ROW);

    // Calculate X and Y position
    const currentX = MARGIN_LEFT + col * (CARD_WIDTH + HORIZONTAL_SPACING);
    const currentY = MARGIN_TOP_START + row * (CARD_HEIGHT + VERTICAL_SPACING);

    // Draw the card using the dedicated helper function
    drawStudentCard(doc, student, currentX, currentY, options);
  });

  // --- Page Numbering ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, PAGE_WIDTH - MARGIN_RIGHT, PAGE_HEIGHT - 5, { align: 'right' });
  }

  return doc;
}

/**
 * Generates and downloads the student credentials PDF.
 *
 * @param students - An array of StudentCredential objects.
 * @param className - The name of the class.
 * @param options - Optional PDF generation options (school code).
 */
export function downloadStudentCredentialsPDF(
  students: StudentCredential[],
  className: string,
  options?: PDFGenerationOptions
): void {
  const doc = generateStudentCredentialsPDF(students, className, options);
  // Ensure the filename is safe and clean
  const safeClassName = className.replace(/[^a-zA-Z0-9\s]/g, '').trim().replace(/\s+/g, '_');
  const fileName = `${safeClassName}_LanguageGems_Credentials.pdf`;
  doc.save(fileName);
}