// SEO Analytics and Monitoring Setup for Language Gems

export interface SEOMetric {
  name: string;
  description: string;
  target: number | string;
  frequency: 'daily' | 'weekly' | 'monthly';
  source: string;
  priority: 'high' | 'medium' | 'low';
}

// Core SEO Metrics to Track
export const SEO_METRICS: SEOMetric[] = [
  {
    name: 'Organic Traffic',
    description: 'Total organic search sessions from Google, Bing, etc.',
    target: '5,000 monthly sessions by month 6',
    frequency: 'weekly',
    source: 'Google Analytics 4',
    priority: 'high'
  },
  {
    name: 'Keyword Rankings',
    description: 'Average position for target keywords',
    target: '50+ keywords in top 10',
    frequency: 'weekly',
    source: 'Google Search Console',
    priority: 'high'
  },
  {
    name: 'Click-Through Rate (CTR)',
    description: 'Percentage of impressions that result in clicks',
    target: '5%+ average CTR',
    frequency: 'weekly',
    source: 'Google Search Console',
    priority: 'high'
  },
  {
    name: 'Core Web Vitals',
    description: 'LCP, FID, CLS scores for all pages',
    target: 'All pages pass CWV assessment',
    frequency: 'monthly',
    source: 'PageSpeed Insights, Search Console',
    priority: 'high'
  },
  {
    name: 'Backlinks',
    description: 'Number and quality of referring domains',
    target: '100+ high-quality backlinks',
    frequency: 'monthly',
    source: 'Ahrefs, SEMrush, or free tools',
    priority: 'medium'
  },
  {
    name: 'Featured Snippets',
    description: 'Number of featured snippets captured',
    target: '5+ featured snippets',
    frequency: 'monthly',
    source: 'Google Search Console',
    priority: 'medium'
  },
  {
    name: 'Local Pack Rankings',
    description: 'Rankings for location-based searches',
    target: 'Top 3 for "language learning platform UK"',
    frequency: 'monthly',
    source: 'Google My Business, local rank trackers',
    priority: 'low'
  }
];

// Google Analytics 4 Setup Configuration
export const GA4_SETUP = {
  measurementId: 'G-XXXXXXXXXX', // Replace with actual ID
  customEvents: [
    {
      name: 'game_start',
      description: 'User starts playing a language game',
      parameters: ['game_name', 'language', 'difficulty']
    },
    {
      name: 'vocabulary_learned',
      description: 'User successfully learns a vocabulary word',
      parameters: ['word', 'language', 'game_type']
    },
    {
      name: 'school_inquiry',
      description: 'School submits contact form',
      parameters: ['school_type', 'student_count', 'languages_interested']
    },
    {
      name: 'pricing_view',
      description: 'User views pricing page',
      parameters: ['plan_type', 'referrer_page']
    },
    {
      name: 'demo_request',
      description: 'School requests a demo',
      parameters: ['contact_method', 'urgency_level']
    }
  ],
  customDimensions: [
    {
      name: 'User Type',
      scope: 'user',
      description: 'Teacher, Student, or Visitor'
    },
    {
      name: 'School Size',
      scope: 'user', 
      description: 'Small (<500), Medium (500-1000), Large (1000+)'
    },
    {
      name: 'Language Interest',
      scope: 'session',
      description: 'Primary language of interest'
    },
    {
      name: 'Game Category',
      scope: 'event',
      description: 'Vocabulary, Grammar, Listening, etc.'
    }
  ]
};

// Search Console Monitoring Queries
export const SEARCH_CONSOLE_QUERIES = [
  {
    name: 'Top Performing Pages',
    description: 'Pages with highest impressions and clicks',
    filters: {
      dimension: 'page',
      metrics: ['clicks', 'impressions', 'ctr', 'position'],
      dateRange: 'last_28_days'
    }
  },
  {
    name: 'Target Keyword Performance',
    description: 'Performance of our target keywords',
    filters: {
      dimension: 'query',
      queryFilter: ['GCSE language learning', 'vocabulary games', 'interactive language games'],
      metrics: ['clicks', 'impressions', 'ctr', 'position']
    }
  },
  {
    name: 'Mobile Usability Issues',
    description: 'Pages with mobile usability problems',
    filters: {
      dimension: 'page',
      deviceType: 'mobile',
      metrics: ['mobile_usability_issues']
    }
  },
  {
    name: 'Core Web Vitals Status',
    description: 'CWV performance across all pages',
    filters: {
      dimension: 'page',
      metrics: ['lcp', 'fid', 'cls'],
      threshold: 'good'
    }
  }
];

// Keyword Tracking Setup
export const KEYWORD_TRACKING = {
  primaryKeywords: [
    'GCSE language learning',
    'interactive vocabulary games',
    'language learning platform',
    'educational language games',
    'vocabulary practice games',
    'GCSE Spanish games',
    'GCSE French games',
    'GCSE German games',
    'gamified language learning',
    'language learning software schools'
  ],
  secondaryKeywords: [
    'Duolingo alternative schools',
    'Rosetta Stone alternative',
    'MFL teaching resources',
    'vocabulary retention games',
    'spaced repetition vocabulary',
    'language learning analytics',
    'classroom language games',
    'GCSE language preparation',
    'interactive language exercises',
    'language learning for schools'
  ],
  longTailKeywords: [
    'best language learning games for GCSE students',
    'interactive Spanish vocabulary games for schools',
    'gamified French learning platform for teachers',
    'GCSE language learning games with progress tracking',
    'vocabulary memory games for language learners'
  ],
  trackingFrequency: 'weekly',
  alertThresholds: {
    positionDrop: 5, // Alert if keyword drops more than 5 positions
    trafficDrop: 20, // Alert if traffic drops more than 20%
    newOpportunities: 3 // Alert for new keywords ranking in positions 11-20
  }
};

// Conversion Tracking Setup
export const CONVERSION_TRACKING = {
  goals: [
    {
      name: 'School Contact Form Submission',
      type: 'destination',
      url: '/schools/contact/thank-you',
      value: 500, // Estimated value in GBP
      priority: 'high'
    },
    {
      name: 'Demo Request',
      type: 'event',
      eventName: 'demo_request',
      value: 750,
      priority: 'high'
    },
    {
      name: 'Pricing Page Engagement',
      type: 'engagement',
      metric: 'time_on_page',
      threshold: 120, // 2 minutes
      value: 50,
      priority: 'medium'
    },
    {
      name: 'Game Completion',
      type: 'event',
      eventName: 'game_complete',
      value: 10,
      priority: 'medium'
    },
    {
      name: 'Newsletter Signup',
      type: 'event',
      eventName: 'newsletter_signup',
      value: 25,
      priority: 'low'
    }
  ],
  funnels: [
    {
      name: 'School Acquisition Funnel',
      steps: [
        'Landing Page Visit',
        'Pricing Page View',
        'Contact Form View',
        'Form Submission',
        'Demo Scheduled'
      ]
    },
    {
      name: 'Game Engagement Funnel',
      steps: [
        'Game Page Visit',
        'Game Start',
        'First Level Complete',
        'Session Complete',
        'Return Visit'
      ]
    }
  ]
};

// Automated Reporting Configuration
export const REPORTING_CONFIG = {
  weeklyReport: {
    recipients: ['seo@languagegems.com', 'marketing@languagegems.com'],
    metrics: [
      'organic_traffic',
      'keyword_rankings',
      'conversion_rate',
      'top_performing_content'
    ],
    format: 'email_summary'
  },
  monthlyReport: {
    recipients: ['leadership@languagegems.com'],
    metrics: [
      'traffic_growth',
      'ranking_improvements',
      'conversion_value',
      'competitive_analysis',
      'technical_health'
    ],
    format: 'detailed_dashboard'
  },
  alerts: [
    {
      name: 'Traffic Drop Alert',
      condition: 'organic_traffic_drop > 20%',
      frequency: 'immediate',
      recipients: ['seo@languagegems.com']
    },
    {
      name: 'Ranking Drop Alert',
      condition: 'keyword_position_drop > 5',
      frequency: 'daily',
      recipients: ['seo@languagegems.com']
    },
    {
      name: 'Technical Issue Alert',
      condition: 'core_web_vitals_fail OR crawl_errors > 10',
      frequency: 'immediate',
      recipients: ['dev@languagegems.com', 'seo@languagegems.com']
    }
  ]
};

// Competitor Monitoring
export const COMPETITOR_MONITORING = {
  competitors: [
    'duolingo.com',
    'babbel.com',
    'memrise.com',
    'rosettastone.com',
    'pearson.com'
  ],
  metrics: [
    'keyword_overlap',
    'ranking_changes',
    'content_updates',
    'backlink_acquisition',
    'technical_improvements'
  ],
  frequency: 'monthly',
  tools: [
    'SEMrush',
    'Ahrefs',
    'SimilarWeb',
    'Google Alerts'
  ]
};

// ROI Calculation Framework
export const ROI_FRAMEWORK = {
  costs: {
    seoTools: 200, // Monthly cost for SEO tools
    contentCreation: 2000, // Monthly content creation cost
    technicalImplementation: 1000, // One-time technical setup
    ongoingOptimization: 500 // Monthly optimization work
  },
  revenue: {
    averageSchoolValue: 699, // Annual subscription value
    conversionRate: 0.05, // 5% of inquiries convert to customers
    organicInquiries: 50, // Target monthly inquiries from SEO
    customerLifetimeValue: 2097 // 3-year average customer value
  },
  calculations: {
    monthlyROI: '(organic_inquiries * conversion_rate * average_school_value) / monthly_costs',
    annualROI: '(annual_organic_revenue - annual_seo_costs) / annual_seo_costs * 100',
    paybackPeriod: 'total_seo_investment / monthly_profit_from_seo'
  }
};
