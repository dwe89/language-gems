#!/usr/bin/env node
/**
 * Process OpenAI Batch API results and insert conjugations into database
 * Usage: npx tsx scripts/process-conjugation-batch-results.ts <output_file.jsonl>
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as readline from 'readline';
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

interface ConjugationResult {
    infinitive: string;
    language: string;
    translation: string;
    verb_type: 'regular' | 'irregular' | 'stem_changing';
    conjugations: {
        present: string[];
        preterite: string[];
        imperfect: string[];
        future: string[];
        conditional: string[];
    };
}

interface BatchResult {
    id: string;
    custom_id: string;
    response: {
        status_code: number;
        body: {
            choices: Array<{
                message: {
                    content: string;
                };
            }>;
        };
    };
    error?: any;
}

async function processResults(inputFile: string) {
    if (!fs.existsSync(inputFile)) {
        console.error(`File not found: ${inputFile}`);
        process.exit(1);
    }

    console.log(`Processing batch results from: ${inputFile}`);

    const fileStream = fs.createReadStream(inputFile);
    const rl = readline.createInterface({ input: fileStream, crlfDelay: Infinity });

    let processed = 0;
    let errors = 0;
    let inserted = 0;

    for await (const line of rl) {
        if (!line.trim()) continue;

        try {
            const result: BatchResult = JSON.parse(line);
            processed++;

            if (result.error || result.response.status_code !== 200) {
                console.warn(`  ⚠️ Error for ${result.custom_id}:`, result.error || 'API error');
                errors++;
                continue;
            }

            const content = result.response.body.choices[0]?.message?.content;
            if (!content) {
                console.warn(`  ⚠️ No content for ${result.custom_id}`);
                errors++;
                continue;
            }

            // Parse the JSON response
            let conjugationData: ConjugationResult;
            try {
                // Clean up potential markdown formatting
                const cleanContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
                conjugationData = JSON.parse(cleanContent);
            } catch (parseError) {
                console.warn(`  ⚠️ JSON parse error for ${result.custom_id}`);
                errors++;
                continue;
            }

            if (conjugationData.error) {
                // Word is not a verb
                continue;
            }

            // Extract vocab ID from custom_id (format: "verb-{uuid}")
            const vocabId = result.custom_id.replace('verb-', '');

            // Insert or update grammar_verbs
            let verbId: string;

            const { data: existingVerb } = await supabase
                .from('grammar_verbs')
                .select('id')
                .eq('infinitive', conjugationData.infinitive)
                .eq('language', conjugationData.language)
                .single();

            if (existingVerb) {
                verbId = existingVerb.id;
            } else {
                const { data: newVerb, error: insertError } = await supabase
                    .from('grammar_verbs')
                    .insert({
                        infinitive: conjugationData.infinitive,
                        translation: conjugationData.translation,
                        language: conjugationData.language,
                        verb_type: conjugationData.verb_type || 'regular',
                        difficulty: 'beginner',
                        is_active: true,
                        frequency_rank: 50
                    })
                    .select('id')
                    .single();

                if (insertError) {
                    console.warn(`  ⚠️ Failed to insert verb ${conjugationData.infinitive}: ${insertError.message}`);
                    errors++;
                    continue;
                }
                verbId = newVerb!.id;
            }

            // Insert all conjugations
            for (const [tense, forms] of Object.entries(conjugationData.conjugations)) {
                if (!Array.isArray(forms) || forms.length !== 6) continue;

                for (let i = 0; i < forms.length; i++) {
                    const form = forms[i];
                    const personKey = PERSON_KEYS[i];

                    // Upsert conjugation
                    const { error: conjError } = await supabase
                        .from('grammar_conjugations')
                        .upsert({
                            verb_id: verbId,
                            tense: tense,
                            person: personKey,
                            conjugated_form: form,
                            is_irregular: conjugationData.verb_type === 'irregular'
                        }, {
                            onConflict: 'verb_id,tense,person'
                        });

                    if (!conjError) {
                        inserted++;
                    }
                }
            }

            if (processed % 100 === 0) {
                console.log(`  Processed ${processed} results...`);
            }

        } catch (e) {
            console.warn(`  ⚠️ Error processing line: ${e}`);
            errors++;
        }
    }

    console.log('\n✅ Batch processing complete!');
    console.log(`   Total processed: ${processed}`);
    console.log(`   Conjugations inserted: ${inserted}`);
    console.log(`   Errors: ${errors}`);
}

// Main
const inputFile = process.argv[2];
if (!inputFile) {
    console.log('Usage: npx tsx scripts/process-conjugation-batch-results.ts <output_file.jsonl>');
    console.log('\nThis script processes the output from OpenAI Batch API and inserts');
    console.log('the conjugations into the grammar_conjugations table.');
    process.exit(1);
}

processResults(inputFile).catch(console.error);
