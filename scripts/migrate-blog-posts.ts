/**
 * Migration script to transfer hardcoded blog posts to the database
 * Run with: npx tsx scripts/migrate-blog-posts.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Initialize Supabase client with service role key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Blog post metadata mapping
const blogPostsMetadata = [
  {
    slug: 'aqa-gcse-speaking-photocard-guide',
    title: 'AQA GCSE Speaking: Complete Photocard Guide',
    excerpt: 'Master the AQA GCSE Speaking exam photocard task with our comprehensive guide. Learn scoring criteria, strategies, and common pitfalls for exam success.',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-09-27',
    readingTime: 12,
    colorScheme: 'blue',
    iconName: 'Camera',
    tags: ['AQA GCSE', 'Speaking Exam', 'Photocard Task', 'Language Learning'],
    keywords: ['AQA GCSE Speaking', 'photocard task', 'GCSE Spanish speaking', 'GCSE French speaking', 'GCSE German speaking', 'exam preparation', 'speaking assessment', 'GCSE revision'],
    seoTitle: 'AQA GCSE Speaking: Complete Photocard Guide | LanguageGems',
    seoDescription: 'Master the AQA GCSE Speaking exam photocard task with our comprehensive guide. Learn scoring criteria, strategies, and common pitfalls for exam success.',
  },
  {
    slug: 'best-vocabulary-learning-techniques-gcse',
    title: 'The 7 Best Vocabulary Learning Techniques for GCSE Success (2024)',
    excerpt: 'Discover scientifically-proven vocabulary learning techniques that help GCSE students retain 40% more words. Includes spaced repetition, active recall, and gamification strategies.',
    category: 'Study Tips',
    author: 'Daniel Etienne',
    publishDate: '2024-01-15',
    readingTime: 8,
    colorScheme: 'purple',
    iconName: 'Brain',
    tags: ['Vocabulary Learning', 'Study Tips', 'GCSE', 'Memory Techniques'],
    keywords: ['vocabulary learning', 'GCSE study tips', 'spaced repetition', 'active recall', 'memory techniques'],
    seoTitle: 'The 7 Best Vocabulary Learning Techniques for GCSE Success',
    seoDescription: 'Discover scientifically-proven vocabulary learning techniques that help GCSE students retain 40% more words.',
  },
  {
    slug: 'gamification-language-learning-classroom',
    title: 'How Gamification Transforms Language Learning in the Classroom',
    excerpt: 'Explore how gamification increases student engagement by 90% and improves vocabulary retention. Practical strategies for MFL teachers to implement game-based learning.',
    category: 'Teaching Strategies',
    author: 'Daniel Etienne',
    publishDate: '2024-01-20',
    readingTime: 10,
    colorScheme: 'green',
    iconName: 'Gamepad2',
    tags: ['Gamification', 'Teaching Strategies', 'Student Engagement', 'MFL'],
    keywords: ['gamification', 'language learning', 'classroom strategies', 'student engagement', 'game-based learning'],
    seoTitle: 'How Gamification Transforms Language Learning in the Classroom',
    seoDescription: 'Explore how gamification increases student engagement by 90% and improves vocabulary retention.',
  },
  {
    slug: 'complete-guide-gcse-spanish-vocabulary-themes',
    title: 'Complete Guide to GCSE Spanish Vocabulary Themes (AQA, Edexcel, OCR)',
    excerpt: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide. Includes 500+ essential words, exam tips, and practice strategies for all major exam boards.',
    category: 'Study Tips',
    author: 'Daniel Etienne',
    publishDate: '2024-01-25',
    readingTime: 12,
    colorScheme: 'orange',
    iconName: 'Target',
    tags: ['Spanish', 'GCSE', 'Vocabulary', 'Exam Boards'],
    keywords: ['GCSE Spanish', 'vocabulary themes', 'AQA', 'Edexcel', 'OCR', 'exam preparation'],
    seoTitle: 'Complete Guide to GCSE Spanish Vocabulary Themes',
    seoDescription: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide for AQA, Edexcel, and OCR.',
  },
  {
    slug: 'language-learning-apps-vs-educational-software',
    title: 'Language Learning Apps vs. Educational Software: What Schools Need to Know',
    excerpt: 'Compare consumer language apps like Duolingo with educational platforms designed for schools. Discover why curriculum alignment matters for educational success.',
    category: 'Educational Technology',
    author: 'Daniel Etienne',
    publishDate: '2024-01-30',
    readingTime: 9,
    colorScheme: 'indigo',
    iconName: 'BookOpen',
    tags: ['Educational Technology', 'Language Apps', 'Schools', 'Curriculum'],
    keywords: ['language learning apps', 'educational software', 'Duolingo', 'schools', 'curriculum alignment'],
    seoTitle: 'Language Learning Apps vs. Educational Software for Schools',
    seoDescription: 'Compare consumer language apps with educational platforms designed for schools.',
  },
  {
    slug: 'complete-guide-spaced-repetition-vocabulary-learning',
    title: 'The Complete Guide to Spaced Repetition for Vocabulary Learning',
    excerpt: 'Learn how spaced repetition can improve vocabulary retention by 200%. Includes implementation strategies and proven techniques for long-term memory.',
    category: 'Learning Science',
    author: 'Daniel Etienne',
    publishDate: '2024-02-05',
    readingTime: 11,
    colorScheme: 'purple',
    iconName: 'Brain',
    tags: ['Spaced Repetition', 'Memory', 'Vocabulary', 'Learning Science'],
    keywords: ['spaced repetition', 'vocabulary retention', 'memory techniques', 'learning science', 'SRS'],
    seoTitle: 'The Complete Guide to Spaced Repetition for Vocabulary Learning',
    seoDescription: 'Learn how spaced repetition can improve vocabulary retention by 200%.',
  },
  {
    slug: 'pronunciation-in-the-reading-aloud-task',
    title: 'Pronunciation in the Reading Aloud Task',
    excerpt: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-06-24',
    readingTime: 8,
    colorScheme: 'blue',
    iconName: 'Target',
    tags: ['Pronunciation', 'Reading Aloud', 'GCSE', 'Exam Tips'],
    keywords: ['pronunciation', 'reading aloud', 'GCSE speaking', 'major errors', 'minor errors'],
    seoTitle: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors',
    seoDescription: 'Understand the difference between major and minor pronunciation errors in GCSE reading aloud tasks.',
  },
  {
    slug: 'everything-you-need-to-know-about-the-new-aqa-speaking-exam',
    title: 'Everything You Need to Know About the New AQA Speaking Exam',
    excerpt: 'Understanding the New AQA Speaking Exam: What Students and Teachers Need to Know',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-06-24',
    readingTime: 10,
    colorScheme: 'blue',
    iconName: 'BookOpen',
    tags: ['AQA', 'Speaking Exam', 'GCSE', 'Exam Changes'],
    keywords: ['AQA speaking exam', 'new format', 'GCSE changes', 'exam preparation', 'speaking assessment'],
    seoTitle: 'Everything You Need to Know About the New AQA Speaking Exam',
    seoDescription: 'Complete guide to the new AQA GCSE Speaking exam format for students and teachers.',
  },
  {
    slug: 'ser-vs-estar-ultimate-guide-students',
    title: 'Ser vs Estar: The Ultimate Guide for Students',
    excerpt: 'Master the most challenging Spanish grammar concept with this comprehensive guide. Learn when to use ser vs estar with clear rules, examples, and practice exercises.',
    category: 'Spanish Grammar',
    author: 'LanguageGems Team',
    publishDate: '2024-03-10',
    readingTime: 15,
    colorScheme: 'orange',
    iconName: 'Languages',
    tags: ['Spanish', 'Grammar', 'Ser vs Estar', 'Language Learning'],
    keywords: ['ser vs estar', 'Spanish grammar', 'Spanish verbs', 'language learning', 'grammar guide'],
    seoTitle: 'Ser vs Estar: The Ultimate Guide for Spanish Students',
    seoDescription: 'Master ser vs estar with clear rules, examples, and practice exercises.',
  },
  {
    slug: 'german-cases-explained-simple-guide',
    title: 'German Cases Explained: Simple Guide for English Speakers',
    excerpt: 'Demystify German cases with this authoritative guide. Learn nominative, accusative, dative, and genitive cases with practical examples and memory techniques.',
    category: 'German Grammar',
    author: 'LanguageGems Team',
    publishDate: '2024-03-15',
    readingTime: 18,
    colorScheme: 'red',
    iconName: 'Languages',
    tags: ['German', 'Grammar', 'Cases', 'Language Learning'],
    keywords: ['German cases', 'nominative', 'accusative', 'dative', 'genitive', 'German grammar'],
    seoTitle: 'German Cases Explained: Simple Guide for English Speakers',
    seoDescription: 'Demystify German cases with practical examples and memory techniques.',
  },
  {
    slug: 'gcse-spanish-speaking-exam-tips',
    title: 'GCSE Spanish Speaking Exam Tips',
    excerpt: 'Essential tips and strategies for excelling in your GCSE Spanish speaking exam.',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-02-20',
    readingTime: 10,
    colorScheme: 'orange',
    iconName: 'MessageCircle',
    tags: ['Spanish', 'Speaking Exam', 'GCSE', 'Exam Tips'],
    keywords: ['GCSE Spanish speaking', 'exam tips', 'speaking strategies', 'oral exam'],
    seoTitle: 'GCSE Spanish Speaking Exam Tips | LanguageGems',
    seoDescription: 'Essential tips and strategies for excelling in your GCSE Spanish speaking exam.',
  },
  {
    slug: 'gcse-german-writing-exam-tips',
    title: 'GCSE German Writing Exam Tips',
    excerpt: 'Master the GCSE German writing exam with expert tips and strategies.',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-02-25',
    readingTime: 12,
    colorScheme: 'red',
    iconName: 'PenTool',
    tags: ['German', 'Writing Exam', 'GCSE', 'Exam Tips'],
    keywords: ['GCSE German writing', 'exam tips', 'writing strategies', 'German exam'],
    seoTitle: 'GCSE German Writing Exam Tips | LanguageGems',
    seoDescription: 'Master the GCSE German writing exam with expert tips and strategies.',
  },
  {
    slug: 'imparfait-vs-passe-compose-simple-guide',
    title: 'Imparfait vs Passé Composé: Simple Guide',
    excerpt: 'Understand the difference between imparfait and passé composé in French with clear examples.',
    category: 'French Grammar',
    author: 'LanguageGems Team',
    publishDate: '2024-03-20',
    readingTime: 14,
    colorScheme: 'blue',
    iconName: 'Languages',
    tags: ['French', 'Grammar', 'Past Tenses', 'Language Learning'],
    keywords: ['imparfait', 'passé composé', 'French grammar', 'past tenses', 'French verbs'],
    seoTitle: 'Imparfait vs Passé Composé: Simple Guide for French Students',
    seoDescription: 'Master French past tenses with clear explanations and examples.',
  },
  {
    slug: 'jouer-a-vs-jouer-de-explained',
    title: 'Jouer à vs Jouer de Explained',
    excerpt: 'Learn when to use jouer à and jouer de in French with simple rules and examples.',
    category: 'French Grammar',
    author: 'LanguageGems Team',
    publishDate: '2024-03-25',
    readingTime: 8,
    colorScheme: 'blue',
    iconName: 'Music',
    tags: ['French', 'Grammar', 'Verbs', 'Language Learning'],
    keywords: ['jouer à', 'jouer de', 'French grammar', 'French verbs', 'prepositions'],
    seoTitle: 'Jouer à vs Jouer de: Complete French Grammar Guide',
    seoDescription: 'Master the difference between jouer à and jouer de in French.',
  },
  {
    slug: 'por-vs-para-guide',
    title: 'Por vs Para: The Complete Guide',
    excerpt: 'Master the tricky Spanish prepositions por and para with clear rules and examples.',
    category: 'Spanish Grammar',
    author: 'LanguageGems Team',
    publishDate: '2024-04-01',
    readingTime: 16,
    colorScheme: 'orange',
    iconName: 'Languages',
    tags: ['Spanish', 'Grammar', 'Prepositions', 'Language Learning'],
    keywords: ['por vs para', 'Spanish grammar', 'Spanish prepositions', 'language learning'],
    seoTitle: 'Por vs Para: The Complete Spanish Grammar Guide',
    seoDescription: 'Master por and para with clear rules, examples, and practice exercises.',
  },
  {
    slug: 'german-movies-tv-shows-listening-skills',
    title: 'German Movies & TV Shows for Listening Skills',
    excerpt: 'Improve your German listening skills with these engaging movies and TV shows.',
    category: 'Learning Resources',
    author: 'LanguageGems Team',
    publishDate: '2024-04-10',
    readingTime: 10,
    colorScheme: 'red',
    iconName: 'Film',
    tags: ['German', 'Listening Skills', 'Movies', 'TV Shows'],
    keywords: ['German movies', 'German TV shows', 'listening skills', 'language learning'],
    seoTitle: 'Best German Movies & TV Shows for Learning German',
    seoDescription: 'Improve your German listening skills with these engaging movies and TV shows.',
  },
  {
    slug: 'science-of-gamification-language-learning',
    title: 'The Science of Gamification in Language Learning',
    excerpt: 'Discover the research-backed benefits of gamification for language acquisition.',
    category: 'Learning Science',
    author: 'Daniel Etienne',
    publishDate: '2024-04-15',
    readingTime: 13,
    colorScheme: 'green',
    iconName: 'Gamepad2',
    tags: ['Gamification', 'Learning Science', 'Research', 'Language Learning'],
    keywords: ['gamification', 'language learning', 'learning science', 'educational research'],
    seoTitle: 'The Science of Gamification in Language Learning',
    seoDescription: 'Research-backed benefits of gamification for language acquisition.',
  },
  {
    slug: 'spaced-repetition-vs-cramming',
    title: 'Spaced Repetition vs Cramming',
    excerpt: 'Why spaced repetition beats cramming for long-term vocabulary retention.',
    category: 'Learning Science',
    author: 'Daniel Etienne',
    publishDate: '2024-04-20',
    readingTime: 9,
    colorScheme: 'purple',
    iconName: 'Brain',
    tags: ['Spaced Repetition', 'Study Techniques', 'Memory', 'Learning Science'],
    keywords: ['spaced repetition', 'cramming', 'study techniques', 'memory retention'],
    seoTitle: 'Spaced Repetition vs Cramming: Which is Better?',
    seoDescription: 'Discover why spaced repetition beats cramming for vocabulary learning.',
  },
  {
    slug: 'spanish-90-word-response-tonics-formula',
    title: 'Spanish 90-Word Response: The TONICS Formula',
    excerpt: 'Master the GCSE Spanish 90-word writing task with the proven TONICS formula.',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-05-01',
    readingTime: 11,
    colorScheme: 'orange',
    iconName: 'PenTool',
    tags: ['Spanish', 'Writing', 'GCSE', 'Exam Strategy'],
    keywords: ['Spanish writing', '90-word response', 'TONICS formula', 'GCSE exam'],
    seoTitle: 'Spanish 90-Word Response: The TONICS Formula',
    seoDescription: 'Master the GCSE Spanish 90-word writing task with the TONICS formula.',
  },
  {
    slug: 'top-tips-gcse-writing-six-pillars',
    title: 'Top Tips for GCSE Writing: The Six Pillars',
    excerpt: 'Achieve top marks in GCSE language writing with these six essential pillars.',
    category: 'Exam Preparation',
    author: 'LanguageGems Team',
    publishDate: '2024-05-10',
    readingTime: 14,
    colorScheme: 'indigo',
    iconName: 'Award',
    tags: ['GCSE', 'Writing', 'Exam Tips', 'Study Strategy'],
    keywords: ['GCSE writing', 'exam tips', 'writing strategy', 'top marks'],
    seoTitle: 'Top Tips for GCSE Writing: The Six Pillars of Success',
    seoDescription: 'Achieve top marks in GCSE language writing with these six essential pillars.',
  },
  {
    slug: 'ks3-french-word-blast-game-better-than-flashcards',
    title: 'KS3 French Word Blast Game: Better Than Flashcards?',
    excerpt: 'Discover why Word Blast games are more effective than traditional flashcards for KS3 French.',
    category: 'Teaching Strategies',
    author: 'Daniel Etienne',
    publishDate: '2024-05-15',
    readingTime: 7,
    colorScheme: 'blue',
    iconName: 'Zap',
    tags: ['KS3', 'French', 'Word Games', 'Teaching Strategies'],
    keywords: ['KS3 French', 'word blast', 'flashcards', 'vocabulary games'],
    seoTitle: 'KS3 French Word Blast Game: Better Than Flashcards?',
    seoDescription: 'Why Word Blast games are more effective than flashcards for KS3 French.',
  },
];

async function extractContentFromFile(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), 'src', 'app', 'blog', slug, 'page.tsx');
  
  if (!fs.existsSync(filePath)) {
    console.warn(`⚠️  File not found: ${filePath}`);
    return '<p>Content to be migrated...</p>';
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  
  // Extract the JSX content between the return statement
  // This is a simplified extraction - we'll get the main content sections
  const contentMatch = fileContent.match(/return \(([\s\S]*?)\);?\s*}\s*$/);
  
  if (!contentMatch) {
    console.warn(`⚠️  Could not extract content from ${slug}`);
    return '<p>Content to be migrated...</p>';
  }

  // For now, return a placeholder - we'll manually review and update content
  return `<div class="blog-content">
    <p><strong>Note:</strong> This post has been migrated from a static page. Content is being updated.</p>
    <p>Original file: src/app/blog/${slug}/page.tsx</p>
  </div>`;
}

async function migrateBlogPosts() {
  console.log('🚀 Starting blog post migration...\n');

  let successCount = 0;
  let errorCount = 0;

  for (const post of blogPostsMetadata) {
    try {
      console.log(`📝 Migrating: ${post.title}`);

      // Check if post already exists
      const { data: existing } = await supabase
        .from('blog_posts')
        .select('id')
        .eq('slug', post.slug)
        .maybeSingle();

      if (existing) {
        console.log(`   ⏭️  Skipping (already exists): ${post.slug}\n`);
        continue;
      }

      // Extract content from file
      const content = await extractContentFromFile(post.slug);

      // Insert into database
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: post.title,
          slug: post.slug,
          content: content,
          excerpt: post.excerpt,
          author: post.author,
          category: post.category,
          tags: post.tags,
          keywords: post.keywords,
          color_scheme: post.colorScheme,
          icon_name: post.iconName,
          reading_time_minutes: post.readingTime,
          seo_title: post.seoTitle,
          seo_description: post.seoDescription,
          is_published: true,
          status: 'published',
          publish_date: new Date(post.publishDate).toISOString(),
          created_at: new Date(post.publishDate).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select();

      if (error) {
        console.error(`   ❌ Error: ${error.message}\n`);
        errorCount++;
      } else {
        console.log(`   ✅ Success: ${post.slug}\n`);
        successCount++;
      }
    } catch (err) {
      console.error(`   ❌ Exception: ${err}\n`);
      errorCount++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`✅ Successfully migrated: ${successCount} posts`);
  console.log(`❌ Failed: ${errorCount} posts`);
  console.log('='.repeat(50));
}

// Run migration
migrateBlogPosts()
  .then(() => {
    console.log('\n✨ Migration complete!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('\n💥 Migration failed:', err);
    process.exit(1);
  });

