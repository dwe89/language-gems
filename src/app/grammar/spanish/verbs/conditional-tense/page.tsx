import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'conditional-tense',
  title: 'Spanish Conditional Tense (Would, Could, Should - Hypothetical Actions)',
  description: 'Master Spanish conditional tense including formation, irregular verbs, uses for hypothetical situations, politeness, and conditional sentences.',
  difficulty: 'intermediate',
  keywords: [
    'spanish conditional tense',
    'condicional spanish',
    'would could should spanish',
    'hypothetical spanish',
    'conditional sentences spanish',
    'polite requests spanish'
  ],
  examples: [
    'Yo hablaría español. (I would speak Spanish.)',
    '¿Podrías ayudarme? (Could you help me?)',
    'Me gustaría viajar. (I would like to travel.)',
    'Si tuviera dinero, compraría una casa. (If I had money, I would buy a house.)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Conditional Tense',
    content: `The Spanish conditional tense (condicional simple) expresses **hypothetical actions**, **polite requests**, **probability in the past**, and **actions that would happen under certain conditions**. It's equivalent to English "would + verb."

**Uses of Spanish conditional:**
- **Hypothetical actions**: Hablaría español si viviera en España (I would speak Spanish if I lived in Spain)
- **Polite requests**: ¿Podrías ayudarme? (Could you help me?)
- **Probability in past**: Serían las tres cuando llegó (It was probably three when he arrived)
- **Wishes and desires**: Me gustaría viajar (I would like to travel)
- **Advice**: Deberías estudiar más (You should study more)

**Formation pattern:**
- **All verbs**: Add conditional endings to the **infinitive**
- **Same stems as future**: Uses same irregular stems as future tense
- **Endings**: -ía, -ías, -ía, -íamos, -íais, -ían
- **All forms have accents**: Every form has written accent on í

**Key characteristics:**
- **Built on infinitive**: Like future tense
- **Same irregular verbs**: 12 irregular verbs like future
- **Polite register**: More polite than direct commands
- **Hypothetical nature**: Actions that might happen under conditions

The conditional is essential for **polite communication**, **expressing wishes**, and **hypothetical situations**.`,
    examples: [
      {
        spanish: 'Si tuviera tiempo, estudiaría más. (If I had time, I would study more.)',
        english: 'Hypothetical situation with condition',
        highlight: ['estudiaría']
      },
      {
        spanish: '¿Podrías prestarme tu libro? (Could you lend me your book?)',
        english: 'Polite request using conditional',
        highlight: ['Podrías']
      },
      {
        spanish: 'Me dijeron que vendrían mañana. (They told me they would come tomorrow.)',
        english: 'Reported speech with conditional',
        highlight: ['vendrían']
      }
    ]
  },
  {
    title: 'Formation: Regular Verbs',
    content: `**All regular verbs** use the **same conditional endings** added to the infinitive:`,
    conjugationTable: {
      title: 'Conditional Tense Endings (All Verbs)',
      conjugations: [
        { pronoun: 'yo', form: 'infinitive + ía', english: 'I would...' },
        { pronoun: 'tú', form: 'infinitive + ías', english: 'you would... (informal)' },
        { pronoun: 'él/ella/usted', form: 'infinitive + ía', english: 'he/she/you would... (formal)' },
        { pronoun: 'nosotros/nosotras', form: 'infinitive + íamos', english: 'we would...' },
        { pronoun: 'vosotros/vosotras', form: 'infinitive + íais', english: 'you all would... (Spain)' },
        { pronoun: 'ellos/ellas/ustedes', form: 'infinitive + ían', english: 'they/you all would...' }
      ]
    },
    examples: [
      {
        spanish: 'HABLAR: hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían',
        english: 'COMER: comería, comerías, comería, comeríamos, comeríais, comerían',
        highlight: ['hablaría', 'comería']
      },
      {
        spanish: 'VIVIR: viviría, vivirías, viviría, viviríamos, viviríais, vivirían',
        english: 'Same pattern for all three verb types',
        highlight: ['viviría']
      }
    ],
    subsections: [
      {
        title: 'Examples with Regular Verbs',
        content: 'Conditional forms of common regular verbs:',
        examples: [
          {
            spanish: 'Yo trabajaría en España. (I would work in Spain.)',
            english: 'Nosotros aprenderíamos francés. (We would learn French.)',
            highlight: ['trabajaría', 'aprenderíamos']
          }
        ]
      },
      {
        title: 'All Forms Have Accents',
        content: 'Every conditional form has written accent on í:',
        examples: [
          {
            spanish: 'hablaría, hablarías, hablaría, hablaríamos, hablaríais, hablarían',
            english: 'Accents distinguish conditional from other tenses',
            highlight: ['hablaría, hablarías, hablaría']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Conditional Verbs',
    content: `**Same 12 verbs** that are irregular in future are irregular in conditional:`,
    conjugationTable: {
      title: 'Irregular Conditional Stems (Same as Future)',
      conjugations: [
        { pronoun: 'DECIR', form: 'dir-', english: 'diría, dirías, diría... (I would say...)' },
        { pronoun: 'HACER', form: 'har-', english: 'haría, harías, haría... (I would do/make...)' },
        { pronoun: 'PODER', form: 'podr-', english: 'podría, podrías, podría... (I could/would be able...)' },
        { pronoun: 'PONER', form: 'pondr-', english: 'pondría, pondrías, pondría... (I would put...)' },
        { pronoun: 'QUERER', form: 'querr-', english: 'querría, querrías, querría... (I would want...)' },
        { pronoun: 'SABER', form: 'sabr-', english: 'sabría, sabrías, sabría... (I would know...)' },
        { pronoun: 'SALIR', form: 'saldr-', english: 'saldría, saldrías, saldría... (I would leave...)' },
        { pronoun: 'TENER', form: 'tendr-', english: 'tendría, tendrías, tendría... (I would have...)' },
        { pronoun: 'VALER', form: 'valdr-', english: 'valdría, valdrías, valdría... (I would be worth...)' },
        { pronoun: 'VENIR', form: 'vendr-', english: 'vendría, vendrías, vendría... (I would come...)' },
        { pronoun: 'CABER', form: 'cabr-', english: 'cabría, cabrías, cabría... (I would fit...)' },
        { pronoun: 'HABER', form: 'habr-', english: 'habría, habrías, habría... (there would be...)' }
      ]
    },
    examples: [
      {
        spanish: 'No podría venir mañana. (I couldn\'t come tomorrow.)',
        english: 'Tendríamos que estudiar más. (We would have to study more.)',
        highlight: ['podría', 'Tendríamos']
      },
      {
        spanish: 'Te diría la verdad. (I would tell you the truth.)',
        english: 'Saldrían a las ocho. (They would leave at eight.)',
        highlight: ['diría', 'Saldrían']
      }
    ]
  },
  {
    title: 'Uses: Polite Requests',
    content: `**Conditional for polite requests** and suggestions:`,
    examples: [
      {
        spanish: '¿Podrías ayudarme? (Could you help me?)',
        english: '¿Tendrías tiempo para hablar? (Would you have time to talk?)',
        highlight: ['Podrías', 'Tendrías']
      },
      {
        spanish: 'Me gustaría un café, por favor. (I would like a coffee, please.)',
        english: 'Deberías descansar más. (You should rest more.)',
        highlight: ['Me gustaría', 'Deberías']
      }
    ],
    subsections: [
      {
        title: 'More Polite Than Commands',
        content: 'Conditional is softer than imperative:',
        examples: [
          {
            spanish: 'DIRECT: Ayúdame. (Help me.)',
            english: 'POLITE: ¿Podrías ayudarme? (Could you help me?)',
            highlight: ['Ayúdame', 'Podrías ayudarme']
          }
        ]
      },
      {
        title: 'Common Polite Expressions',
        content: 'Frequently used polite forms:',
        examples: [
          {
            spanish: '¿Podrías...? (Could you...?)',
            english: 'Me gustaría... (I would like...)',
            highlight: ['¿Podrías...?', 'Me gustaría...']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Hypothetical Situations',
    content: `**Conditional for hypothetical actions** and situations:`,
    examples: [
      {
        spanish: 'Si tuviera dinero, compraría una casa. (If I had money, I would buy a house.)',
        english: 'Con más tiempo, estudiaría medicina. (With more time, I would study medicine.)',
        highlight: ['compraría', 'estudiaría']
      },
      {
        spanish: 'En tu lugar, yo hablaría con él. (In your place, I would talk to him.)',
        english: 'Sin coche, caminaríamos más. (Without a car, we would walk more.)',
        highlight: ['hablaría', 'caminaríamos']
      }
    ],
    subsections: [
      {
        title: 'Conditional Sentences',
        content: 'If-then constructions:',
        examples: [
          {
            spanish: 'Si + imperfect subjunctive, conditional',
            english: 'Si fuera rico, viajaría mucho. (If I were rich, I would travel a lot.)',
            highlight: ['Si fuera rico, viajaría mucho']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Probability in the Past',
    content: `**Conditional for conjecture** about past situations:`,
    examples: [
      {
        spanish: 'Serían las tres cuando llegó. (It was probably three when he arrived.)',
        english: 'Tendría unos veinte años entonces. (He was probably about twenty then.)',
        highlight: ['Serían', 'Tendría']
      },
      {
        spanish: 'Estaría en casa cuando llamaste. (He was probably at home when you called.)',
        english: 'Costaría mucho dinero. (It probably cost a lot of money.)',
        highlight: ['Estaría', 'Costaría']
      }
    ],
    subsections: [
      {
        title: 'Past Probability',
        content: 'Conditional for past conjecture:',
        examples: [
          {
            spanish: '¿Dónde estaría? (Where could he have been?)',
            english: 'Sería muy difícil. (It was probably very difficult.)',
            highlight: ['estaría', 'Sería']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Reported Speech',
    content: `**Conditional in reported speech** for future in the past:`,
    examples: [
      {
        spanish: 'Dijo que vendría mañana. (He said he would come tomorrow.)',
        english: 'Prometió que me ayudaría. (He promised he would help me.)',
        highlight: ['vendría', 'ayudaría']
      },
      {
        spanish: 'Pensé que llegarían tarde. (I thought they would arrive late.)',
        english: 'Sabía que sería difícil. (I knew it would be difficult.)',
        highlight: ['llegarían', 'sería']
      }
    ],
    subsections: [
      {
        title: 'Future in the Past',
        content: 'Actions that were future from a past perspective:',
        examples: [
          {
            spanish: 'DIRECT: "Vendré mañana." (I will come tomorrow.)',
            english: 'REPORTED: Dijo que vendría mañana. (He said he would come tomorrow.)',
            highlight: ['Vendré', 'vendría']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Wishes and Desires',
    content: `**Conditional for expressing wishes** and desires:`,
    examples: [
      {
        spanish: 'Me gustaría viajar por Europa. (I would like to travel through Europe.)',
        english: 'Querríamos una casa más grande. (We would want a bigger house.)',
        highlight: ['Me gustaría', 'Querríamos']
      },
      {
        spanish: 'Preferiría quedarse en casa. (I would prefer to stay home.)',
        english: 'Les encantaría conocerte. (They would love to meet you.)',
        highlight: ['Preferiría', 'encantaría']
      }
    ]
  },
  {
    title: 'Uses: Advice and Suggestions',
    content: `**Conditional for giving advice** and making suggestions:`,
    examples: [
      {
        spanish: 'Deberías estudiar más. (You should study more.)',
        english: 'Podrías intentarlo otra vez. (You could try it again.)',
        highlight: ['Deberías', 'Podrías']
      },
      {
        spanish: 'Yo que tú, hablaría con él. (If I were you, I would talk to him.)',
        english: 'Sería mejor salir temprano. (It would be better to leave early.)',
        highlight: ['hablaría', 'Sería mejor']
      }
    ]
  },
  {
    title: 'Conditional Perfect',
    content: `**Conditional perfect** (condicional perfecto) for actions that would have happened:`,
    examples: [
      {
        spanish: 'Habría estudiado más. (I would have studied more.)',
        english: 'Habrían llegado temprano. (They would have arrived early.)',
        highlight: ['Habría estudiado', 'Habrían llegado']
      }
    ],
    subsections: [
      {
        title: 'Formation',
        content: 'HABER (conditional) + past participle:',
        examples: [
          {
            spanish: 'habría hablado, habrías comido, habría vivido',
            english: 'habríamos estudiado, habríais trabajado, habrían llegado',
            highlight: ['habría hablado', 'habríamos estudiado']
          }
        ]
      }
    ]
  },
  {
    title: 'Conditional in Complex Sentences',
    content: `**Conditional in complex constructions**:`,
    examples: [
      {
        spanish: 'Si pudiera, te ayudaría. (If I could, I would help you.)',
        english: 'Aunque tuviera dinero, no lo compraría. (Even if I had money, I wouldn\'t buy it.)',
        highlight: ['te ayudaría', 'no lo compraría']
      }
    ]
  },
  {
    title: 'Common Expressions with Conditional',
    content: `**Fixed expressions** using conditional:`,
    examples: [
      {
        spanish: '¿Qué harías tú? (What would you do?)',
        english: 'Yo diría que... (I would say that...)',
        highlight: ['¿Qué harías tú?', 'Yo diría que']
      },
      {
        spanish: 'Me encantaría... (I would love to...)',
        english: 'Sería genial... (It would be great...)',
        highlight: ['Me encantaría', 'Sería genial']
      }
    ]
  },
  {
    title: 'Common Mistakes with Conditional',
    content: `Here are frequent errors students make:

**1. Using future instead of conditional**: Wrong tense for hypothetical situations
**2. Irregular stem errors**: Using infinitive instead of irregular stem
**3. Missing accents**: Forgetting written accents on conditional forms
**4. Wrong conditional type**: Using simple when perfect is needed`,
    examples: [
      {
        spanish: '❌ Si tuviera dinero, compraré una casa → ✅ Si tuviera dinero, compraría una casa',
        english: 'Wrong: need conditional in result clause',
        highlight: ['compraría una casa']
      },
      {
        spanish: '❌ Yo poneríá → ✅ Yo pondría',
        english: 'Wrong: PONER has irregular stem pondr-',
        highlight: ['Yo pondría']
      },
      {
        spanish: '❌ Yo hablaria → ✅ Yo hablaría',
        english: 'Wrong: missing accent on conditional forms',
        highlight: ['Yo hablaría']
      },
      {
        spanish: '❌ Hablaría con él ayer → ✅ Habría hablado con él',
        english: 'Wrong: use conditional perfect for past hypothetical',
        highlight: ['Habría hablado con él']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Future Tense', url: '/grammar/spanish/verbs/future-tense', difficulty: 'intermediate' },
  { title: 'Spanish Imperfect Subjunctive', url: '/grammar/spanish/verbs/imperfect-subjunctive', difficulty: 'advanced' },
  { title: 'Spanish Conditional Sentences', url: '/grammar/spanish/syntax/conditional-sentences', difficulty: 'advanced' },
  { title: 'Spanish Reported Speech', url: '/grammar/spanish/syntax/reported-speech', difficulty: 'intermediate' }
];

export default function SpanishConditionalTensePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-tense',
              title: 'Spanish Conditional Tense (Would, Could, Should - Hypothetical Actions)',
              description: 'Master Spanish conditional tense including formation, irregular verbs, uses for hypothetical situations, politeness, and conditional sentences.',
              difficulty: 'intermediate',
              examples: [
                'Yo hablaría español. (I would speak Spanish.)',
                '¿Podrías ayudarme? (Could you help me?)',
                'Me gustaría viajar. (I would like to travel.)',
                'Si tuviera dinero, compraría una casa. (If I had money, I would buy a house.)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'conditional-tense',
              title: 'Spanish Conditional Tense (Would, Could, Should - Hypothetical Actions)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="conditional-tense"
        title="Spanish Conditional Tense (Would, Could, Should - Hypothetical Actions)"
        description="Master Spanish conditional tense including formation, irregular verbs, uses for hypothetical situations, politeness, and conditional sentences"
        difficulty="intermediate"
        estimatedTime={17}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/conditional-tense/practice"
        quizUrl="/grammar/spanish/verbs/conditional-tense/quiz"
        songUrl="/songs/es?theme=grammar&topic=conditional-tense"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
