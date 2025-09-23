import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, Target, CheckCircle, AlertTriangle, Mic, Volume2, X, Check, BookOpen, Zap, Award, ArrowRight, MessageSquare } from 'lucide-react';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getArticleSchema } from '../../../lib/seo/structuredData';
import { generateMetadata } from '../../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained',
  description: 'Master pronunciation assessment in the new GCSE Speaking exam. Learn to differentiate between major and minor pronunciation errors for accurate marking and better student feedback.',
  keywords: [
    'GCSE pronunciation',
    'speaking exam pronunciation',
    'reading aloud task',
    'AQA speaking exam',
    'pronunciation marking',
    'major pronunciation errors',
    'minor pronunciation errors',
    'GCSE speaking assessment',
    'language exam pronunciation'
  ],
  canonical: '/blog/pronunciation-in-the-reading-aloud-task',
  ogImage: '/images/blog/pronunciation-og.jpg',
  ogType: 'article',
  publishedTime: '2025-06-24T20:26:54Z',
  modifiedTime: '2025-06-24T20:26:54Z',
});

export default function PronunciationBlogPost() {
  const articleSchema = getArticleSchema({
    title: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained',
    description: 'Master pronunciation assessment in the new GCSE Speaking exam. Learn to differentiate between major and minor pronunciation errors for accurate marking and better student feedback.',
    url: '/blog/pronunciation-in-the-reading-aloud-task',
    publishedTime: '2025-06-24T20:26:54Z',
    modifiedTime: '2025-06-24T20:26:54Z',
    author: 'LanguageGems Team',
    image: '/images/blog/pronunciation-og.jpg'
  });

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Pronunciation in Reading Aloud Task', url: '/blog/pronunciation-in-the-reading-aloud-task' }
  ];

  return (
    <SEOWrapper structuredData={articleSchema} breadcrumbs={breadcrumbs}>
      <article className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <header className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Mic className="w-4 h-4" />
                Pronunciation Guide
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Pronunciation in the Reading Aloud Task:
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600"> Major vs Minor Errors</span>
              </h1>

              <p className="text-xl text-slate-600 mb-8 leading-relaxed max-w-3xl mx-auto">
                Master pronunciation assessment in GCSE Speaking exams. Learn to differentiate between errors that impact communication and those that don't, ensuring fair and accurate marking.
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
                  <span>8 min read</span>
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
                In the GCSE Speaking exam, pronunciation assessment requires careful judgment. Not all mispronunciations are equal — some significantly impact communication while others are minor accent variations that don't hinder understanding.
              </p>

              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100 mb-12">
                <div className="flex items-start gap-4">
                  <Volume2 className="w-6 h-6 text-purple-600 mt-1 flex-shrink-0" />
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Why Accurate Pronunciation Assessment Matters</h2>
                    <p className="text-slate-700 leading-relaxed">
                      The new AQA Speaking exam emphasizes communicative competence over perfect native-like pronunciation. Teachers must distinguish between errors that impede understanding and those that reflect natural learner accent variations, ensuring fair assessment that rewards genuine communication skills.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Major Errors Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-red-50 to-pink-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Major Pronunciation Errors
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Errors that significantly impact communication and understanding
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Anglicised 'j' sound</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing 'j'/'ge'/'gi' like English 'j' instead of Spanish 'h'</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>jugar</em> as "joo-gar" instead of "hoo-gar"</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Hard 'c' on ce/ci</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing 'ce'/'ci' with hard 'c' instead of soft 'th'/'s'</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>cielo</em> as "see-elo" instead of "thee-elo"</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">'Qu' as 'kw'</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing 'qu' as English "kw" instead of Spanish "k"</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>que</em> as "kwe" instead of "ke"</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">'Ch' mispronounced</h3>
                </div>
                <p className="text-slate-600 mb-3">Saying 'ch' as English "sh" or "k" instead of "ch"</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>chico</em> as "shiko" instead of "chee-ko"</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">'Ñ' as English 'n'</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing ñ as regular English 'n' instead of nasal sound</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>año</em> as "ano" instead of "ahn-yo"</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-red-100">
                <div className="flex items-center mb-4">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Meaning-changing errors</h3>
                </div>
                <p className="text-slate-600 mb-3">Mispronunciations that alter word meaning</p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="text-red-800 text-sm font-medium">Example: <em>polo</em> for <em>pollo</em> (ice cream vs chicken)</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <AlertTriangle className="w-6 h-6 text-red-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Impact on GCSE Speaking Marks</h3>
                  <p className="text-slate-700 mb-4">
                    Major pronunciation errors significantly reduce marks in the reading aloud task because they impede communication and make it difficult for examiners to understand the student's intended meaning.
                  </p>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium mb-2">💡 Marking Tip:</p>
                    <p className="text-red-700 text-sm">These errors should be clearly noted and may result in mark deductions that affect the overall fluency and pronunciation assessment.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Minor Errors Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-emerald-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Minor Pronunciation Errors
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Accent variations that don't significantly impact communication
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Soft 'r' sounds</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing 'r'/'rr' like English 'r' in 'berry'</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">Example: <em>perro</em> with English-style 'r'</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Intervocalic 'd'</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing 'd' between vowels like English 'd'</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">Example: <em>lado</em> with harder 'd' sound</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Slight vowel variations</h3>
                </div>
                <p className="text-slate-600 mb-3">Vowels slightly off but still intelligible</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">Example: <em>loco</em> with English vowel sounds</p>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border border-green-100">
                <div className="flex items-center mb-4">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-lg font-semibold text-slate-900">Aspirated 'h'</h3>
                </div>
                <p className="text-slate-600 mb-3">Pronouncing silent 'h' where it should be silent</p>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-green-800 text-sm font-medium">Example: <em>hora</em> with audible 'h'</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="flex items-start gap-4">
                <CheckCircle className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">Impact on GCSE Speaking Marks</h3>
                  <p className="text-slate-700 mb-4">
                    Minor pronunciation errors are natural learner variations that don't impede communication. These should be noted for improvement but shouldn't significantly impact marks.
                  </p>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p className="text-green-800 font-medium mb-2">💡 Teaching Tip:</p>
                    <p className="text-green-700 text-sm">Focus on building confidence and fluency rather than eliminating all accent variations. These errors are part of the natural learning process.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Marking Tips Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Practical Marking Tips for Teachers
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Ensure fair and consistent pronunciation assessment in GCSE speaking exams
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Target className="w-8 h-8 text-blue-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Prioritize Major Errors</h3>
                </div>
                <p className="text-slate-700">
                  Focus assessment on pronunciation errors that actually impede communication. These carry more weight in determining final marks.
                </p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Mic className="w-8 h-8 text-purple-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Use Audio Samples</h3>
                </div>
                <p className="text-slate-700">
                  Compare student pronunciation to native speaker recordings for consistency. This helps maintain marking standards across different examiners.
                </p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <MessageSquare className="w-8 h-8 text-green-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Provide Targeted Feedback</h3>
                </div>
                <p className="text-slate-700">
                  Highlight specific sounds to improve (e.g., 'j', 'ñ') rather than general comments about accent. This helps students focus their practice.
                </p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Volume2 className="w-8 h-8 text-yellow-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Encourage Self-Assessment</h3>
                </div>
                <p className="text-slate-700">
                  Have students record and listen back to their own speech. This builds awareness and independence in pronunciation improvement.
                </p>
              </div>

              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <BookOpen className="w-8 h-8 text-indigo-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Document Patterns</h3>
                </div>
                <p className="text-slate-700">
                  Track recurring pronunciation errors across your class. Use these insights to plan targeted pronunciation practice activities.
                </p>
              </div>

              <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-8">
                <div className="flex items-center mb-6">
                  <Award className="w-8 h-8 text-red-600 mr-4" />
                  <h3 className="text-xl font-bold text-slate-900">Balance Assessment</h3>
                </div>
                <p className="text-slate-700">
                  Remember that pronunciation is just one aspect of speaking assessment. Balance it with fluency, vocabulary, and communication effectiveness.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Example Comments Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 to-gray-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Example Marking Comments
              </h2>
              <p className="text-xl text-slate-600">
                Sample feedback for different pronunciation proficiency levels
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Major Errors Example */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <X className="w-6 h-6 text-red-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-900">Major Errors</h3>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <p className="text-red-800 font-medium mb-3">Sample Comment:</p>
                  <p className="text-red-700 italic">
                    "Pronunciation errors occasionally make it hard to understand key words. Focus on the Spanish 'j' sound and correct 'ñ' pronunciation to improve clarity."
                  </p>
                </div>
              </div>

              {/* Minor Errors Example */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <Check className="w-6 h-6 text-green-600 mr-3" />
                  <h3 className="text-2xl font-bold text-slate-900">Minor Errors</h3>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <p className="text-green-800 font-medium mb-3">Sample Comment:</p>
                  <p className="text-green-700 italic">
                    "Good overall pronunciation with minor accent variations. Work on rolling the 'r' and softening vowel sounds for more natural fluency."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-8 border border-purple-100">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-slate-900 mb-4">Master Pronunciation Assessment</h3>
                <p className="text-slate-700 mb-6">
                  Language Gems provides comprehensive speaking exam preparation with pronunciation practice, real-time feedback, and expert guidance tailored to the new AQA specification.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/aqa-speaking-test"
                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all"
                  >
                    Practice Pronunciation
                    <Mic className="w-5 h-5" />
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
                <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center">
                  <Mic className="w-6 h-6 text-white" />
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
                  className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
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