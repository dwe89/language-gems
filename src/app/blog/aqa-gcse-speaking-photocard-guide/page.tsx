import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Camera, MessageCircle, Target, AlertTriangle, CheckCircle, Star } from 'lucide-react';
import { generateBlogMetadata, generateBlogStructuredData, generateBlogBreadcrumbs } from '../../../lib/seo/blogSEO';

export const metadata: Metadata = generateBlogMetadata({
  title: 'AQA GCSE Speaking: Complete Photocard Guide',
  description: 'Master the AQA GCSE Speaking exam photocard task with our comprehensive guide. Learn scoring criteria, strategies, and common pitfalls for exam success.',
  slug: 'aqa-gcse-speaking-photocard-guide',
  keywords: [
    'AQA GCSE Speaking',
    'photocard task',
    'GCSE Spanish speaking',
    'GCSE French speaking',
    'GCSE German speaking',
    'exam preparation',
    'speaking assessment',
    'GCSE revision'
  ],
  author: 'Daniel Etienne',
  publishedDate: '2024-01-15T10:00:00.000Z',
  category: 'GCSE Exam Preparation',
  tags: ['AQA GCSE', 'Speaking Exam', 'Photocard Task', 'Language Learning'],
  imageUrl: 'https://languagegems.com/images/blog/aqa-gcse-speaking-photocard-og.svg',
  imageAlt: 'AQA GCSE Speaking Photocard Guide - Complete exam preparation resource',
});

export default function AQAGCSESpeakingPhotocardGuide() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateBlogStructuredData({
              title: 'AQA GCSE Speaking: Complete Photocard Guide',
              description: 'Master the AQA GCSE Speaking exam photocard task with our comprehensive guide. Learn scoring criteria, strategies, and common pitfalls for exam success.',
              slug: 'aqa-gcse-speaking-photocard-guide',
              author: 'Daniel Etienne',
              publishedDate: '2024-01-15T10:00:00.000Z',
              category: 'GCSE Exam Preparation',
              keywords: ['AQA GCSE Speaking', 'photocard task', 'GCSE Spanish speaking', 'GCSE French speaking', 'GCSE German speaking', 'exam preparation'],
              imageUrl: 'https://languagegems.com/images/blog/aqa-gcse-speaking-photocard-og.svg',
            }),
            generateBlogBreadcrumbs('AQA GCSE Speaking: Complete Photocard Guide', 'GCSE Exam Preparation')
          ])
        }}
      />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Camera className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  AQA GCSE Speaking: Complete Photocard Guide
                </h1>
                <p className="text-gray-600 mt-2">
                  Your complete guide to mastering the speaking exam's photocard task
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">AQA GCSE</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Speaking Exam</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Teacher Guide</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Article */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-3">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Understanding the Task Structure
              </h2>

              <p className="text-gray-700 mb-4">
                The AQA GCSE Speaking exam's Photocard task is a crucial component that tests students' ability to
                describe, analyze, and discuss visual content. This task is worth <strong>25 marks
                (50% of the speaking test)</strong> and requires students to demonstrate both descriptive skills and conversational fluency.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">Critical Rule: Both Photos Must Be Mentioned</h3>
                    <p className="text-amber-700">
                      <strong>Coverage of the photos does not need to be equal, but candidates are required to say at least one thing about each photo as a minimum requirement.</strong> Always ensure you reference both images
                      using phrases like "In the first photo..." and "In the second photo..."
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Official Timing Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-purple-600" />
                Official AQA Timing Requirements
              </h2>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-blue-50 p-6 rounded-lg border-2 border-blue-200">
                  <h3 className="text-xl font-semibold text-blue-900 mb-4">Foundation Tier</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="font-semibold text-blue-800">Total Time: 4-5 minutes</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-blue-200">
                      <div className="font-medium text-blue-700">Photo Description & Discussion</div>
                      <div className="text-blue-600">4-5 minutes</div>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
                  <h3 className="text-xl font-semibold text-purple-900 mb-4">Higher Tier</h3>
                  <div className="space-y-3">
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="font-semibold text-purple-800">Total Time: 6-7 minutes</div>
                    </div>
                    <div className="bg-white p-3 rounded border border-purple-200">
                      <div className="font-medium text-purple-700">Photo Description & Discussion</div>
                      <div className="text-purple-600">6-7 minutes</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Key Points About Timing</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• These are <strong>recommended</strong> time allocations, not strict requirements</li>
                  <li>• The same photos are used for both Foundation and Higher tiers</li>
                  <li>• Higher tier candidates are expected to provide more detailed responses</li>
                  <li>• Quality of content matters more than exact timing</li>
                </ul>
              </div>
            </div>

            {/* Preparation and Notes */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Preparation Time & Note-Taking</h2>

              <div className="bg-indigo-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-indigo-900 mb-3">What You Can Do During Preparation</h3>
                <ul className="space-y-2 text-indigo-800">
                  <li>• <strong>Study the photocard</strong> during your supervised preparation time</li>
                  <li>• <strong>Make written notes</strong> to help structure your response</li>
                  <li>• <strong>Use your notes</strong> at any time during the speaking task</li>
                  <li>• <strong>Prepare your response</strong> to "Tell me about the photos" (in the target language)</li>
                </ul>
              </div>

              <div className="bg-yellow-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Important Restrictions</h3>
                <ul className="space-y-2 text-yellow-800">
                  <li>• <strong>You cannot place yourself in the photos</strong> during description</li>
                  <li>• <strong>You can give personal responses</strong> related to the description (e.g., "There is a boy playing football. I like football.")</li>
                  <li>• <strong>The conversation is unprepared</strong> - you won't know the questions in advance</li>
                  <li>• <strong>Teachers cannot discuss</strong> preferred topic areas with you beforehand</li>
                </ul>
              </div>
            </div>

            {/* Task Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Target className="w-6 h-6 text-green-600" />
                Official Task Components
              </h2>

              <div className="space-y-6">
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Part 1: Response to Photo Content</h3>
                  <p className="text-gray-600 mb-3 italic">
                    "This is a descriptive task where learners are required to describe the content of the photos."
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Describe what you see in both photographs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Say at least one thing about each photo (minimum requirement)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>Any relevant content will be credited, even outside the prescribed theme</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                      <span>You can give personal responses related to the description</span>
                    </li>
                  </ul>

                  <div className="bg-blue-50 p-4 rounded-lg mt-4">
                    <h4 className="font-semibold text-blue-900 mb-2">Example of Personal Response</h4>
                    <p className="text-blue-800 italic">
                      "There is a boy playing football. I like football." ✅
                    </p>
                    <p className="text-blue-700 text-sm mt-2">
                      You cannot place yourself IN the photos, but you can relate to what you see.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Theme and Topic Strategy */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Theme-Based Approach</h2>
              
              <div className="bg-blue-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-blue-900 mb-3">Key Strategy: Theme Specialization</h3>
                <p className="text-blue-800 mb-4">
                  You'll be given a <strong>theme</strong> that can cover any or all of the three main topics. The most effective 
                  approach is to specialize in <strong>one specific unit within each theme</strong> rather than trying to cover everything broadly.
                </p>
                
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Theme 1: Identity & Culture</h4>
                    <p className="text-sm text-blue-700">Focus on one area like family relationships or cultural traditions</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Theme 2: Local Area & Travel</h4>
                    <p className="text-sm text-blue-700">Specialize in local amenities or holiday experiences</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg border border-blue-200">
                    <h4 className="font-semibold text-blue-900 mb-2">Theme 3: Current & Future Study</h4>
                    <p className="text-sm text-blue-700">Focus on school subjects or career aspirations</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Language Requirements */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Language Requirements & Complex Structures</h2>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">Important Note About Tenses</h3>
                <p className="text-green-800">
                  <strong>Tenses are NOT a specific requirement</strong> for this task. However, they are now included within
                  the "complex language" criteria, so using varied tenses can help boost your score.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Complex Language Features:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Varied tense usage (past, present, future)</li>
                    <li>• Subjunctive mood (where appropriate)</li>
                    <li>• Complex sentence structures</li>
                    <li>• Advanced vocabulary and idioms</li>
                    <li>• Conditional statements</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Essential Phrases:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• "In the first photo..." / "In the second photo..."</li>
                    <li>• "I can see..." / "There is/are..."</li>
                    <li>• "In my opinion..." / "I think that..."</li>
                    <li>• "Compared to..." / "Unlike..."</li>
                    <li>• "This reminds me of..." / "This makes me think of..."</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Scoring Criteria */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">AQA Scoring Criteria Breakdown</h2>

              <div className="space-y-8">
                {/* Foundation Tier */}
                <div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-4 bg-blue-50 p-3 rounded-lg">
                    Foundation Tier Scoring
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Communication Levels</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                          <span className="font-medium">Level 5 (5 marks)</span>
                          <span className="text-green-700">Quite a lot of information conveyed</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                          <span className="font-medium">Level 4 (4 marks)</span>
                          <span className="text-blue-700">Some information conveyed</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-100 rounded">
                          <span className="font-medium">Level 3 (3 marks)</span>
                          <span className="text-yellow-700">Some information, lacks clarity</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                          <span className="font-medium">Level 2 (2 marks)</span>
                          <span className="text-orange-700">Little information conveyed</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                          <span className="font-medium">Level 1 (1 mark)</span>
                          <span className="text-red-700">Very little information</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Minimum Information Pieces</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                          <span className="font-medium">Level 5</span>
                          <span className="text-green-700 font-bold">9 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                          <span className="font-medium">Level 4</span>
                          <span className="text-blue-700 font-bold">7 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-100 rounded">
                          <span className="font-medium">Level 3</span>
                          <span className="text-yellow-700 font-bold">5 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                          <span className="font-medium">Level 2</span>
                          <span className="text-orange-700 font-bold">3 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                          <span className="font-medium">Level 1</span>
                          <span className="text-red-700 font-bold">1 piece</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Higher Tier */}
                <div>
                  <h3 className="text-xl font-semibold text-purple-900 mb-4 bg-purple-50 p-3 rounded-lg">
                    Higher Tier Scoring
                  </h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Communication Levels</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                          <span className="font-medium">Level 5 (5 marks)</span>
                          <span className="text-green-700">A lot of information, always clear</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                          <span className="font-medium">Level 4 (4 marks)</span>
                          <span className="text-blue-700">A lot of information, nearly always clear</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-100 rounded">
                          <span className="font-medium">Level 3 (3 marks)</span>
                          <span className="text-yellow-700">Quite a lot, nearly always clear</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                          <span className="font-medium">Level 2 (2 marks)</span>
                          <span className="text-orange-700">Quite a lot, may lack clarity</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                          <span className="font-medium">Level 1 (1 mark)</span>
                          <span className="text-red-700">Some information, lacks clarity</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-3">Minimum Information Pieces</h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between items-center p-2 bg-green-100 rounded">
                          <span className="font-medium">Level 5</span>
                          <span className="text-green-700 font-bold">15 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-blue-100 rounded">
                          <span className="font-medium">Level 4</span>
                          <span className="text-blue-700 font-bold">13 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-yellow-100 rounded">
                          <span className="font-medium">Level 3</span>
                          <span className="text-yellow-700 font-bold">11 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-orange-100 rounded">
                          <span className="font-medium">Level 2</span>
                          <span className="text-orange-700 font-bold">9 pieces</span>
                        </div>
                        <div className="flex justify-between items-center p-2 bg-red-100 rounded">
                          <span className="font-medium">Level 1</span>
                          <span className="text-red-700 font-bold">7 pieces</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Teaching Strategies */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Teaching Strategies for Success</h2>

              <div className="space-y-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-blue-900 mb-3">Preparation Phase (Classroom Teaching)</h3>
                  <ul className="space-y-2 text-blue-800">
                    <li>• Help students create vocabulary banks for each theme</li>
                    <li>• Practice describing various types of images regularly</li>
                    <li>• Teach opinion phrases and justification structures</li>
                    <li>• Drill complex grammatical structures in context</li>
                    <li>• Use recording activities for self-analysis and peer feedback</li>
                  </ul>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-900 mb-3">Teaching the Photocard Response</h3>
                  <ul className="space-y-2 text-green-800">
                    <li>• Train students to study both photos systematically</li>
                    <li>• Teach planning techniques for including both images</li>
                    <li>• Drill clear photo transition phrases: "In the first photo..."</li>
                    <li>• Encourage connections to personal experiences</li>
                    <li>• Model counting information pieces during practice</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-purple-900 mb-3">Conversation Skills Development</h3>
                  <ul className="space-y-2 text-purple-800">
                    <li>• Practice active listening techniques</li>
                    <li>• Teach students to expand answers with examples</li>
                    <li>• Model asking follow-up questions for engagement</li>
                    <li>• Encourage students to ask for clarification when needed</li>
                    <li>• Practice maintaining natural conversation flow</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Common Student Mistakes */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Student Mistakes & Teaching Solutions</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-900">❌ Common Student Errors</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Only describing one photo</p>
                      <p className="text-red-600 text-sm">Results in automatic mark deduction</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Giving one-word answers</p>
                      <p className="text-red-600 text-sm">Doesn't demonstrate language ability</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Memorizing and reciting scripts</p>
                      <p className="text-red-600 text-sm">Sounds unnatural and inflexible</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Not counting information pieces</p>
                      <p className="text-red-600 text-sm">Falls short of minimum requirements</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-900">✅ Teaching Solutions</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Drill explicit photo referencing</p>
                      <p className="text-green-600 text-sm">Practice "In the first/second photo" phrases</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Teach expansion techniques</p>
                      <p className="text-green-600 text-sm">Add details, opinions, and examples</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Focus on natural communication</p>
                      <p className="text-green-600 text-sm">Encourage genuine, spontaneous responses</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Practice counting during lessons</p>
                      <p className="text-green-600 text-sm">Make information counting a regular activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Practical Example */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Practical Example: Achieving 15 Information Pieces</h2>

              <div className="bg-green-50 p-6 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-green-900 mb-4">Student Response Example (Higher Tier Level 5)</h3>
                <div className="bg-white p-4 rounded border-2 border-green-200">
                  <p className="text-gray-800 leading-relaxed">
                    "In the first photo there is a man <span className="bg-yellow-200 px-1 rounded">(1)</span>, there is a woman <span className="bg-yellow-200 px-1 rounded">(2)</span>, there is a dog <span className="bg-yellow-200 px-1 rounded">(3)</span> and there is a beach <span className="bg-yellow-200 px-1 rounded">(4)</span>. The man has blonde hair <span className="bg-yellow-200 px-1 rounded">(5)</span> and the woman has green eyes <span className="bg-yellow-200 px-1 rounded">(6)</span>. The dog is white <span className="bg-yellow-200 px-1 rounded">(7)</span> and the cat is brown <span className="bg-yellow-200 px-1 rounded">(8)</span>. In the second photo there are six people <span className="bg-yellow-200 px-1 rounded">(9)</span>. They are in a park <span className="bg-yellow-200 px-1 rounded">(10)</span>. They are smiling <span className="bg-yellow-200 px-1 rounded">(11)</span>. It's sunny <span className="bg-yellow-200 px-1 rounded">(12)</span> and in general it's nice weather <span className="bg-yellow-200 px-1 rounded">(13)</span>. The man is wearing a hat <span className="bg-yellow-200 px-1 rounded">(14)</span> and the woman is wearing a green dress <span className="bg-yellow-200 px-1 rounded">(15)</span>."
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-3">Teaching Points for Students</h4>
                  <ul className="space-y-2 text-blue-800 text-sm">
                    <li>• <strong>Count each distinct piece of information</strong> - every noun, adjective, and descriptive detail counts</li>
                    <li>• <strong>Use clear photo transitions</strong> - "In the first photo..." and "In the second photo..."</li>
                    <li>• <strong>Include physical descriptions</strong> - hair color, eye color, clothing details</li>
                    <li>• <strong>Describe settings and atmosphere</strong> - location, weather, mood</li>
                    <li>• <strong>Don't forget numbers</strong> - "six people" counts as one piece of information</li>
                  </ul>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-900 mb-3">Assessment Notes</h4>
                  <ul className="space-y-2 text-purple-800 text-sm">
                    <li>• This example achieves <strong>15 pieces of clear information</strong></li>
                    <li>• Both photos are explicitly referenced</li>
                    <li>• Information is conveyed clearly throughout</li>
                    <li>• Would achieve <strong>Level 5 (5 marks)</strong> for Higher Tier</li>
                    <li>• Simple but effective language structures</li>
                  </ul>
                </div>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg mt-6">
                <h4 className="font-semibold text-amber-900 mb-3">Teacher Guidance</h4>
                <p className="text-amber-800 mb-3">
                  This example demonstrates that students don't need complex language to achieve high marks in the communication criterion.
                  The key is providing sufficient clear, relevant information about both photographs.
                </p>
                <ul className="space-y-1 text-amber-700 text-sm">
                  <li>• Encourage students to count information pieces during practice</li>
                  <li>• Emphasize clarity over complexity for the communication marks</li>
                  <li>• Remind students that every descriptive detail counts</li>
                  <li>• Practice with varied photo types to build confidence</li>
                </ul>
              </div>
            </div>

            {/* References */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">References</h2>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Official AQA Resources</h3>
                <div className="space-y-3 text-sm text-gray-700">
                  <p>
                    AQA (no date) <em>GCSE French, German and Spanish: Getting to grips with the new speaking tests (on-demand)</em>.
                    Webinar. Available at: AQA website (Accessed: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}).
                  </p>
                  <p>
                    All timing requirements, task specifications, and scoring criteria referenced in this guide are taken directly from
                    official AQA GCSE Speaking test documentation and webinar materials.
                  </p>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 text-sm">
                  <strong>Note:</strong> This guide is based on official AQA specifications. Always refer to the most current
                  AQA documentation and your teacher for the latest updates and specific guidance for your exam.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Teaching Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Key Teaching Points
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Teach students to count information pieces during practice</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Emphasize both photos must be mentioned explicitly</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Practice with varied photo types and themes</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Focus on clarity over complexity for communication marks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Prepare theme-specific vocabulary banks</span>
                </li>
              </ul>
            </div>

            {/* Assessment Reminders */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Assessment Reminders</h3>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Mark Deductions</h4>
                  <p className="text-red-800 text-sm">One mark deducted if only one photo is mentioned</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Higher Tier Level 5</h4>
                  <p className="text-green-800 text-sm">Requires 15+ pieces of clear information</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Foundation Tier Level 5</h4>
                  <p className="text-blue-800 text-sm">Requires 9+ pieces of clear information</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
