import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen, Users, Target, Brain, Languages, Gamepad2, Film } from 'lucide-react';
import SEOWrapper from '../../components/seo/SEOWrapper';
import { generateMetadata } from '../../components/seo/SEOWrapper';
import Footer from '../../components/layout/Footer';

export const metadata: Metadata = generateMetadata({
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
});

const featuredPosts = [
  {
    title: 'The 7 Best Vocabulary Learning Techniques for GCSE Success (2024)',
    excerpt: 'Discover scientifically-proven vocabulary learning techniques that help GCSE students retain 40% more words. Includes spaced repetition, active recall, and gamification strategies.',
    slug: 'best-vocabulary-learning-techniques-gcse',
    category: 'Study Tips',
    readTime: '8 min read',
    publishDate: 'January 15, 2024',
    author: 'Daniel Etienne',
    icon: Brain,
    featured: true
  },
  {
    title: 'How Gamification Transforms Language Learning in the Classroom',
    excerpt: 'Explore how gamification increases student engagement by 90% and improves vocabulary retention. Practical strategies for MFL teachers to implement game-based learning.',
    slug: 'gamification-language-learning-classroom',
    category: 'Teaching Strategies',
    readTime: '10 min read',
    publishDate: 'January 20, 2024',
    author: 'Daniel Etienne',
    icon: Users,
    featured: true
  },
  {
    title: 'Complete Guide to GCSE Spanish Vocabulary Themes (AQA, Edexcel, OCR)',
    excerpt: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide. Includes 500+ essential words, exam tips, and practice strategies for all major exam boards.',
    slug: 'complete-guide-gcse-spanish-vocabulary-themes',
    category: 'GCSE Preparation',
    readTime: '12 min read',
    publishDate: 'January 25, 2024',
    author: 'Daniel Etienne',
    icon: Target,
    featured: true
  }
];

const recentPosts = [
  {
    title: 'Language Learning Apps vs. Educational Software: What Schools Need to Know',
    excerpt: 'Compare consumer language apps like Duolingo with educational platforms designed for schools. Discover why curriculum alignment matters for educational success.',
    slug: 'language-learning-apps-vs-educational-software',
    category: 'Educational Technology',
    readTime: '9 min read',
    publishDate: 'January 30, 2024',
    author: 'Daniel Etienne',
    icon: BookOpen
  },
  {
    title: 'The Complete Guide to Spaced Repetition for Vocabulary Learning',
    excerpt: 'Learn how spaced repetition can improve vocabulary retention by 200%. Includes implementation strategies and proven techniques for long-term memory.',
    slug: 'complete-guide-spaced-repetition-vocabulary-learning',
    category: 'Learning Science',
    readTime: '11 min read',
    publishDate: 'February 5, 2024',
    author: 'Daniel Etienne',
    icon: Brain
  },
  {
    title: 'Pronunciation in the Reading Aloud Task',
    excerpt: 'Pronunciation in the Reading Aloud Task: Major vs Minor Errors Explained',
    slug: 'pronunciation-in-the-reading-aloud-task',
    category: 'GCSE Preparation',
    readTime: '8 min read',
    publishDate: 'June 24, 2025',
    author: 'LanguageGems Team',
    icon: Target
  },
  {
    title: 'Everything You Need to Know About the New AQA Speaking Exam',
    excerpt: 'Understanding the New AQA Speaking Exam: What Students and Teachers Need to Know',
    slug: 'everything-you-need-to-know-about-the-new-aqa-speaking-exam',
    category: 'GCSE Preparation',
    readTime: '10 min read',
    publishDate: 'June 24, 2025',
    author: 'LanguageGems Team',
    icon: BookOpen
  },
  {
    title: 'Ser vs Estar: The Ultimate Guide for Students',
    excerpt: 'Master the most challenging Spanish grammar concept with this comprehensive guide. Learn when to use ser vs estar with clear rules, examples, and practice exercises.',
    slug: 'ser-vs-estar-ultimate-guide-students',
    category: 'Spanish Grammar',
    readTime: '15 min read',
    publishDate: 'March 10, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'German Cases Explained: Simple Guide for English Speakers',
    excerpt: 'Demystify German cases with this authoritative guide. Learn nominative, accusative, dative, and genitive cases with practical examples and memory techniques.',
    slug: 'german-cases-explained-simple-guide',
    category: 'German Grammar',
    readTime: '18 min read',
    publishDate: 'March 15, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'Imparfait vs Passé Composé: Simple Guide for GCSE Students',
    excerpt: 'Master French past tenses with this clear guide. Learn when to use imparfait vs passé composé with rules, examples, and common mistakes to avoid.',
    slug: 'imparfait-vs-passe-compose-simple-guide',
    category: 'French Grammar',
    readTime: '12 min read',
    publishDate: 'March 20, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'GCSE Spanish Speaking Exam Tips: Boost Your Grade',
    excerpt: 'Ace your GCSE Spanish speaking exam with proven strategies, practice techniques, and confidence-building tips from experienced examiners.',
    slug: 'gcse-spanish-speaking-exam-tips',
    category: 'GCSE Preparation',
    readTime: '10 min read',
    publishDate: 'March 25, 2024',
    author: 'LanguageGems Team',
    icon: Target
  },
  {
    title: 'The Science of Gamification in Language Learning',
    excerpt: 'Discover how gamification transforms language learning through behavioral science. Learn why games increase engagement and improve retention by 90%.',
    slug: 'science-of-gamification-language-learning',
    category: 'Learning Science',
    readTime: '14 min read',
    publishDate: 'April 1, 2024',
    author: 'LanguageGems Team',
    icon: Gamepad2
  },
  {
    title: 'Spaced Repetition vs Cramming: What Works Best?',
    excerpt: 'Compare spaced repetition vs cramming with scientific evidence. Learn why spaced repetition improves long-term retention and how to implement it effectively.',
    slug: 'spaced-repetition-vs-cramming',
    category: 'Study Tips',
    readTime: '11 min read',
    publishDate: 'April 5, 2024',
    author: 'LanguageGems Team',
    icon: Brain
  },
  {
    title: 'Por vs Para: Complete Guide for Spanish Learners',
    excerpt: 'Master por vs para with this comprehensive guide. Learn the rules, exceptions, and practice with real-world examples to use these prepositions correctly.',
    slug: 'por-vs-para-guide',
    category: 'Spanish Grammar',
    readTime: '13 min read',
    publishDate: 'April 10, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'Jouer à vs Jouer de: Explained Simply',
    excerpt: 'Clear up French preposition confusion with jouer à vs jouer de. Learn the rules with sports, instruments, and games examples.',
    slug: 'jouer-a-vs-jouer-de-explained',
    category: 'French Grammar',
    readTime: '8 min read',
    publishDate: 'April 15, 2024',
    author: 'LanguageGems Team',
    icon: Languages
  },
  {
    title: 'GCSE German Writing Exam Tips: Get Top Marks',
    excerpt: 'Master GCSE German writing with expert tips, structure guides, and vocabulary strategies to achieve the highest grades.',
    slug: 'gcse-german-writing-exam-tips',
    category: 'GCSE Preparation',
    readTime: '12 min read',
    publishDate: 'April 20, 2024',
    author: 'LanguageGems Team',
    icon: Target
  },
  {
    title: 'KS3 French: Word Blast Game Better Than Flashcards',
    excerpt: 'Discover why interactive games like Word Blast outperform traditional flashcards for KS3 French vocabulary learning and long-term retention.',
    slug: 'ks3-french-word-blast-game-better-than-flashcards',
    category: 'Teaching Strategies',
    readTime: '9 min read',
    publishDate: 'April 25, 2024',
    author: 'LanguageGems Team',
    icon: Gamepad2
  },
  {
    title: 'German Movies & TV Shows for Listening Skills',
    excerpt: 'Build German listening skills with curated movies and TV shows. Includes difficulty levels, subtitles strategies, and cultural insights.',
    slug: 'german-movies-tv-shows-listening-skills',
    category: 'Cultural Learning',
    readTime: '10 min read',
    publishDate: 'May 1, 2024',
    author: 'LanguageGems Team',
    icon: Film
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

const categories = [
  { name: 'GCSE Preparation', count: 4, color: 'bg-green-100 text-green-700' },
  { name: 'Learning Science', count: 2, color: 'bg-indigo-100 text-indigo-700' },
  { name: 'Spanish Grammar', count: 2, color: 'bg-red-100 text-red-700' },
  { name: 'French Grammar', count: 2, color: 'bg-blue-100 text-blue-700' },
  { name: 'German Grammar', count: 1, color: 'bg-yellow-100 text-yellow-700' },
  { name: 'Study Tips', count: 1, color: 'bg-purple-100 text-purple-700' },
  { name: 'Teaching Strategies', count: 1, color: 'bg-pink-100 text-pink-700' },
  { name: 'Educational Technology', count: 1, color: 'bg-orange-100 text-orange-700' },
  { name: 'Cultural Learning', count: 1, color: 'bg-teal-100 text-teal-700' }
];

export default function BlogPage() {
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  return (
    <SEOWrapper breadcrumbs={breadcrumbs}>
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
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                {categories.map((category, index) => (
                  <span key={index} className={`px-4 py-2 rounded-full text-sm font-medium ${category.color}`}>
                    {category.name} ({category.count})
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Posts */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Featured Articles
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                In-depth guides and research-backed strategies for language learning success
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {featuredPosts.map((post, index) => {
                const IconComponent = post.icon;
                return (
                  <article key={index} className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-8 border border-blue-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>
                    
                    <h3 className="text-2xl font-bold text-slate-900 mb-4 leading-tight">
                      <Link 
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h3>
                    
                    <p className="text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      
                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Recent Posts */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Recent Articles
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Latest insights and practical guides for language learning success
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
              {recentPosts.map((post, index) => {
                const IconComponent = post.icon;
                return (
                  <article key={index} className="bg-white rounded-xl p-8 shadow-lg">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center mr-4">
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <h3 className="text-xl font-bold text-slate-900 mb-4 leading-tight">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="hover:text-blue-600 transition-colors duration-200"
                      >
                        {post.title}
                      </Link>
                    </h3>

                    <p className="text-slate-600 leading-relaxed mb-6">{post.excerpt}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-slate-500 space-x-4">
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          <span>{post.author}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          <span>{post.publishDate}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>

                      <Link
                        href={`/blog/${post.slug}`}
                        className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700 transition-colors duration-200"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1" />
                      </Link>
                    </div>
                  </article>
                );
              })}
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
      
      <Footer />
    </SEOWrapper>
  );
}
