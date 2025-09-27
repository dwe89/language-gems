import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'pronoun-order',
  title: 'French Pronoun Order (Multiple Pronouns, Complex Placement Rules)',
  description: 'Master French pronoun order including multiple pronoun combinations, placement rules, and complex sentence structures.',
  difficulty: 'advanced',
  keywords: [
    'french pronoun order',
    'multiple pronouns french',
    'pronoun placement french',
    'complex pronouns french',
    'pronoun sequence french',
    'advanced french pronouns'
  ],
  examples: [
    'Je te le donne. (I give it to you.)',
    'Il me l\'a dit. (He told it to me.)',
    'Ne me le dis pas! (Don\'t tell it to me!)',
    'Je vais te le montrer. (I\'m going to show it to you.)'
  ]
});

const sections = [
  {
    title: 'Understanding French Pronoun Order',
    content: `French pronoun order follows **strict rules** when **multiple pronouns** appear together. Understanding these rules is essential for **advanced French fluency** and **natural expression**.

**Basic pronoun order (before verb):**
1. **me, te, se, nous, vous** (reflexive/object)
2. **le, la, les** (direct object)
3. **lui, leur** (indirect object)
4. **y** (location/abstract)
5. **en** (quantity/partitive)

**Key principles:**
- **Maximum 2-3 pronouns** typically used together
- **Position**: Before conjugated verb (after ne in negation)
- **Imperative**: Different order in affirmative commands
- **Infinitive constructions**: Before infinitive verb
- **Compound tenses**: Before auxiliary verb

**Common combinations:**
- me/te/se + le/la/les
- le/la/les + lui/leur
- y + en (rare but possible)

Mastering pronoun order is crucial for **sophisticated French expression** and **avoiding awkward repetition**.`,
    examples: [
      {
        spanish: 'Je te le donne. (I give it to you.)',
        english: 'te (indirect) + le (direct) = te le',
        highlight: ['Je te le donne']
      },
      {
        spanish: 'Il nous les montre. (He shows them to us.)',
        english: 'nous (indirect) + les (direct) = nous les',
        highlight: ['Il nous les montre']
      },
      {
        spanish: 'Elle me l\'a dit. (She told it to me.)',
        english: 'me (indirect) + l\' (direct) = me l\'',
        highlight: ['Elle me l\'a dit']
      }
    ]
  },
  {
    title: 'Basic Pronoun Order Chart',
    content: `**Complete pronoun order** before the verb:`,
    conjugationTable: {
      title: 'Pronoun Order Positions',
      conjugations: [
        { pronoun: '1st Position', form: 'me, te, se, nous, vous', english: 'Reflexive and 1st/2nd person object' },
        { pronoun: '2nd Position', form: 'le, la, les', english: 'Direct object pronouns (3rd person)' },
        { pronoun: '3rd Position', form: 'lui, leur', english: 'Indirect object pronouns (3rd person)' },
        { pronoun: '4th Position', form: 'y', english: 'Location/abstract replacement' },
        { pronoun: '5th Position', form: 'en', english: 'Quantity/partitive replacement' }
      ]
    },
    examples: [
      {
        spanish: 'Il me le donne. (He gives it to me.) - Position 1 + 2',
        english: 'Je le lui dis. (I tell it to him.) - Position 2 + 3',
        highlight: ['me le', 'le lui']
      },
      {
        spanish: 'Il m\'y emmène. (He takes me there.) - Position 1 + 4',
        english: 'Il y en a. (There are some.) - Position 4 + 5',
        highlight: ['m\'y emmène', 'Il y en a']
      }
    ]
  },
  {
    title: 'Common Two-Pronoun Combinations',
    content: `**Most frequent** two-pronoun combinations:`,
    examples: [
      {
        spanish: 'Je te le donne. (I give it to you.) - te + le',
        english: 'Il nous la montre. (He shows it to us.) - nous + la',
        highlight: ['te le', 'nous la']
      },
      {
        spanish: 'Elle me les apporte. (She brings them to me.) - me + les',
        english: 'Tu le lui dis. (You tell it to him.) - le + lui',
        highlight: ['me les', 'le lui']
      }
    ],
    subsections: [
      {
        title: 'ME/TE/NOUS/VOUS + LE/LA/LES',
        content: '1st/2nd person + direct object:',
        examples: [
          {
            spanish: 'Il me le donne. (He gives it to me.)',
            english: 'Je te la montre. (I show it to you.)',
            highlight: ['me le', 'te la']
          }
        ]
      },
      {
        title: 'LE/LA/LES + LUI/LEUR',
        content: 'Direct object + 3rd person indirect:',
        examples: [
          {
            spanish: 'Je le lui dis. (I tell it to him.)',
            english: 'Nous les leur donnons. (We give them to them.)',
            highlight: ['le lui', 'les leur']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order in Negation',
    content: `**Negation** with multiple pronouns:`,
    examples: [
      {
        spanish: 'Je ne te le donne pas. (I don\'t give it to you.)',
        english: 'Il ne nous les montre jamais. (He never shows them to us.)',
        highlight: ['ne te le donne pas', 'ne nous les montre jamais']
      },
      {
        spanish: 'Elle ne me l\'a pas dit. (She didn\'t tell it to me.)',
        english: 'Nous ne le lui donnons plus. (We don\'t give it to him anymore.)',
        highlight: ['ne me l\'a pas dit', 'ne le lui donnons plus']
      }
    ],
    subsections: [
      {
        title: 'NE...PAS Pattern',
        content: 'Standard negation with pronouns:',
        examples: [
          {
            spanish: 'Je ne te le dis pas. (I don\'t tell it to you.)',
            english: 'Pronouns stay together between ne and verb',
            highlight: ['ne te le dis pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order in Compound Tenses',
    content: `**Compound tenses** (passé composé, plus-que-parfait, etc.):`,
    examples: [
      {
        spanish: 'Je te l\'ai donné. (I gave it to you.)',
        english: 'Il nous les a montrés. (He showed them to us.)',
        highlight: ['te l\'ai donné', 'nous les a montrés']
      },
      {
        spanish: 'Elle me l\'avait dit. (She had told it to me.)',
        english: 'Nous le lui avons expliqué. (We explained it to him.)',
        highlight: ['me l\'avait dit', 'le lui avons expliqué']
      }
    ],
    subsections: [
      {
        title: 'Before Auxiliary Verb',
        content: 'Pronouns go before avoir/être:',
        examples: [
          {
            spanish: 'Tu me l\'as donné. (You gave it to me.)',
            english: 'Pronouns before auxiliary, not past participle',
            highlight: ['me l\'as donné']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order with Infinitives',
    content: `**Infinitive constructions** (vouloir, pouvoir, aller, etc.):`,
    examples: [
      {
        spanish: 'Je vais te le donner. (I\'m going to give it to you.)',
        english: 'Il peut nous les montrer. (He can show them to us.)',
        highlight: ['te le donner', 'nous les montrer']
      },
      {
        spanish: 'Elle veut me l\'expliquer. (She wants to explain it to me.)',
        english: 'Nous devons le lui dire. (We must tell it to him.)',
        highlight: ['me l\'expliquer', 'le lui dire']
      }
    ],
    subsections: [
      {
        title: 'Before Infinitive',
        content: 'Pronouns attach to infinitive:',
        examples: [
          {
            spanish: 'Je veux te le montrer. (I want to show it to you.)',
            english: 'Not: Je te le veux montrer',
            highlight: ['te le montrer']
          }
        ]
      }
    ]
  },
  {
    title: 'Pronoun Order in Imperative (Commands)',
    content: `**Imperative** has **different order** rules:`,
    conjugationTable: {
      title: 'Imperative Pronoun Order',
      conjugations: [
        { pronoun: 'Affirmative', form: 'Verb + pronouns', english: 'Donne-le-moi! (Give it to me!)' },
        { pronoun: 'Negative', form: 'Ne + pronouns + verb', english: 'Ne me le donne pas! (Don\'t give it to me!)' },
        { pronoun: 'Order (affirmative)', form: 'Direct + Indirect', english: 'Montre-les-lui! (Show them to him!)' },
        { pronoun: 'Order (negative)', form: 'Normal order', english: 'Ne les lui montre pas! (Don\'t show them to him!)' }
      ]
    },
    examples: [
      {
        spanish: 'Donne-le-moi! (Give it to me!) - Affirmative',
        english: 'Ne me le donne pas! (Don\'t give it to me!) - Negative',
        highlight: ['Donne-le-moi', 'Ne me le donne pas']
      }
    ],
    subsections: [
      {
        title: 'Affirmative Imperative',
        content: 'Pronouns after verb with hyphens:',
        examples: [
          {
            spanish: 'Montre-les-nous! (Show them to us!)',
            english: 'Dis-le-lui! (Tell it to him!)',
            highlight: ['Montre-les-nous', 'Dis-le-lui']
          }
        ]
      },
      {
        title: 'Negative Imperative',
        content: 'Normal pronoun order before verb:',
        examples: [
          {
            spanish: 'Ne nous les montre pas! (Don\'t show them to us!)',
            english: 'Ne le lui dis pas! (Don\'t tell it to him!)',
            highlight: ['Ne nous les montre pas', 'Ne le lui dis pas']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Cases: Y and EN',
    content: `**Y** and **EN** in pronoun combinations:`,
    examples: [
      {
        spanish: 'Il m\'y emmène. (He takes me there.) - me + y',
        english: 'Je t\'en donne. (I give you some.) - te + en',
        highlight: ['m\'y emmène', 't\'en donne']
      },
      {
        spanish: 'Il y en a. (There are some.) - y + en',
        english: 'Nous nous y rendons. (We go there.) - nous + y',
        highlight: ['Il y en a', 'nous y rendons']
      }
    ],
    subsections: [
      {
        title: 'Y in Combinations',
        content: 'Y comes after other object pronouns:',
        examples: [
          {
            spanish: 'Il nous y conduit. (He drives us there.)',
            english: 'Je t\'y retrouve. (I meet you there.)',
            highlight: ['nous y conduit', 't\'y retrouve']
          }
        ]
      },
      {
        title: 'EN in Combinations',
        content: 'EN comes last in pronoun order:',
        examples: [
          {
            spanish: 'Il m\'en donne. (He gives me some.)',
            english: 'Je vous en apporte. (I bring you some.)',
            highlight: ['m\'en donne', 'vous en apporte']
          }
        ]
      }
    ]
  },
  {
    title: 'Three-Pronoun Combinations (Rare)',
    content: `**Three pronouns** together (very rare, often avoided):`,
    examples: [
      {
        spanish: 'Il me les y montre. (He shows them to me there.) - Theoretical',
        english: 'Je te les en donne. (I give you some of them.) - Theoretical',
        highlight: ['me les y', 'te les en']
      },
      {
        spanish: 'Usually avoided in favor of: Il me montre les livres là-bas.',
        english: 'Or: Il me donne quelques-uns de ces livres.',
        highlight: ['Usually avoided']
      }
    ]
  },
  {
    title: 'Elision and Liaison',
    content: `**Phonetic changes** with pronoun combinations:`,
    examples: [
      {
        spanish: 'Je me le dis → Je me l\'dis (informal)',
        english: 'Il te le donne → Il te l\'donne (before vowel)',
        highlight: ['me l\'dis', 'te l\'donne']
      },
      {
        spanish: 'Nous nous en allons. (We\'re leaving.)',
        english: 'Fixed expression with liaison',
        highlight: ['nous en allons']
      }
    ]
  },
  {
    title: 'Avoiding Complex Pronoun Order',
    content: `**Strategies** to avoid complex pronoun combinations:`,
    examples: [
      {
        spanish: 'Instead of: Je te les y montre.',
        english: 'Say: Je te montre les livres là-bas.',
        highlight: ['Je te montre les livres là-bas']
      },
      {
        spanish: 'Instead of: Il me les en donne.',
        english: 'Say: Il me donne quelques livres.',
        highlight: ['Il me donne quelques livres']
      }
    ],
    subsections: [
      {
        title: 'Rephrasing Strategies',
        content: 'Alternative expressions:',
        examples: [
          {
            spanish: 'Use nouns instead of pronouns',
            english: 'Split into multiple sentences',
            highlight: ['Use nouns', 'Split sentences']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Mistakes with Pronoun Order',
    content: `Here are frequent errors with pronoun order:

**1. Wrong order**: Incorrect sequence of pronouns
**2. Position errors**: Wrong placement in sentence
**3. Imperative confusion**: Wrong order in commands
**4. Overcomplication**: Using too many pronouns together`,
    examples: [
      {
        spanish: '❌ Je lui le donne → ✅ Je le lui donne',
        english: 'Wrong: direct object comes before indirect object',
        highlight: ['Je le lui donne']
      },
      {
        spanish: '❌ Je veux le te donner → ✅ Je veux te le donner',
        english: 'Wrong: pronouns go before infinitive',
        highlight: ['Je veux te le donner']
      },
      {
        spanish: '❌ Donne-moi-le! → ✅ Donne-le-moi!',
        english: 'Wrong: direct object first in affirmative imperative',
        highlight: ['Donne-le-moi!']
      },
      {
        spanish: '❌ Je me lui le donne → ✅ Je le lui donne',
        english: 'Wrong: too many pronouns, rephrase',
        highlight: ['Je le lui donne']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Direct Object Pronouns', url: '/grammar/french/pronouns/direct-object', difficulty: 'intermediate' },
  { title: 'French Indirect Object Pronouns', url: '/grammar/french/pronouns/indirect-object', difficulty: 'intermediate' },
  { title: 'French Y and EN Pronouns', url: '/grammar/french/pronouns/y-en-pronouns', difficulty: 'advanced' },
  { title: 'French Imperative Mood', url: '/grammar/french/verbs/imperative', difficulty: 'intermediate' }
];

export default function FrenchPronounOrderPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'pronouns',
              topic: 'pronoun-order',
              title: 'French Pronoun Order (Multiple Pronouns, Complex Placement Rules)',
              description: 'Master French pronoun order including multiple pronoun combinations, placement rules, and complex sentence structures.',
              difficulty: 'advanced',
              examples: [
                'Je te le donne. (I give it to you.)',
                'Il me l\'a dit. (He told it to me.)',
                'Ne me le dis pas! (Don\'t tell it to me!)',
                'Je vais te le montrer. (I\'m going to show it to you.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'pronoun-order',
              title: 'French Pronoun Order (Multiple Pronouns, Complex Placement Rules)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="pronoun-order"
        title="French Pronoun Order (Multiple Pronouns, Complex Placement Rules)"
        description="Master French pronoun order including multiple pronoun combinations, placement rules, and complex sentence structures"
        difficulty="advanced"
        estimatedTime={20}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/pronoun-order/practice"
        quizUrl="/grammar/french/pronouns/pronoun-order/quiz"
        songUrl="/songs/fr?theme=grammar&topic=pronoun-order"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
