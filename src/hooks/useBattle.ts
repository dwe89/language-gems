import { useState, useCallback, useEffect } from 'react';
import { useGameStore } from '../store/gameStore';

interface Verb {
  infinitive: string;
  english: string;
  difficulty: number;
  conjugations: {
    [tense: string]: {
      [pronoun: string]: string;
    };
  };
}

interface BattleQuestion {
  verb: Verb;
  pronoun: string;
  tense: string;
  correctAnswer: string;
  options: string[];
}

export const useBattle = () => {
  const {
    battleState,
    setBattleState,
    verbs,
    leagues,
    playerStats,
    gainExperience,
    updateAccuracy,
    addBattleLog,
    takeDamage,
    endBattle,
  } = useGameStore();

  const [timeLeft, setTimeLeft] = useState(10);
  const [isAnswering, setIsAnswering] = useState(false);

  // Get random verb based on current league requirements
  const getRandomVerb = useCallback((): Verb | null => {
    if (!verbs || !leagues.length) return null;

    const currentLeague = leagues.find(l => l.id === playerStats.currentLeague);
    if (!currentLeague) return null;

    const { verbTypes } = currentLeague;
    const availableVerbs: Verb[] = [];

    // Collect verbs from all allowed types
    verbTypes.forEach(type => {
      if (type === 'regular') {
        ['ar', 'er', 'ir'].forEach(ending => {
          if (verbs.spanish.regular[ending]) {
            availableVerbs.push(...verbs.spanish.regular[ending]);
          }
        });
      } else if (verbs.spanish[type]) {
        availableVerbs.push(...verbs.spanish[type]);
      }
    });

    if (availableVerbs.length === 0) return null;
    return availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
  }, [verbs, leagues, playerStats.currentLeague]);

  // Get random pronoun
  const getRandomPronoun = useCallback((): string => {
    const pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
    return pronouns[Math.floor(Math.random() * pronouns.length)];
  }, []);

  // Get random tense based on current league
  const getRandomTense = useCallback((): string => {
    const currentLeague = leagues.find(l => l.id === playerStats.currentLeague);
    if (!currentLeague) return 'present';

    const { tenses } = currentLeague;
    return tenses[Math.floor(Math.random() * tenses.length)];
  }, [leagues, playerStats.currentLeague]);

  // Generate wrong answers for multiple choice
  const generateWrongAnswers = useCallback((correctAnswer: string, verb: Verb, tense: string): string[] => {
    const wrongAnswers: string[] = [];
    
    // Get conjugations from the same verb but different pronouns
    if (verb.conjugations[tense]) {
      Object.values(verb.conjugations[tense]).forEach(conjugation => {
        if (conjugation !== correctAnswer && !wrongAnswers.includes(conjugation)) {
          wrongAnswers.push(conjugation);
        }
      });
    }

    // Add some common conjugations from other verbs if needed
    while (wrongAnswers.length < 3 && verbs) {
      const randomVerb = getRandomVerb();
      if (randomVerb && randomVerb.conjugations[tense]) {
        const randomPronoun = getRandomPronoun();
        const randomConjugation = randomVerb.conjugations[tense][randomPronoun];
        if (randomConjugation && randomConjugation !== correctAnswer && !wrongAnswers.includes(randomConjugation)) {
          wrongAnswers.push(randomConjugation);
        }
      }
    }

    // Fill with placeholder if still not enough
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(`wrong${wrongAnswers.length + 1}`);
    }

    return wrongAnswers.slice(0, 3);
  }, [verbs, getRandomVerb, getRandomPronoun]);

  // Generate new battle question
  const generateQuestion = useCallback((): BattleQuestion | null => {
    const verb = getRandomVerb();
    if (!verb) return null;

    const pronoun = getRandomPronoun();
    const tense = getRandomTense();

    if (!verb.conjugations[tense] || !verb.conjugations[tense][pronoun]) {
      return null;
    }

    const correctAnswer = verb.conjugations[tense][pronoun];
    const wrongAnswers = generateWrongAnswers(correctAnswer, verb, tense);
    const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

    return {
      verb,
      pronoun,
      tense,
      correctAnswer,
      options,
    };
  }, [getRandomVerb, getRandomPronoun, getRandomTense, generateWrongAnswers]);

  // Handle answer submission
  const submitAnswer = useCallback((answer: string) => {
    if (!battleState.currentQuestion || isAnswering) return;

    setIsAnswering(true);
    const isCorrect = answer === battleState.currentQuestion.correctAnswer;
    
    // Update accuracy
    updateAccuracy(isCorrect);

    if (isCorrect) {
      // Correct answer: damage opponent, gain experience
      const damage = Math.floor(Math.random() * 25) + 15; // 15-40 damage
      takeDamage('opponent', damage);
      gainExperience(10);
      addBattleLog(`Correct! You deal ${damage} damage to ${battleState.currentOpponent?.name}!`);
      
      // Check if opponent is defeated
      if (battleState.opponentHealth - damage <= 0) {
        addBattleLog(`${battleState.currentOpponent?.name} is defeated!`);
        gainExperience(50); // Bonus for winning
        endBattle(true);
        return;
      }
    } else {
      // Wrong answer: take damage
      const damage = Math.floor(Math.random() * 20) + 10; // 10-30 damage
      takeDamage('player', damage);
      addBattleLog(`Wrong! ${battleState.currentOpponent?.name} deals ${damage} damage to you!`);
      addBattleLog(`The correct answer was: ${battleState.currentQuestion.correctAnswer}`);
      
      // Check if player is defeated
      if (battleState.playerHealth - damage <= 0) {
        addBattleLog('You have been defeated!');
        endBattle(false);
        return;
      }
    }

    // Generate next question after a short delay
    setTimeout(() => {
      const nextQuestion = generateQuestion();
      setBattleState({ currentQuestion: nextQuestion });
      setIsAnswering(false);
      setTimeLeft(10); // Reset timer
    }, 2000);

  }, [battleState, isAnswering, updateAccuracy, takeDamage, gainExperience, addBattleLog, endBattle, setBattleState, generateQuestion]);

  // Timer effect
  useEffect(() => {
    if (!battleState.isInBattle || isAnswering || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [battleState.isInBattle, isAnswering, timeLeft]);

  // Time's up effect
  useEffect(() => {
    if (timeLeft === 0 && battleState.isInBattle && !isAnswering) {
      submitAnswer(''); // Submit empty answer (will be wrong)
    }
  }, [timeLeft, battleState.isInBattle, isAnswering, submitAnswer]);

  // Initialize first question when battle starts
  useEffect(() => {
    if (battleState.isInBattle && !battleState.currentQuestion && !isAnswering) {
      const question = generateQuestion();
      setBattleState({ currentQuestion: question });
      setTimeLeft(10);
    }
  }, [battleState.isInBattle, battleState.currentQuestion, isAnswering, generateQuestion, setBattleState]);

  return {
    timeLeft,
    isAnswering,
    submitAnswer,
    generateQuestion,
    setTimeLeft,
  };
};
