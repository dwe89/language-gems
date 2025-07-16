import React from 'react';
import { Search, BookOpen, Filter } from 'lucide-react';

interface NavTab {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
}

interface FreebiesNavTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
  className?: string;
}

const TABS: NavTab[] = [
  {
    id: 'hub',
    label: 'All Resources',
    description: 'Search and filter the complete library of resources by language, key stage, and resource type.',
    icon: <Search className="h-5 w-5" />
  },
  {
    id: 'curriculum',
    label: 'Browse by Topic',
    description: 'Explore resources by language, key stage, and topic.',
    icon: <BookOpen className="h-5 w-5" />
  },
  {
    id: 'skills',
    label: 'Skills Hub',
    description: 'Master core language skills with targeted resources.',
    icon: <Filter className="h-5 w-5" />
  }
];

export default function FreebiesNavTabs({ activeTab, onTabChange, className = "" }: FreebiesNavTabsProps) {
  return (
    <div className={`bg-white rounded-xl shadow-sm border border-slate-200 ${className}`}>
      <div className="flex flex-row">
        {TABS.map((tab, idx) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex-1 p-6 text-left transition-all duration-200 first:rounded-l-xl last:rounded-r-xl ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-indigo-50 to-purple-50 border-indigo-200 relative'
                : 'hover:bg-slate-50 border-transparent'
            }`}
            style={{ minWidth: 0 }}
          >
            {activeTab === tab.id && (
              <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-b-xl" />
            )}
            <div className="flex items-center mb-2">
              <div className={`p-2 rounded-lg mr-3 ${
                activeTab === tab.id 
                  ? 'bg-indigo-100 text-indigo-600' 
                  : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.icon}
              </div>
              <h3 className={`text-lg font-bold ${
                activeTab === tab.id ? 'text-indigo-900' : 'text-slate-800'
              }`}>
                {tab.label}
              </h3>
            </div>
            <p className={`text-sm ${
              activeTab === tab.id ? 'text-indigo-700' : 'text-slate-600'
            }`}>
              {tab.description}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
} 