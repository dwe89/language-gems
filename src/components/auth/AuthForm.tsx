'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from './AuthProvider';

// This is a placeholder for the actual authentication logic that would be implemented with Supabase
interface AuthFormProps {
  mode: 'login' | 'signup';
}

export default function AuthForm({ mode }: AuthFormProps) {
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');
  const [schoolCode, setSchoolCode] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStudentLogin, setIsStudentLogin] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      console.log(`Attempting to ${mode} with identifier: ${emailOrUsername}`);
      
      if (mode === 'login') {
        // Use the signIn method from auth context
        const { error: signInError } = await signIn(emailOrUsername, password);
        
        if (signInError) {
          throw new Error(signInError);
        }
        
        console.log('Login successful, navigating to account page');
        
        // Use router navigation instead of window.location
        router.push('/account');
      } else {
        // For signup - use the API route
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: emailOrUsername,
            password,
            name,
            role: 'student'
          }),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Signup failed');
        }
        
        console.log('Signup successful, navigating to account page');
        
        // Use router navigation instead of window.location
        router.push('/account');
      }
    } catch (err) {
      console.error('Authentication error:', err);
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Update teacher login function to use auth context
  const loginAsTeacher = async () => {
    setLoading(true);
    try {
      const { error: signInError } = await signIn('teacher@example.com', 'password123');
      
      if (signInError) {
        throw new Error(signInError);
      }
      
      console.log('Teacher login successful, navigating to account page');
      router.push('/account');
    } catch (err) {
      console.error('Teacher login error:', err);
      setError('Failed to login as teacher. Check if this account exists in Supabase.');
    } finally {
      setLoading(false);
    }
  };

  // Update student login function to use auth context
  const loginAsStudent = async () => {
    setLoading(true);
    try {
      const { error: signInError } = await signIn('student@example.com', 'password123');
      
      if (signInError) {
        throw new Error(signInError);
      }
      
      console.log('Student login successful, navigating to account page');
      router.push('/account');
    } catch (err) {
      console.error('Student login error:', err);
      setError('Failed to login as student. Check if this account exists in Supabase.');
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

        {mode === 'login' && (
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">
              Account Type
            </label>
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => setIsStudentLogin(false)}
                className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                  !isStudentLogin 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-indigo-800/50 text-gray-300 hover:bg-indigo-700/50'
                }`}
              >
                Teacher/Admin
              </button>
              <button
                type="button"
                onClick={() => setIsStudentLogin(true)}
                className={`flex-1 p-2 rounded-md text-sm transition-colors ${
                  isStudentLogin 
                    ? 'bg-cyan-600 text-white' 
                    : 'bg-indigo-800/50 text-gray-300 hover:bg-indigo-700/50'
                }`}
              >
                Student
              </button>
            </div>
          </div>
        )}

        <div>
          <label htmlFor="emailOrUsername" className="block text-sm font-medium text-gray-200 mb-1">
            {mode === 'login' ? (isStudentLogin ? 'Username' : 'Email Address') : 'Email Address'}
          </label>
          <input
            id="emailOrUsername"
            type={mode === 'signup' || !isStudentLogin ? 'email' : 'text'}
            value={emailOrUsername}
            onChange={(e) => setEmailOrUsername(e.target.value)}
            className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            placeholder={
              mode === 'signup' 
                ? "Enter your email" 
                : isStudentLogin 
                  ? "Enter your username (e.g., stevej)"
                  : "Enter your email address"
            }
            required
          />
          {mode === 'login' && isStudentLogin && (
            <p className="text-xs text-gray-400 mt-1">
              Use the username provided by your teacher
            </p>
          )}
        </div>

        {mode === 'login' && isStudentLogin && (
          <div>
            <label htmlFor="schoolCode" className="block text-sm font-medium text-gray-200 mb-1">
              School Code
            </label>
            <input
              id="schoolCode"
              type="text"
              value={schoolCode}
              onChange={(e) => setSchoolCode(e.target.value.toUpperCase())}
              className="w-full p-3 bg-indigo-800/50 border border-indigo-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
              placeholder="Enter your school code (e.g., CHS)"
              maxLength={10}
              required
            />
            <p className="text-xs text-gray-400 mt-1">
              Your teacher will provide this code for additional security
            </p>
          </div>
        )}

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

      {/* Test Accounts Section for Development */}
      <div className="mt-8 pt-6 border-t border-indigo-700">
        <p className="text-sm text-center text-gray-400 mb-4">Development Testing</p>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={loginAsTeacher}
            disabled={loading}
            className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md text-sm"
          >
            Test as Teacher
          </button>
          <button 
            onClick={loginAsStudent}
            disabled={loading}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm"
          >
            Test as Student
          </button>
        </div>
      </div>
    </div>
  );
} 