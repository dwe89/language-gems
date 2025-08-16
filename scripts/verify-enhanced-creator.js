/**
 * Simple verification script to check if Enhanced Assignment Creator is working
 */

console.log('🔍 ENHANCED ASSIGNMENT CREATOR VERIFICATION');
console.log('==========================================');

// Check if we're on the right page
const currentUrl = window.location.href;
console.log('Current URL:', currentUrl);

if (currentUrl.includes('/dashboard/assignments/new/enhanced')) {
  console.log('✅ On Enhanced Assignment Creator page');
  
  // Check for ContentConfigurationStep elements
  const hasTabInterface = document.querySelector('[role="tablist"]') || document.querySelector('.tab');
  const hasSentenceConfig = document.querySelector('select[value*="theme"]') || document.querySelector('select[value*="topic"]');
  const hasCheckboxInterface = document.querySelector('input[type="checkbox"]');
  
  console.log('Interface Analysis:');
  console.log('- Has tab interface:', !!hasTabInterface);
  console.log('- Has sentence config:', !!hasSentenceConfig);
  console.log('- Has checkbox interface:', !!hasCheckboxInterface);
  
  if (hasTabInterface && !hasCheckboxInterface) {
    console.log('✅ CORRECT: Enhanced Assignment Creator is working');
  } else if (hasCheckboxInterface) {
    console.log('❌ WRONG: Showing checkbox interface (wrong component)');
    console.log('🔧 SOLUTION: Hard refresh browser (Ctrl+Shift+R)');
  } else {
    console.log('⚠️  UNKNOWN: Interface not recognized');
  }
  
} else {
  console.log('❌ Wrong URL - navigate to /dashboard/assignments/new/enhanced');
}

// Check for ContentConfigurationStep component
const contentStep = document.querySelector('[data-testid="content-configuration-step"]');
if (contentStep) {
  console.log('✅ ContentConfigurationStep component found');
} else {
  console.log('⚠️  ContentConfigurationStep component not found');
}

console.log('==========================================');
