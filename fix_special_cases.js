const fs = require('fs');
const csv = require('csv-parser');

function readCSV(filename) {
  return new Promise((resolve) => {
    const data = [];
    
    fs.createReadStream(filename)
      .pipe(csv())
      .on('data', (row) => {
        // Handle BOM character in first column
        const cleanRow = {};
        Object.keys(row).forEach(key => {
          const cleanKey = key.replace(/^\uFEFF/, ''); // Remove BOM
          cleanRow[cleanKey] = row[key];
        });
        
        if (cleanRow.word && cleanRow.category && cleanRow.subcategory) {
          data.push(cleanRow);
        }
      })
      .on('end', () => {
        resolve(data);
      });
  });
}

async function handleSpecialCases() {
  console.log('🔧 HANDLING SPECIAL CASES');
  console.log('=========================\n');

  const frenchData = await readCSV('Vocab_French_fixed.csv');
  
  // Find entries that were mapped to 'days', 'months', or invalid 'days_months'
  const monthWords = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  const dayWords = [
    'lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'
  ];
  
  console.log('📅 Fixing months, days, and days_months classification:');
  let monthsFixed = 0;
  let daysFixed = 0;
  let invalidFixed = 0;
  frenchData.forEach(row => {
    if (row.subcategory === 'days' && monthWords.includes(row.word.toLowerCase())) {
      console.log(`  📝 Moving "${row.word}" from days → months`);
      row.subcategory = 'months';
      monthsFixed++;
    }
    // Fix invalid 'days_months' subcategory
    if (row.subcategory === 'days_months') {
      const word = row.word.toLowerCase();
      if (monthWords.includes(word)) {
        row.subcategory = 'months';
        monthsFixed++;
        console.log(`  📝 Moving "${row.word}" from days_months → months`);
      } else if (dayWords.includes(word)) {
        row.subcategory = 'days';
        daysFixed++;
        console.log(`  📝 Moving "${row.word}" from days_months → days`);
      } else {
        row.subcategory = 'time_dates';
        invalidFixed++;
        console.log(`  📝 Moving "${row.word}" from days_months → time_dates`);
      }
    }
  });

  // Check numbers classification - analyze the range
  console.log('\n🔢 Analyzing number ranges:');
  const numberEntries = frenchData.filter(row => row.subcategory === 'numbers_1_20');
  const spanishData = await readCSV('Vocab_fixed.csv');
  const spanishNumberEntries = spanishData.filter(row => row.subcategory === 'numbers_1_20');
  
  console.log(`French numbers: ${numberEntries.length} entries`);
  console.log(`Spanish numbers: ${spanishNumberEntries.length} entries`);
  
  // Analyze the number words to determine proper classification
  const numbersAbove20Fr = numberEntries.filter(row => 
    ['trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix', 'cent', 'mille'].includes(row.word.toLowerCase())
  );
  
  const numbersAbove20Es = spanishNumberEntries.filter(row => 
    ['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa', 'cien'].includes(row.word.toLowerCase()) ||
    row.word.toLowerCase().startsWith('treinta y') ||
    row.word.toLowerCase().startsWith('cuarenta y')
  );

  console.log(`\nNumbers that should be in numbers_1_50:`);
  console.log(`French: ${numbersAbove20Fr.length} entries (${numbersAbove20Fr.map(r => r.word).join(', ')})`);
  console.log(`Spanish: ${numbersAbove20Es.length} entries`);

  // Reclassify numbers appropriately
  let numbersReclassified = 0;
  
  // French number reclassification
  frenchData.forEach(row => {
    if (row.subcategory === 'numbers_1_20') {
      const word = row.word.toLowerCase();
      if (['cent', 'mille'].includes(word)) {
        row.subcategory = 'numbers_1_100';
        numbersReclassified++;
      } else if (['trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix'].includes(word)) {
        row.subcategory = 'numbers_1_50';
        numbersReclassified++;
      }
    }
  });

  // Spanish number reclassification
  spanishData.forEach(row => {
    if (row.subcategory === 'numbers_1_20') {
      const word = row.word.toLowerCase();
      if (['cien'].includes(word)) {
        row.subcategory = 'numbers_1_100';
        numbersReclassified++;
      } else if (['treinta', 'cuarenta', 'cincuenta', 'sesenta', 'setenta', 'ochenta', 'noventa'].includes(word) ||
                 word.startsWith('treinta y') || word.startsWith('cuarenta y')) {
        row.subcategory = 'numbers_1_50';
        numbersReclassified++;
      }
    }
  });

  // Write the final corrected files
  writeCSV('Vocab_final.csv', spanishData);
  writeCSV('Vocab_French_final.csv', frenchData);

  console.log(`\n📊 Special cases fixed:`);
  console.log(`Months reclassified: ${monthsFixed}`);
  console.log(`Days reclassified: ${daysFixed}`);
  console.log(`Invalid days_months fixed to time_dates: ${invalidFixed}`);
  console.log(`Numbers reclassified: ${numbersReclassified}`);
  console.log(`\n✅ Final corrected files saved as Vocab_final.csv and Vocab_French_final.csv`);
}

function writeCSV(filename, data) {
  if (data.length === 0) {
    console.log(`No data to write to ${filename}`);
    return;
  }

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header] || '';
      // Escape commas and quotes in values
      if (value.toString().includes(',') || value.toString().includes('"')) {
        return `"${value.toString().replace(/"/g, '""')}"`;
      }
      return value.toString();
    }).join(','))
  ].join('\n');

  fs.writeFileSync(filename, csvContent, 'utf8');
}

handleSpecialCases().catch(console.error);
