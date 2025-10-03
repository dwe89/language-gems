'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Mail, Clock, Send, MessageCircle, Zap, Shield, Users, Globe } from 'lucide-react';
import Footer from '../../components/layout/Footer';

interface FormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  type: string;
}

export default function ContactPageClient() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const successMessageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSubmitted && successMessageRef.current) {
      successMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  }, [isSubmitted]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (formData.name.trim().length < 1) {
      alert('Please enter your name');
      setIsSubmitting(false);
      return;
    }

    if (formData.email.trim().length < 1 || !formData.email.includes('@')) {
      alert('Please enter a valid email address');
      setIsSubmitting(false);
      return;
    }

    if (formData.subject.trim().length < 1) {
      alert('Please enter a subject');
      setIsSubmitting(false);
      return;
    }

    if (formData.message.trim().length < 5) {
      alert('Please enter a message with at least 5 characters');
      setIsSubmitting(false);
      return;
    }

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
        setIsSubmitted(true);
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: '',
          type: 'general'
        });
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-grow">
          <div className="relative bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 py-20 overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="absolute inset-0 opacity-20">
              <div
                className="w-full h-full"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  backgroundRepeat: 'repeat'
                }}
              ></div>
            </div>

            <div className="relative container mx-auto px-6 text-center">
              <div ref={successMessageRef} className="max-w-2xl mx-auto">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce">
                  <Mail className="w-10 h-10 text-white" />
                </div>
                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                  Message Sent Successfully!
                </h1>
                <p className="text-xl text-green-100 mb-8 leading-relaxed">
                  Thank you for contacting LanguageGems. We've received your message and will get back to you within 24 hours.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mt-12 mb-8">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                    <div className="text-white font-semibold">Email Sent</div>
                    <div className="text-green-200 text-sm">To support@languagegems.com</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                    <Shield className="w-8 h-8 text-blue-300 mx-auto mb-2" />
                    <div className="text-white font-semibold">Saved Securely</div>
                    <div className="text-green-200 text-sm">In our database</div>
                  </div>
                </div>
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-200 transform hover:scale-105 shadow-lg"
                  >
                    <Globe className="w-5 h-5 mr-2" />
                    Return to Home
                  </Link>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                    }}
                    className="inline-flex items-center justify-center bg-white/20 backdrop-blur-sm text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/30 transition-all duration-200 transform hover:scale-105 border border-white/30"
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Send Another Message
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-grow">
        <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 py-20 overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute inset-0 opacity-20">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            ></div>
          </div>

          <div className="relative container mx-auto px-6 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full mb-8">
              <MessageCircle className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">Get in Touch</h1>
            <p className="text-xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Have questions about LanguageGems? We'd love to hear from you.
              Send us a message and we'll respond as soon as possible.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Zap className="w-8 h-8 text-yellow-300 mx-auto mb-2" />
                <div className="text-white font-semibold">Fast Response</div>
                <div className="text-blue-200 text-sm">Within 24 hours</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Shield className="w-8 h-8 text-green-300 mx-auto mb-2" />
                <div className="text-white font-semibold">Secure & Private</div>
                <div className="text-blue-200 text-sm">Your data is safe</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <Users className="w-8 h-8 text-purple-300 mx-auto mb-2" />
                <div className="text-white font-semibold">Expert Support</div>
                <div className="text-blue-200 text-sm">Dedicated team</div>
              </div>
            </div>
          </div>
        </div>

        <div className="py-16 bg-gradient-to-br from-gray-50 to-white relative">
          <div className="absolute inset-0 opacity-5">
            <div
              className="w-full h-full"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M20 20c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm10 0c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10z'/%3E%3C/g%3E%3C/svg%3E")`,
                backgroundRepeat: 'repeat'
              }}
            ></div>
          </div>
          <div className="relative container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">Send us a Message</h2>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Your full name"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="What's this about?"
                    />
                  </div>

                  <div>
                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Type
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="general">General Inquiry</option>
                      <option value="schools">Schools & Education</option>
                      <option value="support">Technical Support</option>
                      <option value="enterprise">Enterprise Solutions</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleInputChange}
                      required
                      rows={6}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] shadow-lg"
                  >
                    <div className="flex items-center justify-center">
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Sending...
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-2" />
                          Send Message
                        </>
                      )}
                    </div>
                  </button>
                </form>
              </div>

              <div className="space-y-8">
                <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-2xl p-8 border border-gray-100">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Get in Touch</h2>
                  </div>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Mail className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Email Us</h3>
                        <p className="text-gray-600">support@languagegems.com</p>
                        <p className="text-sm text-gray-500 mt-1">We typically respond within 24 hours</p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <Clock className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">Response Time</h3>
                        <p className="text-gray-600">Monday - Friday: Within 24 hours</p>
                        <p className="text-gray-600">Weekends: Within 48 hours</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Links</h3>
                  <div className="space-y-2">
                    <Link href="/help" className="block text-blue-600 hover:text-blue-800">
                      Help Center & FAQ
                    </Link>
                    <Link href="/pricing" className="block text-blue-600 hover:text-blue-800">
                      Pricing & Plans
                    </Link>
                    <Link href="/features" className="block text-blue-600 hover:text-blue-800">
                      Features Overview
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
