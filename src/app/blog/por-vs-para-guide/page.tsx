import { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, Clock, User, Tag } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Por vs Para: How to Stop Confusing These Two Common Spanish Prepositions',
  description: 'Master the difference between por and para in Spanish with clear explanations, examples, and memory tricks. Never confuse these prepositions again!',
  keywords: ['por vs para', 'spanish prepositions', 'spanish grammar', 'por para difference', 'spanish learning'],
  openGraph: {
    title: 'Por vs. Para: How to Stop Confusing These Two Common Prepositions',
    description: 'Finally understand the difference between por and para with our comprehensive guide, examples, and memory techniques.',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Spanish grammar por vs para'
      }
    ]
  }
};

export default function PorVsParaGuide() {
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
                6 min read
              </div>
              <div className="flex items-center">
                <Tag className="h-4 w-4 mr-1" />
                Spanish Grammar
              </div>
            </div>
            
            <h1 className="text-4xl font-bold text-slate-900 mb-4">
              Por vs. Para: How to Stop Confusing These Two Common Prepositions
            </h1>
            
            <p className="text-xl text-slate-600 leading-relaxed">
              Finally understand the difference between por and para with our comprehensive guide, examples, and memory techniques.
            </p>
            
            <img 
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=400&fit=crop" 
              alt="Spanish grammar por vs para"
              className="w-full h-64 object-cover rounded-lg mt-6"
            />
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 prose prose-lg max-w-none">
          <p>
            If you've been learning Spanish for more than a week, you've probably encountered the dreaded 
            <strong>por vs. para</strong> dilemma. These two little prepositions cause more confusion than 
            almost any other aspect of Spanish grammar. The good news? Once you understand the underlying 
            logic, you'll never confuse them again. Let's break down this Spanish grammar mystery once and for all.
          </p>

          <h2>The Fundamental Difference</h2>

          <p>
            The key to understanding por vs. para lies in recognizing their fundamental purposes:
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-400 p-4 my-6">
            <ul className="mb-0">
              <li><strong>POR</strong> = Reason, cause, or means (WHY or HOW something happens)</li>
              <li><strong>PARA</strong> = Purpose, destination, or goal (WHAT FOR or WHERE TO)</li>
            </ul>
          </div>

          <p>Think of it this way:</p>
          <ul>
            <li><strong>POR</strong> looks backward → What caused this?</li>
            <li><strong>PARA</strong> looks forward → What's the goal?</li>
          </ul>

          <h2>When to Use POR</h2>

          <h3>1. Reason or Cause (Because of)</h3>
          <ul>
            <li><em>Llegué tarde por el tráfico</em> - I arrived late because of traffic</li>
            <li><em>No pude dormir por el ruido</em> - I couldn't sleep because of the noise</li>
            <li><em>Cancelaron el partido por la lluvia</em> - They canceled the game because of rain</li>
          </ul>

          <h3>2. Means or Method (By means of)</h3>
          <ul>
            <li><em>Hablé con ella por teléfono</em> - I spoke with her by phone</li>
            <li><em>Enviamos el paquete por correo</em> - We sent the package by mail</li>
            <li><em>Viajamos por avión</em> - We traveled by plane</li>
          </ul>

          <h3>3. Exchange or Price (In exchange for)</h3>
          <ul>
            <li><em>Pagué 50 euros por los zapatos</em> - I paid 50 euros for the shoes</li>
            <li><em>Cambié mi coche por una moto</em> - I traded my car for a motorcycle</li>
            <li><em>Gracias por tu ayuda</em> - Thanks for your help</li>
          </ul>

          <h3>4. Duration of Time (For/During)</h3>
          <ul>
            <li><em>Estudié por tres horas</em> - I studied for three hours</li>
            <li><em>Vivimos allí por dos años</em> - We lived there for two years</li>
            <li><em>Trabajo por las mañanas</em> - I work in the mornings</li>
          </ul>

          <h3>5. Movement Through/Along</h3>
          <ul>
            <li><em>Caminamos por el parque</em> - We walked through the park</li>
            <li><em>El tren pasa por Madrid</em> - The train passes through Madrid</li>
            <li><em>Navegamos por el río</em> - We sailed along the river</li>
          </ul>

          <h3>6. On Behalf Of/Instead Of</h3>
          <ul>
            <li><em>Habló por todos nosotros</em> - He spoke for all of us</li>
            <li><em>Firmé por mi jefe</em> - I signed for my boss</li>
            <li><em>Voté por el candidato liberal</em> - I voted for the liberal candidate</li>
          </ul>

          <h2>When to Use PARA</h2>

          <h3>1. Purpose or Goal (In order to)</h3>
          <ul>
            <li><em>Estudio para aprender español</em> - I study (in order) to learn Spanish</li>
            <li><em>Ahorro dinero para comprar una casa</em> - I save money to buy a house</li>
            <li><em>Este regalo es para ti</em> - This gift is for you</li>
          </ul>

          <h3>2. Destination (Toward)</h3>
          <ul>
            <li><em>Salgo para Madrid mañana</em> - I'm leaving for Madrid tomorrow</li>
            <li><em>Este tren va para Barcelona</em> - This train goes to Barcelona</li>
            <li><em>Caminamos para la playa</em> - We walked toward the beach</li>
          </ul>

          <h3>3. Deadline or Specific Time</h3>
          <ul>
            <li><em>La tarea es para el lunes</em> - The homework is for Monday</li>
            <li><em>Necesito el informe para las tres</em> - I need the report by three o'clock</li>
            <li><em>Estaré listo para entonces</em> - I'll be ready by then</li>
          </ul>

          <h3>4. Recipient (For someone)</h3>
          <ul>
            <li><em>Compré flores para mi madre</em> - I bought flowers for my mother</li>
            <li><em>Este libro es para estudiantes</em> - This book is for students</li>
            <li><em>Tengo un mensaje para Juan</em> - I have a message for Juan</li>
          </ul>

          <h3>5. Opinion or Perspective (For/In the opinion of)</h3>
          <ul>
            <li><em>Para mí, es muy difícil</em> - For me, it's very difficult</li>
            <li><em>Para ser extranjero, habla muy bien</em> - For a foreigner, he speaks very well</li>
            <li><em>Para su edad, está muy activo</em> - For his age, he's very active</li>
          </ul>

          <h3>6. Profession or Use</h3>
          <ul>
            <li><em>Estudia para médico</em> - He's studying to be a doctor</li>
            <li><em>Esta mesa es para comer</em> - This table is for eating</li>
            <li><em>Necesito una caja para guardar fotos</em> - I need a box to store photos</li>
          </ul>

          <h2>Side-by-Side Comparison</h2>

          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-slate-300 my-6">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-300 px-4 py-2 text-left">Concept</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">POR</th>
                  <th className="border border-slate-300 px-4 py-2 text-left">PARA</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Time</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Duration<br/><em>por tres horas</em></td>
                  <td className="border border-slate-300 px-4 py-2">Deadline<br/><em>para las tres</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Movement</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Through/Along<br/><em>por el parque</em></td>
                  <td className="border border-slate-300 px-4 py-2">Toward/Destination<br/><em>para Madrid</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>Reason</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Cause<br/><em>por la lluvia</em></td>
                  <td className="border border-slate-300 px-4 py-2">Purpose<br/><em>para estudiar</em></td>
                </tr>
                <tr>
                  <td className="border border-slate-300 px-4 py-2"><strong>"For"</strong></td>
                  <td className="border border-slate-300 px-4 py-2">Exchange<br/><em>por 20 euros</em></td>
                  <td className="border border-slate-300 px-4 py-2">Recipient<br/><em>para mi hermana</em></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2>Memory Tricks and Mnemonics</h2>

          <h3>The PROD vs. GODOT Method</h3>

          <h4>POR = PROD (Push/Poke backward)</h4>
          <ul>
            <li><strong>P</strong>rice/Payment - <em>por 10 euros</em></li>
            <li><strong>R</strong>eason/Cause - <em>por el tráfico</em></li>
            <li><strong>O</strong>n behalf of - <em>por mi amigo</em></li>
            <li><strong>D</strong>uration - <em>por dos horas</em></li>
          </ul>

          <h4>PARA = GODOT (Going toward the future)</h4>
          <ul>
            <li><strong>G</strong>oal/Purpose - <em>para aprender</em></li>
            <li><strong>O</strong>pinion - <em>para mí</em></li>
            <li><strong>D</strong>estination - <em>para España</em></li>
            <li><strong>O</strong>ccupation - <em>para médico</em></li>
            <li><strong>T</strong>ime deadline - <em>para mañana</em></li>
          </ul>

          <h3>The Question Test</h3>
          <p>Ask yourself these questions:</p>
          <ul>
            <li><strong>POR:</strong> "Why did this happen?" or "How was this done?"</li>
            <li><strong>PARA:</strong> "What is the goal?" or "Who is this for?"</li>
          </ul>

          <h3>The Direction Test</h3>
          <ul>
            <li><strong>POR:</strong> Movement through or along something</li>
            <li><strong>PARA:</strong> Movement toward a specific destination</li>
          </ul>

          <h2>Common Mistakes and How to Avoid Them</h2>

          <h3>Mistake 1: Time Confusion</h3>
          <p>❌ <em>Estudié para tres horas</em><br/>
          ✅ <em>Estudié por tres horas</em> (duration)</p>

          <p>❌ <em>La tarea es por mañana</em><br/>
          ✅ <em>La tarea es para mañana</em> (deadline)</p>

          <h3>Mistake 2: Movement Mix-up</h3>
          <p>❌ <em>Caminé para el parque</em> (unless you mean "toward the park")<br/>
          ✅ <em>Caminé por el parque</em> (through the park)</p>

          <h3>Mistake 3: Purpose vs. Cause</h3>
          <p>❌ <em>Llegué tarde para el tráfico</em><br/>
          ✅ <em>Llegué tarde por el tráfico</em> (cause)</p>

          <p>❌ <em>Estudio por aprender español</em><br/>
          ✅ <em>Estudio para aprender español</em> (purpose)</p>

          <h2>Practice Exercises</h2>

          <h3>Exercise 1: Choose Por or Para</h3>
          <ol>
            <li>Compré este regalo _____ mi hermana.</li>
            <li>No pude venir _____ la lluvia.</li>
            <li>Salimos _____ Madrid mañana.</li>
            <li>Trabajé _____ cinco horas.</li>
            <li>Necesito el informe _____ el viernes.</li>
          </ol>

          <p><strong>Answers:</strong> 1. para, 2. por, 3. para, 4. por, 5. para</p>

          <h3>Exercise 2: Explain Why</h3>
          <p>For each sentence, explain why por or para is used:</p>
          <ol>
            <li><em>Gracias por tu ayuda.</em></li>
            <li><em>Este libro es para estudiantes.</em></li>
            <li><em>Viajamos por tren.</em></li>
            <li><em>Estudia para ser abogada.</em></li>
          </ol>

          <p><strong>Answers:</strong> 1. por (reason/thanks for), 2. para (recipient), 3. por (means of transport), 4. para (goal/profession)</p>

          <h2>Advanced Usage Tips</h2>

          <h3>Fixed Expressions with POR</h3>
          <ul>
            <li><em>por favor</em> - please</li>
            <li><em>por ejemplo</em> - for example</li>
            <li><em>por fin</em> - finally</li>
            <li><em>por supuesto</em> - of course</li>
            <li><em>por lo menos</em> - at least</li>
          </ul>

          <h3>Fixed Expressions with PARA</h3>
          <ul>
            <li><em>para siempre</em> - forever</li>
            <li><em>para nada</em> - not at all</li>
            <li><em>para colmo</em> - to top it all off</li>
            <li><em>para que</em> - so that</li>
          </ul>

          <h2>The Bottom Line</h2>

          <p>
            Mastering por vs. para isn't about memorizing endless lists of rules – it's about understanding 
            the fundamental difference in perspective. <strong>Por</strong> explains the reason or means 
            behind something that already happened, while <strong>para</strong> expresses the purpose or 
            goal of something moving forward.
          </p>

          <p>
            With consistent practice and these memory techniques, you'll develop an intuitive feel for when 
            to use each preposition. Remember: language learning is a journey, and every mistake is a step 
            toward fluency.
          </p>

          <div className="bg-green-50 border-l-4 border-green-400 p-4 my-6">
            <p className="mb-0">
              <strong>Pro Tip:</strong> When in doubt, ask yourself: "Am I explaining WHY something happened 
              (por) or WHAT I want to achieve (para)?" This simple question will guide you to the right choice 
              90% of the time.
            </p>
          </div>
        </div>

        {/* Related Posts */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/blog/ser-vs-estar-ultimate-guide-students" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  Ser vs. Estar: The Ultimate Guide for Students
                </h4>
                <p className="text-slate-600 text-sm">
                  Master another challenging Spanish grammar concept with our comprehensive guide.
                </p>
              </div>
            </Link>
            <Link href="/blog/gcse-spanish-speaking-exam-tips" className="group">
              <div className="border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                <h4 className="font-semibold text-slate-900 group-hover:text-indigo-600 mb-2">
                  GCSE Spanish Speaking Exam: 5 Essential Tips for a Top Grade
                </h4>
                <p className="text-slate-600 text-sm">
                  Apply your por vs para knowledge in your GCSE Spanish speaking exam.
                </p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
