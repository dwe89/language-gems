import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-3xl font-semibold text-white mb-6">Page Not Found</h2>
        <p className="text-lg text-indigo-100 mb-8">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          href="/student-dashboard"
          className="bg-white text-indigo-700 font-medium px-6 py-3 rounded-lg shadow-lg hover:bg-indigo-50 transition-colors"
        >
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
} 