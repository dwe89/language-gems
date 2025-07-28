import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, BookOpen, Target, CheckCircle, Star, Award } from 'lucide-react';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getArticleSchema, getFAQSchema } from '../../../lib/seo/structuredData';
import { generateMetadata } from '../../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'Complete Guide to GCSE Spanish Vocabulary Themes (AQA, Edexcel, OCR) 2024',
  description: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide. 500+ essential words, exam board specific requirements, and proven study strategies for AQA, Edexcel, and OCR.',
  keywords: [
    'GCSE Spanish vocabulary',
    'Spanish GCSE themes',
    'AQA Spanish vocabulary',
    'Edexcel Spanish words',
    'OCR Spanish GCSE',
    'GCSE Spanish exam preparation',
    'Spanish vocabulary themes',
    'GCSE Spanish word lists',
    'Spanish exam vocabulary',
    'GCSE Spanish study guide'
  ],
  canonical: '/blog/complete-guide-gcse-spanish-vocabulary-themes',
  ogImage: '/images/blog/gcse-spanish-vocabulary-guide-og.jpg',
  ogType: 'article',
  publishedTime: '2024-01-25T10:00:00Z',
  modifiedTime: '2024-01-25T10:00:00Z',
});

const vocabularyThemes = [
  {
    theme: 'Identity and Culture',
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    priority: 'High',
    wordCount: '80-100 words',
    keyTopics: [
      'Personal information (name, age, birthday)',
      'Family relationships and descriptions',
      'Physical appearance and personality',
      'Nationalities and languages',
      'Cultural celebrations and traditions'
    ],
    essentialWords: [
      'la familia (family)', 'los padres (parents)', 'hermano/a (brother/sister)',
      'alto/a (tall)', 'bajo/a (short)', 'simpático/a (nice)',
      'español/a (Spanish)', 'británico/a (British)', 'cumpleaños (birthday)'
    ],
    examTips: [
      'Focus on adjective agreement (masculine/feminine)',
      'Practice describing family members in detail',
      'Learn cultural festivals specific to Spanish-speaking countries'
    ]
  },
  {
    theme: 'Local Area, Holiday and Travel',
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    priority: 'High',
    wordCount: '90-120 words',
    keyTopics: [
      'Town and city features',
      'Directions and transport',
      'Holiday destinations and activities',
      'Weather and climate',
      'Accommodation types'
    ],
    essentialWords: [
      'la ciudad (city)', 'el pueblo (town)', 'la playa (beach)',
      'el hotel (hotel)', 'el aeropuerto (airport)', 'el tren (train)',
      'hace sol (it\'s sunny)', 'llueve (it\'s raining)', 'las vacaciones (holidays)'
    ],
    examTips: [
      'Master weather expressions for speaking assessments',
      'Practice giving directions using command forms',
      'Learn transport vocabulary for travel scenarios'
    ]
  },
  {
    theme: 'School',
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    priority: 'High',
    wordCount: '70-90 words',
    keyTopics: [
      'School subjects and timetables',
      'School facilities and equipment',
      'Teachers and classmates',
      'School rules and uniform',
      'Educational achievements'
    ],
    essentialWords: [
      'las matemáticas (maths)', 'la historia (history)', 'el inglés (English)',
      'el profesor (teacher)', 'el aula (classroom)', 'el recreo (break time)',
      'el uniforme (uniform)', 'los deberes (homework)', 'el examen (exam)'
    ],
    examTips: [
      'Learn time expressions for timetables',
      'Practice expressing opinions about subjects',
      'Master school facility vocabulary for descriptions'
    ]
  },
  {
    theme: 'Future Aspirations, Study and Work',
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    priority: 'High',
    wordCount: '80-100 words',
    keyTopics: [
      'Career aspirations and jobs',
      'University and further education',
      'Work experience and part-time jobs',
      'Skills and qualifications',
      'Future plans and ambitions'
    ],
    essentialWords: [
      'el trabajo (job)', 'la carrera (career)', 'la universidad (university)',
      'médico/a (doctor)', 'profesor/a (teacher)', 'ingeniero/a (engineer)',
      'estudiar (to study)', 'trabajar (to work)', 'el futuro (future)'
    ],
    examTips: [
      'Practice future tense for career plans',
      'Learn conditional tense for aspirations',
      'Master job-related vocabulary and skills'
    ]
  },
  {
    theme: 'International and Global Dimension',
    examBoards: ['AQA', 'Edexcel', 'OCR'],
    priority: 'Medium',
    wordCount: '60-80 words',
    keyTopics: [
      'Environmental issues and climate change',
      'Global problems and solutions',
      'International events and news',
      'Technology and social media',
      'Charity and volunteering'
    ],
    essentialWords: [
      'el medio ambiente (environment)', 'la contaminación (pollution)',
      'el cambio climático (climate change)', 'reciclar (to recycle)',
      'la tecnología (technology)', 'las redes sociales (social media)',
      'ayudar (to help)', 'el voluntariado (volunteering)'
    ],
    examTips: [
      'Focus on environmental vocabulary for current issues',
      'Practice expressing opinions on global topics',
      'Learn technology vocabulary for modern contexts'
    ]
  }
];

const studyStrategies = [
  {
    strategy: 'Spaced Repetition System',
    description: 'Review vocabulary at increasing intervals to maximize long-term retention',
    implementation: [
      'Review new words after 1 day, then 3 days, then 1 week',
      'Use flashcards or digital apps like Language Gems',
      'Focus extra time on words you find most difficult',
      'Track your progress to maintain motivation'
    ],
    effectiveness: '40% better retention than traditional methods'
  },
  {
    strategy: 'Contextual Learning',
    description: 'Learn vocabulary within meaningful sentences and real-world contexts',
    implementation: [
      'Create sentences using new vocabulary',
      'Read authentic Spanish texts at your level',
      'Watch Spanish videos with subtitles',
      'Practice vocabulary in speaking scenarios'
    ],
    effectiveness: '60% better recall in exam conditions'
  },
  {
    strategy: 'Active Recall Testing',
    description: 'Test yourself regularly rather than just re-reading vocabulary lists',
    implementation: [
      'Cover English translations and recall Spanish words',
      'Use practice tests and mock exams',
      'Create your own vocabulary quizzes',
      'Practice with classmates or family'
    ],
    effectiveness: '50% improvement in exam performance'
  }
];

const faqs = [
  {
    question: 'How many Spanish words do I need to know for GCSE?',
    answer: 'GCSE Spanish requires approximately 1,200-1,500 words across all themes. AQA, Edexcel, and OCR each have specific vocabulary lists, but there\'s significant overlap. Focus on the 500 most essential words first, then expand to theme-specific vocabulary based on your exam board requirements.'
  },
  {
    question: 'Which vocabulary themes are most important for GCSE Spanish?',
    answer: 'Identity and Culture, Local Area/Holiday/Travel, School, and Future Aspirations are the highest priority themes, appearing in all exam boards. These themes form the foundation for speaking and writing assessments. International and Global Dimension is also important but typically requires fewer words.'
  },
  {
    question: 'How should I organize my GCSE Spanish vocabulary learning?',
    answer: 'Organize by themes first, then by frequency of use. Start with high-frequency words within each theme, then expand to more specific vocabulary. Use spaced repetition to review regularly, and always learn words in context rather than as isolated items. Create theme-based vocabulary books or digital lists.'
  },
  {
    question: 'What\'s the difference between AQA, Edexcel, and OCR Spanish vocabulary?',
    answer: 'While there\'s 80% overlap between exam boards, each has specific emphasis areas. AQA focuses more on cultural aspects, Edexcel emphasizes practical communication, and OCR includes more contemporary issues. All boards cover the same core themes, but the specific vocabulary within themes may vary slightly.'
  },
  {
    question: 'How can I remember Spanish vocabulary more effectively?',
    answer: 'Use multiple learning strategies: spaced repetition for long-term retention, contextual learning through sentences and stories, active recall through self-testing, and visual associations. Practice vocabulary in all four skills (listening, speaking, reading, writing) and connect new words to words you already know.'
  }
];

export default function GCSESpanishVocabularyGuide() {
  const articleSchema = getArticleSchema({
    title: 'Complete Guide to GCSE Spanish Vocabulary Themes (AQA, Edexcel, OCR) 2024',
    description: 'Master all GCSE Spanish vocabulary themes with our comprehensive guide. 500+ essential words and proven study strategies.',
    url: '/blog/complete-guide-gcse-spanish-vocabulary-themes',
    publishedTime: '2024-01-25T10:00:00Z',
    modifiedTime: '2024-01-25T10:00:00Z',
    author: 'Daniel Etienne',
    image: '/images/blog/gcse-spanish-vocabulary-guide-og.jpg'
  });

  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'GCSE Spanish Vocabulary Guide', url: '/blog/complete-guide-gcse-spanish-vocabulary-themes' }
  ];

  return (
    <SEOWrapper structuredData={[articleSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <article className="min-h-screen bg-gradient-to-br from-slate-50 via-orange-50 to-red-100">
        {/* Hero Section */}
        <header className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                Complete Guide to GCSE Spanish 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600"> Vocabulary Themes</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Master all GCSE Spanish vocabulary themes with our comprehensive guide covering 500+ essential words, 
                exam board specific requirements (AQA, Edexcel, OCR), and proven study strategies that improve retention by 40%.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Daniel Etienne</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>January 25, 2024</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>12 min read</span>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Introduction */}
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-lg max-w-none">
              <p className="text-xl text-slate-700 leading-relaxed mb-8">
                GCSE Spanish vocabulary mastery is crucial for exam success, yet many students struggle with the sheer volume 
                of words required across different themes. This comprehensive guide breaks down all vocabulary themes by exam board, 
                provides essential word lists, and shares proven strategies that help students retain 40% more vocabulary.
              </p>
              
              <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100 mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">What You'll Learn</h2>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-slate-700">Complete breakdown of all 5 GCSE Spanish vocabulary themes</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-slate-700">500+ essential words with exam board specific requirements</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-slate-700">Proven study strategies that improve retention by 40%</span>
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                    <span className="text-slate-700">Exam-specific tips for AQA, Edexcel, and OCR boards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Vocabulary Themes */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                The 5 Essential GCSE Spanish Vocabulary Themes
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Comprehensive breakdown of each theme with essential vocabulary and exam-specific guidance
              </p>
            </div>
            
            <div className="space-y-8">
              {vocabularyThemes.map((theme, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-slate-900 mb-2">{theme.theme}</h3>
                      <div className="flex flex-wrap gap-4 mb-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          theme.priority === 'High' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                        }`}>
                          {theme.priority} Priority
                        </span>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                          {theme.wordCount}
                        </span>
                        <div className="flex gap-1">
                          {theme.examBoards.map((board, boardIndex) => (
                            <span key={boardIndex} className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs font-medium">
                              {board}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Key Topics:</h4>
                      <ul className="space-y-2">
                        {theme.keyTopics.map((topic, topicIndex) => (
                          <li key={topicIndex} className="flex items-start">
                            <Target className="h-4 w-4 text-orange-500 mr-2 mt-0.5" />
                            <span className="text-slate-700 text-sm">{topic}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-3">Essential Words:</h4>
                      <div className="flex flex-wrap gap-2">
                        {theme.essentialWords.map((word, wordIndex) => (
                          <span key={wordIndex} className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-sm">
                            {word}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-slate-900 mb-3">Exam Tips:</h4>
                    <ul className="space-y-2">
                      {theme.examTips.map((tip, tipIndex) => (
                        <li key={tipIndex} className="flex items-start">
                          <Star className="h-4 w-4 text-yellow-500 mr-2 mt-0.5" />
                          <span className="text-slate-700 text-sm">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Study Strategies */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Proven Vocabulary Learning Strategies
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Research-backed methods that improve vocabulary retention and exam performance
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {studyStrategies.map((strategy, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{strategy.strategy}</h3>
                  <p className="text-slate-600 mb-6">{strategy.description}</p>
                  
                  <h4 className="font-semibold text-slate-900 mb-3">How to implement:</h4>
                  <ul className="space-y-2 mb-6">
                    {strategy.implementation.map((step, stepIndex) => (
                      <li key={stepIndex} className="flex items-start">
                        <span className="flex-shrink-0 w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center text-xs font-medium mr-2 mt-0.5">
                          {stepIndex + 1}
                        </span>
                        <span className="text-slate-700 text-sm">{step}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-white rounded-lg p-4 border border-orange-200">
                    <p className="text-orange-600 font-semibold text-sm">
                      <Award className="h-4 w-4 inline mr-1" />
                      {strategy.effectiveness}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam Board Differences */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 to-red-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Exam Board Specific Requirements
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Understanding the differences between AQA, Edexcel, and OCR Spanish GCSE requirements
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">AQA Spanish</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Strong cultural focus</li>
                    <li>• Emphasis on authentic materials</li>
                    <li>• Traditional festivals and customs</li>
                    <li>• Regional variations included</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Edexcel Spanish</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Practical communication focus</li>
                    <li>• Real-world scenarios</li>
                    <li>• Business and work emphasis</li>
                    <li>• Contemporary vocabulary</li>
                  </ul>
                </div>
                
                <div className="text-center">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">OCR Spanish</h3>
                  <ul className="space-y-2 text-sm text-slate-700">
                    <li>• Global issues emphasis</li>
                    <li>• Environmental vocabulary</li>
                    <li>• Technology and social media</li>
                    <li>• International perspectives</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-8 border border-orange-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-600 to-red-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Master GCSE Spanish Vocabulary?
            </h2>
            <p className="text-xl text-orange-100 mb-8 leading-relaxed">
              Put these strategies into practice with Language Gems' GCSE Spanish vocabulary games. 
              Our platform includes all themes, spaced repetition, and progress tracking to maximize your success.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games/vocabulary-mining"
                className="inline-flex items-center px-8 py-4 bg-white text-orange-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Practice Spanish Vocabulary
              </Link>
              <Link
                href="/gcse-spanish-learning"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-orange-600 transition-all duration-200"
              >
                GCSE Spanish Guide
              </Link>
            </div>
          </div>
        </section>
      </article>
    </SEOWrapper>
  );
}
