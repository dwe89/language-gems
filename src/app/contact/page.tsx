'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Head from 'next/head';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  CheckCircle,
  ArrowRight,
  School,
  User,
  HelpCircle,
  Briefcase
} from 'lucide-react';
import Footer from '../../components/layout/Footer';
import SEOWrapper from '../../components/seo/SEOWrapper';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          contactType: formData.type
        })
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setShowSuccess(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        });
        
        // Scroll to success message
        setTimeout(() => {
          document.getElementById('success-message')?.scrollIntoView({ 
            behavior: 'smooth' 
          });
        }, 100);
      } else {
        throw new Error(result.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      alert('Sorry, there was an error sending your message. Please try again or email us directly at support@languagegems.com');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactTypes = [
    {
      value: 'general',
      label: 'General Inquiry',
      icon: MessageCircle,
      description: 'General questions about LanguageGems'
    },
    {
      value: 'schools',
      label: 'Schools & Education',
      icon: School,
      description: 'Pricing, demos, and school partnerships'
    },
    {
      value: 'support',
      label: 'Technical Support',
      icon: HelpCircle,
      description: 'Help with using the platform'
    },
    {
      value: 'enterprise',
      label: 'Enterprise Sales',
      icon: Briefcase,
      description: 'Custom solutions for large organizations'
    }
  ];

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      content: 'support@languagegems.com',
      description: 'We typically respond within 24 hours'
    },
    {
      icon: MessageCircle,
      title: 'Get Support',
      content: 'Online Help Center',
      description: 'Browse our help articles and guides',
      href: '/help'
    }
  ];

  if (isSubmitted) {
    return (
      <>
        <Head>
          <title>Thank You - LanguageGems Contact</title>
          <meta name="description" content="Your message has been sent successfully. We'll get back to you soon." />
        </Head>
            <SEOWrapper>
        <div className="flex min-h-screen flex-col">
          <main className="flex-grow flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center p-8 bg-white rounded-2xl shadow-xl max-w-md mx-auto"
            >
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-gray-600 mb-6">
                Thank you for contacting us. We'll get back to you within 24 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    type: 'general'
                  });
                }}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl px-6 py-3 hover:shadow-lg transition-all"
              >
                Send Another Message
              </button>
            </motion.div>
          </main>
          <Footer />
        </div>
      </SEOWrapper>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Contact Us - LanguageGems | Get in Touch</title>
        <meta name="description" content="Contact LanguageGems for support, partnerships, or general inquiries. We're here to help with your language learning journey." />
      </Head>
    <SEOWrapper>
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          {/* Hero Section */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-100 py-16">
            <div className="container mx-auto px-6 text-center">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl md:text-5xl font-bold text-gray-900 mb-6"
              >
                Get in Touch
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
              >
                Have questions about LanguageGems? We'd love to hear from you. 
                Send us a message and we'll respond as soon as possible.
              </motion.p>
            </div>
          </div>

          {/* Contact Form & Info */}
          <div className="py-16 bg-white">
            <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  className="bg-gray-50 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Contact Type */}
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        What can we help you with?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {contactTypes.map((type) => (
                          <label
                            key={type.value}
                            className={`flex items-center p-3 rounded-lg border-2 cursor-pointer transition-all ${
                              formData.type === type.value
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <input
                              type="radio"
                              name="type"
                              value={type.value}
                              checked={formData.type === type.value}
                              onChange={handleInputChange}
                              className="sr-only"
                            />
                            <type.icon className="w-5 h-5 text-blue-600 mr-3 flex-shrink-0" />
                            <div>
                              <div className="font-semibold text-gray-900 text-sm">{type.label}</div>
                              <div className="text-xs text-gray-600">{type.description}</div>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Name & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Your full name"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="your@email.com"
                        />
                      </div>
                    </div>

                    {/* Subject */}
                    <div>
                      <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="What's this about?"
                      />
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        placeholder="Tell us more about your inquiry..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl px-8 py-4 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-5 w-5" />
                          Send Message
                        </>
                      )}
                    </button>
                  </form>

                  {/* Success Message */}
                  {showSuccess && (
                    <div 
                      id="success-message"
                      className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg"
                    >
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <div>
                          <h3 className="text-sm font-semibold text-green-800">Message Sent Successfully!</h3>
                          <p className="text-sm text-green-600 mt-1">
                            Thank you for your message. We'll get back to you within 24 hours.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>

                {/* Contact Information */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="space-y-8"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Other Ways to Reach Us</h2>
                    <div className="space-y-6">
                      {contactInfo.map((info, index) => (
                        <div key={index} className="flex items-start space-x-4">
                          <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                            <info.icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 mb-1">{info.title}</h3>
                            {info.href ? (
                              <Link href={info.href} className="text-lg text-blue-600 font-semibold mb-1 hover:underline">
                                {info.content}
                              </Link>
                            ) : info.content.includes('@') ? (
                              <a href={`mailto:${info.content}`} className="text-lg text-blue-600 font-semibold mb-1 hover:underline">
                                {info.content}
                              </a>
                            ) : (
                              <p className="text-lg text-blue-600 font-semibold mb-1">{info.content}</p>
                            )}
                            <p className="text-gray-600 text-sm">{info.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Response Time */}
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <div className="flex items-center mb-4">
                      <Clock className="w-6 h-6 text-blue-600 mr-3" />
                      <h3 className="font-bold text-gray-900">Response Times</h3>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex justify-between">
                        <span>General Inquiries:</span>
                        <span className="font-semibold">Within 24 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Technical Support:</span>
                        <span className="font-semibold">Within 4 hours</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sales Inquiries:</span>
                        <span className="font-semibold">Within 2 hours</span>
                      </div>
                    </div>
                  </div>

                  {/* Quick Links */}
                  <div className="bg-gray-50 rounded-2xl p-6">
                    <h3 className="font-bold text-gray-900 mb-4">Quick Links</h3>
                    <div className="space-y-3">
                      <a href="/pricing" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        View Pricing Plans
                      </a>
                      <a href="/features" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Explore Features
                      </a>
                      <a href="/schools" className="flex items-center text-blue-600 hover:text-blue-800 transition-colors">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Schools Information
                      </a>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </SEOWrapper>
    </>
  );
}
