// Shared styles for worksheet HTML generation

export const PDF_BASE_STYLES = `
  body {
    font-family: 'Georgia', 'Times New Roman', serif;
    color: #000;
    line-height: 1.5;
    background: #fff;
    margin: 0;
    padding: 0;
  }

  .worksheet-container {
    max-width: 18.46cm;
    margin: 0 auto;
    padding: 0.25in;
  }
`;

export const TYPOGRAPHY_STYLES = `
  h1 {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 24pt;
    font-weight: 700;
    text-align: center;
    margin-bottom: 1.5rem;
    border-bottom: 3px solid #000;
    padding-bottom: 0.5rem;
  }

  h2 {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 18pt;
    font-weight: 600;
    margin-bottom: 1rem;
    border-bottom: 2px solid #000;
    padding-bottom: 0.25rem;
  }

  h3 {
    font-family: 'Helvetica', 'Arial', sans-serif;
    font-size: 14pt;
    font-weight: 600;
    margin-bottom: 0.5rem;
    color: #333;
  }

  p, li, div {
    font-size: 11pt;
  }

  ol, ul {
    padding-left: 24px;
    margin: 0 0 12px 0;
  }

  li {
    margin-bottom: 8px;
  }
`;

export const SPACING_STYLES = `
  :root {
    --spacing-xs: 4px;
    --spacing-sm: 8px;
    --spacing-md: 12px;
    --spacing-lg: 16px;
    --spacing-xl: 24px;
    --spacing-2xl: 32px;
    --heading-margin-bottom: 12px;
    --text-margin-bottom: 8px;
  }
`;

export const PRINT_STYLES = `
  @media print {
    body {
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
      color-adjust: exact;
    }

    .worksheet-container {
      max-width: 100% !important;
      box-shadow: none !important;
      margin: 0 !important;
      padding: 0.25in !important;
    }

    /* Prevent page breaks in exercises */
    .exercise-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    /* Ensure consistent font rendering */
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .vocab-list,
    .word-bank {
      background: #f8f9fa !important;
    }

    .crossword-cell.black {
      background: #000 !important;
    }

    .word-search-words ul li {
      background: #fff !important;
      border: 1px solid #ced4da !important;
    }

    .word-bank-item {
      background: #fff !important;
      border: 1px solid #ced4da !important;
    }

    .word-search-grid td {
      background: #fff !important;
      border: 1px solid #adb5bd !important;
    }

    .compact-section-title {
      color: #007bff !important;
      border-bottom-color: #007bff !important;
    }

    .compact-instructions {
      background: #e9ecef !important;
      border-left-color: #007bff !important;
    }

    .word-search-words h3 {
      color: #000 !important;
      border-bottom-color: #000 !important;
    }

    .words-title {
      color: #000 !important;
      border-bottom-color: #000 !important;
    }

    .wordsearch-crossword-layout {
      gap: 16px !important;
      margin: 16px 0 !important;
    }

    /* Ensure proper layout in PDF */
    .wordsearch-crossword-left,
    .wordsearch-crossword-right {
      page-break-inside: avoid !important;
    }

    .compact-section-title {
      font-size: 12pt !important;
      margin: 0 0 6px 0 !important;
      padding-bottom: 3px !important;
    }

    .compact-instructions {
      margin-bottom: 6px !important;
      font-size: 9pt !important;
      padding: 4px 8px !important;
    }
  }
`;