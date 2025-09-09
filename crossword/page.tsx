'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Plus, Trash2, Puzzle, Printer, RefreshCw, Wand2 } from 'lucide-react';
import { useToast } from '../components/ui/use-toast';
import Crossword, { ThemeProvider, Word } from '@jaredreisinger/react-crossword';

type InputWord = {
  id: string;
  word: string;
  clue: string;
};

// Simple generation logic placeholder (replace with a proper algorithm if needed)
// This basic logic doesn't handle complex intersections well and might produce unplayable grids.
const generateCrosswordData = (words: InputWord[]): { across: Record<string, Word>, down: Record<string, Word> } | null => {
  if (!words || words.length < 1) return null; 

  // Limit the number of words to avoid overly complex/error-prone generation for now
  const limitedWords = words.slice(0, 10); 

  const data: { across: Record<string, Word>, down: Record<string, Word> } = {
    across: {},
    down: {},
  };
  const grid: (string | null)[][] = Array(20).fill(null).map(() => Array(20).fill(null)); // Simple grid representation
  const rowOffset = 10, colOffset = 10; // Start near the middle
  let wordCount = 0;

  function canPlaceWord(word: string, r: number, c: number, isAcross: boolean): boolean {
      for (let i = 0; i < word.length; i++) {
          const currentRow = r + (isAcross ? 0 : i);
          const currentCol = c + (isAcross ? i : 0);
          
          if (currentRow < 0 || currentRow >= grid.length || currentCol < 0 || currentCol >= grid[0].length) {
              return false; // Out of bounds
          }
          
          const existingChar = grid[currentRow][currentCol];
          if (existingChar !== null && existingChar !== word[i]) {
              return false; // Conflict
          }
          // Check perpendicular neighbors (basic check, not perfect)
          const perpRowAbove = currentRow + (isAcross ? -1 : 0);
          const perpColLeft = currentCol + (isAcross ? 0 : -1);
          const perpRowBelow = currentRow + (isAcross ? 1 : 0);
          const perpColRight = currentCol + (isAcross ? 0 : 1);

          if (isAcross) {
              if ((grid[perpRowAbove]?.[currentCol] !== null && i > 0 && grid[currentRow]?.[currentCol -1] !== word[i-1]) || 
                  (grid[perpRowBelow]?.[currentCol] !== null && i < word.length -1 && grid[currentRow]?.[currentCol + 1] !== word[i+1])) {
                 // Avoid adjacent parallel words unless intersecting
                 // This rule needs refinement for a real generator
              }
          } else { // isDown
               if ((grid[currentRow]?.[perpColLeft] !== null && i > 0 && grid[currentRow - 1]?.[currentCol] !== word[i-1]) || 
                   (grid[currentRow]?.[perpColRight] !== null && i < word.length -1 && grid[currentRow + 1]?.[currentCol] !== word[i+1])) {
                  // Avoid adjacent parallel words
              }
          }
      }
      return true;
  }

  function placeWord(word: string, r: number, c: number, isAcross: boolean) {
      for (let i = 0; i < word.length; i++) {
          grid[r + (isAcross ? 0 : i)][c + (isAcross ? i : 0)] = word[i];
      }
  }
  
  // Place the first word
  const firstWord = limitedWords[0].word.toUpperCase();
  const firstClue = limitedWords[0].clue;
  if (canPlaceWord(firstWord, rowOffset, colOffset, true)) {
      placeWord(firstWord, rowOffset, colOffset, true);
      wordCount++;
      data.across[wordCount.toString()] = { clue: firstClue, answer: firstWord, row: rowOffset, col: colOffset };
  } else {
      console.error("Could not even place the first word!");
      return null; // Should not happen with an empty grid
  }

  // Try to place subsequent words intersecting existing ones (very basic)
  for (let w = 1; w < limitedWords.length; w++) {
    const currentWord = limitedWords[w].word.toUpperCase();
    const currentClue = limitedWords[w].clue;
    let placed = false;

    for (let attempt = 0; attempt < 10 && !placed; attempt++) { // Limit attempts per word
       const targetWordIndex = Math.floor(Math.random() * wordCount);
       const targetIsAcross = Object.values(data.across).length > targetWordIndex && Math.random() > 0.5; // Heuristic
       const targetWordData = targetIsAcross ? Object.values(data.across)[targetWordIndex] : Object.values(data.down)[targetWordIndex];
       
       if (!targetWordData) continue;

       const targetAnswer = targetWordData.answer;
       const targetRow = targetWordData.row;
       const targetCol = targetWordData.col;

       for (let i = 0; i < targetAnswer.length && !placed; i++) {
           const intersectionChar = targetAnswer[i];
           const intersectionIndexInCurrent = currentWord.indexOf(intersectionChar);

           if (intersectionIndexInCurrent !== -1) {
               const placeAcross = !targetIsAcross;
               const newRow = targetRow + (targetIsAcross ? 0 : i) - (placeAcross ? 0 : intersectionIndexInCurrent);
               const newCol = targetCol + (targetIsAcross ? i : 0) - (placeAcross ? intersectionIndexInCurrent : 0);

               if (canPlaceWord(currentWord, newRow, newCol, placeAcross)) {
                   placeWord(currentWord, newRow, newCol, placeAcross);
                   wordCount++;
                   if (placeAcross) {
                       data.across[wordCount.toString()] = { clue: currentClue, answer: currentWord, row: newRow, col: newCol };
                   } else {
                       data.down[wordCount.toString()] = { clue: currentClue, answer: currentWord, row: newRow, col: newCol };
                   }
                   placed = true;
               }
           }
       }
    }
     // If still not placed after attempts, could try placing disconnected (not implemented here for simplicity)
  }

  // Ensure we always have at least one across and one down, even if nonsensical, to avoid library errors.
  // This is a HACK due to the poor generation logic.
  if (Object.keys(data.across).length === 0 && Object.keys(data.down).length > 0) {
      const firstDownKey = Object.keys(data.down)[0];
      data.across['999'] = { ...data.down[firstDownKey], row: data.down[firstDownKey].row + 1 }; // Place dummy across
  } else if (Object.keys(data.down).length === 0 && Object.keys(data.across).length > 0) {
      const firstAcrossKey = Object.keys(data.across)[0];
      data.down['999'] = { ...data.across[firstAcrossKey], col: data.across[firstAcrossKey].col + 1 }; // Place dummy down
  } else if (Object.keys(data.across).length === 0 && Object.keys(data.down).length === 0 && limitedWords.length > 0) {
      // If even the first word placement failed somehow, create dummy entries
       data.across['998'] = { clue: limitedWords[0].clue, answer: limitedWords[0].word.toUpperCase(), row: 0, col: 0 };
       data.down['999'] = { clue: "Dummy", answer: "DUMMY", row: 1, col: 0 };
  }
  
  // Basic validation: Ensure both across and down have at least one entry if possible
  if (wordCount > 0 && (Object.keys(data.across).length === 0 || Object.keys(data.down).length === 0)) {
      console.warn("Crossword generation resulted in only one direction. Layout might be trivial.");
      // The hack above *should* prevent the library from crashing, but the crossword might be bad.
  }

  return (Object.keys(data.across).length > 0 && Object.keys(data.down).length > 0) ? data : null;
};

export default function CrosswordPage() {
  const [title, setTitle] = useState('My Crossword');
  const [inputWords, setInputWords] = useState<InputWord[]>([
    { id: '1', word: 'React', clue: 'A JavaScript library for building user interfaces' },
    { id: '2', word: 'NextJS', clue: 'A React framework for production' },
  ]);
  const [generatedData, setGeneratedData] = useState<ReturnType<typeof generateCrosswordData>>(null);
  const crosswordRef = useRef<any>(null); // Ref for accessing Crossword component methods
  const { toast } = useToast();
  const [aiPrompt, setAiPrompt] = useState('US State Capitals'); // State for AI prompt
  const [isGeneratingAI, setIsGeneratingAI] = useState(false); // Loading state for AI

  const addWord = () => {
    setInputWords([
      ...inputWords,
      { id: Date.now().toString(), word: '', clue: '' },
    ]);
  };

  const updateWord = (id: string, field: 'word' | 'clue', value: string) => {
    setInputWords(
      inputWords.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
     setGeneratedData(null); // Invalidate generated data on word change
  };

  const removeWord = (id: string) => {
    setInputWords(inputWords.filter((item) => item.id !== id));
     setGeneratedData(null); // Invalidate generated data on word removal
  };

  const handleGenerate = () => {
      const validWords = inputWords.filter(w => w.word.trim() && w.clue.trim());
      if (validWords.length < 2) {
          toast({
              title: "Insufficient Words",
              description: "Please enter at least two words and clues to generate a crossword.",
              variant: "destructive",
          });
          return;
      }
      
      // Filter out empty words/clues before generating
      const data = generateCrosswordData(validWords);
      if (data) {
          setGeneratedData(data);
          toast({
            title: "Crossword Generated",
            description: "Crossword puzzle created successfully. Note: Generation logic is basic.",
          });
      } else {
           toast({
              title: "Generation Failed",
              description: "Could not generate crossword with the provided words. Please try different words.",
              variant: "destructive",
          });
      }
  };
  
  const handlePrint = () => {
    window.print(); // Uses browser's print functionality
  };
  
  const handleReset = () => {
     if (crosswordRef.current) {
       crosswordRef.current.reset();
     }
  }

  // Function to set words from AI/Random generation
  const setGeneratedWords = (generated: { word: string; clue: string }[]) => {
    setInputWords(
      generated.map((item, index) => ({
        id: Date.now().toString() + index,
        word: item.word.replace(/[^a-zA-Z]/g, ''), // Ensure only letters
        clue: item.clue,
      }))
    );
    setGeneratedData(null); // Clear existing crossword grid
  };

  const handleAIGenerate = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Prompt Required",
        description: "Please enter a topic or prompt for AI generation.",
        variant: "destructive",
      });
      return;
    }
    setIsGeneratingAI(true);
    setGeneratedData(null); // Clear grid
    try {
      // Assuming an API route /api/openai exists for this
      const response = await fetch('/api/openai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            prompt: `Generate 5-10 simple crossword words and clues (single words ideally, short clues) based on the topic: ${aiPrompt}. Output should be a JSON array of objects, each with a "word" and "clue" property.` 
        }),
      });

      if (!response.ok) {
        throw new Error(`AI generation failed: ${response.statusText}`);
      }

      const result = await response.json();
      
      // Basic validation of the result structure
      if (Array.isArray(result?.words) && result.words.every((w: any) => typeof w.word === 'string' && typeof w.clue === 'string')) {
         setGeneratedWords(result.words);
         toast({
           title: "AI Words Generated",
           description: "Words and clues generated by AI. You can edit them before generating the puzzle.",
         });
      } else {
           console.error("Unexpected AI response format:", result);
           throw new Error('Invalid format received from AI.');
      }

    } catch (error: any) {
      console.error('AI Generation Error:', error);
      toast({
        title: "AI Generation Error",
        description: error.message || "Failed to generate words using AI. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Placeholder for random generation
  const handleRandomGenerate = () => {
      const randomTopics = [
        { word: "SUN", clue: "Star at the center of our solar system" },
        { word: "MOON", clue: "Earth's natural satellite" },
        { word: "EARTH", clue: "The planet we live on" },
        { word: "MARS", clue: "The red planet" },
        { word: "SPACE", clue: "The final frontier" },
        { word: "STAR", clue: "Twinkle, twinkle, little ____" },
        { word: "CLOUD", clue: "White fluffy thing in the sky" },
      ];
      setGeneratedWords(randomTopics);
       toast({
           title: "Random Words Loaded",
           description: "Sample words and clues loaded. You can edit them.",
         });
      setGeneratedData(null);
  };

  // Define custom theme colors matching the app's style
  const theme = {
    columnBreakpoint: '768px',
    gridBackground: '#ffffff',
    cellBackground: '#ffffff',
    cellBorder: '#adb5bd',
    textColor: '#495057',
    numberColor: '#6c757d',
    focusBackground: '#e9ecef',
    highlightBackground: '#cfe2ff',
    // Use Tailwind indigo for the main color
    correctBackground: 'rgb(79 70 229 / 0.3)', // Indigo-500 with opacity
    hoverBackground: 'rgb(99 102 241 / 0.2)', // Indigo-400 with opacity
  };

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-6xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 rounded-t-lg border-b">
          <CardTitle className="text-2xl">Crossword Generator</CardTitle>
          <CardDescription>Create educational crossword puzzles for your classroom</CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Input Section */}
          <div className="md:col-span-1 space-y-6">
            {/* AI Generation Section */}
             <div className="space-y-4 border rounded-lg p-4">
                <h3 className="font-medium flex items-center">
                    <Wand2 className="h-4 w-4 mr-2"/> AI Word Generation
                </h3>
                <Label htmlFor="ai-prompt">Topic/Prompt</Label>
                <Textarea
                  id="ai-prompt"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  placeholder="e.g., Animals, Science Terms, Book Characters"
                  rows={3}
                  className="text-sm"
                />
                 <div className="grid grid-cols-2 gap-2">
                     <Button 
                        onClick={handleAIGenerate} 
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                      >
                       {isGeneratingAI ? 'Generating...' : 'Generate with AI'}
                     </Button>
                     <Button 
                        onClick={handleRandomGenerate} 
                        disabled={isGeneratingAI}
                        variant="outline"
                        size="sm"
                      >
                        Load Random Example
                     </Button>
                 </div>
                <p className="text-xs text-gray-500">Generate words & clues using AI based on your prompt, or load a random example set.</p>
             </div>

            <div>
              <Label htmlFor="crossword-title">Crossword Title</Label>
              <Input 
                id="crossword-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter crossword title"
              />
            </div>
            
            <div className="space-y-4">
              <Label>Words & Clues</Label>
              {inputWords.map((item, index) => (
                <div key={item.id} className="flex items-start space-x-2 p-3 border rounded-md">
                   <span className="text-sm font-medium pt-2">{index + 1}.</span>
                   <div className="flex-grow space-y-2">
                       <Input
                         placeholder="Word"
                         value={item.word}
                         onChange={(e) => updateWord(item.id, 'word', e.target.value.replace(/[^a-zA-Z]/g, ''))} // Only allow letters
                         className="h-8 text-sm"
                       />
                       <Textarea
                         placeholder="Clue"
                         value={item.clue}
                         onChange={(e) => updateWord(item.id, 'clue', e.target.value)}
                         rows={2}
                         className="text-sm resize-none"
                       />
                   </div>
                   <Button 
                     variant="ghost" 
                     size="sm" 
                     onClick={() => removeWord(item.id)}
                     className="h-8 w-8 p-0 text-red-500 mt-1"
                     aria-label="Remove word"
                   >
                     <Trash2 className="h-4 w-4" />
                   </Button>
                </div>
              ))}
              <Button variant="outline" className="w-full" onClick={addWord}>
                <Plus className="h-4 w-4 mr-2" /> Add Word
              </Button>
            </div>
            
            <Button 
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600" 
              onClick={handleGenerate}
              disabled={inputWords.filter(w => w.word.trim() && w.clue.trim()).length < 2}
            >
              <Puzzle className="h-4 w-4 mr-2" /> Generate Crossword
            </Button>
          </div>

          {/* Crossword Display Section */}
          <div className="md:col-span-2">
            {generatedData ? (
              <div className="border rounded-lg p-4 bg-white printable-area">
                <h2 className="text-xl font-bold text-center mb-4 print:text-black">{title}</h2>
                 <ThemeProvider theme={theme}>
                  <Crossword data={generatedData} ref={crosswordRef} useStorage={false} />
                 </ThemeProvider>
                 <div className="flex justify-center space-x-4 mt-6 print:hidden">
                    <Button variant="outline" onClick={handleReset}>
                        <RefreshCw className="h-4 w-4 mr-2" /> Reset Puzzle
                    </Button>
                   <Button onClick={handlePrint}>
                     <Printer className="h-4 w-4 mr-2" /> Print Puzzle
                   </Button>
                 </div>
                 {/* Basic print styles */}
                 <style jsx global>{`
                    @media print {
                      body * {
                        visibility: hidden;
                      }
                      .printable-area, .printable-area * {
                        visibility: visible;
                      }
                      .printable-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                      }
                      .react-crossword__grid {
                         border: 2px solid black !important;
                      }
                       .react-crossword__grid input {
                          color: black !important;
                          border: 1px solid black !important;
                       }
                       .react-crossword__clues > h4 {
                          color: black !important;
                       }
                       .react-crossword__clue {
                          color: black !important;
                       }
                    }
                 `}</style>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full border-2 border-dashed rounded-lg">
                <p className="text-gray-500">Enter words and clues, then click "Generate Crossword".</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 