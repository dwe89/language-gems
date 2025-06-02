'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ExamBoard } from './types';

// Mock data for exam boards
const examBoards = [
  {
    id: '1',
    name: 'AQA',
    code: 'aqa',
    description: 'Assessment and Qualifications Alliance (AQA) is one of the major exam boards in the UK.',
    logoUrl: '/images/exam-boards/aqa-logo.png'
  },
  {
    id: '2',
    name: 'Edexcel',
    code: 'edexcel',
    description: 'Edexcel is a British multinational education and examination body.',
    logoUrl: '/images/exam-boards/edexcel-logo.png'
  },
  {
    id: '3',
    name: 'OCR',
    code: 'ocr',
    description: 'Oxford, Cambridge and RSA Examinations (OCR) is a UK exam board and awarding body.',
    logoUrl: '/images/exam-boards/ocr-logo.png'
  },
  {
    id: '4',
    name: 'WJEC',
    code: 'wjec',
    description: 'WJEC is a leading awarding organisation providing assessment, training and educational resources in Wales, the UK and internationally.',
    logoUrl: '/images/exam-boards/wjec-logo.png'
  },
  {
    id: '5',
    name: 'CIE',
    code: 'cie',
    description: 'Cambridge International Examinations (CIE) offers a wide range of academic and vocational qualifications around the world.',
    logoUrl: '/images/exam-boards/cie-logo.png'
  }
];

export default function ExamsPage() {
  const router = useRouter();
  const [selectedBoard, setSelectedBoard] = useState<string | null>(null);

  const handleExamBoardSelect = (boardCode: string) => {
    setSelectedBoard(boardCode);
    router.push(`/exams/${boardCode}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center">Select an Exam Board</h1>
      
      <div className="flex justify-center mb-6">
        <Link href="/exams/specification">
          <button className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            View GCSE Spanish Specification
          </button>
        </Link>
      </div>
      
      <p className="text-center mb-8 text-gray-600">
        Choose the exam board that you are preparing for or that follows your curriculum
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {examBoards.map((board) => (
          <div 
            key={board.id}
            className={`rounded-lg border p-6 hover:shadow-lg transition-all cursor-pointer ${
              selectedBoard === board.code ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
            }`}
            onClick={() => handleExamBoardSelect(board.code)}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{board.name}</h2>
              {board.logoUrl && (
                <div className="h-12 w-12 relative">
                  <Image 
                    src={board.logoUrl}
                    alt={`${board.name} Logo`}
                    fill
                    className="object-contain"
                  />
                </div>
              )}
            </div>
            
            <p className="text-gray-600 text-sm">{board.description}</p>
            
            <div className="mt-4 flex justify-end">
              <button 
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  handleExamBoardSelect(board.code);
                }}
              >
                Select
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 