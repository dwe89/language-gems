import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'syntax',
  topic: 'complex-sentences',
  title: 'French Complex Sentences (Subordinate Clauses, Conjunctions)',
  description: 'Master French complex sentences including subordinate clauses, conjunctions, relative clauses, and advanced sentence structures.',
  difficulty: 'advanced',
  keywords: [
    'french complex sentences',
    'subordinate clauses french',
    'french conjunctions',
    'relative clauses french',
    'advanced french syntax',
    'sentence structure french'
  ],
  examples: [
    'Je pense que tu as raison. (I think you are right.)',
    'Bien qu\'il soit tard... (Although it\'s late...)',
    'L\'homme qui parle... (The man who speaks...)',
    'Parce qu\'il pleut, nous restons. (Because it\'s raining, we stay.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Complex Sentences',
    content: `French complex sentences combine **multiple clauses** using **conjunctions, relative pronouns, and subordinating elements** to express sophisticated ideas and relationships.

**Key components:**
- **Main clause**: Independent clause with complete meaning
- **Subordinate clause**: Dependent clause needing main clause
- **Conjunctions**: Words connecting clauses (que, parce que, bien que)
- **Relative clauses**: Clauses modifying nouns (qui, que, dont, où)
- **Temporal clauses**: Time relationships (quand, dès que, avant que)

**Types of complex sentences:**
- **Noun clauses**: Je sais que tu viens
- **Adverbial clauses**: Parce qu'il pleut...
- **Relative clauses**: L'homme qui parle...
- **Conditional clauses**: Si tu veux...

Complex sentences are essential for **advanced French expression**, **academic writing**, and **sophisticated communication**.`,
    examples: [
      {
        spanish: 'Je pense que tu as raison parce que tes arguments sont convaincants. (I think you are right because your arguments are convincing.)',
        english: 'Multiple subordinate clauses in one sentence',
        highlight: ['Je pense que tu as raison parce que tes arguments sont convaincants']
      },
      {
        spanish: 'L\'homme qui parle est celui dont je t\'ai parlé. (The man who is speaking is the one I told you about.)',
        english: 'Relative clauses modifying nouns',
        highlight: ['L\'homme qui parle est celui dont je t\'ai parlé']
      }
    ]
  },
  {
    title: 'Noun Clauses with QUE',
    content: `**Noun clauses** function as **direct objects** and are introduced by **QUE**:`,
    examples: [
      {
        spanish: 'Je pense que tu as raison. (I think that you are right.)',
        english: 'Il dit qu\'il viendra. (He says that he will come.)',
        highlight: ['Je pense que tu as raison', 'Il dit qu\'il viendra']
      },
      {
        spanish: 'Nous savons que c\'est difficile. (We know that it\'s difficult.)',
        english: 'Elle croit qu\'il ment. (She believes that he is lying.)',
        highlight: ['Nous savons que c\'est difficile', 'Elle croit qu\'il ment']
      }
    ],
    subsections: [
      {
        title: 'Verbs Introducing QUE Clauses',
        content: 'Common verbs followed by QUE:',
        examples: [
          {
            spanish: 'penser que (to think that), dire que (to say that)',
            english: 'savoir que (to know that), croire que (to believe that)',
            highlight: ['penser que', 'dire que', 'savoir que']
          }
        ]
      },
      {
        title: 'QUE vs QU\'',
        content: 'Elision before vowels:',
        examples: [
          {
            spanish: 'Je pense que Paul... → Je pense qu\'il...',
            english: 'QUE becomes QU\' before vowels',
            highlight: ['que Paul', 'qu\'il']
          }
        ]
      }
    ]
  },
  {
    title: 'Causal Clauses (Because, Since)',
    content: `**Causal clauses** express **reason or cause**:`,
    conjugationTable: {
      title: 'Causal Conjunctions',
      conjugations: [
        { pronoun: 'parce que', form: 'because', english: 'Parce qu\'il pleut, nous restons. (Because it\'s raining, we stay.)' },
        { pronoun: 'puisque', form: 'since (known reason)', english: 'Puisque tu le sais... (Since you know it...)' },
        { pronoun: 'comme', form: 'as, since', english: 'Comme il est tard... (As it\'s late...)' },
        { pronoun: 'car', form: 'for, because', english: 'Il part, car il est fatigué. (He\'s leaving, for he\'s tired.)' },
        { pronoun: 'étant donné que', form: 'given that', english: 'Étant donné qu\'il pleut... (Given that it\'s raining...)' }
      ]
    },
    examples: [
      {
        spanish: 'Nous partons parce que nous sommes en retard. (We\'re leaving because we\'re late.)',
        english: 'Puisque tu insistes, j\'accepte. (Since you insist, I accept.)',
        highlight: ['parce que nous sommes en retard', 'Puisque tu insistes']
      }
    ],
    subsections: [
      {
        title: 'PARCE QUE vs PUISQUE',
        content: 'Different nuances of causality:',
        examples: [
          {
            spanish: 'PARCE QUE = new information (because)',
            english: 'PUISQUE = known information (since)',
            highlight: ['PARCE QUE', 'PUISQUE']
          }
        ]
      }
    ]
  },
  {
    title: 'Concessive Clauses (Although, Despite)',
    content: `**Concessive clauses** express **contrast or opposition**:`,
    conjugationTable: {
      title: 'Concessive Conjunctions',
      conjugations: [
        { pronoun: 'bien que + subj.', form: 'although', english: 'Bien qu\'il soit tard... (Although it\'s late...)' },
        { pronoun: 'quoique + subj.', form: 'although', english: 'Quoique ce soit difficile... (Although it\'s difficult...)' },
        { pronoun: 'malgré que + subj.', form: 'despite', english: 'Malgré qu\'il pleuve... (Despite it raining...)' },
        { pronoun: 'alors que + ind.', form: 'while, whereas', english: 'Alors qu\'il dort... (While he sleeps...)' },
        { pronoun: 'tandis que + ind.', form: 'while, whereas', english: 'Tandis que nous travaillons... (While we work...)' }
      ]
    },
    examples: [
      {
        spanish: 'Bien qu\'il soit fatigué, il continue. (Although he\'s tired, he continues.)',
        english: 'Alors qu\'il fait froid, elle porte une robe. (While it\'s cold, she\'s wearing a dress.)',
        highlight: ['Bien qu\'il soit fatigué', 'Alors qu\'il fait froid']
      }
    ],
    subsections: [
      {
        title: 'Subjunctive Required',
        content: 'BIEN QUE, QUOIQUE require subjunctive:',
        examples: [
          {
            spanish: 'Bien qu\'il soit riche... (Although he is rich...)',
            english: 'Must use subjunctive "soit" not indicative "est"',
            highlight: ['Bien qu\'il soit riche']
          }
        ]
      }
    ]
  },
  {
    title: 'Temporal Clauses (When, Before, After)',
    content: `**Temporal clauses** express **time relationships**:`,
    conjugationTable: {
      title: 'Temporal Conjunctions',
      conjugations: [
        { pronoun: 'quand + ind.', form: 'when', english: 'Quand il arrive... (When he arrives...)' },
        { pronoun: 'lorsque + ind.', form: 'when', english: 'Lorsque nous partons... (When we leave...)' },
        { pronoun: 'dès que + ind.', form: 'as soon as', english: 'Dès qu\'il vient... (As soon as he comes...)' },
        { pronoun: 'avant que + subj.', form: 'before', english: 'Avant qu\'il parte... (Before he leaves...)' },
        { pronoun: 'après que + ind.', form: 'after', english: 'Après qu\'il est parti... (After he left...)' },
        { pronoun: 'pendant que + ind.', form: 'while', english: 'Pendant qu\'il dort... (While he sleeps...)' }
      ]
    },
    examples: [
      {
        spanish: 'Quand tu viendras, nous parlerons. (When you come, we\'ll talk.)',
        english: 'Avant qu\'il ne parte, dis-lui au revoir. (Before he leaves, say goodbye to him.)',
        highlight: ['Quand tu viendras', 'Avant qu\'il ne parte']
      }
    ]
  },
  {
    title: 'Relative Clauses',
    content: `**Relative clauses** modify nouns using **relative pronouns**:`,
    conjugationTable: {
      title: 'Relative Pronouns',
      conjugations: [
        { pronoun: 'qui', form: 'who, which (subject)', english: 'L\'homme qui parle... (The man who speaks...)' },
        { pronoun: 'que', form: 'whom, which (object)', english: 'Le livre que je lis... (The book I read...)' },
        { pronoun: 'dont', form: 'whose, of which', english: 'L\'homme dont je parle... (The man I\'m talking about...)' },
        { pronoun: 'où', form: 'where, when', english: 'La ville où j\'habite... (The city where I live...)' },
        { pronoun: 'lequel/laquelle', form: 'which (after prep.)', english: 'La table sur laquelle... (The table on which...)' }
      ]
    },
    examples: [
      {
        spanish: 'La femme qui travaille ici est ma sœur. (The woman who works here is my sister.)',
        english: 'Le film que nous avons vu était excellent. (The movie we saw was excellent.)',
        highlight: ['La femme qui travaille ici', 'Le film que nous avons vu']
      }
    ],
    subsections: [
      {
        title: 'QUI vs QUE',
        content: 'Subject vs object relative pronouns:',
        examples: [
          {
            spanish: 'QUI = subject (L\'homme qui parle)',
            english: 'QUE = object (L\'homme que je vois)',
            highlight: ['qui parle', 'que je vois']
          }
        ]
      }
    ]
  },
  {
    title: 'Conditional Clauses (If)',
    content: `**Conditional clauses** express **hypothetical situations**:`,
    conjugationTable: {
      title: 'Conditional Patterns',
      conjugations: [
        { pronoun: 'Si + present', form: 'If + present', english: 'Si tu veux, nous partons. (If you want, we leave.)' },
        { pronoun: 'Si + imperfect', form: 'If + imperfect', english: 'Si j\'étais riche... (If I were rich...)' },
        { pronoun: 'Si + pluperfect', form: 'If + pluperfect', english: 'Si j\'avais su... (If I had known...)' }
      ]
    },
    examples: [
      {
        spanish: 'Si il pleut, nous resterons à la maison. (If it rains, we\'ll stay home.)',
        english: 'Si j\'étais toi, je partirais. (If I were you, I would leave.)',
        highlight: ['Si il pleut, nous resterons', 'Si j\'étais toi, je partirais']
      }
    ]
  },
  {
    title: 'Purpose Clauses (So That, In Order To)',
    content: `**Purpose clauses** express **intention or goal**:`,
    conjugationTable: {
      title: 'Purpose Conjunctions',
      conjugations: [
        { pronoun: 'pour que + subj.', form: 'so that', english: 'Pour qu\'il comprenne... (So that he understands...)' },
        { pronoun: 'afin que + subj.', form: 'in order that', english: 'Afin que nous réussissions... (In order that we succeed...)' },
        { pronoun: 'de peur que + subj.', form: 'for fear that', english: 'De peur qu\'il tombe... (For fear that he falls...)' },
        { pronoun: 'de sorte que + subj.', form: 'so that', english: 'De sorte que tout soit prêt... (So that everything is ready...)' }
      ]
    },
    examples: [
      {
        spanish: 'Je parle lentement pour que tu comprennes. (I speak slowly so that you understand.)',
        english: 'Il étudie afin qu\'il réussisse. (He studies in order that he succeeds.)',
        highlight: ['pour que tu comprennes', 'afin qu\'il réussisse']
      }
    ]
  },
  {
    title: 'Result Clauses (So That, Such That)',
    content: `**Result clauses** express **consequence or result**:`,
    examples: [
      {
        spanish: 'Il parle si vite que je ne comprends pas. (He speaks so fast that I don\'t understand.)',
        english: 'Elle est si belle qu\'elle attire tous les regards. (She\'s so beautiful that she attracts all eyes.)',
        highlight: ['si vite que je ne comprends pas', 'si belle qu\'elle attire tous les regards']
      }
    ],
    subsections: [
      {
        title: 'SI...QUE Construction',
        content: 'Intensity + result:',
        examples: [
          {
            spanish: 'Il fait si froid que l\'eau gèle. (It\'s so cold that water freezes.)',
            english: 'Expresses degree and consequence',
            highlight: ['si froid que l\'eau gèle']
          }
        ]
      }
    ]
  },
  {
    title: 'Comparison Clauses',
    content: `**Comparison clauses** express **similarity, difference, or degree**:`,
    conjugationTable: {
      title: 'Comparison Conjunctions',
      conjugations: [
        { pronoun: 'comme', form: 'as, like', english: 'Comme tu le sais... (As you know...)' },
        { pronoun: 'ainsi que', form: 'as well as', english: 'Pierre ainsi que Marie... (Pierre as well as Marie...)' },
        { pronoun: 'de même que', form: 'just as', english: 'De même que hier... (Just as yesterday...)' },
        { pronoun: 'plus...que', form: 'more...than', english: 'Plus grand que moi... (Taller than me...)' },
        { pronoun: 'moins...que', form: 'less...than', english: 'Moins cher que ça... (Less expensive than that...)' }
      ]
    }
  },
  {
    title: 'Sentence Coordination',
    content: `**Coordinating** multiple clauses of **equal importance**:`,
    conjugationTable: {
      title: 'Coordinating Conjunctions',
      conjugations: [
        { pronoun: 'et', form: 'and', english: 'Il vient et elle part. (He comes and she leaves.)' },
        { pronoun: 'mais', form: 'but', english: 'Il veut mais il ne peut pas. (He wants but he can\'t.)' },
        { pronoun: 'ou', form: 'or', english: 'Tu viens ou tu restes? (Are you coming or staying?)' },
        { pronoun: 'donc', form: 'therefore', english: 'Il pleut, donc nous restons. (It\'s raining, therefore we stay.)' },
        { pronoun: 'car', form: 'for, because', english: 'Il part, car il est tard. (He\'s leaving, for it\'s late.)' }
      ]
    }
  },
  {
    title: 'Complex Sentence Patterns',
    content: `**Advanced patterns** combining multiple clause types:`,
    examples: [
      {
        spanish: 'Je pense que l\'homme qui parle est celui dont tu m\'as parlé parce qu\'il ressemble à ta description. (I think the man who is speaking is the one you told me about because he matches your description.)',
        english: 'Multiple subordinate clauses in complex relationship',
        highlight: ['Je pense que l\'homme qui parle est celui dont tu m\'as parlé parce qu\'il ressemble à ta description']
      }
    ],
    subsections: [
      {
        title: 'Embedded Clauses',
        content: 'Clauses within clauses:',
        examples: [
          {
            spanish: 'Il dit qu\'il pense que tu as raison. (He says that he thinks that you are right.)',
            english: 'Noun clause containing another noun clause',
            highlight: ['Il dit qu\'il pense que tu as raison']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Complex Sentence Mistakes',
    content: `Here are frequent errors with complex sentences:

**1. Mood errors**: Wrong subjunctive/indicative choice
**2. Tense sequence**: Incorrect tense coordination
**3. Pronoun confusion**: Wrong relative pronouns
**4. Conjunction misuse**: Inappropriate conjunctions`,
    examples: [
      {
        spanish: '❌ Bien qu\'il est fatigué → ✅ Bien qu\'il soit fatigué',
        english: 'Wrong: need subjunctive after BIEN QUE',
        highlight: ['Bien qu\'il soit fatigué']
      },
      {
        spanish: '❌ L\'homme que parle → ✅ L\'homme qui parle',
        english: 'Wrong: QUI for subject, QUE for object',
        highlight: ['L\'homme qui parle']
      },
      {
        spanish: '❌ Pour qu\'il comprend → ✅ Pour qu\'il comprenne',
        english: 'Wrong: need subjunctive after POUR QUE',
        highlight: ['Pour qu\'il comprenne']
      },
      {
        spanish: '❌ Après qu\'il soit parti → ✅ Après qu\'il est parti',
        english: 'Wrong: APRÈS QUE takes indicative, not subjunctive',
        highlight: ['Après qu\'il est parti']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Subjunctive Mood', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' },
  { title: 'French Relative Pronouns', url: '/grammar/french/pronouns/relative-pronouns', difficulty: 'advanced' },
  { title: 'French Conjunctions', url: '/grammar/french/conjunctions/subordinating', difficulty: 'intermediate' },
  { title: 'French Conditional Tense', url: '/grammar/french/verbs/conditional', difficulty: 'advanced' }
];

export default function FrenchComplexSentencesPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'syntax',
              topic: 'complex-sentences',
              title: 'French Complex Sentences (Subordinate Clauses, Conjunctions)',
              description: 'Master French complex sentences including subordinate clauses, conjunctions, relative clauses, and advanced sentence structures.',
              difficulty: 'advanced',
              examples: [
                'Je pense que tu as raison. (I think you are right.)',
                'Bien qu\'il soit tard... (Although it\'s late...)',
                'L\'homme qui parle... (The man who speaks...)',
                'Parce qu\'il pleut, nous restons. (Because it\'s raining, we stay.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'syntax',
              topic: 'complex-sentences',
              title: 'French Complex Sentences (Subordinate Clauses, Conjunctions)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="syntax"
        topic="complex-sentences"
        title="French Complex Sentences (Subordinate Clauses, Conjunctions)"
        description="Master French complex sentences including subordinate clauses, conjunctions, relative clauses, and advanced sentence structures"
        difficulty="advanced"
        estimatedTime={22}
        sections={sections}
        backUrl="/grammar/french/syntax"
        practiceUrl="/grammar/french/syntax/complex-sentences/practice"
        quizUrl="/grammar/french/syntax/complex-sentences/quiz"
        songUrl="/songs/fr?theme=grammar&topic=complex-sentences"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
