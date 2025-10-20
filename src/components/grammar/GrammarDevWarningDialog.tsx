"use client";

import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogClose } from '../ui/dialog';
import { Info } from 'lucide-react';

export default function GrammarDevWarningDialog() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const seen = localStorage.getItem('grammar-dev-warning-seen');
      if (!seen) setOpen(true);
    } catch (e) {
      // ignore localStorage errors in SSR contexts
    }
  }, []);

  const dismiss = () => {
    try {
      localStorage.setItem('grammar-dev-warning-seen', 'true');
    } catch (e) {}
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-xl bg-slate-900/95 border-0 p-6 sm:p-8">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-amber-600/10">
              <Info className="h-7 w-7 text-amber-400" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-white">Grammar - Work in Progress</h3>
              <p className="mt-2 text-sm text-gray-300 max-w-xl">Not all grammar topics have been created and some features may not work as expected. Thanks for your patience as we build this section.</p>
            </div>
          </div>
          <div>
            <DialogClose className="text-gray-400 hover:text-gray-200">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
            </DialogClose>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 rounded-xl border border-amber-200 p-5">
          <div className="flex items-start space-x-4">
            <Info className="h-6 w-6 text-amber-700 mt-1" />
            <div className="text-amber-900">
              <p className="font-semibold text-lg mb-2">What to expect:</p>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Some grammar topics may be missing or incomplete</li>
                <li>Navigation to certain grammar pages might fail</li>
                <li>Content and UX may change without notice</li>
                <li>We're actively building and improving this section</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={dismiss}
            className="flex-1 rounded-lg border-2 border-slate-800 bg-transparent text-white py-3 px-4 text-center hover:border-white transition"
          >
            I Understand
          </button>
          <button
            onClick={dismiss}
            className="flex-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 text-center shadow-md"
          >
            Continue to Grammar
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}