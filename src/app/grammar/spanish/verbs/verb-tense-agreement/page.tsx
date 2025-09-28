import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'verb-tense-agreement',
  title: 'Spanish Verb Tense Agreement - Sequence and Concordance',
  description: 'Master Spanish verb tense agreement including sequence of tenses, concordance rules, and temporal relationships between clauses.',
  difficulty: 'advanced',
  keywords: ['spanish tense agreement', 'sequence of tenses', 'concordance', 'temporal relationships', 'subordinate clauses'],
  examples: ['Dijo que vendría', 'Espero que hayas estudiado', 'Si tuviera tiempo, iría']
});

const sections = [
  {
    title: 'Understanding Verb Tense Agreement',
    content: 'Verb tense agreement (concordancia temporal) refers to the logical relationship between tenses in main and subordinate clauses. Spanish follows specific rules to maintain temporal coherence.',
    examples: [
      {
        spanish: 'Creo que María está en casa.',
        english: 'I think María is at home.',
        highlight: ['Creo', 'está']
      },
      {
        spanish: 'Creía que María estaba en casa.',
        english: 'I thought María was at home.',
        highlight: ['Creía', 'estaba']
      }
    ]
  },
  {
    title: 'Present Tense Main Clause',
    content: 'When the main clause is in present tense, the subordinate clause can use various tenses depending on the temporal relationship.',
    examples: [
      {
        spanish: 'Sé que estudia mucho.',
        english: 'I know he/she studies a lot. (simultaneous)',
        highlight: ['Sé', 'estudia']
      },
      {
        spanish: 'Creo que estudiará mañana.',
        english: 'I think he/she will study tomorrow. (future)',
        highlight: ['Creo', 'estudiará']
      },
      {
        spanish: 'Veo que ha terminado.',
        english: 'I see he/she has finished. (recent past)',
        highlight: ['Veo', 'ha terminado']
      }
    ],
    subsections: [
      {
        title: 'Tense Options with Present Main Clause',
        content: 'Various subordinate clause tenses are possible with present main verbs.',
        conjugationTable: {
          title: 'Present Main Clause + Subordinate Options',
          conjugations: [
            { pronoun: 'Simultaneous', form: 'Sé que estudia', english: 'I know he/she studies' },
            { pronoun: 'Future', form: 'Creo que estudiará', english: 'I think he/she will study' },
            { pronoun: 'Recent past', form: 'Veo que ha estudiado', english: 'I see he/she has studied' },
            { pronoun: 'Distant past', form: 'Sé que estudió', english: 'I know he/she studied' },
            { pronoun: 'Habitual past', form: 'Sé que estudiaba', english: 'I know he/she used to study' }
          ]
        }
      }
    ]
  },
  {
    title: 'Past Tense Main Clause',
    content: 'When the main clause is in past tense, the subordinate clause options are more restricted to maintain temporal logic.',
    examples: [
      {
        spanish: 'Sabía que estudiaba mucho.',
        english: 'I knew he/she studied a lot. (simultaneous past)',
        highlight: ['Sabía', 'estudiaba']
      },
      {
        spanish: 'Dijo que vendría mañana.',
        english: 'He/She said he/she would come tomorrow. (conditional)',
        highlight: ['Dijo', 'vendría']
      },
      {
        spanish: 'Creía que había terminado.',
        english: 'I thought he/she had finished. (past perfect)',
        highlight: ['Creía', 'había terminado']
      }
    ],
    subsections: [
      {
        title: 'Tense Options with Past Main Clause',
        content: 'Limited subordinate clause options maintain temporal coherence.',
        conjugationTable: {
          title: 'Past Main Clause + Subordinate Options',
          conjugations: [
            { pronoun: 'Simultaneous', form: 'Sabía que estudiaba', english: 'I knew he/she was studying' },
            { pronoun: 'Future in past', form: 'Dijo que estudiaría', english: 'He/She said he/she would study' },
            { pronoun: 'Prior action', form: 'Creía que había estudiado', english: 'I thought he/she had studied' },
            { pronoun: 'Completed past', form: 'Supe que estudió', english: 'I found out he/she studied' }
          ]
        }
      }
    ]
  },
  {
    title: 'Subjunctive Tense Agreement',
    content: 'Subjunctive clauses follow specific tense agreement rules based on the main clause tense.',
    examples: [
      {
        spanish: 'Espero que estudie para el examen.',
        english: 'I hope he/she studies for the exam.',
        highlight: ['Espero', 'estudie']
      },
      {
        spanish: 'Esperaba que estudiara para el examen.',
        english: 'I hoped he/she would study for the exam.',
        highlight: ['Esperaba', 'estudiara']
      }
    ],
    subsections: [
      {
        title: 'Present Main Clause + Subjunctive',
        content: 'Present or perfect subjunctive with present main clause.',
        conjugationTable: {
          title: 'Present Main + Subjunctive Options',
          conjugations: [
            { pronoun: 'Simultaneous/Future', form: 'Espero que estudie', english: 'I hope he/she studies' },
            { pronoun: 'Completed action', form: 'Espero que haya estudiado', english: 'I hope he/she has studied' },
            { pronoun: 'Doubt present', form: 'Dudo que estudie', english: 'I doubt he/she studies' },
            { pronoun: 'Emotion present', form: 'Me alegra que estudie', english: 'I\'m glad he/she studies' }
          ]
        }
      },
      {
        title: 'Past Main Clause + Subjunctive',
        content: 'Imperfect or pluperfect subjunctive with past main clause.',
        conjugationTable: {
          title: 'Past Main + Subjunctive Options',
          conjugations: [
            { pronoun: 'Simultaneous', form: 'Esperaba que estudiara', english: 'I hoped he/she would study' },
            { pronoun: 'Prior action', form: 'Esperaba que hubiera estudiado', english: 'I hoped he/she had studied' },
            { pronoun: 'Past doubt', form: 'Dudaba que estudiara', english: 'I doubted he/she studied' },
            { pronoun: 'Past emotion', form: 'Me alegró que estudiara', english: 'I was glad he/she studied' }
          ]
        }
      }
    ]
  },
  {
    title: 'Conditional Sentences',
    content: 'Conditional sentences have strict tense agreement rules depending on the type of condition.',
    examples: [
      {
        spanish: 'Si tengo tiempo, iré al cine.',
        english: 'If I have time, I will go to the movies. (Type 1)',
        highlight: ['tengo', 'iré']
      },
      {
        spanish: 'Si tuviera tiempo, iría al cine.',
        english: 'If I had time, I would go to the movies. (Type 2)',
        highlight: ['tuviera', 'iría']
      },
      {
        spanish: 'Si hubiera tenido tiempo, habría ido al cine.',
        english: 'If I had had time, I would have gone to the movies. (Type 3)',
        highlight: ['hubiera tenido', 'habría ido']
      }
    ],
    subsections: [
      {
        title: 'Conditional Sentence Types',
        content: 'Three main types with specific tense combinations.',
        conjugationTable: {
          title: 'Conditional Sentence Patterns',
          conjugations: [
            { pronoun: 'Type 1 (Real)', form: 'Si + present, future', english: 'Si llueve, me quedaré' },
            { pronoun: 'Type 2 (Unreal present)', form: 'Si + imperfect subj., conditional', english: 'Si lloviera, me quedaría' },
            { pronoun: 'Type 3 (Unreal past)', form: 'Si + pluperfect subj., conditional perfect', english: 'Si hubiera llovido, me habría quedado' }
          ]
        }
      }
    ]
  },
  {
    title: 'Common Agreement Errors',
    content: 'Avoid these frequent mistakes in tense agreement.',
    examples: [
      {
        spanish: '❌ Dijo que viene mañana.',
        english: '❌ He said he comes tomorrow.',
        highlight: ['Dijo', 'viene']
      },
      {
        spanish: '✅ Dijo que vendría mañana.',
        english: '✅ He said he would come tomorrow.',
        highlight: ['Dijo', 'vendría']
      }
    ],
    subsections: [
      {
        title: 'Error Prevention Tips',
        content: '1. **Match time references** logically\n2. **Use conditional** for future in past\n3. **Follow subjunctive rules** strictly\n4. **Check conditional patterns**\n5. **Maintain temporal coherence**'
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Future Tense', url: '/grammar/spanish/verbs/future', difficulty: 'intermediate' },
  { title: 'Imperfect Tense', url: '/grammar/spanish/verbs/imperfect', difficulty: 'intermediate' },
  { title: 'Ser vs Estar', url: '/grammar/spanish/verbs/ser-vs-estar', difficulty: 'beginner' },
  { title: 'Modal Verbs', url: '/grammar/spanish/verbs/modal-verbs', difficulty: 'intermediate' }
];

export default function SpanishVerbTenseAgreementPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'Spanish Verb Tense Agreement - Sequence and Concordance',
            description: 'Master Spanish verb tense agreement including sequence of tenses, concordance rules, and temporal relationships between clauses.',
            keywords: ['spanish tense agreement', 'sequence of tenses', 'concordance', 'temporal relationships'],
            language: 'spanish',
            category: 'verbs',
            topic: 'verb-tense-agreement'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="verb-tense-agreement"
        title="Spanish Verb Tense Agreement"
        description="Master Spanish verb tense agreement including sequence of tenses, concordance rules, and temporal relationships between clauses."
        difficulty="advanced"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/verb-tense-agreement/practice"
        quizUrl="/grammar/spanish/verbs/verb-tense-agreement/quiz"
        songUrl="/songs/es?theme=grammar&topic=verb-tense-agreement"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
