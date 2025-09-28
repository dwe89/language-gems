// Import script for Spanish grammar content from CSV
import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface CSVRow {
  topic_id: string;
  slug: string;
  title: string;
  category: string;
  practice_status: string;
  quiz_status: string;
  content_type: 'practice' | 'quiz';
  exercise_type?: string;
  exercise_instructions?: string;
  prompt_sentence?: string;
  prompt_answer?: string;
  prompt_explanation?: string;
  prompt_options?: string;
  question_text?: string;
  question_correct_answer?: string;
  question_options?: string;
  question_explanation?: string;
  question_difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

function parseCSV(csvContent: string): CSVRow[] {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',');
  const rows: CSVRow[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const values = line.split(',');
    const row: any = {};

    headers.forEach((header, index) => {
      row[header.trim()] = values[index]?.trim() || '';
    });

    rows.push(row as CSVRow);
  }

  return rows;
}

function groupRowsByTopicAndType(rows: CSVRow[]): Map<string, { practice: CSVRow[], quiz: CSVRow[] }> {
  const grouped = new Map();

  rows.forEach(row => {
    const key = `${row.topic_id}-${row.slug}`;
    if (!grouped.has(key)) {
      grouped.set(key, { practice: [], quiz: [] });
    }

    if (row.content_type === 'practice') {
      grouped.get(key).practice.push(row);
    } else if (row.content_type === 'quiz') {
      grouped.get(key).quiz.push(row);
    }
  });

  return grouped;
}

function createPracticeContent(practiceRows: CSVRow[]) {
  const exercises = practiceRows.map(row => {
    const exercise: any = {
      type: row.exercise_type,
      instructions: row.exercise_instructions,
      prompts: [{
        sentence: row.prompt_sentence,
        answer: row.prompt_answer,
        explanation: row.prompt_explanation
      }]
    };

    if (row.prompt_options) {
      exercise.prompts[0].options = row.prompt_options.split('|');
    }

    return exercise;
  });

  return {
    exercises,
    practice_type: 'mixed_exercises',
    instructions: `Practice ${practiceRows[0]?.title?.toLowerCase()} with these interactive exercises.`,
    estimated_duration: 15
  };
}

function createQuizContent(quizRows: CSVRow[]) {
  const questions = quizRows.map(row => ({
    question_text: row.question_text,
    correct_answer: row.question_correct_answer,
    options: row.question_options?.split('|') || [],
    explanation: row.question_explanation,
    difficulty: row.question_difficulty || 'beginner'
  }));

  return {
    questions,
    quiz_type: 'mixed_assessment',
    time_limit: 1200,
    instructions: `Test your knowledge of ${quizRows[0]?.title?.toLowerCase()}.`,
    passing_score: 70,
    show_explanations: true,
    randomize_questions: true,
    max_attempts: 3
  };
}

async function importContent(csvFilePath: string) {
  console.log('🚀 Starting grammar content import...');

  // Read CSV file
  const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
  const rows = parseCSV(csvContent);
  
  console.log(`📊 Parsed ${rows.length} rows from CSV`);

  // Group by topic and content type
  const grouped = groupRowsByTopicAndType(rows);
  
  console.log(`📚 Found ${grouped.size} topics to process`);

  let successCount = 0;
  let errorCount = 0;

  for (const [key, content] of grouped) {
    const [topicId, slug] = key.split('-');
    
    try {
      // Process practice content
      if (content.practice.length > 0) {
        const practiceData = createPracticeContent(content.practice);
        
        // Delete existing practice content
        await supabase
          .from('grammar_content')
          .delete()
          .eq('topic_id', topicId)
          .eq('content_type', 'practice');

        // Insert new practice content
        const { error: practiceError } = await supabase
          .from('grammar_content')
          .insert({
            topic_id: topicId,
            slug: `${slug}-practice`,
            title: `${content.practice[0].title} Practice`,
            content_type: 'practice',
            content_data: practiceData,
            difficulty_level: 'intermediate',
            age_group: '11-14',
            estimated_duration: 15,
            is_active: true,
            order_position: 1
          });

        if (practiceError) {
          console.error(`❌ Error inserting practice content for ${slug}:`, practiceError);
          errorCount++;
        } else {
          console.log(`✅ Imported practice content for ${slug} (${content.practice.length} exercises)`);
          successCount++;
        }
      }

      // Process quiz content
      if (content.quiz.length > 0) {
        const quizData = createQuizContent(content.quiz);
        
        // Delete existing quiz content
        await supabase
          .from('grammar_content')
          .delete()
          .eq('topic_id', topicId)
          .eq('content_type', 'quiz');

        // Insert new quiz content
        const { error: quizError } = await supabase
          .from('grammar_content')
          .insert({
            topic_id: topicId,
            slug: `${slug}-quiz`,
            title: `${content.quiz[0].title} Quiz`,
            content_type: 'quiz',
            content_data: quizData,
            difficulty_level: 'intermediate',
            age_group: '11-14',
            estimated_duration: 10,
            is_active: true,
            order_position: 1
          });

        if (quizError) {
          console.error(`❌ Error inserting quiz content for ${slug}:`, quizError);
          errorCount++;
        } else {
          console.log(`✅ Imported quiz content for ${slug} (${content.quiz.length} questions)`);
          successCount++;
        }
      }

    } catch (error) {
      console.error(`❌ Error processing ${slug}:`, error);
      errorCount++;
    }
  }

  console.log('\n🎉 Import completed!');
  console.log(`✅ Successful imports: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Run the import
const csvPath = path.join(process.cwd(), 'spanish_grammar_content_template.csv');

if (process.argv.includes('--run')) {
  importContent(csvPath).catch(console.error);
} else {
  console.log('To run the import, use: npm run import-grammar-content --run');
  console.log('Make sure to fill out the CSV file first!');
}

export { importContent };
