'use client';

import { useState } from 'react';

interface Category {
  name: string;
  count: number;
  color: string;
}

interface BlogCategoryFilterProps {
  categories: Category[];
  totalPosts: number;
  onCategoryChange: (category: string) => void;
}

export default function BlogCategoryFilter({ categories, totalPosts, onCategoryChange }: BlogCategoryFilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const handleCategoryClick = (categoryName: string) => {
    setSelectedCategory(categoryName);
    onCategoryChange(categoryName);
  };

  return (
    <div className="flex flex-wrap justify-center gap-4 mb-12">
      {/* All Categories Button */}
      <button
        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer ${
          selectedCategory === 'All' 
            ? 'bg-blue-600 text-white shadow-lg' 
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
        onClick={() => handleCategoryClick('All')}
      >
        All ({totalPosts})
      </button>
      
      {categories.map((category, index) => (
        <button
          key={index}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 hover:shadow-md cursor-pointer ${
            selectedCategory === category.name
              ? 'shadow-lg ring-2 ring-blue-500 ring-opacity-50 ' + category.color
              : category.color
          }`}
          onClick={() => handleCategoryClick(category.name)}
        >
          {category.name} ({category.count})
        </button>
      ))}
    </div>
  );
}

