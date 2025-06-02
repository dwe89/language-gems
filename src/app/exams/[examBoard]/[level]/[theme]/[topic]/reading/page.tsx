'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';

// Sample reading assessment data
const readingAssessment = {
  id: 'reading-1',
  title: 'GCSE Spanish Reading Practice',
  timeLimit: 45, // minutes
  questions: [
    {
      id: 'q1',
      type: 'MultipleChoice',
      text: 'Pedro: Mi asignatura favorita es el dibujo.\n\nInés: Me gustan mucho las clases de informática.\n\nEsteban: Adoro el alemán.\n\nAmanda: Odio las ciencias.',
      instructions: 'Which subject does each teenager mention? Write the correct letter in each box.',
      options: [
        { id: 'a', text: 'Art' },
        { id: 'b', text: 'English' },
        { id: 'c', text: 'French' },
        { id: 'd', text: 'German' },
        { id: 'e', text: 'ICT' },
        { id: 'f', text: 'Science' }
      ],
      subQuestions: [
        { id: 'q1-1', text: 'Pedro', answer: 'a' },
        { id: 'q1-2', text: 'Inés', answer: 'e' },
        { id: 'q1-3', text: 'Esteban', answer: 'd' },
        { id: 'q1-4', text: 'Amanda', answer: 'f' }
      ],
      points: 4
    },
    {
      id: 'q2',
      type: 'MultipleChoice',
      text: 'Una cosa que es muy buena del castillo real es el museo de los reyes. Si hace mucho calor, puede pasar tiempo en los jardines.\nEn Sevilla hay platos típicos como las verduras con jamón, que muchos turistas prefieren. Las personas de Sevilla prefieren el pescado, y no comen mucha carne.\nEs mejor visitar Sevilla en la primavera porque hace menos calor, aunque algunos museos para turistas están cerrados.',
      instructions: 'A very good thing about the castle is the...',
      options: [
        { id: 'a', text: 'Café' },
        { id: 'b', text: 'Garden' },
        { id: 'c', text: 'Museum' }
      ],
      answer: 'c',
      points: 1
    },
    {
      id: 'q3',
      type: 'Matching',
      text: 'You see an online forum. Some Spanish students are describing what they prefer to do in their free time.\n\nAlicia: El sábado pasado gané un partido cuando jugué para mi pueblo. Sin embargo, me gusta mucho más pasar tiempo en las redes sociales. Me encanta subir fotos.\n\nCarlos: No me interesa ningún deporte. En cambio, prefiero ir a las tiendas en mi pueblo. También paso tiempo jugando videojuegos y leyendo en mi habitación.\n\nMargarita: Creo que los deportes son geniales, aunque me parece que el fútbol es menos divertido que otros. Prefiero ver a mis jugadores favoritos jugar al baloncesto.',
      instructions: 'Who dislikes all sport?',
      options: [
        { id: 'a', text: 'Alicia' },
        { id: 'c', text: 'Carlos' },
        { id: 'm', text: 'Margarita' }
      ],
      answer: 'c',
      points: 1
    },
    {
      id: 'q4',
      type: 'TrueOrFalse',
      text: 'When do these events happen according to the article?',
      subQuestions: [
        { 
          id: 'q4-1', 
          text: 'Nuria va a ir al cine mañana con sus amigos.', 
          options: [
            { id: 'p', text: 'Past' },
            { id: 'n', text: 'Now' },
            { id: 'f', text: 'Future' }
          ],
          answer: 'f'
        },
        { 
          id: 'q4-2', 
          text: 'Ayer, mi hermano compró un videojuego nuevo.', 
          options: [
            { id: 'p', text: 'Past' },
            { id: 'n', text: 'Now' },
            { id: 'f', text: 'Future' }
          ],
          answer: 'p'
        },
        { 
          id: 'q4-3', 
          text: 'Estoy estudiando para mi examen de matemáticas.', 
          options: [
            { id: 'p', text: 'Past' },
            { id: 'n', text: 'Now' },
            { id: 'f', text: 'Future' }
          ],
          answer: 'n'
        }
      ],
      points: 3
    },
    {
      id: 'q5',
      type: 'Translation',
      text: 'Translate these sentences into English.',
      subQuestions: [
        { 
          id: 'q5-1', 
          text: 'Mi casa es bonita. Tiene un jardín grande.', 
          answer: 'My house is pretty/beautiful. It has a big/large garden.',
          points: 2
        },
        { 
          id: 'q5-2', 
          text: 'Me encantan las películas aunque pueden ser tontas.', 
          answer: 'I love films/movies although they can be silly/stupid.',
          points: 2
        }
      ],
      points: 4
    }
  ]
};

export default function ReadingAssessmentPage() {
  const router = useRouter();
  const params = useParams<{ examBoard: string; level: string; theme: string; topic: string }>();
  const { examBoard = '', level = '', theme = '', topic = '' } = params || {};
  const searchParams = useSearchParams();
  const difficulty = searchParams?.get('difficulty') || 'foundation';
  
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(readingAssessment.timeLimit * 60); // in seconds
  const [assessmentCompleted, setAssessmentCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Timer effect
  useEffect(() => {
    if (timeRemaining > 0 && !assessmentCompleted) {
      const timerId = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timerId);
    } else if (timeRemaining === 0 && !assessmentCompleted) {
      // Auto-submit when time is up
      handleSubmitAssessment();
    }
  }, [timeRemaining, assessmentCompleted]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  const handleAnswerChange = (questionId: string, subQuestionId: string | null, value: any) => {
    setAnswers((prev) => {
      if (subQuestionId) {
        return {
          ...prev,
          [questionId]: {
            ...prev[questionId],
            [subQuestionId]: value
          }
        };
      }
      return {
        ...prev,
        [questionId]: value
      };
    });
  };
  
  const handleNextQuestion = () => {
    if (currentQuestionIndex < readingAssessment.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const calculateScore = () => {
    let totalScore = 0;
    
    readingAssessment.questions.forEach(question => {
      if (question.type === 'MultipleChoice' && 'subQuestions' in question) {
        question.subQuestions.forEach(subQ => {
          if (answers[question.id]?.[subQ.id] === subQ.answer) {
            totalScore += 1;
          }
        });
      } else if (question.type === 'MultipleChoice' || question.type === 'Matching') {
        if (answers[question.id] === question.answer) {
          totalScore += question.points;
        }
      } else if (question.type === 'TrueOrFalse' && 'subQuestions' in question) {
        question.subQuestions.forEach(subQ => {
          if (answers[question.id]?.[subQ.id] === subQ.answer) {
            totalScore += 1;
          }
        });
      } else if (question.type === 'Translation' && 'subQuestions' in question) {
        // For translation, we'll just count it as correct for this demo
        question.subQuestions.forEach(subQ => {
          if (answers[question.id]?.[subQ.id]) {
            totalScore += 1;
          }
        });
      }
    });
    
    return totalScore;
  };
  
  const handleSubmitAssessment = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setAssessmentCompleted(true);
    
    // Here you would normally save the results to the database
  };
  
  const currentQuestion = readingAssessment.questions[currentQuestionIndex];
  
  const renderQuestion = (question: any) => {
    switch (question.type) {
      case 'MultipleChoice':
        if ('subQuestions' in question) {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border mb-4 whitespace-pre-line">
                {question.text}
              </div>
              <p className="font-medium">{question.instructions}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  {question.subQuestions.map((subQ: any) => (
                    <div key={subQ.id} className="mb-3 flex items-center">
                      <span className="font-medium mr-4">{subQ.text}</span>
                      <select
                        className="border rounded p-2"
                        value={answers[question.id]?.[subQ.id] || ''}
                        onChange={(e) => handleAnswerChange(question.id, subQ.id, e.target.value)}
                      >
                        <option value="">Select...</option>
                        {question.options.map((option: any) => (
                          <option key={option.id} value={option.id}>
                            {option.id.toUpperCase()}: {option.text}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-4 rounded border">
                  <h3 className="font-medium mb-2">Options:</h3>
                  <ul className="list-none space-y-1">
                    {question.options.map((option: any) => (
                      <li key={option.id}>
                        {option.id.toUpperCase()}: {option.text}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          );
        } else {
          return (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded border mb-4 whitespace-pre-line">
                {question.text}
              </div>
              <p className="font-medium">{question.instructions}</p>
              <div className="space-y-2">
                {question.options.map((option: any) => (
                  <label key={option.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                    <input
                      type="radio"
                      name={question.id}
                      value={option.id}
                      checked={answers[question.id] === option.id}
                      onChange={() => handleAnswerChange(question.id, null, option.id)}
                      className="mr-3"
                    />
                    {option.text}
                  </label>
                ))}
              </div>
            </div>
          );
        }
      case 'Matching':
        return (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded border mb-4 whitespace-pre-line">
              {question.text}
            </div>
            <p className="font-medium">{question.instructions}</p>
            <div className="space-y-2">
              {question.options.map((option: any) => (
                <label key={option.id} className="flex items-center p-3 border rounded hover:bg-gray-50">
                  <input
                    type="radio"
                    name={question.id}
                    value={option.id}
                    checked={answers[question.id] === option.id}
                    onChange={() => handleAnswerChange(question.id, null, option.id)}
                    className="mr-3"
                  />
                  {option.text}
                </label>
              ))}
            </div>
          </div>
        );
      case 'TrueOrFalse':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.text}</p>
            {question.subQuestions.map((subQ: any) => (
              <div key={subQ.id} className="p-4 border rounded mb-4">
                <p className="mb-2 whitespace-pre-line">{subQ.text}</p>
                <div className="space-y-2">
                  {subQ.options.map((option: any) => (
                    <label key={option.id} className="flex items-center p-2 border rounded hover:bg-gray-50">
                      <input
                        type="radio"
                        name={subQ.id}
                        value={option.id}
                        checked={answers[question.id]?.[subQ.id] === option.id}
                        onChange={() => handleAnswerChange(question.id, subQ.id, option.id)}
                        className="mr-3"
                      />
                      {option.text}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );
      case 'Translation':
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.text}</p>
            {question.subQuestions.map((subQ: any) => (
              <div key={subQ.id} className="p-4 border rounded mb-4">
                <p className="mb-2 font-medium whitespace-pre-line">{subQ.text}</p>
                <textarea
                  className="w-full p-2 border rounded"
                  rows={3}
                  placeholder="Enter your translation here..."
                  value={answers[question.id]?.[subQ.id] || ''}
                  onChange={(e) => handleAnswerChange(question.id, subQ.id, e.target.value)}
                />
                <p className="mt-1 text-sm text-gray-500">{subQ.points} {subQ.points === 1 ? 'mark' : 'marks'}</p>
              </div>
            ))}
          </div>
        );
      default:
        return <p>Unsupported question type</p>;
    }
  };
  
  const renderResults = () => {
    const totalPoints = readingAssessment.questions.reduce((acc, q) => acc + q.points, 0);
    const percentage = Math.round((score / totalPoints) * 100);
    
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center">Assessment Completed</h2>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <p className="text-lg mb-2">Your score:</p>
          <p className="text-4xl font-bold text-blue-600">{score} / {totalPoints}</p>
          <p className="text-xl mt-2">{percentage}%</p>
        </div>
        
        <div className="flex justify-center space-x-4 mt-6">
          <button
            onClick={() => router.push(`/exams/${examBoard}/${level}/${theme}/${topic}`)}
            className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Back to Topic
          </button>
          <button
            onClick={() => {
              setAnswers({});
              setCurrentQuestionIndex(0);
              setTimeRemaining(readingAssessment.timeLimit * 60);
              setAssessmentCompleted(false);
              setScore(0);
            }}
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {!assessmentCompleted ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={() => router.push(`/exams/${examBoard}/${level}/${theme}/${topic}`)}
              className="flex items-center text-blue-500 hover:text-blue-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Exit Assessment
            </button>
            <div className="flex items-center space-x-4">
              <div className="text-sm">
                Difficulty: <span className="font-semibold capitalize">{difficulty}</span>
              </div>
              <div className={`text-sm font-medium ${timeRemaining < 300 ? 'text-red-500' : 'text-gray-700'}`}>
                Time Remaining: <span className="font-bold">{formatTime(timeRemaining)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white shadow-md rounded-lg p-6 mb-6">
            <h1 className="text-2xl font-bold mb-2">{readingAssessment.title}</h1>
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {readingAssessment.questions.length}
              </p>
              <p className="text-sm text-gray-500">
                {currentQuestion.points} {currentQuestion.points === 1 ? 'mark' : 'marks'}
              </p>
            </div>
            
            {renderQuestion(currentQuestion)}
          </div>
          
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-4 py-2 rounded ${
                currentQuestionIndex === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-gray-500 text-white hover:bg-gray-600'
              }`}
            >
              Previous
            </button>
            
            {currentQuestionIndex === readingAssessment.questions.length - 1 ? (
              <button
                onClick={handleSubmitAssessment}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Submit Assessment
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Next
              </button>
            )}
          </div>
        </>
      ) : (
        renderResults()
      )}
    </div>
  );
} 