// Debug script to check categories
const { getCategoriesByCurriculum } = require('./src/components/games/KS4CategorySystem');
const { VOCABULARY_CATEGORIES } = require('./src/components/games/ModernCategorySelector');

console.log('=== KS3 Categories ===');
console.log('Total KS3 categories:', VOCABULARY_CATEGORIES.length);
VOCABULARY_CATEGORIES.forEach((cat, index) => {
  console.log(`${index + 1}. ${cat.id} - ${cat.displayName}`);
  if (cat.id === 'clothes_shopping') {
    console.log('  🎯 Found clothes_shopping category!');
    console.log('  Subcategories:', cat.subcategories.map(s => s.displayName));
  }
});

console.log('\n=== KS4 Categories (AQA) ===');
const ks4AQACategories = getCategoriesByCurriculum('KS4', 'AQA');
console.log('Total KS4 AQA categories:', ks4AQACategories.length);
ks4AQACategories.forEach((cat, index) => {
  console.log(`${index + 1}. ${cat.id} - ${cat.displayName}`);
});

console.log('\n=== KS4 Categories (Edexcel) ===');
const ks4EdexcelCategories = getCategoriesByCurriculum('KS4', 'edexcel');
console.log('Total KS4 Edexcel categories:', ks4EdexcelCategories.length);
ks4EdexcelCategories.forEach((cat, index) => {
  console.log(`${index + 1}. ${cat.id} - ${cat.displayName}`);
});

console.log('\n=== Default KS3 ===');
const ks3Categories = getCategoriesByCurriculum('KS3');
console.log('Total KS3 categories (via function):', ks3Categories.length);
ks3Categories.forEach((cat, index) => {
  console.log(`${index + 1}. ${cat.id} - ${cat.displayName}`);
  if (cat.id === 'clothes_shopping') {
    console.log('  🎯 Found clothes_shopping category!');
    console.log('  Subcategories:', cat.subcategories.map(s => s.displayName));
  }
});
