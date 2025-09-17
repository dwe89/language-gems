'use client';

import Link from 'next/link';
import { useAuth } from '@/components/auth/AuthContext';

export default function ViewProgressButton() {
  const { user } = useAuth();

  return (
    <Link 
      href={user ? "/profile" : "/login?redirect=/profile"} 
      className="view-progress-button-link"
    >
      <button className="flex items-center gap-2 px-4 py-2 bg-indigo-100 text-indigo-700 font-medium rounded-md hover:bg-indigo-200 transition-colors">
        <i className="fas fa-chart-line"></i> View Progress
      </button>
    </Link>
  );
} 