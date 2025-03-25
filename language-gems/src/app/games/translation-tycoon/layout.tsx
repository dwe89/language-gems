'use client';

import React from 'react';
import './translation-tycoon.css';

export default function TranslationTycoonLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-green-100">
      {children}
    </div>
  );
} 