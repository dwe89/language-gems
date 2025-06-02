'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function GrammarExercisePage() {
  const [currentView, setCurrentView] = useState('overview');
  const [selectedLanguage, setSelectedLanguage] = useState('french');
  
  // Languages available for grammar exercises
  const languages = [
    { id: 'french', name: 'French' },
    { id: 'german', name: 'German' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'mandarin', name: 'Mandarin' },
    { id: 'spanish', name: 'Spanish' },
  ];
  
  // Sample quiz question
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState(false);
  
  const grammarQuizzes: Record<string, {
    title: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: string;
      explanation: string;
    }>;
  }> = {
    french: {
      title: "French Present Tense Conjugation",
      questions: [
        {
          question: "Je _____ au cinéma le weekend. (aller)",
          options: ["alle", "vas", "vais", "allez"],
          correctAnswer: "vais",
          explanation: "The correct conjugation of 'aller' (to go) in the first person singular is 'vais'."
        },
        {
          question: "Tu _____ beaucoup de livres. (lire)",
          options: ["lis", "lit", "lisons", "lisez"],
          correctAnswer: "lis",
          explanation: "The correct conjugation of 'lire' (to read) in the second person singular is 'lis'."
        },
        {
          question: "Ils _____ dans le jardin. (jouer)",
          options: ["joue", "joues", "jouons", "jouent"],
          correctAnswer: "jouent",
          explanation: "The correct conjugation of 'jouer' (to play) in the third person plural is 'jouent'."
        }
      ]
    },
    german: {
      title: "German Case System",
      questions: [
        {
          question: "Ich gebe _____ Mann das Buch. (the, dative)",
          options: ["der", "den", "dem", "des"],
          correctAnswer: "dem",
          explanation: "In the dative case, the masculine definite article 'der' changes to 'dem'."
        },
        {
          question: "Ich sehe _____ Frau. (the, accusative)",
          options: ["der", "die", "den", "das"],
          correctAnswer: "die",
          explanation: "In the accusative case, the feminine definite article 'die' remains 'die'."
        },
        {
          question: "Das Auto _____ Mannes ist rot. (the, genitive)",
          options: ["der", "den", "dem", "des"],
          correctAnswer: "des",
          explanation: "In the genitive case, the masculine definite article 'der' changes to 'des'."
        }
      ]
    },
    japanese: {
      title: "Japanese Particles",
      questions: [
        {
          question: "私___学校に行きます。(I go to school.)",
          options: ["は", "が", "を", "に"],
          correctAnswer: "は",
          explanation: "The particle 'は' (wa) marks the topic of the sentence, which is '私' (watashi) meaning 'I'."
        },
        {
          question: "本___読みます。(I read a book.)",
          options: ["は", "が", "を", "に"],
          correctAnswer: "を",
          explanation: "The particle 'を' (o) marks the direct object of the verb, which is '本' (hon) meaning 'book'."
        },
        {
          question: "学校___行きます。(I go to school.)",
          options: ["は", "が", "を", "に"],
          correctAnswer: "に",
          explanation: "The particle 'に' (ni) indicates the direction or destination, which is '学校' (gakkō) meaning 'school'."
        }
      ]
    },
    mandarin: {
      title: "Mandarin Measure Words",
      questions: [
        {
          question: "三___书 (Three books)",
          options: ["个", "本", "张", "位"],
          correctAnswer: "本",
          explanation: "The measure word for books in Mandarin is '本' (běn)."
        },
        {
          question: "两___人 (Two people)",
          options: ["个", "本", "张", "位"],
          correctAnswer: "位",
          explanation: "The measure word '位' (wèi) is a respectful way to count people."
        },
        {
          question: "五___纸 (Five pieces of paper)",
          options: ["个", "本", "张", "位"],
          correctAnswer: "张",
          explanation: "The measure word for flat objects like paper is '张' (zhāng)."
        }
      ]
    },
    spanish: {
      title: "Spanish Verb Conjugation",
      questions: [
        {
          question: "Yo _____ español. (hablar)",
          options: ["hablo", "hablas", "habla", "hablan"],
          correctAnswer: "hablo",
          explanation: "The correct conjugation of 'hablar' (to speak) in the first person singular is 'hablo'."
        },
        {
          question: "Tú _____ mucho. (comer)",
          options: ["como", "comes", "come", "comen"],
          correctAnswer: "comes",
          explanation: "The correct conjugation of 'comer' (to eat) in the second person singular is 'comes'."
        },
        {
          question: "Ellos _____ al parque. (ir)",
          options: ["voy", "vas", "va", "van"],
          correctAnswer: "van",
          explanation: "The correct conjugation of 'ir' (to go) in the third person plural is 'van'."
        }
      ]
    }
  };
  
  const selectedQuiz = grammarQuizzes[selectedLanguage] || grammarQuizzes.french;
  const currentQuestion = selectedQuiz.questions[currentQuestionIndex];
  
  const checkAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerChecked(true);
  };
  
  const nextQuestion = () => {
    setSelectedAnswer(null);
    setIsAnswerChecked(false);
    setCurrentQuestionIndex((prevIndex) => 
      (prevIndex + 1) % selectedQuiz.questions.length
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-gradient-blue-purple">Grammar Exercises</h1>
        <p className="text-xl max-w-2xl mx-auto text-white/80">
          Master language grammar with interactive exercises and quizzes.
        </p>
      </div>
      
      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={() => setCurrentView('overview')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'overview' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setCurrentView('quiz')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'quiz' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Grammar Quiz
          </button>
          <button
            onClick={() => setCurrentView('practice')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'practice' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Practice Exercises
          </button>
          <button
            onClick={() => setCurrentView('reference')}
            className={`px-4 py-2 rounded-md transition-colors ${
              currentView === 'reference' 
                ? 'bg-white/20 text-white font-medium' 
                : 'text-white/70 hover:bg-white/10'
            }`}
          >
            Grammar Reference
          </button>
        </div>
      </div>
      
      <div className="bg-indigo-900/20 backdrop-blur-sm rounded-lg p-6">
        {currentView === 'overview' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Grammar Learning Paths</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div className="bg-indigo-800/40 p-5 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">Why Grammar Matters</h3>
                <p className="mb-4">
                  Grammar provides the structural foundation of language. Understanding grammar rules helps you:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Form sentences correctly</li>
                  <li>Express complex ideas precisely</li>
                  <li>Understand native speakers better</li>
                  <li>Avoid common mistakes and misunderstandings</li>
                  <li>Build confidence in speaking and writing</li>
                </ul>
              </div>
              <div className="bg-indigo-800/40 p-5 rounded-lg">
                <h3 className="text-xl font-bold mb-3 text-pink-300">How to Study Grammar</h3>
                <p className="mb-4">
                  Effective grammar learning combines these approaches:
                </p>
                <ul className="space-y-2 list-disc list-inside">
                  <li>Learn rules in context through examples</li>
                  <li>Practice with interactive exercises</li>
                  <li>Apply grammar in real conversations</li>
                  <li>Review regularly and build progressively</li>
                  <li>Focus on high-frequency patterns first</li>
                </ul>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold mb-4 text-cyan-300">Choose a Language</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-8">
              {languages.map((language) => (
                <button
                  key={language.id}
                  onClick={() => {
                    setSelectedLanguage(language.id);
                    setSelectedAnswer(null);
                    setIsAnswerChecked(false);
                    setCurrentQuestionIndex(0);
                  }}
                  className={`p-4 rounded-lg transition-colors ${
                    selectedLanguage === language.id
                      ? 'bg-indigo-700/70 text-white'
                      : 'bg-indigo-800/30 text-white/80 hover:bg-indigo-700/50'
                  }`}
                >
                  {language.name}
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button
                onClick={() => setCurrentView('quiz')}
                className="gem-button"
              >
                Start Grammar Quiz
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'quiz' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-cyan-300">{selectedQuiz.title}</h2>
              <div className="text-white/70">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </div>
            </div>
            
            <div className="bg-indigo-800/40 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4">{currentQuestion.question}</h3>
              
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => !isAnswerChecked && setSelectedAnswer(option)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${
                      selectedAnswer === option
                        ? isAnswerChecked
                          ? option === currentQuestion.correctAnswer
                            ? 'bg-green-500/30 border border-green-500'
                            : 'bg-red-500/30 border border-red-500'
                          : 'bg-indigo-700/50 border border-indigo-500'
                        : 'bg-indigo-900/30 hover:bg-indigo-800/50'
                    } ${
                      isAnswerChecked && option === currentQuestion.correctAnswer && selectedAnswer !== option
                        ? 'bg-green-500/30 border border-green-500'
                        : ''
                    }`}
                    disabled={isAnswerChecked}
                  >
                    {option}
                  </button>
                ))}
              </div>
              
              {isAnswerChecked && (
                <div className={`p-4 rounded-lg mb-6 ${
                  selectedAnswer === currentQuestion.correctAnswer
                    ? 'bg-green-500/20 border border-green-500/50'
                    : 'bg-red-500/20 border border-red-500/50'
                }`}>
                  <h4 className="font-bold mb-2">
                    {selectedAnswer === currentQuestion.correctAnswer
                      ? 'Correct!'
                      : 'Incorrect!'}
                  </h4>
                  <p>{currentQuestion.explanation}</p>
                </div>
              )}
              
              <div className="flex justify-center">
                {!isAnswerChecked ? (
                  <button
                    onClick={checkAnswer}
                    className="gem-button"
                    disabled={selectedAnswer === null}
                  >
                    Check Answer
                  </button>
                ) : (
                  <button
                    onClick={nextQuestion}
                    className="gem-button"
                  >
                    Next Question
                  </button>
                )}
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentView('overview')}
                className="text-cyan-300 hover:underline"
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'practice' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Practice Grammar Exercises</h2>
            
            <div className="bg-indigo-800/40 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4">{languages.find(l => l.id === selectedLanguage)?.name} Grammar Practice</h3>
              <p className="mb-6">
                Practice makes perfect! Complete these exercises to reinforce your understanding of grammar concepts.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="bg-indigo-900/30 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Fill in the Blanks</h4>
                  <p className="text-white/70 mb-3">Complete sentences with the correct grammatical form</p>
                  <button className="gem-button w-full">Start Exercise</button>
                </div>
                <div className="bg-indigo-900/30 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Sentence Construction</h4>
                  <p className="text-white/70 mb-3">Arrange words to form grammatically correct sentences</p>
                  <button className="gem-button w-full">Start Exercise</button>
                </div>
                <div className="bg-indigo-900/30 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Error Correction</h4>
                  <p className="text-white/70 mb-3">Find and fix grammatical errors in sentences</p>
                  <button className="gem-button w-full">Start Exercise</button>
                </div>
                <div className="bg-indigo-900/30 p-4 rounded-lg">
                  <h4 className="font-bold mb-2">Translation Challenge</h4>
                  <p className="text-white/70 mb-3">Translate sentences using correct grammar</p>
                  <button className="gem-button w-full">Start Exercise</button>
                </div>
              </div>
              
              <div className="text-center mt-6">
                <Link href="/premium" className="purple-gem-button">
                  Access Premium Exercises
                </Link>
              </div>
            </div>
            
            <div className="text-center">
              <button
                onClick={() => setCurrentView('overview')}
                className="text-cyan-300 hover:underline"
              >
                Back to Overview
              </button>
            </div>
          </div>
        )}
        
        {currentView === 'reference' && (
          <div>
            <h2 className="text-2xl font-bold mb-6 text-cyan-300">Grammar Reference</h2>
            
            <div className="bg-indigo-800/40 p-6 rounded-lg mb-8">
              <h3 className="text-xl font-bold mb-4">{languages.find(l => l.id === selectedLanguage)?.name} Grammar Guide</h3>
              
              <p className="mb-6">
                This reference section provides clear explanations of key grammar concepts 
                for {languages.find(l => l.id === selectedLanguage)?.name}. Use it alongside 
                the practice exercises for a comprehensive learning experience.
              </p>
              
              <div className="space-y-4 mb-6">
                <details className="bg-indigo-900/30 p-4 rounded-lg">
                  <summary className="font-bold cursor-pointer">Basic Sentence Structure</summary>
                  <div className="mt-3 pl-4 border-l-2 border-indigo-500">
                    <p>Learn about word order and basic sentence patterns.</p>
                    <button className="text-cyan-300 hover:underline mt-2">View Details</button>
                  </div>
                </details>
                
                <details className="bg-indigo-900/30 p-4 rounded-lg">
                  <summary className="font-bold cursor-pointer">Verb Conjugation</summary>
                  <div className="mt-3 pl-4 border-l-2 border-indigo-500">
                    <p>Master the patterns for conjugating verbs in different tenses.</p>
                    <button className="text-cyan-300 hover:underline mt-2">View Details</button>
                  </div>
                </details>
                
                <details className="bg-indigo-900/30 p-4 rounded-lg">
                  <summary className="font-bold cursor-pointer">Nouns and Articles</summary>
                  <div className="mt-3 pl-4 border-l-2 border-indigo-500">
                    <p>Understand how nouns work with articles and determiners.</p>
                    <button className="text-cyan-300 hover:underline mt-2">View Details</button>
                  </div>
                </details>
                
                <details className="bg-indigo-900/30 p-4 rounded-lg">
                  <summary className="font-bold cursor-pointer">Adjectives and Adverbs</summary>
                  <div className="mt-3 pl-4 border-l-2 border-indigo-500">
                    <p>Learn how to describe nouns and verbs with modifiers.</p>
                    <button className="text-cyan-300 hover:underline mt-2">View Details</button>
                  </div>
                </details>
              </div>
              
              <div className="text-center mt-8">
                <Link href={`/learn/${selectedLanguage}`} className="gem-button">
                  Back to {languages.find(l => l.id === selectedLanguage)?.name} Learning
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 