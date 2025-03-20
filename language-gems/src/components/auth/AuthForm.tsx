'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// This is a placeholder for the actual authentication logic that would be implemented with Supabase
interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // This is where we would call Supabase auth methods
      // For now, we'll just simulate a successful login/signup
      console.log('Form submitted', { email, password, name });
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (mode === 'login') {
        // Placeholder for login logic
        // const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        // if (error) throw error;
      } else {
        // Placeholder for signup logic
        // const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { name } } });
        // if (error) throw error;
      }

      // Redirect after successful auth
      router.push('/dashboard');
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-6 rounded-lg bg-indigo-900/30 backdrop-blur-sm">
      <h2 className="text-2xl font-bold mb-6 text-white text-center">
        {mode === 'login' ? 'Log In to Your Account' : 'Create an Account'}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-1">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your full name"
              required
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-1">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder={mode === 'signup' ? 'Create a password' : 'Enter your password'}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full gem-button ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {mode === 'login' ? 'Logging in...' : 'Signing up...'}
            </span>
          ) : (
            <>{mode === 'login' ? 'Log In' : 'Sign Up'}</>
          )}
        </button>
      </form>

      <div className="mt-6 text-center text-gray-300">
        {mode === 'login' ? (
          <>
            Don't have an account?{' '}
            <Link href="/auth/signup" className="text-cyan-300 hover:underline">
              Sign up
            </Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/auth/login" className="text-cyan-300 hover:underline">
              Log in
            </Link>
          </>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-indigo-700">
        <p className="text-sm text-center text-gray-400 mb-4">Or continue with</p>
        <div className="flex justify-center space-x-4">
          <button className="flex items-center justify-center p-3 bg-white rounded-md hover:bg-gray-100 transition-colors">
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          </button>
          <button className="flex items-center justify-center p-3 bg-[#1877F2] rounded-md hover:bg-[#166FE5] transition-colors">
            <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path
                d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 