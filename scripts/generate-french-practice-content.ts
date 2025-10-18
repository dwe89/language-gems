import { createClient } from '@supabase/supabase-js';
import OpenAI from 'openai';
import * as dotenv from 'dotenv';

// Load environment variables
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

interface QuizQuestion {
  id?: string;
  type?: string;
  question?: string;
  question_text?: string;
  options: string[];
  correct_answer: string;
  explanation: string;
  difficulty: string;
}

interface PracticeContent {
  title: string;
  content_data: {
    questions: QuizQuestion[];
  };
  difficulty_level: string;
  age_group: string;
  estimated_duration: number;
}

async function generatePracticeContent(
  topic: Topic,
  retryCount = 0
): Promise<PracticeContent> {
  const maxRetries = 3;
  console.log(`\n🤖 Generating practice content for: ${topic.topic_name} (${topic.category})${retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''}`);

  const prompt = `You are an expert French language teacher creating practice exercises for students.

TOPIC: ${topic.topic_name.replace(/_/g, ' ')}
CATEGORY: ${topic.category}
DIFFICULTY: ${topic.difficulty_level}

I need you to create 20 HIGH-QUALITY practice questions for this French grammar topic.

CRITICAL REQUIREMENTS:
1. Create EXACTLY 20 multiple-choice questions
2. Each question MUST have EXACTLY 4 options in the "options" array
3. **ABSOLUTELY CRITICAL**: All 4 options MUST be DIFFERENT and UNIQUE. NO DUPLICATES!
4. Questions should be SPECIFIC with real French sentences/examples (not generic)
5. Include clear explanations that teach the grammar rule
6. DIFFICULTY PROGRESSION (very important):
   - Questions 1-5: "beginner" difficulty (simple, basic concepts)
   - Questions 6-15: "intermediate" difficulty (more complex)
   - Questions 16-20: "intermediate" or "advanced" difficulty (challenging)
7. Use proper French accents and diacritics (é, è, ê, ë, à, ù, ç, etc.)
8. Make questions practical and realistic with varied vocabulary
9. **ABSOLUTELY CRITICAL**: First write 4 DIFFERENT options, THEN copy one of those EXACT options (character-for-character, including all accents) as the "correct_answer". The "correct_answer" MUST be IDENTICAL to one of the options.
10. Each question needs a unique id like "${topic.slug}_p1", "${topic.slug}_p2", etc.
11. Use "type": "multiple_choice" for all questions
12. Double-check that every "correct_answer" appears EXACTLY in the "options" array
13. Vary the sentence topics (family, school, hobbies, travel, food, culture, etc.) to keep it interesting
14. **VERIFY**: Before finalizing each question, check that all 4 options are different words/phrases
15. **DO NOT UNDER ANY CIRCUMSTANCES** include the same word or phrase twice in the "options" array for a single question.

VALIDATION CHECKLIST (verify before returning):
- [ ] Exactly 20 questions
- [ ] Each question has exactly 4 UNIQUE options (no duplicates!)
- [ ] Each correct_answer is EXACTLY one of the 4 options (copy-paste, don't retype)
- [ ] All French words have proper accents where needed
- [ ] Each question has: id, type, question, options, correct_answer, explanation, difficulty
- [ ] Questions 1-5 have "difficulty": "beginner"
- [ ] Questions 6-15 have "difficulty": "intermediate"
- [ ] Questions 16-20 have "difficulty": "intermediate" or "advanced"
- [ ] NO duplicate options within any single question

Return ONLY a valid JSON object with this exact structure: {"questions": [array of exactly 20 question objects]}. Do not use markdown code blocks.`;

  try {
    const presencePenalty = Math.min(0.7, 0.3 + (retryCount * 0.15));
    const frequencyPenalty = Math.min(0.7, 0.3 + (retryCount * 0.15));

    if (retryCount > 0) {
      console.log(`🎯 Using increased penalties: presence=${presencePenalty.toFixed(2)}, frequency=${frequencyPenalty.toFixed(2)}`);
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4.1-nano',
      messages: [
        {
          role: 'system',
          content: 'You are an expert French language teacher. You must respond with valid JSON only. The response must be a JSON object with a "questions" array containing exactly 20 question objects. NEVER repeat the same option twice in a single question.',
        },
        {
          role: 'user',
          content: prompt + '\n\nIMPORTANT: Return a JSON object with this structure: {"questions": [... array of 20 questions ...]}',
        },
      ],
      temperature: 0.7,
      max_tokens: 8000,
      response_format: { type: "json_object" },
      presence_penalty: presencePenalty,
      frequency_penalty: frequencyPenalty,
    });

    const responseText = completion.choices[0].message.content?.trim() || '';

    let jsonText = responseText;
    if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    }

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('❌ JSON Parse Error. Response preview:', jsonText.substring(0, 200));
      throw new Error(`Invalid JSON response from AI: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
    }

    let questions;
    if (Array.isArray(parsedResponse)) {
      questions = parsedResponse;
    } else if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
      questions = parsedResponse.questions;
    } else {
      throw new Error(`Response is not in expected format. Got: ${JSON.stringify(Object.keys(parsedResponse))}`);
    }

    if (!Array.isArray(questions) || questions.length !== 20) {
      throw new Error(`Expected 20 questions, got ${questions.length}`);
    }

    // Validate and fix each question
    questions.forEach((q, index) => {
      if (!q.question || !q.options || !q.correct_answer || !q.explanation) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }

      q.options = q.options.map((opt: string) => opt.trim());
      q.correct_answer = q.correct_answer.trim();

      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== q.options.length) {
        const duplicates = q.options.filter((opt: string, idx: number) => q.options.indexOf(opt) !== idx);
        console.error(`❌ Question ${index + 1} failed: "${q.question}"`);
        console.error(`   Options: ${JSON.stringify(q.options)}`);
        console.error(`   Duplicates: ${JSON.stringify(duplicates)}`);
        throw new Error(`Question ${index + 1}: Duplicate options found: ${JSON.stringify(duplicates)}. All 4 options must be unique!`);
      }

      if (!q.options.includes(q.correct_answer)) {
        const closeMatch = q.options.find((opt: string) =>
          opt.toLowerCase() === q.correct_answer.toLowerCase()
        );

        if (closeMatch) {
          console.log(`⚠️  Question ${index + 1}: Fixed case mismatch - "${q.correct_answer}" → "${closeMatch}"`);
          q.correct_answer = closeMatch;
        } else {
          console.warn(`⚠️  Question ${index + 1}: correct_answer "${q.correct_answer}" not in options: ${JSON.stringify(q.options)}`);
          console.warn(`    Using first option "${q.options[0]}" as fallback`);
          q.correct_answer = q.options[0];
        }
      }

      let enforcedDifficulty: string;
      if (index < 5) {
        enforcedDifficulty = 'beginner';
      } else if (index < 15) {
        enforcedDifficulty = 'intermediate';
      } else {
        const actualDifficulty = q.difficulty?.toLowerCase().trim();
        enforcedDifficulty = actualDifficulty === 'advanced' ? 'advanced' : 'intermediate';
      }

      q.difficulty = enforcedDifficulty;
    });

    const beginnerCount = questions.filter(q => q.difficulty === 'beginner').length;
    const intermediateCount = questions.filter(q => q.difficulty === 'intermediate').length;
    const advancedCount = questions.filter(q => q.difficulty === 'advanced').length;

    console.log(`✅ Generated ${questions.length} practice questions (Beginner: ${beginnerCount}, Intermediate: ${intermediateCount}, Advanced: ${advancedCount})`);

    return {
      title: `${topic.topic_name.replace(/_/g, ' ')} - Practice`,
      content_data: {
        questions,
      },
      difficulty_level: topic.difficulty_level || 'intermediate',
      age_group: '11-14',
      estimated_duration: 20,
    };
  } catch (error) {
    console.error(`❌ Error generating content for ${topic.topic_name}:`, error);

    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 2000));
      return generatePracticeContent(topic, retryCount + 1);
    }

    throw error;
  }
}

async function createPracticeContent(topic: Topic, practiceContent: PracticeContent) {
  const { error } = await supabase
    .from('grammar_content')
    .insert({
      topic_id: topic.id,
      content_type: 'practice',
      title: practiceContent.title,
      slug: topic.slug,
      content_data: practiceContent.content_data,
      difficulty_level: practiceContent.difficulty_level,
      age_group: practiceContent.age_group,
      estimated_duration: practiceContent.estimated_duration,
      is_active: true,
    });

  if (error) {
    throw new Error(`Failed to create practice content: ${error.message}`);
  }

  console.log(`✅ Created practice content in database`);
}

async function main() {
  console.log('🚀 Starting French practice content generation...\n');

  const args = process.argv.slice(2);
  const limitCount = args.includes('--limit')
    ? parseInt(args[args.indexOf('--limit') + 1] || '0')
    : 0;
  const dryRun = args.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No database updates will be made\n');
  }

  // Get all French topics without practice content
  const { data: topicsData, error: topicsError } = await supabase
    .from('grammar_topics')
    .select('id, category, slug, topic_name, difficulty_level')
    .eq('language', 'fr')
    .order('category')
    .order('order_position');

  if (topicsError) {
    console.error('Error fetching topics:', topicsError);
    return;
  }

  // Filter topics without practice content
  const { data: contentData } = await supabase
    .from('grammar_content')
    .select('topic_id')
    .eq('content_type', 'practice');

  const topicsWithContent = new Set(contentData?.map(c => c.topic_id) || []);
  const topicsNeedingContent = topicsData.filter(t => !topicsWithContent.has(t.id));

  console.log(`📊 Found ${topicsNeedingContent.length} French topics needing practice content\n`);

  let topicsToProcess = topicsNeedingContent;
  if (limitCount > 0) {
    topicsToProcess = topicsToProcess.slice(0, limitCount);
    console.log(`🔢 Processing ${limitCount} topics\n`);
  }

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < topicsToProcess.length; i++) {
    try {
      const topic: Topic = topicsToProcess[i];
      const newPracticeContent = await generatePracticeContent(topic);

      if (!dryRun) {
        await createPracticeContent(topic, newPracticeContent);
      } else {
        console.log(`🔍 DRY RUN: Would create practice content in database`);
      }

      successCount++;
      console.log(`✅ [${i + 1}/${topicsToProcess.length}] Completed: ${topic.topic_name}\n`);

      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      errorCount++;
      console.error(`❌ [${i + 1}/${topicsToProcess.length}] Failed:`, error);
      console.log('');
    }
  }

  console.log('\n🎉 French practice content generation complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${successCount + errorCount}/${topicsToProcess.length}`);
}

main().catch(console.error);

