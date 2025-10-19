
import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { generateMetadata } from '../../components/seo/SEOWrapper';
import AssessmentsPageWrapper from '../../components/assessments/AssessmentsPageWrapper';
import {
  BookOpen,
  FileText,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Target,
  PenTool,
  Info,
  Headphones,
  MessageSquare
} from 'lucide-react';
import DevWarningDialog from '../../components/assessments/DevWarningDialog';

export const metadata: Metadata = generateMetadata({
  title: 'GCSE Language Assessments | Reading Comprehension & Vocabulary Tests | Language Gems',
  description: 'Complete GCSE language assessments including reading comprehension, listening tests, and vocabulary practice. Official practice materials for AQA exams.',
  canonical: '/assessments'
});
import Footer from '../../components/layout/Footer';

const AssessmentCard = ({
  title,
  description,
  icon: Icon,
  href,
  features,
  estimatedTime,
  skillsAssessed,
  color = "blue",
  compact = false
}: {
  title: string;
  description: string;
  icon: any;
  href: string;
  features: string[];
  estimatedTime: string;
  skillsAssessed: string[];
  color?: string;
  compact?: boolean;
}) => {
  const colorClasses = {
    blue: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    green: "from-green-500 to-green-600 hover:from-green-600 hover:to-green-700",
    purple: "from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700",
    indigo: "from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700",
    orange: "from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
  };

  if (compact) {
    return (
      <Link href={href} className="block bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className={`h-1.5 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}></div>
        <div className="p-4">
          <div className="flex items-center mb-3">
            <div className={`p-2 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white mr-3`}>
              <Icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-gray-600 text-xs">{description}</p>
            </div>
          </div>
          <div className="flex items-center justify-between text-xs text-gray-600 mb-3">
            <div className="flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              <span>{estimatedTime}</span>
            </div>
            <div className="flex items-center">
              <Target className="h-3 w-3 mr-1" />
              <span>{skillsAssessed.join(', ')}</span>
            </div>
          </div>
          <div className={`flex items-center justify-center text-sm font-semibold text-${color}-600`}>
            View Papers
            <ArrowRight className="h-3 w-3 ml-1" />
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
      <div className={`h-2 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]}`}></div>

      <div className="p-6 flex flex-col flex-grow">
        <div className="flex items-center mb-4">
          <div className={`p-3 rounded-lg bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white mr-4`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
            <p className="text-gray-600 text-sm">{description}</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>{estimatedTime}</span>
          </div>

          <div className="flex items-center text-sm text-gray-600">
            <Target className="h-4 w-4 mr-2" />
            <span>Skills: {skillsAssessed.join(', ')}</span>
          </div>
        </div>

        <div className="space-y-2 mb-6 flex-grow">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center text-sm text-gray-700">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
              <span>{feature}</span>
            </div>
          ))}
        </div>

        <Link
          href={href}
          className={`w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses]} text-white rounded-lg font-semibold transition-all hover:shadow-lg mt-auto`}
        >
          Start Assessment
          <ArrowRight className="h-4 w-4 ml-2" />
        </Link>
      </div>
    </div>
  );
};

export default function AssessmentsPage() {
  // Client-side development warning handled by DevWarningDialog component

  const gcseExams = [
    {
      title: "GCSE Reading Exam",
      description: "AQA & Edexcel papers",
      icon: BookOpen,
      href: "/assessments/gcse-reading",
      color: "blue",
      estimatedTime: "45-60 min",
      skillsAssessed: ["Reading"],
      features: []
    },
    {
      title: "GCSE Listening Exam",
      description: "AQA & Edexcel papers",
      icon: Headphones,
      href: "/assessments/gcse-listening",
      color: "green",
      estimatedTime: "35-45 min",
      skillsAssessed: ["Listening"],
      features: []
    },
    {
      title: "GCSE Writing Exam",
      description: "AQA papers available",
      icon: PenTool,
      href: "/assessments/gcse-writing",
      color: "purple",
      estimatedTime: "60-75 min",
      skillsAssessed: ["Writing"],
      features: []
    },
    {
      title: "GCSE Speaking Exam",
      description: "Coming Soon",
      icon: MessageSquare,
      href: "/assessments/gcse-speaking",
      color: "orange",
      estimatedTime: "7-12 min",
      skillsAssessed: ["Speaking"],
      features: []
    }
  ];

  const otherAssessments = [
    {
      title: "Reading Comprehension",
      description: "Test your understanding of written texts",
      icon: BookOpen,
      href: "/reading-comprehension",
      color: "blue",
      estimatedTime: "15-25 minutes",
      skillsAssessed: ["Reading", "Comprehension"],
      features: [
        "Age-appropriate texts in Spanish, French, and German",
        "Multiple question types (multiple choice, true/false, short answer)",
        "Immediate feedback and detailed explanations",
        "Progress tracking and performance analytics",
        "Gamified rewards and achievements"
      ]
    },
    {
      title: "Topic-Based Assessments",
      description: "Focused practice on specific AQA themes and topics (Reading Skill)",
      icon: FileText,
      href: "/exam-style-assessment-topic",
      color: "indigo",
      estimatedTime: "15-25 minutes",
      skillsAssessed: ["Reading", "Vocabulary", "Grammar"],
      features: [
        "Specific AQA themes: People & lifestyle, Popular culture, Communication & the world",
        "Targeted topics within each theme",
        "Foundation and Higher tier options",
        "Ideal for focused revision and skill reinforcement",
        "Covers key vocabulary and grammar in context"
      ]
    },
    {
      title: "Dictation Practice",
      description: "Improve listening and writing skills with GCSE-style dictation exercises",
      icon: PenTool,
      href: "/dictation",
      color: "green",
      estimatedTime: "10-15 minutes",
      skillsAssessed: ["Listening", "Writing", "Spelling"],
      features: [
        "5 dictation sentences per assessment",
        "Three playback speeds: Full, Slow, and Very Slow",
        "Foundation and Higher tier options",
        "Spanish, French, and German language support",
        "Authentic GCSE-style content and format"
      ]
    }
  ];
  return (
    <>
    <AssessmentsPageWrapper>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Language Assessments
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Evaluate your language skills with our comprehensive assessment tools.
              Choose from reading comprehension, exam-style practice, or topic-based assessments.
            </p>
          </div>
        </div>
      </div>

      {/* NEW: Concise Disclaimer Notice */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-blue-50 border border-blue-200 text-blue-700 rounded-lg p-4 flex items-start text-sm">
          <Info className="h-5 w-5 flex-shrink-0 mr-3 text-blue-500" />
          <div>
            <p className="font-medium mb-1">Important Note on Assessment Content:</p>
            <p>Our assessment materials, including exam-style questions, are original content designed to realistically reflect official formats for practice purposes. LanguageGems is not affiliated with any official examination board. <Link href="/legal/disclaimer" target="_blank" rel="noopener noreferrer" className="font-semibold underline hover:text-blue-900">Read our full disclaimer.</Link></p>
          </div>
        </div>
      </div>


      {/* GCSE Exam Papers Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">GCSE Exam Papers</h2>
          <p className="text-gray-600">Official exam-style papers for AQA and Edexcel exam boards</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {gcseExams.map((assessment, index) => (
            <AssessmentCard
              key={index}
              {...assessment}
              compact={true}
            />
          ))}
        </div>
      </div>

      {/* Other Assessments Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Practice Assessments</h2>
          <p className="text-gray-600">Additional practice materials and skill-building exercises</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
          {otherAssessments.map((assessment, index) => (
            <AssessmentCard
              key={index}
              {...assessment}
            />
          ))}
        </div>
      </div>

      {/* Additional Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Why Use Our Assessments?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Gamified Progress</h3>
              <p className="text-gray-600 text-sm">Earn points, unlock achievements, and track your progress</p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Targeted Feedback</h3>
              <p className="text-gray-600 text-sm">Get detailed insights into your strengths and areas for improvement</p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Exam Preparation</h3>
              <p className="text-gray-600 text-sm">Practice with realistic exam formats and question types</p>
            </div>

            <div className="text-center">
              <div className="bg-indigo-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-indigo-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600 text-sm">Receive immediate feedback and detailed performance reports</p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Test Your Skills?</h2>
          <p className="text-xl mb-8 opacity-90">
            Start with any assessment type and discover your language proficiency level
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/assessments/gcse-reading"
              className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Quick Start: GCSE Reading Exam
            </Link>
            <Link
              href="/assessments/gcse-listening"
              className="px-8 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
            >
              Practice: GCSE Listening Exam
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  </AssessmentsPageWrapper>

  {/* Development Warning Popup (client) */}
  <DevWarningDialog />
    </>
  );
}