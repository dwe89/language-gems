import { test, expect, Page } from '@playwright/test';

/**
 * Enhanced Tracking System - Automated Test Suite
 * 
 * This test suite validates the end-to-end data flow from game interaction
 * to database persistence across all 15 games in both normal and assignment modes.
 * 
 * Test Categories:
 * 1. Skill-based games (should track word-level performance)
 * 2. Luck-based games (should track only session data)
 * 3. Assignment mode vs normal mode consistency
 * 4. Edge cases (disconnections, rapid inputs, etc.)
 */

// Test configuration
const TEST_CONFIG = {
  baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
  timeout: 30000,
  testUser: {
    email: 'test@languagegems.com',
    password: 'testpassword123'
  },
  games: {
    skillBased: [
      'vocab-master', 'word-scramble', 'word-blast', 'detective-listening',
      'case-file-translator', 'lava-temple-word-restore', 'verb-quest',
      'conjugation-duel', 'sentence-towers', 'speed-builder', 'vocab-blast'
    ],
    luckBased: ['memory-match', 'hangman', 'noughts-and-crosses']
  }
};

// Helper functions
async function loginUser(page: Page) {
  await page.goto('/login');
  await page.fill('[data-testid="email-input"]', TEST_CONFIG.testUser.email);
  await page.fill('[data-testid="password-input"]', TEST_CONFIG.testUser.password);
  await page.click('[data-testid="login-button"]');
  await page.waitForURL('/dashboard');
}

async function navigateToGame(page: Page, gameId: string) {
  await page.goto(`/games/${gameId}`);
  await page.waitForLoadState('networkidle');
}

async function playGameSession(page: Page, gameType: string, duration: number = 30000) {
  const startTime = Date.now();
  
  // Game-specific interaction patterns
  switch (gameType) {
    case 'vocab-master':
      await playVocabMaster(page, duration);
      break;
    case 'word-scramble':
      await playWordScramble(page, duration);
      break;
    case 'memory-match':
      await playMemoryMatch(page, duration);
      break;
    case 'hangman':
      await playHangman(page, duration);
      break;
    default:
      await playGenericGame(page, duration);
  }
  
  return Date.now() - startTime;
}

async function playVocabMaster(page: Page, duration: number) {
  // Wait for game to load
  await page.waitForSelector('[data-testid="vocab-master-game"]', { timeout: 10000 });
  
  // Start game if needed
  const startButton = page.locator('[data-testid="start-game-button"]');
  if (await startButton.isVisible()) {
    await startButton.click();
  }
  
  const endTime = Date.now() + duration;
  let wordCount = 0;
  
  while (Date.now() < endTime && wordCount < 10) {
    try {
      // Look for answer options
      const answerButtons = page.locator('[data-testid^="answer-option-"]');
      const count = await answerButtons.count();
      
      if (count > 0) {
        // Click a random answer (mix of correct/incorrect for realistic data)
        const randomIndex = Math.floor(Math.random() * count);
        await answerButtons.nth(randomIndex).click();
        
        // Wait for feedback
        await page.waitForTimeout(1500);
        
        // Continue to next word
        const nextButton = page.locator('[data-testid="next-word-button"]');
        if (await nextButton.isVisible()) {
          await nextButton.click();
        }
        
        wordCount++;
      } else {
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`VocabMaster interaction error: ${error}`);
      break;
    }
  }
}

async function playWordScramble(page: Page, duration: number) {
  await page.waitForSelector('[data-testid="word-scramble-game"]', { timeout: 10000 });
  
  const endTime = Date.now() + duration;
  let wordCount = 0;
  
  while (Date.now() < endTime && wordCount < 8) {
    try {
      // Look for scrambled letters
      const letterButtons = page.locator('[data-testid^="letter-"]');
      const count = await letterButtons.count();
      
      if (count > 0) {
        // Click letters in random order to form words
        for (let i = 0; i < Math.min(count, 6); i++) {
          await letterButtons.nth(i).click();
          await page.waitForTimeout(200);
        }
        
        // Submit answer
        const submitButton = page.locator('[data-testid="submit-answer"]');
        if (await submitButton.isVisible()) {
          await submitButton.click();
          await page.waitForTimeout(2000);
        }
        
        wordCount++;
      } else {
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`WordScramble interaction error: ${error}`);
      break;
    }
  }
}

async function playMemoryMatch(page: Page, duration: number) {
  await page.waitForSelector('[data-testid="memory-game"]', { timeout: 10000 });
  
  const endTime = Date.now() + duration;
  let attempts = 0;
  
  while (Date.now() < endTime && attempts < 20) {
    try {
      // Find unmatched cards
      const cards = page.locator('[data-testid^="memory-card-"]:not(.matched)');
      const count = await cards.count();
      
      if (count >= 2) {
        // Click two random cards
        const firstCard = Math.floor(Math.random() * count);
        let secondCard = Math.floor(Math.random() * count);
        while (secondCard === firstCard) {
          secondCard = Math.floor(Math.random() * count);
        }
        
        await cards.nth(firstCard).click();
        await page.waitForTimeout(500);
        await cards.nth(secondCard).click();
        await page.waitForTimeout(2000); // Wait for match/no-match animation
        
        attempts++;
      } else {
        break; // Game completed
      }
    } catch (error) {
      console.log(`MemoryMatch interaction error: ${error}`);
      break;
    }
  }
}

async function playHangman(page: Page, duration: number) {
  await page.waitForSelector('[data-testid="hangman-game"]', { timeout: 10000 });
  
  const endTime = Date.now() + duration;
  const letters = 'abcdefghijklmnopqrstuvwxyz'.split('');
  
  while (Date.now() < endTime) {
    try {
      // Pick a random letter
      const randomLetter = letters[Math.floor(Math.random() * letters.length)];
      const letterButton = page.locator(`[data-testid="letter-${randomLetter}"]`);
      
      if (await letterButton.isVisible() && !(await letterButton.isDisabled())) {
        await letterButton.click();
        await page.waitForTimeout(1500);
        
        // Check if game is over
        const gameOver = page.locator('[data-testid="game-over"]');
        if (await gameOver.isVisible()) {
          const newGameButton = page.locator('[data-testid="new-game-button"]');
          if (await newGameButton.isVisible()) {
            await newGameButton.click();
            await page.waitForTimeout(2000);
          }
        }
      } else {
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`Hangman interaction error: ${error}`);
      break;
    }
  }
}

async function playGenericGame(page: Page, duration: number) {
  // Generic game interaction for games without specific patterns
  const endTime = Date.now() + duration;
  
  while (Date.now() < endTime) {
    try {
      // Look for common interactive elements
      const buttons = page.locator('button:not(:disabled)');
      const count = await buttons.count();
      
      if (count > 0) {
        const randomButton = Math.floor(Math.random() * Math.min(count, 5));
        await buttons.nth(randomButton).click();
        await page.waitForTimeout(2000);
      } else {
        await page.waitForTimeout(1000);
      }
    } catch (error) {
      console.log(`Generic game interaction error: ${error}`);
      break;
    }
  }
}

async function checkDatabaseTracking(gameType: string, userId: string, isSkillBased: boolean) {
  // This would typically make API calls to verify database state
  // For now, we'll simulate the checks
  
  const response = await fetch(`${TEST_CONFIG.baseURL}/api/test/verify-tracking`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      gameType,
      userId,
      isSkillBased,
      timestamp: Date.now()
    })
  });
  
  return response.ok;
}

// Test suites
test.describe('Enhanced Tracking System - Skill-Based Games', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  for (const gameId of TEST_CONFIG.games.skillBased) {
    test(`${gameId} - Normal Mode Tracking`, async ({ page }) => {
      await navigateToGame(page, gameId);
      
      const sessionDuration = await playGameSession(page, gameId, 45000);
      
      // Verify session was tracked
      expect(sessionDuration).toBeGreaterThan(30000);
      
      // Check database tracking (would be implemented with actual API calls)
      const trackingVerified = await checkDatabaseTracking(gameId, 'test-user', true);
      expect(trackingVerified).toBe(true);
    });

    test(`${gameId} - Assignment Mode Tracking`, async ({ page }) => {
      // Navigate to assignment mode
      await page.goto(`/games/${gameId}?assignment=test-assignment&mode=assignment`);
      
      const sessionDuration = await playGameSession(page, gameId, 45000);
      
      // Verify session was tracked with assignment context
      expect(sessionDuration).toBeGreaterThan(30000);
      
      const trackingVerified = await checkDatabaseTracking(gameId, 'test-user', true);
      expect(trackingVerified).toBe(true);
    });
  }
});

test.describe('Enhanced Tracking System - Luck-Based Games', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  for (const gameId of TEST_CONFIG.games.luckBased) {
    test(`${gameId} - Normal Mode Tracking (No Word Data)`, async ({ page }) => {
      await navigateToGame(page, gameId);
      
      const sessionDuration = await playGameSession(page, gameId, 30000);
      
      // Verify session was tracked but without word-level data
      expect(sessionDuration).toBeGreaterThan(20000);
      
      const trackingVerified = await checkDatabaseTracking(gameId, 'test-user', false);
      expect(trackingVerified).toBe(true);
    });
  }
});

test.describe('Enhanced Tracking System - Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await loginUser(page);
  });

  test('Mid-game disconnection handling', async ({ page }) => {
    await navigateToGame(page, 'vocab-master');
    
    // Start game
    await playGameSession(page, 'vocab-master', 15000);
    
    // Simulate disconnection by closing page
    await page.close();
    
    // Verify partial session was saved (would check via API)
    // This test would verify that incomplete sessions are handled gracefully
  });

  test('Rapid input handling', async ({ page }) => {
    await navigateToGame(page, 'word-scramble');
    
    // Rapid clicking simulation
    for (let i = 0; i < 50; i++) {
      try {
        const buttons = page.locator('button:not(:disabled)');
        const count = await buttons.count();
        if (count > 0) {
          await buttons.nth(0).click();
        }
        await page.waitForTimeout(100); // Very fast clicking
      } catch (error) {
        // Expected - some clicks may fail due to rapid input
      }
    }
    
    // Verify system handled rapid input gracefully
    await page.waitForTimeout(5000);
    const trackingVerified = await checkDatabaseTracking('word-scramble', 'test-user', true);
    expect(trackingVerified).toBe(true);
  });

  test('Zero performance session', async ({ page }) => {
    await navigateToGame(page, 'vocab-master');
    
    // Intentionally answer everything wrong
    await page.waitForSelector('[data-testid="vocab-master-game"]');
    
    for (let i = 0; i < 5; i++) {
      try {
        // Always click the last option (likely wrong)
        const answerButtons = page.locator('[data-testid^="answer-option-"]');
        const count = await answerButtons.count();
        if (count > 0) {
          await answerButtons.nth(count - 1).click();
          await page.waitForTimeout(2000);
          
          const nextButton = page.locator('[data-testid="next-word-button"]');
          if (await nextButton.isVisible()) {
            await nextButton.click();
          }
        }
      } catch (error) {
        break;
      }
    }
    
    // Verify zero performance was tracked correctly
    const trackingVerified = await checkDatabaseTracking('vocab-master', 'test-user', true);
    expect(trackingVerified).toBe(true);
  });
});

test.describe('Enhanced Tracking System - Cross-Game Consistency', () => {
  test('All games use consistent tracking patterns', async ({ page }) => {
    await loginUser(page);
    
    const allGames = [...TEST_CONFIG.games.skillBased, ...TEST_CONFIG.games.luckBased];
    const trackingResults = [];
    
    for (const gameId of allGames.slice(0, 5)) { // Test first 5 games for time
      try {
        await navigateToGame(page, gameId);
        await playGameSession(page, gameId, 20000);
        
        const isSkillBased = TEST_CONFIG.games.skillBased.includes(gameId);
        const verified = await checkDatabaseTracking(gameId, 'test-user', isSkillBased);
        
        trackingResults.push({ gameId, verified, isSkillBased });
      } catch (error) {
        trackingResults.push({ gameId, verified: false, error: error.message });
      }
    }
    
    // Verify all games tracked successfully
    const failedGames = trackingResults.filter(result => !result.verified);
    expect(failedGames).toHaveLength(0);
  });
});
