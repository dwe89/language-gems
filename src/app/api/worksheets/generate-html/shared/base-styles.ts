export function getBaseStyles(): string {
  return `
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: white;
        }

        .header {
            text-align: center;
            border-bottom: 3px solid #4f46e5;
            padding-bottom: 20px;
            margin-bottom: 30px;
        }

        .title {
            font-size: 28px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 16px;
            color: #64748b;
            margin-bottom: 15px;
        }

        .meta-info {
            display: flex;
            justify-content: center;
            gap: 30px;
            font-size: 14px;
            color: #64748b;
        }

        .instructions {
            background: #f8fafc;
            border-left: 4px solid #4f46e5;
            padding: 15px 20px;
            margin-bottom: 30px;
            border-radius: 0 8px 8px 0;
        }

        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }

        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1e293b;
            margin-bottom: 15px;
            padding-bottom: 8px;
            border-bottom: 2px solid #e2e8f0;
        }

        .reading-passage {
            background: #f8fafc;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #10b981;
            margin-bottom: 20px;
            line-height: 1.8;
        }

        .reading-passage p {
            margin-bottom: 15px;
        }

        .question {
            margin-bottom: 20px;
            padding: 15px;
            background: #fefefe;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
        }

        .question-number {
            font-weight: bold;
            color: #4f46e5;
            margin-bottom: 8px;
        }

        .question-text {
            margin-bottom: 10px;
            font-size: 16px;
        }

        .options {
            list-style: none;
            padding: 0;
        }

        .options li {
            margin-bottom: 8px;
            padding: 8px 12px;
            background: #f8fafc;
            border-radius: 4px;
            border-left: 3px solid #cbd5e1;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .options input[type="checkbox"] {
            width: 16px;
            height: 16px;
            margin: 0;
        }

        .options label {
            flex: 1;
            cursor: pointer;
            margin: 0;
        }

        .tf-options {
            display: flex;
            gap: 20px;
            margin-top: 10px;
        }

        .tf-options input[type="checkbox"] {
            width: 16px;
            height: 16px;
            margin-right: 5px;
        }

        .tf-options label {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 5px;
        }

        .answer-space {
            border-bottom: 1px solid #cbd5e1;
            min-height: 30px;
            margin: 10px 0;
        }

        .matching-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            margin-bottom: 8px;
            background: #f8fafc;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
        }

        .matching-item span {
            flex: 1;
            font-weight: 500;
        }

        .matching-item .answer-space {
            flex: 1;
            margin-left: 20px;
            margin-top: 0;
            margin-bottom: 0;
        }

        @media print {
            body { 
                margin: 0; 
                padding: 15px; 
            }
            
            .section { 
                page-break-inside: avoid; 
            }
            
            .question {
                page-break-inside: avoid;
            }
            
            .header {
                border-bottom: 2px solid #000;
            }
            
            .section-title {
                border-bottom: 1px solid #000;
            }
            
            .reading-passage {
                border-left: 3px solid #000;
            }
        }
`;
}
