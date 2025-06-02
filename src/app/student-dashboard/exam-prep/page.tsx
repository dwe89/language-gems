'use client';

import React from 'react';
import Link from 'next/link';
import { 
  Calendar, Clock, Book, FileText, BarChart2, 
  CheckCircle, X, AlertTriangle, Hexagon, Award,
  BookOpen, FileType, Layers, List
} from 'lucide-react';

type ExamCard = {
  id: string;
  title: string;
  date: string;
  timeLeft: string;
  level: string;
  topics: string[];
  progress: number;
};

type PracticeTest = {
  id: string;
  title: string;
  questions: number;
  duration: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  isCompleted?: boolean;
  score?: number;
};

// Exam preparation card
const ExamCard = ({ exam }: { exam: ExamCard }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">{exam.title}</h3>
        <div className="text-xs font-semibold bg-pink-500 text-white px-3 py-1 rounded-full">
          {exam.level}
        </div>
      </div>
      
      <div className="flex items-center text-gray-600 mb-3">
        <Calendar className="h-4 w-4 mr-2" />
        <span className="text-sm">{exam.date}</span>
      </div>
      
      <div className="flex items-center text-gray-600 mb-4">
        <Clock className="h-4 w-4 mr-2" />
        <span className="text-sm">Time remaining: {exam.timeLeft}</span>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-1">
          <span>Preparation Progress</span>
          <span>{exam.progress}%</span>
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-pink-500 rounded-full" 
            style={{ width: `${exam.progress}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mb-4">
        <p className="text-sm font-medium mb-2">Topics to focus on:</p>
        <div className="flex flex-wrap gap-2">
          {exam.topics.map((topic, index) => (
            <span 
              key={index}
              className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded-full"
            >
              {topic}
            </span>
          ))}
        </div>
      </div>
      
      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-2 rounded-lg transition-colors">
        Continue Preparation
      </button>
    </div>
  );
};

// Practice test card
const PracticeTestCard = ({ test }: { test: PracticeTest }) => {
  const difficultyColors = {
    'Easy': 'text-green-600',
    'Medium': 'text-yellow-600',
    'Hard': 'text-red-600'
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-500">
      <h3 className="text-lg font-bold mb-3">{test.title}</h3>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center text-gray-600">
          <FileText className="h-4 w-4 mr-2" />
          <span className="text-sm">{test.questions} questions</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Clock className="h-4 w-4 mr-2" />
          <span className="text-sm">{test.duration}</span>
        </div>
        <div className="flex items-center text-gray-600">
          <Book className="h-4 w-4 mr-2" />
          <span className="text-sm">{test.category}</span>
        </div>
        <div className={`flex items-center ${difficultyColors[test.difficulty]}`}>
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">{test.difficulty}</span>
        </div>
      </div>
      
      {test.isCompleted ? (
        <div className="mb-4">
          <div className="flex items-center text-green-600 mb-2">
            <CheckCircle className="h-5 w-5 mr-2" />
            <span className="font-medium">Completed</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm">Your score:</span>
            <span className={`font-bold ${test.score && test.score >= 70 ? 'text-green-600' : 'text-red-600'}`}>
              {test.score}%
            </span>
          </div>
        </div>
      ) : (
        <div className="mb-4">
          <div className="flex items-center text-blue-600">
            <Clock className="h-5 w-5 mr-2" />
            <span className="font-medium">Ready to take</span>
          </div>
        </div>
      )}
      
      <button 
        className={`w-full py-2 rounded-lg transition-colors ${
          test.isCompleted 
            ? 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {test.isCompleted ? 'Review Test' : 'Start Test'}
      </button>
    </div>
  );
};

// Study resource card
const StudyResourceCard = ({ 
  title, 
  description, 
  icon, 
  color = 'bg-indigo-500' 
}: { 
  title: string; 
  description: string; 
  icon: React.ReactNode;
  color?: string;
}) => {
  return (
    <div className="bg-white rounded-xl p-6 shadow-md flex">
      <div className={`${color} text-white p-3 rounded-full h-12 w-12 flex items-center justify-center mr-4 flex-shrink-0`}>
        {icon}
      </div>
      <div>
        <h3 className="font-bold text-lg mb-1">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
        <button className="mt-3 text-indigo-600 font-medium text-sm hover:underline">
          Access Resource →
        </button>
      </div>
    </div>
  );
};

// Exam board card
const ExamBoardCard = ({
  name,
  description,
  code,
  imageSrc
}: {
  name: string;
  description: string;
  code: string;
  imageSrc?: string;
}) => {
  return (
    <Link href={`/exams/${code}`}>
      <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-all cursor-pointer border-l-4 border-pink-500">
        <div className="flex items-start">
          {imageSrc && (
            <div className="w-16 h-16 mr-4 bg-gray-100 rounded-lg flex items-center justify-center">
              <img 
                src={imageSrc} 
                alt={`${name} logo`} 
                className="h-12 w-12 object-contain"
              />
            </div>
          )}
          <div>
            <h3 className="text-xl font-bold mb-2">{name}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <span className="text-pink-600 font-medium text-sm">
            Explore Curriculum →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default function ExamPrepPage() {
  // Sample data
  const upcomingExams: ExamCard[] = [
    {
      id: '1',
      title: 'Spanish Language Certification',
      date: 'June 15, 2023',
      timeLeft: '21 days',
      level: 'Advanced',
      topics: ['Verb Conjugation', 'Conversation', 'Reading Comprehension'],
      progress: 65
    },
    {
      id: '2',
      title: 'French Basic Proficiency',
      date: 'July 3, 2023',
      timeLeft: '39 days',
      level: 'Beginner',
      topics: ['Vocabulary', 'Grammar', 'Listening'],
      progress: 30
    }
  ];
  
  const practiceTests: PracticeTest[] = [
    {
      id: '1',
      title: 'Grammar Fundamentals',
      questions: 30,
      duration: '45 minutes',
      difficulty: 'Medium',
      category: 'Grammar',
      isCompleted: true,
      score: 85
    },
    {
      id: '2',
      title: 'Vocabulary Assessment',
      questions: 50,
      duration: '60 minutes',
      difficulty: 'Hard',
      category: 'Vocabulary',
      isCompleted: true,
      score: 62
    },
    {
      id: '3',
      title: 'Listening Comprehension',
      questions: 25,
      duration: '40 minutes',
      difficulty: 'Medium',
      category: 'Listening',
    },
    {
      id: '4',
      title: 'Basic Reading Test',
      questions: 20,
      duration: '30 minutes',
      difficulty: 'Easy',
      category: 'Reading',
    }
  ];
  
  // Exam boards
  const examBoards = [
    {
      name: 'AQA',
      code: 'aqa',
      description: 'Assessment and Qualifications Alliance (AQA) is one of the major exam boards in the UK.',
      imageSrc: '/images/exam-boards/aqa-logo.png'
    },
    {
      name: 'Edexcel',
      code: 'edexcel',
      description: 'Edexcel is a British multinational education and examination body.',
      imageSrc: '/images/exam-boards/edexcel-logo.png'
    },
    {
      name: 'OCR',
      code: 'ocr',
      description: 'Oxford, Cambridge and RSA Examinations (OCR) is a UK exam board and awarding body.',
      imageSrc: '/images/exam-boards/ocr-logo.png'
    }
  ];
  
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Exam Preparation</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Upcoming Exams</h2>
              <Link href="/student-dashboard/assignments">
                <span className="text-indigo-600 text-sm hover:underline cursor-pointer">View All</span>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingExams.map(exam => (
                <ExamCard key={exam.id} exam={exam} />
              ))}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Exam Boards</h2>
              <Link href="/exams">
                <span className="text-indigo-600 text-sm hover:underline cursor-pointer">View All</span>
              </Link>
            </div>
            
            <p className="text-gray-600 mb-6">
              Select an exam board to access curriculum materials, past papers, and practice assessments.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {examBoards.map(board => (
                <ExamBoardCard 
                  key={board.code} 
                  name={board.name} 
                  description={board.description} 
                  code={board.code}
                  imageSrc={board.imageSrc}
                />
              ))}
            </div>
          </div>
        </div>
        
        <div>
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">Study Resources</h2>
              <Link href="/student-dashboard/resources">
                <span className="text-indigo-600 text-sm hover:underline cursor-pointer">View All</span>
              </Link>
            </div>
            
            <div className="space-y-4">
              <Link href="/exams/specification">
                <StudyResourceCard
                  title="GCSE Spanish Specification"
                  description="Complete overview of the GCSE Spanish curriculum, assessment papers, and grading structure."
                  icon={<BookOpen className="h-5 w-5" />}
                  color="bg-red-500"
                />
              </Link>
              
              <StudyResourceCard
                title="GCSE Curriculum Guide"
                description="Comprehensive guide to the GCSE language curriculum and requirements."
                icon={<BookOpen className="h-5 w-5" />}
                color="bg-emerald-500"
              />
              
              <StudyResourceCard
                title="Vocabulary Lists"
                description="Essential vocabulary organized by theme and topic."
                icon={<List className="h-5 w-5" />}
                color="bg-blue-500"
              />
              
              <StudyResourceCard
                title="Grammar Guides"
                description="Learn the most important grammar rules for your exams."
                icon={<FileType className="h-5 w-5" />}
                color="bg-purple-500"
              />
              
              <StudyResourceCard
                title="Theme Overviews"
                description="Quick reference guides for each GCSE theme."
                icon={<Layers className="h-5 w-5" />}
                color="bg-amber-500"
              />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl shadow-md p-6">
            <h2 className="text-lg font-bold mb-3">Need Help?</h2>
            <p className="mb-4">
              Our teachers are available to help you prepare for your language exams.
            </p>
            <Link href="/student-dashboard/support">
              <button className="bg-white text-indigo-600 hover:bg-gray-100 font-medium py-2 px-4 rounded-lg w-full transition-colors">
                Book a Tutor Session
              </button>
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">Available Practice Tests</h2>
          <Link href="/exams">
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors">
              Take a New Test
            </button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {practiceTests.map(test => (
            <PracticeTestCard key={test.id} test={test} />
          ))}
        </div>
      </div>
    </div>
  );
} 