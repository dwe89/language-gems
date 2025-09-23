import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, BookOpen, CheckCircle, AlertTriangle, MessageSquare, Mic, Image, FileText, Target, Zap, Award, ArrowRight } from 'lucide-react';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getArticleSchema } from '../../../lib/seo/structuredData';
import { generateMetadata } from '../../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Everything You Need to Know About the New AQA Speaking Exam',
  description: 'Complete guide to the new AQA Speaking exam changes. Learn about roleplay modifications, reading aloud task, photocard updates, and marking criteria for GCSE success.',
  keywords: [
    'AQA speaking exam',
    'new GCSE speaking exam',
    'AQA speaking changes',
    'GCSE speaking assessment',
    'reading aloud task',
    'speaking exam roleplay',
    'AQA photocard',
    'GCSE speaking marks',
    'speaking exam preparation'
  ],
  canonical: '/blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam',
  ogImage: '/images/blog/aqa-speaking-exam-og.jpg',
  ogType: 'article',
  publishedTime: '2025-06-24T20:08:43Z',
  modifiedTime: '2025-06-24T20:08:43Z',
});

export default function AQASpeakingExamBlogPost() {
  const articleSchema = getArticleSchema({
    title: 'Everything You Need to Know About the New AQA Speaking Exam',
    description: 'Complete guide to the new AQA Speaking exam changes. Learn about roleplay modifications, reading aloud task, photocard updates, and marking criteria for GCSE success.',
    url: '/blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam',
    publishedTime: '2025-06-24T20:08:43Z',
    modifiedTime: '2025-06-24T20:08:43Z',
    author: 'LanguageGems Team',
    image: '/images/blog/aqa-speaking-exam-og.jpg'
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'New AQA Speaking Exam Guide', url: '/blog/everything-you-need-to-know-about-the-new-aqa-speaking-exam' }
  ];

  return (
    <SEOWrapper structuredData={articleSchema} breadcrumbs={breadcrumbs}>
      <article className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <header className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <BookOpen className="w-4 h-4" />
                AQA Speaking Exam Guide
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Everything You Need to Know About the
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> New AQA Speaking Exam</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Master the new AQA Speaking exam with our comprehensive guide. Learn about roleplay changes, reading aloud tasks, and marking criteria to achieve top grades in your GCSE speaking assessment.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>LanguageGems Team</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>June 24, 2025</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>10 min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed mb-8">
                The AQA Speaking exam has undergone significant changes designed to better assess real-world communication skills and reduce emphasis on memorized language. These updates aim to create a more authentic assessment of students' ability to communicate spontaneously and fluently.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100 mb-12">
                <div className="flex items-start gap-4">
                  <AlertTriangle className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Why These Changes Matter</h2>
                    <p className="text-slate-700 leading-relaxed">
                      The new specification shifts focus from testing memorized grammar and vocabulary to assessing genuine communication skills. Students now need to demonstrate fluency, pronunciation, and the ability to respond spontaneously — skills that are essential for real-world language use.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Differences Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Key Differences: Old vs New Specification
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Understanding how the exam has changed is crucial for effective preparation
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <MessageSquare className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Roleplay Marks</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">15 marks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-blue-600">10 marks</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <AlertTriangle className="w-6 h-6 text-orange-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Unexpected Questions</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">Included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-green-600">Removed</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <Mic className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Reading Aloud</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">Not included</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-green-600">5 marks</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <Image className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Photocard Marks</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">15 marks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-blue-600">5 marks</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <Target className="w-6 h-6 text-indigo-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">General Conversation</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">30 marks</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-blue-600">20 marks</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-blue-100">
                <div className="flex items-center mb-4">
                  <CheckCircle className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Knowledge & Use of Language</h3>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">Old:</span>
                    <span className="font-semibold text-slate-900">Assessed</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600">New:</span>
                    <span className="font-semibold text-red-600">Removed</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <Zap className="w-6 h-6 text-yellow-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Critical Change: Every Sentence Must Include a Verb</h3>
                  <p className="text-slate-700 mb-4">
                    The most significant change affects how students respond in roleplay. One-word answers or verb-less responses are no longer acceptable.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium mb-2">❌ No longer acceptable:</p>
                    <p className="text-slate-700 italic">"How many hours a week do you go to the cinema?" — "Three."</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mt-4">
                    <p className="text-green-800 font-medium mb-2">✅ Required format:</p>
                    <p className="text-slate-700 italic">"How many hours a week do you go to the cinema?" — "I go three times a week."</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Exam Components Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                New Exam Components in Detail
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Master each part of the new speaking exam with our detailed breakdown
              </p>
            </div>

            <div className="space-y-12">
              {/* Roleplay */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-8 border border-blue-100">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 mr-4">Roleplay (10 marks) — 20% of total</h3>
                      <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">Foundation: 7-9 min | Higher: 10-12 min</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Key Changes:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Every sentence <strong>must include a verb</strong></span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">All questions now in <strong>English</strong></span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">No unexpected questions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Informal, social context</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Example Response:</h4>
                        <div className="bg-white rounded-lg p-4 border border-slate-200">
                          <p className="text-slate-700 italic mb-2">"How many hours a week do you go to the cinema?"</p>
                          <p className="text-blue-700 font-medium">"I usually go twice a week. I enjoy watching films."</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Reading Aloud + Short Conversation */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center">
                      <Mic className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 mr-4">Reading Aloud + Short Conversation (15 marks) — 30% of total</h3>
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">New Task</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Reading Aloud:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Foundation: ~35 words</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Higher: ~50 words</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Multiple attempts allowed</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Tests pronunciation & fluency</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Short Conversation:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Four present tense questions</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Build responses with 2+ clauses</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Include verbs in every sentence</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Photocard Discussion + Unprepared Conversation */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-8 border border-green-100">
                <div className="flex items-start gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center">
                      <Image className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="flex items-center mb-4">
                      <h3 className="text-2xl font-bold text-slate-900 mr-4">Photocard Discussion + Unprepared Conversation (25 marks) — 50% of total</h3>
                      <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Most Important</span>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Photocard (5 marks):</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Two photos to discuss</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700"><strong>Both photos must be mentioned</strong></span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Theme provided by examiner</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Compare and contrast images</span>
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Unprepared Conversation (20 marks):</h4>
                        <ul className="space-y-2">
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Foundation: 9 clear information points</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Higher: 15 clear information points</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Spontaneous, natural speech</span>
                          </li>
                          <li className="flex items-start">
                            <CheckCircle className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-slate-700">Complex language earns higher marks</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Response Examples Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Response Development Examples
              </h2>
              <p className="text-xl text-slate-600">
                Learn how to build effective responses at Foundation and Higher levels
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Foundation */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Award className="w-6 h-6 text-blue-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-900">Foundation Level</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Good Development (2 clauses):</h4>
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <p className="text-green-800 italic">"I like swimming and I play tennis."</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Minimal Development (extra info):</h4>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800 italic">"I eat pizza and pasta."</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Limited Response:</h4>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-800 italic">"I study maths."</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Higher */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Award className="w-6 h-6 text-purple-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-900">Higher Level</h3>
                </div>

                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-2">Extended Response (3+ clauses):</h4>
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                      <p className="text-purple-800 italic">"I usually read books at home and sometimes I go to the library. I find reading very relaxing and it helps me learn new vocabulary."</p>
                    </div>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-yellow-800 font-medium mb-1">Pro Tip:</p>
                        <p className="text-yellow-700 text-sm">Use complex sentences, varied vocabulary, and appropriate tenses to maximize your marks at Higher level.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Summary Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                What This Means for Students & Teachers
              </h2>
              <p className="text-xl text-slate-600">
                Key takeaways and preparation strategies
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <User className="w-6 h-6 text-blue-600 mr-3" />
                  For Students
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Practice including verbs in <strong>every sentence</strong></span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Focus on spontaneous, natural conversation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Build responses with multiple clauses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Always mention both photos in photocard task</span>
                  </li>
                </ul>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                  <BookOpen className="w-6 h-6 text-green-600 mr-3" />
                  For Teachers
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Emphasize verb usage in all responses</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Practice reading aloud with multiple attempts</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Focus on spontaneous speech over memorization</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-slate-700">Update marking schemes and expectations</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Ready to Master the New AQA Speaking Exam?</h3>
                <p className="text-slate-700 mb-6">
                  Language Gems provides comprehensive speaking exam preparation with interactive practice, real-time feedback, and expert guidance tailored to the new specification.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/aqa-speaking-test"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all"
                  >
                    Start Speaking Practice
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/blog"
                    className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 px-8 py-3 rounded-lg font-semibold hover:bg-slate-50 transition-all"
                  >
                    Explore More Guides
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">LanguageGems Team</p>
                  <p className="text-slate-400">Educational technology experts</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-slate-300 hover:text-white font-medium transition-colors"
                >
                  ← Back to Blog
                </Link>
                <Link
                  href="/aqa-speaking-test"
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Practice Speaking
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </article>
    </SEOWrapper>
  );
}