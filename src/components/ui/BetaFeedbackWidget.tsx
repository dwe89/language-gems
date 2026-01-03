'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, X, Send, AlertTriangle, Bug, Loader2 } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function BetaFeedbackWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSending, setIsSending] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState('');
    const [type, setType] = useState<'bug' | 'feedback' | 'feature'>('feedback');
    const pathname = usePathname();

    // Prevent hydration mismatch by engaging only on client
    const [mounted, setMounted] = useState(false);
    useEffect(() => setMounted(true), []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setIsSending(true);

        try {
            // Reusing the existing contact API endpoint
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contactType: 'beta_feedback',
                    name: 'Beta User',
                    email: 'anonymous@beta.user', // Or grab from auth context if available
                    subject: `[Beta Feedback] ${type.toUpperCase()} - ${pathname}`,
                    message: `Type: ${type}\nPage: ${pathname}\n\nMessage:\n${message}`,
                    website: '' // Honeypot
                }),
            });

            if (response.ok) {
                setIsSent(true);
                setTimeout(() => {
                    setIsOpen(false);
                    setIsSent(false);
                    setMessage('');
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
        <div className="fixed bottom-6 left-6 z-[100] w-80 bg-white rounded-2xl shadow-2xl border border-indigo-100 overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-200 font-sans">
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
                        <Send className="w-6 h-6" />
                    </div>
                    <p className="text-gray-900 font-bold">Thank You!</p>
                    <p className="text-sm text-gray-500">Your feedback helps us build a better platform.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
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
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Tell us what you think or report a bug..."
                        className="w-full h-32 p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none bg-gray-50 focus:bg-white transition-colors"
                        required
                        autoFocus
                    />

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
