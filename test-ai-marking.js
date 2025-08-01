// Simple test to verify AI marking service
const { AIMarkingService } = require('./src/services/aiMarkingService.ts');

async function testAIMarking() {
  console.log('Testing AI Marking Service...');
  
  const aiService = new AIMarkingService();
  
  // Test photo description marking
  const photoResponse = {
    questionId: 'test-1',
    questionType: 'photo-description',
    response: {
      sentences: [
        'La familia está comiendo en la mesa.',
        'Hay cuatro personas en la foto.',
        'Los niños están sonriendo.',
        'La madre sirve la comida.',
        'Es una cena familiar muy feliz.'
      ]
    },
    criteria: {
      questionType: 'photo-description',
      language: 'es',
      maxMarks: 10
    }
  };
  
  try {
    console.log('Testing photo description marking...');
    const result = await aiService.markQuestion(photoResponse);
    console.log('Photo Description Result:', {
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      feedback: result.feedback.substring(0, 100) + '...'
    });
  } catch (error) {
    console.error('Error testing photo description:', error.message);
  }
  
  // Test translation marking
  const translationResponse = {
    questionId: 'test-2',
    questionType: 'translation',
    response: {
      '1': 'Caminé al parque esta tarde.',
      '2': 'Voy a visitar a mis abuelos por una semana.',
      '3': 'Mi hermano bebe demasiadas bebidas azucaradas, pero yo prefiero agua.',
      '4': 'Solía leer muchos libros cada mes cuando era niño.',
      '5': 'Acabamos de conocer a nuestros nuevos vecinos.'
    },
    criteria: {
      questionType: 'translation',
      language: 'es',
      maxMarks: 10
    }
  };
  
  try {
    console.log('Testing translation marking...');
    const result = await aiService.markQuestion(translationResponse);
    console.log('Translation Result:', {
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      feedback: result.feedback.substring(0, 100) + '...'
    });
  } catch (error) {
    console.error('Error testing translation:', error.message);
  }
}

// Run the test
testAIMarking().then(() => {
  console.log('Test completed!');
}).catch(error => {
  console.error('Test failed:', error);
});
