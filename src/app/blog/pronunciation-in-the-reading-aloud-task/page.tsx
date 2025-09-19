import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, Target, CheckCircle, AlertTriangle } from 'lucide-react';
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
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>June 24, 2025</span>
            <span>•</span>
            <Clock className="w-4 h-4" />
            <span>8 min read</span>
            <span>•</span>
            <User className="w-4 h-4" />
            <span>LanguageGems Team</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained
          </h1>

          <p className="text-xl text-gray-600 mb-6">
            Identifying Major vs Minor Errors to Support Accurate Marking
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">pronunciation</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">speaking exam</span>
            <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm">AQA</span>
            <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">reading aloud</span>
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          <h2>Why This Matters for GCSE Speaking</h2>
          <p>In the GCSE Speaking exam, pronunciation errors that impede understanding or change meaning should be marked as <strong>major</strong>. Minor mispronunciations that don't hinder communication should be acknowledged but not heavily penalised. This balance ensures students receive fair grades reflecting their communicative ability rather than perfect accent imitation.</p>

          <hr />

          <h2>Major Pronunciation Errors: Impact on Communication</h2>
          <table className="w-full border-collapse border border-gray-300 mb-8">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left">Error Type</th>
                <th className="border border-gray-300 px-4 py-3 text-left">What to Listen For</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Example &amp; GCSE Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Anglicised or French 'j' sound</strong></td>
                <td className="border border-gray-300 px-4 py-3">Pronouncing 'j' / 'ge' / 'gi' like English 'j' or French 'j' instead of Spanish 'h' sound</td>
                <td className="border border-gray-300 px-4 py-3"><em>jugar</em> said as "joo-gar" rather than "hoo-gar". <strong>Major error:</strong> confuses examiner, affects clarity.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Hard 'c' sound on ce/ci</strong></td>
                <td className="border border-gray-300 px-4 py-3">Pronouncing 'ce' or 'ci' with hard 'c' as in English <em>cat</em> instead of soft 'th' or 's' sound</td>
                <td className="border border-gray-300 px-4 py-3"><em>cielo</em> pronounced "see-elo" (hard c) rather than "thee-elo" or "see-elo". Alters naturalness and understanding.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Qu pronounced 'kw'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Pronouncing 'qu' as English "kw" rather than Spanish "k"</td>
                <td className="border border-gray-300 px-4 py-3"><em>que</em> pronounced "kwe". Interrupts smoothness, sounds unnatural.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Ch pronounced as 'sh' or 'k'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Saying 'ch' as English "sh" or "k"</td>
                <td className="border border-gray-300 px-4 py-3"><em>chico</em> as "shiko" or "kiko" instead of "chee-ko". Meaning or word recognition may be affected.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Ñ pronounced as English 'n'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Pronouncing ñ as English n</td>
                <td className="border border-gray-300 px-4 py-3"><em>año</em> pronounced "ano". Major meaning change, inappropriate in exam context.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Pronunciation changing word meaning</strong></td>
                <td className="border border-gray-300 px-4 py-3">Mispronouncing words that alter meaning</td>
                <td className="border border-gray-300 px-4 py-3"><em>polo</em> for <em>pollo</em> — changes meaning, negatively impacting communication.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Omission of final 'e'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Leaving off the final vowel sound</td>
                <td className="border border-gray-300 px-4 py-3"><em>calle</em> said as "call". Makes word unclear or incomplete.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Initial 'i' pronounced as English 'i' in 'ideal'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Vowel sound too English</td>
                <td className="border border-gray-300 px-4 py-3"><em>idea</em> with English vowel rather than Spanish "ee" sound. Sounds unnatural, distracting.</td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h2>Minor Pronunciation Errors: Less Impactful</h2>
          <table className="w-full border-collapse border border-gray-300 mb-8">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left">Error Type</th>
                <th className="border border-gray-300 px-4 py-3 text-left">What to Listen For</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Example &amp; GCSE Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>R or rr pronounced softly (like English 'r' in 'berry')</strong></td>
                <td className="border border-gray-300 px-4 py-3">Softer 'r' than native Spanish</td>
                <td className="border border-gray-300 px-4 py-3"><em>perro</em> with English-style 'r'. Minor accent variation, meaning intact.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Intervocalic 'd' pronounced as English 'd'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Harder 'd' between vowels</td>
                <td className="border border-gray-300 px-4 py-3"><em>lado</em> pronounced with English 'd'. Understandable, slight accent difference.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Slight vowel mispronunciations</strong></td>
                <td className="border border-gray-300 px-4 py-3">Vowels slightly off but intelligible</td>
                <td className="border border-gray-300 px-4 py-3"><em>loco</em> vowel sounds like English "hope" vowel. Doesn't hinder understanding.</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Aspirated 'h'</strong></td>
                <td className="border border-gray-300 px-4 py-3">Pronounced 'h' where silent in Spanish</td>
                <td className="border border-gray-300 px-4 py-3"><em>hora</em> pronounced with audible 'h'. Common learner trait, minor impact.</td>
              </tr>
            </tbody>
          </table>

          <hr />

          <h2>Practical Marking Tips for GCSE Speaking Teachers</h2>
          <ul className="list-disc pl-6 mb-8">
            <li><strong>Prioritise major errors:</strong> These should carry more weight in your mark schemes as they affect communication.</li>
            <li><strong>Note minor errors without heavy penalties:</strong> Encourage fluency and confidence without overly penalising accent variations.</li>
            <li><strong>Use clear audio samples:</strong> Compare student pronunciation to native speaker recordings for consistency.</li>
            <li><strong>Provide targeted feedback:</strong> Highlight specific sounds to improve for next exams (e.g., 'j', 'ñ').</li>
            <li><strong>Promote self-assessment:</strong> Encourage students to record and listen back to their own speech.</li>
            <li><strong>Document recurring errors:</strong> Use these insights to plan pronunciation practice in class.</li>
          </ul>

          <hr />

          <h2>Example Marking Comments for GCSE Speaking Pronunciation</h2>
          <table className="w-full border-collapse border border-gray-300 mb-8">
            <thead className="bg-gray-50">
              <tr>
                <th className="border border-gray-300 px-4 py-3 text-left">Severity</th>
                <th className="border border-gray-300 px-4 py-3 text-left">Sample Comment</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Major</strong></td>
                <td className="border border-gray-300 px-4 py-3">"Pronunciation errors occasionally make it hard to understand key words. Focus on the Spanish 'j' sound and correct 'ñ' pronunciation to improve clarity."</td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3"><strong>Minor</strong></td>
                <td className="border border-gray-300 px-4 py-3">"Good overall pronunciation with minor accent variations. Work on rolling the 'r' and softening vowel sounds for more natural fluency."</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">LanguageGems Team</p>
                <p className="text-gray-600">Educational technology experts</p>
              </div>
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