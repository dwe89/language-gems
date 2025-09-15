export function getBaseStyles(): string {
  return `
        /* --- Import a playful and readable font --- */
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');

        /* --- LanguageGems Theme Variables --- */
        :root {
            --font-primary: 'Poppins', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            
            /* A vibrant, educational-themed color palette */
            --brand-primary: #6d28d9; /* Deep Violet */
            --brand-secondary: #10b981; /* Bright Emerald */
            --brand-accent: #f59e0b;  /* Warm Amber */
            
            --color-text-heading: #1e293b; /* Dark Slate */
            --color-text-body: #334155;   /* Medium Slate */
            --color-text-light: #64748b;  /* Light Slate */
            
            --color-bg: #f8fafc;        /* Very light gray background */
            --color-surface: #ffffff;    /* White for cards and surfaces */
            --color-border: #e2e8f0;     /* Soft border color */
            
            --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
            --border-radius: 8px; /* Softer, more modern corners */
        }

        body {
            font-family: var(--font-primary);
            line-height: 1.6;
            color: var(--color-text-body);
            width: 100%;
            margin: 0;
            padding: 24px;
            background: var(--color-bg);
            font-size: 15px;
            -webkit-font-smoothing: antialiased; /* Smoother font rendering */
        }

        /* --- Header: Clean, modern, and branded --- */
        .header {
            text-align: center;
            border-bottom: 2px solid var(--brand-primary);
            padding-bottom: 16px;
            margin-bottom: 32px;
        }

        .title {
            font-size: 28px;
            font-weight: 700;
            color: var(--color-text-heading);
            margin-bottom: 4px;
        }

        .subtitle {
            font-size: 16px;
            color: var(--color-text-light);
            margin-bottom: 12px;
            font-weight: 500;
        }

        .meta-info {
            display: flex;
            justify-content: center;
            gap: 24px;
            font-size: 13px;
            color: var(--color-text-light);
        }

        /* --- Custom Callout Blocks --- */
        .instructions, .reading-passage {
            padding: 16px 20px;
            margin-bottom: 24px;
            border-radius: var(--border-radius);
            border-left: 4px solid;
            background: var(--color-surface);
        }

        .instructions {
            border-color: var(--brand-primary);
            background-color: #f5f3ff; /* Light violet background */
        }

        .reading-passage {
            border-color: var(--brand-secondary);
            background-color: #f0fdfa; /* Light emerald background */
        }
        
        .reading-passage p:last-child {
            margin-bottom: 0;
        }

        /* --- Section Styling --- */
        .section {
            margin-bottom: 12px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--color-text-heading);
            margin-bottom: 10px;
            padding-bottom: 6px;
            border-bottom: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        /* A little "gem" icon for branding */
        .section-title::before {
            content: '💎';
            font-size: 14px;
        }

        /* --- Modern Card-Based Question Design --- */
        .question, .question-compact {
            margin-bottom: 8px;
            padding: 10px;
            background: var(--color-surface);
            border: 1px solid var(--color-border);
            border-radius: 6px;
            box-shadow: var(--shadow-sm);
            page-break-inside: avoid;
            transition: transform 0.12s ease-in-out, box-shadow 0.12s ease-in-out;
        }
        .question:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 10px -3px rgb(0 0 0 / 0.08), 0 3px 4px -4px rgb(0 0 0 / 0.08);
        }
        .question-compact {
            padding: 8px;
            margin-bottom: 6px;
        }

        .question-number {
            font-weight: 700;
            color: var(--brand-primary);
            margin-bottom: 4px;
            font-size: 13px;
        }

        .question-text {
            margin-bottom: 6px;
            font-size: 15px;
            line-height: 1.4;
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
            padding: 8px 10px;
            background: var(--color-bg);
            border-radius: 6px;
            border: 1px solid var(--color-border);
            display: flex;
            align-items: center;
            gap: 10px;
            font-size: 13px;
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
            border-bottom: 2px dotted #94a3b8;
            min-height: 18px;
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
            gap: 16px;
            margin-bottom: 24px;
        }
        .questions-grid, .true-false-grid, .vocabulary-grid, .multiple-choice-grid {
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        }
        .questions-grid-three {
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        }

        /* --- Print-Friendly Styles --- */
        @media print {
            body {
                margin: 0;
                padding: 12px;
                font-size: 12pt;
                line-height: 1.4;
                color: #000 !important; /* Force black text */
                background: #fff !important;
            }

            .header, .section-title {
                border-color: #000 !important;
            }

            .question, .instructions, .reading-passage, .options li {
                box-shadow: none !important;
                border: 1px solid #bbb !important;
                background: #fff !important;
            }
            
            .instructions, .reading-passage {
                border-left: 3px solid #000 !important;
            }

            .question:hover {
                transform: none;
            }

            .section-title::before {
                content: ''; /* Remove emoji for print */
            }

            .answer-space {
                border-bottom: 1px solid #000 !important;
            }

            /* Make multiple choice questions much more compact for printing */
            .multiple-choice-grid {
                gap: 6px !important;
                margin-bottom: 12px !important;
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