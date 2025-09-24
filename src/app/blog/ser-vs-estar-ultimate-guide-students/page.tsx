import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Ser vs Estar: Complete Guide to Spanish To Be Verbs | LanguageGems',
  description: 'Master ser vs estar with our ultimate guide. Learn when to use each Spanish to be verb with examples, memory tricks, and practice exercises. Perfect for GCSE students.',
  keywords: ['spanish grammar', 'ser vs estar', 'spanish verbs', 'language learning', 'GCSE spanish'],
  openGraph: {
    title: 'Ser vs Estar: The Ultimate Guide for Students',
    description: 'Master the most challenging Spanish grammar concept with our comprehensive guide to ser vs. estar. Includes memory tricks, common mistakes, and practice exercises.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Spanish grammar learning'
      }
    ]
  }
};

export default function SerVsEstarGuide() {
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
                8 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Spanish Grammar
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Ser vs. Estar: The Ultimate Guide for Students
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Master the most challenging Spanish grammar concept with our comprehensive guide to ser vs. estar. 
              Includes memory tricks, common mistakes, and practice exercises.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop" 
              alt="Spanish grammar learning"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p>
            The difference between <strong>ser</strong> and <strong>estar</strong> is arguably the most challenging 
            concept for Spanish learners. Both verbs mean "to be" in English, but they serve completely different 
            purposes in Spanish. This comprehensive guide will help you master when to use each verb with clear 
            explanations, practical examples, and memory tricks that actually work.
          </p>

          <h2>Why Ser vs. Estar Matters for Your Spanish Success</h2>

          <p>Understanding ser vs. estar is crucial because:</p>
          <ul>
            <li><strong>It affects every conversation</strong> - These are among the most frequently used verbs in Spanish</li>
            <li><strong>It changes meaning</strong> - Using the wrong verb can completely alter what you're trying to say</li>
            <li><strong>It's tested heavily</strong> - GCSE, A-Level, and university Spanish exams focus extensively on this distinction</li>
            <li><strong>It builds confidence</strong> - Mastering this concept unlocks more natural, fluent Spanish</li>
          </ul>

          <h2>The Golden Rule: Permanent vs. Temporary</h2>

          <p>
            The most common explanation is that <strong>ser</strong> describes permanent characteristics while 
            <strong>estar</strong> describes temporary states. While this is a helpful starting point, it's not 
            always accurate. Let's dive deeper.
          </p>

          <h3>SER: Identity, Characteristics, and Essential Qualities</h3>

          <p>Use <strong>ser</strong> for:</p>

          <h4>1. Identity and Nationality</h4>
          <ul>
            <li><em>Soy María</em> - I am María</li>
            <li><em>Es español</em> - He is Spanish</li>
            <li><em>Somos estudiantes</em> - We are students</li>
          </ul>

          <h4>2. Physical Characteristics</h4>
          <ul>
            <li><em>Mi hermana es alta</em> - My sister is tall</li>
            <li><em>El coche es rojo</em> - The car is red</li>
            <li><em>Los ojos de Ana son azules</em> - Ana's eyes are blue</li>
          </ul>

          <h4>3. Personality Traits</h4>
          <ul>
            <li><em>Pedro es inteligente</em> - Pedro is intelligent</li>
            <li><em>Ella es muy simpática</em> - She is very nice</li>
            <li><em>Mi profesor es estricto</em> - My teacher is strict</li>
          </ul>

          <h4>4. Time and Dates</h4>
          <ul>
            <li><em>Son las tres</em> - It's three o'clock</li>
            <li><em>Hoy es lunes</em> - Today is Monday</li>
            <li><em>Es el 15 de mayo</em> - It's May 15th</li>
          </ul>

          <h4>5. Origin and Material</h4>
          <ul>
            <li><em>Soy de Londres</em> - I'm from London</li>
            <li><em>La mesa es de madera</em> - The table is made of wood</li>
            <li><em>Este vino es de España</em> - This wine is from Spain</li>
          </ul>

          <h3>ESTAR: Location, Conditions, and States</h3>

          <p>Use <strong>estar</strong> for:</p>

          <h4>1. Location (Physical Position)</h4>
          <ul>
            <li><em>Estoy en casa</em> - I am at home</li>
            <li><em>El libro está en la mesa</em> - The book is on the table</li>
            <li><em>Madrid está en España</em> - Madrid is in Spain</li>
          </ul>

          <h4>2. Temporary States and Conditions</h4>
          <ul>
            <li><em>Estoy cansado</em> - I am tired</li>
            <li><em>La comida está fría</em> - The food is cold</li>
            <li><em>Estamos contentos</em> - We are happy</li>
          </ul>

          <h4>3. Progressive Tenses (Ongoing Actions)</h4>
          <ul>
            <li><em>Estoy estudiando</em> - I am studying</li>
            <li><em>Están comiendo</em> - They are eating</li>
            <li><em>Estaba durmiendo</em> - I was sleeping</li>
          </ul>

          <h4>4. Results of Actions</h4>
          <ul>
            <li><em>La ventana está rota</em> - The window is broken</li>
            <li><em>La puerta está cerrada</em> - The door is closed</li>
            <li><em>El trabajo está terminado</em> - The work is finished</li>
          </ul>

          <h2>The Tricky Cases: When Meaning Changes</h2>

          <p>Some adjectives change meaning depending on whether you use ser or estar:</p>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-6">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Adjective</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">With SER</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">With ESTAR</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>bueno/a</strong></td>
                  <td className="border border-slate-300 px-4 py-2">good (character)<br/><em>Es buena persona</em></td>
                  <td className="border border-slate-300 px-4 py-2">tastes good<br/><em>La comida está buena</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>listo/a</strong></td>
                  <td className="border border-slate-300 px-4 py-2">clever<br/><em>Mi hijo es muy listo</em></td>
                  <td className="border border-slate-300 px-4 py-2">ready<br/><em>¿Estás listo?</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>rico/a</strong></td>
                  <td className="border border-slate-300 px-4 py-2">wealthy<br/><em>Bill Gates es rico</em></td>
                  <td className="border border-slate-300 px-4 py-2">delicious<br/><em>El pastel está rico</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>aburrido/a</strong></td>
                  <td className="border border-slate-300 px-4 py-2">boring<br/><em>La película es aburrida</em></td>
                  <td className="border border-slate-300 px-4 py-2">bored<br/><em>Estoy aburrido</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Memory Tricks That Actually Work</h2>

          <h3>The DOCTOR and PLACE Method</h3>

          <p><strong>Use SER for DOCTOR:</strong></p>
          <ul>
            <li><strong>D</strong>escription (physical traits)</li>
            <li><strong>O</strong>ccupation</li>
            <li><strong>C</strong>haracteristics (personality)</li>
            <li><strong>T</strong>ime</li>
            <li><strong>O</strong>rigin</li>
            <li><strong>R</strong>elationship</li>
          </ul>

          <p><strong>Use ESTAR for PLACE:</strong></p>
          <ul>
            <li><strong>P</strong>osition (location)</li>
            <li><strong>L</strong>ocation</li>
            <li><strong>A</strong>ction (progressive)</li>
            <li><strong>C</strong>ondition (temporary states)</li>
            <li><strong>E</strong>motion (feelings)</li>
          </ul>

          <h3>The "Essence vs. State" Test</h3>

          <p>Ask yourself: "Am I talking about what something <strong>IS</strong> (its essence) or how it <strong>IS</strong> (its current state)?"</p>

          <ul>
            <li><em>María es doctora</em> - What she IS (profession/identity)</li>
            <li><em>María está enferma</em> - How she IS right now (temporary condition)</li>
          </ul>

          <h2>Common Mistakes to Avoid</h2>

          <h3>Mistake 1: Using Ser for Location</h3>
          <p>❌ <em>La fiesta es en mi casa</em><br/>
          ✅ <em>La fiesta está en mi casa</em></p>

          <h3>Mistake 2: Using Estar for Time</h3>
          <p>❌ <em>Está las cinco</em><br/>
          ✅ <em>Son las cinco</em></p>

          <h3>Mistake 3: Confusing Temporary vs. Permanent</h3>
          <p>❌ <em>Mi abuela es muerta</em> (death is permanent, but we use estar)<br/>
          ✅ <em>Mi abuela está muerta</em></p>

          <h2>Practice Exercises</h2>

          <h3>Exercise 1: Choose Ser or Estar</h3>
          <ol>
            <li>Mi hermano _____ médico. (is a doctor)</li>
            <li>Los niños _____ jugando en el parque. (are playing)</li>
            <li>Esta sopa _____ muy salada. (is very salty)</li>
            <li>¿De dónde _____ tú? (are you from)</li>
            <li>La reunión _____ a las tres. (is at three)</li>
          </ol>

          <p><strong>Answers:</strong> 1. es, 2. están, 3. está, 4. eres, 5. es</p>

          <h2>Next Steps: Mastering Ser vs. Estar</h2>

          <ol>
            <li><strong>Practice daily</strong> - Use both verbs in your Spanish conversations</li>
            <li><strong>Read extensively</strong> - Notice how native speakers use ser and estar in context</li>
            <li><strong>Use memory aids</strong> - Apply the DOCTOR/PLACE method until it becomes automatic</li>
            <li><strong>Get feedback</strong> - Have native speakers or teachers correct your usage</li>
            <li><strong>Play games</strong> - Use interactive tools like LanguageGems to practice in context</li>
          </ol>

          <p>
            Remember, mastering ser vs. estar takes time and practice. Don't get discouraged if you make mistakes – 
            even advanced speakers sometimes pause to think about which verb to use. The key is consistent practice 
            and understanding the underlying logic behind each choice.
          </p>

          <p>
            With these tools and explanations, you're well on your way to conquering one of Spanish's most challenging 
            grammar points. ¡Buena suerte!
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/por-vs-para-guide" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  Por vs. Para: How to Stop Confusing These Two Common Prepositions
                </h4>
                <p className="text-slate-600 text-sm">
                  Master another challenging Spanish grammar concept with clear explanations and examples.
                </p>
              </div>
            </Link>
            <Link href="/blog/gcse-spanish-speaking-exam-tips" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  GCSE Spanish Speaking Exam: 5 Essential Tips for a Top Grade
                </h4>
                <p className="text-slate-600 text-sm">
                  Ace your GCSE Spanish speaking exam with these proven strategies and tips.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
