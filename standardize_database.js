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

// Subcategory mapping for database standardization
const subcategoryMapping = {
  // Capitalized versions to lowercase
  'Common Phrases': 'common_phrases',
  'Numbers 1-20': 'numbers_1_20',
  'Dates & Time': 'dates_time',
  'Clothes & Accessories': 'clothes_accessories',
  'Shopping Phrases & Prices': 'shopping_phrases_prices',
  'Food & Drink Vocabulary': 'food_drink_vocabulary',
  'Social Activities': 'social_activities',
  'Sports': 'sports',
  'Countries': 'countries',
  'Holiday Activities': 'holiday_activities',
  'Transport': 'transport',
  'Weather & Seasons': 'weather_seasons',
  'House, Rooms & Furniture': 'house_rooms_furniture',
  'Local Area & Places in Town': 'local_area_places_town',
  'Family & Friends': 'family_friends',
  'Personal Information': 'personal_information',
  'Physical & Personality Descriptions': 'physical_personality_descriptions',
  'Animals': 'animals',
  'Classroom Objects': 'classroom_objects',
  'Daily Routine at School': 'daily_routine_school',
  'Future Aspirations': 'future_ambitions',
  'Professions & Jobs': 'professions_jobs',
  'School Subjects': 'school_subjects',
  'Film': 'film',
  'Internet & Digital Devices': 'internet_digital_devices',
  'TV': 'tv',
  
  // French mappings from our earlier analysis
  'days_months': 'days', // Need to handle months separately
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

// Words that should be moved from 'days' to 'months'
const monthWords = [
  'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre',
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
];

async function standardizeDatabase() {
  console.log('🔧 DATABASE VOCABULARY STANDARDIZATION');
  console.log('========================================\n');

  try {
    // Step 1: Fix category naming (school -> school_jobs_future)
    console.log('📝 Step 1: Fixing category naming...');
    const categoryFixResult = await fixCategories();
    console.log(`✅ Fixed ${categoryFixResult.updated_count} entries with incorrect categories\n`);

    // Step 2: Standardize subcategories
    console.log('📝 Step 2: Standardizing subcategories...');
    let totalSubcatFixed = 0;
    
    for (const [oldSubcat, newSubcat] of Object.entries(subcategoryMapping)) {
      const result = await fixSubcategory(oldSubcat, newSubcat);
      if (result.updated_count > 0) {
        console.log(`  📝 ${oldSubcat} → ${newSubcat}: ${result.updated_count} entries`);
        totalSubcatFixed += result.updated_count;
      }
    }
    console.log(`✅ Fixed ${totalSubcatFixed} subcategory entries\n`);

    // Step 3: Handle months vs days
    console.log('📝 Step 3: Fixing months vs days classification...');
    let monthsFixed = 0;
    
    for (const monthWord of monthWords) {
      const result = await fixMonthsClassification(monthWord);
      monthsFixed += result.updated_count;
    }
    console.log(`✅ Moved ${monthsFixed} month words to 'months' subcategory\n`);

    // Step 4: Fix numbers classification
    console.log('📝 Step 4: Fixing numbers classification...');
    const numbersFixed = await fixNumbersClassification();
    console.log(`✅ Reclassified ${numbersFixed.total} number entries\n`);

    // Step 5: Generate final summary
    console.log('📊 FINAL DATABASE SUMMARY');
    console.log('==========================');
    await generateDatabaseSummary();

    console.log('\n✨ Database standardization complete!');
    console.log('\n🔍 Next steps:');
    console.log('1. Review any remaining non-standard subcategories');
    console.log('2. Add missing vocabulary for empty subcategories');
    console.log('3. Consider merging duplicate entries');

  } catch (error) {
    console.error('❌ Error during standardization:', error);
  }
}

async function fixCategories() {
  // Fix "school" category to "school_jobs_future"
  const query = `
    UPDATE centralized_vocabulary 
    SET category = 'school_jobs_future', updated_at = NOW()
    WHERE category = 'school';
  `;
  
  const result = await executeQuery(query);
  return { updated_count: result.length };
}

async function fixSubcategory(oldSubcat, newSubcat) {
  const query = `
    UPDATE centralized_vocabulary 
    SET subcategory = '${newSubcat}', updated_at = NOW()
    WHERE subcategory = '${oldSubcat}';
  `;
  
  const result = await executeQuery(query);
  return { updated_count: result.length };
}

async function fixMonthsClassification(monthWord) {
  const query = `
    UPDATE centralized_vocabulary 
    SET subcategory = 'months', updated_at = NOW()
    WHERE LOWER(word) = LOWER('${monthWord}') 
    AND subcategory = 'days';
  `;
  
  const result = await executeQuery(query);
  return { updated_count: result.length };
}

async function fixNumbersClassification() {
  // Numbers 21-100 should be numbers_1_50 or numbers_1_100
  const queries = [
    // Numbers 21-50 to numbers_1_50
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_50', updated_at = NOW()
     WHERE subcategory = 'numbers' 
     AND language = 'es'
     AND (
       word IN ('treinta', 'cuarenta', 'cincuenta') 
       OR word LIKE 'treinta y %'
       OR word LIKE 'cuarenta y %'
     );`,
    
    // Numbers 100+ to numbers_1_100
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_100', updated_at = NOW()
     WHERE subcategory = 'numbers' 
     AND language = 'es'
     AND word IN ('cien');`,
    
    // Remaining numbers to numbers_1_20
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_20', updated_at = NOW()
     WHERE subcategory = 'numbers';`,
    
    // French numbers classification
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_100', updated_at = NOW()
     WHERE subcategory = 'numbers' 
     AND language = 'fr'
     AND word IN ('cent', 'mille');`,
    
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_50', updated_at = NOW()
     WHERE subcategory = 'numbers' 
     AND language = 'fr'
     AND word IN ('trente', 'quarante', 'cinquante', 'soixante', 'soixante-dix', 'quatre-vingts', 'quatre-vingt-dix');`,
    
    `UPDATE centralized_vocabulary 
     SET subcategory = 'numbers_1_20', updated_at = NOW()
     WHERE subcategory = 'numbers';`
  ];

  let total = 0;
  for (const query of queries) {
    const result = await executeQuery(query);
    total += result.length;
  }
  
  return { total };
}

async function generateDatabaseSummary() {
  const summaryQuery = `
    SELECT 
      language,
      category,
      subcategory,
      COUNT(*) as word_count
    FROM centralized_vocabulary 
    WHERE category IN ('${Object.keys(standardCategories).join("','")}')
    GROUP BY language, category, subcategory
    ORDER BY language, category, subcategory;
  `;
  
  const results = await executeQuery(summaryQuery);
  
  // Check against standard categories
  const languageStats = {};
  
  for (const row of results) {
    if (!languageStats[row.language]) {
      languageStats[row.language] = {
        totalWords: 0,
        categoriesPresent: new Set(),
        subcategoriesPresent: new Set(),
        nonStandardSubcategories: []
      };
    }
    
    const stats = languageStats[row.language];
    stats.totalWords += parseInt(row.word_count);
    stats.categoriesPresent.add(row.category);
    stats.subcategoriesPresent.add(row.subcategory);
    
    // Check if subcategory is standard
    const standardSubcats = standardCategories[row.category] || [];
    if (row.subcategory && !standardSubcats.includes(row.subcategory)) {
      stats.nonStandardSubcategories.push(`${row.category} -> ${row.subcategory} (${row.word_count} words)`);
    }
  }
  
  // Report summary
  for (const [language, stats] of Object.entries(languageStats)) {
    console.log(`\n🌍 ${language.toUpperCase()}:`);
    console.log(`  Total words: ${stats.totalWords}`);
    console.log(`  Categories: ${stats.categoriesPresent.size}/${Object.keys(standardCategories).length}`);
    console.log(`  Subcategories: ${stats.subcategoriesPresent.size}`);
    
    if (stats.nonStandardSubcategories.length > 0) {
      console.log(`  ⚠️  Non-standard subcategories:`);
      stats.nonStandardSubcategories.forEach(subcat => console.log(`    - ${subcat}`));
    } else {
      console.log(`  ✅ All subcategories are standard!`);
    }
  }
}

// Mock function for query execution - in actual implementation, this would use Supabase MCP
async function executeQuery(query) {
  console.log(`Executing: ${query.substring(0, 100)}...`);
  // This would be replaced with actual Supabase MCP call
  return [];
}

// Run the standardization
if (require.main === module) {
  standardizeDatabase().catch(console.error);
}

module.exports = { standardizeDatabase, subcategoryMapping, monthWords, standardCategories };
