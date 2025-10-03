'use client';

import { useState, useEffect } from 'react';
import { Mail, CheckCircle, AlertCircle, X } from 'lucide-react';

interface BlogSubscriptionModalProps {
  triggers?: ('exit-intent' | 'scroll' | 'manual')[];
  scrollPercentage?: number;
  delay?: number;
}

export default function BlogSubscriptionModal({
  triggers = ['exit-intent', 'scroll'],
  scrollPercentage = 50,
  delay = 500
}: BlogSubscriptionModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    console.log('🎯 [BLOG MODAL] Component mounted, triggers:', triggers);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const hasSubscribed = localStorage.getItem('blog_subscribed');
    const hasDismissed = localStorage.getItem('blog_modal_dismissed');

    if (hasSubscribed || hasDismissed || hasShown) {
      console.log('🎯 [BLOG MODAL] Modal blocked:', { hasSubscribed: !!hasSubscribed, hasDismissed: !!hasDismissed, hasShown });
      return;
    }

    const showModal = () => {
      if (!hasShown) {
        console.log('🎯 [BLOG MODAL] Showing modal after delay:', delay);
        setTimeout(() => {
          setIsOpen(true);
          setHasShown(true);
        }, delay);
      }
    };

    // Exit-intent trigger
    if (triggers.includes('exit-intent')) {
      console.log('🎯 [BLOG MODAL] Setting up exit-intent trigger');
      const handleMouseLeave = (e: MouseEvent) => {
        if (e.clientY <= 0) {
          console.log('🎯 [BLOG MODAL] Exit-intent detected!');
          showModal();
        }
      };
      document.addEventListener('mouseleave', handleMouseLeave);
    }

    // Scroll trigger
    if (triggers.includes('scroll')) {
      console.log('🎯 [BLOG MODAL] Setting up scroll trigger at', scrollPercentage, '%');
      const handleScroll = () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        if (scrolled >= scrollPercentage) {
          console.log('🎯 [BLOG MODAL] Scroll threshold reached:', scrolled.toFixed(1), '%');
          showModal();
        }
      };
      window.addEventListener('scroll', handleScroll);
    }

    return () => {
      document.removeEventListener('mouseleave', () => {});
      window.removeEventListener('scroll', () => {});
    };
  }, [isMounted, hasShown, triggers, scrollPercentage, delay]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');

    try {
      const response = await fetch('/api/blog/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('🎉 Success! Check your email to confirm your subscription.');
        setIsSuccess(true);
        localStorage.setItem('blog_subscribed', 'true');
        setTimeout(() => {
          setIsOpen(false);
        }, 3000);
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
        setIsSuccess(false);
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      setIsSuccess(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem('blog_modal_dismissed', 'true');
  };

  if (!isMounted || !isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="absolute inset-0" onClick={handleClose} />
      
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>

          <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
            Don't Miss Out!
          </h2>
          <p className="text-center text-gray-600 mb-6">
            Get expert language learning tips, GCSE exam strategies, and exclusive resources delivered to your inbox.
          </p>

          {message && (
            <div className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${isSuccess ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
              {isSuccess ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              )}
              <p className="text-sm">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                First Name (Optional)
              </label>
              <input
                type="text"
                id="firstName"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Your first name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Subscribing...' : 'Subscribe Now'}
            </button>
          </form>

          <p className="text-xs text-center text-gray-500 mt-4">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div>
    </div>
  );
}

