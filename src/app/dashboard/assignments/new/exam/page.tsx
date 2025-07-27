'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, ChevronRight, Calendar, Users, 
  Clock, FileText, Book, BookOpen
} from 'lucide-react';

// Mock data
const examBoards = [
  { id: '1', name: 'AQA', code: 'aqa' },
  { id: '2', name: 'Edexcel', code: 'edexcel' },
  { id: '3', name: 'OCR', code: 'ocr' },
  { id: '4', name: 'WJEC', code: 'wjec' },
  { id: '5', name: 'CIE', code: 'cie' }
];

const educationLevels = [
  { id: '1', name: 'Primary', code: 'primary' },
  { id: '2', name: 'KS3', code: 'ks3' },
  { id: '3', name: 'KS4 GCSE', code: 'ks4_gcse' },
  { id: '4', name: 'KS5 A Level', code: 'ks5_alevel' }
];

const themes = [
  { 
    id: '1', 
    name: 'Theme 1: People and lifestyle', 
    code: 'Theme1',
    topics: [
      { id: '1', name: 'Identity and relationships with others' },
      { id: '2', name: 'Healthy living and lifestyle' },
      { id: '3', name: 'Education and work' }
    ]
  },
  { 
    id: '2', 
    name: 'Theme 2: Popular culture', 
    code: 'Theme2',
    topics: [
      { id: '4', name: 'Free-time activities' },
      { id: '5', name: 'Customs, festivals and celebrations' },
      { id: '6', name: 'Celebrity culture' }
    ]
  },
  { 
    id: '3', 
    name: 'Theme 3: Communication and the world around us', 
    code: 'Theme3',
    topics: [
      { id: '7', name: 'Travel and tourism, including places of interest' },
      { id: '8', name: 'Media and technology' },
      { id: '9', name: 'The environment and where people live' }
    ]
  }
];

const assessmentTypes = [
  { id: '1', name: 'Reading', code: 'reading' },
  { id: '2', name: 'Writing', code: 'writing' },
  { id: '3', name: 'Speaking', code: 'speaking' },
  { id: '4', name: 'Listening', code: 'listening' }
];

const classes = [
  { id: '1', name: 'Spanish Year 10', studentCount: 28 },
  { id: '2', name: 'Spanish Year 11', studentCount: 24 },
  { id: '3', name: 'French Year 9', studentCount: 30 },
  { id: '4', name: 'German Year 10', studentCount: 18 }
];

export default function NewExamAssignmentPage() {
  const router = useRouter();
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    examBoardId: '',
    educationLevelId: '',
    themeId: '',
    topicId: '',
    assessmentTypeId: '',
    difficultyLevel: 'Foundation',
    classId: '',
    dueDate: '',
    instructions: ''
  });
  
  // Derived state
  const [selectedTopics, setSelectedTopics] = useState<any[]>([]);
  
  // Update available topics when theme changes
  useEffect(() => {
    if (formData.themeId) {
      const theme = themes.find(t => t.id === formData.themeId);
      setSelectedTopics(theme?.topics || []);
      setFormData(prev => ({ ...prev, topicId: '' }));
    } else {
      setSelectedTopics([]);
    }
  }, [formData.themeId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would normally save the assignment to the database
    console.log('Submitting exam assignment:', formData);
    
    // Navigate back to assignments page with error handling
    try {
      router.push('/dashboard/assignments');
    } catch (navError) {
      console.error('Navigation error:', navError);
      window.location.href = '/dashboard/assignments';
    }
  };
  
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center mb-6">
        <Link href="/dashboard/assignments">
          <button className="flex items-center text-blue-500 hover:text-blue-600 mr-2">
            <ChevronLeft className="h-5 w-5 mr-1" />
            Back to Assignments
          </button>
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Exam Assignment</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Basic Details</h2>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assignment Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="e.g. GCSE Spanish Reading Practice"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Instructions (Optional)
                </label>
                <textarea
                  name="instructions"
                  value={formData.instructions}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Any specific instructions for your students..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          
          {/* Exam details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Exam Details</h2>
            <div className="mb-4">
              <Link href="/exams/specification" target="_blank" className="flex items-center text-blue-600 hover:text-blue-800">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 mr-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                View GCSE Spanish Specification
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Exam Board
                </label>
                <select
                  name="examBoardId"
                  value={formData.examBoardId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Exam Board</option>
                  {examBoards.map(board => (
                    <option key={board.id} value={board.id}>
                      {board.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Education Level
                </label>
                <select
                  name="educationLevelId"
                  value={formData.educationLevelId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Level</option>
                  {educationLevels.map(level => (
                    <option key={level.id} value={level.id}>
                      {level.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Theme
                </label>
                <select
                  name="themeId"
                  value={formData.themeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Theme</option>
                  {themes.map(theme => (
                    <option key={theme.id} value={theme.id}>
                      {theme.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <select
                  name="topicId"
                  value={formData.topicId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                  disabled={selectedTopics.length === 0}
                >
                  <option value="">Select Topic</option>
                  {selectedTopics.map(topic => (
                    <option key={topic.id} value={topic.id}>
                      {topic.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assessment Type
                </label>
                <select
                  name="assessmentTypeId"
                  value={formData.assessmentTypeId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Assessment Type</option>
                  {assessmentTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {type.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Difficulty Level
                </label>
                <div className="flex items-center space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficultyLevel"
                      value="Foundation"
                      checked={formData.difficultyLevel === 'Foundation'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Foundation
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="difficultyLevel"
                      value="Higher"
                      checked={formData.difficultyLevel === 'Higher'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Higher
                  </label>
                </div>
              </div>
            </div>
          </div>
          
          {/* Assignment details */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Assignment Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Assign to Class
                </label>
                <select
                  name="classId"
                  value={formData.classId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(cls => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name} ({cls.studentCount} students)
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  type="date"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border rounded-md"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Preview section */}
          <div className="bg-gray-50 p-4 rounded-md border">
            <h3 className="font-medium mb-2">Preview Assessment Link</h3>
            <p className="text-sm text-gray-600 mb-2">
              Students will access the assessment at:
            </p>
            <div className="p-2 bg-white border rounded text-sm font-mono break-all">
              {formData.examBoardId && formData.educationLevelId && formData.themeId && formData.topicId && formData.assessmentTypeId 
                ? `/exams/${examBoards.find(b => b.id === formData.examBoardId)?.code || ''}/${educationLevels.find(l => l.id === formData.educationLevelId)?.code || ''}/${themes.find(t => t.id === formData.themeId)?.code || ''}/${formData.topicId}/${assessmentTypes.find(a => a.id === formData.assessmentTypeId)?.code || ''}?difficulty=${formData.difficultyLevel.toLowerCase()}`
                : 'Complete form to see assessment link'
              }
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Link href="/dashboard/assignments">
              <button 
                type="button"
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </Link>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Create Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 