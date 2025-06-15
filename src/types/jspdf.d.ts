declare module 'jspdf' {
  import { jsPDF } from 'jspdf';
  export default jsPDF;
}

declare module 'jspdf-autotable' {
  import { jsPDF } from 'jspdf';
  
  interface AutoTableOptions {
    startY?: number;
    head?: any[][];
    body?: any[][];
    theme?: 'striped' | 'grid' | 'plain';
    styles?: any;
    headStyles?: any;
    alternateRowStyles?: any;
    margin?: any;
  }
  
  function autoTable(doc: jsPDF, options: AutoTableOptions): void;
  export default autoTable;
} 