import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'present-perfect',
  title: 'French Present Perfect (Passé Composé) - Complete Guide',
  description: 'Master the French present perfect (passé composé) with avoir and être auxiliaries. Learn conjugation rules, past participle agreement, and usage with examples.',
  difficulty: 'intermediate',
  keywords: ['french present perfect', 'passé composé', 'avoir', 'être', 'past participle', 'french perfect tense'],
  examples: ['J\'ai mangé', 'Elle est partie', 'Nous avons fini', 'Ils sont arrivés']
});

const sections = [
  {
    title: 'Understanding the Present Perfect (Passé Composé)',
    content: 'The **passé composé** is the most common past tense in French, equivalent to both the English simple past and present perfect. It describes completed actions in the past.',
    examples: [
      {
        french: 'J\'ai mangé une pomme.',
        english: 'I ate/have eaten an apple.',
        highlight: ['ai mangé']
      },
      {
        french: 'Elle est partie hier.',
        english: 'She left/has left yesterday.',
        highlight: ['est partie']
      },
      {
        french: 'Nous avons fini nos devoirs.',
        english: 'We finished/have finished our homework.',
        highlight: ['avons fini']
      }
    ]
  },
  {
    title: 'Formation: Auxiliary + Past Participle',
    content: 'The passé composé is formed with an **auxiliary verb** (avoir or être) + **past participle**.',
    examples: [
      {
        french: 'avoir/être (present) + past participle',
        english: 'auxiliary + past participle',
        highlight: ['avoir/être', 'past participle']
      }
    ],
    subsections: [
      {
        title: 'AVOIR as Auxiliary (Most Common)',
        content: 'Most French verbs use **avoir** as their auxiliary.',
        conjugationTable: {
          title: 'AVOIR + Past Participle',
          conjugations: [
            { pronoun: 'j\'', form: 'ai parlé', english: 'I spoke/have spoken' },
            { pronoun: 'tu', form: 'as parlé', english: 'you spoke/have spoken' },
            { pronoun: 'il/elle', form: 'a parlé', english: 'he/she spoke/has spoken' },
            { pronoun: 'nous', form: 'avons parlé', english: 'we spoke/have spoken' },
            { pronoun: 'vous', form: 'avez parlé', english: 'you spoke/have spoken' },
            { pronoun: 'ils/elles', form: 'ont parlé', english: 'they spoke/have spoken' }
          ]
        }
      },
      {
        title: 'ÊTRE as Auxiliary (Movement & Reflexive Verbs)',
        content: 'Certain verbs use **être** as their auxiliary, mainly verbs of movement and reflexive verbs.',
        conjugationTable: {
          title: 'ÊTRE + Past Participle',
          conjugations: [
            { pronoun: 'je', form: 'suis parti(e)', english: 'I left/have left' },
            { pronoun: 'tu', form: 'es parti(e)', english: 'you left/have left' },
            { pronoun: 'il/elle', form: 'est parti(e)', english: 'he/she left/has left' },
            { pronoun: 'nous', form: 'sommes parti(e)s', english: 'we left/have left' },
            { pronoun: 'vous', form: 'êtes parti(e)(s)', english: 'you left/have left' },
            { pronoun: 'ils/elles', form: 'sont parti(e)s', english: 'they left/have left' }
          ]
        }
      }
    ]
  },
  {
    title: 'Past Participle Formation',
    content: 'Past participles are formed differently depending on the verb group.',
    examples: [
      {
        french: '-er verbs → -é (parlé, mangé, donné)',
        english: '-er verbs → -é (spoken, eaten, given)',
        highlight: ['-é']
      },
      {
        french: '-ir verbs → -i (fini, choisi, parti)',
        english: '-ir verbs → -i (finished, chosen, left)',
        highlight: ['-i']
      },
      {
        french: '-re verbs → -u (vendu, perdu, rendu)',
        english: '-re verbs → -u (sold, lost, returned)',
        highlight: ['-u']
      }
    ],
    subsections: [
      {
        title: 'Regular Past Participles',
        content: 'Most verbs follow regular patterns for past participle formation.',
        conjugationTable: {
          title: 'Regular Past Participle Patterns',
          conjugations: [
            { pronoun: '-er → -é', form: 'parler → parlé', english: 'to speak → spoken' },
            { pronoun: '-ir → -i', form: 'finir → fini', english: 'to finish → finished' },
            { pronoun: '-re → -u', form: 'vendre → vendu', english: 'to sell → sold' },
            { pronoun: 'Example', form: 'j\'ai parlé', english: 'I spoke' },
            { pronoun: 'Example', form: 'tu as fini', english: 'you finished' },
            { pronoun: 'Example', form: 'il a vendu', english: 'he sold' }
          ]
        }
      },
      {
        title: 'Common Irregular Past Participles',
        content: 'Many common verbs have irregular past participles that must be memorized.',
        conjugationTable: {
          title: 'Irregular Past Participles',
          conjugations: [
            { pronoun: 'être → été', form: 'j\'ai été', english: 'I was/have been' },
            { pronoun: 'avoir → eu', form: 'tu as eu', english: 'you had/have had' },
            { pronoun: 'faire → fait', form: 'il a fait', english: 'he did/has done' },
            { pronoun: 'dire → dit', form: 'elle a dit', english: 'she said/has said' },
            { pronoun: 'voir → vu', form: 'nous avons vu', english: 'we saw/have seen' },
            { pronoun: 'prendre → pris', form: 'ils ont pris', english: 'they took/have taken' }
          ]
        }
      }
    ]
  },
  {
    title: 'Verbs Using ÊTRE',
    content: 'Specific groups of verbs use **être** instead of **avoir** as their auxiliary.',
    examples: [
      {
        french: 'Je suis allé au marché.',
        english: 'I went to the market.',
        highlight: ['suis allé']
      },
      {
        french: 'Elle s\'est levée tôt.',
        english: 'She got up early.',
        highlight: ['s\'est levée']
      }
    ],
    subsections: [
      {
        title: 'DR MRS VANDERTRAMP Verbs',
        content: 'These movement and state-change verbs use être.',
        conjugationTable: {
          title: 'ÊTRE Verbs (DR MRS VANDERTRAMP)',
          conjugations: [
            { pronoun: 'Devenir', form: 'je suis devenu(e)', english: 'I became' },
            { pronoun: 'Revenir', form: 'tu es revenu(e)', english: 'you came back' },
            { pronoun: 'Monter', form: 'il est monté', english: 'he went up' },
            { pronoun: 'Rester', form: 'elle est restée', english: 'she stayed' },
            { pronoun: 'Sortir', form: 'nous sommes sorti(e)s', english: 'we went out' },
            { pronoun: 'Venir', form: 'vous êtes venu(e)(s)', english: 'you came' }
          ]
        }
      },
      {
        title: 'Reflexive Verbs with ÊTRE',
        content: 'All reflexive verbs use être in the passé composé.',
        conjugationTable: {
          title: 'Reflexive Verbs + ÊTRE',
          conjugations: [
            { pronoun: 'se lever', form: 'je me suis levé(e)', english: 'I got up' },
            { pronoun: 'se laver', form: 'tu t\'es lavé(e)', english: 'you washed yourself' },
            { pronoun: 'se coucher', form: 'il s\'est couché', english: 'he went to bed' },
            { pronoun: 'se réveiller', form: 'elle s\'est réveillée', english: 'she woke up' },
            { pronoun: 'se dépêcher', form: 'nous nous sommes dépêché(e)s', english: 'we hurried' },
            { pronoun: 'se promener', form: 'ils se sont promenés', english: 'they took a walk' }
          ]
        }
      }
    ]
  },
  {
    title: 'Past Participle Agreement',
    content: 'Past participles must agree in gender and number in certain situations.',
    examples: [
      {
        french: 'Marie est partie. (feminine singular)',
        english: 'Marie left.',
        highlight: ['partie']
      },
      {
        french: 'Les filles sont parties. (feminine plural)',
        english: 'The girls left.',
        highlight: ['parties']
      },
      {
        french: 'La pomme que j\'ai mangée. (direct object before verb)',
        english: 'The apple that I ate.',
        highlight: ['mangée']
      }
    ],
    subsections: [
      {
        title: 'Agreement with ÊTRE',
        content: 'With être, the past participle agrees with the subject.',
        conjugationTable: {
          title: 'ÊTRE Agreement Rules',
          conjugations: [
            { pronoun: 'Masculine singular', form: 'il est parti', english: 'he left' },
            { pronoun: 'Feminine singular', form: 'elle est partie', english: 'she left' },
            { pronoun: 'Masculine plural', form: 'ils sont partis', english: 'they (m) left' },
            { pronoun: 'Feminine plural', form: 'elles sont parties', english: 'they (f) left' },
            { pronoun: 'Mixed group', form: 'ils sont partis', english: 'they left' },
            { pronoun: 'Vous (formal)', form: 'vous êtes parti(e)(s)', english: 'you left' }
          ]
        }
      },
      {
        title: 'Agreement with AVOIR',
        content: 'With avoir, agreement occurs only when the direct object precedes the verb.',
        conjugationTable: {
          title: 'AVOIR Agreement Rules',
          conjugations: [
            { pronoun: 'No agreement', form: 'j\'ai mangé la pomme', english: 'I ate the apple' },
            { pronoun: 'Agreement', form: 'la pomme que j\'ai mangée', english: 'the apple I ate' },
            { pronoun: 'No agreement', form: 'j\'ai vu les filles', english: 'I saw the girls' },
            { pronoun: 'Agreement', form: 'les filles que j\'ai vues', english: 'the girls I saw' },
            { pronoun: 'Pronoun object', form: 'je l\'ai mangée (la pomme)', english: 'I ate it (the apple)' },
            { pronoun: 'Pronoun object', form: 'je les ai vues (les filles)', english: 'I saw them (the girls)' }
          ]
        }
      }
    ]
  },
  {
    title: 'Negation in Passé Composé',
    content: 'In negative sentences, **ne...pas** surrounds the auxiliary verb.',
    examples: [
      {
        french: 'Je n\'ai pas mangé.',
        english: 'I didn\'t eat / haven\'t eaten.',
        highlight: ['n\'ai pas']
      },
      {
        french: 'Elle n\'est pas venue.',
        english: 'She didn\'t come / hasn\'t come.',
        highlight: ['n\'est pas']
      },
      {
        french: 'Nous ne nous sommes pas levés tôt.',
        english: 'We didn\'t get up early.',
        highlight: ['ne nous sommes pas']
      }
    ],
    subsections: [
      {
        title: 'Negation Patterns',
        content: 'Different negative expressions with passé composé.',
        conjugationTable: {
          title: 'Negation in Passé Composé',
          conjugations: [
            { pronoun: 'ne...pas', form: 'je n\'ai pas fini', english: 'I didn\'t finish' },
            { pronoun: 'ne...jamais', form: 'tu n\'as jamais vu', english: 'you never saw' },
            { pronoun: 'ne...rien', form: 'il n\'a rien dit', english: 'he said nothing' },
            { pronoun: 'ne...personne', form: 'elle n\'a vu personne', english: 'she saw nobody' },
            { pronoun: 'ne...plus', form: 'nous n\'avons plus parlé', english: 'we no longer spoke' },
            { pronoun: 'ne...que', form: 'ils n\'ont mangé que ça', english: 'they only ate that' }
          ]
        }
      }
    ]
  },
  {
    title: 'Usage and Time Expressions',
    content: 'The passé composé is used for completed actions, often with specific time markers.',
    examples: [
      {
        french: 'Hier, j\'ai visité le musée.',
        english: 'Yesterday, I visited the museum.',
        highlight: ['Hier', 'ai visité']
      },
      {
        french: 'Il a déjà fini son travail.',
        english: 'He has already finished his work.',
        highlight: ['déjà', 'a fini']
      },
      {
        french: 'Nous sommes partis à 8 heures.',
        english: 'We left at 8 o\'clock.',
        highlight: ['sommes partis', 'à 8 heures']
      }
    ],
    subsections: [
      {
        title: 'Common Time Expressions',
        content: 'Time markers often used with passé composé.',
        conjugationTable: {
          title: 'Time Expressions with Passé Composé',
          conjugations: [
            { pronoun: 'hier', form: 'hier j\'ai travaillé', english: 'yesterday I worked' },
            { pronoun: 'ce matin', form: 'ce matin il est parti', english: 'this morning he left' },
            { pronoun: 'la semaine dernière', form: 'la semaine dernière nous avons voyagé', english: 'last week we traveled' },
            { pronoun: 'déjà', form: 'j\'ai déjà mangé', english: 'I have already eaten' },
            { pronoun: 'encore', form: 'tu n\'as pas encore fini', english: 'you haven\'t finished yet' },
            { pronoun: 'tout à coup', form: 'tout à coup il est arrivé', english: 'suddenly he arrived' }
          ]
        }
      }
    ]
  }
];

const relatedTopics = [
  { title: 'Present Tense', url: '/grammar/french/verbs/present-tense', difficulty: 'beginner' },
  { title: 'Imparfait', url: '/grammar/french/verbs/imparfait', difficulty: 'intermediate' },
  { title: 'Future Tense', url: '/grammar/french/verbs/future', difficulty: 'intermediate' },
  { title: 'Reflexive Verbs', url: '/grammar/french/verbs/reflexive-verbs', difficulty: 'intermediate' }
];

export default function FrenchPresentPerfectPage() {
  return (
    <>
      <script 
        type="application/ld+json" 
        dangerouslySetInnerHTML={{ 
          __html: JSON.stringify(generateGrammarStructuredData({
            title: 'French Present Perfect (Passé Composé) - Complete Guide',
            description: 'Master the French present perfect (passé composé) with avoir and être auxiliaries. Learn conjugation rules, past participle agreement, and usage with examples.',
            keywords: ['french present perfect', 'passé composé', 'avoir', 'être', 'past participle'],
            language: 'french',
            category: 'verbs',
            topic: 'present-perfect'
          }))
        }} 
      />
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="present-perfect"
        title="French Present Perfect (Passé Composé)"
        description="Master the French present perfect (passé composé) with avoir and être auxiliaries. Learn conjugation rules, past participle agreement, and usage with examples."
        difficulty="intermediate"
        estimatedTime={25}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/present-perfect/practice"
        quizUrl="/grammar/french/verbs/present-perfect/quiz"
        songUrl="/songs/fr?theme=grammar&topic=present-perfect"
        youtubeVideoId={undefined}
        relatedTopics={relatedTopics}
      />
    </>
  );
}
