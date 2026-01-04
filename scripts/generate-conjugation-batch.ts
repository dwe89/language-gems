#!/usr/bin/env node
/**
 * Generate JSONL batch file for OpenAI Batch API
 * This script fetches all verbs from the database and creates a batch request
 * to generate complete conjugation tables using GPT-4.1-nano
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Tenses required by the game
const TENSES = ['present', 'preterite', 'imperfect', 'future', 'conditional'];
const PERSONS = ['yo', 'tu', 'el_ella_usted', 'nosotros', 'vosotros', 'ellos_ellas_ustedes'];

// System prompt for conjugation generation
const SYSTEM_PROMPT = `You are a linguistic expert specializing in verb conjugation. 
Given a verb infinitive and language, provide the complete conjugation table.

CRITICAL RULES:
1. Return ONLY valid JSON, no markdown, no explanations
2. Use exact person keys provided
3. Be accurate with accents and special characters
4. For irregular verbs, use the correct irregular forms
5. If the word is not a verb, return {"error": "not_a_verb"}

Person keys to use (in order): yo, tu, el_ella_usted, nosotros, vosotros, ellos_ellas_ustedes

These keys represent:
- Spanish: yo, tú, él/ella/usted, nosotros, vosotros, ellos/ellas/ustedes
- French: je, tu, il/elle, nous, vous, ils/elles  
- German: ich, du, er/sie/es, wir, ihr, sie/Sie`;

function createUserPrompt(infinitive: string, language: string, translation: string): string {
    const langName = language === 'es' ? 'Spanish' : language === 'fr' ? 'French' : 'German';

    return `Generate complete conjugations for the ${langName} verb "${infinitive}" (${translation}).

Return JSON in this exact format:
{
  "infinitive": "${infinitive}",
  "language": "${language}",
  "translation": "${translation}",
  "verb_type": "regular" | "irregular" | "stem_changing",
  "conjugations": {
    "present": ["form_yo", "form_tu", "form_el", "form_nosotros", "form_vosotros", "form_ellos"],
    "preterite": ["form_yo", "form_tu", "form_el", "form_nosotros", "form_vosotros", "form_ellos"],
    "imperfect": ["form_yo", "form_tu", "form_el", "form_nosotros", "form_vosotros", "form_ellos"],
    "future": ["form_yo", "form_tu", "form_el", "form_nosotros", "form_vosotros", "form_ellos"],
    "conditional": ["form_yo", "form_tu", "form_el", "form_nosotros", "form_vosotros", "form_ellos"]
  }
}`;
}

interface VocabEntry {
    id: string;
    word: string;
    translation: string;
    language: string;
}

async function fetchAllVerbs(): Promise<VocabEntry[]> {
    console.log('Fetching verbs from centralized_vocabulary...');

    const allVerbs: VocabEntry[] = [];
    let offset = 0;
    const batchSize = 1000;

    while (true) {
        const { data, error } = await supabase
            .from('centralized_vocabulary')
            .select('id, word, translation, language')
            .in('language', ['es', 'fr', 'de'])
            .range(offset, offset + batchSize - 1);

        if (error) {
            console.error('Error fetching verbs:', error);
            break;
        }

        if (!data || data.length === 0) break;

        // Filter for likely verbs based on language patterns
        const verbs = data.filter(entry => {
            const word = entry.word.toLowerCase().trim();
            if (entry.language === 'es') {
                return word.endsWith('ar') || word.endsWith('er') || word.endsWith('ir');
            } else if (entry.language === 'fr') {
                return word.endsWith('er') || word.endsWith('ir') || word.endsWith('re');
            } else if (entry.language === 'de') {
                return word.endsWith('en') || word.endsWith('eln') || word.endsWith('ern');
            }
            return false;
        });

        allVerbs.push(...verbs);
        console.log(`  Fetched ${data.length} entries, ${verbs.length} verbs (total: ${allVerbs.length})`);

        if (data.length < batchSize) break;
        offset += batchSize;
    }

    return allVerbs;
}

async function generateBatchFile() {
    const verbs = await fetchAllVerbs();
    console.log(`\nTotal verbs to process: ${verbs.length}`);

    // Create JSONL batch file
    const outputPath = path.join(process.cwd(), 'scripts', 'conjugation_batch_requests.jsonl');
    const lines: string[] = [];

    for (const verb of verbs) {
        const batchRequest = {
            custom_id: `verb-${verb.id}`,
            method: "POST",
            url: "/v1/chat/completions",
            body: {
                model: "gpt-4.1-nano",
                messages: [
                    { role: "system", content: SYSTEM_PROMPT },
                    { role: "user", content: createUserPrompt(verb.word, verb.language, verb.translation || '') }
                ],
                max_tokens: 1000,
                temperature: 0.1 // Low temperature for accuracy
            }
        };

        lines.push(JSON.stringify(batchRequest));
    }

    fs.writeFileSync(outputPath, lines.join('\n'), 'utf-8');
    console.log(`\n✅ Batch file created: ${outputPath}`);
    console.log(`   Total requests: ${lines.length}`);
    console.log(`   File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);

    // Also create a summary
    const summary = {
        total_verbs: verbs.length,
        by_language: {
            es: verbs.filter(v => v.language === 'es').length,
            fr: verbs.filter(v => v.language === 'fr').length,
            de: verbs.filter(v => v.language === 'de').length
        },
        created_at: new Date().toISOString(),
        output_file: outputPath
    };

    const summaryPath = path.join(process.cwd(), 'scripts', 'conjugation_batch_summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2), 'utf-8');
    console.log(`   Summary saved: ${summaryPath}`);

    console.log('\n📋 Next steps:');
    console.log('   1. Upload conjugation_batch_requests.jsonl to OpenAI Batch API');
    console.log('   2. Wait for batch completion (up to 24h)');
    console.log('   3. Download the output file');
    console.log('   4. Run: npx tsx scripts/process-conjugation-batch-results.ts <output_file>');
}

generateBatchFile().catch(console.error);
