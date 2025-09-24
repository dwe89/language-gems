import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'German Cases Explained: Complete Guide to Accusative, Dative & More',
  description: 'Master German cases with our simple guide. Learn Nominative, Accusative, Dative & Genitive with examples, memory tricks & practice exercises. Perfect for GCSE.',
  keywords: ['german grammar', 'german cases', 'accusative', 'dative', 'nominative', 'genitive', 'GCSE german'],
  openGraph: {
    title: 'German Cases Explained: A Simple Guide to Accusative, Dative & More',
    description: 'Master German cases with our comprehensive guide to Nominative, Accusative, Dative, and Genitive. Includes clear explanations, examples, and memory techniques.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'German grammar learning'
      }
    ]
  }
};

export default function GermanCasesGuide() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blog
          </Link>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600 mb-4">
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                LanguageGems Team
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                10 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                German Grammar
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              German Cases Explained: A Simple Guide to Accusative, Dative & More
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Master German cases with our comprehensive guide to Nominative, Accusative, Dative, and Genitive. 
              Includes clear explanations, examples, and memory techniques.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop" 
              alt="German grammar learning"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p>
            German cases are often considered the biggest hurdle for English speakers learning German. With four 
            different cases (Nominative, Accusative, Dative, and Genitive), each affecting articles, adjectives, 
            and pronouns differently, it can feel overwhelming. This comprehensive guide breaks down each case with 
            clear explanations, practical examples, and memory techniques to help you master this essential German 
            grammar concept.
          </p>

          <h2>Why German Cases Matter</h2>

          <p>Understanding German cases is crucial because they:</p>
          <ul>
            <li><strong>Show relationships</strong> - Cases indicate who is doing what to whom in a sentence</li>
            <li><strong>Affect every sentence</strong> - Articles, adjectives, and pronouns change based on case</li>
            <li><strong>Are heavily tested</strong> - GCSE and A-Level German exams focus extensively on case usage</li>
            <li><strong>Enable clear communication</strong> - Correct case usage prevents misunderstandings</li>
          </ul>

          <h2>The Four German Cases Overview</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-6">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Case</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Function</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Question</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Nominative</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Subject</td>
                  <td className="border border-slate-300 px-4 py-2">Who/What?</td>
                  <td className="border border-slate-300 px-4 py-2"><em>Der Mann liest</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Accusative</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Direct Object</td>
                  <td className="border border-slate-300 px-4 py-2">Who/What?</td>
                  <td className="border border-slate-300 px-4 py-2"><em>Ich sehe den Mann</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Dative</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Indirect Object</td>
                  <td className="border border-slate-300 px-4 py-2">To/For whom?</td>
                  <td className="border border-slate-300 px-4 py-2"><em>Ich gebe dem Mann das Buch</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Genitive</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Possession</td>
                  <td className="border border-slate-300 px-4 py-2">Whose?</td>
                  <td className="border border-slate-300 px-4 py-2"><em>Das Auto des Mannes</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Case 1: Nominative (Der Nominativ)</h2>

          <p>The <strong>Nominative case</strong> is used for the subject of the sentence - the person or thing performing the action.</p>

          <h3>Articles in Nominative</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-4">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-3 py-2">Gender</th>
                  <th className="border border-slate-300 px-3 py-2">Definite</th>
                  <th className="border border-slate-300 px-3 py-2">Indefinite</th>
                  <th className="border border-slate-300 px-3 py-2">Negative</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Masculine</td>
                  <td className="border border-slate-300 px-3 py-2">der</td>
                  <td className="border border-slate-300 px-3 py-2">ein</td>
                  <td className="border border-slate-300 px-3 py-2">kein</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Feminine</td>
                  <td className="border border-slate-300 px-3 py-2">die</td>
                  <td className="border border-slate-300 px-3 py-2">eine</td>
                  <td className="border border-slate-300 px-3 py-2">keine</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Neuter</td>
                  <td className="border border-slate-300 px-3 py-2">das</td>
                  <td className="border border-slate-300 px-3 py-2">ein</td>
                  <td className="border border-slate-300 px-3 py-2">kein</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Plural</td>
                  <td className="border border-slate-300 px-3 py-2">die</td>
                  <td className="border border-slate-300 px-3 py-2">-</td>
                  <td className="border border-slate-300 px-3 py-2">keine</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Examples:</h3>
          <ul>
            <li><em>Der Hund bellt</em> - The dog barks</li>
            <li><em>Eine Frau singt</em> - A woman sings</li>
            <li><em>Das Kind spielt</em> - The child plays</li>
            <li><em>Die Bücher sind interessant</em> - The books are interesting</li>
          </ul>

          <h2>Case 2: Accusative (Der Akkusativ)</h2>

          <p>The <strong>Accusative case</strong> is used for direct objects - the person or thing directly affected by the action.</p>

          <h3>Articles in Accusative</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-4">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-3 py-2">Gender</th>
                  <th className="border border-slate-300 px-3 py-2">Definite</th>
                  <th className="border border-slate-300 px-3 py-2">Indefinite</th>
                  <th className="border border-slate-300 px-3 py-2">Negative</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Masculine</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>den</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>einen</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>keinen</strong></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Feminine</td>
                  <td className="border border-slate-300 px-3 py-2">die</td>
                  <td className="border border-slate-300 px-3 py-2">eine</td>
                  <td className="border border-slate-300 px-3 py-2">keine</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Neuter</td>
                  <td className="border border-slate-300 px-3 py-2">das</td>
                  <td className="border border-slate-300 px-3 py-2">ein</td>
                  <td className="border border-slate-300 px-3 py-2">kein</td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Plural</td>
                  <td className="border border-slate-300 px-3 py-2">die</td>
                  <td className="border border-slate-300 px-3 py-2">-</td>
                  <td className="border border-slate-300 px-3 py-2">keine</td>
                </tr>
              </tbody>
            </table>
          </div>

          <p><strong>Key Point:</strong> Only masculine articles change in the accusative case!</p>

          <h3>Common Accusative Prepositions</h3>
          <p>These prepositions always take the accusative case:</p>
          <ul>
            <li><strong>durch</strong> (through) - <em>durch den Park</em></li>
            <li><strong>für</strong> (for) - <em>für einen Freund</em></li>
            <li><strong>gegen</strong> (against) - <em>gegen die Wand</em></li>
            <li><strong>ohne</strong> (without) - <em>ohne das Buch</em></li>
            <li><strong>um</strong> (around/at) - <em>um den Tisch</em></li>
          </ul>

          <h3>Examples:</h3>
          <ul>
            <li><em>Ich kaufe den Apfel</em> - I buy the apple</li>
            <li><em>Sie liest einen Roman</em> - She reads a novel</li>
            <li><em>Wir sehen das Auto</em> - We see the car</li>
            <li><em>Er hat keine Zeit</em> - He has no time</li>
          </ul>

          <h2>Case 3: Dative (Der Dativ)</h2>

          <p>The <strong>Dative case</strong> is used for indirect objects - the person or thing that receives the direct object.</p>

          <h3>Articles in Dative</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-4">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-3 py-2">Gender</th>
                  <th className="border border-slate-300 px-3 py-2">Definite</th>
                  <th className="border border-slate-300 px-3 py-2">Indefinite</th>
                  <th className="border border-slate-300 px-3 py-2">Negative</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Masculine</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>dem</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>einem</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>keinem</strong></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Feminine</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>der</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>einer</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>keiner</strong></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Neuter</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>dem</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>einem</strong></td>
                  <td className="border border-slate-300 px-3 py-2"><strong>keinem</strong></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-3 py-2">Plural</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>den</strong></td>
                  <td className="border border-slate-300 px-3 py-2">-</td>
                  <td className="border border-slate-300 px-3 py-2"><strong>keinen</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Dative Verbs</h3>
          <p>Some German verbs always take the dative case:</p>
          <ul>
            <li><strong>helfen</strong> (to help) - <em>Ich helfe dem Kind</em></li>
            <li><strong>danken</strong> (to thank) - <em>Sie dankt der Lehrerin</em></li>
            <li><strong>folgen</strong> (to follow) - <em>Der Hund folgt dem Mann</em></li>
            <li><strong>gehören</strong> (to belong to) - <em>Das Buch gehört einem Studenten</em></li>
          </ul>

          <h3>Dative Prepositions</h3>
          <p>These prepositions always take the dative case:</p>
          <ul>
            <li><strong>aus</strong> (from/out of) - <em>aus dem Haus</em></li>
            <li><strong>bei</strong> (at/near) - <em>bei der Arbeit</em></li>
            <li><strong>mit</strong> (with) - <em>mit einem Freund</em></li>
            <li><strong>nach</strong> (after/to) - <em>nach dem Essen</em></li>
            <li><strong>seit</strong> (since) - <em>seit einer Woche</em></li>
            <li><strong>von</strong> (from/of) - <em>von dem Lehrer</em></li>
            <li><strong>zu</strong> (to) - <em>zu der Schule</em></li>
          </ul>

          <h2>Memory Techniques</h2>

          <h3>The "Der Die Das" Song Method</h3>
          <p>Create a rhythm to remember the case endings:</p>
          <ul>
            <li><strong>Nominative:</strong> der, die, das, die</li>
            <li><strong>Accusative:</strong> den, die, das, die</li>
            <li><strong>Dative:</strong> dem, der, dem, den</li>
            <li><strong>Genitive:</strong> des, der, des, der</li>
          </ul>

          <h3>The Question Method</h3>
          <ul>
            <li><strong>Nominative:</strong> Who or what is doing the action?</li>
            <li><strong>Accusative:</strong> Who or what is receiving the action directly?</li>
            <li><strong>Dative:</strong> To whom or for whom is the action done?</li>
            <li><strong>Genitive:</strong> Whose is it?</li>
          </ul>

          <h3>Preposition Memory Aids</h3>
          <p><strong>Accusative prepositions:</strong> "DOGFU" - durch, ohne, gegen, für, um</p>
          <p><strong>Dative prepositions:</strong> "BAMSVZ" - bei, aus, mit, seit, von, zu</p>

          <h2>Common Mistakes to Avoid</h2>

          <h3>Mistake 1: Forgetting Masculine Changes</h3>
          <p>❌ <em>Ich sehe der Mann</em><br/>
          ✅ <em>Ich sehe den Mann</em></p>

          <h3>Mistake 2: Wrong Case with Prepositions</h3>
          <p>❌ <em>Ich gehe zu die Schule</em><br/>
          ✅ <em>Ich gehe zu der Schule</em></p>

          <h3>Mistake 3: Mixing Up Dative and Accusative</h3>
          <p>❌ <em>Ich gebe das Buch den Mann</em><br/>
          ✅ <em>Ich gebe dem Mann das Buch</em></p>

          <h2>Practice Exercises</h2>

          <h3>Exercise 1: Identify the Case</h3>
          <ol>
            <li><em>Der Lehrer erklärt die Grammatik.</em></li>
            <li><em>Ich helfe dem Schüler.</em></li>
            <li><em>Das ist das Auto meines Vaters.</em></li>
            <li><em>Sie kauft einen neuen Computer.</em></li>
          </ol>

          <p><strong>Answers:</strong> 1. Nominative (der Lehrer), Accusative (die Grammatik) 2. Dative (dem Schüler) 3. Genitive (meines Vaters) 4. Accusative (einen neuen Computer)</p>

          <h2>Next Steps</h2>

          <ol>
            <li><strong>Practice daily</strong> - Use case exercises regularly</li>
            <li><strong>Read German texts</strong> - Notice case usage in context</li>
            <li><strong>Memorize prepositions</strong> - Learn which case each preposition takes</li>
            <li><strong>Use memory aids</strong> - Apply the techniques that work best for you</li>
            <li><strong>Get feedback</strong> - Have teachers check your case usage</li>
          </ol>

          <p>
            Remember, mastering German cases takes time and consistent practice. Don't get discouraged by mistakes – 
            they're part of the learning process. With these tools and regular practice, you'll develop an intuitive 
            feel for German cases that will make your German sound natural and confident.
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/gcse-german-writing-exam-tips" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  GCSE German Writing Exam: Tips for Using Lifeline Phrases
                </h4>
                <p className="text-slate-600 text-sm">
                  Master your GCSE German writing exam with essential phrases and strategies.
                </p>
              </div>
            </Link>
            <Link href="/blog/german-movies-tv-shows-listening-skills" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  5 German Movies & TV Shows to Improve Your Listening Skills
                </h4>
                <p className="text-slate-600 text-sm">
                  Discover entertaining German content that will boost your listening comprehension.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
