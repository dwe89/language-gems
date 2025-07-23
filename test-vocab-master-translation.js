// Quick test script to verify VocabMaster translation hiding
// This can be run in the browser console on the VocabMaster page

console.log("Testing VocabMaster Translation Hiding...");

// Function to simulate testing the translation reveal functionality
function testTranslationFeature() {
  // Check if we're on the vocab master page
  if (!window.location.pathname.includes('vocab-master')) {
    console.log("❌ Not on vocab-master page. Navigate to /games/vocab-master first.");
    return;
  }

  // Wait for the page to load and check for the click-to-reveal button
  setTimeout(() => {
    const revealButton = document.querySelector('button:contains("Click to reveal translation")');
    if (revealButton) {
      console.log("✅ Found 'Click to reveal translation' button");
      
      // Test clicking the button
      revealButton.click();
      
      setTimeout(() => {
        const translationDiv = document.querySelector('[data-testid="example-translation"]');
        if (translationDiv && translationDiv.style.display !== 'none') {
          console.log("✅ Translation revealed successfully after clicking");
        } else {
          console.log("❌ Translation not found or not revealed");
        }
      }, 100);
    } else {
      console.log("⚠️ No example with translation found on current word, or feature not working");
    }
  }, 1000);
}

// Run the test
testTranslationFeature();

console.log(`
Test Instructions:
1. Navigate to http://localhost:3001/games/vocab-master
2. Select any category that has vocabulary with example sentences
3. Look for words that have example sentences
4. Verify that:
   - Example sentences are shown
   - Translations are hidden initially
   - A "Click to reveal translation" button appears
   - Clicking the button shows the translation
   - Moving to the next word hides the translation again
`);
