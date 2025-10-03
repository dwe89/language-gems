import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';
import BlogPageWrapper from '@/components/blog/BlogPageWrapper';

export const metadata: Metadata = {
  title: 'Mastering the Spanish 90-Word Response: The TONICS Formula | GCSE Writing',
  description: 'Ace your Spanish GCSE 90-word writing task with the TONICS formula. Learn the proven 3P structure, complexity techniques, and essential Spanish toolkit for top marks.',
  keywords: ['GCSE Spanish', 'Spanish writing exam', '90-word response', 'TONICS formula', 'Spanish GCSE tips', 'AQA Spanish', 'Spanish exam technique'],
  openGraph: {
    title: 'Mastering the Spanish 90-Word Response: The TONICS Formula',
    description: 'The definitive guide to achieving full marks on your Spanish GCSE 90-word writing task using the proven TONICS framework.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Spanish GCSE writing exam preparation'
      }
    ]
  }
};

export default function SpanishTONICSFormula() {
  return (
    <BlogPageWrapper>
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/blog" 
            className="inline-flex items-center text-orange-600 hover:text-orange-800 mb-4 transition-colors"
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
                GCSE Spanish
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Mastering the Spanish 90-Word Response: The TONICS Formula 🇪🇸
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              The definitive guide to achieving full marks on your Spanish GCSE 90-word writing task. Learn the proven structure, complexity techniques, and essential toolkit.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?w=1200&h=400&fit=crop" 
              alt="Spanish GCSE writing exam preparation"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p className="lead text-xl">
            The Spanish GCSE 90-word writing question (Question 5) is one of the most high-stakes tasks on the paper. 
            It's worth 15 marks, but you only have about 90 words to prove you deserve them!
          </p>

          <p>
            The secret to a perfect score isn't complex vocabulary; it's <strong>structure</strong> and <strong>deliberate complexity</strong>. 
            We've broken down the examiner's mark scheme to give you a definitive three-part system for success: 
            The <strong>3P Formula</strong> for structure, <strong>TONICS</strong> for language complexity, and the <strong>5Ws & H</strong> for development.
          </p>

          <div className="bg-orange-50 border-l-4 border-orange-500 p-6 my-8">
            <h3 className="mt-0 text-orange-900">🎯 Quick Win Summary</h3>
            <p className="mb-0">
              <strong>3P Formula:</strong> Three sentences covering Present/Opinion (P1), Past (P2), and Future (P3)<br/>
              <strong>TONICS:</strong> Tenses, Opinions, Negatives, Infinitives, Connectives, Stand-out phrases<br/>
              <strong>5Ws & H:</strong> Who, What, Where, Why, How (for adding detail)
            </p>
          </div>

          <h2>Part 1: The Non-Negotiable Structure (AO2)</h2>

          <p>
            The writing task always includes <strong>three compulsory bullet points</strong>. To ensure you answer all of them 
            and cover all three required time frames, you must use the <strong>3P Formula</strong>.
          </p>

          <h3>The 3P Formula: Three Pillars, Three Tenses</h3>

          <p>
            The formula requires you to dedicate one sentence (or pillar) to each time frame/question type:
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Pillar</th>
                  <th className="text-left">Focus (Question Type)</th>
                  <th className="text-left">What to Include</th>
                  <th className="text-left">Tense/Structure Required</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>P1</strong></td>
                  <td><strong>Opinion / Present</strong></td>
                  <td><strong>The Opinion Question</strong> (e.g., <em>What do you think of...?</em>)</td>
                  <td><strong>Opinion Phrase (O)</strong> + <strong>Connective (C)</strong> + Present Tense</td>
                </tr>
                <tr>
                  <td><strong>P2</strong></td>
                  <td><strong>Past</strong></td>
                  <td><strong>The Recent Event Question</strong> (e.g., <em>What did you do...?</em>)</td>
                  <td><strong>Past Tense (T)</strong> (Preterite or Perfect) + Time Marker</td>
                </tr>
                <tr>
                  <td><strong>P3</strong></td>
                  <td><strong>Future / Conditional</strong></td>
                  <td><strong>The Plan/Aspiration Question</strong> (e.g., <em>What would you like to do...?</em>)</td>
                  <td><strong>Future Tense (T)</strong> (Immediate Future or Conditional) + <strong>Infinitive (I)</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="bg-green-50 border-l-4 border-green-500 p-6 my-8">
            <h4 className="mt-0 text-green-900">✅ Crucial Takeaway</h4>
            <p className="mb-0">
              If you successfully write one sentence for P1, one for P2, and one for P3, you have guaranteed access to 
              the full <strong>AO2 (Content)</strong> marks because you've covered all three bullet points and guaranteed 
              all three time frames for <strong>AO3</strong>.
            </p>
          </div>

          <h2>Part 2: The Secret Sauce – TONICS (AO3)</h2>

          <p>
            The <strong>TONICS</strong> checklist is your tool for boosting your linguistic score (AO3). It takes simple 
            sentences and transforms them into the <strong>complex structures</strong> examiners are looking for. You should 
            aim to include at least one element from T, N, I, C, and S across your three sentences.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Letter</th>
                  <th className="text-left">Element</th>
                  <th className="text-left">Why it Scores Highly (AO3)</th>
                  <th className="text-left">Examples to Use</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="font-bold text-orange-600">T</td>
                  <td><strong>Tenses</strong></td>
                  <td>Mandatory! Confirms the <strong>three time frames</strong> are present.</td>
                  <td><em>fui, he visto, pienso, voy a hacer, me gustaría, será.</em></td>
                </tr>
                <tr>
                  <td className="font-bold text-orange-600">O</td>
                  <td><strong>Opinions</strong></td>
                  <td>Shows <strong>variety</strong> and sophistication beyond <em>me gusta</em>.</td>
                  <td><em>Diría que, Me parece que, En mi opinión, Lo bueno/malo es que.</em></td>
                </tr>
                <tr>
                  <td className="font-bold text-orange-600">N</td>
                  <td><strong>Negatives</strong></td>
                  <td>Introduces linguistic <strong>complexity</strong> easily.</td>
                  <td><em>no... nada</em> (nothing), <em>no... nadie</em> (no one), <em>no... nunca</em> (never).</td>
                </tr>
                <tr>
                  <td className="font-bold text-orange-600">I</td>
                  <td><strong>Infinitives</strong></td>
                  <td>Essential for <strong>Future</strong> (e.g., <em>voy a</em>) and showing control of modal verbs.</td>
                  <td><em>Voy a <strong>estudiar</strong>, Me gustaría <strong>visitar</strong>, Es fácil <strong>aprender</strong>.</em></td>
                </tr>
                <tr>
                  <td className="font-bold text-orange-600">C</td>
                  <td><strong>Connectives</strong></td>
                  <td>Links ideas to create <strong>developed, longer sentences</strong> (AO2).</td>
                  <td><em>porque, ya que, además, pero, sin embargo, por eso.</em></td>
                </tr>
                <tr>
                  <td className="font-bold text-orange-600">S</td>
                  <td><strong>Stand Out</strong></td>
                  <td>High-level adverbs, intensifiers, and time phrases for flair.</td>
                  <td><em>De verdad, Súper, Sobre todo, Generalmente, Desgraciadamente.</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Part 3: Combating "No Ideas" – The 5Ws & H (AO2 Development)</h2>

          <p>
            Struggling with imagination? Use the <strong>5Ws & H</strong> method to brainstorm details for <strong>EACH</strong> of 
            your three sentences. Adding this detail is what moves your AO2 score from 'some information' to 
            'a lot of relevant information.'
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Question (in English)</th>
                  <th className="text-left">Detail Focus</th>
                  <th className="text-left">Example of Detail to Add</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Who?</strong></td>
                  <td>Who was involved?</td>
                  <td><em>con <strong>mi mejor amigo/a</strong>, con <strong>toda mi familia</strong>, <strong>solo</strong>.</em></td>
                </tr>
                <tr>
                  <td><strong>What?</strong></td>
                  <td>What specific object/activity?</td>
                  <td><em>un regalo <strong>muy caro</strong>, una película <strong>de terror</strong>, <strong>mucha comida</strong>.</em></td>
                </tr>
                <tr>
                  <td><strong>Where?</strong></td>
                  <td>Where exactly?</td>
                  <td><em>en <strong>un restaurante italiano</strong>, en <strong>la playa cerca de mi casa</strong>, <strong>en línea</strong>.</em></td>
                </tr>
                <tr>
                  <td><strong>Why?</strong></td>
                  <td>Why did you feel/do this? (Use <strong>C: porque</strong>!)</td>
                  <td><em>porque <strong>era divertido</strong>, porque <strong>necesitaba relajarme</strong>, porque <strong>hacía calor</strong>.</em></td>
                </tr>
                <tr>
                  <td><strong>How?</strong></td>
                  <td>How was the experience? (Adjectives/Adverbs)</td>
                  <td><em>Fue <strong>fantástico</strong>, <strong>Súper divertido</strong>, <strong>Corrí rápidamente</strong>.</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>Example: Turning a Simple Sentence into a Developed One</h3>

          <div className="bg-slate-100 p-6 rounded-lg my-6">
            <p className="mb-2">
              <strong className="text-red-600">❌ Simple Sentence (Low AO2):</strong><br/>
              <em>Ayer fui al cine.</em>
            </p>
            <p className="mb-0">
              <strong className="text-green-600">✅ Developed Sentence (High AO2):</strong><br/>
              <em><strong>Ayer</strong> <strong>fui</strong> al cine <strong>con mi mejor amigo</strong> (who) <strong>porque</strong> <strong>me gusta</strong> (why) 
              ver películas <strong>de ciencia ficción</strong> (what), y fue <strong>súper divertido</strong> (how).</em>
            </p>
          </div>

          <h2>Part 4: Essential Spanish Toolkit</h2>

          <p>
            To make your TONICS framework work, you need high-utility Spanish verbs that function across all themes.
          </p>

          <h3>🌟 Core High-Frequency Verbs</h3>

          <p>Master these five verbs in the three required tenses:</p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Verb (Infinitive)</th>
                  <th className="text-left">Preterite (P2)</th>
                  <th className="text-left">Immediate Future (P3)</th>
                  <th className="text-left">Conditional (P3)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Ser/Estar</strong> (To be)</td>
                  <td><em>Fui/Estuve</em></td>
                  <td><em>Voy a ser/estar</em></td>
                  <td><em>Sería/Estaría</em></td>
                </tr>
                <tr>
                  <td><strong>Tener</strong> (To have)</td>
                  <td><em>Tuve</em></td>
                  <td><em>Voy a tener</em></td>
                  <td><em>Me gustaría tener</em></td>
                </tr>
                <tr>
                  <td><strong>Hacer</strong> (To do/make)</td>
                  <td><em>Hice</em></td>
                  <td><em>Voy a hacer</em></td>
                  <td><em>Haría</em></td>
                </tr>
                <tr>
                  <td><strong>Ir</strong> (To go)</td>
                  <td><em>Fui</em></td>
                  <td><em>Voy a ir</em></td>
                  <td><em>Iría</em></td>
                </tr>
                <tr>
                  <td><strong>Querer</strong> (To want)</td>
                  <td><em>Quise</em></td>
                  <td><em>Voy a querer</em></td>
                  <td><em>Quisiera/Me gustaría</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3>🔑 Essential Sentence Bank (Examples by Theme)</h3>

          <p>
            Use these high-scoring sentences as a foundation. Swap the bolded parts for specific vocabulary from the 
            unit in your prompt.
          </p>

          <div className="overflow-x-auto my-6">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="text-left">Unit Focus</th>
                  <th className="text-left">🟢 P1 (Opinion)</th>
                  <th className="text-left">🟡 P2 (Past)</th>
                  <th className="text-left">🟣 P3 (Future)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>Identity</strong></td>
                  <td><em>Pienso que pasar tiempo con mi familia es importante porque me hacen reír.</em></td>
                  <td><em>Ayer fui al cine con mi mejor amigo y vimos una película fantástica.</em></td>
                  <td><em>Cuando sea mayor, me gustaría tener una casa cerca de mis parientes.</em></td>
                </tr>
                <tr>
                  <td><strong>Lifestyle</strong></td>
                  <td><em>Es esencial comer una dieta equilibrada porque te da mucha energía.</em></td>
                  <td><em>El mes pasado empecé a hacer más ejercicio y corrí cinco kilómetros.</em></td>
                  <td><em>Mañana por la tarde voy a evitar los dulces y beberé dos litros de agua.</em></td>
                </tr>
                <tr>
                  <td><strong>Travel</strong></td>
                  <td><em>Creo que viajar es fundamental porque te permite conocer otras culturas.</em></td>
                  <td><em>El verano pasado fui de vacaciones a la costa y visité un castillo antiguo.</em></td>
                  <td><em>En mis próximas vacaciones voy a alojarme en un hotel de lujo cerca del mar.</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Your Final Checklist: The COPS Review</h2>

          <p>Before you finish writing, check your work against this final list:</p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 my-8">
            <ol className="mb-0 space-y-2">
              <li><strong>C</strong>ontent: Did I answer <strong>all three bullet points</strong>? (P1, P2, P3)</li>
              <li><strong>O</strong>pinions: Did I use an opinion and a <strong>connective (C)</strong> to justify it?</li>
              <li><strong>P</strong>illars/Tenses: Did I use the <strong>Past</strong>, <strong>Present/Opinion</strong>, and <strong>Future</strong> (T)?</li>
              <li><strong>S</strong>ophistication: Did I include <strong>TONICS</strong> elements (N, I, S) to add complexity?</li>
            </ol>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-8 rounded-lg my-8 text-center">
            <h3 className="text-white mt-0">Master the structure, apply the complexity, and you'll master the 90-word task!</h3>
            <p className="mb-0 text-lg">
              Ready to practice? Use the TONICS formula in your next practice exam and watch your marks soar! 🚀
            </p>
          </div>

          <h2>Practice Makes Perfect</h2>

          <p>
            Now that you have the TONICS formula, the key is to practice applying it to different exam-style questions. 
            Start with topics you're comfortable with, then challenge yourself with more difficult themes. Remember:
          </p>

          <ul>
            <li>Always plan your three pillars (P1, P2, P3) before you start writing</li>
            <li>Use the 5Ws & H to add specific details to each sentence</li>
            <li>Check your work against the COPS checklist before submitting</li>
            <li>Time yourself – aim to complete the task in 15-18 minutes</li>
          </ul>

          <div className="bg-slate-50 p-6 rounded-lg my-8">
            <h3 className="mt-0">💡 Pro Tip</h3>
            <p className="mb-0">
              Create flashcards with opinion phrases, connectives, and stand-out vocabulary from TONICS. Review them 
              daily in the weeks before your exam so they become second nature!
            </p>
          </div>

          <h2>Common Mistakes to Avoid</h2>

          <div className="space-y-4 my-6">
            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="text-red-700 mt-0">❌ Missing a time frame</h4>
              <p className="mb-0">This instantly caps your AO3 mark. Always use the 3P formula to guarantee coverage.</p>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="text-red-700 mt-0">❌ Answering only two bullet points</h4>
              <p className="mb-0">You'll lose significant AO2 marks. Each pillar must address a separate bullet point.</p>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="text-red-700 mt-0">❌ Using only simple sentences</h4>
              <p className="mb-0">Without connectives and development, you won't access higher mark bands. Apply TONICS!</p>
            </div>

            <div className="border-l-4 border-red-400 pl-4">
              <h4 className="text-red-700 mt-0">❌ Writing too much or too little</h4>
              <p className="mb-0">Aim for 90-100 words. Too few means lost content; too many wastes time and risks errors.</p>
            </div>
          </div>

          <h2>Final Thoughts</h2>

          <p>
            The Spanish GCSE 90-word writing task is your opportunity to demonstrate controlled, structured writing with 
            impressive linguistic features. By following the <strong>3P Formula</strong>, applying <strong>TONICS</strong>, 
            and developing your ideas with the <strong>5Ws & H</strong>, you'll give the examiner exactly what they're 
            looking for in the mark scheme.
          </p>

          <p>
            This isn't about memorizing essays – it's about having a reliable framework that works for any question, 
            any theme, any time. Practice it until it becomes automatic, and you'll walk into your exam with confidence!
          </p>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-400 p-6 rounded-lg my-8">
            <h3 className="mt-0 text-green-900">🎓 Want More GCSE Spanish Exam Tips?</h3>
            <p className="mb-4">
              Check out our other comprehensive guides covering speaking, listening, and reading exams.
            </p>
            <Link 
              href="/blog" 
              className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
            >
              Browse All Blog Posts
            </Link>
          </div>

        </div>
      </div>
    </div>
  
    </BlogPageWrapper>);
}
