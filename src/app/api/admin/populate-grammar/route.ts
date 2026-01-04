import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
        return NextResponse.json({ error: 'Missing Supabase environment variables' }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
        auth: {
            autoRefreshToken: false,
            persistSession: false
        }
    });

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const specificVerb = searchParams.get('verb');
    const targetLang = searchParams.get('lang'); // 'es', 'fr', 'de'

    // Universal Person Keys used by the Game Service (quirky usage of Spanish keys for all langs)
    const PERSON_KEYS = ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes'];

    // --- CONJUGATION ENGINES ---

    // 1. SPANISH ENGINE
    function conjugateSpanish(infinitive: string) {
        const ending = infinitive.slice(-2);
        const stem = infinitive.slice(0, -2);

        // Full Irregulars (Exceptions)
        const fullIrregulars: any = {
            'ser': {
                present: ['soy', 'eres', 'es', 'somos', 'sois', 'son'],
                preterite: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
                imperfect: ['era', 'eras', 'era', 'éramos', 'erais', 'eran'],
                future: ['seré', 'serás', 'será', 'seremos', 'seréis', 'serán'],
                conditional: ['sería', 'serías', 'sería', 'seríamos', 'seríais', 'serían']
            },
            'ir': {
                present: ['voy', 'vas', 'va', 'vamos', 'vais', 'van'],
                preterite: ['fui', 'fuiste', 'fue', 'fuimos', 'fuisteis', 'fueron'],
                imperfect: ['iba', 'ibas', 'iba', 'íbamos', 'ibais', 'iban']
            },
            'estar': {
                present: ['estoy', 'estás', 'está', 'estamos', 'estáis', 'están'],
                preterite: ['estuve', 'estuviste', 'estuvo', 'estuvimos', 'estuvisteis', 'estuvieron']
            },
            'ver': {
                present: ['veo', 'ves', 've', 'vemos', 'veis', 'ven'],
                imperfect: ['veía', 'veías', 'veía', 'veíamos', 'veíais', 'veían'] // Regular -er irregular in imperfect
            }
        };

        const endings: any = {
            ar: {
                present: ['o', 'as', 'a', 'amos', 'áis', 'an'],
                preterite: ['é', 'aste', 'ó', 'amos', 'asteis', 'aron'],
                imperfect: ['aba', 'abas', 'aba', 'ábamos', 'abais', 'aban'],
                future: ['aré', 'arás', 'ará', 'aremos', 'aréis', 'arán'],
                conditional: ['aría', 'arías', 'aría', 'aríamos', 'aríais', 'arían']
            },
            er: {
                present: ['o', 'es', 'e', 'emos', 'éis', 'en'],
                preterite: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
                imperfect: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
                future: ['eré', 'erás', 'erá', 'eremos', 'eréis', 'erán'],
                conditional: ['ería', 'erías', 'ería', 'eríamos', 'eríais', 'erían']
            },
            ir: {
                present: ['o', 'es', 'e', 'imos', 'ís', 'en'],
                preterite: ['í', 'iste', 'ió', 'imos', 'isteis', 'ieron'],
                imperfect: ['ía', 'ías', 'ía', 'íamos', 'íais', 'ían'],
                future: ['iré', 'irás', 'irá', 'iremos', 'iréis', 'irán'],
                conditional: ['ería', 'erías', 'ería', 'iríamos', 'iríais', 'irían']
            }
        };

        if (!['ar', 'er', 'ir'].includes(ending)) return null;

        const result: any = {};
        const patterns = endings[ending];

        ['present', 'preterite', 'imperfect', 'future', 'conditional'].forEach(tense => {
            if (fullIrregulars[infinitive] && fullIrregulars[infinitive][tense]) {
                result[tense] = fullIrregulars[infinitive][tense];
            } else {
                result[tense] = patterns[tense].map((suffix: string) => stem + suffix);
            }
        });

        return result;
    }

    // 2. FRENCH ENGINE
    function conjugateFrench(infinitive: string) {
        const ending = infinitive.endsWith('er') ? 'er' : (infinitive.endsWith('ir') ? 'ir' : (infinitive.endsWith('re') ? 're' : null));
        if (!ending) return null;
        const stem = infinitive.slice(0, -2);

        const fullIrregulars: any = {
            'être': {
                present: ['suis', 'es', 'est', 'sommes', 'êtes', 'sont'],
                imperfect: ['étais', 'étais', 'était', 'étions', 'étiez', 'étaient'],
                future: ['serai', 'seras', 'sera', 'serons', 'serez', 'seront'],
                conditional: ['serais', 'serais', 'serait', 'serions', 'seriez', 'seraient'],
                preterite: ['ai été', 'as été', 'a été', 'avons été', 'avez été', 'ont été'] // Passé Composé as preterite for game purposes? Or Passé Simple?
                // The game might expect simple tense. Let's provide standard tenses.
                // NOTE: 'preterite' in the game likely maps to Passé Composé or Passé Simple. 
                // Given typical learning usage, Passé Composé is more common, BUT it's compound.
                // If the game checks strict string equality, compound might be tricky. 
                // Let's assume Passé Composé for now as it's the standard spoken past.
                // However, looking at the Spanish 'preterite', it's the Simple Past (Pretérito Indefinido).
                // French Passé Simple is literary. 
                // Let's stick to Passé Composé for 'preterite' slot for now, or just implement Passé Simple?
                // Let's look at `attendre`. Regular RE.
                // Passé simple: attendis, attendis, attendit, attendîmes, attendîtes, attendirent
                // Passé composé: ai attendu, ...
                // I will output Passé Composé for 'preterite' as it's what students learn first usually.
            },
            'avoir': {
                present: ['ai', 'as', 'a', 'avons', 'avez', 'ont'],
                imperfect: ['avais', 'avais', 'avait', 'avions', 'aviez', 'avaient'],
                future: ['aurai', 'auras', 'aura', 'aurons', 'aurez', 'auront']
            },
            'aller': {
                present: ['vais', 'vas', 'va', 'allons', 'allez', 'vont'],
                future: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront']
            },
            'faire': {
                present: ['fais', 'fais', 'fait', 'faisons', 'faites', 'font'],
                future: ['ferai', 'feras', 'fera', 'ferons', 'ferez', 'feront']
            }
        };

        const endings: any = {
            er: {
                present: ['e', 'es', 'e', 'ons', 'ez', 'ent'],
                future: ['erai', 'eras', 'era', 'erons', 'erez', 'eront'], // stem is full infinitive usually for regular
                imperfect: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'], // added to stem
                conditional: ['erais', 'erais', 'erait', 'erions', 'eriez', 'eraient'],
                // Using Passé Composé for Preterite slot for pragmatism
                preterite: ['ai [pp]', 'as [pp]', 'a [pp]', 'avons [pp]', 'avez [pp]', 'ont [pp]']
            },
            ir: {
                // Regular IR (finir)
                present: ['is', 'is', 'it', 'issons', 'issez', 'issent'],
                future: ['irai', 'iras', 'ira', 'irons', 'irez', 'iront'],
                imperfect: ['issais', 'issais', 'issait', 'issions', 'issiez', 'issaient'],
                conditional: ['irais', 'irais', 'irait', 'irions', 'iriez', 'iraient'],
                preterite: ['ai [pp]', 'as [pp]', 'a [pp]', 'avons [pp]', 'avez [pp]', 'ont [pp]']
            },
            re: {
                present: ['s', 's', '', 'ons', 'ez', 'ent'],
                future: ['rai', 'ras', 'ra', 'rons', 'rez', 'ront'], // re drops e
                imperfect: ['ais', 'ais', 'ait', 'ions', 'iez', 'aient'],
                conditional: ['rais', 'rais', 'rait', 'rions', 'riez', 'raient'],
                preterite: ['ai [pp]', 'as [pp]', 'a [pp]', 'avons [pp]', 'avez [pp]', 'ont [pp]']
            }
        };

        const result: any = {};
        const patterns = endings[ending];

        // Past Participles
        let pp = '';
        if (ending === 'er') pp = stem + 'é';
        if (ending === 'ir') pp = stem + 'i';
        if (ending === 're') pp = stem + 'u';
        if (infinitive === 'faire') pp = 'fait';
        if (infinitive === 'être') pp = 'été';
        if (infinitive === 'avoir') pp = 'eu';
        if (infinitive === 'aller') pp = 'allé';

        ['present', 'preterite', 'imperfect', 'future', 'conditional'].forEach(tense => {
            if (fullIrregulars[infinitive] && fullIrregulars[infinitive][tense]) {
                result[tense] = fullIrregulars[infinitive][tense];
            } else {
                if (tense === 'preterite') {
                    // Passé Composé construction
                    const aux = patterns.preterite;
                    result[tense] = aux.map((a: string) => a.replace('[pp]', pp));
                } else if (tense === 'future' || tense === 'conditional') {
                    // Future/Conditional strict logic
                    // Regular ER/IR keep infinitive + endings (ai, as...)
                    // RE drops e + endings
                    if (ending === 're') {
                        // patterns logic above was suffix based on stem, let's fix
                        // Stem 'attend'. 
                        // Future: attendre -> attendr + endings
                        result[tense] = patterns[tense].map((suffix: string) => stem + suffix);
                    } else {
                        // ER/IR: stem + suffix (suffix in my map includes the er/ir part effectively? No.)
                        // patterns above: future 'erai'. stem 'parl'. result 'parlerai'. Correct.
                        result[tense] = patterns[tense].map((suffix: string) => stem + suffix);
                    }
                } else {
                    // Present / Imperfect
                    result[tense] = patterns[tense].map((suffix: string) => stem + suffix);
                }
            }
        });

        return result;
    }

    // 3. GERMAN ENGINE
    function conjugateGerman(infinitive: string) {
        if (!infinitive.endsWith('en') && !infinitive.endsWith('ln') && !infinitive.endsWith('rn')) return null; // Simplified
        const stem = infinitive.replace(/en$/, '').replace(/ln$/, 'l').replace(/rn$/, 'r'); // Approximate

        const fullIrregulars: any = {
            'sein': {
                present: ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'],
                preterite: ['war', 'warst', 'war', 'waren', 'wart', 'waren'],
            },
            'haben': {
                present: ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'],
                preterite: ['hatte', 'hattest', 'hatte', 'hatten', 'hattet', 'hatten']
            }
        };

        const endings = {
            present: ['e', 'st', 't', 'en', 't', 'en'],
            preterite: ['te', 'test', 'te', 'ten', 'tet', 'ten'], // Regular weak verbs
            // Future is compound 'werden' + inf. Omitted for basic script unless needed.
            // Using Present/Preterite for now.
        };

        const result: any = {};

        ['present', 'preterite'].forEach(tense => {
            if (fullIrregulars[infinitive] && fullIrregulars[infinitive][tense]) {
                result[tense] = fullIrregulars[infinitive][tense];
            } else {
                result[tense] = endings[tense as keyof typeof endings].map(suffix => stem + suffix);
            }
        });

        return result;
    }

    // --- MAIN LOGIC ---

    // Build Query
    let query = supabase
        .from('centralized_vocabulary')
        .select('word, translation, id, language');

    if (specificVerb) {
        query = query.eq('word', specificVerb);
    } else {
        query = query.range(offset, offset + limit - 1);
    }

    // Filter by language if specified, else fetch likely verbs
    if (targetLang) {
        query = query.eq('language', targetLang);
    } else {
        // Just grab huge batch and filter in loop to avoid complex OR logic across languages
    }

    const { data: vocabVerbs, error: vocabError } = await query;
    if (vocabError) return NextResponse.json({ error: vocabError.message }, { status: 500 });

    const results = [];
    const errors = [];

    for (const vocab of vocabVerbs) {
        const infinitive = vocab.word.toLowerCase().trim();
        const lang = vocab.language;

        // Select Engine
        let conjugations = null;
        if (lang === 'es') conjugations = conjugateSpanish(infinitive);
        else if (lang === 'fr') conjugations = conjugateFrench(infinitive);
        else if (lang === 'de') conjugations = conjugateGerman(infinitive);

        if (!conjugations) continue; // Not a recognized verb pattern

        try {
            // Get/Create Verb
            let verbId;
            const { data: existingVerb } = await supabase
                .from('grammar_verbs')
                .select('id')
                .eq('infinitive', infinitive)
                .eq('language', lang)
                .single();

            if (existingVerb) {
                verbId = existingVerb.id;
            } else {
                const { data: newVerb, error: insertError } = await supabase
                    .from('grammar_verbs')
                    .insert({
                        infinitive: infinitive,
                        translation: vocab.translation,
                        language: lang,
                        verb_type: 'regular',
                        difficulty: 'beginner',
                        is_active: true,
                        frequency_rank: 50
                    })
                    .select('id')
                    .single();
                if (insertError) {
                    errors.push(`${infinitive}: ${insertError.message}`);
                    continue;
                }
                verbId = newVerb.id;
            }

            // Insert Conjugations with Universal Keys
            for (const [tense, forms] of Object.entries(conjugations)) {
                const formsArray = forms as string[];
                for (let i = 0; i < formsArray.length; i++) {
                    const form = formsArray[i];
                    const personKey = PERSON_KEYS[i]; // <--- CRITICAL: Using universal keys

                    // Optimized: Only insert if missing. 
                    const { data: existingConj } = await supabase
                        .from('grammar_conjugations')
                        .select('id')
                        .eq('verb_id', verbId)
                        .eq('tense', tense)
                        .eq('person', personKey)
                        .single();

                    if (!existingConj) {
                        await supabase.from('grammar_conjugations').insert({
                            verb_id: verbId,
                            tense: tense,
                            person: personKey,
                            conjugated_form: form,
                            is_irregular: false
                        });
                    }
                }
            }
            results.push(infinitive);
        } catch (e: any) {
            errors.push(`${infinitive}: ${e.message}`);
        }
    }

    return NextResponse.json({ success: true, processed: results.length, first: results[0], errors });
}
