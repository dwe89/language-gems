'use client';

import React, { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

export default function TestGeneratorsPage() {
  const [wordSearchHTML, setWordSearchHTML] = useState<string>('');
  const [crosswordHTML, setCrosswordHTML] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testWordSearch = async () => {
    setLoading(true);
    try {
      const testWorksheet = {
        id: 'test-ws',
        title: 'Test Word Search Worksheet',
        rawContent: {
          exercises: [
            {
              type: 'wordsearch',
              title: 'Spanish Vocabulary Word Search',
              instructions: 'Find all the words hidden in the grid below.',
              words: ['CASA', 'PERRO', 'GATO', 'AGUA', 'COMIDA', 'FAMILIA', 'ESCUELA', 'LIBRO'],
              grid_size: 15,
              difficulty: 'medium'
            }
          ]
        }
      };

      const response = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worksheet: testWorksheet }),
      });

      const data = await response.json();
      if (data.html) {
        setWordSearchHTML(data.html);
      } else {
        console.error('No HTML returned:', data);
      }
    } catch (error) {
      console.error('Error testing word search:', error);
    } finally {
      setLoading(false);
    }
  };

  const testCrossword = async () => {
    setLoading(true);
    try {
      const testWorksheet = {
        id: 'test-cw',
        title: 'Test Crossword Worksheet',
        rawContent: {
          exercises: [
            {
              type: 'crossword',
              title: 'Spanish Vocabulary Crossword',
              instructions: 'Complete the crossword using the Spanish vocabulary words.',
              clues: [
                { answer: 'CASA', clue: 'House in Spanish' },
                { answer: 'PERRO', clue: 'Dog in Spanish' },
                { answer: 'GATO', clue: 'Cat in Spanish' },
                { answer: 'AGUA', clue: 'Water in Spanish' },
                { answer: 'COMIDA', clue: 'Food in Spanish' }
              ]
            }
          ]
        }
      };

      const response = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worksheet: testWorksheet }),
      });

      const data = await response.json();
      if (data.html) {
        setCrosswordHTML(data.html);
      } else {
        console.error('No HTML returned:', data);
      }
    } catch (error) {
      console.error('Error testing crossword:', error);
    } finally {
      setLoading(false);
    }
  };

  const testVocabularyPractice = async () => {
    setLoading(true);
    try {
      const testWorksheet = {
        id: 'test-vocab-practice',
        title: 'Spanish Social Issues Vocabulary',
        template_id: 'vocabulary_practice',
        subject: 'spanish',
        content: {
          exercises: [
            {
              type: 'wordsearch',
              title: 'Word Search',
              words: ['ACOSO', 'DESEMPLEO', 'RACISMO', 'SEXISMO', 'ADICCION', 'MIGRACION']
            },
            {
              type: 'crossword',
              title: 'Crossword Puzzle',
              words: ['ACOSO', 'DESEMPLEO', 'RACISMO', 'SEXISMO', 'ADICCION', 'MIGRACION']
            }
          ]
        }
      };

      const response = await fetch('/api/worksheets/generate-html', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ worksheet: testWorksheet }),
      });

      const data = await response.json();
      if (data.html) {
        // Open in new window
        const newWindow = window.open('', '_blank');
        if (newWindow) {
          newWindow.document.write(data.html);
          newWindow.document.close();
        }
      } else {
        console.error('No HTML returned:', data);
      }
    } catch (error) {
      console.error('Error testing vocabulary practice:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Test Worksheet Generators</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Word Search Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testWordSearch} disabled={loading} className="mb-4">
              {loading ? 'Generating...' : 'Test Word Search'}
            </Button>
            {wordSearchHTML && (
              <div className="border p-4 max-h-96 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: wordSearchHTML }} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Crossword Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testCrossword} disabled={loading} className="mb-4">
              {loading ? 'Generating...' : 'Test Crossword'}
            </Button>
            {crosswordHTML && (
              <div className="border p-4 max-h-96 overflow-auto">
                <div dangerouslySetInnerHTML={{ __html: crosswordHTML }} />
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Vocabulary Practice Generator</CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={testVocabularyPractice} disabled={loading} className="mb-4">
              {loading ? 'Generating...' : 'Test Vocabulary Practice (Opens in New Window)'}
            </Button>
            <p className="text-sm text-gray-600">
              Tests both word search and crossword generators in a complete vocabulary practice worksheet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
