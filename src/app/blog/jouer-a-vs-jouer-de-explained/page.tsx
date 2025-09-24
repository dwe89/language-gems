import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: '"Jouer à" vs "Jouer de": The French Grammar Difference Explained',
  description: 'Master the difference between "jouer à" and "jouer de" in French. Learn when to use each with sports, games, and musical instruments.',
  keywords: ['jouer à', 'jouer de', 'french grammar', 'french prepositions', 'french verbs', 'sports french', 'music french'],
  openGraph: {
    title: '"Jouer à" vs. "Jouer de": The Difference Explained',
    description: 'Clear up this common French confusion with simple rules, examples, and memory tricks for jouer à vs jouer de.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'French grammar jouer à vs jouer de'
      }
    ]
  }
};

export default function JouerAVsJouerDe() {
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
                4 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                French Grammar
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              "Jouer à" vs. "Jouer de": The Difference Explained
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Clear up this common French confusion with simple rules, examples, and memory tricks for jouer à vs jouer de.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop" 
              alt="French grammar jouer à vs jouer de"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p>
            One of the most common questions French learners ask is: "When do I use <em>jouer à</em> and when do I use 
            <em>jouer de</em>?" This seemingly simple distinction trips up students at all levels, but once you understand 
            the logic behind it, you'll never make this mistake again. Let's break down this essential French grammar rule.
          </p>

          <h2>The Simple Rule</h2>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <ul className="mb-0">
              <li><strong>JOUER À</strong> = Sports and games</li>
              <li><strong>JOUER DE</strong> = Musical instruments</li>
            </ul>
          </div>

          <p>That's it! The rule is actually quite straightforward:</p>
          <ul>
            <li>If you're playing a <strong>sport or game</strong>, use <strong>jouer à</strong></li>
            <li>If you're playing a <strong>musical instrument</strong>, use <strong>jouer de</strong></li>
          </ul>

          <h2>Jouer À: Sports and Games</h2>

          <h3>Sports Examples:</h3>
          <ul>
            <li><em>Je joue au football</em> - I play football</li>
            <li><em>Elle joue au tennis</em> - She plays tennis</li>
            <li><em>Nous jouons au basketball</em> - We play basketball</li>
            <li><em>Ils jouent au rugby</em> - They play rugby</li>
            <li><em>Tu joues au golf</em> - You play golf</li>
          </ul>

          <h3>Games Examples:</h3>
          <ul>
            <li><em>Je joue aux cartes</em> - I play cards</li>
            <li><em>Elle joue aux échecs</em> - She plays chess</li>
            <li><em>Nous jouons aux jeux vidéo</em> - We play video games</li>
            <li><em>Ils jouent au Monopoly</em> - They play Monopoly</li>
            <li><em>Tu joues aux dames</em> - You play checkers</li>
          </ul>

          <h3>Remember the Contractions!</h3>
          <p>Don't forget that <em>à</em> contracts with the definite articles:</p>
          <ul>
            <li><em>à + le = au</em> → <em>jouer au football</em></li>
            <li><em>à + les = aux</em> → <em>jouer aux cartes</em></li>
            <li><em>à + la = à la</em> → <em>jouer à la pétanque</em></li>
            <li><em>à + l' = à l'</em> → <em>jouer à l'ordinateur</em></li>
          </ul>

          <h2>Jouer De: Musical Instruments</h2>

          <h3>Musical Instruments Examples:</h3>
          <ul>
            <li><em>Je joue du piano</em> - I play piano</li>
            <li><em>Elle joue de la guitare</em> - She plays guitar</li>
            <li><em>Nous jouons du violon</em> - We play violin</li>
            <li><em>Ils jouent de la batterie</em> - They play drums</li>
            <li><em>Tu joues de l'accordéon</em> - You play accordion</li>
          </ul>

          <h3>Remember the Contractions!</h3>
          <p>Similarly, <em>de</em> contracts with the definite articles:</p>
          <ul>
            <li><em>de + le = du</em> → <em>jouer du piano</em></li>
            <li><em>de + les = des</em> → <em>jouer des cymbales</em></li>
            <li><em>de + la = de la</em> → <em>jouer de la guitare</em></li>
            <li><em>de + l' = de l'</em> → <em>jouer de l'orgue</em></li>
          </ul>

          <h2>Side-by-Side Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-6">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Category</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Preposition</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">Examples</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Sports</strong></td>
                  <td className="border border-slate-300 px-4 py-2"><strong>à</strong></td>
                  <td className="border border-slate-300 px-4 py-2">
                    <em>au football, au tennis, au basketball</em>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Games</strong></td>
                  <td className="border border-slate-300 px-4 py-2"><strong>à</strong></td>
                  <td className="border border-slate-300 px-4 py-2">
                    <em>aux cartes, aux échecs, au Monopoly</em>
                  </td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Musical Instruments</strong></td>
                  <td className="border border-slate-300 px-4 py-2"><strong>de</strong></td>
                  <td className="border border-slate-300 px-4 py-2">
                    <em>du piano, de la guitare, du violon</em>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Memory Tricks</h2>

          <h3>The Physical vs. Creative Method</h3>
          <ul>
            <li><strong>Jouer À</strong> = Physical activities (sports and games require physical interaction)</li>
            <li><strong>Jouer DE</strong> = Creative expression (music comes FROM you, DE = from)</li>
          </ul>

          <h3>The English Clue Method</h3>
          <p>In English, we say:</p>
          <ul>
            <li>"Play <strong>AT</strong> tennis" (à sounds like "at")</li>
            <li>"Play <strong>THE</strong> piano" (de + le = du, "the" piano)</li>
          </ul>

          <h3>The Alphabet Trick</h3>
          <ul>
            <li><strong>À</strong> comes before <strong>D</strong> in the alphabet</li>
            <li><strong>Activities</strong> (sports/games) come before <strong>D</strong> → use À</li>
            <li><strong>D</strong> for <strong>DE</strong> and <strong>D</strong> for instruments → use DE</li>
          </ul>

          <h2>Common Vocabulary Lists</h2>

          <h3>Sports (Jouer À):</h3>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <ul>
              <li><em>le football</em> - football/soccer</li>
              <li><em>le tennis</em> - tennis</li>
              <li><em>le basketball</em> - basketball</li>
              <li><em>le volleyball</em> - volleyball</li>
              <li><em>le rugby</em> - rugby</li>
              <li><em>le golf</em> - golf</li>
            </ul>
            <ul>
              <li><em>le hockey</em> - hockey</li>
              <li><em>le baseball</em> - baseball</li>
              <li><em>la pétanque</em> - pétanque</li>
              <li><em>le ping-pong</em> - ping-pong</li>
              <li><em>le badminton</em> - badminton</li>
              <li><em>la natation</em> - swimming</li>
            </ul>
          </div>

          <h3>Games (Jouer À):</h3>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <ul>
              <li><em>les cartes</em> - cards</li>
              <li><em>les échecs</em> - chess</li>
              <li><em>les dames</em> - checkers</li>
              <li><em>le Monopoly</em> - Monopoly</li>
              <li><em>le Scrabble</em> - Scrabble</li>
            </ul>
            <ul>
              <li><em>les jeux vidéo</em> - video games</li>
              <li><em>la roulette</em> - roulette</li>
              <li><em>le poker</em> - poker</li>
              <li><em>les dés</em> - dice</li>
              <li><em>la belote</em> - belote (card game)</li>
            </ul>
          </div>

          <h3>Musical Instruments (Jouer De):</h3>
          <div className="grid md:grid-cols-2 gap-4 my-4">
            <ul>
              <li><em>le piano</em> - piano</li>
              <li><em>la guitare</em> - guitar</li>
              <li><em>le violon</em> - violin</li>
              <li><em>la batterie</em> - drums</li>
              <li><em>la flûte</em> - flute</li>
              <li><em>le saxophone</em> - saxophone</li>
            </ul>
            <ul>
              <li><em>la trompette</em> - trumpet</li>
              <li><em>l'accordéon</em> - accordion</li>
              <li><em>la clarinette</em> - clarinet</li>
              <li><em>l'orgue</em> - organ</li>
              <li><em>la harpe</em> - harp</li>
              <li><em>les cymbales</em> - cymbals</li>
            </ul>
          </div>

          <h2>Special Cases and Exceptions</h2>

          <h3>Computer Games</h3>
          <p>Computer and video games use <strong>jouer à</strong>:</p>
          <ul>
            <li><em>Je joue aux jeux vidéo</em> - I play video games</li>
            <li><em>Il joue à l'ordinateur</em> - He plays on the computer</li>
            <li><em>Elle joue à Fortnite</em> - She plays Fortnite</li>
          </ul>

          <h3>Role-Playing</h3>
          <p>When "playing" means pretending or role-playing, use <strong>jouer à</strong>:</p>
          <ul>
            <li><em>Les enfants jouent au docteur</em> - The children are playing doctor</li>
            <li><em>Nous jouons aux cow-boys</em> - We're playing cowboys</li>
          </ul>

          <h3>Playing Music (Not Instruments)</h3>
          <p>When playing recorded music, use <strong>jouer</strong> without a preposition:</p>
          <ul>
            <li><em>Je joue cette chanson</em> - I'm playing this song</li>
            <li><em>Il joue de la musique classique</em> - He plays classical music (on an instrument)</li>
          </ul>

          <h2>Common Mistakes to Avoid</h2>

          <h3>Mistake 1: Using the Wrong Preposition</h3>
          <p>❌ <em>Je joue de football</em><br/>
          ✅ <em>Je joue au football</em></p>

          <p>❌ <em>Elle joue à piano</em><br/>
          ✅ <em>Elle joue du piano</em></p>

          <h3>Mistake 2: Forgetting Contractions</h3>
          <p>❌ <em>Je joue à le tennis</em><br/>
          ✅ <em>Je joue au tennis</em></p>

          <p>❌ <em>Il joue de le violon</em><br/>
          ✅ <em>Il joue du violon</em></p>

          <h3>Mistake 3: Mixing Up Categories</h3>
          <p>Remember: if you can physically touch and manipulate it during play (ball, cards, pieces), use <em>à</em>. 
          If you create sound from it, use <em>de</em>.</p>

          <h2>Practice Exercises</h2>

          <h3>Exercise 1: Choose À or DE</h3>
          <ol>
            <li>Je joue _____ guitare depuis cinq ans.</li>
            <li>Nous jouons _____ football tous les weekends.</li>
            <li>Elle joue _____ piano très bien.</li>
            <li>Ils jouent _____ cartes le soir.</li>
            <li>Tu joues _____ violon dans l'orchestre?</li>
          </ol>

          <p><strong>Answers:</strong> 1. de la, 2. au, 3. du, 4. aux, 5. du</p>

          <h3>Exercise 2: Complete with Contractions</h3>
          <ol>
            <li>Mon frère joue _____ (à + le) basketball.</li>
            <li>Ma sœur joue _____ (de + la) batterie.</li>
            <li>Nous jouons _____ (à + les) échecs.</li>
            <li>Il joue _____ (de + le) saxophone.</li>
            <li>Elles jouent _____ (à + la) pétanque.</li>
          </ol>

          <p><strong>Answers:</strong> 1. au, 2. de la, 3. aux, 4. du, 5. à la</p>

          <h2>Conclusion</h2>

          <p>
            The distinction between <em>jouer à</em> and <em>jouer de</em> is one of those French grammar rules that 
            seems complicated at first but becomes automatic with practice. Remember the simple rule: sports and games 
            use <em>à</em>, musical instruments use <em>de</em>.
          </p>

          <p>
            With this knowledge and regular practice, you'll never hesitate again when talking about your hobbies 
            and activities in French. Whether you're discussing your weekend football match or your evening piano 
            practice, you'll use the correct preposition with confidence.
          </p>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
            <p className="mb-0">
              <strong>Quick Tip:</strong> When in doubt, ask yourself: "Am I making music?" If yes, use <em>de</em>. 
              If no, use <em>à</em>. This simple question will guide you to the right answer every time!
            </p>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/imparfait-vs-passe-compose-simple-guide" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  The Imparfait vs. The Passé Composé: A Simple Guide
                </h4>
                <p className="text-slate-600 text-sm">
                  Master another challenging French grammar concept with our comprehensive guide.
                </p>
              </div>
            </Link>
            <Link href="/blog/ks3-french-word-blast-game-better-than-flashcards" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  KS3 French: Why Our "Word Blast" Game is Better Than Flashcards
                </h4>
                <p className="text-slate-600 text-sm">
                  Practice your French vocabulary with our engaging Word Blast game.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
