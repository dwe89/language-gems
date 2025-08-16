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

export const useBattle = (language: string = 'spanish', timeLimit: number = 10) => {
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

  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const [isAnswering, setIsAnswering] = useState(false);

  // Get random verb based on current league requirements
  const getRandomVerb = useCallback((language: string = 'spanish'): Verb | null => {
    if (!verbs || !leagues.length) return null;

    // Check if verbs has the expected structure for the language
    if (!verbs[language]) {
      console.error(`Verbs data structure is invalid for ${language}:`, verbs);
      return null;
    }

    const currentLeague = leagues.find(l => l.id === playerStats.currentLeague);
    if (!currentLeague) return null;

    const { verbTypes } = currentLeague;
    const availableVerbs: Verb[] = [];

    // Collect verbs from all allowed types based on language and structure
    verbTypes.forEach(type => {
      if (language === 'spanish') {
        if (type === 'regular') {
          // Handle regular verbs with ar, er, ir endings
          ['ar', 'er', 'ir'].forEach(ending => {
            if (verbs.spanish?.regular?.[ending] && Array.isArray(verbs.spanish.regular[ending])) {
              availableVerbs.push(...verbs.spanish.regular[ending]);
            }
          });
        } else if (type === 'stemChanging') {
          if (verbs.spanish?.stemChanging && Array.isArray(verbs.spanish.stemChanging)) {
            availableVerbs.push(...verbs.spanish.stemChanging);
          }
        } else if (type === 'go_verbs') {
          if (verbs.spanish?.go_verbs && Array.isArray(verbs.spanish.go_verbs)) {
            availableVerbs.push(...verbs.spanish.go_verbs);
          }
        } else if (type === 'irregular') {
          if (verbs.spanish?.irregular && Array.isArray(verbs.spanish.irregular)) {
            availableVerbs.push(...verbs.spanish.irregular);
          }
        } else if (type === 'reflexive') {
          if (verbs.spanish?.reflexive && Array.isArray(verbs.spanish.reflexive)) {
            availableVerbs.push(...verbs.spanish.reflexive);
          }
        } else if (type === 'gustar_like') {
          if (verbs.spanish?.gustar_like && Array.isArray(verbs.spanish.gustar_like)) {
            availableVerbs.push(...verbs.spanish.gustar_like);
          }
        }
      } else if (language === 'french') {
        if (type === 'regular') {
          // Handle regular French verbs with er, ir endings
          ['er', 'ir'].forEach(ending => {
            if (verbs.french?.regular?.[ending] && Array.isArray(verbs.french.regular[ending])) {
              availableVerbs.push(...verbs.french.regular[ending]);
            }
          });
        } else if (type === 'irregular') {
          if (verbs.french?.irregular && Array.isArray(verbs.french.irregular)) {
            availableVerbs.push(...verbs.french.irregular);
          }
        }
      } else if (language === 'german') {
        if (type === 'regular') {
          if (verbs.german?.regular?.weak && Array.isArray(verbs.german.regular.weak)) {
            availableVerbs.push(...verbs.german.regular.weak);
          }
        } else if (type === 'irregular') {
          if (verbs.german?.irregular && Array.isArray(verbs.german.irregular)) {
            availableVerbs.push(...verbs.german.irregular);
          }
        } else if (type === 'separable') {
          if (verbs.german?.separable && Array.isArray(verbs.german.separable)) {
            availableVerbs.push(...verbs.german.separable);
          }
        } else if (type === 'modal') {
          if (verbs.german?.modal && Array.isArray(verbs.german.modal)) {
            availableVerbs.push(...verbs.german.modal);
          }
        }
      }
    });

    if (availableVerbs.length === 0) return null;
    return availableVerbs[Math.floor(Math.random() * availableVerbs.length)];
  }, [verbs, leagues, playerStats.currentLeague]);

  // Get random pronoun based on language
  const getRandomPronoun = useCallback((language: string = 'spanish'): string => {
    let pronouns: string[];

    if (language === 'spanish') {
      pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos'];
    } else if (language === 'french') {
      pronouns = ['je', 'tu', 'il', 'nous', 'vous', 'ils'];
    } else if (language === 'german') {
      pronouns = ['ich', 'du', 'er', 'wir', 'ihr', 'sie'];
    } else {
      pronouns = ['yo', 'tú', 'él', 'nosotros', 'vosotros', 'ellos']; // default to Spanish
    }

    return pronouns[Math.floor(Math.random() * pronouns.length)];
  }, []);

  // Get random tense based on current league
  const getRandomTense = useCallback((): string => {
    const currentLeague = leagues.find(l => l.id === playerStats.currentLeague);
    if (!currentLeague) return 'present';

    const { tenses } = currentLeague;
    let availableTenses = [...tenses];

    // Map arena-specific tense names to actual tense names in verb data
    const tenseMapping: { [key: string]: string[] } = {
      'near_future': ['near_future'],
      'preterite_regular': ['preterite'],
      'preterite_irregular': ['preterite'],
      'present_perfect': ['present_perfect'],
      'past_perfect': ['past_perfect'],
      'future_perfect': ['future_perfect'],
      'conditional_perfect': ['conditional_perfect'],
      'present_subjunctive': ['present_subjunctive'],
      'imperfect_subjunctive': ['imperfect_subjunctive'],
      'reflexive_present': ['present'],
      'reflexive_past': ['preterite'],
      'all_tenses': ['present', 'preterite', 'imperfect', 'future', 'conditional', 'present_perfect', 'present_subjunctive'],
      'subjunctive_perfect': ['present_perfect', 'past_perfect'],
      'passive_voice': ['present', 'preterite'],
      'conditional_clauses': ['conditional', 'imperfect_subjunctive']
    };

    // Expand mapped tenses
    const expandedTenses: string[] = [];
    availableTenses.forEach(tense => {
      if (tenseMapping[tense]) {
        expandedTenses.push(...tenseMapping[tense]);
      } else {
        expandedTenses.push(tense);
      }
    });

    return expandedTenses[Math.floor(Math.random() * expandedTenses.length)];
  }, [leagues, playerStats.currentLeague]);

  // Generate wrong answers for multiple choice
  const generateWrongAnswers = useCallback((correctAnswer: string, verb: Verb, tense: string, language: string = 'spanish'): string[] => {
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
      const randomVerb = getRandomVerb(language);
      if (randomVerb && randomVerb.conjugations[tense]) {
        const randomPronoun = getRandomPronoun(language);
        const randomConjugation = randomVerb.conjugations[tense][randomPronoun];
        if (randomConjugation && randomConjugation !== correctAnswer && !wrongAnswers.includes(randomConjugation)) {
          wrongAnswers.push(randomConjugation);
        }
      }
    }

    // Add some common wrong patterns based on language-specific mistakes
    if (wrongAnswers.length < 3) {
      let commonWrongs: string[] = [];
      if (language === 'spanish') {
        commonWrongs = [
          correctAnswer.replace(/o$/, 'a'),
          correctAnswer.replace(/a$/, 'o'),
          correctAnswer.replace(/s$/, ''),
          correctAnswer + 's',
          correctAnswer.replace(/é$/, 'e'),
          correctAnswer.replace(/ó$/, 'o'),
        ].filter(wrong => wrong !== correctAnswer && wrong.length > 0);
      } else if (language === 'french') {
        commonWrongs = [
          correctAnswer.replace(/e$/, 'es'),
          correctAnswer.replace(/es$/, 'e'),
          correctAnswer.replace(/s$/, ''),
          correctAnswer + 's',
          correctAnswer.replace(/ons$/, 'ez'),
          correctAnswer.replace(/ez$/, 'ons'),
        ].filter(wrong => wrong !== correctAnswer && wrong.length > 0);
      } else if (language === 'german') {
        commonWrongs = [
          correctAnswer.replace(/e$/, 'st'),
          correctAnswer.replace(/st$/, 'e'),
          correctAnswer.replace(/t$/, 'en'),
          correctAnswer.replace(/en$/, 't'),
          correctAnswer + 'e',
        ].filter(wrong => wrong !== correctAnswer && wrong.length > 0);
      }

      commonWrongs.forEach(wrong => {
        if (wrongAnswers.length < 3 && !wrongAnswers.includes(wrong)) {
          wrongAnswers.push(wrong);
        }
      });
    }

    // Fill with placeholder if still not enough
    while (wrongAnswers.length < 3) {
      wrongAnswers.push(`wrong${wrongAnswers.length + 1}`);
    }

    return wrongAnswers.slice(0, 3);
  }, [verbs, getRandomVerb, getRandomPronoun]);

  // Generate new battle question
  const generateQuestion = useCallback((language: string = 'spanish'): BattleQuestion | null => {
    let attempts = 0;
    const maxAttempts = 10;

    while (attempts < maxAttempts) {
      const verb = getRandomVerb(language);
      if (!verb) return null;

      const pronoun = getRandomPronoun(language);
      const tense = getRandomTense();

      // Check if verb has the required tense and pronoun
      if (!verb.conjugations[tense]) {
        attempts++;
        continue;
      }

      // Handle special cases for reflexive and gustar-like verbs
      let correctAnswer: string;

      if (verb.infinitive.includes('se') || verb.infinitive.startsWith('se ')) {
        // Reflexive verb - use reflexive pronouns
        if (!verb.conjugations[tense][pronoun]) {
          attempts++;
          continue;
        }
        correctAnswer = verb.conjugations[tense][pronoun];
      } else if (verb.infinitive === 'gustar') {
        // Gustar-like verb - use special structure
        const gustarKeys = Object.keys(verb.conjugations[tense] || {});
        if (gustarKeys.length === 0) {
          attempts++;
          continue;
        }
        const randomKey = gustarKeys[Math.floor(Math.random() * gustarKeys.length)];
        correctAnswer = verb.conjugations[tense][randomKey];
      } else {
        // Regular verb conjugation
        if (!verb.conjugations[tense][pronoun]) {
          attempts++;
          continue;
        }
        correctAnswer = verb.conjugations[tense][pronoun];
      }

      const wrongAnswers = generateWrongAnswers(correctAnswer, verb, tense, language);
      const options = [correctAnswer, ...wrongAnswers].sort(() => Math.random() - 0.5);

      return {
        verb,
        pronoun,
        tense,
        correctAnswer,
        options,
      };
    }

    // Fallback - return null if no valid question could be generated
    return null;
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
      const nextQuestion = generateQuestion(language);
      setBattleState({ currentQuestion: nextQuestion });
      setIsAnswering(false);
      setTimeLeft(10); // Reset timer
    }, 2000);

  }, [battleState, isAnswering, updateAccuracy, takeDamage, gainExperience, addBattleLog, endBattle, setBattleState, generateQuestion]);

  // Timer effect (only if timeLimit > 0)
  useEffect(() => {
    if (timeLimit <= 0) return;
    if (!battleState.isInBattle || isAnswering || timeLeft <= 0) return;

    const timer = setTimeout(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [battleState.isInBattle, isAnswering, timeLeft, timeLimit]);

  // Time's up effect
  useEffect(() => {
    if (timeLeft === 0 && battleState.isInBattle && !isAnswering) {
      submitAnswer(''); // Submit empty answer (will be wrong)
    }
  }, [timeLeft, battleState.isInBattle, isAnswering, submitAnswer]);

  // Initialize first question when battle starts
  useEffect(() => {
    if (battleState.isInBattle && !battleState.currentQuestion && !isAnswering) {
      const question = generateQuestion(language);
      setBattleState({ currentQuestion: question });
      setTimeLeft(timeLimit);
    }
  }, [battleState.isInBattle, battleState.currentQuestion, isAnswering, generateQuestion, setBattleState, language, timeLimit]);

  return {
    timeLeft,
    isAnswering,
    submitAnswer,
    generateQuestion,
    setTimeLeft,
  };
};
