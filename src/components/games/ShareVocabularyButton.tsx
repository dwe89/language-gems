'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, Check, Copy, Link, X, ExternalLink, QrCode } from 'lucide-react';
import { createPortal } from 'react-dom';
import {
    generateShareableUrl,
    copyShareableLink,
    DecodedVocabulary,
    decodeVocabulary,
    getGameSlug
} from '../../utils/shareableVocabulary';

interface ShareVocabularyButtonProps {
    gameSlug: string;
    vocabulary: Array<{ term: string; translation: string }>;
    language?: string;
    contentType?: 'vocabulary' | 'sentences' | 'mixed';
    className?: string;
    variant?: 'button' | 'icon' | 'inline';
}

export default function ShareVocabularyButton({
    gameSlug,
    vocabulary,
    language,
    contentType = 'vocabulary',
    className = '',
    variant = 'button',
}: ShareVocabularyButtonProps) {
    const [isCopied, setIsCopied] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [shareUrl, setShareUrl] = useState('');

    const handleShare = async () => {
        // Convert game name to correct URL slug
        const correctSlug = getGameSlug(gameSlug);

        // Generate the shareable URL
        const url = generateShareableUrl(correctSlug, vocabulary, {
            language,
            contentType,
        });

        setShareUrl(url);

        // Try to copy directly
        const success = await copyShareableLink(correctSlug, vocabulary, {
            language,
            contentType,
            onSuccess: () => {
                setIsCopied(true);
                setTimeout(() => setIsCopied(false), 2000);
            },
        });

        if (!success) {
            // If direct copy failed, show modal with URL
            setShowModal(true);
        }
    };

    const handleCopyFromModal = async () => {
        try {
            await navigator.clipboard.writeText(shareUrl);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        } catch (error) {
            console.error('Failed to copy:', error);
        }
    };

    // Render button variants
    if (variant === 'icon') {
        return (
            <>
                <button
                    onClick={handleShare}
                    className={`p-2 rounded-lg transition-all hover:bg-white/10 ${className}`}
                    title="Share vocabulary link"
                >
                    {isCopied ? (
                        <Check className="h-5 w-5 text-green-400" />
                    ) : (
                        <Share2 className="h-5 w-5 text-white/70 hover:text-white" />
                    )}
                </button>
                {showModal && (
                    <ShareModal
                        url={shareUrl}
                        onClose={() => setShowModal(false)}
                        onCopy={handleCopyFromModal}
                        isCopied={isCopied}
                        vocabularyCount={vocabulary.length}
                    />
                )}
            </>
        );
    }

    if (variant === 'inline') {
        return (
            <>
                <button
                    onClick={handleShare}
                    className={`flex items-center space-x-2 text-sm text-white/70 hover:text-white transition-colors ${className}`}
                >
                    {isCopied ? (
                        <>
                            <Check className="h-4 w-4 text-green-400" />
                            <span className="text-green-400">Link copied!</span>
                        </>
                    ) : (
                        <>
                            <Share2 className="h-4 w-4" />
                            <span>Share this vocabulary</span>
                        </>
                    )}
                </button>
                {showModal && (
                    <ShareModal
                        url={shareUrl}
                        onClose={() => setShowModal(false)}
                        onCopy={handleCopyFromModal}
                        isCopied={isCopied}
                        vocabularyCount={vocabulary.length}
                    />
                )}
            </>
        );
    }

    // Default button variant
    return (
        <>
            <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium shadow-lg hover:shadow-xl transition-all ${className}`}
            >
                {isCopied ? (
                    <>
                        <Check className="h-5 w-5" />
                        <span>Link Copied!</span>
                    </>
                ) : (
                    <>
                        <Share2 className="h-5 w-5" />
                        <span>Share Vocabulary</span>
                    </>
                )}
            </motion.button>

            {showModal && (
                <ShareModal
                    url={shareUrl}
                    onClose={() => setShowModal(false)}
                    onCopy={handleCopyFromModal}
                    isCopied={isCopied}
                    vocabularyCount={vocabulary.length}
                />
            )}
        </>
    );
}

// Modal for sharing URL (fallback when clipboard fails)
function ShareModal({
    url,
    onClose,
    onCopy,
    isCopied,
    vocabularyCount,
}: {
    url: string;
    onClose: () => void;
    onCopy: () => void;
    isCopied: boolean;
    vocabularyCount: number;
}) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    return createPortal(
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Link className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-900">Share Your Vocabulary</h3>
                                <p className="text-sm text-gray-500">{vocabularyCount} items included</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <X className="h-5 w-5 text-gray-400" />
                        </button>
                    </div>

                    {/* URL display */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Shareable Link
                        </label>
                        <div className="flex items-center space-x-2">
                            <input
                                type="text"
                                value={url}
                                readOnly
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600 truncate"
                            />
                            <button
                                onClick={onCopy}
                                className={`px-4 py-3 rounded-lg font-medium transition-all ${isCopied
                                    ? 'bg-green-500 text-white'
                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                            >
                                {isCopied ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    <Copy className="h-5 w-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-semibold text-gray-700 mb-2">How it works</h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-0.5">1.</span>
                                <span>Share this link with students, friends, or colleagues</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-0.5">2.</span>
                                <span>When they open it, the vocabulary loads automatically</span>
                            </li>
                            <li className="flex items-start space-x-2">
                                <span className="text-blue-500 mt-0.5">3.</span>
                                <span>They can start practicing immediately!</span>
                            </li>
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                        >
                            Close
                        </button>
                        <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-2 px-4 py-2 text-blue-600 hover:text-blue-700 transition-colors"
                        >
                            <ExternalLink className="h-4 w-4" />
                            <span>Open in new tab</span>
                        </a>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>,
        document.body
    );
}

// Toast notification component for when vocabulary is loaded from a shared link
export function SharedVocabularyToast({
    vocabularyCount,
    onDismiss,
}: {
    vocabularyCount: number;
    onDismiss: () => void;
}) {
    useEffect(() => {
        const timer = setTimeout(onDismiss, 5000);
        return () => clearTimeout(timer);
    }, [onDismiss]);

    return (
        <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50"
        >
            <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full shadow-xl flex items-center space-x-3">
                <Check className="h-5 w-5" />
                <span className="font-medium">
                    Loaded {vocabularyCount} vocabulary items from shared link!
                </span>
                <button
                    onClick={onDismiss}
                    className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors"
                >
                    <X className="h-4 w-4" />
                </button>
            </div>
        </motion.div>
    );
}

// Hook to check for and load shared vocabulary from URL
export function useSharedVocabulary() {
    const [sharedVocabulary, setSharedVocabulary] = useState<DecodedVocabulary | null>(null);
    const [isFromSharedLink, setIsFromSharedLink] = useState(false);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const params = new URLSearchParams(window.location.search);
        const vocabParam = params.get('vocab');

        if (vocabParam) {
            const decoded = decodeVocabulary(vocabParam);
            if (decoded && decoded.items.length > 0) {
                setSharedVocabulary(decoded);
                setIsFromSharedLink(true);
            }
        }
    }, []);

    const clearSharedVocabulary = () => {
        setSharedVocabulary(null);
        setIsFromSharedLink(false);

        // Remove the vocab param from URL without page reload
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            url.searchParams.delete('vocab');
            window.history.replaceState({}, '', url.toString());
        }
    };

    return {
        sharedVocabulary,
        isFromSharedLink,
        clearSharedVocabulary,
    };
}
