import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function syncTopics() {
  // Get all German pages from grammar_pages
  const { data: pages, error: pagesError } = await supabase
    .from('grammar_pages')
    .select('category, topic_slug, title, description')
    .eq('language', 'german');

  if (pagesError) {
    console.error('Error fetching pages:', pagesError);
    return;
  }

  // Get all existing German topics
  const { data: existingTopics, error: topicsError } = await supabase
    .from('grammar_topics')
    .select('slug, category')
    .eq('language', 'de');

  if (topicsError) {
    console.error('Error fetching topics:', topicsError);
    return;
  }

  const existingSet = new Set(existingTopics?.map(t => `${t.category}:${t.slug}`) || []);

  let created = 0;
  let skipped = 0;

  for (const page of pages || []) {
    const key = `${page.category}:${page.topic_slug}`;
    
    if (existingSet.has(key)) {
      skipped++;
      continue;
    }

    // Find next order_position for this category
    const { data: maxOrder } = await supabase
      .from('grammar_topics')
      .select('order_position')
      .eq('language', 'de')
      .eq('category', page.category)
      .order('order_position', { ascending: false })
      .limit(1);

    const nextOrder = (maxOrder?.[0]?.order_position || 0) + 1;

    const { error: insertError } = await supabase
      .from('grammar_topics')
      .insert({
        topic_name: page.title,
        slug: page.topic_slug,
        language: 'de',
        category: page.category,
        difficulty_level: 'beginner',
        curriculum_level: 'KS3',
        title: page.title,
        description: page.description,
        is_active: true,
        order_position: nextOrder
      });

    if (insertError) {
      console.error(`❌ Error creating topic ${page.topic_slug}:`, insertError.message);
    } else {
      console.log(`✅ Created topic ${page.topic_slug}`);
      created++;
    }
  }

  console.log(`\n📊 Summary: ${created} created, ${skipped} skipped`);
}

syncTopics();

