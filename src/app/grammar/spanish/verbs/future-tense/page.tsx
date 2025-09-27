import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'spanish',
  category: 'verbs',
  topic: 'future-tense',
  title: 'Spanish Future Tense (Simple Future, Irregular Verbs, Future Uses)',
  description: 'Master Spanish future tense including formation, irregular verbs, uses for future actions, probability, and future vs ir + a + infinitive.',
  difficulty: 'intermediate',
  keywords: [
    'spanish future tense',
    'futuro simple spanish',
    'future conjugation spanish',
    'irregular future spanish',
    'spanish future probability',
    'ir a infinitive vs future'
  ],
  examples: [
    'Yo hablaré español. (I will speak Spanish.)',
    'Ella comerá mañana. (She will eat tomorrow.)',
    'Nosotros viviremos aquí. (We will live here.)',
    '¿Dónde estará Juan? (Where could Juan be?)'
  ]
});

const sections = [
  {
    title: 'Understanding Spanish Future Tense',
    content: `The Spanish future tense (futuro simple) expresses **actions that will happen in the future**, **probability or conjecture**, and **formal commands**. It's equivalent to English "will + verb."

**Uses of Spanish future tense:**
- **Future actions**: Mañana hablaré con él (Tomorrow I will speak with him)
- **Probability/conjecture**: ¿Dónde estará María? (Where could María be?)
- **Formal commands**: No matarás (Thou shall not kill)
- **Promises**: Te ayudaré (I will help you)
- **Predictions**: Lloverá mañana (It will rain tomorrow)

**Formation pattern:**
- **All verbs**: Add future endings to the **infinitive**
- **Endings**: -é, -ás, -á, -emos, -éis, -án
- **Same endings** for -AR, -ER, and -IR verbs
- **Irregular verbs**: Change the stem but keep the same endings

**Key characteristics:**
- **Built on infinitive**: Unlike other tenses that remove endings
- **All forms stressed**: Every form has a written accent
- **12 irregular verbs**: Common verbs with modified stems
- **Formal register**: More formal than "ir a + infinitive"

The future tense is essential for **making plans**, **expressing probability**, and **formal communication**.`,
    examples: [
      {
        spanish: 'El próximo año estudiaré en España. (Next year I will study in Spain.)',
        english: 'Future plan with time reference',
        highlight: ['estudiaré']
      },
      {
        spanish: '¿Qué hora será? Serán las tres. (What time could it be? It must be three o\'clock.)',
        english: 'Probability/conjecture about present',
        highlight: ['será', 'Serán']
      },
      {
        spanish: 'Te prometo que vendré. (I promise you that I will come.)',
        english: 'Promise using future tense',
        highlight: ['vendré']
      }
    ]
  },
  {
    title: 'Formation: Regular Verbs',
    content: `**All regular verbs** use the **same future endings** added to the infinitive:`,
    conjugationTable: {
      title: 'Future Tense Endings (All Verbs)',
      conjugations: [
        { pronoun: 'yo', form: 'infinitive + é', english: 'I will...' },
        { pronoun: 'tú', form: 'infinitive + ás', english: 'you will... (informal)' },
        { pronoun: 'él/ella/usted', form: 'infinitive + á', english: 'he/she/you will... (formal)' },
        { pronoun: 'nosotros/nosotras', form: 'infinitive + emos', english: 'we will...' },
        { pronoun: 'vosotros/vosotras', form: 'infinitive + éis', english: 'you all will... (Spain)' },
        { pronoun: 'ellos/ellas/ustedes', form: 'infinitive + án', english: 'they/you all will...' }
      ]
    },
    examples: [
      {
        spanish: 'HABLAR: hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán',
        english: 'COMER: comeré, comerás, comerá, comeremos, comeréis, comerán',
        highlight: ['hablaré', 'comeré']
      },
      {
        spanish: 'VIVIR: viviré, vivirás, vivirá, viviremos, viviréis, vivirán',
        english: 'Same pattern for all three verb types',
        highlight: ['viviré']
      }
    ],
    subsections: [
      {
        title: 'Examples with Regular Verbs',
        content: 'Future forms of common regular verbs:',
        examples: [
          {
            spanish: 'Mañana trabajaré todo el día. (Tomorrow I will work all day.)',
            english: 'El año que viene aprenderemos francés. (Next year we will learn French.)',
            highlight: ['trabajaré', 'aprenderemos']
          }
        ]
      },
      {
        title: 'Written Accents',
        content: 'All future forms have written accents:',
        examples: [
          {
            spanish: 'hablaré, hablarás, hablará, hablaremos, hablaréis, hablarán',
            english: 'Accents distinguish future from other tenses',
            highlight: ['hablaré, hablarás, hablará']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Future Verbs',
    content: `**12 common verbs** have **irregular stems** in the future tense:`,
    conjugationTable: {
      title: 'Irregular Future Stems',
      conjugations: [
        { pronoun: 'DECIR', form: 'dir-', english: 'diré, dirás, dirá... (I will say...)' },
        { pronoun: 'HACER', form: 'har-', english: 'haré, harás, hará... (I will do/make...)' },
        { pronoun: 'PODER', form: 'podr-', english: 'podré, podrás, podrá... (I will be able...)' },
        { pronoun: 'PONER', form: 'pondr-', english: 'pondré, pondrás, pondrá... (I will put...)' },
        { pronoun: 'QUERER', form: 'querr-', english: 'querré, querrás, querrá... (I will want...)' },
        { pronoun: 'SABER', form: 'sabr-', english: 'sabré, sabrás, sabrá... (I will know...)' },
        { pronoun: 'SALIR', form: 'saldr-', english: 'saldré, saldrás, saldrá... (I will leave...)' },
        { pronoun: 'TENER', form: 'tendr-', english: 'tendré, tendrás, tendrá... (I will have...)' },
        { pronoun: 'VALER', form: 'valdr-', english: 'valdré, valdrás, valdrá... (I will be worth...)' },
        { pronoun: 'VENIR', form: 'vendr-', english: 'vendré, vendrás, vendrá... (I will come...)' },
        { pronoun: 'CABER', form: 'cabr-', english: 'cabré, cabrás, cabrá... (I will fit...)' },
        { pronoun: 'HABER', form: 'habr-', english: 'habré, habrás, habrá... (I will have - auxiliary)' }
      ]
    },
    examples: [
      {
        spanish: 'No podré venir mañana. (I won\'t be able to come tomorrow.)',
        english: 'Tendremos que estudiar más. (We will have to study more.)',
        highlight: ['podré', 'Tendremos']
      },
      {
        spanish: 'Te diré la verdad. (I will tell you the truth.)',
        english: 'Saldrán a las ocho. (They will leave at eight.)',
        highlight: ['diré', 'Saldrán']
      }
    ],
    subsections: [
      {
        title: 'Pattern Groups',
        content: 'Irregular verbs follow patterns:',
        examples: [
          {
            spanish: 'Drop vowel: PODER → podr-, SABER → sabr-',
            english: 'Add D: PONER → pondr-, TENER → tendr-',
            highlight: ['podr-', 'pondr-']
          }
        ]
      },
      {
        title: 'Compound Verbs',
        content: 'Compounds follow the same pattern:',
        examples: [
          {
            spanish: 'COMPONER → compondr- (I will compose)',
            english: 'MANTENER → mantendr- (I will maintain)',
            highlight: ['compondr-', 'mantendr-']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Future Actions',
    content: `**Expressing actions** that will happen in the future:`,
    examples: [
      {
        spanish: 'Mañana iré al médico. (Tomorrow I will go to the doctor.)',
        english: 'La próxima semana empezaré un nuevo trabajo. (Next week I will start a new job.)',
        highlight: ['iré', 'empezaré']
      },
      {
        spanish: 'En verano viajaremos a Europa. (In summer we will travel to Europe.)',
        english: 'El año que viene me casaré. (Next year I will get married.)',
        highlight: ['viajaremos', 'me casaré']
      }
    ],
    subsections: [
      {
        title: 'Time Expressions',
        content: 'Common future time markers:',
        examples: [
          {
            spanish: 'mañana, la próxima semana, el año que viene',
            english: 'en el futuro, dentro de poco, pronto',
            highlight: ['mañana', 'la próxima semana']
          }
        ]
      },
      {
        title: 'Immediate vs Distant Future',
        content: 'Future tense for any future time:',
        examples: [
          {
            spanish: 'En cinco minutos saldré. (In five minutes I will leave.)',
            english: 'En diez años seré médico. (In ten years I will be a doctor.)',
            highlight: ['saldré', 'seré']
          }
        ]
      }
    ]
  },
  {
    title: 'Uses: Probability and Conjecture',
    content: `**Expressing probability** about present situations:`,
    examples: [
      {
        spanish: '¿Dónde estará Juan? (Where could Juan be?)',
        english: '¿Qué hora será? (What time could it be?)',
        highlight: ['estará', 'será']
      },
      {
        spanish: 'Tendrá unos treinta años. (He must be about thirty years old.)',
        english: 'Estará en casa ahora. (He\'s probably at home now.)',
        highlight: ['Tendrá', 'Estará']
      }
    ],
    subsections: [
      {
        title: 'Present Probability',
        content: 'Future tense for present conjecture:',
        examples: [
          {
            spanish: '¿Quién será? (Who could that be?)',
            english: 'Será María. (It must be María.)',
            highlight: ['será', 'Será']
          }
        ]
      },
      {
        title: 'Approximation',
        content: 'Expressing approximate quantities:',
        examples: [
          {
            spanish: 'Costará unos cien euros. (It probably costs about 100 euros.)',
            english: 'Habrá unas mil personas. (There are probably about 1000 people.)',
            highlight: ['Costará', 'Habrá']
          }
        ]
      }
    ]
  },
  {
    title: 'Future vs IR A + Infinitive',
    content: `**Differences** between future tense and "ir a + infinitive":`,
    conjugationTable: {
      title: 'Future Tense vs IR A + Infinitive',
      conjugations: [
        { pronoun: 'Future Tense', form: 'Formal, distant', english: 'Estudiaré medicina. (I will study medicine.)' },
        { pronoun: 'IR A + Infinitive', form: 'Informal, immediate', english: 'Voy a estudiar medicina. (I\'m going to study medicine.)' },
        { pronoun: 'Future Tense', form: 'Probability', english: 'Estará en casa. (He\'s probably at home.)' },
        { pronoun: 'IR A + Infinitive', form: 'Definite plans', english: 'Va a llegar tarde. (He\'s going to arrive late.)' }
      ]
    },
    examples: [
      {
        spanish: 'Mañana hablaré con el jefe. (Tomorrow I will speak with the boss.) - Formal',
        english: 'Mañana voy a hablar con el jefe. (Tomorrow I\'m going to speak with the boss.) - Informal',
        highlight: ['hablaré', 'voy a hablar']
      }
    ],
    subsections: [
      {
        title: 'Register Differences',
        content: 'Formality levels:',
        examples: [
          {
            spanish: 'FUTURE TENSE: more formal, written',
            english: 'IR A + INFINITIVE: more informal, spoken',
            highlight: ['FUTURE TENSE', 'IR A + INFINITIVE']
          }
        ]
      }
    ]
  },
  {
    title: 'Future Perfect Formation',
    content: `**Future perfect** (futuro perfecto) for actions completed by a future time:`,
    examples: [
      {
        spanish: 'Para mañana habré terminado. (By tomorrow I will have finished.)',
        english: 'Cuando llegues, ya habré salido. (When you arrive, I will have already left.)',
        highlight: ['habré terminado', 'habré salido']
      }
    ],
    subsections: [
      {
        title: 'Formation',
        content: 'HABER (future) + past participle:',
        examples: [
          {
            spanish: 'habré hablado, habrás comido, habrá vivido',
            english: 'habremos estudiado, habréis trabajado, habrán llegado',
            highlight: ['habré hablado', 'habremos estudiado']
          }
        ]
      }
    ]
  },
  {
    title: 'Conditional Tense Introduction',
    content: `**Conditional tense** (condicional) for hypothetical situations:`,
    examples: [
      {
        spanish: 'Me gustaría viajar. (I would like to travel.)',
        english: 'Podrías ayudarme. (You could help me.)',
        highlight: ['gustaría', 'Podrías']
      }
    ],
    subsections: [
      {
        title: 'Formation',
        content: 'Same stems as future + conditional endings:',
        examples: [
          {
            spanish: 'hablaría, comerías, viviría',
            english: 'tendría, podríamos, vendrían',
            highlight: ['hablaría', 'tendría']
          }
        ]
      }
    ]
  },
  {
    title: 'Future in Subordinate Clauses',
    content: `**Future tense** in **time clauses** and **conditional sentences**:`,
    examples: [
      {
        spanish: 'Cuando llegues, te llamaré. (When you arrive, I will call you.)',
        english: 'Si estudias, aprobarás. (If you study, you will pass.)',
        highlight: ['llegues', 'te llamaré', 'estudias', 'aprobarás']
      }
    ],
    subsections: [
      {
        title: 'Time Clauses',
        content: 'Present subjunctive in time clauses:',
        examples: [
          {
            spanish: 'Cuando tenga tiempo, iré. (When I have time, I will go.)',
            english: 'Present subjunctive + future indicative',
            highlight: ['tenga', 'iré']
          }
        ]
      }
    ]
  },
  {
    title: 'Expressions with Future',
    content: `**Common expressions** using future tense:`,
    examples: [
      {
        spanish: '¿Qué será, será? (What will be, will be?)',
        english: 'Ya veremos. (We\'ll see.)',
        highlight: ['será, será', 'veremos']
      },
      {
        spanish: 'El tiempo dirá. (Time will tell.)',
        english: 'Dios dirá. (God will tell / We\'ll see what happens.)',
        highlight: ['dirá', 'dirá']
      }
    ]
  },
  {
    title: 'Common Mistakes with Future Tense',
    content: `Here are frequent errors students make:

**1. Using present instead of future**: Forgetting future endings
**2. Irregular stem errors**: Using infinitive instead of irregular stem
**3. Missing accents**: Forgetting written accents on future forms
**4. Overusing future**: Using future when "ir a" is more natural`,
    examples: [
      {
        spanish: '❌ Mañana yo hablo → ✅ Mañana yo hablaré',
        english: 'Wrong: need future tense for future time',
        highlight: ['Mañana yo hablaré']
      },
      {
        spanish: '❌ Yo poneré → ✅ Yo pondré',
        english: 'Wrong: PONER has irregular stem pondr-',
        highlight: ['Yo pondré']
      },
      {
        spanish: '❌ Yo hablare → ✅ Yo hablaré',
        english: 'Wrong: missing accent on future forms',
        highlight: ['Yo hablaré']
      },
      {
        spanish: '❌ Ahora comeré → ✅ Ahora voy a comer',
        english: 'Wrong: use "ir a" for immediate future',
        highlight: ['Ahora voy a comer']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Spanish Conditional Tense', url: '/grammar/spanish/verbs/conditional', difficulty: 'intermediate' },
  { title: 'Spanish IR A + Infinitive', url: '/grammar/spanish/verbs/ir-a-infinitive', difficulty: 'beginner' },
  { title: 'Spanish Present Subjunctive', url: '/grammar/spanish/verbs/present-subjunctive', difficulty: 'advanced' },
  { title: 'Spanish Time Expressions', url: '/grammar/spanish/adverbs/time-expressions', difficulty: 'intermediate' }
];

export default function SpanishFutureTensePage() {
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
              topic: 'future-tense',
              title: 'Spanish Future Tense (Simple Future, Irregular Verbs, Future Uses)',
              description: 'Master Spanish future tense including formation, irregular verbs, uses for future actions, probability, and future vs ir + a + infinitive.',
              difficulty: 'intermediate',
              examples: [
                'Yo hablaré español. (I will speak Spanish.)',
                'Ella comerá mañana. (She will eat tomorrow.)',
                'Nosotros viviremos aquí. (We will live here.)',
                '¿Dónde estará Juan? (Where could Juan be?)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'spanish',
              category: 'verbs',
              topic: 'future-tense',
              title: 'Spanish Future Tense (Simple Future, Irregular Verbs, Future Uses)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="spanish"
        category="verbs"
        topic="future-tense"
        title="Spanish Future Tense (Simple Future, Irregular Verbs, Future Uses)"
        description="Master Spanish future tense including formation, irregular verbs, uses for future actions, probability, and future vs ir + a + infinitive"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/spanish/verbs"
        practiceUrl="/grammar/spanish/verbs/future-tense/practice"
        quizUrl="/grammar/spanish/verbs/future-tense/quiz"
        songUrl="/songs/es?theme=grammar&topic=future-tense"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
