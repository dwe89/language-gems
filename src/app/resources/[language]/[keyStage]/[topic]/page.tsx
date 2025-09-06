import React from 'react';
import Link from 'next/link';
import { ArrowLeft, FileText, BookOpen, ShoppingCart, MessageSquare, User, Home, School, Gamepad2, Utensils, Shirt, Monitor, Heart, Plane, Briefcase, TreePine } from 'lucide-react';
import FreebiesBreadcrumb from '../../../../../components/freebies/FreebiesBreadcrumb';
import TopicClientContent from './TopicClientContent';

// --- Topic Configs and Static Params ---
const KS3_TOPICS = [
  {
    id: 'basics-core-language',
    name: 'Basics & Core Language',
    description: 'Greetings, common phrases, numbers, classroom language, and more',
    icon: <MessageSquare className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Greetings & Introductions',
      'Common Phrases & Opinions',
      'Numbers, Dates, Time',
      'Colours',
      'Days, Months & Seasons',
      'Classroom Language',
    ],
  },
  {
    id: 'identity-personal-life',
    name: 'Identity & Personal Life',
    description: 'Personal information, family, friends, and pets',
    icon: <User className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Personal Information',
      'Family & Friends',
      'Physical & Personality Descriptions',
      'Pets',
    ],
  },
  {
    id: 'home-local-area',
    name: 'Home & Local Area',
    description: 'House, local area, shops, and directions',
    icon: <Home className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'House, Rooms & Furniture',
      'Household Items & Chores',
      'Types of Housing',
      'Local Area & Places in Town',
      'Shops & Services',
      'Directions & Prepositions',
    ],
  },
  {
    id: 'school-education',
    name: 'School & Education',
    description: 'School subjects, rules, objects, and routines',
    icon: <School className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'School Subjects & Timetable',
      'School Rules & Opinions',
      'Classroom Objects',
      'Daily Routine at School',
    ],
  },
  {
    id: 'free-time-leisure',
    name: 'Free Time & Leisure',
    description: 'Hobbies, sports, music, and social activities',
    icon: <Gamepad2 className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Hobbies & Interests',
      'Sports',
      'Music, TV & Film',
      'Social Activities',
    ],
  },
  {
    id: 'food-drink',
    name: 'Food & Drink',
    description: 'Meals, food vocabulary, shopping, and eating out',
    icon: <Utensils className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Meals & Eating Habits',
      'Food & Drink Vocabulary',
      'Ordering in Cafés & Restaurants',
      'Shopping for Food',
    ],
  },
  {
    id: 'clothes-shopping',
    name: 'Clothes & Shopping',
    description: 'Clothes, accessories, and shopping phrases',
    icon: <Shirt className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Clothes & Accessories',
      'Shopping Phrases & Prices',
    ],
  },
  {
    id: 'technology-communication',
    name: 'Technology & Communication',
    description: 'Mobile phones, social media, and digital devices',
    icon: <Monitor className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Mobile Phones & Social Media',
      'Internet & Digital Devices',
    ],
  },
  {
    id: 'health-lifestyle',
    name: 'Health & Lifestyle',
    description: 'Body, illnesses, doctor, and healthy living',
    icon: <Heart className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Parts of the Body',
      'Illnesses & Symptoms',
      'At the Doctor’s',
      'Healthy Living',
    ],
  },
  {
    id: 'holidays-travel',
    name: 'Holidays & Travel',
    description: 'Countries, transport, accommodation, and weather',
    icon: <Plane className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Countries & Nationalities',
      'Transport & Travel Phrases',
      'Accommodation',
      'Holiday Activities',
      'Weather',
    ],
  },
  {
    id: 'jobs-future-plans',
    name: 'Jobs & Future Plans',
    description: 'Professions, ambitions, and job qualities',
    icon: <Briefcase className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Professions & Jobs',
      'Future Ambitions',
      'Qualities for Jobs',
    ],
  },
  {
    id: 'nature-environment',
    name: 'Nature & Environment',
    description: 'Animals, weather, environmental problems, and global issues',
    icon: <TreePine className="h-8 w-8 text-indigo-600" />,
    subcategories: [
      'Animals & Plants',
      'Weather & Seasons',
      'Environmental Problems',
      'Global Issues',
    ],
  },
  {
    id: 'culture-festivals',
    name: 'Culture & Festivals',
    description: 'Traditions, festivals, and celebrations in Spanish-speaking countries',
    icon: '🎉',
    subcategories: [
      'Spanish-speaking Countries & Traditions',
      'Festivals & Celebrations (Christmas, Día de los Muertos, etc.)',
    ],
  },
];

const KS4_TOPICS = [
  'identity-and-relationships-with-others',
  'healthy-living-and-lifestyle',
  'education-and-work',
  'free-time-activities',
  'customs-festivals-and-celebrations',
  'celebrity-culture',
  'travel-and-tourism-including-places-of-interest',
  'media-and-technology',
  'the-environment-and-where-people-live',
];

const KS5_TOPICS = [
  'literature',
  'politics-society',
  'business-economics',
  'science-technology',
];

const TOPIC_CONFIGS: Record<string, any> = {
  ks3: KS3_TOPICS.reduce((acc, t) => { acc[t.id] = t; return acc; }, {} as Record<string, any>),
  ks4: {}, // Fill as needed
  ks5: {}, // Fill as needed
};

const LANGUAGES = ['spanish', 'french', 'german'];
const KEY_STAGES = ['ks3', 'ks4', 'ks5'];

// --- Server Component ---
export default function TopicPage({ params }: { params: { language: string; keyStage: string; topic: string } }) {
  const { language, keyStage, topic } = params;
  const topicConfig = TOPIC_CONFIGS[keyStage]?.[topic];

  if (!topicConfig) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Topic Not Found</h1>
          <p className="text-gray-600 mb-8">The topic you're looking for doesn't exist.</p>
          <Link href="/resources" className="bg-blue-600 text-white px-6 py-3 rounded-lg">
            Back to Resources
          </Link>
        </div>
      </div>
    );
  }

  const capitalizedLanguage = language.charAt(0).toUpperCase() + language.slice(1);
  const keyStageUpper = keyStage.toUpperCase();
  const breadcrumbItems = [
    { label: 'Resources', href: '/resources' },
    { label: capitalizedLanguage, href: `/resources/${language}` },
    { label: keyStageUpper, href: `/resources/${language}/${keyStage}` },
    { label: topicConfig.name, active: true }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <FreebiesBreadcrumb items={breadcrumbItems} className="mb-4" />
        </div>
        <div className="w-full h-2 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full mb-8"></div>
        {/* Subcategories for KS3 topics */}
        {topicConfig.subcategories && (
          <div className="mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Subcategories</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {topicConfig.subcategories.map((sub: string) => (
                <li key={sub} className="bg-white rounded-lg shadow p-4 border border-slate-200 text-slate-800">
                  {sub}
                </li>
              ))}
            </ul>
          </div>
        )}
        {/* Client-side content (products, cart, etc.) */}
        <TopicClientContent language={language} keyStage={keyStage} topic={topic} topicConfig={topicConfig} />
      </div>
    </div>
  );
}

// --- Static Params Generation for Next.js App Router ---
export async function generateStaticParams() {
  const params = [];
  for (const language of LANGUAGES) {
    for (const keyStage of KEY_STAGES) {
      let topics: string[] = [];
      if (keyStage === 'ks3') topics = KS3_TOPICS.map(t => t.id);
      if (keyStage === 'ks4') topics = KS4_TOPICS;
      if (keyStage === 'ks5') topics = KS5_TOPICS;
      for (const topic of topics) {
        params.push({ language, keyStage, topic });
      }
    }
  }
  return params;
}
