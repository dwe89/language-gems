import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

interface Topic {
  id: string;
  category: string;
  slug: string;
  topic_name: string;
  difficulty_level: string;
}

async function generatePracticeContent(topic: Topic, retryCount = 0): Promise<any> {
  const maxRetries = 3;
  console.log(`\n🤖 Generating practice content for: ${topic.slug} (${topic.category})`);

  const prompt = `You are an expert French language teacher creating 20 practice questions for this grammar topic.

TOPIC: ${topic.topic_name.replace(/_/g, ' ')}
CATEGORY: ${topic.category}
DIFFICULTY: ${topic.difficulty_level}

Create EXACTLY 20 multiple-choice questions with:
- 4 UNIQUE options per question (NO DUPLICATES!)
- Proper French accents (é, è, ê, ë, à, ù, ç, etc.)
- Clear explanations
- Difficulty: Questions 1-5 beginner, 6-15 intermediate, 16-20 intermediate/advanced

Return ONLY valid JSON: {"questions": [array of 20 questions]}

Each question must have: id, type, question, options (array of 4), correct_answer, explanation, difficulty`;

  try {
    const presencePenalty = Math.min(0.7, 0.3 + (retryCount * 0.15));
    const frequencyPenalty = Math.min(0.7, 0.3 + (retryCount * 0.15));

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'You are an expert French language teacher. Return ONLY valid JSON. Never repeat options in a single question.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
    });

    let jsonText = completion.choices[0].message.content?.trim() || '';
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    const parsed = JSON.parse(jsonText);
    const questions = Array.isArray(parsed) ? parsed : parsed.questions;

    if (!Array.isArray(questions) || questions.length !== 20) {
      throw new Error(`Expected 20 questions, got ${questions.length}`);
    }

    // Validate and fix
    questions.forEach((q, idx) => {
      q.options = q.options.map((o: string) => o.trim());
      q.correct_answer = q.correct_answer.trim();

      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== q.options.length) {
        throw new Error(`Question ${idx + 1}: Duplicate options found`);
      }

      if (!q.options.includes(q.correct_answer)) {
        const match = q.options.find((o: string) => o.toLowerCase() === q.correct_answer.toLowerCase());
        if (match) {
          q.correct_answer = match;
        } else {
          q.correct_answer = q.options[0];
        }
      }

      if (idx < 5) q.difficulty = 'beginner';
      else if (idx < 15) q.difficulty = 'intermediate';
      else q.difficulty = q.difficulty === 'advanced' ? 'advanced' : 'intermediate';
    });

    console.log(`✅ Generated 20 questions`);
    return { questions };
  } catch (error) {
    console.error(`❌ Error:`, error);
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
      await new Promise(r => setTimeout(r, (retryCount + 1) * 2000));
      return generatePracticeContent(topic, retryCount + 1);
    }
    throw error;
  }
}

async function main() {
  console.log('🚀 Starting French practice content generation...\n');

  // Get all French topics without practice content
  const { data: allTopics } = await supabase
    .from('grammar_topics')
    .select('id, category, slug, topic_name, difficulty_level')
    .eq('language', 'fr')
    .order('category')
    .order('order_position');

  const { data: contentData } = await supabase
    .from('grammar_content')
    .select('topic_id')
    .eq('content_type', 'practice');

  const topicsWithContent = new Set(contentData?.map(c => c.topic_id) || []);
  const topicsNeedingContent = allTopics?.filter(t => !topicsWithContent.has(t.id)) || [];

  console.log(`📊 Found ${topicsNeedingContent.length} topics needing practice content\n`);

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < topicsNeedingContent.length; i++) {
    try {
      const topic = topicsNeedingContent[i];
      const content = await generatePracticeContent(topic);

      const { error } = await supabase
        .from('grammar_content')
        .insert({
          topic_id: topic.id,
          content_type: 'practice',
          title: `${topic.topic_name.replace(/_/g, ' ')} - Practice`,
          slug: topic.slug,
          content_data: content,
          difficulty_level: topic.difficulty_level || 'intermediate',
          age_group: '11-14',
          estimated_duration: 20,
          is_active: true,
        });

      if (error) throw error;

      successCount++;
      console.log(`✅ [${i + 1}/${topicsNeedingContent.length}] Saved: ${topic.slug}\n`);

      await new Promise(r => setTimeout(r, 2000));
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${topicsNeedingContent.length}] Failed:`, error);
    }
  }

  console.log('\n🎉 Complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

main().catch(console.error);

