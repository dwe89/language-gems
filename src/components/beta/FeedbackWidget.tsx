'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Star,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Bug,
  Upload,
  Image as ImageIcon,
  Trash2,
  Loader2
} from 'lucide-react';
import { useFeatureFlags } from '../../lib/feature-flags';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

interface FeedbackWidgetProps {
  source?: string;
  category?: string;
  position?: 'bottom-right' | 'bottom-left' | 'inline';
  size?: 'small' | 'medium' | 'large';
}

// Helper function to get browser information
function getBrowserInfo() {
  if (typeof window === 'undefined') return {};
  
  return {
    userAgent: navigator.userAgent,
    language: navigator.language,
    platform: navigator.platform,
    viewport: {
      width: window.innerWidth,
      height: window.innerHeight
    },
    screen: {
      width: window.screen.width,
      height: window.screen.height
    },
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    timestamp: new Date().toISOString()
  };
}

export default function FeedbackWidget({ 
  source = 'general',
  category,
  position = 'bottom-right',
  size = 'medium'
}: FeedbackWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState(category || '');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  // Enhanced fields
  const [expectedResult, setExpectedResult] = useState('');
  const [actualResult, setActualResult] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState(['']);
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  const { isBetaLaunch } = useFeatureFlags();
  const { user } = useAuth();

  if (!isBetaLaunch) {
    return null;
  }

  const categories = [
    { id: 'feature-request', label: 'Feature Request', icon: Lightbulb, color: 'text-yellow-500' },
    { id: 'bug-report', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    { id: 'general', label: 'General Feedback', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'improvement', label: 'Improvement', icon: AlertCircle, color: 'text-orange-500' },
  ];

  // Handle screenshot selection
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Validate file size (10MB max)
      if (file.size > 10 * 1024 * 1024) {
        alert('Image must be less than 10MB');
        return;
      }
      
      setScreenshot(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshot(null);
    setScreenshotPreview(null);
    setUploadProgress(0);
  };

  const addStep = () => {
    setStepsToReproduce([...stepsToReproduce, '']);
  };

  const removeStep = (index: number) => {
    setStepsToReproduce(stepsToReproduce.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...stepsToReproduce];
    newSteps[index] = value;
    setStepsToReproduce(newSteps);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    
    try {
      let screenshotUrl = null;

      // Upload screenshot to Supabase Storage if provided
      if (screenshot) {
        const fileExt = screenshot.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
        const filePath = `${user?.id || 'anonymous'}/${fileName}`;

        const supabase = supabaseBrowser();
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('feedback-attachments')
          .upload(filePath, screenshot, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Screenshot upload error:', uploadError);
          throw new Error('Failed to upload screenshot');
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('feedback-attachments')
          .getPublicUrl(filePath);
        
        screenshotUrl = publicUrl;
        setUploadProgress(100);
      }

      // Capture browser and page context
      const browserInfo = getBrowserInfo();
      const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
      
      // Get user role from user metadata or profile
      const userRole = user?.user_metadata?.role || user?.role || 'unknown';

      const response = await fetch('/api/beta/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          feedback: feedback.trim(),
          source,
          category: selectedCategory,
          rating: rating || undefined,
          email: email || undefined,
          screenshot_url: screenshotUrl,
          browser_info: browserInfo,
          page_url: pageUrl,
          user_role: userRole,
          expected_result: expectedResult.trim() || undefined,
          actual_result: actualResult.trim() || undefined,
          steps_to_reproduce: stepsToReproduce.filter(s => s.trim()).length > 0 
            ? stepsToReproduce.filter(s => s.trim()) 
            : undefined,
        }),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setFeedback('');
        setRating(0);
        setEmail('');
        setExpectedResult('');
        setActualResult('');
        setStepsToReproduce(['']);
        removeScreenshot();
        
        // Auto-close after success
        setTimeout(() => {
          setIsOpen(false);
          setIsSubmitted(false);
        }, 3000);
      }
    } catch (error) {
      console.error('Feedback submission error:', error);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionClasses = {
    'bottom-right': 'fixed bottom-6 right-6 z-50',
    'bottom-left': 'fixed bottom-6 left-6 z-50',
    'inline': 'relative'
  };

  const sizeClasses = {
    small: 'w-80',
    medium: 'w-96',
    large: 'w-[32rem]'
  };

  if (position === 'inline') {
    return (
      <div className={`bg-white rounded-lg shadow-lg border ${sizeClasses[size]}`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <MessageSquare className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Share Your Feedback</h3>
              <p className="text-sm text-gray-600">Help us improve LanguageGems</p>
            </div>
          </div>
          
          <FeedbackForm
            feedback={feedback}
            setFeedback={setFeedback}
            rating={rating}
            setRating={setRating}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            email={email}
            setEmail={setEmail}
            expectedResult={expectedResult}
            setExpectedResult={setExpectedResult}
            actualResult={actualResult}
            setActualResult={setActualResult}
            stepsToReproduce={stepsToReproduce}
            updateStep={updateStep}
            addStep={addStep}
            removeStep={removeStep}
            screenshot={screenshot}
            screenshotPreview={screenshotPreview}
            handleScreenshotChange={handleScreenshotChange}
            removeScreenshot={removeScreenshot}
            categories={categories}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            user={user}
          />
        </div>
      </div>
    );
  }

  return (
    <div className={positionClasses[position]}>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
        >
          <MessageSquare className="h-6 w-6" />
        </button>
      )}

      {/* Feedback Panel */}
      {isOpen && (
        <div className={`bg-white rounded-lg shadow-2xl border ${sizeClasses[size]} animate-in slide-in-from-bottom duration-300`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Beta Feedback</h3>
                  <p className="text-sm text-gray-600">Help shape the future</p>
                </div>
              </div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-[70vh] overflow-y-auto">
            <FeedbackForm
              feedback={feedback}
              setFeedback={setFeedback}
              rating={rating}
              setRating={setRating}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              email={email}
              setEmail={setEmail}
              expectedResult={expectedResult}
              setExpectedResult={setExpectedResult}
              actualResult={actualResult}
              setActualResult={setActualResult}
              stepsToReproduce={stepsToReproduce}
              updateStep={updateStep}
              addStep={addStep}
              removeStep={removeStep}
              screenshot={screenshot}
              screenshotPreview={screenshotPreview}
              handleScreenshotChange={handleScreenshotChange}
              removeScreenshot={removeScreenshot}
              categories={categories}
              onSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              isSubmitted={isSubmitted}
              user={user}
            />
          </div>
        </div>
      )}
    </div>
  );
}

// Separate form component for reusability
function FeedbackForm({
  feedback,
  setFeedback,
  rating,
  setRating,
  selectedCategory,
  setSelectedCategory,
  email,
  setEmail,
  expectedResult,
  setExpectedResult,
  actualResult,
  setActualResult,
  stepsToReproduce,
  updateStep,
  addStep,
  removeStep,
  screenshot,
  screenshotPreview,
  handleScreenshotChange,
  removeScreenshot,
  categories,
  onSubmit,
  isSubmitting,
  isSubmitted,
  user
}: any) {
  const isBugReport = selectedCategory === 'bug-report';

  if (isSubmitted) {
    return (
      <div className="text-center py-6">
        <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
        <h3 className="font-semibold text-gray-900 mb-2">Thank you!</h3>
        <p className="text-gray-600 text-sm">Your feedback helps us build a better platform.</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Category Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          What type of feedback is this? *
        </label>
        <div className="grid grid-cols-2 gap-2">
          {categories.map((cat: any) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`p-3 rounded-lg border text-left transition-colors ${
                selectedCategory === cat.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <cat.icon className={`h-4 w-4 ${cat.color}`} />
                <span className="text-sm font-medium">{cat.label}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bug Report - Enhanced Fields */}
      {isBugReport && (
        <div className="space-y-3 p-3 bg-red-50 rounded-lg border border-red-100">
          <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
            <Bug className="h-4 w-4" />
            <span>Bug Report Details</span>
          </div>

          {/* Expected Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What did you expect to happen?
            </label>
            <input
              type="text"
              value={expectedResult}
              onChange={(e) => setExpectedResult(e.target.value)}
              placeholder="e.g., The worksheet should display correctly"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Actual Result */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              What actually happened?
            </label>
            <input
              type="text"
              value={actualResult}
              onChange={(e) => setActualResult(e.target.value)}
              placeholder="e.g., The text is overlapping and unreadable"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Steps to Reproduce */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Steps to reproduce (optional)
            </label>
            {stepsToReproduce.map((step: string, index: number) => (
              <div key={index} className="flex gap-2 mb-2">
                <span className="text-sm text-gray-500 mt-2">{index + 1}.</span>
                <input
                  type="text"
                  value={step}
                  onChange={(e) => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                />
                {stepsToReproduce.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeStep(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addStep}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Add step
            </button>
          </div>
        </div>
      )}

      {/* Screenshot Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Attach screenshot (optional)
        </label>
        {!screenshot ? (
          <label className="block cursor-pointer">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors">
              <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleScreenshotChange}
              className="hidden"
            />
          </label>
        ) : (
          <div className="relative">
            <img
              src={screenshotPreview || ''}
              alt="Screenshot preview"
              className="w-full h-48 object-cover rounded-lg border border-gray-200"
            />
            <button
              type="button"
              onClick={removeScreenshot}
              className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          How would you rate your experience? (optional)
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="p-1"
            >
              <Star
                className={`h-5 w-5 ${
                  star <= rating
                    ? 'text-yellow-400 fill-current'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      {/* Feedback Text */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Your feedback *
        </label>
        <textarea
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          placeholder="Tell us what you think, what you'd like to see improved, or any issues you've encountered..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
          required
        />
      </div>

      {/* Email (optional) - only show if not logged in */}
      {!user && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email (optional - for follow-up)
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your.email@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Context Info Display */}
      {user && (
        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
          <p>✓ Logged in as {user.email}</p>
          <p>✓ Page context will be automatically captured</p>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!feedback.trim() || isSubmitting}
        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            <Send className="h-4 w-4" />
            Send Feedback
          </>
        )}
      </button>
    </form>
  );
}
