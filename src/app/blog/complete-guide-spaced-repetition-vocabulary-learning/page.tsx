import { Metadata } from 'next';
import Link from 'next/link';
import { Calendar, User, Clock, Brain, TrendingUp, Target, CheckCircle, Award, Zap } from 'lucide-react';
import SEOWrapper from '../../../components/seo/SEOWrapper';
import { getArticleSchema, getFAQSchema } from '../../../lib/seo/structuredData';
import { generateMetadata } from '../../../components/seo/SEOWrapper';

export const metadata: Metadata = generateMetadata({
  title: 'The Complete Guide to Spaced Repetition for Vocabulary Learning (2024)',
  description: 'Master spaced repetition for vocabulary learning with our comprehensive guide. Discover how to improve retention by 200% using scientifically-proven intervals and implementation strategies.',
  keywords: [
    'spaced repetition vocabulary learning',
    'spaced repetition system',
    'vocabulary retention techniques',
    'memory techniques language learning',
    'spaced repetition intervals',
    'vocabulary memorization strategies',
    'language learning memory',
    'spaced repetition apps',
    'vocabulary study methods',
    'long-term vocabulary retention'
  ],
  canonical: '/blog/complete-guide-spaced-repetition-vocabulary-learning',
  ogImage: '/images/blog/spaced-repetition-guide-og.jpg',
  ogType: 'article',
  publishedTime: '2024-02-05T10:00:00Z',
  modifiedTime: '2024-02-05T10:00:00Z',
});

const spacedRepetitionIntervals = [
  {
    review: 'Initial Learning',
    timing: 'Day 0',
    description: 'First exposure to new vocabulary with active engagement',
    activities: ['Read and understand meaning', 'Practice pronunciation', 'Create example sentences', 'Visual associations'],
    retention: '100% (immediate)'
  },
  {
    review: 'First Review',
    timing: '1 day later',
    description: 'Quick review to reinforce initial learning before forgetting begins',
    activities: ['Recall without looking', 'Check accuracy', 'Practice difficult words extra', 'Note problem areas'],
    retention: '90% (if reviewed)'
  },
  {
    review: 'Second Review',
    timing: '3 days later',
    description: 'Strengthen memory pathways as forgetting curve steepens',
    activities: ['Active recall testing', 'Use in new contexts', 'Practice with synonyms', 'Speed recognition drills'],
    retention: '85% (if reviewed)'
  },
  {
    review: 'Third Review',
    timing: '1 week later',
    description: 'Consolidate into long-term memory with deeper processing',
    activities: ['Complex sentence creation', 'Conversation practice', 'Writing exercises', 'Cultural context exploration'],
    retention: '80% (if reviewed)'
  },
  {
    review: 'Fourth Review',
    timing: '2 weeks later',
    description: 'Ensure stable long-term retention with varied practice',
    activities: ['Mixed skill practice', 'Exam-style questions', 'Peer teaching', 'Real-world application'],
    retention: '75% (stable)'
  },
  {
    review: 'Maintenance',
    timing: '1 month+',
    description: 'Periodic review to maintain vocabulary in active memory',
    activities: ['Monthly quick reviews', 'Natural usage practice', 'Reading and listening', 'Refresher sessions'],
    retention: '70% (maintained)'
  }
];

const implementationStrategies = [
  {
    method: 'Digital Flashcard Systems',
    description: 'Use apps and software that automatically calculate optimal review intervals',
    tools: ['Language Gems Vocabulary Mining', 'Anki', 'Quizlet', 'Memrise'],
    pros: ['Automated scheduling', 'Progress tracking', 'Multimedia support', 'Accessibility'],
    cons: ['Screen dependency', 'Potential distractions', 'Subscription costs'],
    bestFor: 'Students comfortable with technology who want automated systems'
  },
  {
    method: 'Physical Card System',
    description: 'Traditional flashcards organized into boxes based on mastery level',
    tools: ['Index cards', 'Leitner box system', 'Color coding', 'Physical organization'],
    pros: ['No technology needed', 'Tactile learning', 'No distractions', 'Customizable'],
    cons: ['Manual scheduling', 'Physical storage', 'Limited multimedia', 'Time-intensive'],
    bestFor: 'Students who prefer hands-on learning and minimal technology'
  },
  {
    method: 'Integrated Curriculum Approach',
    description: 'Build spaced repetition into regular lesson plans and homework',
    tools: ['Lesson planning software', 'Homework schedules', 'Assessment integration', 'Class activities'],
    pros: ['Curriculum aligned', 'Teacher guided', 'Peer interaction', 'Structured approach'],
    cons: ['Requires teacher training', 'Less personalized', 'Fixed schedules'],
    bestFor: 'Classroom environments with dedicated teacher support'
  },
  {
    method: 'Hybrid Digital-Physical',
    description: 'Combine digital scheduling with physical practice materials',
    tools: ['Digital reminders', 'Physical cards', 'Notebook tracking', 'App integration'],
    pros: ['Best of both worlds', 'Flexible approach', 'Reduced screen time', 'Personalized'],
    cons: ['More complex setup', 'Requires discipline', 'Multiple systems'],
    bestFor: 'Self-directed learners who want flexibility and variety'
  }
];

const scientificEvidence = [
  {
    study: 'Ebbinghaus Forgetting Curve (1885)',
    finding: 'Without review, we forget 50% of new information within 1 hour and 90% within 1 month',
    implication: 'Regular review is essential to prevent rapid forgetting of vocabulary',
    relevance: 'Foundation of spaced repetition theory'
  },
  {
    study: 'Bahrick et al. (1993) - Foreign Language Vocabulary',
    finding: 'Spaced practice led to 200% better retention compared to massed practice',
    implication: 'Distributed learning significantly outperforms cramming for vocabulary',
    relevance: 'Direct evidence for language learning applications'
  },
  {
    study: 'Cepeda et al. (2006) - Optimal Spacing Intervals',
    finding: 'Optimal spacing intervals increase with desired retention duration',
    implication: 'Longer-term goals require progressively longer intervals between reviews',
    relevance: 'Guides interval scheduling for different learning objectives'
  },
  {
    study: 'Karpicke & Roediger (2008) - Testing Effect',
    finding: 'Active recall testing during spaced intervals improves retention by 50%',
    implication: 'Combining spaced repetition with active testing maximizes effectiveness',
    relevance: 'Supports active recall methods in vocabulary learning'
  }
];

const commonMistakes = [
  {
    mistake: 'Using Fixed Intervals for All Words',
    problem: 'Treating easy and difficult vocabulary the same way wastes time and reduces effectiveness',
    solution: 'Adjust intervals based on individual word difficulty and personal mastery level',
    impact: 'Can reduce efficiency by up to 40%'
  },
  {
    mistake: 'Passive Review Only',
    problem: 'Simply re-reading vocabulary lists without active recall testing',
    solution: 'Always test yourself actively - cover answers and try to recall before checking',
    impact: 'Active recall improves retention by 50% over passive review'
  },
  {
    mistake: 'Inconsistent Practice',
    problem: 'Irregular review sessions disrupt the spacing effect and reduce retention',
    solution: 'Maintain consistent daily practice, even if sessions are shorter',
    impact: 'Consistency is more important than session length for long-term retention'
  },
  {
    mistake: 'Ignoring Context',
    problem: 'Learning words in isolation without meaningful context or usage examples',
    solution: 'Always learn vocabulary within sentences and real-world contexts',
    impact: 'Contextual learning improves retention and practical usage by 60%'
  }
];

const faqs = [
  {
    question: 'How much can spaced repetition really improve vocabulary retention?',
    answer: 'Research consistently shows that spaced repetition can improve vocabulary retention by 200% compared to traditional cramming methods. The Bahrick et al. (1993) study specifically demonstrated this improvement for foreign language vocabulary, with benefits lasting for decades when properly implemented.'
  },
  {
    question: 'What are the optimal intervals for spaced repetition in vocabulary learning?',
    answer: 'The most effective intervals are: 1 day, 3 days, 1 week, 2 weeks, 1 month, then 3+ months for maintenance. However, these should be adjusted based on individual difficulty - easier words can have longer intervals, while difficult words need more frequent review until mastered.'
  },
  {
    question: 'Can I use spaced repetition for GCSE vocabulary preparation?',
    answer: 'Absolutely! Spaced repetition is particularly effective for GCSE vocabulary because it ensures long-term retention needed for exams. Start with high-frequency words and theme-specific vocabulary, using intervals that align with your exam timeline. Many students see 40% better exam performance using spaced repetition.'
  },
  {
    question: 'What\'s the difference between spaced repetition and regular flashcard practice?',
    answer: 'Regular flashcard practice typically reviews all cards equally and frequently. Spaced repetition intelligently schedules reviews based on how well you know each word - difficult words appear more often, easy words less frequently. This targeted approach is much more efficient and effective.'
  },
  {
    question: 'How long should each spaced repetition session be?',
    answer: 'Optimal sessions are 15-20 minutes for maximum concentration and retention. Shorter, frequent sessions are more effective than long, infrequent ones. The key is consistency - daily 15-minute sessions outperform weekly 2-hour sessions for vocabulary retention.'
  }
];

export default function SpacedRepetitionGuide() {
  const articleSchema = getArticleSchema({
    title: 'The Complete Guide to Spaced Repetition for Vocabulary Learning (2024)',
    description: 'Master spaced repetition for vocabulary learning with our comprehensive guide. Improve retention by 200% using scientifically-proven intervals.',
    url: '/blog/complete-guide-spaced-repetition-vocabulary-learning',
    publishedTime: '2024-02-05T10:00:00Z',
    modifiedTime: '2024-02-05T10:00:00Z',
    author: 'Daniel Etienne',
    image: '/images/blog/spaced-repetition-guide-og.jpg'
  });

  const faqSchema = getFAQSchema(faqs);
  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: 'Spaced Repetition Guide', url: '/blog/complete-guide-spaced-repetition-vocabulary-learning' }
  ];

  return (
    <SEOWrapper structuredData={[articleSchema, faqSchema]} breadcrumbs={breadcrumbs}>
      <article className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100">
        {/* Hero Section */}
        <header className="relative py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                The Complete Guide to Spaced Repetition for 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Vocabulary Learning</span>
              </h1>
              <p className="text-xl text-slate-600 mb-8 leading-relaxed">
                Master the science of spaced repetition to improve vocabulary retention by 200%. 
                Discover optimal intervals, implementation strategies, and proven techniques that transform how you learn and remember new words.
              </p>
              
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
                <div className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  <span>Daniel Etienne</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>February 5, 2024</span>
                </div>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>11 min read</span>
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
                Spaced repetition is the most scientifically-proven method for long-term vocabulary retention, 
                yet most language learners still rely on ineffective cramming techniques. This comprehensive guide 
                reveals how to harness the power of spaced repetition to improve vocabulary retention by 200%, 
                based on over 130 years of memory research and practical implementation strategies.
              </p>
              
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100 mb-12">
                <h2 className="text-2xl font-bold text-slate-900 mb-4">The Science Behind Spaced Repetition</h2>
                <p className="text-slate-700 leading-relaxed">
                  Spaced repetition leverages the psychological spacing effect - the phenomenon where information 
                  is better retained when learning sessions are spaced out over time rather than concentrated. 
                  By reviewing vocabulary at scientifically-optimized intervals, you can achieve maximum retention 
                  with minimum effort, making it the most efficient vocabulary learning method available.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Spaced Repetition Intervals */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Optimal Spaced Repetition Schedule
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                The scientifically-proven intervals that maximize vocabulary retention while minimizing study time
              </p>
            </div>
            
            <div className="space-y-6">
              {spacedRepetitionIntervals.map((interval, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center">
                        <span className="text-white font-bold text-lg">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-2xl font-bold text-slate-900">{interval.review}</h3>
                        <div className="flex items-center">
                          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full font-semibold">
                            {interval.timing}
                          </span>
                          <span className="ml-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-full font-semibold">
                            {interval.retention}
                          </span>
                        </div>
                      </div>
                      
                      <p className="text-slate-600 text-lg mb-6">{interval.description}</p>
                      
                      <div>
                        <h4 className="font-semibold text-slate-900 mb-3">Recommended Activities:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {interval.activities.map((activity, activityIndex) => (
                            <div key={activityIndex} className="flex items-center">
                              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                              <span className="text-slate-700 text-sm">{activity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Implementation Strategies */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Implementation Strategies
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Practical approaches to integrate spaced repetition into your vocabulary learning routine
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {implementationStrategies.map((strategy, index) => (
                <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-8 border border-indigo-100">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{strategy.method}</h3>
                  <p className="text-slate-600 mb-6">{strategy.description}</p>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Tools & Resources:</h4>
                      <div className="flex flex-wrap gap-2">
                        {strategy.tools.map((tool, toolIndex) => (
                          <span key={toolIndex} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-green-700 mb-2">Advantages:</h4>
                        <ul className="space-y-1">
                          {strategy.pros.map((pro, proIndex) => (
                            <li key={proIndex} className="flex items-center">
                              <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                              <span className="text-slate-700 text-sm">{pro}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-orange-700 mb-2">Considerations:</h4>
                        <ul className="space-y-1">
                          {strategy.cons.map((con, conIndex) => (
                            <li key={conIndex} className="flex items-center">
                              <Target className="h-3 w-3 text-orange-500 mr-2" />
                              <span className="text-slate-700 text-sm">{con}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border border-indigo-200">
                      <p className="text-slate-700 text-sm">
                        <strong>Best for:</strong> {strategy.bestFor}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Scientific Evidence */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Scientific Evidence
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Research studies that prove the effectiveness of spaced repetition for vocabulary learning
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {scientificEvidence.map((evidence, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <div className="flex items-center mb-4">
                    <Brain className="h-8 w-8 text-indigo-600 mr-3" />
                    <h3 className="text-lg font-bold text-slate-900">{evidence.study}</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Key Finding:</h4>
                      <p className="text-slate-700 text-sm">{evidence.finding}</p>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-slate-900 mb-2">Implication:</h4>
                      <p className="text-slate-700 text-sm">{evidence.implication}</p>
                    </div>
                    
                    <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                      <p className="text-indigo-700 font-medium text-sm">
                        <Award className="h-4 w-4 inline mr-1" />
                        {evidence.relevance}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Common Mistakes */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Common Mistakes to Avoid
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Learn from these frequent errors that reduce the effectiveness of spaced repetition
              </p>
            </div>
            
            <div className="space-y-8">
              {commonMistakes.map((mistake, index) => (
                <div key={index} className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-xl p-8 border border-indigo-100">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-red-400 to-orange-500 rounded-lg flex items-center justify-center">
                        <Zap className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    
                    <div className="flex-grow">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{mistake.mistake}</h3>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold text-red-700 mb-2">The Problem:</h4>
                          <p className="text-slate-700 mb-4">{mistake.problem}</p>
                          
                          <h4 className="font-semibold text-green-700 mb-2">The Solution:</h4>
                          <p className="text-slate-700">{mistake.solution}</p>
                        </div>
                        
                        <div className="bg-white rounded-lg p-4 border border-indigo-200">
                          <h4 className="font-semibold text-indigo-700 mb-2">Impact on Learning:</h4>
                          <p className="text-slate-700 text-sm">{mistake.impact}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-50 to-purple-50">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-xl p-8 shadow-lg">
                  <h3 className="text-xl font-bold text-slate-900 mb-4">{faq.question}</h3>
                  <p className="text-slate-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-600 to-purple-600">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Ready to Transform Your Vocabulary Learning?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 leading-relaxed">
              Experience the power of spaced repetition with Language Gems' intelligent vocabulary system. 
              Our platform automatically calculates optimal review intervals and tracks your progress for maximum retention.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/games/vocabulary-mining"
                className="inline-flex items-center px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Try Spaced Repetition Now
              </Link>
              <Link
                href="/blog/best-vocabulary-learning-techniques-gcse"
                className="inline-flex items-center px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-indigo-600 transition-all duration-200"
              >
                More Learning Techniques
              </Link>
            </div>
          </div>
        </section>
      </article>
    </SEOWrapper>
  );
}
