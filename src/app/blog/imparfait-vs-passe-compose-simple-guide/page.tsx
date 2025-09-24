import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Imparfait vs Passé Composé: Complete French Past Tense Guide',
  description: 'Master French past tenses with our comprehensive guide to imparfait vs passé composé. Learn when to use each tense with examples and practice exercises.',
  keywords: ['french grammar', 'imparfait', 'passé composé', 'french past tenses', 'french verbs', 'GCSE french'],
  openGraph: {
    title: 'The Imparfait vs. The Passé Composé: A Simple Guide',
    description: 'Master the most challenging French grammar concept with clear explanations of when to use imparfait vs passé composé, plus examples and practice exercises.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'French grammar learning'
      }
    ]
  }
};

export default function ImparfaitVsPasseComposeGuide() {
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
                9 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                French Grammar
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              The Imparfait vs. The Passé Composé: A Simple Guide
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Master the most challenging French grammar concept with clear explanations of when to use imparfait vs passé composé, 
              plus examples and practice exercises.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop" 
              alt="French grammar learning"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p>
            The distinction between <strong>l'imparfait</strong> and <strong>le passé composé</strong> is one of the most 
            challenging aspects of French grammar for English speakers. Both tenses refer to past actions, but they serve 
            very different purposes and paint different pictures of how events unfolded. This comprehensive guide will help 
            you understand when to use each tense with clear explanations, practical examples, and memory techniques.
          </p>

          <h2>Why This Distinction Matters</h2>

          <p>Understanding when to use imparfait vs passé composé is crucial because:</p>
          <ul>
            <li><strong>It affects storytelling</strong> - These tenses create the narrative backbone of French</li>
            <li><strong>It changes meaning</strong> - Using the wrong tense can alter the entire meaning of your sentence</li>
            <li><strong>It's heavily tested</strong> - GCSE, A-Level, and university French exams focus extensively on this distinction</li>
            <li><strong>It sounds natural</strong> - Correct usage makes your French sound fluent and sophisticated</li>
          </ul>

          <h2>The Golden Rule: Completed vs. Ongoing</h2>

          <p>
            The fundamental difference is that <strong>passé composé</strong> describes completed, specific actions, 
            while <strong>imparfait</strong> describes ongoing, habitual, or background actions in the past.
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <p className="mb-0">
              <strong>Think of it like a movie:</strong><br/>
              • <strong>Passé composé</strong> = The main action shots (what happened)<br/>
              • <strong>Imparfait</strong> = The background scenery (what was happening)
            </p>
          </div>

          <h2>Le Passé Composé: Completed Actions</h2>

          <p>Use <strong>passé composé</strong> for:</p>

          <h3>1. Specific, Completed Actions</h3>
          <ul>
            <li><em>J'ai mangé une pomme</em> - I ate an apple</li>
            <li><em>Elle est arrivée à huit heures</em> - She arrived at eight o'clock</li>
            <li><em>Nous avons visité Paris</em> - We visited Paris</li>
          </ul>

          <h3>2. Actions with Clear Beginning and End</h3>
          <ul>
            <li><em>Il a étudié pendant trois heures</em> - He studied for three hours</li>
            <li><em>Ils ont vécu en France de 2010 à 2015</em> - They lived in France from 2010 to 2015</li>
            <li><em>J'ai lu ce livre en une semaine</em> - I read this book in one week</li>
          </ul>

          <h3>3. Series of Completed Actions</h3>
          <ul>
            <li><em>Je me suis levé, j'ai pris une douche et j'ai déjeuné</em> - I got up, took a shower, and had breakfast</li>
            <li><em>Elle a ouvert la porte, a regardé dehors et a souri</em> - She opened the door, looked outside, and smiled</li>
          </ul>

          <h3>4. Sudden Interruptions</h3>
          <ul>
            <li><em>Je lisais quand le téléphone a sonné</em> - I was reading when the phone rang</li>
            <li><em>Il dormait quand sa mère est entrée</em> - He was sleeping when his mother came in</li>
          </ul>

          <h2>L'Imparfait: Ongoing and Habitual Actions</h2>

          <p>Use <strong>imparfait</strong> for:</p>

          <h3>1. Habitual or Repeated Actions</h3>
          <ul>
            <li><em>Quand j'étais petit, je jouais au football</em> - When I was little, I used to play football</li>
            <li><em>Elle allait à l'école à pied tous les jours</em> - She walked to school every day</li>
            <li><em>Nous regardions la télé le soir</em> - We would watch TV in the evening</li>
          </ul>

          <h3>2. Ongoing Actions (What Was Happening)</h3>
          <ul>
            <li><em>Il pleuvait</em> - It was raining</li>
            <li><em>Les enfants jouaient dans le jardin</em> - The children were playing in the garden</li>
            <li><em>Je pensais à toi</em> - I was thinking about you</li>
          </ul>

          <h3>3. Descriptions and Background Information</h3>
          <ul>
            <li><em>La maison était grande et belle</em> - The house was big and beautiful</li>
            <li><em>Il faisait beau ce jour-là</em> - The weather was nice that day</li>
            <li><em>Elle portait une robe rouge</em> - She was wearing a red dress</li>
          </ul>

          <h3>4. States of Mind and Emotions</h3>
          <ul>
            <li><em>J'étais triste</em> - I was sad</li>
            <li><em>Il avait peur</em> - He was afraid</li>
            <li><em>Nous étions contents</em> - We were happy</li>
          </ul>

          <h3>5. Age and Time</h3>
          <ul>
            <li><em>J'avais dix ans</em> - I was ten years old</li>
            <li><em>Il était midi</em> - It was noon</li>
            <li><em>C'était en été</em> - It was in summer</li>
          </ul>

          <h2>Side-by-Side Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-6">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Passé Composé</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Imparfait</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Completed actions</strong><br/>
                    <em>J'ai fini mes devoirs</em><br/>
                    (I finished my homework)
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Ongoing actions</strong><br/>
                    <em>Je faisais mes devoirs</em><br/>
                    (I was doing my homework)
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Specific time</strong><br/>
                    <em>Il est parti à 8h</em><br/>
                    (He left at 8 o'clock)
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Habitual actions</strong><br/>
                    <em>Il partait toujours à 8h</em><br/>
                    (He always left at 8 o'clock)
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Main events</strong><br/>
                    <em>Elle a ouvert la porte</em><br/>
                    (She opened the door)
                  </td>
                  <td className="border border-slate-300 px-4 py-2">
                    <strong>Background/description</strong><br/>
                    <em>La porte était ouverte</em><br/>
                    (The door was open)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Key Time Expressions</h2>

          <h3>Common with Passé Composé:</h3>
          <ul>
            <li><strong>hier</strong> (yesterday)</li>
            <li><strong>soudain</strong> (suddenly)</li>
            <li><strong>tout à coup</strong> (all of a sudden)</li>
            <li><strong>une fois</strong> (once)</li>
            <li><strong>pendant + specific time</strong> (for + specific duration)</li>
          </ul>

          <h3>Common with Imparfait:</h3>
          <ul>
            <li><strong>toujours</strong> (always)</li>
            <li><strong>souvent</strong> (often)</li>
            <li><strong>d'habitude</strong> (usually)</li>
            <li><strong>chaque jour</strong> (every day)</li>
            <li><strong>autrefois</strong> (in the past)</li>
            <li><strong>quand j'étais petit(e)</strong> (when I was little)</li>
          </ul>

          <h2>The Storytelling Pattern</h2>

          <p>In French storytelling, you'll often see this pattern:</p>

          <div className="bg-gray-50 p-4 rounded-lg my-6">
            <p>
              <strong>Imparfait</strong> (setting the scene) + <strong>Passé Composé</strong> (main action)
            </p>
            <p className="mt-2">
              <em>Il faisait beau et les oiseaux chantaient quand Marie est sortie de la maison.</em><br/>
              (The weather was nice and the birds were singing when Marie left the house.)
            </p>
          </div>

          <h2>Tricky Cases and Common Mistakes</h2>

          <h3>Mistake 1: Mental States</h3>
          <p>
            Mental states and emotions usually use imparfait, even if they seem "completed":
          </p>
          <p>❌ <em>J'ai été triste</em><br/>
          ✅ <em>J'étais triste</em></p>

          <h3>Mistake 2: Weather Descriptions</h3>
          <p>
            Weather descriptions typically use imparfait:
          </p>
          <p>❌ <em>Il a fait beau</em> (unless referring to a specific day)<br/>
          ✅ <em>Il faisait beau</em></p>

          <h3>Mistake 3: Age</h3>
          <p>
            Age always uses imparfait:
          </p>
          <p>❌ <em>J'ai eu quinze ans</em><br/>
          ✅ <em>J'avais quinze ans</em></p>

          <h2>Memory Techniques</h2>

          <h3>The WASP Method for Imparfait</h3>
          <ul>
            <li><strong>W</strong>eather - <em>Il pleuvait</em></li>
            <li><strong>A</strong>ge - <em>J'avais dix ans</em></li>
            <li><strong>S</strong>tates of mind - <em>J'étais content</em></li>
            <li><strong>P</strong>hysical descriptions - <em>Elle était grande</em></li>
          </ul>

          <h3>The Action Test</h3>
          <p>Ask yourself: "Can I put this action in a sequence of events?"</p>
          <ul>
            <li><strong>Yes</strong> → Passé composé: <em>Je me suis levé, puis j'ai déjeuné</em></li>
            <li><strong>No</strong> → Imparfait: <em>J'étais fatigué</em></li>
          </ul>

          <h2>Practice Exercises</h2>

          <h3>Exercise 1: Choose the Correct Tense</h3>
          <ol>
            <li>Quand j'étais petit, je _____ (jouer) au football tous les jours.</li>
            <li>Hier, il _____ (pleuvoir) toute la journée.</li>
            <li>Elle _____ (arriver) à la gare à 8 heures précises.</li>
            <li>Nous _____ (être) très contents de vous voir.</li>
            <li>Tout à coup, le téléphone _____ (sonner).</li>
          </ol>

          <p><strong>Answers:</strong> 1. jouais, 2. a plu, 3. est arrivée, 4. étions, 5. a sonné</p>

          <h3>Exercise 2: Complete the Story</h3>
          <p>
            <em>Il _____ (faire) beau ce matin-là. Marie _____ (porter) sa robe préférée et elle _____ (être) 
            très heureuse. Soudain, elle _____ (entendre) un bruit étrange. Elle _____ (ouvrir) la fenêtre 
            et _____ (voir) un chat dans le jardin.</em>
          </p>

          <p><strong>Answers:</strong> faisait, portait, était, a entendu, a ouvert, a vu</p>

          <h2>Advanced Tips</h2>

          <h3>Verbs That Change Meaning</h3>
          <p>Some verbs have different meanings in passé composé vs imparfait:</p>
          <ul>
            <li><strong>savoir</strong>: <em>Je savais</em> (I knew) vs <em>J'ai su</em> (I found out)</li>
            <li><strong>connaître</strong>: <em>Je connaissais</em> (I knew/was acquainted with) vs <em>J'ai connu</em> (I met)</li>
            <li><strong>pouvoir</strong>: <em>Je pouvais</em> (I was able to) vs <em>J'ai pu</em> (I managed to)</li>
          </ul>

          <h3>Literary vs. Spoken French</h3>
          <p>
            In formal writing, you might encounter <strong>passé simple</strong> instead of passé composé for 
            completed actions, but the same principles apply for choosing between completed and ongoing actions.
          </p>

          <h2>Next Steps</h2>

          <ol>
            <li><strong>Read French stories</strong> - Notice how authors use both tenses together</li>
            <li><strong>Practice daily</strong> - Describe your day using both tenses appropriately</li>
            <li><strong>Listen to French</strong> - Pay attention to tense usage in conversations and media</li>
            <li><strong>Write narratives</strong> - Practice telling stories using the correct tense patterns</li>
            <li><strong>Get feedback</strong> - Have teachers or native speakers check your usage</li>
          </ol>

          <p>
            Remember, mastering the imparfait vs passé composé distinction takes time and practice. The key is to 
            think about the nature of the action: is it a completed event that moved the story forward, or was it 
            an ongoing situation that provided context? With consistent practice and these guidelines, you'll 
            develop an intuitive feel for when to use each tense.
          </p>

          <p>
            Don't get discouraged if you make mistakes – even advanced French learners sometimes pause to consider 
            which tense to use. The important thing is to keep practicing and gradually build your confidence with 
            these essential French past tenses.
          </p>
        </div>

        {/* Related Posts */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/jouer-a-vs-jouer-de-difference-explained" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  "Jouer à" vs. "Jouer de": The Difference Explained
                </h4>
                <p className="text-slate-600 text-sm">
                  Master this common French confusion with clear explanations and examples.
                </p>
              </div>
            </Link>
            <Link href="/blog/ks3-french-word-blast-game-better-than-flashcards" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  KS3 French: Why Our "Word Blast" Game is Better Than Flashcards
                </h4>
                <p className="text-slate-600 text-sm">
                  Discover how gamification makes French vocabulary learning more effective and engaging.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
