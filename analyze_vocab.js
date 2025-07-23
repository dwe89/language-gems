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

function analyzeCSV(filename, language) {
  return new Promise((resolve) => {
    const data = [];
    const categories = new Set();
    const subcategories = new Set();
    const categorySubcategories = {};
    const words = new Set();
    
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
          categories.add(cleanRow.category);
          subcategories.add(cleanRow.subcategory);
          words.add(cleanRow.word.toLowerCase());
          
          if (!categorySubcategories[cleanRow.category]) {
            categorySubcategories[cleanRow.category] = new Set();
          }
          categorySubcategories[cleanRow.category].add(cleanRow.subcategory);
        }
      })
      .on('end', () => {
        resolve({
          language,
          totalWords: data.length,
          uniqueWords: words.size,
          categories: Array.from(categories).sort(),
          subcategories: Array.from(subcategories).sort(),
          categorySubcategories,
          data
        });
      });
  });
}

async function main() {
  console.log('🔍 VOCABULARY ANALYSIS REPORT');
  console.log('==============================\n');

  const spanishData = await analyzeCSV('Vocab.csv', 'Spanish');
  const frenchData = await analyzeCSV('Vocab_French.csv', 'French');

  // Report basic stats
  console.log('📊 BASIC STATISTICS:');
  console.log(`Spanish: ${spanishData.totalWords} total words (${spanishData.uniqueWords} unique)`);
  console.log(`French: ${frenchData.totalWords} total words (${frenchData.uniqueWords} unique)`);
  console.log();

  // Check categories against standard
  console.log('🏷️  CATEGORY ANALYSIS:');
  console.log('\nStandard Categories:', Object.keys(standardCategories).length);
  
  const allCategories = new Set([...spanishData.categories, ...frenchData.categories]);
  const standardCategorySet = new Set(Object.keys(standardCategories));
  
  console.log('\nCategories in Spanish CSV:');
  spanishData.categories.forEach(cat => {
    const isStandard = standardCategorySet.has(cat);
    console.log(`  ${isStandard ? '✅' : '❌'} ${cat}`);
  });
  
  console.log('\nCategories in French CSV:');
  frenchData.categories.forEach(cat => {
    const isStandard = standardCategorySet.has(cat);
    console.log(`  ${isStandard ? '✅' : '❌'} ${cat}`);
  });

  // Check for missing categories
  console.log('\n🔍 MISSING CATEGORIES:');
  const missingFromSpanish = Object.keys(standardCategories).filter(cat => 
    !spanishData.categories.includes(cat)
  );
  const missingFromFrench = Object.keys(standardCategories).filter(cat => 
    !frenchData.categories.includes(cat)
  );

  if (missingFromSpanish.length > 0) {
    console.log('\nMissing from Spanish:');
    missingFromSpanish.forEach(cat => console.log(`  ❗ ${cat}`));
  }

  if (missingFromFrench.length > 0) {
    console.log('\nMissing from French:');
    missingFromFrench.forEach(cat => console.log(`  ❗ ${cat}`));
  }

  // Check subcategories
  console.log('\n🏷️  SUBCATEGORY ANALYSIS:');
  
  function checkSubcategories(data, lang) {
    console.log(`\n${lang} subcategory issues:`);
    let issues = 0;
    
    Object.entries(data.categorySubcategories).forEach(([category, subcats]) => {
      const standardSubs = standardCategories[category] || [];
      const subcatArray = Array.from(subcats);
      
      // Check for non-standard subcategories
      subcatArray.forEach(subcat => {
        if (!standardSubs.includes(subcat)) {
          console.log(`  ❌ ${category} -> ${subcat} (not in standard list)`);
          issues++;
        }
      });
      
      // Check for missing subcategories
      standardSubs.forEach(standardSub => {
        if (!subcatArray.includes(standardSub)) {
          console.log(`  ❗ ${category} -> ${standardSub} (missing)`);
          issues++;
        }
      });
    });
    
    if (issues === 0) {
      console.log('  ✅ All subcategories match standard');
    }
    
    return issues;
  }

  const spanishSubcatIssues = checkSubcategories(spanishData, 'Spanish');
  const frenchSubcatIssues = checkSubcategories(frenchData, 'French');

  // Check for capitalization issues in subcategories
  console.log('\n🔤 CAPITALIZATION CHECK:');
  
  function checkCapitalization(data, lang) {
    const capitalizedSubs = Array.from(new Set(
      data.data.map(row => row.subcategory)
    )).filter(sub => sub && sub[0] && sub[0] !== sub[0].toLowerCase());
    
    if (capitalizedSubs.length > 0) {
      console.log(`\n${lang} subcategories with capital letters:`);
      capitalizedSubs.forEach(sub => console.log(`  🔤 ${sub}`));
    } else {
      console.log(`\n${lang}: ✅ All subcategories start with lowercase`);
    }
  }

  checkCapitalization(spanishData, 'Spanish');
  checkCapitalization(frenchData, 'French');

  // Summary
  console.log('\n📝 SUMMARY:');
  console.log(`Spanish: ${spanishData.categories.length}/${Object.keys(standardCategories).length} categories`);
  console.log(`French: ${frenchData.categories.length}/${Object.keys(standardCategories).length} categories`);
  console.log(`Spanish subcategory issues: ${spanishSubcatIssues}`);
  console.log(`French subcategory issues: ${frenchSubcatIssues}`);
  
  console.log('\n✨ Analysis complete! Check the issues above to see what needs fixing.');
}

main().catch(console.error);
