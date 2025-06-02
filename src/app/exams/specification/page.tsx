'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function SpecificationPage() {
  const router = useRouter();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const toggleSection = (section: string) => {
    if (expandedSection === section) {
      setExpandedSection(null);
    } else {
      setExpandedSection(section);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-4">
        <button
          onClick={() => router.push('/exams')}
          className="flex items-center text-blue-500 hover:text-blue-600"
        >
          <ChevronLeft className="h-5 w-5 mr-1" />
          Back to Exam Boards
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-center">GCSE Spanish Specification Overview</h1>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">2.0 Specification at a glance</h2>
        <p className="mb-4">This qualification is linear. Linear means that students will sit all their exams at the end of the course.</p>
        
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
          <h3 className="text-lg font-medium mb-2">Important Note:</h3>
          <p>GCSE Spanish has a Foundation tier (grades 1–5) and a Higher tier (grades 4–9). Students must take all four question papers at the same tier. All question papers must be taken in the same series.</p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('subject-content')}
        >
          <h2 className="text-2xl font-semibold">2.1 Subject content</h2>
          {expandedSection === 'subject-content' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        
        {expandedSection === 'subject-content' && (
          <div className="mt-4">
            <p className="mb-4">Assessment is set in the context of these three themes:</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-50 p-4 rounded-lg border border-pink-100">
                <h3 className="font-medium mb-2">Theme 1: People and lifestyle</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Identity and relationships with others</li>
                  <li>Healthy living and lifestyle</li>
                  <li>Education and work</li>
                </ul>
                <div className="mt-3">
                  <Link href="/exams/aqa/ks4_gcse/Theme1">
                    <button className="px-3 py-1 bg-pink-500 text-white rounded hover:bg-pink-600 transition-colors text-sm">
                      Explore Theme
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                <h3 className="font-medium mb-2">Theme 2: Popular culture</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Free-time activities</li>
                  <li>Customs, festivals and celebrations</li>
                  <li>Celebrity culture</li>
                </ul>
                <div className="mt-3">
                  <Link href="/exams/aqa/ks4_gcse/Theme2">
                    <button className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors text-sm">
                      Explore Theme
                    </button>
                  </Link>
                </div>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <h3 className="font-medium mb-2">Theme 3: Communication and the world around us</h3>
                <ul className="list-disc pl-5 text-sm">
                  <li>Travel and tourism, including places of interest</li>
                  <li>Media and technology</li>
                  <li>The environment and where people live</li>
                </ul>
                <div className="mt-3">
                  <Link href="/exams/aqa/ks4_gcse/Theme3">
                    <button className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors text-sm">
                      Explore Theme
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div 
          className="flex justify-between items-center cursor-pointer"
          onClick={() => toggleSection('assessments')}
        >
          <h2 className="text-2xl font-semibold">2.2 Assessments</h2>
          {expandedSection === 'assessments' ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </div>
        
        {expandedSection === 'assessments' && (
          <div className="mt-4 space-y-6">
            {/* Paper 1: Listening */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-blue-50 p-4 border-b">
                <h3 className="text-xl font-medium">Paper 1: Listening</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Understanding and responding to spoken extracts comprising the defined vocabulary and grammar for each tier</li>
                    <li>Dictation of short, spoken extracts</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">How it's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Written exam: 35 minutes (Foundation tier), 45 minutes (Higher tier)</li>
                    <li>40 marks (Foundation tier), 50 marks (Higher tier)</li>
                    <li>25% of GCSE</li>
                    <li>Recording controlled by the invigilator with built-in repetitions and pauses.</li>
                  </ul>
                  <p className="mt-2">Each exam includes 5 minutes' reading time at the start of the question paper before the listening material is played and 2 minutes at the end of the recording for students to check their work.</p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Questions</h4>
                  <ul className="list-disc pl-5">
                    <li>Section A – listening comprehension questions in English, to be answered in English or non-verbally (32 marks at Foundation tier and 40 marks at Higher tier)</li>
                    <li>Section B – dictation where students transcribe short sentences, including a small number of words from outside the prescribed vocabulary list (8 marks at Foundation tier and 10 marks at Higher tier)</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Link href="/exams/aqa/ks4_gcse/listening">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
                      Practice Listening
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Paper 2: Speaking */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-green-50 p-4 border-b">
                <h3 className="text-xl font-medium">Paper 2: Speaking</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Speaking using clear and comprehensible language to undertake a Role-play</li>
                    <li>Carry out a Reading aloud task</li>
                    <li>Talk about visual stimuli</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">How it's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Non-exam assessment (NEA)</li>
                    <li>7–9 minutes (Foundation tier) + 15 minutes' supervised preparation time</li>
                    <li>10–12 minutes (Higher tier) + 15 minutes' supervised preparation time</li>
                    <li>50 marks (for each of Foundation tier and Higher tier)</li>
                    <li>25% of GCSE</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Questions</h4>
                  <p className="mb-2">The format is the same at Foundation tier and Higher tier, but with different stimulus materials for the Role-play and the Reading aloud task. For the Photo card task, the same photos are used at both tiers.</p>
                  <ul className="list-disc pl-5">
                    <li><strong>Role-play</strong> – 10 marks (recommended to last between 1 and 1.5 minutes at both tiers)</li>
                    <li><strong>Reading aloud task and short conversation</strong> – 15 marks (recommended to last in total between 2 and 2.5 minutes at Foundation tier and between 3 and 3.5 minutes at Higher tier)
                      <ul className="list-disc pl-5 mt-1">
                        <li>Reading aloud task: minimum 35 words of text at Foundation tier and 50 words at Higher tier</li>
                        <li>Short unprepared conversation</li>
                      </ul>
                    </li>
                    <li><strong>Photo card discussion</strong> – 25 marks (recommended to last between 4 and 5 minutes in total at Foundation tier, and between 6 and 7 minutes in total at Higher tier)
                      <ul className="list-disc pl-5 mt-1">
                        <li>Response to the content of the photos on the card (recommended to last approximately 1 minute at Foundation tier and approximately 1.5 minutes at Higher tier)</li>
                        <li>Unprepared conversation (recommended to last between 3 and 4 minutes at Foundation tier and between 4.5 and 5.5 minutes at Higher tier)</li>
                      </ul>
                    </li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Link href="/exams/aqa/ks4_gcse/speaking">
                    <button className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors">
                      Practice Speaking
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Paper 3: Reading */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-purple-50 p-4 border-b">
                <h3 className="text-xl font-medium">Paper 3: Reading</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Understanding and responding to written texts which focus predominantly on the vocabulary and grammar at each tier</li>
                    <li>Inferring plausible meanings of single words when they are embedded in written sentences</li>
                    <li>Translating from Spanish into English</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">How it's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Written exam: 45 minutes (Foundation tier), 1 hour (Higher tier)</li>
                    <li>50 marks (for each of Foundation tier and Higher tier)</li>
                    <li>25% of GCSE</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Questions</h4>
                  <ul className="list-disc pl-5">
                    <li>Section A – reading comprehension questions in English, to be answered in English or non-verbally (40 marks)</li>
                    <li>Section B – translation from Spanish into English, minimum of 35 words at Foundation tier and 50 words at Higher tier (10 marks)</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Link href="/exams/aqa/ks4_gcse/reading">
                    <button className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 transition-colors">
                      Practice Reading
                    </button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Paper 4: Writing */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-amber-50 p-4 border-b">
                <h3 className="text-xl font-medium">Paper 4: Writing</h3>
              </div>
              <div className="p-4">
                <div className="mb-4">
                  <h4 className="font-medium mb-2">What's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Writing text in the language in a lexically and grammatically accurate way in response to simple and familiar stimuli</li>
                    <li>Translating from English into Spanish</li>
                  </ul>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-medium mb-2">How it's assessed</h4>
                  <ul className="list-disc pl-5">
                    <li>Written exam: 1 hour 10 minutes (Foundation tier), 1 hour 15 minutes (Higher tier)</li>
                    <li>50 marks (for each of Foundation tier and Higher tier)</li>
                    <li>25% of GCSE</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Questions</h4>
                  <h5 className="font-medium text-sm mt-3 mb-1">Foundation tier</h5>
                  <ul className="list-disc pl-5">
                    <li>Question 1 – student produces five short sentences in response to a photo (10 marks)</li>
                    <li>Question 2 – student produces a short piece of writing in response to five compulsory bullet points, approximately 50 words in total (10 marks)</li>
                    <li>Question 3 – student completes five short grammar tasks (5 marks)</li>
                    <li>Question 4 – translation of sentences from English into Spanish, minimum 35 words in total (10 marks)</li>
                    <li>Question 5 (overlap question) – student produces a piece of writing in response to three compulsory bullet points, approximately 90 words in total. There is a choice from two questions (15 marks)</li>
                  </ul>
                  
                  <h5 className="font-medium text-sm mt-3 mb-1">Higher tier</h5>
                  <ul className="list-disc pl-5">
                    <li>Question 1 – translation of sentences from English into Spanish, minimum 50 words in total (10 marks)</li>
                    <li>Question 2 (overlap question) – student produces a piece of writing in response to three compulsory bullet points, approximately 90 words in total. There is a choice from two questions (15 marks)</li>
                    <li>Question 3 – open-ended writing task (student responds to two bullets, producing approximately 150 words in total). There is a choice from two questions (25 marks)</li>
                  </ul>
                </div>
                
                <div className="mt-4">
                  <Link href="/exams/aqa/ks4_gcse/writing">
                    <button className="px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition-colors">
                      Practice Writing
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      <div className="flex justify-center mt-8">
        <Link href="/exams/aqa/ks4_gcse">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Start Exam Preparation
          </button>
        </Link>
      </div>
    </div>
  );
} 