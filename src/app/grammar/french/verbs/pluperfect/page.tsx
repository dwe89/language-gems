import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'pluperfect',
  title: 'French Pluperfect (Plus-que-parfait) - Past Perfect Tense',
  description: 'Learn the French pluperfect (plus-que-parfait) tense for actions completed before another past action. Master formation with avoir and être.',
  difficulty: 'advanced',
  keywords: ['french pluperfect', 'plus-que-parfait', 'past perfect', 'french past tenses', 'avoir être imperfect'],
  examples: ['J\'avais mangé', 'Elle était partie', 'Nous avions fini', 'Ils s\'étaient levés']
});

const sections = [
  {
    title: 'Understanding the Pluperfect (Plus-que-parfait)',
    content: 'The **plus-que-parfait** (pluperfect) expresses an action that was completed **before** another past action. It\'s equivalent to the English "had done" construction.',
    examples: [
      {
        french: 'J\'avais mangé quand tu es arrivé.',
        english: 'I had eaten when you arrived.',
        highlight: ['avais mangé', 'es arrivé']
      },
      {
        french: 'Elle était déjà partie quand nous sommes venus.',
        english: 'She had already left when we came.',
        highlight: ['était partie', 'sommes venus']
      },
      {
        french: 'Ils avaient fini avant midi.',
        english: 'They had finished before noon.',
        highlight: ['avaient fini']
      }
    ]
  },
  {
    title: 'Formation: Imperfect Auxiliary + Past Participle',
    content: 'The plus-que-parfait is formed with the **imperfect tense** of avoir or être + **past participle**.',
    examples: [
      {
        french: 'avoir/être (imperfect) + past participle',
        english: 'auxiliary (imperfect) + past participle',
        highlight: ['avoir/être (imperfect)', 'past participle']
      }
    ],
    subsections: [
      {
        title: 'AVOIR in the Imperfect + Past Participle',
        content: 'Most verbs use **avoir** in the imperfect as their auxiliary.',
        conjugationTable: {
          title: 'AVOIR (Imperfect) + Past Participle',
          conjugations: [
            { pronoun: 'j\'', form: 'avais parlé', english: 'I had spoken' },
            { pronoun: 'tu', form: 'avais parlé', english: 'you had spoken' },
            { pronoun: 'il/elle', form: 'avait parlé', english: 'he/she had spoken' },
            { pronoun: 'nous', form: 'avions parlé', english: 'we had spoken' },
            { pronoun: 'vous', form: 'aviez parlé', english: 'you had spoken' },
            { pronoun: 'ils/elles', form: 'avaient parlé', english: 'they had spoken' }
          ]
        }
      },
      {
        title: 'ÊTRE in the Imperfect + Past Participle',
        content: 'Movement verbs and reflexive verbs use **être** in the imperfect.',
        conjugationTable: {
          title: 'ÊTRE (Imperfect) + Past Participle',
          conjugations: [
            { pronoun: 'j\'', form: 'étais parti(e)', english: 'I had left' },
            { pronoun: 'tu', form: 'étais parti(e)', english: 'you had left' },
            { pronoun: 'il/elle', form: 'était parti(e)', english: 'he/she had left' },
            { pronoun: 'nous', form: 'étions parti(e)s', english: 'we had left' },
            { pronoun: 'vous', form: 'étiez parti(e)(s)', english: 'you had left' },
            { pronoun: 'ils/elles', form: 'étaient parti(e)s', english: 'they had left' }
          ]
        }
      }
    ]
  },
  {
    title: 'Usage: Actions Before Other Past Actions',
    content: 'The plus-que-parfait shows the **chronological order** of past events.',
    examples: [
      {
        french: 'Quand je suis arrivé, il avait déjà mangé.',
        english: 'When I arrived, he had already eaten.',
        highlight: ['suis arrivé', 'avait mangé']
      },
      {
        french: 'Elle était fatiguée parce qu\'elle avait beaucoup travaillé.',
        english: 'She was tired because she had worked a lot.',
        highlight: ['était fatiguée', 'avait travaillé']
      },
      {
        french: 'Nous avons trouvé les clés qu\'il avait perdues.',
        english: 'We found the keys that he had lost.',
        highlight: ['avons trouvé', 'avait perdues']
      }
    ],
    subsections: [
      {
        title: 'Sequence of Events',
        content: 'The plus-que-parfait establishes what happened first in the past.',
        conjugationTable: {
          title: 'Chronological Order Examples',
          conjugations: [
            { pronoun: 'First action', form: 'j\'avais étudié', english: 'I had studied' },
            { pronoun: 'Second action', form: 'puis j\'ai passé l\'examen', english: 'then I took the exam' },
            { pronoun: 'First action', form: 'elle était sortie', english: 'she had gone out' },
            { pronoun: 'Second action', form: 'quand tu as téléphoné', english: 'when you called' },
            { pronoun: 'First action', form: 'nous avions dîné', english: 'we had dined' },
            { pronoun: 'Second action', form: 'avant de regarder le film', english: 'before watching the movie' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Time Expressions',
    content: 'Certain expressions often signal the use of plus-que-parfait.',
    examples: [
      {
        french: 'Après qu\'il avait fini, nous sommes partis.',
        english: 'After he had finished, we left.',
        highlight: ['Après qu\'', 'avait fini']
      },
      {
        french: 'Dès qu\'elle était arrivée, elle a appelé.',
        english: 'As soon as she had arrived, she called.',
        highlight: ['Dès qu\'', 'était arrivée']
      },
      {
        french: 'Une fois que nous avions mangé, nous avons regardé la télé.',
        english: 'Once we had eaten, we watched TV.',
        highlight: ['Une fois que', 'avions mangé']
      }
    ],
    subsections: [
      {
        title: 'Temporal Conjunctions',
        content: 'Conjunctions that often introduce plus-que-parfait clauses.',
        conjugationTable: {
          title: 'Time Expressions with Plus-que-parfait',
          conjugations: [
            { pronoun: 'après que', form: 'après qu\'il avait parlé', english: 'after he had spoken' },
            { pronoun: 'dès que', form: 'dès qu\'elle était partie', english: 'as soon as she had left' },
            { pronoun: 'une fois que', form: 'une fois que nous avions fini', english: 'once we had finished' },
            { pronoun: 'aussitôt que', form: 'aussitôt qu\'ils avaient compris', english: 'as soon as they had understood' },
            { pronoun: 'quand', form: 'quand j\'avais terminé', english: 'when I had finished' },
            { pronoun: 'lorsque', form: 'lorsque tu avais lu', english: 'when you had read' }
          ]
        }
      }
    ]
  },
  {
    title: 'Agreement Rules',
    content: 'The same agreement rules apply as in the passé composé.',
    examples: [
      {
        french: 'Marie était déjà partie. (agreement with être)',
        english: 'Marie had already left.',
        highlight: ['partie']
      },
      {
        french: 'Les lettres qu\'il avait écrites. (agreement with preceding direct object)',
        english: 'The letters that he had written.',
        highlight: ['écrites']
      },
      {
        french: 'Elles s\'étaient levées tôt. (reflexive agreement)',
        english: 'They had gotten up early.',
        highlight: ['levées']
      }
    ],
    subsections: [
      {
        title: 'Agreement with ÊTRE',
        content: 'Past participle agrees with the subject when using être.',
        conjugationTable: {
          title: 'ÊTRE Agreement in Plus-que-parfait',
          conjugations: [
            { pronoun: 'il', form: 'était parti', english: 'he had left' },
            { pronoun: 'elle', form: 'était partie', english: 'she had left' },
            { pronoun: 'ils', form: 'étaient partis', english: 'they (m) had left' },
            { pronoun: 'elles', form: 'étaient parties', english: 'they (f) had left' },
            { pronoun: 'nous (m)', form: 'étions partis', english: 'we (m) had left' },
            { pronoun: 'nous (f)', form: 'étions parties', english: 'we (f) had left' }
          ]
        }
      },
      {
        title: 'Agreement with AVOIR',
        content: 'Agreement only when direct object precedes the verb.',
        conjugationTable: {
          title: 'AVOIR Agreement in Plus-que-parfait',
          conjugations: [
            { pronoun: 'No agreement', form: 'j\'avais vu la fille', english: 'I had seen the girl' },
            { pronoun: 'Agreement', form: 'la fille que j\'avais vue', english: 'the girl I had seen' },
            { pronoun: 'No agreement', form: 'tu avais pris les livres', english: 'you had taken the books' },
            { pronoun: 'Agreement', form: 'les livres que tu avais pris', english: 'the books you had taken' },
            { pronoun: 'Pronoun object', form: 'je l\'avais vue (la fille)', english: 'I had seen her' },
            { pronoun: 'Pronoun object', form: 'je les avais pris (les livres)', english: 'I had taken them' }
          ]
        }
      }
    ]
  },
  {
    title: 'Reflexive Verbs in Plus-que-parfait',
    content: 'Reflexive verbs use être in the imperfect and follow agreement rules.',
    examples: [
      {
        french: 'Elle s\'était levée très tôt.',
        english: 'She had gotten up very early.',
        highlight: ['s\'était levée']
      },
      {
        french: 'Nous nous étions dépêchés.',
        english: 'We had hurried.',
        highlight: ['nous étions dépêchés']
      },
      {
        french: 'Ils s\'étaient rencontrés à Paris.',
        english: 'They had met in Paris.',
        highlight: ['s\'étaient rencontrés']
      }
    ],
    subsections: [
      {
        title: 'Reflexive Conjugation Pattern',
        content: 'Reflexive pronouns + être (imperfect) + past participle.',
        conjugationTable: {
          title: 'Reflexive Verbs in Plus-que-parfait',
          conjugations: [
            { pronoun: 'je', form: 'me étais levé(e)', english: 'I had gotten up' },
            { pronoun: 'tu', form: 'te étais levé(e)', english: 'you had gotten up' },
            { pronoun: 'il/elle', form: 'se était levé(e)', english: 'he/she had gotten up' },
            { pronoun: 'nous', form: 'nous étions levé(e)s', english: 'we had gotten up' },
            { pronoun: 'vous', form: 'vous étiez levé(e)(s)', english: 'you had gotten up' },
            { pronoun: 'ils/elles', form: 'se étaient levé(e)s', english: 'they had gotten up' }
          ]
        }
      }
    ]
  },
  {
    title: 'Negation in Plus-que-parfait',
    content: 'Negative particles surround the auxiliary verb in the imperfect.',
    examples: [
      {
        french: 'Je n\'avais pas fini mes devoirs.',
        english: 'I had not finished my homework.',
        highlight: ['n\'avais pas']
      },
      {
        french: 'Elle n\'était jamais venue ici.',
        english: 'She had never come here.',
        highlight: ['n\'était jamais']
      },
      {
        french: 'Nous ne nous étions pas rencontrés avant.',
        english: 'We had not met before.',
        highlight: ['ne nous étions pas']
      }
    ],
    subsections: [
      {
        title: 'Negation Patterns',
        content: 'Various negative expressions in plus-que-parfait.',
        conjugationTable: {
          title: 'Negation in Plus-que-parfait',
          conjugations: [
            { pronoun: 'ne...pas', form: 'je n\'avais pas mangé', english: 'I had not eaten' },
            { pronoun: 'ne...jamais', form: 'tu n\'étais jamais venu', english: 'you had never come' },
            { pronoun: 'ne...rien', form: 'il n\'avait rien dit', english: 'he had said nothing' },
            { pronoun: 'ne...personne', form: 'elle n\'avait vu personne', english: 'she had seen nobody' },
            { pronoun: 'ne...plus', form: 'nous n\'avions plus parlé', english: 'we had no longer spoken' },
            { pronoun: 'ne...que', form: 'ils n\'avaient mangé que ça', english: 'they had only eaten that' }
          ]
        }
      }
    ]
  },
  {
    title: 'Plus-que-parfait vs Other Past Tenses',
    content: 'Understanding when to use plus-que-parfait versus passé composé and imparfait.',
    examples: [
      {
        french: 'Il pleuvait (imparfait) quand j\'avais quitté (plus-que-parfait) la maison, mais maintenant j\'ai trouvé (passé composé) un parapluie.',
        english: 'It was raining when I had left the house, but now I found an umbrella.',
        highlight: ['pleuvait', 'avais quitté', 'ai trouvé']
      }
    ],
    subsections: [
      {
        title: 'Tense Comparison',
        content: 'When to use each past tense.',
        conjugationTable: {
          title: 'Past Tense Usage',
          conjugations: [
            { pronoun: 'Plus-que-parfait', form: 'j\'avais mangé avant', english: 'I had eaten before (earliest action)' },
            { pronoun: 'Imparfait', form: 'je regardais la télé', english: 'I was watching TV (ongoing)' },
            { pronoun: 'Passé composé', form: 'tu es arrivé', english: 'you arrived (completed action)' },
            { pronoun: 'Example', form: 'j\'avais mangé quand tu es arrivé', english: 'I had eaten when you arrived' },
            { pronoun: 'Example', form: 'il pleuvait quand elle était partie', english: 'it was raining when she had left' },
            { pronoun: 'Example', form: 'nous avons vu le film qu\'il avait recommandé', english: 'we saw the movie he had recommended' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Perfect', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' },
  { title: 'Imparfait', url: '/grammar/french/verbs/imparfait', difficulty: 'intermediate' },
  { title: 'Future Perfect', url: '/grammar/french/verbs/future-perfect', difficulty: 'advanced' },
  { title: 'Conditional Perfect', url: '/grammar/french/verbs/conditional-perfect', difficulty: 'advanced' }
];

export default function FrenchPluperfectPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'French Pluperfect (Plus-que-parfait) - Past Perfect Tense',
            description: 'Learn the French pluperfect (plus-que-parfait) tense for actions completed before another past action. Master formation with avoir and être.',
            keywords: ['french pluperfect', 'plus-que-parfait', 'past perfect', 'french past tenses'],
            language: 'french',
            category: 'verbs',
            topic: 'pluperfect'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="pluperfect"
        title="French Pluperfect (Plus-que-parfait)"
        description="Learn the French pluperfect (plus-que-parfait) tense for actions completed before another past action. Master formation with avoir and être."
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/pluperfect/practice"
        quizUrl="/grammar/french/verbs/pluperfect/quiz"
        songUrl="/songs/fr?theme=grammar&topic=pluperfect"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
