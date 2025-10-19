import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const expansions: { [key: string]: any } = {
  'adverb-formation': {
    sections: [
      {
        title: 'Introduction to German Adverbs',
        content: 'Unlike French and Spanish, most German adjectives can be used directly as adverbs without any change in form. This makes German adverbs relatively straightforward to learn. An adverb modifies a verb, adjective, or another adverb, describing how, when, where, or to what extent an action occurs.',
        examples: [
          { english: 'He speaks quickly.', german: 'Er spricht schnell.', highlight: ['schnell'] },
          { english: 'She works carefully.', german: 'Sie arbeitet sorgfältig.', highlight: ['sorgfältig'] },
          { english: 'They arrived late.', german: 'Sie kamen spät an.', highlight: ['spät'] }
        ]
      },
      {
        title: 'Adjectives as Adverbs - No Change Needed',
        content: 'In German, adjectives can function as adverbs without any modification. The same word form is used for both purposes. This is different from English where we often add -ly to adjectives to form adverbs. The key is understanding the context: if the word modifies a noun, it\'s an adjective; if it modifies a verb, adjective, or adverb, it\'s an adverb.',
        examples: [
          { english: 'The quick car (adjective)', german: 'Das schnelle Auto', highlight: ['schnelle'] },
          { english: 'He drives quickly (adverb)', german: 'Er fährt schnell', highlight: ['schnell'] },
          { english: 'A beautiful song (adjective)', german: 'Ein schönes Lied', highlight: ['schönes'] },
          { english: 'She sings beautifully (adverb)', german: 'Sie singt schön', highlight: ['schön'] }
        ]
      },
      {
        title: 'Common German Adverbs',
        content: 'Some of the most frequently used German adverbs include: schnell (quickly), langsam (slowly), gut (well), schlecht (badly), oft (often), immer (always), nie (never), hier (here), dort (there), heute (today), morgen (tomorrow), gestern (yesterday), jetzt (now), später (later), früher (earlier). These adverbs are essential for everyday communication.',
        examples: [
          { english: 'She sings well.', german: 'Sie singt gut.', highlight: ['gut'] },
          { english: 'He always comes late.', german: 'Er kommt immer zu spät.', highlight: ['immer'] },
          { english: 'I rarely see him.', german: 'Ich sehe ihn selten.', highlight: ['selten'] },
          { english: 'We are going there tomorrow.', german: 'Wir gehen morgen dorthin.', highlight: ['morgen', 'dorthin'] }
        ]
      },
      {
        title: 'Adverbs of Time, Place, and Manner',
        content: 'German adverbs can be categorized by their function: Time adverbs answer "wann?" (when?), place adverbs answer "wo?" or "wohin?" (where?), and manner adverbs answer "wie?" (how?). Understanding these categories helps you use adverbs correctly in sentences. The typical word order in German is: Time - Manner - Place (TMP).',
        examples: [
          { english: 'I go there tomorrow. (time + place)', german: 'Ich gehe morgen dorthin.', highlight: ['morgen', 'dorthin'] },
          { english: 'She speaks loudly. (manner)', german: 'Sie spricht laut.', highlight: ['laut'] },
          { english: 'He works here today. (place + time)', german: 'Er arbeitet heute hier.', highlight: ['heute', 'hier'] },
          { english: 'We travel slowly through the city. (manner + place)', german: 'Wir fahren langsam durch die Stadt.', highlight: ['langsam', 'durch'] }
        ]
      },
      {
        title: 'Position of Adverbs in Sentences',
        content: 'Adverbs typically come after the verb in main clauses, but can also appear at the beginning for emphasis. In subordinate clauses, adverbs come before the final verb. The position of adverbs can change the emphasis of a sentence. Generally, adverbs of time come first, then manner, then place (TMP rule).',
        examples: [
          { english: 'I read the book carefully.', german: 'Ich lese das Buch sorgfältig.', highlight: ['sorgfältig'] },
          { english: 'Carefully, I read the book.', german: 'Sorgfältig lese ich das Buch.', highlight: ['Sorgfältig'] },
          { english: 'Because he speaks quickly', german: 'Weil er schnell spricht', highlight: ['schnell', 'spricht'] }
        ]
      },
      {
        title: 'Adverbs vs Adjectives - Key Differences',
        content: 'Remember: adjectives modify nouns and take endings based on gender, number, and case. Adverbs modify verbs, adjectives, or other adverbs and never take endings. When you see a word ending in -e, -en, -er, -es, -em, or -en after a noun, it\'s an adjective. When the same word appears without these endings after a verb, it\'s an adverb.',
        examples: [
          { english: 'The fast runner (adjective)', german: 'Der schnelle Läufer', highlight: ['schnelle'] },
          { english: 'He runs fast (adverb)', german: 'Er läuft schnell', highlight: ['schnell'] },
          { english: 'A good student (adjective)', german: 'Ein guter Schüler', highlight: ['guter'] },
          { english: 'She studies well (adverb)', german: 'Sie studiert gut', highlight: ['gut'] }
        ]
      }
    ]
  },
  'subject-pronouns': {
    sections: [
      {
        title: 'German Subject Pronouns Overview',
        content: 'Subject pronouns replace the subject noun in a sentence. German has 8 subject pronouns: ich (I), du (you informal singular), er (he), sie (she), es (it), wir (we), ihr (you informal plural), Sie (you formal). Each pronoun has a specific use and formal level. Understanding when to use each pronoun is essential for proper German communication.',
        examples: [
          { english: 'I am a student.', german: 'Ich bin ein Schüler.', highlight: ['Ich'] },
          { english: 'She is a teacher.', german: 'Sie ist eine Lehrerin.', highlight: ['Sie'] },
          { english: 'We are friends.', german: 'Wir sind Freunde.', highlight: ['Wir'] }
        ]
      },
      {
        title: 'Singular Pronouns',
        content: 'Singular pronouns refer to one person or thing. Ich (I) is the first person singular. Du (you informal) is used with friends, family, and people your age. Er (he), sie (she), and es (it) are third person singular. Sie (you formal) is used with strangers, authority figures, and in formal situations. Note that Sie is always capitalized, even in the middle of a sentence.',
        examples: [
          { english: 'I am happy.', german: 'Ich bin glücklich.', highlight: ['Ich'] },
          { english: 'You (informal) are nice.', german: 'Du bist nett.', highlight: ['Du'] },
          { english: 'He is tall.', german: 'Er ist groß.', highlight: ['Er'] },
          { english: 'It is beautiful.', german: 'Es ist schön.', highlight: ['Es'] }
        ]
      },
      {
        title: 'Plural Pronouns',
        content: 'Plural pronouns refer to multiple people or things. Wir (we) is the first person plural. Ihr (you informal plural) is used when addressing multiple friends or family members. Sie (you formal plural) is used when addressing multiple people formally. Note that Sie is the same for formal singular and formal plural - context determines the meaning.',
        examples: [
          { english: 'We are students.', german: 'Wir sind Schüler.', highlight: ['Wir'] },
          { english: 'You (plural informal) are here.', german: 'Ihr seid hier.', highlight: ['Ihr'] },
          { english: 'They are teachers.', german: 'Sie sind Lehrer.', highlight: ['Sie'] }
        ]
      },
      {
        title: 'Formal vs Informal You',
        content: 'German distinguishes between informal (du/ihr) and formal (Sie) address. This is a crucial aspect of German culture and etiquette. Use du/ihr with friends, family, children, and people your age. Use Sie with strangers, older people, authority figures, teachers, and in professional settings. When in doubt, use Sie - it\'s better to be too formal than too informal. Sie is always capitalized.',
        examples: [
          { english: 'You (formal) are welcome.', german: 'Sie sind willkommen.', highlight: ['Sie'] },
          { english: 'You (informal) are my friend.', german: 'Du bist mein Freund.', highlight: ['Du'] },
          { english: 'You all (formal) should come.', german: 'Sie sollten kommen.', highlight: ['Sie'] }
        ]
      },
      {
        title: 'Pronoun Conjugation with Verbs',
        content: 'Each subject pronoun requires a specific verb form. Regular verbs in the present tense follow predictable patterns. Irregular verbs may have stem changes. Learning pronoun-verb combinations is essential for correct German grammar. Practice conjugating common verbs with each pronoun.',
        examples: [
          { english: 'I go, you go, he goes', german: 'Ich gehe, du gehst, er geht', highlight: ['gehe', 'gehst', 'geht'] },
          { english: 'We are, you are, they are', german: 'Wir sind, ihr seid, sie sind', highlight: ['sind', 'seid', 'sind'] }
        ]
      }
    ]
  },
  'coordinating-conjunctions': {
    sections: [
      {
        title: 'What are Coordinating Conjunctions?',
        content: 'Coordinating conjunctions connect two independent clauses of equal importance. In German, they do NOT change the word order - both clauses maintain normal SVO (Subject-Verb-Object) order. The main coordinating conjunctions are: und (and), oder (or), aber (but), denn (because), sondern (but rather). These are essential for connecting ideas in German.',
        examples: [
          { english: 'I am tired and I am going home.', german: 'Ich bin müde und ich gehe nach Hause.', highlight: ['und'] },
          { english: 'She is nice but he is mean.', german: 'Sie ist nett, aber er ist gemein.', highlight: ['aber'] }
        ]
      },
      {
        title: 'Und (and) and Oder (or)',
        content: 'Und connects similar ideas or adds information. Oder presents alternatives or choices. Both maintain normal word order in both clauses. Und is the most common conjunction in German.',
        examples: [
          { english: 'I drink coffee and she drinks tea.', german: 'Ich trinke Kaffee und sie trinkt Tee.', highlight: ['und'] },
          { english: 'Do you want coffee or tea?', german: 'Möchtest du Kaffee oder Tee?', highlight: ['oder'] }
        ]
      },
      {
        title: 'Aber vs Sondern',
        content: 'Both mean "but", but they have different uses. Aber is used for general contrasts. Sondern is used after a negative statement to express a contradiction or correction. Sondern implies "but rather" or "but instead".',
        examples: [
          { english: 'He is not German, but rather Austrian.', german: 'Er ist nicht Deutscher, sondern Österreicher.', highlight: ['sondern'] },
          { english: 'He is tired, but he is working.', german: 'Er ist müde, aber er arbeitet.', highlight: ['aber'] }
        ]
      },
      {
        title: 'Denn (because)',
        content: 'Denn expresses a reason or cause. It maintains normal word order, unlike weil which sends the verb to the end. Denn is more formal and literary than weil.',
        examples: [
          { english: 'I am staying home, because I am sick.', german: 'Ich bleibe zu Hause, denn ich bin krank.', highlight: ['denn'] },
          { english: 'She is happy, because she passed the exam.', german: 'Sie ist glücklich, denn sie hat die Prüfung bestanden.', highlight: ['denn'] }
        ]
      }
    ]
  },
  'haben-sein': {
    sections: [
      {
        title: 'Haben (to have) - Essential Auxiliary Verb',
        content: 'Haben is one of the most important verbs in German. It is used to express possession, to form compound tenses (perfect tense), and in many idiomatic expressions. Haben is irregular and must be memorized.',
        examples: [
          { english: 'I have a dog', german: 'Ich habe einen Hund', highlight: ['habe'] },
          { english: 'You have time', german: 'Du hast Zeit', highlight: ['hast'] },
          { english: 'He has a car', german: 'Er hat ein Auto', highlight: ['hat'] }
        ]
      },
      {
        title: 'Sein (to be) - Completely Irregular',
        content: 'Sein is completely irregular and is used for identity, location, and forming perfect tenses with motion verbs. It is the most frequently used verb in German and must be memorized completely.',
        examples: [
          { english: 'I am a student', german: 'Ich bin Student', highlight: ['bin'] },
          { english: 'She is from Germany', german: 'Sie ist aus Deutschland', highlight: ['ist'] },
          { english: 'We are here', german: 'Wir sind hier', highlight: ['sind'] }
        ]
      },
      {
        title: 'Haben vs Sein in Perfect Tense',
        content: 'Most verbs use haben to form the perfect tense. However, verbs of motion (gehen, fahren, fliegen) and sein/werden use sein. This is a crucial distinction in German grammar.',
        examples: [
          { english: 'I have worked', german: 'Ich habe gearbeitet', highlight: ['habe'] },
          { english: 'I have traveled', german: 'Ich bin gereist', highlight: ['bin'] }
        ]
      }
    ]
  }
};

async function expandPages() {
  for (const [slug, expansion] of Object.entries(expansions)) {
    const { error } = await supabase
      .from('grammar_pages')
      .update({
        sections: expansion.sections,
        estimated_time: 30
      })
      .eq('language', 'german')
      .eq('topic_slug', slug);

    if (error) {
      console.error(`❌ Error expanding ${slug}:`, error.message);
    } else {
      console.log(`✅ Expanded ${slug}`);
    }
  }
}

expandPages();

