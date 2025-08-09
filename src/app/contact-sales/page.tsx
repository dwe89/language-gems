'use client';

import Link from 'next/link';
import Head from 'next/head';
import { useState } from 'react';
import { 
  Mail, Phone, Clock, MapPin, Send, CheckCircle,
  Users, Building, GraduationCap, Star, Award,
  Calendar, MessageCircle, ExternalLink, Zap
} from 'lucide-react';
import Footer from '../../components/layout/Footer';

export default function ContactSalesPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    school: '',
    role: '',
    studentCount: '',
    inquiryType: '',
    message: '',
    preferredContact: 'email'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email Us',
      description: 'Get a response within 24 hours',
      contact: 'hello@languagegems.com',
      action: 'mailto:hello@languagegems.com'
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: 'Speak with our education specialists',
      contact: 'Available on request',
      action: '#'
    },
    {
      icon: Calendar,
      title: 'Book a Demo',
      description: 'See Language Gems in action',
      contact: 'Schedule a personalized demo',
      action: '/contact-sales'
    }
  ];

  const benefits = [
    {
      icon: Users,
      title: 'Dedicated Support',
      description: 'Personal account manager and priority support for all school customers'
    },
    {
      icon: GraduationCap,
      title: 'Curriculum Alignment',
      description: 'Content specifically designed for GCSE, A-Level, and international curricula'
    },
    {
      icon: Award,
      title: 'Innovative Features',
      description: 'Cutting-edge language learning tools designed for modern classrooms'
    },
    {
      icon: Zap,
      title: 'Quick Implementation',
      description: 'Get your entire school up and running in less than 48 hours'
    }
  ];

  const testimonials = [
    {
      quote: "The interactive games and comprehensive analytics have transformed how we approach language learning in our department.",
      author: "Modern Languages Teacher",
      role: "Secondary School",
      school: "UK Education System"
    },
    {
      quote: "The platform's alignment with curriculum standards and detailed progress tracking helps us support every student effectively.",
      author: "Language Department Head",
      role: "Comprehensive School",
      school: "Educational Institution"
    }
  ];

  const pricingHighlights = [
    'Volume discounts for larger schools',
    'Flexible payment terms available',
    'Free training and onboarding',
    'No setup or hidden fees',
    '30-day money-back guarantee'
  ];

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-2xl mx-4">
          <CheckCircle className="h-20 w-20 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Thank You!</h1>
          <p className="text-lg text-gray-600 mb-8">
            We've received your inquiry and will get back to you within 24 hours. 
            Our education specialists are excited to help you transform language learning at your school.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/schools/pricing"
              className="bg-indigo-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-colors"
            >
              View Pricing
            </Link>
            <Link
              href="/"
              className="border-2 border-indigo-600 text-indigo-600 px-8 py-4 rounded-2xl font-bold hover:bg-indigo-600 hover:text-white transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Sales | School Pricing & Demos | Language Gems for Schools</title>
        <meta name="description" content="Contact our education specialists for school pricing, demos, and bulk licensing. Get Language Gems GCSE language learning platform for your entire MFL department." />
        <meta name="keywords" content="Language Gems schools, GCSE language learning pricing, MFL department licensing, school demos, education sales" />
        <link rel="canonical" href="https://languagegems.com/contact-sales" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Sales</h1>
          <p className="text-xl text-indigo-100 mb-8 max-w-3xl mx-auto">
            Ready to transform language learning at your school? Our education specialists are here to help you get started with Language Gems.
          </p>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold">Growing</div>
              <div className="text-indigo-200">Teacher Community</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Engaging</div>
              <div className="text-indigo-200">Student Experience</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold">Proven</div>
              <div className="text-indigo-200">Learning Results</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Get in Touch</h2>
            <p className="text-gray-600 mb-8">
              Fill out the form below and our education specialists will contact you to discuss how Language Gems can benefit your school.
            </p>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">First Name *</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Last Name *</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">School/Institution *</label>
                  <input
                    type="text"
                    name="school"
                    value={formData.school}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Your Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select your role</option>
                    <option value="teacher">Teacher</option>
                    <option value="head-of-department">Head of Department</option>
                    <option value="headteacher">Headteacher</option>
                    <option value="it-coordinator">IT Coordinator</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Number of Students</label>
                  <select
                    name="studentCount"
                    value={formData.studentCount}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select range</option>
                    <option value="1-50">1-50 students</option>
                    <option value="51-200">51-200 students</option>
                    <option value="201-500">201-500 students</option>
                    <option value="501-1000">501-1000 students</option>
                    <option value="1000+">1000+ students</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    value={formData.inquiryType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                  >
                    <option value="">Select type</option>
                    <option value="pricing">Pricing Information</option>
                    <option value="demo">Request Demo</option>
                    <option value="trial">Free Trial</option>
                    <option value="features">Feature Questions</option>
                    <option value="implementation">Implementation Support</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={4}
                  placeholder="Tell us about your specific needs and how we can help..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-900 mb-2">Preferred Contact Method</label>
                <div className="flex gap-4">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="email"
                      checked={formData.preferredContact === 'email'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Email
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="preferredContact"
                      value="phone"
                      checked={formData.preferredContact === 'phone'}
                      onChange={handleInputChange}
                      className="mr-2"
                    />
                    Phone
                  </label>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information & Benefits */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h3>
              <div className="space-y-6">
                {contactMethods.map((method, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="bg-indigo-100 p-3 rounded-xl">
                      <method.icon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-gray-900">{method.title}</h4>
                      <p className="text-gray-600 mb-2">{method.description}</p>
                      <a
                        href={method.action}
                        className="text-indigo-600 font-semibold hover:text-indigo-700 transition-colors"
                      >
                        {method.contact}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-white rounded-3xl shadow-xl p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Why Schools Choose Language Gems</h3>
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <benefit.icon className="h-6 w-6 text-indigo-600 mt-1" />
                    <div>
                      <h4 className="font-semibold text-gray-900">{benefit.title}</h4>
                      <p className="text-gray-600 text-sm">{benefit.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pricing Highlights */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 text-white">
              <h3 className="text-2xl font-bold mb-4">Flexible Pricing</h3>
              <ul className="space-y-2">
                {pricingHighlights.map((highlight, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle className="h-5 w-5 mr-3 text-indigo-200" />
                    {highlight}
                  </li>
                ))}
              </ul>
              <Link
                href="/schools/pricing"
                className="inline-flex items-center mt-6 bg-white text-indigo-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-100 transition-colors"
              >
                View Full Pricing
                <ExternalLink className="h-4 w-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">What Schools Are Saying</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-500 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.author}</div>
                  <div className="text-gray-600">{testimonial.role}</div>
                  <div className="text-gray-500 text-sm">{testimonial.school}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
    </>
  );
}
