// Canva-friendly simplified styles for worksheet HTML generation
// Removes gradients, complex shadows, and decorative elements that get rasterized

export const CANVA_FRIENDLY_STYLES = `
  /* Reset complex styling to simple, editable elements */
  
  body {
    font-family: 'Arial', sans-serif;
    color: #000;
    line-height: 1.6;
    background: #fff;
    margin: 0;
    padding: 0;
  }

  .worksheet-container {
    max-width: 18.46cm;
    margin: 0 auto;
    padding: 0.5in;
  }

  /* Simplified headers - no gradients */
  .worksheet-title {
    font-family: 'Arial', sans-serif;
    font-size: 24px;
    font-weight: 700;
    color: #000;
    margin: 0 0 8px 0;
    text-align: center;
    border-bottom: 3px solid #000;
    padding-bottom: 8px;
  }

  .worksheet-subtitle {
    font-size: 14px;
    color: #333;
    margin-bottom: 16px;
    text-align: center;
    font-weight: 400;
  }

  /* Simple student info - no fancy styling */
  .student-info {
    display: flex;
    gap: 20px;
    margin: 16px 0 20px 0;
    flex-wrap: wrap;
  }

  .info-field {
    flex: 1;
    min-width: 180px;
  }

  .info-label {
    font-size: 11px;
    font-weight: 600;
    color: #000;
    margin-bottom: 4px;
    text-transform: uppercase;
  }

  .info-line {
    border-bottom: 2px solid #000;
    height: 24px;
  }

  /* Simple instructions box - no gradients or shadows */
  .instructions {
    background: #fff;
    border: 2px solid #000;
    padding: 16px;
    margin-bottom: 20px;
  }

  .instructions-title {
    font-size: 13px;
    font-weight: 700;
    color: #000;
    text-transform: uppercase;
    margin-bottom: 8px;
  }

  /* Simple metadata chips */
  .worksheet-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin: 16px 0 20px 0;
  }

  .meta-chip {
    display: inline-block;
    background: #fff;
    border: 1px solid #000;
    padding: 8px 12px;
  }

  .meta-label {
    font-size: 10px;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 2px;
    display: block;
  }

  .meta-value {
    font-size: 12px;
    font-weight: 600;
    color: #000;
    display: block;
  }

  /* Simple explanation box */
  .grammar-explanation {
    background: #fff;
    border: 2px solid #000;
    padding: 16px;
    margin-bottom: 20px;
  }

  .grammar-explanation-title {
    font-size: 16px;
    font-weight: 600;
    color: #000;
    margin-bottom: 10px;
  }

  .grammar-explanation-icon {
    display: none; /* Hide icons for Canva */
  }

  .grammar-explanation-content {
    font-size: 13px;
    color: #000;
    line-height: 1.5;
  }

  /* Simple examples */
  .grammar-examples {
    background: #fff;
    border: 1px solid #000;
    padding: 16px;
    margin-bottom: 20px;
  }

  .grammar-examples-title {
    font-size: 15px;
    font-weight: 600;
    color: #000;
    margin-bottom: 12px;
  }

  .grammar-examples-icon {
    display: none; /* Hide icons */
  }

  .example-item {
    background: #fff;
    border: 1px solid #ccc;
    padding: 10px;
    margin-bottom: 8px;
  }

  .example-correct {
    color: #000;
    font-weight: 600;
    margin-bottom: 4px;
    font-size: 13px;
  }

  .example-incorrect {
    color: #666;
    text-decoration: line-through;
    margin-bottom: 4px;
    font-size: 13px;
  }

  .example-explanation {
    font-size: 11px;
    color: #666;
    font-style: italic;
  }

  /* Simple activity sections - no icons or gradients */
  .activity-section {
    margin-bottom: 24px;
    page-break-inside: avoid;
    break-inside: avoid;
  }

  .activity-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid #000;
  }

  .activity-icon {
    display: none; /* Hide decorative icons */
  }

  .activity-number {
    font-size: 20px;
    font-weight: 700;
    color: #000;
  }

  .activity-title {
    font-size: 18px;
    font-weight: 600;
    color: #000;
  }

  .activity-description {
    font-size: 13px;
    color: #333;
    margin-bottom: 16px;
  }

  /* Simple tables */
  .conjugation-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    border: 1px solid #000;
  }

  .conjugation-table th {
    background: #f5f5f5;
    color: #000;
    font-weight: 600;
    padding: 8px;
    text-align: left;
    border: 1px solid #000;
    font-size: 11px;
  }

  .conjugation-table td {
    padding: 8px;
    border: 1px solid #000;
    font-size: 12px;
  }

  .conjugation-input {
    width: 100%;
    border: none;
    border-bottom: 1px solid #000;
    padding: 4px 0;
    font-size: 12px;
    background: transparent;
  }

  /* Grid layouts simplified */
  .conjugation-grid,
  .sentence-completion-grid,
  .transformation-grid,
  .error-correction-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
    margin-bottom: 16px;
  }

  .conjugation-verb-block {
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .conjugation-verb-title {
    font-size: 14px;
    font-weight: 600;
    color: #000;
    margin-bottom: 8px;
    padding-bottom: 4px;
    border-bottom: 1px solid #000;
  }

  /* Simplified exercise items */
  .sentence-transformation {
    background: #fff;
    border: 1px solid #000;
    padding: 12px;
    margin-bottom: 10px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .transformation-original {
    font-size: 13px;
    color: #000;
    margin-bottom: 8px;
    padding: 8px;
    background: #f5f5f5;
    border: 1px solid #ccc;
  }

  .transformation-prompt {
    font-size: 11px;
    color: #000;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .transformation-answer {
    border-bottom: 1px solid #000;
    min-height: 26px;
    padding: 4px 0;
  }

  .error-correction-item {
    background: #fff;
    border: 1px solid #000;
    padding: 12px;
    margin-bottom: 10px;
    break-inside: avoid;
    page-break-inside: avoid;
  }

  .error-sentence {
    font-size: 13px;
    color: #000;
    margin-bottom: 6px;
  }

  .error-instruction {
    font-size: 11px;
    color: #000;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .error-correction {
    border-bottom: 1px solid #000;
    min-height: 26px;
    padding: 4px 0;
  }

  .sentence-completion-item {
    break-inside: avoid;
    page-break-inside: avoid;
    margin-bottom: 10px;
  }

  /* Print styles */
  @media print {
    body {
      background: #fff !important;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    .worksheet-container {
      max-width: 100% !important;
      margin: 0 !important;
      padding: 0.5in !important;
    }

    .activity-section {
      page-break-inside: avoid;
      break-inside: avoid;
    }

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
  }

  /* Remove all gradient backgrounds */
  .exercise-1 .activity-icon,
  .exercise-2 .activity-icon,
  .exercise-3 .activity-icon,
  .exercise-4 .activity-icon,
  .exercise-5 .activity-icon {
    display: none !important;
  }

  /* Ensure no shadows or complex effects */
  * {
    box-shadow: none !important;
    text-shadow: none !important;
  }

  /* Mobile responsiveness */
  @media (max-width: 768px) {
    .conjugation-grid,
    .sentence-completion-grid,
    .transformation-grid,
    .error-correction-grid {
      grid-template-columns: 1fr !important;
    }
  }
`;
