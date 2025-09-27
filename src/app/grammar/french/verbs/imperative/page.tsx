import { Metadata } from 'next';
import GrammarPageTemplate from '../../../../../components/grammar/GrammarPageTemplate';
import { generateGrammarMetadata, generateGrammarStructuredData, generateGrammarBreadcrumbs } from '../../../../../components/grammar/GrammarSEO';

// SEO Metadata
export const metadata: Metadata = generateGrammarMetadata({
  language: 'french',
  category: 'verbs',
  topic: 'imperative',
  title: 'French Imperative Mood',
  description: 'Master French imperative mood for giving commands, instructions, and suggestions. Complete conjugation guide.',
  difficulty: 'intermediate',
  keywords: [
    'french imperative',
    'impératif français',
    'french commands',
    'french instructions',
    'giving orders french',
    'french grammar imperative',
    'commands in french'
  ],
  examples: [
    'Parlez plus fort! (Speak louder!)',
    'Finis tes devoirs (Finish your homework)',
    'Allons-y! (Let\'s go!)'
  ]
});

const sections = [
  {
    title: 'French Imperative Mood Overview',
    content: `The French imperative mood (**impératif**) is used to give commands, instructions, suggestions, and advice. It's the equivalent of the English imperative and is essential for everyday communication.

The imperative has only three forms: **tu** (informal singular), **nous** (we/let's), and **vous** (formal singular or plural). The subject pronouns are omitted.`,
    examples: [
      {
        spanish: 'Parle plus fort!',
        english: 'Speak louder! (informal)',
        highlight: ['Parle']
      },
      {
        spanish: 'Parlons français!',
        english: 'Let\'s speak French!',
        highlight: ['Parlons']
      },
      {
        spanish: 'Parlez lentement, s\'il vous plaît.',
        english: 'Speak slowly, please. (formal)',
        highlight: ['Parlez']
      }
    ]
  },
  {
    title: 'Imperative Formation',
    content: `The imperative is formed by taking the present tense forms and dropping the subject pronouns. For -er verbs, also drop the final -s from the tu form.

**Formula**: Present tense - subject pronoun (- s for -er verbs in tu form)`,
    subsections: [
      {
        title: 'Regular -ER Verbs',
        content: `For -ER verbs, drop the subject pronoun and the final -s from the tu form:`,
        conjugationTable: {
          title: 'Parler (to speak) - Imperative',
          conjugations: [
            { pronoun: 'tu form', form: 'Parle!', english: 'Speak! (informal)' },
            { pronoun: 'nous form', form: 'Parlons!', english: 'Let\'s speak!' },
            { pronoun: 'vous form', form: 'Parlez!', english: 'Speak! (formal/plural)' }
          ]
        },
        examples: [
          {
            spanish: 'Écoute bien!',
            english: 'Listen carefully! (écouter)',
            highlight: ['Écoute']
          },
          {
            spanish: 'Regardons ce film!',
            english: 'Let\'s watch this movie! (regarder)',
            highlight: ['Regardons']
          },
          {
            spanish: 'Mangez vos légumes!',
            english: 'Eat your vegetables! (manger)',
            highlight: ['Mangez']
          }
        ]
      },
      {
        title: 'Regular -IR and -RE Verbs',
        content: `For -IR and -RE verbs, simply drop the subject pronouns (keep the -s in tu form):`,
        conjugationTable: {
          title: 'Finir (to finish) - Imperative',
          conjugations: [
            { pronoun: 'tu form', form: 'Finis!', english: 'Finish! (informal)' },
            { pronoun: 'nous form', form: 'Finissons!', english: 'Let\'s finish!' },
            { pronoun: 'vous form', form: 'Finissez!', english: 'Finish! (formal/plural)' }
          ]
        },
        examples: [
          {
            spanish: 'Choisis une couleur!',
            english: 'Choose a color! (choisir)',
            highlight: ['Choisis']
          },
          {
            spanish: 'Attendons l\'autobus!',
            english: 'Let\'s wait for the bus! (attendre)',
            highlight: ['Attendons']
          },
          {
            spanish: 'Vendez votre voiture!',
            english: 'Sell your car! (vendre)',
            highlight: ['Vendez']
          }
        ]
      }
    ]
  },
  {
    title: 'Irregular Imperative Verbs',
    content: `Some common verbs have irregular imperative forms that must be memorized:`,
    subsections: [
      {
        title: 'Most Common Irregular Imperatives',
        content: `These verbs have completely irregular imperative forms:`,
        conjugationTable: {
          title: 'Irregular Imperative Forms',
          conjugations: [
            { pronoun: 'être (to be)', form: 'Sois! Soyons! Soyez!', english: 'Be!' },
            { pronoun: 'avoir (to have)', form: 'Aie! Ayons! Ayez!', english: 'Have!' },
            { pronoun: 'savoir (to know)', form: 'Sache! Sachons! Sachez!', english: 'Know!' },
            { pronoun: 'vouloir (to want)', form: '— Veuillons! Veuillez!', english: 'Please (formal)' }
          ]
        },
        examples: [
          {
            spanish: 'Sois patient!',
            english: 'Be patient!',
            highlight: ['Sois']
          },
          {
            spanish: 'Ayez confiance!',
            english: 'Have confidence!',
            highlight: ['Ayez']
          },
          {
            spanish: 'Sachez que je vous comprends.',
            english: 'Know that I understand you.',
            highlight: ['Sachez']
          },
          {
            spanish: 'Veuillez patienter.',
            english: 'Please wait. (very formal)',
            highlight: ['Veuillez']
          }
        ]
      }
    ]
  },
  {
    title: 'Negative Imperative',
    content: `To make the imperative negative, place **ne** before the verb and **pas** (or other negative words) after it:

**Formula**: Ne + imperative verb + pas

The structure is the same for all three forms of the imperative.`,
    examples: [
      {
        spanish: 'Ne parle pas si fort!',
        english: 'Don\'t speak so loudly!',
        highlight: ['Ne', 'pas']
      },
      {
        spanish: 'Ne mangeons pas maintenant!',
        english: 'Let\'s not eat now!',
        highlight: ['Ne', 'pas']
      },
      {
        spanish: 'Ne partez pas sans moi!',
        english: 'Don\'t leave without me!',
        highlight: ['Ne', 'pas']
      },
      {
        spanish: 'N\'oublie jamais ça!',
        english: 'Never forget that!',
        highlight: ['N\'', 'jamais']
      }
    ]
  },
  {
    title: 'Imperative with Pronouns',
    content: `When using object pronouns with the imperative, their position changes:

**Affirmative**: Verb + pronoun(s) with hyphens
**Negative**: Pronouns before the verb (normal position)

**Note**: **Me** and **te** become **moi** and **toi** in affirmative imperatives.`,
    examples: [
      {
        spanish: 'Donne-moi le livre!',
        english: 'Give me the book! (affirmative)',
        highlight: ['Donne-moi']
      },
      {
        spanish: 'Ne me donne pas le livre!',
        english: 'Don\'t give me the book! (negative)',
        highlight: ['me donne']
      },
      {
        spanish: 'Lève-toi!',
        english: 'Get up! (reflexive)',
        highlight: ['Lève-toi']
      },
      {
        spanish: 'Ne te lève pas!',
        english: 'Don\'t get up! (negative reflexive)',
        highlight: ['te lève']
      },
      {
        spanish: 'Donnez-le-lui!',
        english: 'Give it to him/her! (two pronouns)',
        highlight: ['Donnez-le-lui']
      }
    ]
  },
  {
    title: 'Uses of the Imperative',
    content: `The French imperative is used in various situations:

**1. Direct commands**: Giving orders or instructions
**2. Suggestions**: Making recommendations (especially with nous)
**3. Advice**: Offering guidance
**4. Invitations**: Inviting someone to do something
**5. Warnings**: Alerting someone to danger
**6. Recipes/Instructions**: Step-by-step directions`,
    examples: [
      {
        spanish: 'Fermez la porte!',
        english: 'Close the door! (direct command)',
        highlight: ['Fermez']
      },
      {
        spanish: 'Allons au cinéma!',
        english: 'Let\'s go to the movies! (suggestion)',
        highlight: ['Allons']
      },
      {
        spanish: 'Repose-toi bien!',
        english: 'Rest well! (advice)',
        highlight: ['Repose-toi']
      },
      {
        spanish: 'Venez dîner chez nous!',
        english: 'Come have dinner at our place! (invitation)',
        highlight: ['Venez']
      },
      {
        spanish: 'Attention! Ne touchez pas!',
        english: 'Warning! Don\'t touch! (warning)',
        highlight: ['touchez']
      }
    ]
  },
  {
    title: 'Polite Imperatives',
    content: `To make imperatives more polite, you can:

**1. Add "s'il vous plaît"**: Please (formal)
**2. Add "s'il te plaît"**: Please (informal)
**3. Use conditional instead**: "Pourriez-vous..." (Could you...)
**4. Use "Veuillez"**: Very formal "please"
**5. Add softening expressions**: "Si vous voulez bien..." (If you would...)`,
    examples: [
      {
        spanish: 'Fermez la fenêtre, s\'il vous plaît.',
        english: 'Close the window, please.',
        highlight: ['s\'il vous plaît']
      },
      {
        spanish: 'Aide-moi, s\'il te plaît.',
        english: 'Help me, please. (informal)',
        highlight: ['s\'il te plaît']
      },
      {
        spanish: 'Veuillez patienter un moment.',
        english: 'Please wait a moment. (very formal)',
        highlight: ['Veuillez']
      },
      {
        spanish: 'Si vous voulez bien me suivre...',
        english: 'If you would please follow me...',
        highlight: ['voulez bien']
      }
    ]
  },
  {
    title: 'Common Imperative Expressions',
    content: `Here are frequently used imperative expressions in French:

**Daily life**: Allez-y! (Go ahead!), Dépêche-toi! (Hurry up!)
**Politeness**: Excusez-moi (Excuse me), Pardonnez-moi (Forgive me)
**Encouragement**: Courage! (Courage!), Vas-y! (Go for it!)
**Instructions**: Écoutez bien (Listen carefully), Regardez (Look)

These expressions are essential for natural French conversation.`,
    examples: [
      {
        spanish: 'Allez-y, je vous écoute!',
        english: 'Go ahead, I\'m listening!',
        highlight: ['Allez-y']
      },
      {
        spanish: 'Dépêche-toi, nous sommes en retard!',
        english: 'Hurry up, we\'re late!',
        highlight: ['Dépêche-toi']
      },
      {
        spanish: 'Excusez-moi, où est la gare?',
        english: 'Excuse me, where is the train station?',
        highlight: ['Excusez-moi']
      },
      {
        spanish: 'Vas-y, tu peux le faire!',
        english: 'Go for it, you can do it!',
        highlight: ['Vas-y']
      },
      {
        spanish: 'Regardez cette belle vue!',
        english: 'Look at this beautiful view!',
        highlight: ['Regardez']
      }
    ]
  }
];

const relatedTopics = [
  {
    title: 'French Present Tense',
    url: '/grammar/french/verbs/present-tense',
    difficulty: 'beginner'
  },
  {
    title: 'French Pronouns',
    url: '/grammar/french/pronouns/object-pronouns',
    difficulty: 'intermediate'
  },
  {
    title: 'French Conditional',
    url: '/grammar/french/verbs/conditional',
    difficulty: 'advanced'
  },
  {
    title: 'French Reflexive Verbs',
    url: '/grammar/french/verbs/reflexive-verbs',
    difficulty: 'intermediate'
  }
];

export default function FrenchImperativePage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            generateGrammarStructuredData({
              language: 'french',
              category: 'verbs',
              topic: 'imperative',
              title: 'French Imperative Mood',
              description: 'Master French imperative mood for giving commands, instructions, and suggestions. Complete conjugation guide.',
              difficulty: 'intermediate',
              examples: [
                'Parlez plus fort! (Speak louder!)',
                'Finis tes devoirs (Finish your homework)',
                'Allons-y! (Let\'s go!)'
              ]
            }),
            generateGrammarBreadcrumbs({
              language: 'french',
              category: 'verbs',
              topic: 'imperative',
              title: 'French Imperative Mood'
            })
          ])
        }}
      />
      
      <GrammarPageTemplate
        language="french"
        category="verbs"
        topic="imperative"
        title="French Imperative Mood"
        description="Master French imperative mood for giving commands, instructions, and suggestions. Complete conjugation guide"
        difficulty="intermediate"
        estimatedTime={18}
        sections={sections}
        backUrl="/grammar/french/verbs"
        practiceUrl="/grammar/french/verbs/imperative/practice"
        quizUrl="/grammar/french/verbs/imperative/quiz"
        songUrl="/songs/fr?theme=grammar&topic=imperative"
        youtubeVideoId="EGaSgIRswcI"
        relatedTopics={relatedTopics}
      />
    </>
  );
}
