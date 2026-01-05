#!/usr/bin/env node
/**
 * FAST batch processor for OpenAI conjugation results
 * Uses bulk inserts instead of individual queries
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PERSON_KEYS = ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes'];
const VALID_VERB_TYPES = ['regular', 'irregular', 'stem_changing'];

interface ParsedVerb {
    infinitive: string;
    language: string;
    translation: string;
    verb_type: string;
    conjugations: Record<string, string[]>;
}

async function processResults(inputFile: string) {
    console.log(`Reading ${inputFile}...`);
    const content = fs.readFileSync(inputFile, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    console.log(`  Found ${lines.length} results`);

    // Step 1: Parse all valid verbs from the batch output
    console.log('\n📖 Parsing verbs from batch output...');
    const verbs: ParsedVerb[] = [];
    let skipped = 0;

    for (const line of lines) {
        try {
            const result = JSON.parse(line);
            if (result.error || result.response?.status_code !== 200) continue;

            const contentStr = result.response?.body?.choices?.[0]?.message?.content;
            if (!contentStr) continue;

            const cleanContent = contentStr.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            const data = JSON.parse(cleanContent);

            // Skip non-verbs
            if (data.error === 'not_a_verb' ||
                data.verb_type === 'not_a_verb' ||
                !VALID_VERB_TYPES.includes(data.verb_type) ||
                !data.conjugations ||
                Object.keys(data.conjugations).length === 0) {
                skipped++;
                continue;
            }

            verbs.push({
                infinitive: data.infinitive.toLowerCase().trim(),
                language: data.language,
                translation: data.translation || '',
                verb_type: VALID_VERB_TYPES.includes(data.verb_type) ? data.verb_type : 'regular',
                conjugations: data.conjugations
            });
        } catch (e) {
            continue;
        }
    }

    console.log(`  Parsed ${verbs.length} valid verbs (${skipped} non-verbs skipped)`);

    // Step 2: Deduplicate verbs by infinitive+language
    console.log('\n🔄 Deduplicating verbs...');
    const uniqueVerbs = new Map<string, ParsedVerb>();
    for (const v of verbs) {
        const key = `${v.infinitive}|${v.language}`;
        if (!uniqueVerbs.has(key)) {
            uniqueVerbs.set(key, v);
        }
    }
    console.log(`  ${uniqueVerbs.size} unique verbs`);

    // Step 3: Get existing verbs from database
    console.log('\n📊 Fetching existing verbs from database...');
    const { data: existingVerbs, error: fetchError } = await supabase
        .from('grammar_verbs')
        .select('id, infinitive, language');

    if (fetchError) {
        console.error('Failed to fetch existing verbs:', fetchError);
        process.exit(1);
    }

    const existingVerbMap = new Map<string, string>();
    for (const v of existingVerbs || []) {
        existingVerbMap.set(`${v.infinitive}|${v.language}`, v.id);
    }
    console.log(`  Found ${existingVerbMap.size} existing verbs in database`);

    // Step 4: Insert new verbs in bulk
    console.log('\n➕ Inserting new verbs...');
    const newVerbs: any[] = [];
    for (const [key, verb] of uniqueVerbs) {
        if (!existingVerbMap.has(key)) {
            newVerbs.push({
                infinitive: verb.infinitive,
                translation: verb.translation,
                language: verb.language,
                verb_type: verb.verb_type,
                difficulty: 'beginner',
                is_active: true,
                frequency_rank: 50
            });
        }
    }

    console.log(`  ${newVerbs.length} new verbs to insert`);

    if (newVerbs.length > 0) {
        // Insert in batches of 500
        for (let i = 0; i < newVerbs.length; i += 500) {
            const batch = newVerbs.slice(i, i + 500);
            const { error: insertError } = await supabase
                .from('grammar_verbs')
                .insert(batch);

            if (insertError) {
                console.error(`  Error inserting batch ${i / 500 + 1}:`, insertError.message);
            } else {
                console.log(`  Inserted batch ${Math.floor(i / 500) + 1}/${Math.ceil(newVerbs.length / 500)}`);
            }
        }

        // Refresh the verb map
        const { data: refreshedVerbs } = await supabase
            .from('grammar_verbs')
            .select('id, infinitive, language');

        existingVerbMap.clear();
        for (const v of refreshedVerbs || []) {
            existingVerbMap.set(`${v.infinitive}|${v.language}`, v.id);
        }
    }

    // Step 5: Build all conjugations
    console.log('\n📝 Building conjugation data...');
    const allConjugations: any[] = [];

    for (const [key, verb] of uniqueVerbs) {
        const verbId = existingVerbMap.get(key);
        if (!verbId) continue;

        for (const [tense, forms] of Object.entries(verb.conjugations)) {
            if (!Array.isArray(forms) || forms.length !== 6) continue;

            for (let i = 0; i < forms.length; i++) {
                let form = forms[i];
                // Clean up pronoun prefixes
                form = form.replace(/^(je |tu |il\/elle |nous |vous |ils\/elles |j'|ich |du |er\/sie\/es |wir |ihr |sie\/Sie )/, '').trim();

                allConjugations.push({
                    verb_id: verbId,
                    tense: tense,
                    person: PERSON_KEYS[i],
                    conjugated_form: form,
                    is_irregular: verb.verb_type === 'irregular'
                });
            }
        }
    }

    console.log(`  Built ${allConjugations.length} conjugation entries`);

    // Step 6: Get existing conjugations to avoid duplicates
    console.log('\n🔍 Checking for existing conjugations...');
    const { data: existingConj } = await supabase
        .from('grammar_conjugations')
        .select('verb_id, tense, person');

    const existingConjSet = new Set<string>();
    for (const c of existingConj || []) {
        existingConjSet.add(`${c.verb_id}|${c.tense}|${c.person}`);
    }
    console.log(`  Found ${existingConjSet.size} existing conjugations`);

    // Filter out existing conjugations
    const newConjugations = allConjugations.filter(c =>
        !existingConjSet.has(`${c.verb_id}|${c.tense}|${c.person}`)
    );
    console.log(`  ${newConjugations.length} new conjugations to insert`);

    // Step 7: Insert conjugations in large batches
    console.log('\n⚡ Bulk inserting conjugations...');
    let inserted = 0;
    const BATCH_SIZE = 1000;

    for (let i = 0; i < newConjugations.length; i += BATCH_SIZE) {
        const batch = newConjugations.slice(i, i + BATCH_SIZE);
        const { error: insertError } = await supabase
            .from('grammar_conjugations')
            .insert(batch);

        if (insertError) {
            console.error(`  Batch ${Math.floor(i / BATCH_SIZE) + 1} error:`, insertError.message);
        } else {
            inserted += batch.length;
            console.log(`  Inserted ${inserted}/${newConjugations.length} conjugations`);
        }
    }

    console.log('\n✅ DONE!');
    console.log(`   Unique verbs: ${uniqueVerbs.size}`);
    console.log(`   New verbs added: ${newVerbs.length}`);
    console.log(`   Conjugations added: ${inserted}`);
}

// Main
const inputFile = process.argv[2];
if (!inputFile) {
    console.log('Usage: npx tsx scripts/process-conjugation-batch-results.ts <output_file.jsonl>');
    process.exit(1);
}

processResults(inputFile).catch(console.error);
