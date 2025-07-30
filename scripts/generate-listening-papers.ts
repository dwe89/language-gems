#!/usr/bin/env tsx

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Language configurations
const languages = [
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'de', name: 'German' }
];

const tiers = [
  { level: 'foundation', timeLimit: 35 },
  { level: 'higher', timeLimit: 45 }
];

interface ExistingPaper {
  identifier: string;
  paperNumber: number;
}

/**
 * Get existing papers for a language and tier
 */
async function getExistingPapers(language: string, level: string): Promise<ExistingPaper[]> {
  const { data, error } = await supabase
    .from('aqa_listening_assessments')
    .select('identifier')
    .eq('language', language)
    .eq('level', level)
    .eq('is_active', true);

  if (error) {
    console.error('Error fetching existing papers:', error);
    return [];
  }

  return data.map(paper => ({
    identifier: paper.identifier,
    paperNumber: parseInt(paper.identifier.replace('paper-', '')) || 1
  })).sort((a, b) => a.paperNumber - b.paperNumber);
}

/**
 * Get the next paper number for a language and tier
 */
function getNextPaperNumber(existingPapers: ExistingPaper[]): number {
  if (existingPapers.length === 0) {
    return 1;
  }
  
  const maxPaper = Math.max(...existingPapers.map(p => p.paperNumber));
  return maxPaper + 1;
}

/**
 * Create variations of question content for different papers
 */
function createQuestionVariations(baseQuestions: any[], paperNumber: number): any[] {
  return baseQuestions.map(question => {
    const variation = { ...question };
    
    // Create variations based on question type and paper number
    switch (question.question_type) {
      case 'multiple-choice':
        // Shuffle options for different papers
        if (variation.question_data?.questions) {
          variation.question_data.questions = variation.question_data.questions.map((q: any) => {
            if (q.options && paperNumber > 1) {
              const shuffledOptions = [...q.options];
              // Simple shuffle based on paper number
              for (let i = 0; i < paperNumber - 1; i++) {
                shuffledOptions.push(shuffledOptions.shift());
              }
              return { ...q, options: shuffledOptions };
            }
            return q;
          });
        }
        break;
        
      case 'letter-matching':
        // Shuffle options for different papers
        if (variation.question_data?.options && paperNumber > 1) {
          const shuffledOptions = [...variation.question_data.options];
          for (let i = 0; i < paperNumber - 1; i++) {
            shuffledOptions.push(shuffledOptions.shift());
          }
          variation.question_data.options = shuffledOptions;
        }
        break;
        
      case 'dictation':
        // Vary the sentences slightly for different papers
        if (variation.question_data?.sentences && paperNumber > 1) {
          variation.title = `${variation.title} - Variación ${paperNumber}`;
        }
        break;
        
      default:
        // For other question types, add paper variation to title
        if (paperNumber > 1) {
          variation.title = `${variation.title} - Paper ${paperNumber}`;
        }
    }
    
    return variation;
  });
}

/**
 * Generate a new paper for a specific language and tier
 */
async function generatePaper(language: string, tier: any, paperNumber: number): Promise<boolean> {
  try {
    console.log(`📄 Generating ${language} ${tier.level} paper-${paperNumber}...`);

    // Get the base questions from paper-1
    const { data: baseAssessment, error: assessmentError } = await supabase
      .from('aqa_listening_assessments')
      .select('id')
      .eq('language', language)
      .eq('level', tier.level)
      .eq('identifier', 'paper-1')
      .single();

    if (assessmentError || !baseAssessment) {
      console.error(`❌ Could not find base assessment for ${language} ${tier.level}`);
      return false;
    }

    const { data: baseQuestions, error: questionsError } = await supabase
      .from('aqa_listening_questions')
      .select('*')
      .eq('assessment_id', baseAssessment.id)
      .order('question_number');

    if (questionsError || !baseQuestions) {
      console.error(`❌ Could not fetch base questions for ${language} ${tier.level}`);
      return false;
    }

    // Create new assessment
    const newAssessment = {
      title: `AQA Listening Assessment - ${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} Paper ${paperNumber} (${languages.find(l => l.code === language)?.name})`,
      description: `${tier.level.charAt(0).toUpperCase() + tier.level.slice(1)} level AQA-style listening assessment with audio generated by Gemini TTS - Paper ${paperNumber}`,
      level: tier.level,
      language: language,
      identifier: `paper-${paperNumber}`,
      version: '1.0',
      total_questions: baseQuestions.length,
      time_limit_minutes: tier.timeLimit,
      is_active: true
    };

    const { data: assessmentData, error: newAssessmentError } = await supabase
      .from('aqa_listening_assessments')
      .insert(newAssessment)
      .select('id')
      .single();

    if (newAssessmentError) {
      console.error(`❌ Error creating new assessment:`, newAssessmentError);
      return false;
    }

    console.log(`✅ Created assessment: ${assessmentData.id}`);

    // Create question variations
    const questionVariations = createQuestionVariations(baseQuestions, paperNumber);
    
    // Prepare questions for insertion
    const newQuestions = questionVariations.map(q => ({
      assessment_id: assessmentData.id,
      question_number: q.question_number,
      sub_question_number: q.sub_question_number,
      question_type: q.question_type,
      title: q.title,
      instructions: q.instructions,
      audio_text: q.audio_text,
      audio_url: null, // Will be generated on demand
      audio_transcript: q.audio_transcript,
      question_data: q.question_data,
      marks: q.marks,
      theme: q.theme,
      topic: q.topic,
      tts_config: q.tts_config,
      difficulty_rating: q.difficulty_rating
    }));

    const { error: insertQuestionsError } = await supabase
      .from('aqa_listening_questions')
      .insert(newQuestions);

    if (insertQuestionsError) {
      console.error(`❌ Error inserting questions:`, insertQuestionsError);
      return false;
    }

    console.log(`✅ Inserted ${newQuestions.length} questions for paper-${paperNumber}`);
    return true;

  } catch (error) {
    console.error(`❌ Error generating paper:`, error);
    return false;
  }
}

/**
 * Main function to generate papers
 */
async function generateListeningPapers(targetPapers: number = 3) {
  try {
    console.log(`🎧 Generating AQA Listening Assessment Papers (target: ${targetPapers} papers per language/tier)...\n`);

    let totalGenerated = 0;
    let totalSkipped = 0;

    for (const lang of languages) {
      for (const tier of tiers) {
        console.log(`\n📚 Processing ${lang.name} ${tier.level}...`);
        
        // Get existing papers
        const existingPapers = await getExistingPapers(lang.code, tier.level);
        console.log(`📋 Found ${existingPapers.length} existing papers: ${existingPapers.map(p => p.identifier).join(', ')}`);

        // Generate missing papers up to target
        for (let paperNum = 1; paperNum <= targetPapers; paperNum++) {
          const paperExists = existingPapers.some(p => p.paperNumber === paperNum);
          
          if (paperExists) {
            console.log(`⏭️  Paper ${paperNum} already exists, skipping`);
            totalSkipped++;
            continue;
          }

          const success = await generatePaper(lang.code, tier, paperNum);
          if (success) {
            totalGenerated++;
            console.log(`✅ Generated paper-${paperNum} for ${lang.name} ${tier.level}`);
          } else {
            console.log(`❌ Failed to generate paper-${paperNum} for ${lang.name} ${tier.level}`);
          }

          // Small delay to avoid overwhelming the database
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
    }

    console.log('\n🎉 Paper generation completed!');
    console.log(`📊 Summary:`);
    console.log(`- Papers generated: ${totalGenerated}`);
    console.log(`- Papers skipped (already exist): ${totalSkipped}`);
    console.log(`- Target papers per language/tier: ${targetPapers}`);
    console.log(`- Total possible papers: ${languages.length * tiers.length * targetPapers}`);

  } catch (error) {
    console.error('❌ Error in paper generation:', error);
  }
}

// Command line interface
if (require.main === module) {
  const targetPapers = parseInt(process.argv[2]) || 3;
  
  console.log(`🚀 Starting paper generation with target: ${targetPapers} papers per language/tier combination`);
  
  generateListeningPapers(targetPapers).then(() => {
    console.log('\n✨ Script completed');
    process.exit(0);
  }).catch((error) => {
    console.error('❌ Script failed:', error);
    process.exit(1);
  });
}

export { generateListeningPapers };
