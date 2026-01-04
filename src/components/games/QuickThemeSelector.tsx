'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Palette, Gamepad2, Building2, Anchor, Rocket, Sun, X } from 'lucide-react';

interface Theme {
    id: string;
    name: string;
    icon: string;
    accentColor: string;
}

const THEME_OPTIONS: Theme[] = [
    { id: 'default', name: 'Classic', icon: 'classic', accentColor: 'bg-blue-500' },
    { id: 'tokyo', name: 'Tokyo Nights', icon: 'tokyo', accentColor: 'bg-pink-600' },
    { id: 'pirate', name: 'Pirate Adventure', icon: 'pirate', accentColor: 'bg-amber-600' },
    { id: 'space', name: 'Space Explorer', icon: 'space', accentColor: 'bg-purple-600' },
    { id: 'temple', name: 'Lava Temple', icon: 'temple', accentColor: 'bg-orange-600' }
];

const getThemeIcon = (iconName: string) => {
    switch (iconName) {
        case 'classic': return <Gamepad2 className="h-5 w-5" />;
        case 'tokyo': return <Building2 className="h-5 w-5" />;
        case 'pirate': return <Anchor className="h-5 w-5" />;
        case 'space': return <Rocket className="h-5 w-5" />;
        case 'temple': return <Sun className="h-5 w-5" />;
        default: return null;
    }
};

interface QuickThemeSelectorProps {
    currentTheme: string;
    onThemeChange: (themeId: string) => void;
    variant?: 'button' | 'inline';
    className?: string; // Container class
    customButtonClass?: string; // Override default button styles
}

export default function QuickThemeSelector({
    currentTheme,
    onThemeChange,
    variant = 'button',
    className = '',
    customButtonClass
}: QuickThemeSelectorProps) {
    const [isOpen, setIsOpen] = useState(false);

    const currentThemeData = THEME_OPTIONS.find(t => t.id === currentTheme) || THEME_OPTIONS[0];

    if (variant === 'inline') {
        // Inline variant - shows all themes in a row
        return (
            <div className={`flex items-center gap-2 ${className}`}>
                <Palette className="h-4 w-4 text-gray-500" />
                <div className="flex gap-1">
                    {THEME_OPTIONS.map((theme) => (
                        <button
                            key={theme.id}
                            onClick={() => onThemeChange(theme.id)}
                            title={theme.name}
                            className={`
                                p-2 rounded-lg transition-all duration-200
                                ${currentTheme === theme.id
                                    ? `${theme.accentColor} text-white shadow-lg scale-110`
                                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                                }
                            `}
                        >
                            {getThemeIcon(theme.icon)}
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    // Button variant - shows a button that opens a dropdown
    return (
        <div className={`relative ${className}`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={customButtonClass || `
                    flex items-center gap-2 px-3 py-2 rounded-xl
                    transition-all duration-200 font-medium text-sm
                    ${currentThemeData.accentColor} text-white
                    hover:opacity-90 shadow-md hover:shadow-lg
                `}
            >
                <Palette className="h-4 w-4" />
                <span className="hidden sm:inline">{currentThemeData.name}</span>
                {getThemeIcon(currentThemeData.icon)}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown */}
                        <motion.div
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-0 mt-2 z-50 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden min-w-[200px]"
                        >
                            <div className="p-2 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Palette className="h-4 w-4 text-indigo-500" />
                                    Choose Theme
                                </span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-1 hover:bg-gray-200 rounded-lg transition-colors"
                                >
                                    <X className="h-4 w-4 text-gray-500" />
                                </button>
                            </div>
                            <div className="p-2 space-y-1">
                                {THEME_OPTIONS.map((theme) => (
                                    <button
                                        key={theme.id}
                                        onClick={() => {
                                            onThemeChange(theme.id);
                                            setIsOpen(false);
                                        }}
                                        className={`
                                            w-full flex items-center gap-3 px-3 py-2.5 rounded-lg
                                            transition-all duration-200 text-left
                                            ${currentTheme === theme.id
                                                ? `${theme.accentColor} text-white`
                                                : 'hover:bg-gray-100 text-gray-700'
                                            }
                                        `}
                                    >
                                        <div className={`p-1.5 rounded-lg ${currentTheme === theme.id ? 'bg-white/20' : 'bg-gray-100'}`}>
                                            {getThemeIcon(theme.icon)}
                                        </div>
                                        <span className="font-medium">{theme.name}</span>
                                        {currentTheme === theme.id && (
                                            <div className="ml-auto w-2 h-2 rounded-full bg-white" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
