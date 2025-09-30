'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface QuickAction {
  icon: any;
  title: string;
  description: string;
  action: string;
  href: string;
}

interface HelpQuickActionsProps {
  actions: QuickAction[];
}

export default function HelpQuickActions({ actions }: HelpQuickActionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
      {actions.map((action, index) => (
        <motion.div
          key={action.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link
            href={action.href}
            className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all group"
          >
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <action.icon className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">{action.title}</h3>
            </div>
            <p className="text-gray-600 mb-4">{action.description}</p>
            <div className="flex items-center text-blue-600 group-hover:text-blue-700">
              <span className="text-sm font-medium">{action.action}</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

