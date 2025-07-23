const fs = require('fs');
const csv = require('csv-parser');

// Standard categories and subcategories as defined by the user
const standardCategories = {
  'basics_core_language': [
    'greetings_introductions',
    'common_phrases',
    'opinions',
    'numbers_1_20',
    'numbers_1_50',
    'numbers_1_100',
    'dates_time',
    'colours',
    'days',
    'months'
  ],
  'identity_personal_life': [
    'personal_information',
    'family_friends',
    'physical_personality_descriptions',
    'pets'
  ],
  'home_local_area': [
    'house_rooms_furniture',
    'household_items_chores',
    'types_of_housing',
    'local_area_places_town',
    'shops_services',
    'directions_prepositions'
  ],
  'school_jobs_future': [
    'school_subjects',
    'school_rules',
    'classroom_objects',
    'daily_routine_school',
    'professions_jobs',
    'future_ambitions',
    'qualities_for_jobs'
  ],
  'free_time_leisure': [
    'hobbies_interests',
    'sports',
    'social_activities'
  ],
  'food_drink': [
    'meals',
    'food_drink_vocabulary',
    'ordering_cafes_restaurants',
    'shopping_for_food'
  ],
  'clothes_shopping': [
    'clothes_accessories',
    'shopping_phrases_prices'
  ],
  'technology_media': [
    'mobile_phones_social_media',
    'internet_digital_devices',
    'tv',
    'film',
    'music'
  ],
  'health_lifestyle': [
    'parts_of_body',
    'illnesses_symptoms',
    'at_the_doctors',
    'healthy_living'
  ],
  'holidays_travel_culture': [
    'countries',
    'nationalities',
    'transport',
    'travel_phrases',
    'accommodation',
    'holiday_activities',
    'weather_seasons',
    'spanish_speaking_countries_traditions',
    'festivals_celebrations'
  ],
  'nature_environment': [
    'animals',
    'plants',
    'environmental_problems'
  ],
  'social_global_issues': [
    'social_issues',
    'human_rights',
    'global_problems_solutions',
    'current_affairs_world_events'
  ]
};

// Mapping for existing subcategories to standard ones
const subcategoryMapping = {
  // Spanish mappings
  'numbers': 'numbers_1_20', // This needs manual review as it could be 1_20, 1_50, or 1_100
  
  // French mappings
  'days_months': 'days', // This should probably be split into 'days' and 'months'
  'personal_description': 'physical_personality_descriptions',
  'family_relationships': 'family_friends',
  'relationships': 'family_friends',
  'food_basics': 'food_drink_vocabulary',
  'beverages': 'food_drink_vocabulary',
  'fruits_vegetables': 'food_drink_vocabulary',
  'cooking_ingredients': 'food_drink_vocabulary',
  'dining_out': 'ordering_cafes_restaurants',
  'eating_expressions': 'ordering_cafes_restaurants',
  'education': 'school_subjects',
  'school_equipment': 'classroom_objects',
  'school_activities': 'daily_routine_school',
  'jobs_career': 'professions_jobs',
  'future_plans': 'future_ambitions',
  'local_area': 'local_area_places_town',
  'clothing_basics': 'clothes_accessories',
  'clothing_items': 'clothes_accessories',
  'clothing_accessories': 'clothes_accessories',
  'footwear': 'clothes_accessories',
  'underwear_sleepwear': 'clothes_accessories',
  'sportswear': 'clothes_accessories',
  'sizing': 'shopping_phrases_prices',
  'shopping_actions': 'shopping_phrases_prices',
  'french_traditions': 'festivals_celebrations'
};

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
  console.log(`✅ Fixed CSV written to ${filename}`);
}

async function fixVocabulary() {
  console.log('🔧 VOCABULARY STANDARDIZATION TOOL');
  console.log('====================================\n');

  // Read both CSV files
  const spanishData = await readCSV('Vocab.csv');
  const frenchData = await readCSV('Vocab_French.csv');

  console.log(`📖 Loaded ${spanishData.length} Spanish entries`);
  console.log(`📖 Loaded ${frenchData.length} French entries\n`);

  // Fix Spanish data
  console.log('🇪🇸 Fixing Spanish data...');
  let spanishFixed = 0;
  spanishData.forEach(row => {
    // Fix category naming
    if (row.category === 'school') {
      row.category = 'school_jobs_future';
      spanishFixed++;
    }
    
    // Fix subcategory mapping
    if (subcategoryMapping[row.subcategory]) {
      console.log(`  📝 ${row.subcategory} → ${subcategoryMapping[row.subcategory]} (${row.word})`);
      row.subcategory = subcategoryMapping[row.subcategory];
      spanishFixed++;
    }
  });

  // Fix French data
  console.log('\n🇫🇷 Fixing French data...');
  let frenchFixed = 0;
  frenchData.forEach(row => {
    // Fix subcategory mapping
    if (subcategoryMapping[row.subcategory]) {
      console.log(`  📝 ${row.subcategory} → ${subcategoryMapping[row.subcategory]} (${row.word})`);
      row.subcategory = subcategoryMapping[row.subcategory];
      frenchFixed++;
    }
  });

  // Write fixed files
  console.log(`\n💾 Saving fixes...`);
  writeCSV('Vocab_fixed.csv', spanishData);
  writeCSV('Vocab_French_fixed.csv', frenchData);

  console.log(`\n📊 Summary:`);
  console.log(`Spanish: ${spanishFixed} entries fixed`);
  console.log(`French: ${frenchFixed} entries fixed`);

  // Generate missing vocabulary report
  console.log(`\n📋 MISSING VOCABULARY REPORT`);
  console.log(`==============================`);

  // Check what standard subcategories are missing
  const spanishSubcats = new Set(spanishData.map(row => row.subcategory));
  const frenchSubcats = new Set(frenchData.map(row => row.subcategory));

  Object.entries(standardCategories).forEach(([category, subcats]) => {
    console.log(`\n🏷️  ${category}:`);
    
    subcats.forEach(subcat => {
      const inSpanish = spanishSubcats.has(subcat);
      const inFrench = frenchSubcats.has(subcat);
      
      if (!inSpanish && !inFrench) {
        console.log(`  ❌ ${subcat} - Missing from both`);
      } else if (!inSpanish) {
        console.log(`  🇪🇸 ${subcat} - Missing from Spanish`);
      } else if (!inFrench) {
        console.log(`  🇫🇷 ${subcat} - Missing from French`);
      } else {
        console.log(`  ✅ ${subcat} - Present in both`);
      }
    });
  });

  // Special handling needed items
  console.log(`\n⚠️  SPECIAL ATTENTION NEEDED:`);
  console.log(`1. 'numbers' subcategory needs manual review - should it be numbers_1_20, numbers_1_50, or numbers_1_100?`);
  console.log(`2. 'days_months' should probably be split into separate 'days' and 'months' entries`);
  console.log(`3. Consider if some food subcategories should map to 'shopping_for_food' instead`);
  
  console.log(`\n✨ Standardization complete! Check the *_fixed.csv files.`);
}

fixVocabulary().catch(console.error);
