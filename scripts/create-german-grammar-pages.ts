import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const pages = [
  {
    category: 'adverbs',
    topic_slug: 'adverb-formation',
    title: 'German Adverb Formation - Rules and Patterns',
    description: 'Learn how to form German adverbs from adjectives',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Introduction to German Adverbs',
        content: 'Unlike French and Spanish, most German adjectives can be used directly as adverbs without any change in form.',
        examples: [
          { english: 'He speaks quickly.', german: 'Er spricht schnell.', highlight: ['schnell'] },
          { english: 'She works carefully.', german: 'Sie arbeitet sorgfältig.', highlight: ['sorgfältig'] }
        ]
      },
      {
        title: 'Adjectives as Adverbs',
        content: 'In German, adjectives can function as adverbs without any modification.',
        examples: [
          { english: 'The quick car (adjective)', german: 'Das schnelle Auto', highlight: ['schnelle'] },
          { english: 'He drives quickly (adverb)', german: 'Er fährt schnell', highlight: ['schnell'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adverbs/adverb-comparative', title: 'Comparative Adverbs', difficulty: 'intermediate' },
      { url: '/grammar/german/adverbs/adverb-time', title: 'Time Adverbs', difficulty: 'beginner' }
    ]
  },
  {
    category: 'adverbs',
    topic_slug: 'adverb-comparative',
    title: 'German Comparative and Superlative Adverbs',
    description: 'Learn how to form and use comparative and superlative adverbs',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Forming Comparative Adverbs',
        content: 'To form the comparative of adverbs in German, add -er to the base form.',
        examples: [
          { english: 'He runs faster than me.', german: 'Er läuft schneller als ich.', highlight: ['schneller'] },
          { english: 'She speaks more quietly.', german: 'Sie spricht leiser.', highlight: ['leiser'] }
        ]
      },
      {
        title: 'Forming Superlative Adverbs',
        content: 'The superlative of adverbs is formed with am + adverb + -sten.',
        examples: [
          { english: 'He runs the fastest.', german: 'Er läuft am schnellsten.', highlight: ['am schnellsten'] },
          { english: 'She sings the most beautifully.', german: 'Sie singt am schönsten.', highlight: ['am schönsten'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adverbs/adverb-formation', title: 'Adverb Formation', difficulty: 'beginner' },
      { url: '/grammar/german/adjectives/comparative', title: 'Comparative Adjectives', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'adverbs',
    topic_slug: 'adverb-time',
    title: 'German Time Adverbs - Temporal Expressions',
    description: 'Learn common German adverbs of time',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Common Time Adverbs',
        content: 'German has many time adverbs: heute (today), morgen (tomorrow), gestern (yesterday), jetzt (now).',
        examples: [
          { english: 'I am going today.', german: 'Ich gehe heute.', highlight: ['heute'] },
          { english: 'She came yesterday.', german: 'Sie kam gestern.', highlight: ['gestern'] }
        ]
      },
      {
        title: 'Frequency Adverbs',
        content: 'Frequency adverbs tell us how often: immer (always), oft (often), manchmal (sometimes), nie (never).',
        examples: [
          { english: 'He always drinks coffee.', german: 'Er trinkt immer Kaffee.', highlight: ['immer'] },
          { english: 'I never eat meat.', german: 'Ich esse nie Fleisch.', highlight: ['nie'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adverbs/adverb-formation', title: 'Adverb Formation', difficulty: 'beginner' },
      { url: '/grammar/german/adverbs/adverb-place', title: 'Place Adverbs', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'adverbs',
    topic_slug: 'adverb-place',
    title: 'German Place Adverbs - Location and Direction',
    description: 'Learn German adverbs of place and location vs direction',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Location vs Direction',
        content: 'German distinguishes between location (wo?) and direction (wohin?).',
        examples: [
          { english: 'Where is he? - He is here.', german: 'Wo ist er? - Er ist hier.', highlight: ['hier'] },
          { english: 'Where is he going? - He is going there.', german: 'Wohin geht er? - Er geht dorthin.', highlight: ['dorthin'] }
        ]
      },
      {
        title: 'Common Location Adverbs',
        content: 'Location adverbs answer "where?": hier (here), dort (there), oben (up), unten (down).',
        examples: [
          { english: 'The book is here.', german: 'Das Buch ist hier.', highlight: ['hier'] },
          { english: 'He is upstairs.', german: 'Er ist oben.', highlight: ['oben'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adverbs/adverb-formation', title: 'Adverb Formation', difficulty: 'beginner' },
      { url: '/grammar/german/cases/dative', title: 'Dative Case', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'conjunctions',
    topic_slug: 'coordinating-conjunctions',
    title: 'German Coordinating Conjunctions - Und, Oder, Aber, Denn, Sondern',
    description: 'Learn the main German coordinating conjunctions',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What are Coordinating Conjunctions?',
        content: 'Coordinating conjunctions connect two independent clauses. In German, they do NOT change word order.',
        examples: [
          { english: 'I am tired and I am going home.', german: 'Ich bin müde und ich gehe nach Hause.', highlight: ['und'] },
          { english: 'She is nice but he is mean.', german: 'Sie ist nett, aber er ist gemein.', highlight: ['aber'] }
        ]
      },
      {
        title: 'Und (and) and Oder (or)',
        content: 'Und connects similar ideas, while oder presents alternatives.',
        examples: [
          { english: 'I drink coffee and she drinks tea.', german: 'Ich trinke Kaffee und sie trinkt Tee.', highlight: ['und'] },
          { english: 'Do you want coffee or tea?', german: 'Möchtest du Kaffee oder Tee?', highlight: ['oder'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/conjunctions/subordinating-conjunctions', title: 'Subordinating Conjunctions', difficulty: 'intermediate' },
      { url: '/grammar/german/syntax/word-order', title: 'Word Order', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'conjunctions',
    topic_slug: 'subordinating-conjunctions',
    title: 'German Subordinating Conjunctions - Weil, Obwohl, Wenn, Dass',
    description: 'Learn German subordinating conjunctions and word order',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What are Subordinating Conjunctions?',
        content: 'Subordinating conjunctions connect a main clause with a subordinate clause. They CHANGE word order - the verb moves to the end.',
        examples: [
          { english: 'I stay home because I am sick.', german: 'Ich bleibe zu Hause, weil ich krank bin.', highlight: ['weil', 'bin'] },
          { english: 'She comes if she has time.', german: 'Sie kommt, wenn sie Zeit hat.', highlight: ['wenn', 'hat'] }
        ]
      },
      {
        title: 'Weil (because) and Obwohl (although)',
        content: 'Weil introduces a reason, while obwohl introduces a contrast.',
        examples: [
          { english: 'He is tired because he worked all day.', german: 'Er ist müde, weil er den ganzen Tag gearbeitet hat.', highlight: ['weil'] },
          { english: 'Although it is raining, we go outside.', german: 'Obwohl es regnet, gehen wir hinaus.', highlight: ['Obwohl'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/conjunctions/coordinating-conjunctions', title: 'Coordinating Conjunctions', difficulty: 'beginner' },
      { url: '/grammar/german/syntax/word-order', title: 'Word Order', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'subject-pronouns',
    title: 'German Subject Pronouns - Ich, Du, Er, Sie, Es, Wir, Ihr, Sie',
    description: 'Learn German subject pronouns and their usage',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'German Subject Pronouns',
        content: 'Subject pronouns replace the subject noun. German has 8 subject pronouns: ich (I), du (you informal), er (he), sie (she), es (it), wir (we), ihr (you plural), Sie (you formal).',
        examples: [
          { english: 'I am a student.', german: 'Ich bin ein Schüler.', highlight: ['Ich'] },
          { english: 'She is a teacher.', german: 'Sie ist eine Lehrerin.', highlight: ['Sie'] }
        ]
      },
      {
        title: 'Formal vs Informal You',
        content: 'German distinguishes between informal (du/ihr) and formal (Sie) address. Sie is always capitalized.',
        examples: [
          { english: 'You (formal) are welcome.', german: 'Sie sind willkommen.', highlight: ['Sie'] },
          { english: 'You (informal) are my friend.', german: 'Du bist mein Freund.', highlight: ['Du'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/pronouns/personal', title: 'Object Pronouns', difficulty: 'intermediate' },
      { url: '/grammar/german/verbs/present-tense', title: 'Present Tense', difficulty: 'beginner' }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'accusative-pronouns',
    title: 'German Accusative Pronouns - Mich, Dich, Ihn, Sie, Es, Uns, Euch, Sie',
    description: 'Learn German accusative object pronouns',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Accusative Pronouns',
        content: 'Accusative pronouns are used for direct objects. They replace nouns that receive the action of the verb.',
        examples: [
          { english: 'I see him.', german: 'Ich sehe ihn.', highlight: ['ihn'] },
          { english: 'She knows me.', german: 'Sie kennt mich.', highlight: ['mich'] }
        ]
      },
      {
        title: 'Accusative Pronoun Forms',
        content: 'Most pronouns change in the accusative case, except for es (it) and sie (they/you formal).',
        examples: [
          { english: 'Do you see us?', german: 'Seht ihr uns?', highlight: ['uns'] },
          { english: 'He helps them.', german: 'Er hilft ihnen.', highlight: ['ihnen'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/pronouns/subject-pronouns', title: 'Subject Pronouns', difficulty: 'beginner' },
      { url: '/grammar/german/pronouns/dative-pronouns', title: 'Dative Pronouns', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'dative-pronouns',
    title: 'German Dative Pronouns - Mir, Dir, Ihm, Ihr, Ihm, Uns, Euch, Ihnen',
    description: 'Learn German dative object pronouns',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Dative Pronouns',
        content: 'Dative pronouns are used for indirect objects. They replace nouns that receive the benefit or harm of an action.',
        examples: [
          { english: 'I give him a book.', german: 'Ich gebe ihm ein Buch.', highlight: ['ihm'] },
          { english: 'She shows me the way.', german: 'Sie zeigt mir den Weg.', highlight: ['mir'] }
        ]
      },
      {
        title: 'Dative Pronoun Forms',
        content: 'All pronouns change in the dative case. Learn these forms carefully.',
        examples: [
          { english: 'Can you help us?', german: 'Kannst du uns helfen?', highlight: ['uns'] },
          { english: 'He writes them a letter.', german: 'Er schreibt ihnen einen Brief.', highlight: ['ihnen'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/pronouns/accusative-pronouns', title: 'Accusative Pronouns', difficulty: 'intermediate' },
      { url: '/grammar/german/cases/dative', title: 'Dative Case', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'reflexive-pronouns',
    title: 'German Reflexive Pronouns - Mich, Dich, Sich, Uns, Euch, Sich',
    description: 'Learn German reflexive pronouns and reflexive verbs',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Reflexive Pronouns',
        content: 'Reflexive pronouns are used when the subject and object are the same person. They are used with reflexive verbs.',
        examples: [
          { english: 'I wash myself.', german: 'Ich wasche mich.', highlight: ['mich'] },
          { english: 'She remembers herself.', german: 'Sie erinnert sich.', highlight: ['sich'] }
        ]
      },
      {
        title: 'Common Reflexive Verbs',
        content: 'Many German verbs are reflexive: sich waschen (to wash), sich freuen (to be happy), sich erinnern (to remember).',
        examples: [
          { english: 'We are happy.', german: 'Wir freuen uns.', highlight: ['uns'] },
          { english: 'They are getting dressed.', german: 'Sie ziehen sich an.', highlight: ['sich'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/pronouns/accusative-pronouns', title: 'Accusative Pronouns', difficulty: 'intermediate' },
      { url: '/grammar/german/verbs/reflexive-verbs', title: 'Reflexive Verbs', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'adjectives',
    topic_slug: 'adjective-agreement',
    title: 'German Adjective Agreement - Gender, Number, and Case',
    description: 'Learn how German adjectives agree with nouns',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What is Adjective Agreement?',
        content: 'German adjectives must agree with the noun they modify in gender (masculine, feminine, neuter), number (singular, plural), and case (nominative, accusative, dative, genitive).',
        examples: [
          { english: 'The big house (neuter nominative)', german: 'Das große Haus', highlight: ['große'] },
          { english: 'The big houses (plural nominative)', german: 'Die großen Häuser', highlight: ['großen'] }
        ]
      },
      {
        title: 'Adjective Endings',
        content: 'Adjective endings change based on the article (definite, indefinite, or no article) and the case.',
        examples: [
          { english: 'A big house', german: 'Ein großes Haus', highlight: ['großes'] },
          { english: 'Big houses', german: 'Große Häuser', highlight: ['Große'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adjectives/endings', title: 'Adjective Endings', difficulty: 'intermediate' },
      { url: '/grammar/german/cases/nominative', title: 'Cases', difficulty: 'beginner' }
    ]
  },
  {
    category: 'adjectives',
    topic_slug: 'possessive-adjectives',
    title: 'German Possessive Adjectives - Mein, Dein, Sein, Ihr, Unser, Euer',
    description: 'Learn German possessive adjectives and their declension',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'German Possessive Adjectives',
        content: 'Possessive adjectives show ownership. German has: mein (my), dein (your informal), sein (his), ihr (her), unser (our), euer (your plural), Ihr (your formal).',
        examples: [
          { english: 'My book', german: 'Mein Buch', highlight: ['Mein'] },
          { english: 'Her house', german: 'Ihr Haus', highlight: ['Ihr'] }
        ]
      },
      {
        title: 'Possessive Adjective Declension',
        content: 'Possessive adjectives decline like the indefinite article ein. They change based on gender, number, and case.',
        examples: [
          { english: 'My books (plural)', german: 'Meine Bücher', highlight: ['Meine'] },
          { english: 'His car (accusative)', german: 'Seinen Wagen', highlight: ['Seinen'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/adjectives/adjective-agreement', title: 'Adjective Agreement', difficulty: 'intermediate' },
      { url: '/grammar/german/cases/accusative', title: 'Accusative Case', difficulty: 'beginner' }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'irregular-verbs',
    title: 'German Irregular Verbs - Stem Changes and Special Forms',
    description: 'Learn common German irregular verbs and their conjugations',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What are Irregular Verbs?',
        content: 'Irregular verbs do not follow the standard conjugation patterns. They often have stem changes or unique forms.',
        examples: [
          { english: 'I go, you go, he goes', german: 'Ich gehe, du gehst, er geht', highlight: ['gehe', 'gehst', 'geht'] },
          { english: 'I see, you see, she sees', german: 'Ich sehe, du siehst, sie sieht', highlight: ['sehe', 'siehst', 'sieht'] }
        ]
      },
      {
        title: 'Common Stem Changes',
        content: 'Common stem changes: a→ä (fahren), e→i (sprechen), e→ie (lesen), o→ö (stoßen).',
        examples: [
          { english: 'He drives to work', german: 'Er fährt zur Arbeit', highlight: ['fährt'] },
          { english: 'She reads a book', german: 'Sie liest ein Buch', highlight: ['liest'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/verbs/present-tense', title: 'Present Tense', difficulty: 'beginner' },
      { url: '/grammar/german/verbs/modal-verbs', title: 'Modal Verbs', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'haben-sein',
    title: 'German Haben and Sein - Essential Auxiliary Verbs',
    description: 'Learn the most important German verbs: haben and sein',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'Haben (to have)',
        content: 'Haben is essential for forming compound tenses and expressing possession.',
        examples: [
          { english: 'I have a dog', german: 'Ich habe einen Hund', highlight: ['habe'] },
          { english: 'You have time', german: 'Du hast Zeit', highlight: ['hast'] }
        ]
      },
      {
        title: 'Sein (to be)',
        content: 'Sein is completely irregular and is used for identity, location, and forming perfect tenses.',
        examples: [
          { english: 'I am a student', german: 'Ich bin Student', highlight: ['bin'] },
          { english: 'She is from Germany', german: 'Sie ist aus Deutschland', highlight: ['ist'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/verbs/present-tense', title: 'Present Tense', difficulty: 'beginner' },
      { url: '/grammar/german/verbs/perfect-tense', title: 'Perfect Tense', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'separable-prefix-verbs',
    title: 'German Separable Prefix Verbs - Anrufen, Aufstehen, Einkaufen',
    description: 'Learn German separable prefix verbs and their word order',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What are Separable Prefix Verbs?',
        content: 'Separable prefix verbs have a prefix that separates from the main verb in conjugated forms.',
        examples: [
          { english: 'I call him up', german: 'Ich rufe ihn an.', highlight: ['rufe', 'an'] },
          { english: 'She gets up at 7', german: 'Sie steht um 7 Uhr auf.', highlight: ['steht', 'auf'] }
        ]
      },
      {
        title: 'Common Separable Prefixes',
        content: 'Common prefixes: an- (anrufen), auf- (aufstehen), ein- (einkaufen), aus- (ausgehen), mit- (mitkommen).',
        examples: [
          { english: 'We go out tonight', german: 'Wir gehen heute Abend aus.', highlight: ['gehen', 'aus'] },
          { english: 'He comes along', german: 'Er kommt mit.', highlight: ['kommt', 'mit'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/verbs/present-tense', title: 'Present Tense', difficulty: 'beginner' },
      { url: '/grammar/german/syntax/word-order', title: 'Word Order', difficulty: 'intermediate' }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'imperative-mood',
    title: 'German Imperative Mood - Commands and Instructions',
    description: 'Learn how to form German commands and instructions',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What is the Imperative?',
        content: 'The imperative mood is used to give commands, instructions, or requests. German has different forms for informal singular, informal plural, and formal address.',
        examples: [
          { english: 'Come here! (informal singular)', german: 'Komm her!', highlight: ['Komm'] },
          { english: 'Come here! (formal)', german: 'Kommen Sie her!', highlight: ['Kommen Sie'] }
        ]
      },
      {
        title: 'Imperative Forms',
        content: 'Informal singular: remove -en and add nothing. Informal plural: use ihr form without pronoun. Formal: use Sie form without pronoun.',
        examples: [
          { english: 'Sit down! (informal plural)', german: 'Setzt euch hin!', highlight: ['Setzt'] },
          { english: 'Listen! (formal)', german: 'Hören Sie zu!', highlight: ['Hören Sie'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/verbs/present-tense', title: 'Present Tense', difficulty: 'beginner' },
      { url: '/grammar/german/pronouns/subject-pronouns', title: 'Subject Pronouns', difficulty: 'beginner' }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'perfect-tense-formation',
    title: 'German Perfect Tense - Haben/Sein + Past Participle',
    description: 'Learn how to form and use the German perfect tense',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What is the Perfect Tense?',
        content: 'The perfect tense (Perfekt) is used to describe completed actions in the past. It is formed with haben or sein + past participle.',
        examples: [
          { english: 'I have eaten', german: 'Ich habe gegessen', highlight: ['habe', 'gegessen'] },
          { english: 'She has gone', german: 'Sie ist gegangen', highlight: ['ist', 'gegangen'] }
        ]
      },
      {
        title: 'Haben vs Sein',
        content: 'Most verbs use haben. Verbs of motion and sein/werden use sein.',
        examples: [
          { english: 'I have worked', german: 'Ich habe gearbeitet', highlight: ['habe'] },
          { english: 'I have traveled', german: 'Ich bin gereist', highlight: ['bin'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/verbs/past-tense', title: 'Past Tense', difficulty: 'intermediate' },
      { url: '/grammar/german/verbs/haben-sein', title: 'Haben and Sein', difficulty: 'beginner' }
    ]
  },
  {
    category: 'nouns',
    topic_slug: 'noun-articles',
    title: 'German Noun Articles - Der, Die, Das and Cases',
    description: 'Learn German definite articles and how they change with cases',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'German Definite Articles',
        content: 'German has three definite articles: der (masculine), die (feminine), das (neuter). They change based on case.',
        examples: [
          { english: 'The man (nominative)', german: 'Der Mann', highlight: ['Der'] },
          { english: 'The woman (nominative)', german: 'Die Frau', highlight: ['Die'] }
        ]
      },
      {
        title: 'Articles in Different Cases',
        content: 'Articles change in accusative, dative, and genitive cases. Nominative is the base form.',
        examples: [
          { english: 'I see the man (accusative)', german: 'Ich sehe den Mann', highlight: ['den'] },
          { english: 'I give the woman a book (dative)', german: 'Ich gebe der Frau ein Buch', highlight: ['der'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/nouns/gender', title: 'Noun Gender', difficulty: 'beginner' },
      { url: '/grammar/german/cases/nominative', title: 'Cases', difficulty: 'beginner' }
    ]
  },
  {
    category: 'prepositions',
    topic_slug: 'two-way-prepositions-usage',
    title: 'German Two-Way Prepositions - Accusative vs Dative Usage',
    description: 'Learn when to use accusative vs dative with two-way prepositions',
    youtube_video_id: 'EGaSgIRswcI',
    sections: [
      {
        title: 'What are Two-Way Prepositions?',
        content: 'Two-way prepositions can take either accusative or dative depending on whether motion or location is implied.',
        examples: [
          { english: 'I put the book on the table (motion - accusative)', german: 'Ich lege das Buch auf den Tisch', highlight: ['auf den'] },
          { english: 'The book is on the table (location - dative)', german: 'Das Buch liegt auf dem Tisch', highlight: ['auf dem'] }
        ]
      },
      {
        title: 'Common Two-Way Prepositions',
        content: 'Common ones: auf (on), in (in), an (at), über (over), unter (under), neben (next to), zwischen (between).',
        examples: [
          { english: 'I go into the house', german: 'Ich gehe ins Haus', highlight: ['ins'] },
          { english: 'I am in the house', german: 'Ich bin im Haus', highlight: ['im'] }
        ]
      }
    ],
    related_topics: [
      { url: '/grammar/german/cases/accusative', title: 'Accusative Case', difficulty: 'beginner' },
      { url: '/grammar/german/cases/dative', title: 'Dative Case', difficulty: 'beginner' }
    ]
  }
];

async function createPages() {
  for (const page of pages) {
    const { error } = await supabase
      .from('grammar_pages')
      .insert({
        language: 'german',
        category: page.category,
        topic_slug: page.topic_slug,
        title: page.title,
        description: page.description,
        difficulty: 'beginner',
        estimated_time: 20,
        youtube_video_id: page.youtube_video_id,
        sections: page.sections,
        related_topics: page.related_topics,
        back_url: '/grammar/german',
        practice_url: `/grammar/german/${page.category}/${page.topic_slug}/practice`,
        quiz_url: `/grammar/german/${page.category}/${page.topic_slug}/quiz`,
      });

    if (error) {
      console.error(`❌ Error creating ${page.topic_slug}:`, error);
    } else {
      console.log(`✅ Created ${page.topic_slug}`);
    }
  }
}

createPages();

