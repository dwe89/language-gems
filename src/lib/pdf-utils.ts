import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface StudentCredential {
  name: string;
  username: string;
  password: string;
  joinedDate: string;
}

export function generateStudentCredentialsPDF(
  students: StudentCredential[],
  className: string
): jsPDF {
  const doc = new jsPDF();
  
  // Set font and title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text(`${className} - Student Login Credentials`, 20, 25);
  
  // Add subtitle
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text(`Total Students: ${students.length}`, 20, 42);
  
  // Create the table
  autoTable(doc, {
    startY: 55,
    head: [['Student Name', 'Username', 'Password', 'Date Joined']],
    body: students.map(student => [
      student.name,
      student.username,
      student.password,
      new Date(student.joinedDate).toLocaleDateString()
    ]),
    theme: 'grid',
    styles: {
      fontSize: 10,
      cellPadding: 8,
    },
    headStyles: {
      fillColor: [79, 70, 229], // Indigo color
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [249, 250, 251], // Light gray
    },
    margin: { top: 55, right: 20, bottom: 20, left: 20 },
  });
  
  // Add footer with instructions
  const finalY = (doc as any).lastAutoTable.finalY || 100;
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text('Instructions for Students:', 20, finalY + 20);
  
  doc.setFont('helvetica', 'normal');
  const instructions = [
    '1. Go to the Language Gems website',
    '2. Click "Login" and use your username and password above',
    '3. You will be prompted to change your password on first login',
    '4. Keep this sheet safe until you have changed your password'
  ];
  
  instructions.forEach((instruction, index) => {
    doc.text(instruction, 25, finalY + 30 + (index * 7));
  });
  
  // Add page numbers if multiple pages
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 30, doc.internal.pageSize.height - 10);
  }
  
  return doc;
}

export function downloadStudentCredentialsPDF(
  students: StudentCredential[],
  className: string
): void {
  const doc = generateStudentCredentialsPDF(students, className);
  const fileName = `${className.replace(/[^a-zA-Z0-9]/g, '_')}_Student_Credentials.pdf`;
  doc.save(fileName);
} 