'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

interface HelpCategory {
  icon: any;
  title: string;
  description: string;
  articles: string[];
  slug: string;
}

interface HelpCategoriesProps {
  categories: HelpCategory[];
}

export default function HelpCategories({ categories }: HelpCategoriesProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
      {categories.map((category, index) => (
        <motion.div
          key={category.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
              <category.icon className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">{category.title}</h3>
              <p className="text-gray-600">{category.description}</p>
            </div>
          </div>
          <ul className="space-y-2">
            {category.articles.map((article, articleIndex) => (
              <li key={articleIndex}>
                <Link
                  href={`/help/${category.slug}/${article.toLowerCase().replace(/\s+/g, '-')}`}
                  className="text-gray-600 hover:text-blue-600 hover:underline transition-colors"
                >
                  {article}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`/help/${category.slug}`}
            className="inline-flex items-center mt-4 text-blue-600 hover:text-blue-700 font-medium"
          >
            View all articles
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </motion.div>
      ))}
    </div>
  );
}

