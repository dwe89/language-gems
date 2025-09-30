'use client';

import { useState } from 'react';
import { Search } from 'lucide-react';

export default function HelpSearchBar() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="relative max-w-2xl mx-auto">
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Search for help articles..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-4 py-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
      />
    </div>
  );
}

