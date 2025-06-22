#!/usr/bin/env node

// Simple test script to test the assignment progress API endpoint
const fetch = require('node-fetch');

async function testProgressAPI() {
  const testData = {
    status: 'completed',
    score: 85,
    accuracy: 85,
    timeSpent: 120,
    attempts: 10,
    gameSession: {
      sessionData: {
        matches: 8,
        attempts: 10,
        gameType: 'memory-game',
        timeSpent: 120
      },
      vocabularyPracticed: [1, 2, 3, 4, 5],
      wordsCorrect: 8,
      wordsAttempted: 10
    },
    vocabularyProgress: [
      {
        vocabularyId: 1,
        attempts: 2,
        correctAttempts: 1,
        responseTime: 3.5,
        wasCorrect: true
      },
      {
        vocabularyId: 2,
        attempts: 1,
        correctAttempts: 1,
        responseTime: 2.1,
        wasCorrect: true
      }
    ]
  };

  try {
    const response = await fetch('http://localhost:3000/api/assignments/1/progress', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    console.log('Response status:', response.status);
    const responseText = await response.text();
    console.log('Response body:', responseText);
  } catch (error) {
    console.error('Error:', error);
  }
}

testProgressAPI();
