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

// Example of high-quality practice content (from adjective-agreement)
const EXAMPLE_PRACTICE_QUESTIONS = `[
  {
    "id": "adj_agr_p1",
    "type": "multiple_choice",
    "options": ["blanco", "blanca", "blancos", "blancas"],
    "question": "Choose the correct form: La mesa _____ (blanco)",
    "difficulty": "beginner",
    "explanation": "Mesa is feminine singular, so the adjective becomes 'blanca'.",
    "correct_answer": "blanca"
  },
  {
    "id": "adj_agr_p2",
    "type": "multiple_choice",
    "options": ["negro", "negra", "negros", "negras"],
    "question": "Select: Los gatos _____ (negro)",
    "difficulty": "beginner",
    "explanation": "Gatos is masculine plural, so the adjective becomes 'negros'.",
    "correct_answer": "negros"
  }
]`;

async function generatePracticeContent(
  topic: Topic,
  quizQuestions: QuizQuestion[],
  retryCount = 0
): Promise<PracticeContent> {
  const maxRetries = 3;
  console.log(`\n🤖 Generating practice content for: ${topic.topic_name} (${topic.category})${retryCount > 0 ? ` (Retry ${retryCount}/${maxRetries})` : ''}`);

  const prompt = `You are an expert Spanish language teacher creating practice exercises for students.

TOPIC: ${topic.topic_name.replace(/_/g, ' ')}
CATEGORY: ${topic.category}
DIFFICULTY: ${topic.difficulty_level}

I need you to create 15 HIGH-QUALITY practice questions for this grammar topic.

REFERENCE QUIZ QUESTIONS (for context about this topic):
${JSON.stringify(quizQuestions.slice(0, 5), null, 2)}

EXAMPLE OF EXCELLENT PRACTICE QUESTIONS (format to follow):
${EXAMPLE_PRACTICE_QUESTIONS}

CRITICAL REQUIREMENTS:
1. Create EXACTLY 15 multiple-choice questions
2. Each question MUST have EXACTLY 4 options in the "options" array
3. **ABSOLUTELY CRITICAL**: The 3 INCORRECT options (distractors) MUST be PLAUSIBLE, UNIQUE, and based on COMMON ERRORS for this topic. All 4 options (3 incorrect + 1 correct) MUST be different words/phrases. **DO NOT REUSE OPTIONS.**
4. Questions should be SPECIFIC with real Spanish sentences/examples (not generic)
5. Include clear explanations that teach the grammar rule
6. DIFFICULTY PROGRESSION (very important):
   - Questions 1-5: "beginner" difficulty (simple, basic concepts)
   - Questions 6-10: "intermediate" difficulty (more complex)
   - Questions 11-15: "intermediate" or "advanced" difficulty (challenging)
7. Use the format: "Choose/Select/Complete: [Spanish sentence with blank] ([word in parentheses])"
8. Make questions practical and realistic with varied vocabulary
9. **ABSOLUTELY CRITICAL**: First write 4 DIFFERENT options, THEN copy one of those EXACT options (character-for-character, including all accents) as the "correct_answer". The "correct_answer" MUST be IDENTICAL to one of the options.
10. Each question needs a unique id like "${topic.slug}_p1", "${topic.slug}_p2", etc.
11. Use "type": "multiple_choice" for all questions
12. Double-check that every "correct_answer" appears EXACTLY in the "options" array
13. Vary the sentence topics (family, school, hobbies, travel, food, etc.) to keep it interesting
14. **VERIFY**: Before finalizing each question, check that all 4 options are different words/phrases
15. **DO NOT UNDER ANY CIRCUMSTANCES** include the same word or phrase twice in the "options" array for a single question. If you are tempted to repeat an option, create a SYNONYM or a grammatically INCORRECT BUT PLAUSIBLE DISTRACTOR instead.

VALIDATION CHECKLIST (verify before returning):
- [ ] Exactly 15 questions
- [ ] Each question has exactly 4 UNIQUE options (no duplicates!)
- [ ] Each correct_answer is EXACTLY one of the 4 options (copy-paste, don't retype)
- [ ] All Spanish words have proper accents where needed
- [ ] Each question has: id, type, question, options, correct_answer, explanation, difficulty
- [ ] Questions 1-5 have "difficulty": "beginner"
- [ ] Questions 6-10 have "difficulty": "intermediate"
- [ ] Questions 11-15 have "difficulty": "intermediate" or "advanced"
- [ ] NO duplicate options within any single question

Return ONLY a valid JSON object with this exact structure: {"questions": [array of exactly 15 question objects]}. Do not use markdown code blocks.`;

  try {
    // Use moderate penalties to combat repetition without breaking JSON
    // Start at 0.3, increase slightly on retries (max 0.7 to avoid breaking JSON)
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
          content: 'You are an expert Spanish language teacher. You must respond with valid JSON only. The response must be a JSON object with a "questions" array containing exactly 30 question objects. NEVER repeat the same option twice in a single question.',
        },
        {
          role: 'user',
          content: prompt + '\n\nIMPORTANT: Return a JSON object with this structure: {"questions": [... array of 15 questions ...]}',
        },
      ],
      temperature: 0.7,
      max_tokens: 6000, // Sufficient for 15 questions
      response_format: { type: "json_object" }, // Force JSON output
      // Anti-repetition parameters (CRITICAL for avoiding duplicate options)
      presence_penalty: presencePenalty,  // Punish tokens that have already appeared
      frequency_penalty: frequencyPenalty, // Punish tokens based on frequency
    });

    const responseText = completion.choices[0].message.content?.trim() || '';

    // Remove markdown code blocks if present
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

    // Handle both array format and object format
    let questions;
    if (Array.isArray(parsedResponse)) {
      questions = parsedResponse;
    } else if (parsedResponse.questions && Array.isArray(parsedResponse.questions)) {
      questions = parsedResponse.questions;
    } else {
      throw new Error(`Response is not in expected format. Got: ${JSON.stringify(Object.keys(parsedResponse))}`);
    }

    if (!Array.isArray(questions) || questions.length !== 15) {
      throw new Error(`Expected 15 questions, got ${questions.length}`);
    }

    // Validate and fix each question
    questions.forEach((q, index) => {
      if (!q.question || !q.options || !q.correct_answer || !q.explanation) {
        throw new Error(`Question ${index + 1} is missing required fields`);
      }
      if (!Array.isArray(q.options) || q.options.length !== 4) {
        throw new Error(`Question ${index + 1} must have exactly 4 options`);
      }

      // Trim all options and correct_answer to avoid whitespace issues
      q.options = q.options.map((opt: string) => opt.trim());
      q.correct_answer = q.correct_answer.trim();

      // Check for duplicate options (CRITICAL ERROR)
      const uniqueOptions = new Set(q.options);
      if (uniqueOptions.size !== q.options.length) {
        const duplicates = q.options.filter((opt: string, idx: number) => q.options.indexOf(opt) !== idx);
        console.error(`❌ Question ${index + 1} failed: "${q.question}"`);
        console.error(`   Options: ${JSON.stringify(q.options)}`);
        console.error(`   Duplicates: ${JSON.stringify(duplicates)}`);
        throw new Error(`Question ${index + 1}: Duplicate options found: ${JSON.stringify(duplicates)}. All 4 options must be unique!`);
      }

      // Check if correct_answer matches any option (case-sensitive)
      if (!q.options.includes(q.correct_answer)) {
        // Try to find a close match (case-insensitive)
        const closeMatch = q.options.find((opt: string) =>
          opt.toLowerCase() === q.correct_answer.toLowerCase()
        );

        if (closeMatch) {
          console.log(`⚠️  Question ${index + 1}: Fixed case mismatch - "${q.correct_answer}" → "${closeMatch}"`);
          q.correct_answer = closeMatch;
        } else {
          // If no match found, use the first option as a fallback and log warning
          console.warn(`⚠️  Question ${index + 1}: correct_answer "${q.correct_answer}" not in options: ${JSON.stringify(q.options)}`);
          console.warn(`    Using first option "${q.options[0]}" as fallback`);
          q.correct_answer = q.options[0];
        }
      }

      // Enforce difficulty progression based on question index (CRITICAL REQUIREMENT)
      const actualDifficulty = q.difficulty?.toLowerCase().trim();
      let enforcedDifficulty: string;

      if (index < 5) {
        // Questions 1-5: Must be beginner
        enforcedDifficulty = 'beginner';
      } else if (index < 10) {
        // Questions 6-10: Must be intermediate
        enforcedDifficulty = 'intermediate';
      } else {
        // Questions 11-15: Accept intermediate or advanced, default to intermediate
        if (actualDifficulty === 'advanced') {
          enforcedDifficulty = 'advanced';
        } else {
          enforcedDifficulty = 'intermediate';
        }
      }

      // Log if the LLM deviated from the expected range rule
      if (actualDifficulty !== enforcedDifficulty && index < 10) {
        console.warn(`⚠️  Question ${index + 1}: Difficulty mismatch. LLM gave "${actualDifficulty}", enforcing "${enforcedDifficulty}" based on index.`);
        q.difficulty = enforcedDifficulty;
      } else if (index >= 10 && actualDifficulty && actualDifficulty !== 'intermediate' && actualDifficulty !== 'advanced') {
        // Enforce only 'intermediate' or 'advanced' for the last 5
        console.warn(`⚠️  Question ${index + 1}: Invalid difficulty "${actualDifficulty}" for advanced range. Enforcing "intermediate".`);
        q.difficulty = 'intermediate';
      } else {
        // Use the actual difficulty if it was acceptable, otherwise use the enforced one
        q.difficulty = actualDifficulty || enforcedDifficulty;
      }
    });

    // Verify difficulty distribution
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
      estimated_duration: 15, // 15 questions at ~1 min each // 30 questions at ~1 min each
    };
  } catch (error) {
    console.error(`❌ Error generating content for ${topic.topic_name}:`, error);

    // Retry logic
    if (retryCount < maxRetries) {
      console.log(`🔄 Retrying in ${(retryCount + 1) * 2} seconds...`);
      await new Promise((resolve) => setTimeout(resolve, (retryCount + 1) * 2000));
      return generatePracticeContent(topic, quizQuestions, retryCount + 1);
    }

    throw error;
  }
}

async function updatePracticeContent(contentId: string, practiceContent: PracticeContent) {
  const { error } = await supabase
    .from('grammar_content')
    .update({
      content_data: practiceContent.content_data,
      updated_at: new Date().toISOString(),
    })
    .eq('id', contentId);

  if (error) {
    throw new Error(`Failed to update practice content: ${error.message}`);
  }

  console.log(`✅ Updated practice content in database`);
}

async function main() {
  console.log('🚀 Starting practice content generation...\n');

  // Parse command line arguments
  const args = process.argv.slice(2);
  const startFromIndex = args.includes('--continue')
    ? parseInt(args[args.indexOf('--continue') + 1] || '0')
    : 0;
  const limitCount = args.includes('--limit')
    ? parseInt(args[args.indexOf('--limit') + 1] || '0')
    : 0;
  const dryRun = args.includes('--dry-run');

  if (dryRun) {
    console.log('🔍 DRY RUN MODE - No database updates will be made\n');
  }

  // Get all topics with old practice format
  const { data: topicsData, error: topicsError } = await supabase
    .from('grammar_topics')
    .select(`
      id,
      category,
      slug,
      topic_name,
      difficulty_level,
      grammar_content!inner(
        id,
        content_type,
        content_data
      )
    `)
    .eq('language', 'es')
    .eq('grammar_content.content_type', 'practice');

  if (topicsError) {
    console.error('Error fetching topics:', topicsError);
    return;
  }

  // Filter topics with old format
  const topicsNeedingUpdate = topicsData.filter((topic: any) => {
    const practiceContent = topic.grammar_content.find((c: any) => c.content_type === 'practice');
    return practiceContent?.content_data?.exercises !== undefined;
  });

  console.log(`📊 Found ${topicsNeedingUpdate.length} topics needing practice content updates\n`);

  // Apply filters
  let topicsToProcess = topicsNeedingUpdate;
  if (startFromIndex > 0) {
    topicsToProcess = topicsToProcess.slice(startFromIndex);
    console.log(`⏭️  Starting from index ${startFromIndex}\n`);
  }
  if (limitCount > 0) {
    topicsToProcess = topicsToProcess.slice(0, limitCount);
    console.log(`🔢 Processing ${limitCount} topics\n`);
  }

  let successCount = 0;
  let errorCount = 0;
  let processedCount = 0;

  for (const topicData of topicsToProcess) {
    processedCount++;
    try {
      const topic: Topic = {
        id: topicData.id,
        category: topicData.category,
        slug: topicData.slug,
        topic_name: topicData.topic_name,
        difficulty_level: topicData.difficulty_level,
      };

      // Get quiz questions for reference
      const { data: quizContent } = await supabase
        .from('grammar_content')
        .select('content_data')
        .eq('topic_id', topic.id)
        .eq('content_type', 'quiz')
        .single();

      const quizQuestions = quizContent?.content_data?.questions || [];

      // Get practice content ID
      const practiceContent = topicData.grammar_content.find((c: any) => c.content_type === 'practice');
      
      if (!practiceContent) {
        console.log(`⚠️  No practice content found for ${topic.topic_name}, skipping...`);
        continue;
      }

      // Generate new practice content
      const newPracticeContent = await generatePracticeContent(topic, quizQuestions);

      // Update in database (unless dry run)
      if (!dryRun) {
        await updatePracticeContent(practiceContent.id, newPracticeContent);
      } else {
        console.log(`🔍 DRY RUN: Would update practice content in database`);
      }

      successCount++;
      const overallIndex = startFromIndex + processedCount;
      console.log(`✅ [${processedCount}/${topicsToProcess.length}] (Overall: ${overallIndex}/${topicsNeedingUpdate.length}) Completed: ${topic.topic_name}\n`);

      // Rate limiting: wait 2 seconds between API calls
      await new Promise((resolve) => setTimeout(resolve, 2000));
    } catch (error) {
      errorCount++;
      const overallIndex = startFromIndex + processedCount;
      console.error(`❌ [${processedCount}/${topicsToProcess.length}] (Overall: ${overallIndex}/${topicsNeedingUpdate.length}) Failed to process ${topicData.topic_name}:`, error);
      console.log('');
    }
  }

  console.log('\n🎉 Practice content generation complete!');
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
  console.log(`📊 Total processed: ${processedCount}/${topicsToProcess.length}`);

  if (errorCount > 0 && processedCount < topicsNeedingUpdate.length) {
    const nextIndex = startFromIndex + processedCount;
    console.log(`\n💡 To continue from where you left off, run:`);
    console.log(`   npx tsx scripts/generate-practice-content.ts --continue ${nextIndex}`);
  }
}

main().catch(console.error);

