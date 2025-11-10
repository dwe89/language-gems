export function getBaseStyles(): string {
  return `
        /* --- PREMIUM FONTS --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&display=swap');

        /* --- PREMIUM LANGUAGEGEMS THEME --- */
        :root {
            --font-heading: 'Poppins', sans-serif;
            --font-body: 'Inter', sans-serif;

            /* PREMIUM COLOR PALETTE */
            --brand-primary: #1E40AF;      /* Rich Blue */
            --brand-secondary: #3B82F6;    /* Bright Blue */
            --brand-accent: #F59E0B;       /* Vibrant Gold */
            --brand-accent-light: #FCD34D; /* Light Gold */
            --brand-success: #10B981;      /* Emerald Green */

            --color-text-heading: #0F172A;
            --color-text-body: #1F2937;
            --color-text-light: #6B7280;

            --color-surface: #FFFFFF;
            --color-card-bg: #F9FAFB;
            --color-border: #E5E7EB;
            --color-border-dark: #D1D5DB;

            /* PREMIUM SHADOWS */
            --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
            --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);

            --border-radius: 8px;
            --border-radius-sm: 6px;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: var(--font-body);
            line-height: 1.55;
            color: var(--color-text-body);
            width: 100%;
            margin: 0;
            padding: 0;
            background: linear-gradient(135deg, #EEF2FF 0%, #F8FAFC 50%, #E0F2FE 100%);
            font-size: 14px;
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
        }

        .page {
            max-width: 910px;
            margin: 0 auto;
            padding: 0 22px 24px 22px;
            background: white;
            border: 2px solid rgba(30, 64, 175, 0.16);
            border-radius: 18px;
            box-shadow: 0 20px 45px -20px rgba(30, 64, 175, 0.3);
            min-height: 100vh;
        }

        /* --- PREMIUM HEADER --- */
        .header {
            padding: 14px 18px 12px;
            margin: 0 0 16px 0;
            background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%);
            border: 2px solid var(--brand-primary);
            border-radius: var(--border-radius);
            position: relative;
            box-shadow: var(--shadow-md);
        }

        /* Ensure subsequent pages leave a clear gap under the header */
        .page + .page .header {
            /* Adds extra breathing room for print/page breaks */
            margin-top: 16px;
        }

        @media print {
            /* Use print-friendly units for PDFs */
            .page + .page .header {
                margin-top: 12pt;
            }
        }

        /* Inner header layout: left logo, center title, right meta */
        .header-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
        }

        .header-left {
            display: flex;
            align-items: center;
            gap: 10px;
        }

        .worksheet-logo {
            width: 32px;
            height: 32px;
            display: inline-block;
            object-fit: contain;
        }

        .header-brand {
            font-family: var(--font-heading);
            font-size: 16px;
            font-weight: 700;
            color: var(--brand-primary);
        }

        .header-right {
            text-align: right;
            font-size: 11px;
            color: var(--color-text-light);
        }

        .header-tagline {
            font-size: 11px;
            color: var(--brand-accent);
            font-weight: 500;
        }

        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 6px;
            background: linear-gradient(90deg, var(--brand-primary) 0%, var(--brand-accent) 100%);
            border-radius: var(--border-radius) var(--border-radius) 0 0;
        }

        .title {
            font-family: var(--font-heading);
            font-size: 26px;
            font-weight: 700;
            color: var(--brand-primary);
            margin-bottom: 6px;
            letter-spacing: -0.2px;
            text-align: center;
        }

        .subtitle {
            font-family: var(--font-heading);
            font-size: 14px;
            color: var(--brand-accent);
            margin-bottom: 12px;
            font-weight: 600;
            text-align: center;
        }

        .meta-info {
            display: flex;
            justify-content: center;
            gap: 12px;
            font-size: 12px;
            color: var(--color-text-body);
            flex-wrap: wrap;
        }

        .meta-info span {
            background: white;
            padding: 6px 12px;
            border-radius: var(--border-radius-sm);
            border: 1px solid var(--color-border);
            font-weight: 500;
        }

        /* --- PREMIUM CALLOUT BLOCKS --- */
        .instructions, .reading-passage {
            padding: 18px;
            margin-bottom: 20px;
            border-radius: var(--border-radius);
            border: 2px solid;
            background: var(--color-surface);
            box-shadow: var(--shadow-sm);
            position: relative;
        }

        .instructions::before, .reading-passage::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            width: 4px;
            height: 100%;
            border-radius: var(--border-radius) 0 0 var(--border-radius);
        }

        .instructions {
            border-color: var(--brand-primary);
            background: #EFF6FF;
        }

        .instructions::before {
            background: var(--brand-primary);
        }

        .reading-passage {
            border-color: var(--brand-success);
            background: #F0FDF4;
        }

        .reading-passage::before {
            background: var(--brand-success);
        }

        .reading-passage p:last-child {
            margin-bottom: 0;
        }

        /* --- PREMIUM SECTION STYLING --- */
        .section {
            margin-bottom: 18px;
            padding: 14px;
            background: white;
            border: 1px solid var(--color-border);
            border-radius: var(--border-radius);
            box-shadow: var(--shadow-sm);
            page-break-inside: avoid;
        }

        /* Worksheet top title in body (large, elegant) */
        .worksheet-container h1 {
            font-family: var(--font-heading);
            font-size: 26px;
            color: var(--color-text-heading);
            margin-bottom: 4px;
            letter-spacing: -0.4px;
        }

        .worksheet-container .student-info-header {
            display:flex;
            justify-content: flex-start;
            gap: 12px;
            margin-bottom: 12px;
        }

        /* Matching activity styles */
    .matching-grid { background: var(--color-card-bg); padding: 12px; border-radius: 8px; border: 1px solid var(--color-border); }
        .matching-row { display:flex; align-items:center; gap:12px; padding:6px 4px; border-bottom:1px dashed var(--color-border); }
        .matching-number { width: 20px; font-weight:700; color:var(--brand-primary); }
        .matching-word { flex:1; }
        .matching-input { width:40px; padding:6px; border:1px solid var(--color-border); border-radius:6px; }
        .matching-right .definition-row { padding:6px 4px; border-bottom:1px dashed var(--color-border); }

        /* Crossword grid styles */
        .crossword-grid { border-collapse: collapse; margin: 12px 0; width: 100%; aspect-ratio: 1 / 1; }
    .crossword-grid td { border:1px solid rgba(15,23,42,0.18); text-align:center; vertical-align:middle; position: relative; background: #F8FAFC; }
        .crossword-cell.black { background: #111827; }
        .crossword-cell-number { position: absolute; font-size:10px; color:#1f2937; top:2px; left:4px; }

        /* Exercise card visual polish */
    .exercise-section { background: linear-gradient(180deg, #ffffff 0%, #fbfdff 100%); padding: 12px 14px; border-radius: 10px; border:1px solid var(--color-border); box-shadow: var(--shadow-sm); margin-bottom: 12px; }

        .section-title {
            font-family: var(--font-heading);
            font-size: 17px;
            font-weight: 700;
            color: var(--brand-primary);
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 2px solid var(--brand-primary);
            display: flex;
            align-items: center;
            gap: 10px;
        }

        /* Replace emoji with a simple inline SVG 'book' icon (lucide-like) via data-uri */
        .section-title::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 20px;
            background-size: contain;
            background-repeat: no-repeat;
            background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%231E40AF' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'><path d='M3 19.5A2.5 2.5 0 0 1 5.5 17H21'/><path d='M3 5.5A2.5 2.5 0 0 1 5.5 3H21v18H5.5A2.5 2.5 0 0 1 3 19.5z'/></svg>");
        }

        /* --- PREMIUM QUESTION CARDS --- */
        .question, .question-compact {
            margin-bottom: 12px;
            padding: 12px;
            background: white;
            border: 1px solid var(--color-border);
            border-left: 3px solid var(--brand-primary);
            border-radius: var(--border-radius-sm);
            page-break-inside: avoid;
        }

        .question-compact {
            padding: 9px;
            margin-bottom: 8px;
        }

        .question-number {
            font-family: var(--font-heading);
            font-weight: 700;
            color: var(--brand-primary);
            margin-bottom: 4px;
            font-size: 14px;
        }

        .question-text {
            margin-bottom: 6px;
            font-size: 14px;
            line-height: 1.5;
            color: var(--color-text-body);
        }

        /* --- Enhanced Options/Inputs --- */
        .options {
            list-style: none;
            padding: 0;
            margin: 0;
            display: flex;
            flex-direction: column;
            gap: 6px;
        }

        .options li {
            padding: 7px 9px;
            background: var(--color-bg);
            border-radius: 6px;
            border: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 12px;
            cursor: pointer;
            transition: border-color 0.12s, background-color 0.12s;
        }
        .options li:hover {
            background: #f1f5f9;
            border-color: #94a3b8;
        }

        .options input[type="checkbox"],
        .tf-options input[type="checkbox"] {
            /* Custom styled checkboxes */
            appearance: none;
            -webkit-appearance: none;
            width: 18px;
            height: 18px;
            border: 2px solid #94a3b8;
            border-radius: 4px;
            margin: 0;
            cursor: pointer;
            position: relative;
            display: inline-block;
            vertical-align: middle;
            flex-shrink: 0;
        }
        
        .options input[type="checkbox"]:checked,
        .tf-options input[type="checkbox"]:checked {
            background-color: var(--brand-primary);
            border-color: var(--brand-primary);
        }
        
        .options input[type="checkbox"]:checked::after,
        .tf-options input[type="checkbox"]:checked::after {
            content: '✔';
            position: absolute;
            color: white;
            font-size: 12px;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        .tf-options {
            display: flex;
            gap: 16px;
            margin-top: 8px;
        }
        .tf-options label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 14px;
        }

        .answer-space {
            border-bottom: 1px solid var(--color-border-dark);
            min-height: 16px;
            margin: 8px 0;
        }

        .matching-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            margin-bottom: 6px;
            background: var(--color-bg);
            border-radius: 6px;
            font-size: 13px;
        }

        /* --- Grid Layouts --- */
        .questions-grid, .questions-grid-three, .true-false-grid, .vocabulary-grid, .multiple-choice-grid {
            display: grid;
            gap: 14px;
            margin-bottom: 18px;
        }
        .questions-grid, .true-false-grid, .vocabulary-grid, .multiple-choice-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        .questions-grid-three {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        /* Screen footer styling */
        .footer {
            margin-top: 14px;
            padding: 8px 14px;
            border-top: 1px solid var(--color-border);
            text-align: center;
            font-size: 10px;
            color: var(--color-text-light);
            background: transparent;
        }

        .footer a { color: var(--brand-primary); text-decoration: none; font-weight: 600; }

        /* --- PRINT STYLES --- */
        @media print {
            @page {
                margin: 0.4in 0.45in;
            }

            body {
                margin: 0;
                padding: 0;
                background: white !important;
                font-size: 10pt;
                line-height: 1.3;
            }

            .page {
                margin: 0 !important;
                padding: 0 !important;
                border: none !important;
                box-shadow: none !important;
                min-height: auto !important;
            }

            /* Add top padding for pages after the first to leave margin before content */
            .page + .page {
                padding-top: 0.4in !important;
            }

            .header {
                background: white !important;
                border: none !important;
                border-bottom: 1.5px solid #000 !important;
                padding: 10px 0 !important;
                margin-bottom: 14px !important;
                box-shadow: none !important;
            }

            .header::before {
                display: none !important;
            }

            .worksheet-logo {
                width: 28px !important;
                height: 28px !important;
            }

            .header-brand {
                font-size: 14pt !important;
                color: #000 !important;
            }

            .header-tagline {
                color: #333 !important;
                font-size: 9pt !important;
            }

            .meta-info span {
                background: white !important;
                border: 1px solid #999 !important;
                color: #000 !important;
            }

            .section {
                box-shadow: none !important;
                page-break-inside: avoid;
                border: 1px solid #ccc !important;
                background: white !important;
                padding: 11px !important;
                margin-bottom: 13px !important;
            }

            .section-title {
                border-bottom: 1.5px solid #000 !important;
                color: #000 !important;
                font-size: 11pt !important;
            }

            .question {
                border: 1px solid #ddd !important;
                border-left: 2px solid #000 !important;
                background: white !important;
                padding: 8px !important;
                margin-bottom: 7px !important;
            }

            .question-number {
                color: #000 !important;
                font-size: 9.5pt !important;
            }

            .question-text {
                font-size: 9.5pt !important;
                line-height: 1.35 !important;
            }

            /* Ensure footer prints at bottom of page */
            .footer {
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                padding: 6px 20px;
                border-top: 1px solid #e5e7eb;
                background: white;
                font-size: 9px;
                color: #6b7280;
            }
            .instructions, .reading-passage {
                border: 1px solid #999 !important;
                border-left: 2.5px solid #000 !important;
                background: white !important;
                padding: 10px !important;
            }

            .instructions::before, .reading-passage::before {
                display: none !important;
            }

            .answer-space {
                border-bottom: 1px solid #999 !important;
                min-height: 14px !important;
            }

            /* Make multiple choice questions much more compact for printing */
            .multiple-choice-grid {
                gap: 5px !important;
                margin-bottom: 10px !important;
            }

            .multiple-choice-grid .question {
                padding: 6px !important;
                margin-bottom: 4px !important;
                border: 1px solid #999 !important;
            }

            .multiple-choice-grid .question-number {
                font-size: 10pt !important;
                margin-bottom: 3px !important;
            }

            .multiple-choice-grid .question-text {
                font-size: 10pt !important;
                margin-bottom: 4px !important;
                line-height: 1.2 !important;
            }

            .multiple-choice-grid .options {
                gap: 3px !important;
            }

            .multiple-choice-grid .options li {
                padding: 3px 5px !important;
                font-size: 9pt !important;
                border: 1px solid #ccc !important;
                margin-bottom: 1px !important;
            }

            .multiple-choice-grid .options input[type="checkbox"] {
                width: 10px !important;
                height: 10px !important;
            }
            
            /* Ensure colors and text are print-friendly */
            * {
                color: #000 !important;
                background-color: transparent !important;
                box-shadow: none !important;
                text-shadow: none !important;
            }
        }
`;
}