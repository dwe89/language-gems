'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../../components/auth/AuthProvider';
import GameAssignmentWrapper, { 
  StandardVocabularyItem, 
  AssignmentData, 
  GameProgress,
  calculateStandardScore 
} from '../../../../components/games/templates/GameAssignmentWrapper';

interface ConjugationDuelAssignmentWrapperProps {
  assignmentId: string;
}

export default function ConjugationDuelAssignmentWrapper({ 
  assignmentId 
}: ConjugationDuelAssignmentWrapperProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleAssignmentComplete = (progress: GameProgress) => {
    console.log('Conjugation Duel assignment completed:', progress);
    
    // Show completion message and redirect
    setTimeout(() => {
      router.push('/student-dashboard/assignments');
    }, 3000);
  };

  const handleBackToAssignments = () => {
    router.push('/student-dashboard/assignments');
  };

  const handleBackToMenu = () => {
    router.push('/games/conjugation-duel');
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700 flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <GameAssignmentWrapper
      assignmentId={assignmentId}
      gameId="conjugation-duel"
      studentId={user.id}
      onAssignmentComplete={handleAssignmentComplete}
      onBackToAssignments={handleBackToAssignments}
      onBackToMenu={handleBackToMenu}
    >
      {({ assignment, vocabulary, onProgressUpdate, onGameComplete }) => (
        <ConjugationDuelAssignmentGame
          assignment={assignment}
          vocabulary={vocabulary}
          onProgressUpdate={onProgressUpdate}
          onGameComplete={onGameComplete}
          onBackToMenu={handleBackToMenu}
        />
      )}
    </GameAssignmentWrapper>
  );
}

// Assignment-specific Conjugation Duel game component
interface ConjugationDuelAssignmentGameProps {
  assignment: AssignmentData;
  vocabulary: StandardVocabularyItem[];
  onProgressUpdate: (progress: Partial<GameProgress>) => void;
  onGameComplete: (finalProgress: GameProgress) => void;
  onBackToMenu: () => void;
}

function ConjugationDuelAssignmentGame({
  assignment,
  vocabulary,
  onProgressUpdate,
  onGameComplete,
  onBackToMenu
}: ConjugationDuelAssignmentGameProps) {
  // Filter vocabulary to only include verbs
  const verbs = vocabulary.filter(word => 
    word.part_of_speech === 'v' || 
    word.part_of_speech === 'verb' ||
    word.word.includes('(to)')
  );

  const [currentVerbIndex, setCurrentVerbIndex] = React.useState(0);
  const [verbsCompleted, setVerbsCompleted] = React.useState(0);
  const [correctConjugations, setCorrectConjugations] = React.useState(0);
  const [duelsWon, setDuelsWon] = React.useState(0);
  const [sessionData, setSessionData] = React.useState({
    totalDuels: 0,
    perfectConjugations: 0,
    totalAttempts: 0,
    averageResponseTime: 0
  });

  const currentVerb = verbs[currentVerbIndex];
  const totalVerbs = verbs.length;

  // Update progress when stats change
  React.useEffect(() => {
    // Use gems-first scoring: 10 XP per correct conjugation
    const score = correctConjugations * 10;
    const accuracy = verbsCompleted > 0 ? (correctConjugations / verbsCompleted) * 100 : 0;
    const maxScore = totalVerbs * 10;

    onProgressUpdate({
      wordsCompleted: verbsCompleted,
      totalWords: totalVerbs,
      score,
      maxScore,
      accuracy,
      sessionData
    });
  }, [verbsCompleted, correctConjugations, sessionData, totalVerbs, onProgressUpdate]);

  const handleVerbComplete = (isCorrect: boolean, responseTime: number) => {
    const newVerbsCompleted = verbsCompleted + 1;
    const newCorrectConjugations = correctConjugations + (isCorrect ? 1 : 0);
    
    setVerbsCompleted(newVerbsCompleted);
    setCorrectConjugations(newCorrectConjugations);
    
    if (isCorrect) {
      setDuelsWon(duelsWon + 1);
    }
    
    // Update session data
    setSessionData(prev => ({
      totalDuels: prev.totalDuels + 1,
      perfectConjugations: prev.perfectConjugations + (isCorrect && responseTime < 15000 ? 1 : 0),
      totalAttempts: prev.totalAttempts + 1,
      averageResponseTime: (prev.averageResponseTime * prev.totalAttempts + responseTime) / (prev.totalAttempts + 1)
    }));

    // Move to next verb or complete assignment
    if (currentVerbIndex < verbs.length - 1) {
      setCurrentVerbIndex(currentVerbIndex + 1);
    } else {
      // Assignment complete - use gems-first scoring
      const score = newCorrectConjugations * 10;
      const accuracy = newVerbsCompleted > 0 ? (newCorrectConjugations / newVerbsCompleted) * 100 : 0;
      const maxScore = totalVerbs * 10;

      onGameComplete({
        assignmentId: assignment.id,
        gameId: 'conjugation-duel',
        studentId: '', // Will be set by wrapper
        wordsCompleted: newVerbsCompleted,
        totalWords: totalVerbs,
        score,
        maxScore,
        accuracy,
        timeSpent: 0, // Will be calculated by wrapper
        completedAt: new Date(),
        sessionData: {
          ...sessionData,
          totalDuels: sessionData.totalDuels + 1,
          perfectConjugations: sessionData.perfectConjugations + (isCorrect && responseTime < 15000 ? 1 : 0)
        }
      });
    }
  };

  if (verbs.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">No verbs available</h2>
          <p className="text-lg mb-6">This assignment doesn't contain any verbs for conjugation practice.</p>
          <button
            onClick={onBackToMenu}
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  if (!currentVerb) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700 flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Assignment Complete!</h2>
          <p className="text-lg mb-6">You've completed all verb conjugations!</p>
          <button
            onClick={onBackToMenu}
            className="bg-white text-red-600 px-6 py-3 rounded-lg hover:bg-gray-100 transition-colors"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-orange-600 to-yellow-700">
      {/* Progress Header */}
      <div className="bg-black/20 backdrop-blur-sm p-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-6">
              <div className="text-sm">
                <span className="font-bold">{verbsCompleted}</span> / {totalVerbs} verbs
              </div>
              <div className="text-sm">
                Duels Won: <span className="font-bold text-yellow-300">{duelsWon}</span>
              </div>
              <div className="text-sm">
                Perfect: <span className="font-bold text-green-300">{sessionData.perfectConjugations}</span>
              </div>
            </div>
            <div className="text-sm">
              Accuracy: <span className="font-bold">{verbsCompleted > 0 ? Math.round((correctConjugations / verbsCompleted) * 100) : 0}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Conjugation Duel Game */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-8 max-w-2xl w-full">
          <div className="text-center text-white">
            <h2 className="text-3xl font-bold mb-2">⚔️ Conjugation Duel!</h2>
            <p className="text-orange-200 mb-8">Verb {currentVerbIndex + 1} of {totalVerbs}</p>
            
            {/* Current Verb Display */}
            <div className="bg-black/30 rounded-lg p-6 mb-6">
              <div className="text-4xl font-bold text-yellow-300 mb-2">
                {currentVerb.word.replace('(to) ', '')}
              </div>
              <div className="text-lg text-gray-300">
                {currentVerb.translation}
              </div>
            </div>

            {/* Conjugation Challenge */}
            <ConjugationDuelChallenge
              verb={currentVerb}
              onComplete={handleVerbComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple conjugation challenge component for assignment mode
interface ConjugationDuelChallengeProps {
  verb: StandardVocabularyItem;
  onComplete: (isCorrect: boolean, responseTime: number) => void;
}

function ConjugationDuelChallenge({ verb, onComplete }: ConjugationDuelChallengeProps) {
  const [userAnswer, setUserAnswer] = React.useState('');
  const [startTime] = React.useState(Date.now());
  const [currentPerson, setCurrentPerson] = React.useState('yo');
  const [showHint, setShowHint] = React.useState(false);

  const persons = ['yo', 'tú', 'él/ella', 'nosotros', 'vosotros', 'ellos/ellas'];
  const verbRoot = verb.word.replace('(to) ', '').replace('ar', '').replace('er', '').replace('ir', '');

  const checkAnswer = () => {
    const responseTime = Date.now() - startTime;
    
    // Simple conjugation check (this would be more sophisticated in a real implementation)
    const isCorrect = userAnswer.toLowerCase().trim().length > 2; // Simplified check
    
    onComplete(isCorrect, responseTime);
    setUserAnswer('');
    setShowHint(false);
    
    // Move to next person or complete
    const currentIndex = persons.indexOf(currentPerson);
    if (currentIndex < persons.length - 1) {
      setCurrentPerson(persons[currentIndex + 1]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswer();
    }
  };

  const handleHint = () => {
    setShowHint(true);
  };

  return (
    <div className="space-y-4">
      <div className="text-xl text-yellow-200 mb-4">
        Conjugate for: <span className="font-bold">{currentPerson}</span>
      </div>
      
      <input
        type="text"
        value={userAnswer}
        onChange={(e) => setUserAnswer(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={`${currentPerson} ${verbRoot}...`}
        className="w-full px-4 py-3 rounded-lg bg-white/20 text-white placeholder-white/60 border border-white/30 focus:border-yellow-300 focus:outline-none"
        autoFocus
      />
      
      {showHint && (
        <div className="text-yellow-200 text-sm">
          💡 Hint: Think about the ending for {currentPerson}
        </div>
      )}
      
      <div className="flex gap-3">
        <button
          onClick={checkAnswer}
          disabled={!userAnswer.trim()}
          className="flex-1 bg-red-500 hover:bg-red-600 disabled:bg-gray-500 text-white font-bold py-3 px-6 rounded-lg transition-colors"
        >
          Attack! ⚔️
        </button>
        
        <button
          onClick={handleHint}
          className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-3 px-4 rounded-lg transition-colors"
        >
          💡
        </button>
      </div>
    </div>
  );
}
