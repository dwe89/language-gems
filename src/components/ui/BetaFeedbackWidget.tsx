'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, AlertTriangle, Bug, Loader2, Upload, Trash2, Star, Lightbulb, AlertCircle, CheckCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';
import { supabaseBrowser } from '../auth/AuthProvider';

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

export default function BetaFeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'bug' | 'feedback' | 'feature'>('feedback');
    const [rating, setRating] = useState(0);
    const pathname = usePathname();
    const { user } = useAuth();

    // Enhanced fields
    const [expectedResult, setExpectedResult] = useState('');
    const [actualResult, setActualResult] = useState('');
    const [stepsToReproduce, setStepsToReproduce] = useState(['']);
    const [screenshot, setScreenshot] = useState<File | null>(null);
    const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

    // Prevent hydration mismatch by engaging only on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    // Handle screenshot selection
    const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                alert('Please select an image file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                alert('Image must be less than 10MB');
                return;
            }
            
            setScreenshot(file);
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
        if (!message.trim()) return;

        setIsSending(true);

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

                const { data: { publicUrl } } = supabase.storage
                    .from('feedback-attachments')
                    .getPublicUrl(filePath);
                
                screenshotUrl = publicUrl;
            }

            // Capture browser and page context
            const browserInfo = getBrowserInfo();
            const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
            const userRole = user?.user_metadata?.role || user?.role || 'unknown';

            // Map type to category
            const categoryMap = {
                'bug': 'bug-report',
                'feature': 'feature-request',
                'feedback': 'general'
            };

            const response = await fetch('/api/beta/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    feedback: message.trim(),
                    source: pathname || 'general',
                    category: categoryMap[type],
                    rating: rating || undefined,
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
                setIsSent(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setIsSent(false);
                    setMessage('');
                    setType('feedback');
                    setRating(0);
                    setExpectedResult('');
                    setActualResult('');
                    setStepsToReproduce(['']);
                    removeScreenshot();
                }, 2000);
            } else {
                throw new Error('Failed to send');
            }
        } catch (error) {
            console.error('Feedback error:', error);
            alert('Failed to send feedback. Please try again.');
        } finally {
            setIsSending(false);
        }
    };

    if (!mounted) return null;

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 left-6 z-[100] bg-indigo-600 text-white px-4 py-3 rounded-full shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all flex items-center gap-2 group border border-indigo-400/30 font-sans"
            >
                <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span className="font-bold text-sm">Beta Feedback</span>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 left-6 z-[100] w-96 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 font-sans">
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4 flex justify-between items-center text-white">
                <h3 className="font-bold flex items-center gap-2">
                    <Bug className="w-4 h-4" />
                    Beta Feedback
                </h3>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-white/80 hover:text-white hover:bg-white/20 rounded-full p-1 transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            {isSent ? (
                <div className="p-8 text-center bg-indigo-50">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle className="w-6 h-6" />
                    </div>
                    <p className="text-gray-900 font-bold">Thank You!</p>
                    <p className="text-sm text-gray-500">Your feedback helps us build a better platform.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
                    {/* Type Selection */}
                    <div className="flex gap-2 p-1 bg-gray-100 rounded-lg">
                        {(['feedback', 'bug', 'feature'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => setType(t)}
                                className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-all ${type === t
                                        ? 'bg-white text-indigo-600 shadow-sm'
                                        : 'text-gray-500 hover:text-gray-700'
                                    }`}
                            >
                                {t === 'bug' ? 'Bug' : t === 'feature' ? 'Feature' : 'Feedback'}
                            </button>
                        ))}
                    </div>

                    {/* Bug Report Enhanced Fields */}
                    {type === 'bug' && (
                        <div className="space-y-3 p-3 bg-red-50 rounded-lg border border-red-100">
                            <div className="flex items-center gap-2 text-red-700 font-medium text-sm">
                                <Bug className="h-4 w-4" />
                                <span>Bug Report Details</span>
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    What did you expect?
                                </label>
                                <input
                                    type="text"
                                    value={expectedResult}
                                    onChange={(e) => setExpectedResult(e.target.value)}
                                    placeholder="e.g., Worksheet should display correctly"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
                                    What actually happened?
                                </label>
                                <input
                                    type="text"
                                    value={actualResult}
                                    onChange={(e) => setActualResult(e.target.value)}
                                    placeholder="e.g., Text is overlapping"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-medium text-gray-700 mb-1">
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
                                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
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
                                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    + Add step
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Screenshot Upload */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Attach screenshot (optional)
                        </label>
                        {!screenshot ? (
                            <label className="block cursor-pointer">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-indigo-400 hover:bg-indigo-50 transition-colors">
                                    <Upload className="h-6 w-6 text-gray-400 mx-auto mb-1" />
                                    <p className="text-xs text-gray-600">Click to upload</p>
                                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF (max 10MB)</p>
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
                                    className="w-full h-32 object-cover rounded-lg border border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={removeScreenshot}
                                    className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors shadow-lg"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Rating */}
                    <div>
                        <label className="block text-xs font-medium text-gray-700 mb-2">
                            Rate your experience (optional)
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

                    {/* Main Message */}
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you think or report a bug..."
                        className="w-full h-24 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
                        required
                        autoFocus
                    />

                    {/* Context Info */}
                    {user && (
                        <div className="text-xs text-gray-500 bg-gray-50 p-2 rounded">
                            <p>✓ Logged in as {user.email}</p>
                            <p>✓ Page context captured automatically</p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSending}
                        className="w-full bg-indigo-600 text-white py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                    >
                        {isSending ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                            <Send className="w-4 h-4" />
                        )}
                        Send Feedback
                    </button>
                </form>
            )}
        </div>
    );
}
