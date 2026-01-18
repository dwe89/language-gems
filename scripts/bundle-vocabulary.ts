/**
 * Script to convert vocabulary CSV to bundled JSON for mobile app
 * 
 * Run with: npx tsx scripts/bundle-vocabulary.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { parse } from 'csv-parse/sync';

interface CSVRow {
    word: string;
    translation: string;
    language: string;
    category: string;
    subcategory: string;
    part_of_speech?: string;
    difficulty_level?: string;
    curriculum_level?: string;
    example_sentence?: string;
    example_translation?: string;
    gender?: string;
    article?: string;
}

interface VocabularyWord {
    id: string;
    word: string;
    translation: string;
    gender?: 'm' | 'f' | 'n';
    example?: string;
    partOfSpeech?: string;
    difficulty?: string;
}

interface VocabularySubcategory {
    id: string;
    name: string;
    words: VocabularyWord[];
}

interface VocabularyCategory {
    id: string;
    name: string;
    subcategories: VocabularySubcategory[];
}

interface VocabularyBundle {
    language: string;
    languageCode: string;
    tier: string;
    lastUpdated: string;
    totalWords: number;
    categories: VocabularyCategory[];
}

// Language mappings
const LANGUAGE_MAP: Record<string, { name: string; code: string }> = {
    'es': { name: 'spanish', code: 'es' },
    'fr': { name: 'french', code: 'fr' },
    'de': { name: 'german', code: 'de' },
};

// Convert category ID to display name
function formatCategoryName(id: string): string {
    return id
        .replace(/_/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// Generate a unique ID for a word
function generateWordId(word: string, language: string): string {
    return `${language}_${word.toLowerCase().replace(/[^a-z0-9]/g, '_')}`;
}

// Parse gender
function parseGender(gender?: string): 'm' | 'f' | 'n' | undefined {
    if (!gender) return undefined;
    const g = gender.toLowerCase().trim();
    if (g === 'm' || g === 'masculine') return 'm';
    if (g === 'f' || g === 'feminine') return 'f';
    if (g === 'n' || g === 'neuter') return 'n';
    return undefined;
}

async function main() {
    console.log('🚀 Bundling vocabulary for mobile app...\n');

    // Read CSV files
    const csvFiles = [
        { path: 'Vocab_final.csv', language: 'es' },
        { path: 'Vocab_French_final.csv', language: 'fr' },
        // Add German when available
    ];

    for (const file of csvFiles) {
        const csvPath = path.join(process.cwd(), file.path);

        if (!fs.existsSync(csvPath)) {
            console.log(`⚠️  Skipping ${file.path} (not found)`);
            continue;
        }

        console.log(`📖 Reading ${file.path}...`);

        const csvContent = fs.readFileSync(csvPath, 'utf-8');
        const rows: CSVRow[] = parse(csvContent, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
        });

        console.log(`   Found ${rows.length} words`);

        // Filter by language
        const languageRows = rows.filter(r => r.language === file.language);
        console.log(`   ${languageRows.length} words for language ${file.language}`);

        // Group by category and subcategory
        const categoryMap = new Map<string, Map<string, VocabularyWord[]>>();

        for (const row of languageRows) {
            const catId = row.category || 'uncategorized';
            const subId = row.subcategory || 'general';

            if (!categoryMap.has(catId)) {
                categoryMap.set(catId, new Map());
            }

            const subMap = categoryMap.get(catId)!;
            if (!subMap.has(subId)) {
                subMap.set(subId, []);
            }

            subMap.get(subId)!.push({
                id: generateWordId(row.word, file.language),
                word: row.word,
                translation: row.translation,
                gender: parseGender(row.gender),
                example: row.example_sentence || undefined,
                partOfSpeech: row.part_of_speech || undefined,
                difficulty: row.difficulty_level || undefined,
            });
        }

        // Build the bundle
        const categories: VocabularyCategory[] = [];
        let totalWords = 0;

        for (const [catId, subMap] of categoryMap) {
            const subcategories: VocabularySubcategory[] = [];

            for (const [subId, words] of subMap) {
                subcategories.push({
                    id: subId,
                    name: formatCategoryName(subId),
                    words,
                });
                totalWords += words.length;
            }

            categories.push({
                id: catId,
                name: formatCategoryName(catId),
                subcategories,
            });
        }

        const langInfo = LANGUAGE_MAP[file.language];

        const bundle: VocabularyBundle = {
            language: langInfo.name,
            languageCode: langInfo.code,
            tier: 'all',
            lastUpdated: new Date().toISOString().split('T')[0],
            totalWords,
            categories,
        };

        // Write to public/data/vocabulary
        const outputDir = path.join(process.cwd(), 'public', 'data', 'vocabulary', langInfo.name);
        fs.mkdirSync(outputDir, { recursive: true });

        const outputPath = path.join(outputDir, 'all.json');
        fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));

        console.log(`✅ Wrote ${outputPath}`);
        console.log(`   ${categories.length} categories, ${totalWords} words\n`);
    }

    console.log('🎉 Vocabulary bundling complete!');
}

main().catch(console.error);
