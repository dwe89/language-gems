import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Users, FileText, MapPin, Target, Clock, Wrench, Star, CheckCircle, AlertTriangle } from 'lucide-react';
import { generateBlogMetadata, generateBlogStructuredData, generateBlogBreadcrumbs } from '../../../lib/seo/blogSEO';

export const metadata: Metadata = generateBlogMetadata({
  title: 'Top Tips for GCSE Writing: The 6 Pillars Strategy',
  description: 'Master GCSE language writing with The Six Pillars strategy. Learn how to structure comprehensive, coherent responses using WHO, WHAT, WHERE, WHY, WHEN, and HOW for exam success.',
  slug: 'top-tips-gcse-writing-six-pillars',
  keywords: [
    'GCSE Writing',
    'Six Pillars Strategy',
    'GCSE Spanish writing',
    'GCSE French writing',
    'GCSE German writing',
    'exam preparation',
    'writing assessment',
    'language learning'
  ],
  author: 'Daniel Etienne',
  publishedDate: '2024-01-20T10:00:00.000Z',
  category: 'GCSE Exam Preparation',
  tags: ['GCSE Writing', 'Six Pillars', 'Exam Strategy', 'Language Learning', 'Teacher Guide'],
  imageUrl: 'https://languagegems.com/images/blog/E.png',
  imageAlt: 'GCSE Writing Six Pillars Strategy - Complete exam preparation guide',
});

export default function GCSEWritingSixPillarsGuide() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateBlogStructuredData({
              title: 'Top Tips for GCSE Writing: The 6 Pillars Strategy',
              description: 'Master GCSE language writing with The Six Pillars strategy. Learn how to structure comprehensive, coherent responses using WHO, WHAT, WHERE, WHY, WHEN, and HOW for exam success.',
              slug: 'top-tips-gcse-writing-six-pillars',
              author: 'Daniel Etienne',
              publishedDate: '2024-01-20T10:00:00.000Z',
              category: 'GCSE Exam Preparation',
              keywords: ['GCSE Writing', 'Six Pillars Strategy', 'GCSE Spanish writing', 'GCSE French writing', 'GCSE German writing', 'exam preparation'],
              imageUrl: 'https://languagegems.com/images/blog/E.png',
            }),
            generateBlogBreadcrumbs('Top Tips for GCSE Writing: The 6 Pillars Strategy', 'GCSE Exam Preparation')
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
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Top Tips for GCSE Writing: The 6 Pillars Strategy
                </h1>
                <p className="text-gray-600 mt-2">
                  Master comprehensive, coherent GCSE language writing with this proven framework
                </p>
              </div>
            </div>

            <div className="mb-6 flex justify-center">
              <img
                src="/images/blog/E.png"
                alt="GCSE Writing Six Pillars Strategy - Imagination Framework"
                className="max-w-xl h-auto rounded-lg shadow-lg"
              />
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">GCSE Writing</span>
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Six Pillars</span>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">Exam Strategy</span>
              <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">Teacher Guide</span>
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
                <Target className="w-6 h-6 text-blue-600" />
                Unlocking Student Imagination in GCSE Writing
              </h2>

                            <p className="text-gray-700 mb-4">
                The key to exceptional GCSE language writing isn't just grammar and vocabulary—it's comprehensive coverage. Students who systematically address all aspects of their writing consistently achieve higher marks. The Six Pillars framework provides a practical structure for any writing task, from letters and emails to blogs and formal reports.
              </p>

              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 mb-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-amber-800 mb-2">The Coverage Gap</h3>
                    <p className="text-amber-700">
                      Many students write incomplete responses because they don't know what information to include. They might describe basic elements but omit crucial details that demonstrate comprehensive understanding and communication skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Six Pillars Introduction */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Star className="w-6 h-6 text-purple-600" />
                Introducing "The Six Pillars" Strategy
              </h2>

              <p className="text-gray-700 mb-4">
                The Six Pillars framework provides a systematic approach to comprehensive writing. By methodically addressing each question, students ensure they include all the necessary information for any writing task type.
              </p>

              <p className="text-gray-700 mb-6">
                This isn't just about structure—it's about completeness. Whether writing a letter, email, blog post, or formal report, the Six Pillars ensure students cover all essential aspects that examiners look for in higher-level responses.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">The Six Pillars Are:</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-blue-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-blue-900">WHO?</span>
                    </div>
                    <p className="text-sm text-gray-600">People, characters, roles involved</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-green-200">
                    <div className="flex items-center gap-3 mb-2">
                      <FileText className="w-5 h-5 text-green-600" />
                      <span className="font-bold text-green-900">WHAT?</span>
                    </div>
                    <p className="text-sm text-gray-600">Actions, events, content</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-yellow-200">
                    <div className="flex items-center gap-3 mb-2">
                      <MapPin className="w-5 h-5 text-yellow-600" />
                      <span className="font-bold text-yellow-900">WHERE?</span>
                    </div>
                    <p className="text-sm text-gray-600">Locations, settings, places</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-red-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Target className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-red-900">WHY?</span>
                    </div>
                    <p className="text-sm text-gray-600">Reasons, motivations, causes</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-purple-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Clock className="w-5 h-5 text-purple-600" />
                      <span className="font-bold text-purple-900">WHEN?</span>
                    </div>
                    <p className="text-sm text-gray-600">Time periods, sequences, timing</p>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm border-2 border-indigo-200">
                    <div className="flex items-center gap-3 mb-2">
                      <Wrench className="w-5 h-5 text-indigo-600" />
                      <span className="font-bold text-indigo-900">HOW?</span>
                    </div>
                    <p className="text-sm text-gray-600">Methods, processes, means</p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-3">Why This Works</h4>
                <ul className="space-y-2 text-green-800">
                  <li>• <strong>Ensures completeness:</strong> Students include all necessary information</li>
                  <li>• <strong>Works for any task:</strong> Applicable to letters, emails, blogs, reports</li>
                  <li>• <strong>Improves marks:</strong> Comprehensive coverage leads to higher grades</li>
                  <li>• <strong>Reduces anxiety:</strong> Clear structure makes writing less intimidating</li>
                  <li>• <strong>Builds confidence:</strong> Students know what information to include</li>
                </ul>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Breaking Down Each Pillar</h2>

              <div className="space-y-8">
                {/* WHO */}
                <div className="border-l-4 border-blue-400 pl-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3 flex items-center gap-3">
                    <Users className="w-6 h-6" />
                    WHO? - People and Relationships
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Identify all the people involved and their relationships to you or each other.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-blue-800 text-sm">
                      <li>• <strong>Who they went with:</strong> Family members, friends, colleagues?</li>
                      <li>• <strong>Physical appearance:</strong> Age, height, hair color, clothing</li>
                      <li>• <strong>Personality:</strong> Friendly, helpful, interesting, etc.</li>
                      <li>• <strong>Relationships:</strong> Who are they to the writer? (mother, friend, teacher)</li>
                    </ul>
                  </div>
                </div>

                {/* WHAT */}
                <div className="border-l-4 border-green-400 pl-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3 flex items-center gap-3">
                    <FileText className="w-6 h-6" />
                    WHAT? - Actions and Events
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Describe exactly what is happening in the scenario.
                  </p>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-green-800 text-sm">
                      <li>• <strong>What exactly is happening:</strong> The main activities or events</li>
                      <li>• <strong>Specific actions:</strong> What people are doing</li>
                      <li>• <strong>Objects involved:</strong> What items, food, equipment are mentioned</li>
                      <li>• <strong>Results:</strong> What happened as a consequence</li>
                    </ul>
                  </div>
                </div>

                {/* WHERE */}
                <div className="border-l-4 border-yellow-400 pl-6">
                  <h3 className="text-xl font-semibold text-yellow-900 mb-3 flex items-center gap-3">
                    <MapPin className="w-6 h-6" />
                    WHERE? - Location and Setting
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Describe where the events take place, including the atmosphere and conditions.
                  </p>
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-yellow-800 text-sm">
                      <li>• <strong>Location:</strong> City, town, country, specific places (restaurant, park, etc.)</li>
                      <li>• <strong>Atmosphere:</strong> Busy, quiet, crowded, peaceful, lively</li>
                      <li>• <strong>Weather:</strong> Sunny, rainy, hot, cold, windy</li>
                      <li>• <strong>Environment:</strong> Indoor/outdoor, modern/traditional, clean/dirty</li>
                    </ul>
                  </div>
                </div>

                {/* WHY */}
                <div className="border-l-4 border-red-400 pl-6">
                  <h3 className="text-xl font-semibold text-red-900 mb-3 flex items-center gap-3">
                    <Target className="w-6 h-6" />
                    WHY? - Reasons and Opinions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Explain the reasons behind choices and share opinions about the experience.
                  </p>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-red-800 text-sm">
                      <li>• <strong>Why you like it:</strong> What makes it enjoyable or interesting?</li>
                      <li>• <strong>Reasons for choices:</strong> Why did you choose this activity/place?</li>
                      <li>• <strong>Opinions:</strong> What you think about the experience</li>
                      <li>• <strong>Advantages:</strong> What are the good points?</li>
                    </ul>
                  </div>
                </div>

                {/* WHEN */}
                <div className="border-l-4 border-purple-400 pl-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3 flex items-center gap-3">
                    <Clock className="w-6 h-6" />
                    WHEN? - Time and Duration
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Specify when events happened and how long they lasted, using appropriate time expressions.
                  </p>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-purple-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-purple-800 text-sm">
                      <li>• <strong>Time of day:</strong> Morning, afternoon, evening, night</li>
                      <li>• <strong>Use sequencers:</strong> First, then, after that, finally, etc.</li>
                      <li>• <strong>Duration:</strong> For how long? (2 hours, all day, etc.)</li>
                      <li>• <strong>Specific times:</strong> At 3 o'clock, last weekend, etc.</li>
                    </ul>
                  </div>
                </div>

                {/* HOW */}
                <div className="border-l-4 border-indigo-400 pl-6">
                  <h3 className="text-xl font-semibold text-indigo-900 mb-3 flex items-center gap-3">
                    <Wrench className="w-6 h-6" />
                    HOW? - Methods and Transport
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Explain how things were done, including travel and practical arrangements.
                  </p>
                  <div className="bg-indigo-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-indigo-900 mb-2">Key Details:</h4>
                    <ul className="space-y-1 text-indigo-800 text-sm">
                      <li>• <strong>How did they get there:</strong> By car, train, bus, on foot?</li>
                      <li>• <strong>Methods used:</strong> How was the activity done?</li>
                      <li>• <strong>Process:</strong> Step-by-step how things happened</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Challenges */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Common Student Challenges & Solutions</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-red-900">❌ Common Difficulties</h3>
                  <div className="space-y-3">
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Forgetting pillars under pressure</p>
                      <p className="text-red-600 text-sm">Students panic and miss key elements</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Superficial WHY/HOW responses</p>
                      <p className="text-red-600 text-sm">Lack depth in analytical pillars</p>
                    </div>
                    <div className="bg-red-50 p-4 rounded-lg border-l-4 border-red-400">
                      <p className="text-red-800 font-medium">Time management issues</p>
                      <p className="text-red-600 text-sm">Spend too long on early pillars</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-green-900">✅ Teaching Solutions</h3>
                  <div className="space-y-3">
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Create pillar checklists</p>
                      <p className="text-green-600 text-sm">Quick reference guides for exam conditions</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Model deep analysis</p>
                      <p className="text-green-600 text-sm">Show examples of WHY/HOW in different contexts</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                      <p className="text-green-800 font-medium">Practice timed writing</p>
                      <p className="text-green-600 text-sm">Build speed while maintaining quality</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Conclusion */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Conclusion: A Practical Framework for Success</h2>

              <p className="text-gray-700 mb-4">
                The Six Pillars strategy transforms GCSE language writing from guesswork into a systematic process. By ensuring comprehensive coverage of WHO, WHAT, WHERE, WHY, WHEN, and HOW, students consistently produce higher-quality responses that examiners reward.
              </p>

              <p className="text-gray-700 mb-6">
                This framework works because it focuses on the essentials that examiners look for in any writing task. Whether it's a formal letter, an email, or a blog post, the Six Pillars provide the structure needed for complete, coherent communication.
              </p>

              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Practical Implementation Tips</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Use checklists:</strong> Create pillar checklists for different task types</li>
                  <li>• <strong>Practice regularly:</strong> Apply pillars to all writing activities</li>
                  <li>• <strong>Start with basics:</strong> Focus on including all essential information first</li>
                  <li>• <strong>Review coverage:</strong> Check that all pillars are addressed before submitting</li>
                  <li>• <strong>Adapt for task type:</strong> Adjust emphasis based on whether it's a letter, email, or report</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Key Teaching Points */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Practical Teaching Tips
              </h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Create pillar checklists for different writing tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Model complete responses showing all pillars</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Use peer review to check pillar coverage</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Practice with real exam questions and tasks</span>
                </li>
                <li className="flex items-start gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <span>Focus on quality information over quantity</span>
                </li>
              </ul>
            </div>

            {/* Quick Reference */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Six Pillars Quick Reference</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-2 bg-blue-50 rounded">
                  <Users className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">WHO?</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-green-50 rounded">
                  <FileText className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">WHAT?</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-yellow-50 rounded">
                  <MapPin className="w-4 h-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-900">WHERE?</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-red-50 rounded">
                  <Target className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">WHY?</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-purple-50 rounded">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">WHEN?</span>
                </div>
                <div className="flex items-center gap-3 p-2 bg-indigo-50 rounded">
                  <Wrench className="w-4 h-4 text-indigo-600" />
                  <span className="text-sm font-medium text-indigo-900">HOW?</span>
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