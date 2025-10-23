import fetch from 'node-fetch';
import * as fs from 'fs';
import * as path from 'path';

// Simple test harness to POST a worksheet generation request to local dev server
// Usage: node ./scripts/generate-sample-worksheet.ts

async function main() {
  const body = {
    template: 'vocabulary_practice',
    subject: 'Spanish',
    topic: 'Food and Drink',
    difficulty: 'easy',
    targetQuestionCount: 12,
    questionTypes: ['matching','multiple_choice','fill_in_blank'],
    language: 'Spanish'
  };

  try {
    console.log('Posting generation request...');
    const res = await fetch('http://localhost:3000/api/worksheets/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    const json: any = await res.json();
    console.log('Initial response:', json);

    if (json.jobId) {
      const jobId = json.jobId;
      console.log('Polling job progress for jobId:', jobId);

      for (let i = 0; i < 40; i++) {
        await new Promise(r => setTimeout(r, 1500));
        const p = await fetch(`http://localhost:3000/api/worksheets/progress/${jobId}`);
        const pj: any = await p.json();
        console.log('Progress:', pj.status, pj.percent, pj.message || '');
        if (pj.status === 'completed') {
          console.log('Final result saved on job:', pj.result || pj.data || 'no payload');
          
          // Generate PDF from the worksheet
          const worksheet = pj.result?.worksheet || pj.data?.worksheet;
          if (worksheet) {
            console.log('Generating PDF...');
            const pdfResponse = await fetch('http://localhost:3000/api/worksheets/generate-pdf', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ worksheet })
            });
            
            if (pdfResponse.ok) {
              const pdfBuffer = await pdfResponse.arrayBuffer();
              const outputPath = path.join(process.cwd(), 'sample-worksheet-improved.pdf');
              fs.writeFileSync(outputPath, Buffer.from(pdfBuffer));
              console.log(`PDF saved to: ${outputPath}`);
              console.log('Open this file to see the improved worksheet styling!');
            } else {
              console.error('Failed to generate PDF:', pdfResponse.statusText);
            }
          }
          
          break;
        }
        if (pj.status === 'failed') {
          console.error('Generation failed:', pj.message);
          break;
        }
      }
    }
  } catch (err) {
    console.error('Test harness error:', err);
  }
}

main();
