import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'pronouns',
  topic: 'direct-object',
  title: 'French Direct Object Pronouns (Me, Te, Le, La, Nous, Vous, Les)',
  description: 'Master French direct object pronouns with placement rules. Learn me, te, le, la, nous, vous, les with verbs and agreement.',
  difficulty: 'intermediate',
  keywords: [
    'french direct object pronouns',
    'me te le la nous vous les',
    'direct object french',
    'pronoun placement french',
    'french grammar pronouns',
    'object pronouns french'
  ],
  examples: [
    'Je le vois (I see him/it)',
    'Elle nous aime (She loves us)',
    'Tu la connais (You know her/it)',
    'Ils vous invitent (They invite you)'
  ]
});

const sections = [
  {
    title: 'Understanding Direct Object Pronouns',
    content: `French direct object pronouns replace **direct objects** - the person or thing that directly receives the action of the verb.

They answer the question "who?" or "what?" after the verb, and they **avoid repetition** by replacing nouns that have already been mentioned.

Direct object pronouns must be placed **before** the conjugated verb in most cases.`,
    examples: [
      {
        spanish: 'Je vois Marie. → Je la vois. (I see Marie. → I see her.)',
        english: 'La replaces the direct object Marie',
        highlight: ['la vois']
      },
      {
        spanish: 'Nous achetons le livre. → Nous l\'achetons. (We buy the book. → We buy it.)',
        english: 'Le replaces the direct object le livre',
        highlight: ['l\'achetons']
      }
    ]
  },
  {
    title: 'The Seven Direct Object Pronouns',
    content: `French has seven direct object pronouns:`,
    subsections: [
      {
        title: 'Complete Direct Object Pronoun System',
        content: 'All French direct object pronouns:',
        conjugationTable: {
          title: 'French Direct Object Pronouns',
          conjugations: [
            { pronoun: 'me (m\')', form: '1st person singular', english: 'me' },
            { pronoun: 'te (t\')', form: '2nd person singular', english: 'you (informal)' },
            { pronoun: 'le (l\')', form: '3rd person masculine singular', english: 'him/it' },
            { pronoun: 'la (l\')', form: '3rd person feminine singular', english: 'her/it' },
            { pronoun: 'nous', form: '1st person plural', english: 'us' },
            { pronoun: 'vous', form: '2nd person plural/formal', english: 'you (formal/plural)' },
            { pronoun: 'les', form: '3rd person plural', english: 'them' }
          ]
        }
      }
    ]
  },
  {
    title: 'Pronoun Placement Rules',
    content: `Direct object pronouns go **before** the conjugated verb in most tenses:`,
    examples: [
      {
        spanish: 'Je le vois. (I see him.)',
        english: 'Present tense - pronoun before verb',
        highlight: ['le vois']
      },
      {
        spanish: 'Elle nous a invités. (She invited us.)',
        english: 'Passé composé - pronoun before auxiliary',
        highlight: ['nous a']
      },
      {
        spanish: 'Tu la verras. (You will see her.)',
        english: 'Future tense - pronoun before verb',
        highlight: ['la verras']
      }
    ],
    subsections: [
      {
        title: 'Placement with Different Tenses',
        content: 'Pronoun placement varies by tense:',
        examples: [
          {
            spanish: 'Present: Je te comprends. (I understand you.)',
            english: 'Imperfect: Je te comprenais. (I understood you.)',
            highlight: ['te comprends', 'te comprenais']
          },
          {
            spanish: 'Passé composé: Je t\'ai vu(e). (I saw you.)',
            english: 'Future: Je te verrai. (I will see you.)',
            highlight: ['t\'ai vu', 'te verrai']
          }
        ]
      }
    ]
  },
  {
    title: 'First and Second Person Pronouns',
    content: `Me, te, nous, vous refer to people in the conversation:`,
    subsections: [
      {
        title: 'ME and NOUS (Me, Us)',
        content: 'First person direct object pronouns:',
        examples: [
          {
            spanish: 'Il me voit. (He sees me.)',
            english: 'Elle me connaît. (She knows me.)',
            highlight: ['me voit', 'me connaît']
          },
          {
            spanish: 'Vous nous aidez. (You help us.)',
            english: 'Ils nous invitent. (They invite us.)',
            highlight: ['nous aidez', 'nous invitent']
          }
        ]
      },
      {
        title: 'TE and VOUS (You)',
        content: 'Second person direct object pronouns:',
        examples: [
          {
            spanish: 'Je te vois. (I see you.) - informal',
            english: 'Je vous vois. (I see you.) - formal/plural',
            highlight: ['te vois', 'vous vois']
          },
          {
            spanish: 'Elle t\'aime. (She loves you.) - informal',
            english: 'Elle vous aime. (She loves you.) - formal/plural',
            highlight: ['t\'aime', 'vous aime']
          }
        ]
      },
      {
        title: 'Contractions with Vowels',
        content: 'Me and te become m\' and t\' before vowels:',
        examples: [
          {
            spanish: 'Il m\'aide. (He helps me.) - not me aide',
            english: 'Tu t\'appelles. (You call yourself.) - not te appelles',
            highlight: ['m\'aide', 't\'appelles']
          }
        ]
      }
    ]
  },
  {
    title: 'Third Person Pronouns (Le, La, Les)',
    content: `Le, la, les replace people or things being talked about:`,
    subsections: [
      {
        title: 'LE - Masculine Singular',
        content: 'Le replaces masculine singular direct objects:',
        examples: [
          {
            spanish: 'Je vois Pierre. → Je le vois. (I see Pierre. → I see him.)',
            english: 'Le replaces masculine person',
            highlight: ['le vois']
          },
          {
            spanish: 'J\'achète le livre. → Je l\'achète. (I buy the book. → I buy it.)',
            english: 'Le replaces masculine thing',
            highlight: ['l\'achète']
          }
        ]
      },
      {
        title: 'LA - Feminine Singular',
        content: 'La replaces feminine singular direct objects:',
        examples: [
          {
            spanish: 'Je connais Marie. → Je la connais. (I know Marie. → I know her.)',
            english: 'La replaces feminine person',
            highlight: ['la connais']
          },
          {
            spanish: 'Il regarde la télé. → Il la regarde. (He watches TV. → He watches it.)',
            english: 'La replaces feminine thing',
            highlight: ['la regarde']
          }
        ]
      },
      {
        title: 'LES - Plural',
        content: 'Les replaces all plural direct objects:',
        examples: [
          {
            spanish: 'Je vois les enfants. → Je les vois. (I see the children. → I see them.)',
            english: 'Les replaces plural people',
            highlight: ['les vois']
          },
          {
            spanish: 'Elle achète les livres. → Elle les achète. (She buys the books. → She buys them.)',
            english: 'Les replaces plural things',
            highlight: ['les achète']
          }
        ]
      },
      {
        title: 'L\' Before Vowels',
        content: 'Le and la become l\' before vowels or silent h:',
        examples: [
          {
            spanish: 'Je l\'aime. (I love him/her/it.) - le/la + aime',
            english: 'Tu l\'as vu? (Did you see him/her/it?) - le/la + as',
            highlight: ['l\'aime', 'l\'as']
          }
        ]
      }
    ]
  },
  {
    title: 'Agreement with Past Participles',
    content: `When using direct object pronouns with passé composé, the past participle **agrees** with the pronoun:`,
    examples: [
      {
        spanish: 'J\'ai vu Marie. → Je l\'ai vue. (I saw Marie. → I saw her.)',
        english: 'Vue agrees with feminine la (Marie)',
        highlight: ['l\'ai vue']
      },
      {
        spanish: 'Il a acheté les voitures. → Il les a achetées. (He bought the cars. → He bought them.)',
        english: 'Achetées agrees with feminine plural les (voitures)',
        highlight: ['les a achetées']
      }
    ],
    subsections: [
      {
        title: 'Agreement Rules',
        content: 'Past participle agreement with direct object pronouns:',
        conjugationTable: {
          title: 'Past Participle Agreement',
          conjugations: [
            { pronoun: 'le (masculine)', form: 'no change', english: 'Je l\'ai vu. (I saw him.)' },
            { pronoun: 'la (feminine)', form: 'add -e', english: 'Je l\'ai vue. (I saw her.)' },
            { pronoun: 'les (masc. plural)', form: 'add -s', english: 'Je les ai vus. (I saw them.)' },
            { pronoun: 'les (fem. plural)', form: 'add -es', english: 'Je les ai vues. (I saw them.)' }
          ]
        }
      },
      {
        title: 'Agreement Examples',
        content: 'More examples of past participle agreement:',
        examples: [
          {
            spanish: 'Les livres? Je les ai lus. (The books? I read them.)',
            english: 'Lus agrees with masculine plural les',
            highlight: ['les ai lus']
          },
          {
            spanish: 'Les lettres? Je les ai écrites. (The letters? I wrote them.)',
            english: 'Écrites agrees with feminine plural les',
            highlight: ['les ai écrites']
          }
        ]
      }
    ]
  },
  {
    title: 'Special Placement Cases',
    content: `In some constructions, direct object pronouns have different placement:`,
    subsections: [
      {
        title: 'With Infinitives',
        content: 'Pronouns go before the infinitive, not the conjugated verb:',
        examples: [
          {
            spanish: 'Je veux le voir. (I want to see him.)',
            english: 'Pronoun before infinitive voir',
            highlight: ['le voir']
          },
          {
            spanish: 'Elle va nous aider. (She is going to help us.)',
            english: 'Pronoun before infinitive aider',
            highlight: ['nous aider']
          }
        ]
      },
      {
        title: 'With Imperatives',
        content: 'In positive commands, pronouns go after the verb:',
        examples: [
          {
            spanish: 'Regarde-le! (Look at him!)',
            english: 'Positive imperative - pronoun after',
            highlight: ['Regarde-le']
          },
          {
            spanish: 'Ne le regarde pas! (Don\'t look at him!)',
            english: 'Negative imperative - pronoun before',
            highlight: ['le regarde']
          }
        ]
      }
    ]
  },
  {
    title: 'Common Direct Object Pronoun Mistakes',
    content: `Here are frequent errors students make:

**1. Wrong placement**: Putting pronouns after conjugated verbs
**2. Missing agreement**: Forgetting past participle agreement
**3. Wrong pronoun choice**: Using wrong gender/number
**4. Infinitive placement**: Wrong position with infinitive constructions`,
    examples: [
      {
        spanish: '❌ Je vois le → ✅ Je le vois',
        english: 'Wrong: pronoun must go before verb',
        highlight: ['le vois']
      },
      {
        spanish: '❌ Je l\'ai vu (for Marie) → ✅ Je l\'ai vue',
        english: 'Wrong: must agree with feminine',
        highlight: ['l\'ai vue']
      },
      {
        spanish: '❌ Je veux voir le → ✅ Je veux le voir',
        english: 'Wrong: pronoun goes before infinitive',
        highlight: ['le voir']
      },
      {
        spanish: '❌ Je la vois (for le livre) → ✅ Je le vois',
        english: 'Wrong: livre is masculine, needs le',
        highlight: ['le vois']
      }
    ]
  }
];

const relatedTopics = [
  { title: 'French Indirect Object Pronouns', url: '/grammar/french/pronouns/indirect-object', difficulty: 'intermediate' },
  { title: 'French Subject Pronouns', url: '/grammar/french/pronouns/subject-pronouns', difficulty: 'beginner' },
  { title: 'French Passé Composé', url: '/grammar/french/verbs/passe-compose', difficulty: 'intermediate' },
  { title: 'French Past Participle Agreement', url: '/grammar/french/verbs/past-participle-agreement', difficulty: 'advanced' }
];

export default function FrenchDirectObjectPage() {
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
              topic: 'direct-object',
              title: 'French Direct Object Pronouns (Me, Te, Le, La, Nous, Vous, Les)',
              description: 'Master French direct object pronouns with placement rules. Learn me, te, le, la, nous, vous, les with verbs and agreement.',
              difficulty: 'intermediate',
              examples: [
                'Je le vois (I see him/it)',
                'Elle nous aime (She loves us)',
                'Tu la connais (You know her/it)',
                'Ils vous invitent (They invite you)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'pronouns',
              topic: 'direct-object',
              title: 'French Direct Object Pronouns (Me, Te, Le, La, Nous, Vous, Les)'
            })
          ])
        }}
      />

      <GrammarPageTemplate
        language="french"
        category="pronouns"
        topic="direct-object"
        title="French Direct Object Pronouns (Me, Te, Le, La, Nous, Vous, Les)"
        description="Master French direct object pronouns with placement rules. Learn me, te, le, la, nous, vous, les with verbs and agreement"
        difficulty="intermediate"
        estimatedTime={15}
        sections={sections}
        backUrl="/grammar/french/pronouns"
        practiceUrl="/grammar/french/pronouns/direct-object/practice"
        quizUrl="/grammar/french/pronouns/direct-object/quiz"
        songUrl="/songs/fr?theme=grammar&topic=direct-object"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
