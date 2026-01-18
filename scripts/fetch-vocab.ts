import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase credentials in .env.local');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fetchAllVocab() {
    console.log('Starting vocabulary sync...');

    const outputPath = path.join(process.cwd(), 'public/data/vocabulary/complete_bundle.json');
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    let allData: any[] = [];
    let count = 0;
    const pageSize = 1000;
    let page = 0;
    let hasMore = true;

    while (hasMore) {
        const from = page * pageSize;
        const to = from + pageSize - 1;

        const { data, error } = await supabase
            .from('centralized_vocabulary')
            .select('id, language, word, translation, category, subcategory, curriculum_level, tier, exam_board_code')
            .range(from, to)
            .order('id');

        if (error) {
            console.error('Error fetching rows:', error);
            process.exit(1);
        }

        if (data && data.length > 0) {
            allData = [...allData, ...data];
            count += data.length;
            console.log(`Fetched ${count} words...`);

            if (data.length < pageSize) {
                hasMore = false;
            }
        } else {
            hasMore = false;
        }

        page++;
    }

    fs.writeFileSync(outputPath, JSON.stringify(allData, null, 2));
    console.log(`✅ Successfully saved ${allData.length} words to ${outputPath}`);
    console.log(`File size: ${(fs.statSync(outputPath).size / 1024 / 1024).toFixed(2)} MB`);
}

fetchAllVocab();
