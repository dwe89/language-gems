import { jsPDF } from 'jspdf';
// jspdf-autotable is no longer used for this design, but we'll keep the import for reference.
// import autoTable from 'jspdf-autotable';

// Re-export the interface for broader usability
export interface StudentCredential {
  name: string;
  username: string;
  password: string;
  joinedDate: string;
}

/**
 * Generates a PDF document with individual "cards" for student login credentials.
 * The design is optimized for printing and cutting out.
 *
 * @param students - An array of StudentCredential objects.
 * @param className - The name of the class.
 * @returns A jsPDF document instance.
 */
export function generateStudentCredentialsPDF(
  students: StudentCredential[],
  className: string
): jsPDF {
  const doc = new jsPDF();
  
  // --- Constants for Layout ---
  const CARD_WIDTH = 80;
  const CARD_HEIGHT = 45;
  const MARGIN_LEFT = 20;
  const MARGIN_TOP = 45; // Start cards below the title block
  const HORIZONTAL_SPACING = 15;
  const VERTICAL_SPACING = 10;
  const CARDS_PER_ROW = 2;

  let currentX = MARGIN_LEFT;
  let currentY = MARGIN_TOP;

  // --- Header Section ---
  doc.setFontSize(22);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(50, 50, 50);
  doc.text(`LanguageGems - ${className} Student Credentials`, 20, 25);
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 20, 35);

  // --- Student Credentials Cards Loop ---
  students.forEach((student, index) => {
    // Check if we need to move to a new row or a new page
    if (index > 0) {
      if (index % CARDS_PER_ROW === 0) {
        // Start a new row
        currentX = MARGIN_LEFT;
        currentY += CARD_HEIGHT + VERTICAL_SPACING;
      } else {
        // Move to the next column
        currentX += CARD_WIDTH + HORIZONTAL_SPACING;
      }
    }

    // Check for a new page if we've reached the bottom
    if (currentY + CARD_HEIGHT > doc.internal.pageSize.height - 30) {
      doc.addPage();
      currentX = MARGIN_LEFT;
      currentY = MARGIN_TOP;
    }
    
    // --- Draw the Card Box with a dashed line for cutting ---
    doc.setDrawColor(0, 0, 0); // Black cut line
    doc.setLineWidth(0.5);
    doc.setLineDash([2, 2], 0); // Dashed pattern: 2 units on, 2 units off
    doc.roundedRect(currentX, currentY, CARD_WIDTH, CARD_HEIGHT, 3, 3, 'S'); // 'S' for Stroke only

    // --- Draw a solid border inside the dashed line for the card content area ---
    doc.setLineDash([], 0); // Reset to a solid line
    doc.setDrawColor(190, 190, 190); // Light gray border
    doc.setFillColor(245, 245, 245); // Light gray background
    doc.roundedRect(currentX + 1, currentY + 1, CARD_WIDTH - 2, CARD_HEIGHT - 2, 3, 3, 'FD');
    
    // --- Add Student Info to the Card ---
    doc.setTextColor(0, 0, 0); // Black text for info

    // Student Name
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(student.name, currentX + 5, currentY + 10);
    
    // Username
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text('Username:', currentX + 5, currentY + 22);
    doc.setFont('helvetica', 'normal');
    doc.text(student.username, currentX + 28, currentY + 22);

    // Password
    doc.setFont('helvetica', 'bold');
    doc.text('Password:', currentX + 5, currentY + 30);
    doc.setFont('helvetica', 'normal');
    doc.text(student.password, currentX + 28, currentY + 30);
    
    // Add the platform name at the top right of the card
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(100, 100, 100);
    doc.text('LanguageGems', currentX + CARD_WIDTH - 5, currentY + 8, { align: 'right' });
    
    // Add the login instruction at the bottom of the card - now in black
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0); // Changed to black
    doc.text('Login via student.languagegems.com', currentX + CARD_WIDTH / 2, currentY + CARD_HEIGHT - 3, { align: 'center' });
    
    doc.setTextColor(0, 0, 0); // Reset color for next text
  });
  
  // --- Page Numbering ---
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 35, doc.internal.pageSize.height - 10, { align: 'right' });
  }

  return doc;
}

/**
 * Generates and downloads the student credentials PDF.
 *
 * @param students - An array of StudentCredential objects.
 * @param className - The name of the class.
 */
export function downloadStudentCredentialsPDF(
  students: StudentCredential[],
  className: string
): void {
  const doc = generateStudentCredentialsPDF(students, className);
  const safeClassName = className.replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, '_');
  const fileName = `${safeClassName}_Student_Credentials.pdf`;
  doc.save(fileName);
}
