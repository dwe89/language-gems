import { Metadata } from 'next';
import Link from 'next/link';
import { 
  Users, 
  MessageCircle, 
  BookOpen, 
  Share2, 
  Star, 
  ArrowRight,
  Heart,
  Trophy,
  Lightbulb
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'Language Learning Community | Teacher Network | Language Gems',
  description: 'Join the Language Gems teacher community. Share resources, get teaching tips, and connect with other MFL educators using our platform.',
};

export default function CommunityPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl font-bold mb-6">
              Join the Language Gems Community
            </h1>
            <p className="text-xl text-indigo-100 mb-8">
              Connect with thousands of MFL teachers, share resources, and discover new teaching strategies that transform language learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                Join the Community
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Community Features */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Teachers Love Our Community
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Be part of a supportive network where MFL educators share ideas, resources, and celebrate student success together.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Teacher Network</h3>
              <p className="text-gray-600 mb-6">
                Connect with MFL teachers from around the world. Share experiences, ask questions, and learn from each other.
              </p>
              <div className="text-indigo-600 font-semibold">5,000+ Active Teachers</div>
            </div>

            {/* Feature 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                <BookOpen className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Resource Sharing</h3>
              <p className="text-gray-600 mb-6">
                Access thousands of teacher-created resources, worksheets, and lesson plans. Share your own creations too!
              </p>
              <div className="text-purple-600 font-semibold">10,000+ Resources</div>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <Lightbulb className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Teaching Tips</h3>
              <p className="text-gray-600 mb-6">
                Discover innovative teaching strategies, classroom management tips, and ways to boost student engagement.
              </p>
              <div className="text-green-600 font-semibold">Weekly Tips & Tricks</div>
            </div>

            {/* Feature 4 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-yellow-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Success Stories</h3>
              <p className="text-gray-600 mb-6">
                Celebrate student achievements and share success stories that inspire the entire community.
              </p>
              <div className="text-yellow-600 font-semibold">Daily Celebrations</div>
            </div>

            {/* Feature 5 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Discussion Forums</h3>
              <p className="text-gray-600 mb-6">
                Join topic-specific discussions about curriculum, assessment, technology, and more.
              </p>
              <div className="text-red-600 font-semibold">24/7 Support</div>
            </div>

            {/* Feature 6 */}
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Share2 className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Professional Development</h3>
              <p className="text-gray-600 mb-6">
                Access webinars, training sessions, and professional development opportunities.
              </p>
              <div className="text-blue-600 font-semibold">Monthly Webinars</div>
            </div>
          </div>
        </div>
      </div>

      {/* Community Stats */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-indigo-200">Active Teachers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50,000+</div>
              <div className="text-indigo-200">Students Reached</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">10,000+</div>
              <div className="text-indigo-200">Resources Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">25+</div>
              <div className="text-indigo-200">Countries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Teachers Are Saying
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The Language Gems community has transformed my teaching. The resources and support from fellow teachers are invaluable!"
              </p>
              <div className="font-semibold text-gray-900">Sarah Johnson</div>
              <div className="text-gray-500">Spanish Teacher, London</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "I love how easy it is to share resources and get feedback from other MFL teachers. It's like having a staffroom that never closes!"
              </p>
              <div className="font-semibold text-gray-900">Michael Chen</div>
              <div className="text-gray-500">French Teacher, Manchester</div>
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-gray-600 mb-6">
                "The professional development opportunities and teaching tips have helped me become a better educator. Highly recommend!"
              </p>
              <div className="font-semibold text-gray-900">Emma Williams</div>
              <div className="text-gray-500">German Teacher, Birmingham</div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to Join Our Community?
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Start connecting with fellow MFL teachers today and take your teaching to the next level.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/auth/signup"
                className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
              >
                Join for Free
                <Heart className="ml-2 w-5 h-5" />
              </Link>
              <Link
                href="/schools"
                className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-600 hover:text-white transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
