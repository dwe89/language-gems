import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const pages = [
  // ADJECTIVES (5 more)
  {
    category: 'adjectives',
    topic_slug: 'demonstrative-adjectives',
    title: 'German Demonstrative Adjectives - Dieser, Jener, Solcher',
    description: 'Learn German demonstrative adjectives and their declension',
    sections: [
      {
        title: 'Demonstrative Adjectives',
        content: 'Demonstrative adjectives point out specific nouns: dieser (this), jener (that), solcher (such).',
        examples: [
          { english: 'This book is interesting.', german: 'Dieses Buch ist interessant.', highlight: ['Dieses'] },
          { english: 'That house is big.', german: 'Jenes Haus ist groß.', highlight: ['Jenes'] }
        ]
      },
      {
        title: 'Dieser vs Jener',
        content: 'Dieser refers to something near, jener to something far. In modern German, dieser is more common.',
        examples: [
          { english: 'I like this car.', german: 'Mir gefällt dieses Auto.', highlight: ['dieses'] },
          { english: 'That one over there', german: 'Jenes dort drüben', highlight: ['Jenes'] }
        ]
      }
    ]
  },
  {
    category: 'adjectives',
    topic_slug: 'interrogative-adjectives',
    title: 'German Interrogative Adjectives - Welcher, Was für ein',
    description: 'Learn German interrogative adjectives for asking questions',
    sections: [
      {
        title: 'Welcher (which)',
        content: 'Welcher asks which one. It declines like dieser.',
        examples: [
          { english: 'Which book do you want?', german: 'Welches Buch möchtest du?', highlight: ['Welches'] },
          { english: 'Which students are here?', german: 'Welche Schüler sind hier?', highlight: ['Welche'] }
        ]
      },
      {
        title: 'Was für ein (what kind of)',
        content: 'Was für ein asks what kind. It declines like ein.',
        examples: [
          { english: 'What kind of car is that?', german: 'Was für ein Auto ist das?', highlight: ['Was für ein'] },
          { english: 'What kind of books do you like?', german: 'Was für Bücher magst du?', highlight: ['Was für'] }
        ]
      }
    ]
  },
  {
    category: 'adjectives',
    topic_slug: 'indefinite-adjectives',
    title: 'German Indefinite Adjectives - Einige, Mehrere, Alle, Manche',
    description: 'Learn German indefinite adjectives',
    sections: [
      {
        title: 'Common Indefinite Adjectives',
        content: 'Indefinite adjectives refer to unspecified quantities: einige (some), mehrere (several), alle (all), manche (some).',
        examples: [
          { english: 'Some students are absent.', german: 'Einige Schüler sind abwesend.', highlight: ['Einige'] },
          { english: 'All people are equal.', german: 'Alle Menschen sind gleich.', highlight: ['Alle'] }
        ]
      }
    ]
  },
  {
    category: 'adjectives',
    topic_slug: 'adjective-position',
    title: 'German Adjective Position - Before or After the Noun',
    description: 'Learn where to place adjectives in German sentences',
    sections: [
      {
        title: 'Attributive vs Predicative Position',
        content: 'Attributive adjectives come before the noun and take endings. Predicative adjectives come after the verb and have no endings.',
        examples: [
          { english: 'The big house (attributive)', german: 'Das große Haus', highlight: ['große'] },
          { english: 'The house is big (predicative)', german: 'Das Haus ist groß.', highlight: ['groß'] }
        ]
      }
    ]
  },
  // PRONOUNS (5 more)
  {
    category: 'pronouns',
    topic_slug: 'possessive-pronouns',
    title: 'German Possessive Pronouns - Meiner, Deiner, Seiner, Ihrer',
    description: 'Learn German possessive pronouns',
    sections: [
      {
        title: 'Possessive Pronouns',
        content: 'Possessive pronouns replace possessive adjectives + noun: meiner (mine), deiner (yours), seiner (his), ihrer (hers).',
        examples: [
          { english: 'This book is mine.', german: 'Dieses Buch ist meiner.', highlight: ['meiner'] },
          { english: 'Is this yours?', german: 'Ist das deiner?', highlight: ['deiner'] }
        ]
      }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'demonstrative-pronouns',
    title: 'German Demonstrative Pronouns - Dieser, Jener, Derselbe',
    description: 'Learn German demonstrative pronouns',
    sections: [
      {
        title: 'Demonstrative Pronouns',
        content: 'Demonstrative pronouns point out specific people or things: dieser (this one), jener (that one), derselbe (the same one).',
        examples: [
          { english: 'I like this one.', german: 'Mir gefällt dieser.', highlight: ['dieser'] },
          { english: 'That one is better.', german: 'Jener ist besser.', highlight: ['Jener'] }
        ]
      }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'relative-pronouns',
    title: 'German Relative Pronouns - Der, Die, Das, Welcher',
    description: 'Learn German relative pronouns for subordinate clauses',
    sections: [
      {
        title: 'Relative Pronouns',
        content: 'Relative pronouns introduce subordinate clauses: der/die/das (who, which, that), welcher (which).',
        examples: [
          { english: 'The man who is here', german: 'Der Mann, der hier ist', highlight: ['der'] },
          { english: 'The book that I read', german: 'Das Buch, das ich gelesen habe', highlight: ['das'] }
        ]
      }
    ]
  },
  {
    category: 'pronouns',
    topic_slug: 'interrogative-pronouns',
    title: 'German Interrogative Pronouns - Wer, Wen, Wem, Wessen, Was',
    description: 'Learn German interrogative pronouns for asking questions',
    sections: [
      {
        title: 'Interrogative Pronouns',
        content: 'Interrogative pronouns ask questions: wer (who nominative), wen (who accusative), wem (who dative), wessen (whose), was (what).',
        examples: [
          { english: 'Who is here?', german: 'Wer ist hier?', highlight: ['Wer'] },
          { english: 'Whom do you see?', german: 'Wen siehst du?', highlight: ['Wen'] }
        ]
      }
    ]
  },
  // VERBS (10 more)
  {
    category: 'verbs',
    topic_slug: 'imperfect-tense',
    title: 'German Imperfect Tense - Präteritum',
    description: 'Learn the German imperfect/simple past tense',
    sections: [
      {
        title: 'Imperfect Tense Formation',
        content: 'The imperfect (Präteritum) is used for past narrative. Regular verbs add -te, irregular verbs have stem changes.',
        examples: [
          { english: 'I worked yesterday.', german: 'Ich arbeitete gestern.', highlight: ['arbeitete'] },
          { english: 'He went to school.', german: 'Er ging zur Schule.', highlight: ['ging'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'future-tense-formation',
    title: 'German Future Tense - Werden + Infinitive',
    description: 'Learn how to form the German future tense',
    sections: [
      {
        title: 'Future Tense Formation',
        content: 'The future tense is formed with werden + infinitive.',
        examples: [
          { english: 'I will go tomorrow.', german: 'Ich werde morgen gehen.', highlight: ['werde gehen'] },
          { english: 'She will study.', german: 'Sie wird studieren.', highlight: ['wird studieren'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'conditional-mood',
    title: 'German Conditional Mood - Würde + Infinitive',
    description: 'Learn the German conditional mood for hypothetical situations',
    sections: [
      {
        title: 'Conditional Formation',
        content: 'The conditional is formed with würde + infinitive. It expresses hypothetical or polite actions.',
        examples: [
          { english: 'I would go if I had time.', german: 'Ich würde gehen, wenn ich Zeit hätte.', highlight: ['würde gehen'] },
          { english: 'Would you help me?', german: 'Würdest du mir helfen?', highlight: ['Würdest'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'subjunctive-mood',
    title: 'German Subjunctive Mood - Konjunktiv I and II',
    description: 'Learn the German subjunctive mood for reported speech and hypotheticals',
    sections: [
      {
        title: 'Subjunctive Mood',
        content: 'The subjunctive expresses wishes, hypotheticals, and reported speech. German has Konjunktiv I and II.',
        examples: [
          { english: 'If I were rich...', german: 'Wenn ich reich wäre...', highlight: ['wäre'] },
          { english: 'He said he would come.', german: 'Er sagte, er würde kommen.', highlight: ['würde'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'passive-voice-formation',
    title: 'German Passive Voice - Werden + Past Participle',
    description: 'Learn how to form the German passive voice',
    sections: [
      {
        title: 'Passive Voice Formation',
        content: 'The passive is formed with werden + past participle. The agent is introduced with von or durch.',
        examples: [
          { english: 'The book is read by students.', german: 'Das Buch wird von Schülern gelesen.', highlight: ['wird gelesen'] },
          { english: 'The house was built in 1990.', german: 'Das Haus wurde 1990 gebaut.', highlight: ['wurde gebaut'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'infinitive-constructions',
    title: 'German Infinitive Constructions - Zu + Infinitive',
    description: 'Learn German infinitive phrases with zu',
    sections: [
      {
        title: 'Zu + Infinitive',
        content: 'Zu + infinitive is used after certain verbs and adjectives. Separable verbs insert zu between prefix and verb.',
        examples: [
          { english: 'I want to go.', german: 'Ich möchte gehen.', highlight: ['gehen'] },
          { english: 'It is easy to learn.', german: 'Es ist leicht zu lernen.', highlight: ['zu lernen'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'participles',
    title: 'German Participles - Present and Past Participles',
    description: 'Learn German present and past participles',
    sections: [
      {
        title: 'Present Participles',
        content: 'Present participles end in -end and function as adjectives or adverbs.',
        examples: [
          { english: 'The sleeping child', german: 'Das schlafende Kind', highlight: ['schlafende'] },
          { english: 'Speaking German', german: 'Deutsch sprechend', highlight: ['sprechend'] }
        ]
      },
      {
        title: 'Past Participles',
        content: 'Past participles end in -t or -en and are used in perfect tenses and passive voice.',
        examples: [
          { english: 'The broken glass', german: 'Das zerbrochene Glas', highlight: ['zerbrochene'] },
          { english: 'I have eaten.', german: 'Ich habe gegessen.', highlight: ['gegessen'] }
        ]
      }
    ]
  },
  {
    category: 'verbs',
    topic_slug: 'verb-prefixes',
    title: 'German Verb Prefixes - Separable and Inseparable',
    description: 'Learn German separable and inseparable verb prefixes',
    sections: [
      {
        title: 'Separable Prefixes',
        content: 'Separable prefixes separate in conjugated forms: an-, auf-, aus-, ein-, mit-, zu-.',
        examples: [
          { english: 'I call up', german: 'Ich rufe an', highlight: ['rufe', 'an'] },
          { english: 'He gets up', german: 'Er steht auf', highlight: ['steht', 'auf'] }
        ]
      },
      {
        title: 'Inseparable Prefixes',
        content: 'Inseparable prefixes never separate: be-, emp-, ent-, er-, ge-, miss-, ver-, zer-.',
        examples: [
          { english: 'I understand', german: 'Ich verstehe', highlight: ['verstehe'] },
          { english: 'She destroys', german: 'Sie zerstört', highlight: ['zerstört'] }
        ]
      }
    ]
  },
  // PREPOSITIONS (4 more)
  {
    category: 'prepositions',
    topic_slug: 'genitive-prepositions',
    title: 'German Genitive Prepositions - Wegen, Trotz, Während, Statt',
    description: 'Learn German prepositions that take the genitive case',
    sections: [
      {
        title: 'Genitive Prepositions',
        content: 'Some prepositions always take genitive: wegen (because of), trotz (despite), während (during), statt (instead of).',
        examples: [
          { english: 'Because of the rain', german: 'Wegen des Regens', highlight: ['Wegen des'] },
          { english: 'Despite the difficulty', german: 'Trotz der Schwierigkeit', highlight: ['Trotz der'] }
        ]
      }
    ]
  },
  {
    category: 'prepositions',
    topic_slug: 'temporal-prepositions',
    title: 'German Temporal Prepositions - In, An, Während, Seit',
    description: 'Learn German prepositions for time expressions',
    sections: [
      {
        title: 'Time Prepositions',
        content: 'Common time prepositions: in (in), an (on), während (during), seit (since), vor (ago), nach (after).',
        examples: [
          { english: 'In the morning', german: 'Am Morgen', highlight: ['Am'] },
          { english: 'Since yesterday', german: 'Seit gestern', highlight: ['Seit'] }
        ]
      }
    ]
  },
  {
    category: 'prepositions',
    topic_slug: 'causal-prepositions',
    title: 'German Causal Prepositions - Wegen, Aus, Durch',
    description: 'Learn German prepositions expressing cause and reason',
    sections: [
      {
        title: 'Causal Prepositions',
        content: 'Prepositions expressing cause: wegen (because of), aus (out of), durch (through).',
        examples: [
          { english: 'Out of love', german: 'Aus Liebe', highlight: ['Aus'] },
          { english: 'Through hard work', german: 'Durch harte Arbeit', highlight: ['Durch'] }
        ]
      }
    ]
  },
  {
    category: 'prepositions',
    topic_slug: 'directional-prepositions',
    title: 'German Directional Prepositions - Zu, Nach, Gegen, Durch',
    description: 'Learn German prepositions for direction and movement',
    sections: [
      {
        title: 'Directional Prepositions',
        content: 'Prepositions for direction: zu (to), nach (to/after), gegen (against), durch (through), über (over).',
        examples: [
          { english: 'To the school', german: 'Zur Schule', highlight: ['Zur'] },
          { english: 'Through the forest', german: 'Durch den Wald', highlight: ['Durch'] }
        ]
      }
    ]
  },
  // SYNTAX (3 more)
  {
    category: 'syntax',
    topic_slug: 'subordinate-clauses',
    title: 'German Subordinate Clauses - Word Order and Conjunctions',
    description: 'Learn German subordinate clause structure and word order',
    sections: [
      {
        title: 'Subordinate Clause Word Order',
        content: 'In subordinate clauses, the verb moves to the end. This is the key difference from main clauses.',
        examples: [
          { english: 'Main: I go home. / Sub: because I go home', german: 'Ich gehe nach Hause. / weil ich nach Hause gehe', highlight: ['gehe'] }
        ]
      }
    ]
  },
  {
    category: 'syntax',
    topic_slug: 'question-formation',
    title: 'German Question Formation - Yes/No and W-Questions',
    description: 'Learn how to form questions in German',
    sections: [
      {
        title: 'Yes/No Questions',
        content: 'Yes/No questions invert the subject and verb: Verb + Subject + Object.',
        examples: [
          { english: 'Do you speak German?', german: 'Sprichst du Deutsch?', highlight: ['Sprichst'] }
        ]
      },
      {
        title: 'W-Questions',
        content: 'W-questions start with question words: wer (who), was (what), wo (where), wann (when), warum (why).',
        examples: [
          { english: 'Where do you live?', german: 'Wo wohnst du?', highlight: ['Wo'] }
        ]
      }
    ]
  },
  {
    category: 'syntax',
    topic_slug: 'negation-placement',
    title: 'German Negation - Nicht and Kein Placement',
    description: 'Learn where to place negation in German sentences',
    sections: [
      {
        title: 'Nicht vs Kein',
        content: 'Nicht negates verbs and adjectives. Kein negates nouns.',
        examples: [
          { english: 'I do not go.', german: 'Ich gehe nicht.', highlight: ['nicht'] },
          { english: 'I have no time.', german: 'Ich habe keine Zeit.', highlight: ['keine'] }
        ]
      }
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
        youtube_video_id: 'EGaSgIRswcI',
        sections: page.sections,
        related_topics: [],
        back_url: '/grammar/german',
        practice_url: `/grammar/german/${page.category}/${page.topic_slug}/practice`,
        quiz_url: `/grammar/german/${page.category}/${page.topic_slug}/quiz`,
      });

    if (error) {
      console.error(`❌ Error creating ${page.topic_slug}:`, error.message);
    } else {
      console.log(`✅ Created ${page.topic_slug}`);
    }
  }
}

createPages();

