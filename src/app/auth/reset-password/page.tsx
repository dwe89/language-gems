'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { Eye, EyeOff, Lock, Check } from 'lucide-react';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);

  useEffect(() => {
    // Check if we have a valid recovery token
    const checkRecoveryToken = async () => {
      try {
        const { data: { session }, error } = await supabaseBrowser.auth.getSession();
        
        if (error || !session) {
          setError('Invalid or expired reset link. Please request a new password reset.');
          setValidating(false);
          return;
        }
        
        setValidating(false);
      } catch (err) {
        console.error('Error checking recovery token:', err);
        setError('An error occurred. Please try again.');
        setValidating(false);
      }
    };

    checkRecoveryToken();
  }, []);

  const validatePassword = (pass: string): string | null => {
    if (pass.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (!/[A-Z]/.test(pass)) {
      return 'Password must contain at least one uppercase letter';
    }
    if (!/[a-z]/.test(pass)) {
      return 'Password must contain at least one lowercase letter';
    }
    if (!/[0-9]/.test(pass)) {
      return 'Password must contain at least one number';
    }
    return null;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Validate password
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { error: updateError } = await supabaseBrowser.auth.updateUser({
        password: password
      });

      if (updateError) {
        throw updateError;
      }

      setSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        router.push('/auth/login-teacher?reset=success');
      }, 3000);

    } catch (err: any) {
      console.error('Password reset error:', err);
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = (pass: string) => {
    let strength = 0;
    if (pass.length >= 8) strength++;
    if (/[A-Z]/.test(pass)) strength++;
    if (/[a-z]/.test(pass)) strength++;
    if (/[0-9]/.test(pass)) strength++;
    if (/[^A-Za-z0-9]/.test(pass)) strength++;
    return strength;
  };

  const getStrengthLabel = (strength: number) => {
    if (strength <= 1) return { label: 'Weak', color: 'bg-red-500' };
    if (strength <= 3) return { label: 'Fair', color: 'bg-yellow-500' };
    if (strength <= 4) return { label: 'Good', color: 'bg-blue-500' };
    return { label: 'Strong', color: 'bg-green-500' };
  };

  const strength = passwordStrength(password);
  const strengthInfo = getStrengthLabel(strength);

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Validating reset link...</p>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Password Reset Successful!</h2>
          <p className="text-slate-600 mb-6">
            Your password has been updated successfully. You will be redirected to the login page...
          </p>
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-indigo-100 rounded-full mb-4">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Reset Your Password</h1>
            <p className="text-slate-600">
              Enter your new password below
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleResetPassword} className="space-y-6">
            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-slate-600">Password strength:</span>
                    <span className={`text-xs font-medium ${strengthInfo.color.replace('bg-', 'text-')}`}>
                      {strengthInfo.label}
                    </span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${strengthInfo.color}`}
                      style={{ width: `${(strength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              
              {confirmPassword && (
                <p className={`mt-1 text-xs ${password === confirmPassword ? 'text-green-600' : 'text-red-600'}`}>
                  {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                </p>
              )}
            </div>

            {/* Password Requirements */}
            <div className="bg-slate-50 rounded-lg p-4">
              <p className="text-xs font-medium text-slate-700 mb-2">Password requirements:</p>
              <ul className="space-y-1 text-xs text-slate-600">
                <li className={password.length >= 8 ? 'text-green-600' : ''}>
                  {password.length >= 8 ? '✓' : '○'} At least 8 characters
                </li>
                <li className={/[A-Z]/.test(password) ? 'text-green-600' : ''}>
                  {/[A-Z]/.test(password) ? '✓' : '○'} One uppercase letter
                </li>
                <li className={/[a-z]/.test(password) ? 'text-green-600' : ''}>
                  {/[a-z]/.test(password) ? '✓' : '○'} One lowercase letter
                </li>
                <li className={/[0-9]/.test(password) ? 'text-green-600' : ''}>
                  {/[0-9]/.test(password) ? '✓' : '○'} One number
                </li>
              </ul>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !password || !confirmPassword || password !== confirmPassword}
              className="w-full py-3 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Reset Password
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/auth/login-teacher"
              className="text-sm text-indigo-600 hover:text-indigo-700"
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
