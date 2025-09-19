import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, BookOpen, CheckCircle, AlertTriangle } from 'lucide-react';
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
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>June 24, 2025</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>10 min read</span>
            <span>•</span>
            <User className="w-4 h-4" />
            <span>LanguageGems Team</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Everything You Need to Know About the New AQA Speaking Exam
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Understanding the New AQA Speaking Exam: What Students and Teachers Need to Know
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">AQA</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">speaking exam</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <p>The AQA Speaking exam has undergone significant changes. These updates aim to better assess real-world communication skills and reduce the emphasis on memorized language. Here's a clear breakdown of what's new — and what's different from the old specification.</p>

          <hr />

          <h2>Key Differences Between Old and New Specifications</h2>
          <table className="w-full border-collapse border border-gray-300 mb-8">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left">Aspect</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Old Specification</th>
                <th className="border border-gray-300 px-4 py-3 text-left">New Specification</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Roleplay marks</td>
                <td className="border border-gray-300 px-4 py-3">15 marks</td>
                <td className="border border-gray-300 px-4 py-3">10 marks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Unexpected question in roleplay</td>
                <td className="border border-gray-300 px-4 py-3">Yes, included in the roleplay</td>
                <td className="border border-gray-300 px-4 py-3">No unexpected question</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Roleplay questions language</td>
                <td className="border border-gray-300 px-4 py-3">Questions could be in target language</td>
                <td className="border border-gray-300 px-4 py-3">All roleplay questions are now in English</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Knowledge and Use of Language (KUL)</td>
                <td className="border border-gray-300 px-4 py-3">Assessed within roleplay (grammar, vocab accuracy)</td>
                <td className="border border-gray-300 px-4 py-3">Removed from all tasks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Photocard marks</td>
                <td className="border border-gray-300 px-4 py-3">15 marks</td>
                <td className="border border-gray-300 px-4 py-3">5 marks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">General conversation marks</td>
                <td className="border border-gray-300 px-4 py-3">30 marks</td>
                <td className="border border-gray-300 px-4 py-3">Unprepared conversation now combined with photocard for 20 marks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Reading aloud task</td>
                <td className="border border-gray-300 px-4 py-3">Not included</td>
                <td className="border border-gray-300 px-4 py-3">New task, 5 marks</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3">Roleplay responses</td>
                <td className="border border-gray-300 px-4 py-3">Verb use not strictly required; some answers could omit verbs</td>
                <td className="border border-gray-300 px-4 py-3">Every sentence <strong>must include a verb</strong>; no one-word or verb-less responses such as:<br /><em>"How many hours a week do you go to the cinema?" — "Three."</em></td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h2>What's New in Detail</h2>

          <h3>Roleplay (10 marks) — 20% of total</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>Roleplay is now shorter and marked out of <strong>10</strong> instead of 15.</li>
            <li>Students <strong>must include a verb in every sentence</strong>; one-word or verb-less answers are no longer acceptable, for example:
              <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic">
                "How many hours a week do you go to the cinema?" — "Three."
              </blockquote>
            </li>
            <li>All roleplay questions are now given <strong>in English</strong>.</li>
            <li>No <strong>unexpected questions</strong> — all questions are planned, but students must still ask a question themselves.</li>
            <li>Duration:
              <ul className="list-disc pl-6 mt-2">
                <li>Foundation: 7–9 minutes</li>
                <li>Higher: 10–12 minutes</li>
              </ul>
            </li>
            <li>Informal, social context — <strong>not transactional</strong>.</li>
            <li>Students cannot deviate from the script or add extra info outside of what's required.</li>
          </ul>

          <h3>Reading Aloud + Short Conversation (15 marks) — 30% of total</h3>
          <ul className="list-disc pl-6 mb-6">
            <li>New <strong>reading aloud task</strong> to test pronunciation and fluency.</li>
            <li>Foundation reads ~35 words; Higher reads ~50 words.</li>
            <li>Can restart reading aloud as many times as they want.</li>
            <li>Followed by a short conversation where students answer <strong>four present tense questions</strong>.</li>
          </ul>

          <hr />

          <h2>Response Development Examples with Fresh Examples</h2>

          <h3>Short Conversation: Foundation</h3>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Good development:</strong> Response with <strong>two clauses</strong> (two verb-containing parts).<br />
              <em>Example:</em><br />
              <em>"I like swimming and I play tennis."</em>
            </li>
            <li><strong>Minimal development:</strong> Adds an extra piece of information (noun or adjective).<br />
              <em>Example:</em><br />
              <em>"I eat pizza and pasta."</em>
            </li>
            <li><strong>Limited response:</strong> Simple statement without expansion.<br />
              <em>Example:</em><br />
              <em>"I study maths."</em>
            </li>
          </ul>

          <hr />

          <h3>Short Conversation: Higher</h3>
          <ul className="list-disc pl-6 mb-6">
            <li><strong>Extended response:</strong> Contains <strong>at least three clauses</strong> with appropriate verbs.<br />
              <em>Example:</em><br />
              <em>"I usually read books at home and sometimes I go to the library. I find reading very relaxing."</em>
            </li>
          </ul>

          <hr />

          <h2>Photocard Discussion + Unprepared Conversation (25 marks) — 50% of total</h2>
          <ul className="list-disc pl-6 mb-6">
            <li>Students respond to <strong>two photos</strong> and must mention <strong>both</strong> to avoid a 1-mark deduction.</li>
            <li>Students are given a <strong>theme</strong> and may focus on one unit within that theme.</li>
            <li>No strict requirement to use specific tenses, but complex language helps at Higher level.</li>
            <li>For top marks, students need to provide:
              <ul className="list-disc pl-6 mt-2">
                <li><strong>Foundation:</strong> 9 clear pieces of information</li>
                <li><strong>Higher:</strong> 15 clear pieces of information</li>
              </ul>
            </li>
          </ul>

          <hr />

          <h2>Summary: What This Means for Students and Teachers</h2>
          <ul className="list-disc pl-6 mb-8">
            <li>The new roleplay demands <strong>verbal complexity</strong> — every sentence must have a verb, unlike before.</li>
            <li>No unexpected questions mean less surprise but still genuine interaction is required.</li>
            <li>Reading aloud is brand new and offers students multiple chances to get it right.</li>
            <li>The photocard and conversation combined shift focus to natural, spontaneous speech.</li>
            <li>KUL is no longer separately assessed, so fluency and communication matter most.</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold text-gray-900">LanguageGems Team</p>
              <p className="text-gray-600">Educational technology experts</p>
            </div>
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Blog
            </Link>
          </div>
        </footer>
      </article>
    </SEOWrapper>
  );
}