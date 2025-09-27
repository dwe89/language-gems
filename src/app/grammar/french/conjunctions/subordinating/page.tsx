import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'conjunctions',
  topic: 'subordinating',
  title: 'French Subordinating Conjunctions (Que, Quand, Si, Parce Que)',
  description: 'Master French subordinating conjunctions for complex sentences. Learn que, quand, si, parce que, bien que with subordinate clauses.',
  difficulty: 'intermediate',
  keywords: [
    'french subordinating conjunctions',
    'que quand si french',
    'parce que bien que',
    'subordinate clauses french',
    'complex sentences french',
    'french grammar conjunctions'
  ],
  examples: [
    'Je pense que tu as raison (I think that you are right)',
    'Quand il arrive, nous partons (When he arrives, we leave)',
    'Si tu veux, nous pouvons partir (If you want, we can leave)',
    'Il reste parce qu\'il pleut (He stays because it\'s raining)'
  ]
});

const sections = [
  {
    title: 'Understanding Subordinating Conjunctions',
    content: `French subordinating conjunctions **introduce subordinate clauses** that depend on a main clause. They create complex sentences by showing relationships like time, cause, condition, or purpose.

Unlike coordinating conjunctions, subordinating conjunctions create **unequal relationships** where one clause depends on the other.

Main types include:
**Que** (that) - reported speech/thoughts
**Quand** (when) - time relationships
**Si** (if) - conditions
**Parce que** (because) - reasons
**Bien que** (although) - concessions

These conjunctions are essential for sophisticated French expression.`,
    examples: [
      {
        spanish: 'Je sais que tu viens. (I know that you\'re coming.)',
        english: 'Que introduces reported knowledge',
        highlight: ['sais que tu viens']
      },
      {
        spanish: 'Quand il pleut, je reste. (When it rains, I stay.)',
        english: 'Quand introduces time condition',
        highlight: ['Quand il pleut']
      },
      {
        spanish: 'Si tu veux, nous partons. (If you want, we leave.)',
        english: 'Si introduces condition',
        highlight: ['Si tu veux']
      }
    ]
  },
  {
    title: 'QUE - That (Reported Speech/Thoughts)',
    content: `**Que** is the most common subordinating conjunction, introducing reported speech, thoughts, or beliefs:`,
    examples: [
      {
        spanish: 'Je pense que tu as raison. (I think that you are right.)',
        english: 'Reporting thoughts',
        highlight: ['pense que tu as raison']
      },
      {
        spanish: 'Il dit que Marie vient. (He says that Marie is coming.)',
        english: 'Reporting speech',
        highlight: ['dit que Marie vient']
      },
      {
        spanish: 'Je crois que c\'est vrai. (I believe that it\'s true.)',
        english: 'Expressing beliefs',
        highlight: ['crois que c\'est vrai']
      }
    ],
    subsections: [
      {
        title: 'Verbs Requiring QUE',
        content: 'Common verbs that introduce que clauses:',
        conjugationTable: {
          title: 'Verbs + QUE',
          conjugations: [
            { pronoun: 'penser que', form: 'to think that', english: 'Je pense que tu viens.' },
            { pronoun: 'dire que', form: 'to say that', english: 'Il dit que c\'est vrai.' },
            { pronoun: 'croire que', form: 'to believe that', english: 'Elle croit que nous partons.' },
            { pronoun: 'savoir que', form: 'to know that', english: 'Nous savons que tu réussis.' }
          ]
        }
      },
      {
        title: 'QUE with Emotions',
        content: 'Que with verbs expressing emotions:',
        examples: [
          {
            spanish: 'Je suis content que tu viennes. (I\'m happy that you\'re coming.)',
            english: 'Il est triste que nous partions. (He\'s sad that we\'re leaving.)',
            highlight: ['content que tu viennes', 'triste que nous partions']
          }
        ]
      },
      {
        title: 'QUE Elision',
        content: 'Que becomes qu\' before vowels:',
        examples: [
          {
            spanish: 'Je pense qu\'il vient. (I think he\'s coming.)',
            english: 'Elle dit qu\'elle part. (She says she\'s leaving.)',
            highlight: ['qu\'il vient', 'qu\'elle part']
          }
        ]
      }
    ]
  },
  {
    title: 'QUAND - When (Time)',
    content: `**Quand** introduces time clauses, expressing when actions occur:`,
    examples: [
      {
        spanish: 'Quand il arrive, nous partons. (When he arrives, we leave.)',
        english: 'Time sequence',
        highlight: ['Quand il arrive']
      },
      {
        spanish: 'Je mange quand j\'ai faim. (I eat when I\'m hungry.)',
        english: 'Conditional time',
        highlight: ['quand j\'ai faim']
      },
      {
        spanish: 'Quand tu étais petit, tu jouais. (When you were little, you played.)',
        english: 'Past time reference',
        highlight: ['Quand tu étais petit']
      }
    ],
    subsections: [
      {
        title: 'QUAND vs LORSQUE',
        content: 'Quand vs more formal lorsque:',
        examples: [
          {
            spanish: 'Quand: common: Quand il vient, je pars. (When he comes, I leave.)',
            english: 'Lorsque: formal: Lorsqu\'il vient, je pars. (When he comes, I leave.)',
            highlight: ['Quand il vient', 'Lorsqu\'il vient']
          }
        ]
      },
      {
        title: 'QUAND in Questions',
        content: 'Quand as interrogative word:',
        examples: [
          {
            spanish: 'Quand viens-tu? (When are you coming?)',
            english: 'Quand est-ce que tu viens? (When are you coming?)',
            highlight: ['Quand viens-tu', 'Quand est-ce que']
          }
        ]
      },
      {
        title: 'Future with QUAND',
        content: 'Using future tense after quand:',
        examples: [
          {
            spanish: 'Quand tu viendras, nous partirons. (When you come, we will leave.)',
            english: 'Both clauses use future tense',
            highlight: ['viendras', 'partirons']
          }
        ]
      }
    ]
  },
  {
    title: 'SI - If (Conditions)',
    content: `**Si** introduces conditional clauses, expressing hypothetical situations:`,
    examples: [
      {
        spanish: 'Si tu veux, nous pouvons partir. (If you want, we can leave.)',
        english: 'Present condition',
        highlight: ['Si tu veux']
      },
      {
        spanish: 'Si j\'étais riche, j\'achèterais une maison. (If I were rich, I would buy a house.)',
        english: 'Hypothetical condition',
        highlight: ['Si j\'étais riche']
      },
      {
        spanish: 'Si tu avais étudié, tu aurais réussi. (If you had studied, you would have succeeded.)',
        english: 'Past hypothetical',
        highlight: ['Si tu avais étudié']
      }
    ],
    subsections: [
      {
        title: 'SI Conditional Types',
        content: 'Three main types of si conditions:',
        conjugationTable: {
          title: 'SI Conditionals',
          conjugations: [
            { pronoun: 'Type 1: Real', form: 'si + present, present/future', english: 'Si tu viens, je pars.' },
            { pronoun: 'Type 2: Hypothetical', form: 'si + imperfect, conditional', english: 'Si j\'étais riche, j\'achèterais.' },
            { pronoun: 'Type 3: Past hypothetical', form: 'si + pluperfect, past conditional', english: 'Si tu avais su, tu aurais dit.' }
          ]
        }
      },
      {
        title: 'SI vs S\'IL',
        content: 'Si contracts with il:',
        examples: [
          {
            spanish: 'si + il = s\'il: S\'il vient, nous partons. (If he comes, we leave.)',
            english: 'si + elle = si elle: Si elle vient, nous partons. (If she comes, we leave.)',
            highlight: ['S\'il vient', 'Si elle vient']
          }
        ]
      }
    ]
  },
  {
    title: 'PARCE QUE - Because (Reason)',
    content: `**Parce que** introduces reason clauses, explaining why something happens:`,
    examples: [
      {
        spanish: 'Il reste parce qu\'il pleut. (He stays because it\'s raining.)',
        english: 'Giving a reason',
        highlight: ['parce qu\'il pleut']
      },
      {
        spanish: 'Je suis content parce que tu viens. (I\'m happy because you\'re coming.)',
        english: 'Explaining emotions',
        highlight: ['parce que tu viens']
      },
      {
        spanish: 'Nous partons parce que c\'est tard. (We\'re leaving because it\'s late.)',
        english: 'Justifying actions',
        highlight: ['parce que c\'est tard']
      }
    ],
    subsections: [
      {
        title: 'PARCE QUE vs CAR',
        content: 'Spoken vs formal reasons:',
        examples: [
          {
            spanish: 'Parce que: spoken/common: Je reste parce qu\'il pleut. (I stay because it\'s raining.)',
            english: 'Car: formal/written: Je reste car il pleut. (I stay for it\'s raining.)',
            highlight: ['parce qu\'il pleut', 'car il pleut']
          }
        ]
      },
      {
        title: 'PARCE QUE Elision',
        content: 'Parce que becomes parce qu\' before vowels:',
        examples: [
          {
            spanish: 'parce qu\'il (because he)',
            english: 'parce qu\'elle (because she)',
            highlight: ['parce qu\'il', 'parce qu\'elle']
          }
        ]
      }
    ]
  },
  {
    title: 'BIEN QUE - Although (Concession)',
    content: `**Bien que** introduces concessive clauses, expressing contrast or concession:`,
    examples: [
      {
        spanish: 'Bien qu\'il soit fatigué, il travaille. (Although he is tired, he works.)',
        english: 'Concession with subjunctive',
        highlight: ['Bien qu\'il soit fatigué']
      },
      {
        spanish: 'Bien que ce soit difficile, j\'essaie. (Although it\'s difficult, I try.)',
        english: 'Acknowledging difficulty',
        highlight: ['Bien que ce soit difficile']
      }
    ],
    subsections: [
      {
        title: 'BIEN QUE + Subjunctive',
        content: 'Bien que always requires subjunctive:',
        examples: [
          {
            spanish: 'Bien qu\'il ait de l\'argent, il est avare. (Although he has money, he\'s stingy.)',
            english: 'Subjunctive ait, not indicative a',
            highlight: ['qu\'il ait']
          }
        ]
      },
      {
        title: 'Other Concessive Conjunctions',
        content: 'Alternatives to bien que:',
        examples: [
          {
            spanish: 'quoique (although): Quoiqu\'il soit jeune, il est sage. (Although he\'s young, he\'s wise.)',
            english: 'malgré que (despite): Malgré qu\'il pleuve, nous sortons. (Despite it raining, we go out.)',
            highlight: ['Quoiqu\'il soit', 'Malgré qu\'il pleuve']
          }
        ]
      }
    ]
  },
  {
    title: 'Purpose and Result Conjunctions',
    content: `Conjunctions expressing purpose and result:`,
    subsections: [
      {
        title: 'POUR QUE (So That/In Order That)',
        content: 'Expressing purpose (requires subjunctive):',
        examples: [
          {
            spanish: 'Je parle lentement pour que tu comprennes. (I speak slowly so that you understand.)',
            english: 'Il étudie pour qu\'il réussisse. (He studies so that he succeeds.)',
            highlight: ['pour que tu comprennes', 'pour qu\'il réussisse']
          }
        ]
      },
      {
        title: 'AFIN QUE (In Order That)',
        content: 'More formal purpose expression:',
        examples: [
          {
            spanish: 'Il travaille dur afin que sa famille vive bien. (He works hard so that his family lives well.)',
            english: 'Formal purpose with subjunctive',
            highlight: ['afin que sa famille vive']
          }
        ]
      },
      {
        title: 'SI BIEN QUE (So That/With the Result That)',
        content: 'Expressing result (uses indicative):',
        examples: [
          {
            spanish: 'Il a plu si bien que les rues sont inondées. (It rained so much that the streets are flooded.)',
            english: 'Result with indicative sont',
            highlight: ['si bien que les rues sont']
          }
        ]
      }
    ]
  },
  {
    title: 'Time Conjunctions',
    content: `Additional time-related subordinating conjunctions:`,
    subsections: [
      {
        title: 'AVANT QUE (Before)',
        content: 'Expressing time before (requires subjunctive):',
        examples: [
          {
            spanish: 'Finis tes devoirs avant que nous partions. (Finish your homework before we leave.)',
            english: 'Subjunctive partions, not indicative partons',
            highlight: ['avant que nous partions']
          }
        ]
      },
      {
        title: 'APRÈS QUE (After)',
        content: 'Expressing time after (uses indicative):',
        examples: [
          {
            spanish: 'Nous partirons après qu\'il aura fini. (We\'ll leave after he has finished.)',
            english: 'Indicative aura fini (future perfect)',
            highlight: ['après qu\'il aura fini']
          }
        ]
      },
      {
        title: 'PENDANT QUE (While)',
        content: 'Expressing simultaneous time:',
        examples: [
          {
            spanish: 'Je lis pendant que tu cuisines. (I read while you cook.)',
            english: 'Simultaneous actions',
            highlight: ['pendant que tu cuisines']
          }
        ]
      }
    ]
  },
  {
    title: 'Subordinating Conjunction Summary',
    content: `Quick reference for mood requirements:`,
    conjugationTable: {
      title: 'Conjunction + Mood',
      conjugations: [
        { pronoun: 'que (that)', form: 'indicative/subjunctive', english: 'depends on main verb' },
        { pronoun: 'quand (when)', form: 'indicative', english: 'Quand il vient, je pars.' },
        { pronoun: 'si (if)', form: 'indicative', english: 'Si tu veux, nous partons.' },
        { pronoun: 'bien que (although)', form: 'subjunctive', english: 'Bien qu\'il soit fatigué...' },
        { pronoun: 'pour que (so that)', form: 'subjunctive', english: 'Pour que tu comprennes...' }
      ]
    }
  },
  {
    title: 'Common Subordinating Conjunction Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong mood**: Using indicative instead of subjunctive after certain conjunctions
**2. Missing que**: Forgetting que in compound conjunctions
**3. Si + future**: Using future tense directly after si
**4. Parce que elision**: Not contracting parce que before vowels`,
    examples: [
      {
        spanish: '❌ Bien qu\'il est fatigué → ✅ Bien qu\'il soit fatigué',
        english: 'Wrong: bien que requires subjunctive',
        highlight: ['qu\'il soit fatigué']
      },
      {
        spanish: '❌ pour tu comprennes → ✅ pour que tu comprennes',
        english: 'Wrong: must include que in pour que',
        highlight: ['pour que tu comprennes']
      },
      {
        spanish: '❌ Si tu viendras → ✅ Si tu viens',
        english: 'Wrong: no future tense directly after si',
        highlight: ['Si tu viens']
      },
      {
        spanish: '❌ parce que il → ✅ parce qu\'il',
        english: 'Wrong: must contract before vowels',
        highlight: ['parce qu\'il']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Subjunctive Mood', url: '/grammar/french/verbs/subjunctive', difficulty: 'advanced' },
  { title: 'French Conditional Sentences', url: '/grammar/french/syntax/conditionals', difficulty: 'intermediate' },
  { title: 'French Coordinating Conjunctions', url: '/grammar/french/conjunctions/coordinating', difficulty: 'beginner' },
  { title: 'French Complex Sentences', url: '/grammar/french/syntax/complex-sentences', difficulty: 'intermediate' }
];

export default function FrenchSubordinatingConjunctionsPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'conjunctions',
              topic: 'subordinating',
              title: 'French Subordinating Conjunctions (Que, Quand, Si, Parce Que)',
              description: 'Master French subordinating conjunctions for complex sentences. Learn que, quand, si, parce que, bien que with subordinate clauses.',
              difficulty: 'intermediate',
              examples: [
                'Je pense que tu as raison (I think that you are right)',
                'Quand il arrive, nous partons (When he arrives, we leave)',
                'Si tu veux, nous pouvons partir (If you want, we can leave)',
                'Il reste parce qu\'il pleut (He stays because it\'s raining)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'conjunctions',
              topic: 'subordinating',
              title: 'French Subordinating Conjunctions (Que, Quand, Si, Parce Que)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="conjunctions"
        topic="subordinating"
        title="French Subordinating Conjunctions (Que, Quand, Si, Parce Que)"
        description="Master French subordinating conjunctions for complex sentences. Learn que, quand, si, parce que, bien que with subordinate clauses"
        difficulty="intermediate"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/conjunctions"
        practiceUrl="/grammar/french/conjunctions/subordinating/practice"
        quizUrl="/grammar/french/conjunctions/subordinating/quiz"
        songUrl="/songs/fr?theme=grammar&topic=subordinating"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
