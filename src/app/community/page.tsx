'use client';

import Link from 'next/link';
import { useState } from 'react';
import { 
  Users, MessageCircle, Heart, Star, Trophy, 
  Calendar, MapPin, ExternalLink, Quote,
  Facebook, Twitter, Instagram, Youtube,
  BookOpen, Gamepad2, Award, Globe
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState('stories');

  const userStories = [
    {
      name: 'Sarah Mitchell',
      role: 'French Teacher',
      school: 'Westfield Academy',
      location: 'Manchester, UK',
      image: '/images/community/sarah.jpg',
      story: 'Language Gems has transformed my classroom! My students are more engaged than ever, and their vocabulary retention has improved by 40%. The analytics help me identify exactly where each student needs support.',
      achievement: 'Increased student engagement by 85%',
      games: ['Memory Match', 'Hangman', 'Vocab Blast']
    },
    {
      name: 'Carlos Rodriguez',
      role: 'Spanish Teacher',
      school: 'International School of London',
      location: 'London, UK',
      image: '/images/community/carlos.jpg',
      story: 'The detective-themed games are absolutely brilliant! My Year 9 students who usually struggle with listening comprehension are now asking for more audio activities. The platform makes differentiation effortless.',
      achievement: 'Improved listening scores by 60%',
      games: ['Detective Listening', 'Noughts & Crosses', 'Word Scramble']
    },
    {
      name: 'Emma Thompson',
      role: 'German Teacher',
      school: 'Riverside High School',
      location: 'Birmingham, UK',
      image: '/images/community/emma.jpg',
      story: 'As a new teacher, Language Gems gave me the confidence to create engaging lessons from day one. The ready-made vocabulary sets aligned with GCSE requirements saved me hours of preparation time.',
      achievement: 'Reduced lesson prep time by 70%',
      games: ['Conjugation Duel', 'Memory Match', 'Sentence Builder']
    }
  ];

  const communityStats = [
    { label: 'Active Teachers', value: '2,500+', icon: Users },
    { label: 'Students Engaged', value: '45,000+', icon: BookOpen },
    { label: 'Games Played', value: '1.2M+', icon: Gamepad2 },
    { label: 'Success Stories', value: '850+', icon: Trophy }
  ];

  const events = [
    {
      title: 'Language Gems Webinar: Advanced Analytics',
      date: '2024-02-15',
      time: '16:00 GMT',
      type: 'Online Webinar',
      description: 'Learn how to use our analytics dashboard to drive student outcomes',
      attendees: 156
    },
    {
      title: 'MFL Teachers Meetup - London',
      date: '2024-02-22',
      time: '18:30 GMT',
      type: 'In-Person',
      location: 'Central London',
      description: 'Network with fellow Language Gems users and share best practices',
      attendees: 45
    },
    {
      title: 'Game Design Workshop',
      date: '2024-03-01',
      time: '15:00 GMT',
      type: 'Online Workshop',
      description: 'Collaborate on new game ideas and features with our development team',
      attendees: 89
    }
  ];

  const socialLinks = [
    {
      name: 'Facebook',
      icon: Facebook,
      url: 'https://facebook.com/languagegems',
      followers: '3.2K',
      description: 'Daily tips and community highlights'
    },
    {
      name: 'Twitter',
      icon: Twitter,
      url: 'https://twitter.com/languagegems',
      followers: '5.8K',
      description: 'Latest updates and education news'
    },
    {
      name: 'Instagram',
      icon: Instagram,
      url: 'https://instagram.com/languagegems',
      followers: '2.1K',
      description: 'Behind-the-scenes and student success'
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://youtube.com/languagegems',
      followers: '1.9K',
      description: 'Tutorials and teacher testimonials'
    }
  ];

  const forumTopics = [
    {
      title: 'Best practices for using Memory Match with Year 7',
      author: 'TeacherMike92',
      replies: 23,
      lastActivity: '2 hours ago',
      category: 'Game Strategies'
    },
    {
      title: 'Custom vocabulary lists for GCSE preparation',
      author: 'FrenchTeacherSarah',
      replies: 45,
      lastActivity: '4 hours ago',
      category: 'Curriculum Planning'
    },
    {
      title: 'Analytics interpretation - need help!',
      author: 'NewTeacher2024',
      replies: 12,
      lastActivity: '6 hours ago',
      category: 'Technical Support'
    },
    {
      title: 'Celebrating student achievements with Language Gems',
      author: 'SpanishProf',
      replies: 31,
      lastActivity: '1 day ago',
      category: 'Success Stories'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Community</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Join thousands of educators transforming language learning with Language Gems. 
            Share experiences, get support, and celebrate success together.
          </p>
          
          {/* Community Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            {communityStats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="h-8 w-8 mx-auto mb-2 text-indigo-200" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-indigo-200 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'stories', name: 'Success Stories', icon: Quote },
            { id: 'forum', name: 'Community Forum', icon: MessageCircle },
            { id: 'events', name: 'Events', icon: Calendar },
            { id: 'social', name: 'Social Media', icon: Globe }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-6 py-3 rounded-2xl font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Success Stories */}
        {activeTab === 'stories' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Teacher Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Discover how educators around the world are using Language Gems to transform their classrooms
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
              {userStories.map((story, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center mb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {story.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-bold text-gray-900">{story.name}</h3>
                      <p className="text-gray-600">{story.role}</p>
                      <p className="text-sm text-gray-500 flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        {story.location}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <Quote className="h-6 w-6 text-indigo-600 mb-2" />
                    <p className="text-gray-700 italic">{story.story}</p>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3 mb-4">
                    <div className="flex items-center text-green-800">
                      <Trophy className="h-4 w-4 mr-2" />
                      <span className="font-semibold text-sm">{story.achievement}</span>
                    </div>
                  </div>
                  
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-2">Favorite Games:</p>
                    <div className="flex flex-wrap gap-2">
                      {story.games.map((game, gameIndex) => (
                        <span key={gameIndex} className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs">
                          {game}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Community Forum */}
        {activeTab === 'forum' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Community Forum</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Connect with fellow educators, share strategies, and get help from the community
              </p>
            </div>
            
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Recent Discussions</h3>
                <Link
                  href="#"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Join Forum
                </Link>
              </div>
              
              <div className="space-y-4">
                {forumTopics.map((topic, index) => (
                  <div key={index} className="border border-gray-200 rounded-xl p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-lg font-semibold text-gray-900 hover:text-indigo-600 cursor-pointer">
                        {topic.title}
                      </h4>
                      <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                        {topic.category}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>by {topic.author}</span>
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <MessageCircle className="h-4 w-4 mr-1" />
                          {topic.replies} replies
                        </span>
                        <span>{topic.lastActivity}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Events */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Join our webinars, workshops, and meetups to connect with the community
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.map((event, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                      {event.type}
                    </span>
                    <div className="flex items-center text-gray-500 text-sm">
                      <Users className="h-4 w-4 mr-1" />
                      {event.attendees}
                    </div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                  <p className="text-gray-600 mb-4">{event.description}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(event.date).toLocaleDateString('en-GB', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      {event.time}
                    </div>
                    {event.location && (
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        {event.location}
                      </div>
                    )}
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
                    Register Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Social Media */}
        {activeTab === 'social' && (
          <div className="space-y-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Follow Us</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Stay connected with the Language Gems community across all platforms
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all transform hover:scale-105 text-center"
                >
                  <social.icon className="h-12 w-12 mx-auto mb-4 text-indigo-600" />
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{social.name}</h3>
                  <p className="text-2xl font-bold text-indigo-600 mb-2">{social.followers}</p>
                  <p className="text-gray-600 text-sm">{social.description}</p>
                  <div className="mt-4 flex items-center justify-center text-indigo-600">
                    <span className="mr-2">Follow</span>
                    <ExternalLink className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Join Our Community</h2>
          <p className="text-xl text-indigo-100 mb-8">
            Be part of a growing network of educators transforming language learning
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/signup"
              className="bg-white text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center"
            >
              <Users className="h-5 w-5 mr-2" />
              Join Language Gems
            </Link>
            <Link
              href="/contact-sales"
              className="border-2 border-white text-white px-8 py-4 rounded-2xl font-bold hover:bg-white hover:text-indigo-600 transition-colors flex items-center justify-center"
            >
              <MessageCircle className="h-5 w-5 mr-2" />
              Get in Touch
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
