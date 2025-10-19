import Link from 'next/link';
import { Clock, Calendar, Target, Users, Brain, BookOpen, Languages, Gamepad2, Film, MessageCircle, PenTool, Award, Zap, Music } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import Footer from '../../components/layout/Footer';
import { createClient } from '@/lib/supabase-server';
import BlogPageClient from '../../components/blog/BlogPageClient';
import BlogAdminButton from '../../components/admin/BlogAdminButton';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Language Learning Blog - GCSE Tips, Teaching Strategies & Educational Insights',
  description: 'Expert insights on GCSE language learning, vocabulary techniques, gamification strategies, and modern teaching methods. Written by experienced MFL educators.',
  keywords: 'language learning blog, GCSE language tips, MFL teaching strategies, vocabulary learning techniques, gamification education',
  openGraph: {
    title: 'Language Learning Blog - GCSE Tips & Teaching Strategies',
    description: 'Expert insights on GCSE language learning and modern teaching methods.',
    url: 'https://languagegems.com/blog',
    type: 'website',
  },
};

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  publish_date: string;
  scheduled_for: string | null;
  status: string;
  seo_title: string | null;
  seo_description: string | null;
  featured_image_url: string | null;
  reading_time_minutes: number;
}

// Static blog posts (hardcoded directories that still exist)
const staticBlogPosts = [
  {
    title: 'AQA GCSE Speaking: Complete Photocard Guide',
    excerpt: 'Master the AQA GCSE Speaking exam photocard task with our comprehensive guide. Learn scoring criteria, strategies, and common pitfalls for exam success.',
    slug: 'aqa-gcse-speaking-photocard-guide',
    category: 'Exam Preparation',
    readTime: '12 min read',
    publishDate: 'September 27, 2025',
    author: 'LanguageGems Team',
    icon: Target
  },
  {
    title: 'The 7 Best Vocabulary Learning Techniques for GCSE Success (2024)',
    excerpt: 'Discover scientifically-proven vocabulary learning techniques that help GCSE students retain 40% more words.',
    slug: 'best-vocabulary-learning-techniques-gcse',
    category: 'Study Tips',
    readTime: '8 min read',
    publishDate: 'January 15, 2024',
    author: 'Daniel Etienne',
    icon: Brain
  },
  {
    title: 'How Gamification Transforms Language Learning in the Classroom',
    excerpt: 'Explore how gamification increases student engagement by 90% and improves vocabulary retention.',
    slug: 'gamification-language-learning-classroom',
    category: 'Teaching Strategies',
    readTime: '10 min read',
    publishDate: 'January 20, 2024',
    author: 'Daniel Etienne',
    icon: Gamepad2
  },
  {
    title: 'Complete Guide to GCSE Spanish Vocabulary Themes (AQA, Edexcel, OCR)',
    excerpt: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide.',
    slug: 'complete-guide-gcse-spanish-vocabulary-themes',
    category: 'Study Tips',
    readTime: '12 min read',
    publishDate: 'January 25, 2024',
    author: 'Daniel Etienne',
    icon: Target
  },
  {
    title: 'Language Learning Apps vs. Educational Software: What Schools Need to Know',
    excerpt: 'Compare consumer language apps like Duolingo with educational platforms designed for schools.',
    slug: 'language-learning-apps-vs-educational-software',
    category: 'Educational Technology',
    readTime: '9 min read',
    publishDate: 'January 30, 2024',
    author: 'Daniel Etienne',
    icon: BookOpen
  },
  {
    title: 'The Complete Guide to Spaced Repetition for Vocabulary Learning',
    excerpt: 'Learn how spaced repetition can improve vocabulary retention by 200%.',
    slug: 'complete-guide-spaced-repetition-vocabulary-learning',
    category: 'Learning Science',
    readTime: '11 min read',
    publishDate: 'February 5, 2024',
    author: 'Daniel Etienne',
    icon: Brain
  },
  {
    title: 'Ser vs Estar: The Ultimate Guide for Students',
    excerpt: 'Master the most challenging Spanish grammar concept with this comprehensive guide.',
    slug: 'ser-vs-estar-ultimate-guide-students',
    category: 'Spanish Grammar',
    readTime: '15 min read',
    publishDate: 'March 10, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'German Cases Explained: Simple Guide for English Speakers',
    excerpt: 'Demystify German cases with this authoritative guide.',
    slug: 'german-cases-explained-simple-guide',
    category: 'German Grammar',
    readTime: '18 min read',
    publishDate: 'March 15, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'Imparfait vs Passé Composé: Simple Guide for GCSE Students',
    excerpt: 'Master French past tenses with this clear guide.',
    slug: 'imparfait-vs-passe-compose-simple-guide',
    category: 'French Grammar',
    readTime: '12 min read',
    publishDate: 'March 20, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'GCSE Spanish Speaking Exam Tips: Boost Your Grade',
    excerpt: 'Ace your GCSE Spanish speaking exam with proven strategies.',
    slug: 'gcse-spanish-speaking-exam-tips',
    category: 'Exam Preparation',
    readTime: '10 min read',
    publishDate: 'March 25, 2024',
    author: 'LanguageGems Team',
    icon: MessageCircle
  },
  {
    title: 'The Science of Gamification in Language Learning',
    excerpt: 'Discover how gamification transforms language learning through behavioral science.',
    slug: 'science-of-gamification-language-learning',
    category: 'Learning Science',
    readTime: '14 min read',
    publishDate: 'April 1, 2024',
    author: 'LanguageGems Team',
    icon: Gamepad2
  },
  {
    title: 'Spaced Repetition vs Cramming: What Works Best?',
    excerpt: 'Compare spaced repetition vs cramming with scientific evidence.',
    slug: 'spaced-repetition-vs-cramming',
    category: 'Study Tips',
    readTime: '11 min read',
    publishDate: 'April 5, 2024',
    author: 'LanguageGems Team',
    icon: Brain
  },
  {
    title: 'Por vs Para: Complete Guide for Spanish Learners',
    excerpt: 'Master por vs para with this comprehensive guide.',
    slug: 'por-vs-para-guide',
    category: 'Spanish Grammar',
    readTime: '13 min read',
    publishDate: 'April 10, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'Jouer à vs Jouer de: Explained Simply',
    excerpt: 'Clear up French preposition confusion with jouer à vs jouer de.',
    slug: 'jouer-a-vs-jouer-de-explained',
    category: 'French Grammar',
    readTime: '8 min read',
    publishDate: 'April 15, 2024',
    author: 'LanguageGems Team',
    icon: Music
  },
  {
    title: 'GCSE German Writing Exam Tips: Get Top Marks',
    excerpt: 'Master GCSE German writing with expert tips.',
    slug: 'gcse-german-writing-exam-tips',
    category: 'Exam Preparation',
    readTime: '12 min read',
    publishDate: 'April 20, 2024',
    author: 'LanguageGems Team',
    icon: PenTool
  },
  {
    title: 'KS3 French: Word Blast Game Better Than Flashcards',
    excerpt: 'Discover why interactive games like Word Blast outperform traditional flashcards.',
    slug: 'ks3-french-word-blast-game-better-than-flashcards',
    category: 'Teaching Strategies',
    readTime: '9 min read',
    publishDate: 'April 25, 2024',
    author: 'LanguageGems Team',
    icon: Zap
  },
  {
    title: 'German Movies & TV Shows for Listening Skills',
    excerpt: 'Build German listening skills with curated movies and TV shows.',
    slug: 'german-movies-tv-shows-listening-skills',
    category: 'Cultural Learning',
    readTime: '10 min read',
    publishDate: 'May 1, 2024',
    author: 'LanguageGems Team',
    icon: Film
  },
  {
    title: 'Spanish 90-Word Response: TONICS Formula',
    excerpt: 'Master the GCSE Spanish 90-word writing task with the TONICS formula.',
    slug: 'spanish-90-word-response-tonics-formula',
    category: 'Exam Preparation',
    readTime: '10 min read',
    publishDate: 'May 15, 2024',
    author: 'LanguageGems Team',
    icon: PenTool
  },
  {
    title: 'Pronunciation in the Reading Aloud Task',
    excerpt: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained',
    slug: 'pronunciation-in-the-reading-aloud-task',
    category: 'Exam Preparation',
    readTime: '8 min read',
    publishDate: 'June 24, 2025',
    author: 'LanguageGems Team',
    icon: Target
  },
  {
    title: 'Everything You Need to Know About the New AQA Speaking Exam',
    excerpt: 'Understanding the New AQA Speaking Exam: What Students and Teachers Need to Know',
    slug: 'everything-you-need-to-know-about-the-new-aqa-speaking-exam',
    category: 'Exam Preparation',
    readTime: '10 min read',
    publishDate: 'June 24, 2025',
    author: 'LanguageGems Team',
    icon: BookOpen
  },
  {
    title: 'Top Tips for GCSE Writing: The 6 Pillars Strategy',
    excerpt: 'Master GCSE language writing with The Six Pillars strategy.',
    slug: 'top-tips-gcse-writing-six-pillars',
    category: 'Exam Preparation',
    readTime: '15 min read',
    publishDate: 'October 8, 2025',
    author: 'Daniel Etienne',
    icon: Award
  }
];



const upcomingPosts = [
  {
    title: 'GCSE French Grammar Mastery: Complete Guide to Verb Conjugations',
    excerpt: 'Master French verb conjugations with our comprehensive guide covering all tenses, irregular verbs, and exam-specific tips for GCSE success.',
    category: 'GCSE Preparation',
    readTime: '14 min read',
    publishDate: 'Coming Soon',
    icon: Target
  },
  {
    title: 'Building Cultural Competence in Language Learning',
    excerpt: 'Explore how cultural understanding enhances language learning and discover practical strategies for integrating cultural content into GCSE preparation.',
    category: 'Teaching Strategies',
    readTime: '10 min read',
    publishDate: 'Coming Soon',
    icon: Users
  }
];

export default async function BlogPage() {
  const supabase = await createClient();

  // Check if current user is admin (server-side)
  const { data: { user } } = await supabase.auth.getUser();
  const isAdmin = user?.email === 'danieletienne89@gmail.com';

  // Fetch blog posts from database
  const now = new Date().toISOString();

  // Fetch published posts from database
  const { data: publishedPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('status', 'published')
    .order('publish_date', { ascending: false });

  // Fetch scheduled posts that should be visible
  const { data: scheduledPosts } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('is_published', true)
    .eq('status', 'scheduled')
    .lte('scheduled_for', now)
    .order('publish_date', { ascending: false });

  // Combine database posts
  const dbPosts = [...(publishedPosts || []), ...(scheduledPosts || [])];

  // Convert static posts to match BlogPost interface
  const staticPostsForDisplay = staticBlogPosts.map((post) => ({
    id: `static-${post.slug}`,
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    category: post.category,
    author: post.author,
    tags: [post.category],
    publish_date: post.publishDate,
    reading_time_minutes: parseInt(post.readTime) || 5,
    content: '',
    is_published: true,
    created_at: post.publishDate,
    updated_at: post.publishDate,
    scheduled_for: null,
    status: 'published',
    seo_title: post.title,
    seo_description: post.excerpt,
    featured_image_url: null,
    // Don't include icon - can't be serialized to client
  }));

  // Combine database posts and static posts
  const allPosts = [...dbPosts, ...staticPostsForDisplay];

  // Extract unique categories from all posts
  const categoryMap = new Map<string, number>();
  allPosts.forEach(post => {
    // Add category if it exists
    if (post.category) {
      categoryMap.set(post.category, (categoryMap.get(post.category) || 0) + 1);
    }
    // Also add tags
    post.tags?.forEach((tag: string) => {
      categoryMap.set(tag, (categoryMap.get(tag) || 0) + 1);
    });
  });

  // Convert to category array with colors
  const colors = [
    'bg-green-100 text-green-700',
    'bg-purple-100 text-purple-700',
    'bg-pink-100 text-pink-700',
    'bg-indigo-100 text-indigo-700',
    'bg-red-100 text-red-700',
    'bg-blue-100 text-blue-700',
    'bg-yellow-100 text-yellow-700',
    'bg-orange-100 text-orange-700',
    'bg-teal-100 text-teal-700'
  ];

  const categories = Array.from(categoryMap.entries()).map(([name, count], index) => ({
    name,
    count,
    color: colors[index % colors.length]
  }));


  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  const metadataObj = {
    title: 'Language Learning Blog - GCSE Tips, Teaching Strategies & Educational Insights',
    description: 'Expert insights on GCSE language learning, vocabulary techniques, gamification strategies, and modern teaching methods. Written by experienced MFL educators.',
    keywords: [
      'language learning blog',
      'GCSE language tips',
      'MFL teaching strategies',
      'vocabulary learning techniques',
      'gamification education',
      'language teaching blog',
      'educational technology',
      'language learning research',
      'GCSE preparation tips',
      'modern language teaching'
    ],
    canonical: '/blog',
    ogImage: '/images/blog-og.jpg',
  };

  // Sort all posts by publish date (newest first)
  const sortedPosts = allPosts.sort((a, b) => {
    const dateA = new Date(a.publish_date);
    const dateB = new Date(b.publish_date);
    return dateB.getTime() - dateA.getTime();
  });


  return (
    <SEOWrapper breadcrumbs={breadcrumbs} {...metadataObj}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
        {/* Hero Section */}
        <section className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
                Language Learning
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600"> Insights</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                Expert insights on GCSE language learning, vocabulary techniques, gamification strategies,
                and modern teaching methods. Written by experienced MFL educators.
              </p>

              <BlogPageClient
                initialPosts={sortedPosts}
                categories={categories}
              />
            </div>
          </div>
        </section>

        {/* Upcoming Posts */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Coming Soon
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                More expert insights and practical guides are on the way
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {upcomingPosts.map((post, index) => {
                const IconComponent = post.icon;
                return (
                  <div key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 shadow-lg opacity-75 border border-blue-100">
                    <div className="flex items-center mb-6">
                      <div className="w-10 h-10 bg-gradient-to-br from-slate-400 to-slate-500 rounded-lg flex items-center justify-center mr-3">
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                      {post.title}
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-6 text-sm">{post.excerpt}</p>

                    <div className="flex items-center text-sm text-slate-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span>{post.publishDate}</span>
                      </div>
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{post.readTime}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Language Learning?
            </h2>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Put these insights into practice with Language Gems' interactive games and comprehensive teaching tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Explore Games
              </Link>
              <Link
                href="/resources/teachers"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-blue-600 transition-all duration-200"
              >
                Teacher Resources
              </Link>
            </div>
          </div>
        </section>
      </div>

      {/* Admin Button - Only visible to admin users */}
      {isAdmin && <BlogAdminButton />}

      <Footer />
    </SEOWrapper>
  );
}
