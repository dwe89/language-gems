'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, Clock, Mic, MicOff, Play, Pause, 
  AlertCircle, CheckCircle, X, HelpCircle, Camera
} from 'lucide-react';
import Image from 'next/image';

type SpeakingTask = {
  id: string;
  type: 'role-play' | 'reading-aloud' | 'photo-card';
  title: string;
  description: string;
  tier: 'foundation' | 'higher' | 'both';
  content: {
    rolePlay?: {
      scenario: string;
      prompts: string[];
    };
    readingText?: string;
    photoCard?: {
      imageSrc: string;
      questionPrompts: string[];
      conversationTopics: string[];
    };
  };
  preparationTime: number; // in seconds
  expectedDuration: number; // in seconds
  marks: number;
};

const speakingTasks: SpeakingTask[] = [
  {
    id: 'role-play-1',
    type: 'role-play',
    title: 'Role Play: At a Spanish Restaurant',
    description: 'You are in a restaurant in Spain. You are speaking with the waiter.',
    tier: 'foundation',
    content: {
      rolePlay: {
        scenario: 'You are at a restaurant in Spain. You are speaking with the waiter.',
        prompts: [
          'Say hello and ask for a table for two people.',
          'Say what you would like to eat.',
          'Ask for the price.',
          'Say you want to pay by card.',
          'Thank the waiter and say goodbye.'
        ]
      }
    },
    preparationTime: 60,
    expectedDuration: 90,
    marks: 10
  },
  {
    id: 'role-play-2',
    type: 'role-play',
    title: 'Role Play: At a Tourist Information Center',
    description: 'You are at a tourist information center in Madrid. You need some information.',
    tier: 'higher',
    content: {
      rolePlay: {
        scenario: 'You are at a tourist information center in Madrid. You need some information about local attractions.',
        prompts: [
          'Greet the assistant and ask for information about popular attractions.',
          'Ask about the opening times of the museums.',
          'Say you are also interested in historical sites and ask for recommendations.',
          'Ask how to get to one of the recommended places.',
          'Thank the assistant and say you will come back if you have more questions.'
        ]
      }
    },
    preparationTime: 60,
    expectedDuration: 90,
    marks: 10
  },
  {
    id: 'reading-aloud-1',
    type: 'reading-aloud',
    title: 'Reading Aloud: Daily Routine',
    description: 'Read this text aloud and then answer questions about your daily routine.',
    tier: 'foundation',
    content: {
      readingText: 'Todos los días me despierto a las siete de la mañana. Después de ducharme, desayuno un vaso de zumo de naranja, tostadas y un café. Luego voy al colegio en autobús. Las clases empiezan a las ocho y media y terminan a las tres menos cuarto. Por la tarde, hago los deberes y a veces juego al fútbol con mis amigos. Por la noche, ceno con mi familia y veo un poco la televisión antes de acostarme.'
    },
    preparationTime: 30,
    expectedDuration: 60,
    marks: 15
  },
  {
    id: 'reading-aloud-2',
    type: 'reading-aloud',
    title: 'Reading Aloud: Environmental Issues',
    description: 'Read this text aloud and then answer questions about environmental issues.',
    tier: 'higher',
    content: {
      readingText: 'El cambio climático es uno de los problemas más graves que afecta nuestro planeta. La contaminación del aire y de los océanos, la deforestación y el uso excesivo de plásticos son factores que contribuyen al deterioro del medio ambiente. Es fundamental que tomemos medidas urgentes como reducir nuestro consumo de energía, utilizar transportes públicos y reciclar más. Además, los gobiernos deberían implementar políticas más estrictas para proteger el medio ambiente y fomentar el uso de energías renovables.'
    },
    preparationTime: 45,
    expectedDuration: 90,
    marks: 15
  },
  {
    id: 'photo-card-1',
    type: 'photo-card',
    title: 'Photo Card: Family Celebration',
    description: 'Look at the photo and prepare to talk about it. You will then have a conversation about families and celebrations.',
    tier: 'both',
    content: {
      photoCard: {
        imageSrc: '/images/exam/family-celebration.jpg',
        questionPrompts: [
          'What can you see in the photo?',
          'What type of celebration do you think this is?',
          'What are the people doing?',
          'How do you think they are feeling?'
        ],
        conversationTopics: [
          'Tell me about your family.',
          'What family celebrations are important in your country?',
          'How do you celebrate special occasions with your family?',
          'What are the advantages of having big family celebrations?',
          'Do you prefer small or large family gatherings? Why?'
        ]
      }
    },
    preparationTime: 60,
    expectedDuration: 240,
    marks: 25
  },
  {
    id: 'photo-card-2',
    type: 'photo-card',
    title: 'Photo Card: Technology and Social Media',
    description: 'Look at the photo and prepare to talk about it. You will then have a conversation about technology and social media.',
    tier: 'both',
    content: {
      photoCard: {
        imageSrc: '/images/exam/technology-social-media.jpg',
        questionPrompts: [
          'What can you see in the photo?',
          'What do you think the people are doing?',
          'How important is technology in this scene?',
          'How do you think the people are feeling?'
        ],
        conversationTopics: [
          'How do you use technology in your daily life?',
          'What are the advantages and disadvantages of social media?',
          'How has technology changed education?',
          'Do you think people spend too much time using technology? Why?',
          'How do you think technology will change in the future?'
        ]
      }
    },
    preparationTime: 60,
    expectedDuration: 300,
    marks: 25
  },
];

// Languages available for practice
const languages = [
  { id: 'spanish', name: 'Spanish', flag: '🇪🇸' },
  { id: 'french', name: 'French', flag: '🇫🇷' },
  { id: 'german', name: 'German', flag: '🇩🇪' },
  { id: 'italian', name: 'Italian', flag: '🇮🇹' }
];

export default function SpeakingPracticePage() {
  const router = useRouter();
  
  // State
  const [tier, setTier] = useState<'foundation' | 'higher'>('foundation');
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [selectedLanguage, setSelectedLanguage] = useState('spanish');
  const [preparationMode, setPreparationMode] = useState(false);
  const [examMode, setExamMode] = useState(false);
  const [timerValue, setTimerValue] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordings, setRecordings] = useState<{[key: string]: string}>({});
  const [currentConversationTopic, setCurrentConversationTopic] = useState(0);
  
  // Refs
  const audioChunksRef = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  
  // Get filtered tasks based on tier
  const filteredTasks = speakingTasks.filter(task => 
    task.tier === tier || task.tier === 'both'
  );
  
  // Get selected task
  const selectedTask = selectedTaskId 
    ? speakingTasks.find(t => t.id === selectedTaskId) 
    : null;
  
  // Format time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Handle timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTimerRunning && timerValue > 0) {
      interval = setInterval(() => {
        setTimerValue(prev => prev - 1);
      }, 1000);
    } else if (timerValue === 0 && preparationMode) {
      // Preparation time is over, move to exam mode
      setPreparationMode(false);
      setExamMode(true);
      
      if (selectedTask) {
        setTimerValue(selectedTask.expectedDuration);
        setIsTimerRunning(true);
      }
    }
    
    return () => clearInterval(interval);
  }, [isTimerRunning, timerValue, preparationMode, selectedTask]);
  
  // Start task preparation
  const startPreparation = (taskId: string) => {
    setSelectedTaskId(taskId);
    const task = speakingTasks.find(t => t.id === taskId);
    
    if (task) {
      setTimerValue(task.preparationTime);
      setPreparationMode(true);
      setIsTimerRunning(true);
    }
  };
  
  // Start recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];
      
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(audioBlob);
        
        if (selectedTaskId) {
          setRecordings({
            ...recordings,
            [selectedTaskId]: audioUrl
          });
        }
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone. Please check your microphone permissions.');
    }
  };
  
  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };
  
  // Pause/resume timer
  const toggleTimer = () => {
    setIsTimerRunning(!isTimerRunning);
  };
  
  // Reset everything and go back to task selection
  const resetTask = () => {
    setSelectedTaskId(null);
    setPreparationMode(false);
    setExamMode(false);
    setTimerValue(0);
    setIsTimerRunning(false);
    setIsRecording(false);
    setCurrentConversationTopic(0);
    
    // Stop any recording in progress
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
    }
  };
  
  // Go to next conversation topic
  const nextConversationTopic = () => {
    if (selectedTask?.content.photoCard) {
      setCurrentConversationTopic(prev => 
        Math.min(prev + 1, selectedTask.content.photoCard!.conversationTopics.length - 1)
      );
    }
  };
  
  // Go to previous conversation topic
  const previousConversationTopic = () => {
    setCurrentConversationTopic(prev => Math.max(prev - 1, 0));
  };
  
  // Render task section
  const renderTaskSection = () => {
    if (preparationMode && selectedTask) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Preparation Time</h2>
          <div className="mb-4 bg-yellow-50 p-4 rounded-md border border-yellow-100">
            <p className="font-medium text-yellow-800">
              Use this time to prepare your responses. In the real exam, you would be given preparation materials.
            </p>
          </div>
          
          {renderTaskContent(true)}
        </div>
      );
    } else if (examMode && selectedTask) {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Speaking Assessment</h2>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <span className="text-sm text-gray-600">
                Task: {selectedTask.title}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={isRecording ? stopRecording : startRecording}
                className={`flex items-center px-3 py-1 rounded-md ${
                  isRecording 
                    ? 'bg-red-100 text-red-700 border border-red-300' 
                    : 'bg-green-100 text-green-700 border border-green-300'
                }`}
              >
                {isRecording ? <MicOff className="h-4 w-4 mr-1" /> : <Mic className="h-4 w-4 mr-1" />}
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>
          
          {renderTaskContent(false)}
          
          {recordings[selectedTaskId] && (
            <div className="mt-6 p-4 bg-gray-50 rounded-md border">
              <h3 className="font-medium mb-2">Your Recording</h3>
              <audio controls src={recordings[selectedTaskId]} className="w-full" />
            </div>
          )}
        </div>
      );
    } else {
      return (
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Select a Speaking Task</h2>
          <p className="text-gray-600 mb-6">
            Choose a speaking task to practice. Each task represents a different component of the GCSE {languages.find(l => l.id === selectedLanguage)?.name || 'Spanish'} speaking assessment.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {filteredTasks.map(task => (
              <div 
                key={task.id} 
                className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => startPreparation(task.id)}
              >
                <div className={`p-3 ${
                  task.type === 'role-play' 
                    ? 'bg-blue-50 border-b border-blue-100' 
                    : task.type === 'reading-aloud'
                    ? 'bg-green-50 border-b border-green-100'
                    : 'bg-purple-50 border-b border-purple-100'
                }`}>
                  <h3 className="font-medium">{task.title}</h3>
                </div>
                
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{task.marks} marks</span>
                    <span>Prep: {formatTime(task.preparationTime)} • Duration: {formatTime(task.expectedDuration)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }
  };
  
  // Render task content based on type
  const renderTaskContent = (isPrepMode: boolean) => {
    if (!selectedTask) return null;
    
    switch (selectedTask.type) {
      case 'role-play':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-2">Role-play Scenario:</h3>
            <p className="mb-4">{selectedTask.content.rolePlay?.scenario}</p>
            
            <h3 className="font-medium mb-2">Your Task:</h3>
            <ul className="space-y-2 mb-4">
              {selectedTask.content.rolePlay?.prompts.map((prompt, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span>{prompt}</span>
                </li>
              ))}
            </ul>
            
            {!isPrepMode && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  In the actual exam, the examiner would play the role of the other person. Practice responding to each prompt in Spanish.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'reading-aloud':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-2">Reading Text:</h3>
            <div className="bg-green-50 p-3 rounded-md border border-green-100 mb-4">
              <p className="text-green-800">{selectedTask.content.readingText}</p>
            </div>
            
            {!isPrepMode && (
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  Read the text aloud in Spanish, paying attention to pronunciation and intonation. After reading, you would typically have a short conversation about the topic.
                </p>
              </div>
            )}
          </div>
        );
        
      case 'photo-card':
        return (
          <div className="bg-white rounded-lg border p-4">
            <h3 className="font-medium mb-3">Photo Card:</h3>
            <div className="mb-4">
              <div className="relative h-64 w-full mb-4 border rounded bg-gray-100 flex items-center justify-center">
                <Camera className="h-12 w-12 text-gray-400" />
                <p className="absolute bottom-0 left-0 right-0 bg-gray-800 bg-opacity-70 text-white p-2 text-sm text-center">
                  [Example photo would appear here]
                </p>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="font-medium mb-2">Questions about the photo:</h3>
              <ul className="space-y-2">
                {selectedTask.content.photoCard?.questionPrompts.map((prompt, idx) => (
                  <li key={idx} className="flex items-start">
                    <span className="bg-purple-100 text-purple-800 rounded-full h-5 w-5 flex items-center justify-center text-xs mr-2 flex-shrink-0">
                      {idx + 1}
                    </span>
                    <span>{prompt}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            {!isPrepMode && (
              <div className="mt-6">
                <h3 className="font-medium mb-2">Conversation Topic:</h3>
                <div className="bg-purple-50 p-3 rounded-md border border-purple-100 mb-4">
                  <p className="text-purple-800 font-medium">
                    {selectedTask.content.photoCard?.conversationTopics[currentConversationTopic]}
                  </p>
                </div>
                
                <div className="flex justify-between">
                  <button
                    onClick={previousConversationTopic}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    disabled={currentConversationTopic === 0}
                  >
                    Previous Topic
                  </button>
                  <button
                    onClick={nextConversationTopic}
                    className="px-3 py-1 border rounded-md text-sm disabled:opacity-50"
                    disabled={currentConversationTopic === (selectedTask.content.photoCard?.conversationTopics.length || 0) - 1}
                  >
                    Next Topic
                  </button>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return <p>Task content not available</p>;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <Link href="/exams/aqa/ks4_gcse">
            <button className="flex items-center text-blue-500 hover:text-blue-600">
              <ChevronLeft className="h-5 w-5 mr-1" />
              Back to GCSE
            </button>
          </Link>
          
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="flex items-center text-blue-500 hover:text-blue-600"
          >
            <HelpCircle className="h-5 w-5 mr-1" />
            {showHelp ? 'Hide Help' : 'Show Help'}
          </button>
        </div>
        
        <h1 className="text-3xl font-bold mt-4 text-center mb-6">
          GCSE {languages.find(l => l.id === selectedLanguage)?.name || 'Spanish'} Speaking Practice
        </h1>
        
        {!selectedTaskId && (
          <div className="max-w-xl mx-auto mb-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Language
              </label>
              <div className="flex gap-2">
                {languages.map(language => (
                  <button
                    key={language.id}
                    onClick={() => setSelectedLanguage(language.id)}
                    className={`px-3 py-2 rounded-md border ${
                      selectedLanguage === language.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className="mr-2">{language.flag}</span>
                    {language.name}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Tier
              </label>
              <div className="flex gap-2">
                <button
                  onClick={() => setTier('foundation')}
                  className={`px-4 py-2 rounded-md border ${
                    tier === 'foundation'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Foundation Tier (Grades 1–5)
                </button>
                <button
                  onClick={() => setTier('higher')}
                  className={`px-4 py-2 rounded-md border ${
                    tier === 'higher'
                      ? 'bg-blue-50 border-blue-500 text-blue-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  Higher Tier (Grades 4–9)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Help panel */}
      {showHelp && (
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <h3 className="font-bold text-lg mb-2">Speaking Assessment Tips</h3>
          <ul className="space-y-2">
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Speak clearly and at a natural pace, don't rush your responses</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>Use a range of vocabulary and grammatical structures appropriate to your tier</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>During photo discussions, describe what you see and give your opinions</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>For role-plays, make sure you cover all the bullet points in your responses</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-1" />
              <span>For reading aloud, focus on pronunciation, intonation and rhythm</span>
            </li>
          </ul>
          <button
            onClick={() => setShowHelp(false)}
            className="mt-3 text-blue-600 hover:underline text-sm"
          >
            Hide Tips
          </button>
        </div>
      )}
      
      {/* Assessment content */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Timer and controls */}
        {(preparationMode || examMode) && (
          <div className="bg-gray-50 px-6 py-3 border-b flex justify-between items-center">
            <div className="flex items-center">
              <span className="font-medium mr-2">
                {preparationMode ? 'Preparation Time:' : 'Speaking Time:'}
              </span>
              <span className={`font-mono ${timerValue < 10 ? 'text-red-600' : ''}`}>
                {formatTime(timerValue)}
              </span>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={toggleTimer}
                className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded border text-sm flex items-center"
              >
                {isTimerRunning ? <Pause className="h-4 w-4 mr-1" /> : <Play className="h-4 w-4 mr-1" />}
                {isTimerRunning ? 'Pause' : 'Resume'}
              </button>
              
              <button
                onClick={resetTask}
                className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-700 rounded border text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        
        {/* Main content */}
        {renderTaskSection()}
      </div>
    </div>
  );
} 